"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Globe, SearchX } from "lucide-react";
import { useEditorStore } from "@/store/editorStore";
import { PageRenderer } from "@/builder/renderer/PageRenderer";
import { Button } from "@/components/ui/button";

export default function ViewPage() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug || "";
  const { project, currentLocale, setLocale } = useEditorStore();
  const [status, setStatus] = useState<"loading" | "ready" | "notfound">("loading");

  useEffect(() => {
    let alive = true;
    (async () => {
      await useEditorStore.getState().hydrateFromIndexedDb();
      if (!alive) return;
      const current = useEditorStore.getState().project;
      setStatus(current.pages.some((p) => p.slug === slug) ? "ready" : "notfound");
    })();
    return () => {
      alive = false;
    };
  }, [slug]);

  const page = project.pages.find((p) => p.slug === slug);

  return (
    <div className="min-h-screen bg-[#07070c] text-slate-100 font-sans">
      <header className="sticky top-0 z-50 flex h-12 items-center justify-between border-b border-cyan-500/20 bg-black/80 px-4 backdrop-blur-md font-mono text-xs">
        <div className="flex items-center gap-3">
          <Link href="/editor/demo">
            <Button size="sm" variant="outline" className="h-7 border-slate-800 text-slate-300 hover:text-cyan-300">
              <ArrowLeft className="h-3.5 w-3.5 mr-1" /> EDITOR
            </Button>
          </Link>
          <span className="text-slate-400">
            LIVE_ROUTE: <strong className="text-cyan-300">/{slug}</strong>
          </span>
        </div>

        <div className="flex items-center gap-1">
          <Globe className="h-3.5 w-3.5 text-slate-500" />
          {project.locales.map((loc) => (
            <button
              key={loc}
              onClick={() => setLocale(loc)}
              className={`px-1.5 py-0.5 rounded uppercase text-[10px] font-bold ${
                currentLocale === loc
                  ? "bg-fuchsia-950 border border-fuchsia-500/40 text-fuchsia-300"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {loc}
            </button>
          ))}
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {status === "loading" && (
          <div className="py-24 text-center font-mono text-xs text-slate-500 animate-pulse">
            HYDRATING_PROJECT_FROM_INDEXEDDB...
          </div>
        )}

        {status === "notfound" && (
          <div className="py-24 text-center font-mono text-xs text-slate-500">
            <SearchX className="h-8 w-8 mx-auto mb-3 text-slate-700" />
            PAGE_NOT_FOUND // /{slug}
          </div>
        )}

        {status === "ready" && page && (
          <PageRenderer page={page} locale={currentLocale} breakpoint="desktop" mode="preview" />
        )}
      </main>
    </div>
  );
}
