"use client";

import React, { useState } from "react";
import { ArticleBlock } from "@/types/post";
import { Plus, Trash2, ChevronUp, ChevronDown, Eye, Pencil, Type } from "lucide-react";

const BLOCK_TYPES: Array<{ type: ArticleBlock["type"]; label: string }> = [
  { type: "paragraph", label: "PARAGRAPH" },
  { type: "heading", label: "HEADING" },
  { type: "image", label: "IMAGE" },
  { type: "quote", label: "QUOTE" },
  { type: "list", label: "LIST" },
  { type: "code", label: "CODE" },
];

function createArticleBlock(type: ArticleBlock["type"]): ArticleBlock {
  const id = `ab_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  const base = { id, type };

  switch (type) {
    case "heading":
      return { ...base, content: { text: "Новый заголовок", level: "h2" } };
    case "image":
      return { ...base, content: { src: "", alt: "" } };
    case "quote":
      return { ...base, content: { text: "Цитата...", author: "" } };
    case "list":
      return { ...base, content: { items: ["Пункт 1", "Пункт 2"] } };
    case "code":
      return { ...base, content: { code: "", language: "typescript" } };
    default:
      return { ...base, content: { text: "" } };
  }
}

const inputClass =
  "w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500/60";
const textareaClass =
  "w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500/60 resize-y";

function BlockFields({
  block,
  onPatch,
}: {
  block: ArticleBlock;
  onPatch: (patch: Record<string, unknown>) => void;
}) {
  const asString = (value: unknown): string => (typeof value === "string" ? value : "");

  switch (block.type) {
    case "heading":
      return (
        <div className="flex items-center gap-2">
          <select
            value={asString(block.content.level) || "h2"}
            onChange={(e) => onPatch({ level: e.target.value })}
            className={`${inputClass} w-20 font-mono`}
          >
            <option value="h2">H2</option>
            <option value="h3">H3</option>
            <option value="h4">H4</option>
          </select>
          <input
            type="text"
            value={asString(block.content.text)}
            onChange={(e) => onPatch({ text: e.target.value })}
            placeholder="Heading text..."
            className={inputClass}
          />
        </div>
      );

    case "image":
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <input
            type="text"
            value={asString(block.content.src)}
            onChange={(e) => onPatch({ src: e.target.value })}
            placeholder="https://.../image.jpg"
            className={`${inputClass} font-mono`}
          />
          <input
            type="text"
            value={asString(block.content.alt)}
            onChange={(e) => onPatch({ alt: e.target.value })}
            placeholder="Alt text..."
            className={inputClass}
          />
        </div>
      );

    case "quote":
      return (
        <div className="space-y-2">
          <textarea
            rows={3}
            value={asString(block.content.text)}
            onChange={(e) => onPatch({ text: e.target.value })}
            placeholder="Quote text..."
            className={textareaClass}
          />
          <input
            type="text"
            value={asString(block.content.author)}
            onChange={(e) => onPatch({ author: e.target.value })}
            placeholder="Author (optional)..."
            className={inputClass}
          />
        </div>
      );

    case "list": {
      const items = Array.isArray(block.content.items) ? (block.content.items as unknown[]) : [];
      return (
        <textarea
          rows={Math.max(3, items.length + 1)}
          value={items.map((item) => String(item)).join("\n")}
          onChange={(e) => onPatch({ items: e.target.value.split("\n") })}
          placeholder={"One item per line..."}
          className={textareaClass}
        />
      );
    }

    case "code":
      return (
        <div className="space-y-2">
          <input
            type="text"
            value={asString(block.content.language) || "typescript"}
            onChange={(e) => onPatch({ language: e.target.value })}
            placeholder="Language..."
            className={`${inputClass} w-40 font-mono`}
          />
          <textarea
            rows={6}
            value={asString(block.content.code)}
            onChange={(e) => onPatch({ code: e.target.value })}
            placeholder="// code..."
            className={`${textareaClass} font-mono text-[11px]`}
          />
        </div>
      );

    default:
      return (
        <textarea
          rows={4}
          value={asString(block.content.text)}
          onChange={(e) => onPatch({ text: e.target.value })}
          placeholder="Paragraph text..."
          className={textareaClass}
        />
      );
  }
}

function PreviewBlock({ block }: { block: ArticleBlock }) {
  const str = (value: unknown): string => (typeof value === "string" ? value : "");

  switch (block.type) {
    case "heading": {
      const level = str(block.content.level) || "h2";
      const text = str(block.content.text);
      if (level === "h3") return <h3 className="text-xl font-bold text-slate-100 mt-6">{text}</h3>;
      if (level === "h4") return <h4 className="text-lg font-bold text-slate-200 mt-5">{text}</h4>;
      return <h2 className="text-2xl font-bold text-slate-100 mt-8">{text}</h2>;
    }
    case "image": {
      const src = str(block.content.src);
      if (!src)
        return (
          <div className="my-4 flex h-40 items-center justify-center rounded border border-dashed border-slate-700 text-xs font-mono text-slate-600">
            NO_IMAGE_URL
          </div>
        );
      // eslint-disable-next-line @next/next/no-img-element
      return <img src={src} alt={str(block.content.alt)} className="my-4 max-h-80 w-full rounded object-cover" />;
    }
    case "quote":
      return (
        <blockquote className="my-4 border-l-2 border-cyan-500 pl-4 italic text-slate-300">
          {str(block.content.text)}
          {str(block.content.author) && (
            <footer className="mt-1 text-xs font-mono not-italic text-slate-500">— {str(block.content.author)}</footer>
          )}
        </blockquote>
      );
    case "list": {
      const items = Array.isArray(block.content.items) ? (block.content.items as unknown[]) : [];
      return (
        <ul className="my-4 list-disc space-y-1 pl-6 text-slate-300">
          {items.map((item, i) => (
            <li key={i}>{String(item)}</li>
          ))}
        </ul>
      );
    }
    case "code":
      return (
        <pre className="my-4 overflow-x-auto rounded border border-slate-800 bg-black p-4 text-[11px] font-mono text-cyan-300">
          {str(block.content.code)}
        </pre>
      );
    default:
      return <p className="my-3 leading-relaxed text-slate-300">{str(block.content.text)}</p>;
  }
}

interface ArticleEditorProps {
  blocks: ArticleBlock[];
  onChange: (blocks: ArticleBlock[]) => void;
}

export function ArticleEditor({ blocks, onChange }: ArticleEditorProps) {
  const [isPreview, setIsPreview] = useState(false);

  const addBlock = (type: ArticleBlock["type"]) => {
    onChange([...blocks, createArticleBlock(type)]);
  };

  const patchBlock = (index: number, patch: Record<string, unknown>) => {
    onChange(
      blocks.map((block, i) =>
        i === index ? { ...block, content: { ...block.content, ...patch } } : block
      )
    );
  };

  const removeBlock = (index: number) => {
    onChange(blocks.filter((_, i) => i !== index));
  };

  const moveBlock = (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= blocks.length) return;
    const next = [...blocks];
    const [moved] = next.splice(index, 1);
    next.splice(target, 0, moved);
    onChange(next);
  };

  if (isPreview) {
    return (
      <div className="rounded-lg border border-slate-800 bg-black/60">
        <div className="flex items-center justify-between border-b border-slate-800 px-3 py-2">
          <span className="text-[10px] font-mono text-fuchsia-400">ARTICLE_PREVIEW ({blocks.length})</span>
          <button
            onClick={() => setIsPreview(false)}
            className="flex items-center gap-1 text-[10px] font-mono text-slate-400 hover:text-cyan-300"
          >
            <Pencil className="h-3 w-3" /> BACK_TO_EDIT
          </button>
        </div>
        <div className="max-h-96 overflow-y-auto p-4">
          {blocks.length === 0 && (
            <p className="text-xs font-mono text-slate-600">NO_BLOCKS_YET</p>
          )}
          {blocks.map((block) => (
            <PreviewBlock key={block.id} block={block} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-slate-800 bg-black/60 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 px-3 py-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <Type className="h-3.5 w-3.5 text-cyan-400" />
          <span className="text-[10px] font-mono text-cyan-300">ADD_BLOCK</span>
          {BLOCK_TYPES.map((def) => (
            <button
              key={def.type}
              onClick={() => addBlock(def.type)}
              className="flex items-center gap-1 rounded border border-slate-800 bg-slate-950 px-2 py-1 text-[10px] font-mono text-slate-400 hover:border-cyan-500/60 hover:text-cyan-300 transition-colors"
            >
              <Plus className="h-2.5 w-2.5" /> {def.label}
            </button>
          ))}
        </div>
        <button
          onClick={() => setIsPreview(true)}
          disabled={blocks.length === 0}
          className="flex items-center gap-1 rounded border border-fuchsia-500/40 bg-fuchsia-950/40 px-2 py-1 text-[10px] font-mono text-fuchsia-300 hover:bg-fuchsia-900/40 disabled:opacity-40 transition-colors"
        >
          <Eye className="h-3 w-3" /> PREVIEW
        </button>
      </div>

      <div className="space-y-3 p-3">
        {blocks.length === 0 && (
          <p className="py-4 text-center text-xs font-mono text-slate-600">
            EMPTY_ARTICLE // ADD BLOCKS ABOVE
          </p>
        )}

        {blocks.map((block, index) => (
          <div key={block.id} className="rounded border border-slate-800 bg-slate-950/70">
            <div className="flex items-center justify-between border-b border-slate-800 px-2.5 py-1.5">
              <span className="text-[10px] font-mono text-slate-500">
                {index + 1}. {block.type.toUpperCase()}
              </span>
              <div className="flex items-center gap-0.5">
                <button
                  onClick={() => moveBlock(index, -1)}
                  disabled={index === 0}
                  className="p-1 text-slate-500 hover:text-cyan-300 disabled:opacity-30"
                  title="Move up"
                >
                  <ChevronUp className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => moveBlock(index, 1)}
                  disabled={index === blocks.length - 1}
                  className="p-1 text-slate-500 hover:text-cyan-300 disabled:opacity-30"
                  title="Move down"
                >
                  <ChevronDown className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => removeBlock(index)}
                  className="p-1 text-slate-500 hover:text-red-400"
                  title="Delete block"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
            <div className="p-2.5">
              <BlockFields block={block} onPatch={(patch) => patchBlock(index, patch)} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
