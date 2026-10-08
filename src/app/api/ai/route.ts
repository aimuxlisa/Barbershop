import { NextRequest, NextResponse } from "next/server";
import { aiPageSchema, aiRequestSchema } from "@/lib/aiSchema";

export const runtime = "nodejs";
export const maxDuration = 30;

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 10;
const MAX_COMPLETION_TOKENS = 1500;

const buckets = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const bucket = buckets.get(ip);

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    if (buckets.size > 500) {
      buckets.forEach((value, key) => {
        if (value.resetAt <= now) buckets.delete(key);
      });
    }
    return false;
  }

  if (bucket.count >= RATE_LIMIT_MAX) return true;
  bucket.count += 1;
  return false;
}

function stripCodeFences(raw: string): string {
  const trimmed = raw.trim();
  const fenced = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/);
  return fenced ? fenced[1] : trimmed;
}

const SYSTEM_PROMPT = `You are a visual website builder page generator.
Return STRICT JSON only, no prose, no markdown fences.
Schema: {"blocks":[{"type":"<one of allowed types>","variant":"<optional variant id>","content":{...}}]}
Rules:
- Only use block types from the allowed list provided by the user.
- Localized text fields must be objects with "ru", "en" and "uz" string values.
- Order blocks logically: header first, footer last.
- Maximum 15 blocks.`;

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "RATE_LIMITED", message: "Too many AI requests. Try again in a minute." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "INVALID_JSON" }, { status: 400 });
  }

  const parsed = aiRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "INVALID_REQUEST", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const { prompt, allowedBlockTypes } = parsed.data;
  const apiKey = process.env.AI_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "AI_NOT_CONFIGURED", message: "Set AI_API_KEY server env variable." },
      { status: 503 }
    );
  }

  const apiUrl = process.env.AI_API_URL || "https://api.openai.com/v1/chat/completions";
  const model = process.env.AI_MODEL || "gpt-4o-mini";

  try {
    const upstream = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        temperature: 0.4,
        max_tokens: MAX_COMPLETION_TOKENS,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          {
            role: "user",
            content: `Allowed block types: ${allowedBlockTypes.join(", ")}\n\nPage prompt: ${prompt}`,
          },
        ],
      }),
      signal: AbortSignal.timeout(25_000),
    });

    if (!upstream.ok) {
      const detail = await upstream.text().catch(() => "");
      return NextResponse.json(
        { error: "UPSTREAM_ERROR", status: upstream.status, detail: detail.slice(0, 300) },
        { status: 502 }
      );
    }

    const data = await upstream.json();
    const raw: string = data?.choices?.[0]?.message?.content ?? "";

    let json: unknown;
    try {
      json = JSON.parse(stripCodeFences(raw));
    } catch {
      return NextResponse.json({ error: "INVALID_AI_OUTPUT" }, { status: 502 });
    }

    const validated = aiPageSchema.safeParse(json);
    if (!validated.success) {
      return NextResponse.json({ error: "SCHEMA_MISMATCH" }, { status: 502 });
    }

    const allowed = new Set(allowedBlockTypes);
    const blocks = validated.data.blocks.filter((block) => allowed.has(block.type)).slice(0, 30);

    if (blocks.length === 0) {
      return NextResponse.json({ error: "NO_VALID_BLOCKS" }, { status: 502 });
    }

    return NextResponse.json({ blocks });
  } catch {
    return NextResponse.json({ error: "AI_REQUEST_FAILED" }, { status: 502 });
  }
}
