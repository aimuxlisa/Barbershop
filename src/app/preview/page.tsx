"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Monitor, Tablet, Smartphone, Globe, ArrowLeft } from "lucide-react";
import { useEditorStore } from "@/store/editorStore";
import { useProjectPersistence } from "@/store/useProjectPersistence";
import { PageRenderer } from "@/builder/renderer/PageRenderer";
import { Breakpoint } from "@/types/project";
import { Button } from "@/components/ui/button";

export default function PreviewPage() {
  useProjectPersistence();
  const { project, selectedPageId } = useEditorStore();
  const [breakpoint, setBreakpoint] = useState<Breakpoint>("desktop");
  const [locale, setLocale] = useState<string>(project.defaultLocale || "ru");

  const currentPage = project.pages.find((p) => p.id === selectedPageId) || project.pages[0];

  const viewportWidthClass =
    breakpoint === "mobile"
      ? "max-w-[390px]"
      : breakpoint === "tablet"
      ? "max-w-[768px]"
      : "max-w-[1200px]";

  return (
    <div className="min-h-screen bg-[#07070c] text-slate-100 flex flex-col">
      {/* Top Preview Control Bar */}
      <header className="sticky top-0 z-50 flex h-12 items-center justify-between border-b border-cyan-500/20 bg-black/80 px-4 backdrop-blur-md font-mono text-xs">
        <div className="flex items-center gap-3">
          <Link href="/editor/demo">
            <Button size="sm" variant="outline" className="h-7 border-slate-800 text-slate-300 hover:text-cyan-300">
              <ArrowLeft className="h-3.5 w-3.5 mr-1" /> BACK TO EDITOR
            </Button>
          </Link>
          <span className="text-slate-600">/</span>
          <span className="text-slate-400">
            PREVIEW: <strong className="text-slate-200">{currentPage?.title}</strong>
          </span>
        </div>

        {/* Breakpoints */}
        <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded p-0.5">
          <button
            onClick={() => setBreakpoint("desktop")}
            className={`p-1.5 rounded ${breakpoint === "desktop" ? "bg-cyan-950 text-cyan-300" : "text-slate-400"}`}
            title="Desktop"
          >
            <Monitor className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => setBreakpoint("tablet")}
            className={`p-1.5 rounded ${breakpoint === "tablet" ? "bg-cyan-950 text-cyan-300" : "text-slate-400"}`}
            title="Tablet"
          >
            <Tablet className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => setBreakpoint("mobile")}
            className={`p-1.5 rounded ${breakpoint === "mobile" ? "bg-cyan-950 text-cyan-300" : "text-slate-400"}`}
            title="Mobile"
          >
            <Smartphone className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Locale switch */}
        <div className="flex items-center gap-1">
          <Globe className="h-3.5 w-3.5 text-slate-500" />
          {project.locales.map((loc) => (
            <button
              key={loc}
              onClick={() => setLocale(loc)}
              className={`px-1.5 py-0.5 rounded uppercase text-[10px] font-bold ${
                locale === loc ? "bg-fuchsia-950 text-fuchsia-300 border border-fuchsia-500/40" : "text-slate-400"
              }`}
            >
              {loc}
            </button>
          ))}
        </div>
      </header>

      {/* Main Viewport Stage */}
      <main className="flex-1 flex justify-center p-4 sm:p-8 overflow-y-auto">
        <div className={`w-full ${viewportWidthClass} transition-all duration-300 min-h-screen bg-black/40 rounded-xl border border-slate-800 shadow-2xl p-4 sm:p-8`}>
          <PageRenderer
            page={currentPage}
            locale={locale}
            breakpoint={breakpoint}
            mode="preview"
          />
        </div>
      </main>
    </div>
  );
}
