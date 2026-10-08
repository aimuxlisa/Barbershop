"use client";

import React, { useState } from "react";
import { Sliders, Type, Trash2, Copy, Box, Palette, Search, ShieldCheck } from "lucide-react";
import { useEditorStore } from "@/store/editorStore";
import { blockRegistry } from "@/builder/registry/blockRegistry";
import { LinkControl } from "@/components/controls/LinkControl";
import { SliderControl } from "@/components/controls/SliderControl";
import { SpacingControl } from "@/components/controls/SpacingControl";
import { ImageControl } from "@/components/controls/ImageControl";
import { SpacingValue, LinkConfig } from "@/types/project";
import { resolveResponsiveValue } from "@/builder/renderer/styleResolver";

export function Inspector() {
  const [activeTab, setActiveTab] = useState<"content" | "spacing" | "seo">("content");

  const {
    project,
    selectedPageId,
    selectedBlockId,
    currentLocale,
    currentBreakpoint,
    updateBlockContent,
    updateBlockStyle,
    updatePageSEO,
    duplicateBlock,
    removeBlock,
  } = useEditorStore();

  const currentPage = project.pages.find((p) => p.id === selectedPageId) || project.pages[0];
  const selectedBlock = currentPage?.blocks.find((b) => b.id === selectedBlockId);

  return (
    <div className="flex h-full flex-col font-sans select-none">
      {/* Header */}
      <div className="p-3 border-b border-fuchsia-500/20 bg-black/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-fuchsia-300">
            <Sliders className="h-4 w-4" />
            <span>INSPECTOR</span>
          </div>
          {selectedBlock && (
            <div className="flex items-center gap-1">
              <button
                onClick={() => duplicateBlock(selectedBlock.id)}
                className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-cyan-300"
                title="Duplicate Block"
              >
                <Copy className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => removeBlock(selectedBlock.id)}
                className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-red-400"
                title="Delete Block"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>
        <p className="mt-1 text-[11px] text-slate-400 font-mono">
          {selectedBlock ? (
            <>
              {blockRegistry.get(selectedBlock.type)?.label || selectedBlock.type}{" "}
              <span className="text-slate-600">({selectedBlock.id})</span>
            </>
          ) : (
            <>PAGE_SETTINGS: {currentPage?.title}</>
          )}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 text-[11px] font-mono text-slate-400">
        <button
          onClick={() => setActiveTab("content")}
          className={`flex-1 py-2 text-center transition-colors ${
            activeTab === "content"
              ? "text-fuchsia-300 border-b-2 border-fuchsia-500 bg-fuchsia-950/10"
              : "hover:text-slate-200"
          }`}
        >
          Content ({currentLocale.toUpperCase()})
        </button>
        <button
          onClick={() => setActiveTab("spacing")}
          className={`flex-1 py-2 text-center transition-colors ${
            activeTab === "spacing"
              ? "text-cyan-300 border-b-2 border-cyan-500 bg-cyan-950/10"
              : "hover:text-slate-200"
          }`}
        >
          Spacing
        </button>
        <button
          onClick={() => setActiveTab("seo")}
          className={`flex-1 py-2 text-center transition-colors ${
            activeTab === "seo"
              ? "text-emerald-300 border-b-2 border-emerald-500 bg-emerald-950/10"
              : "hover:text-slate-200"
          }`}
        >
          SEO
        </button>
      </div>

      {/* Tab Panels */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4 text-xs">
        {/* SEO Panel */}
        {activeTab === "seo" && (
          <div className="space-y-3">
            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1">
                SEO Meta Title ({currentLocale.toUpperCase()})
              </label>
              <input
                type="text"
                value={currentPage?.seo?.title?.[currentLocale] || ""}
                onChange={(e) => {
                  const updatedTitle = {
                    ...(currentPage?.seo?.title || {}),
                    [currentLocale]: e.target.value,
                  };
                  updatePageSEO(currentPage.id, { title: updatedTitle });
                }}
                placeholder="Page Title for Google..."
                className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500/50"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1">
                Meta Description ({currentLocale.toUpperCase()})
              </label>
              <textarea
                rows={3}
                value={currentPage?.seo?.description?.[currentLocale] || ""}
                onChange={(e) => {
                  const updatedDesc = {
                    ...(currentPage?.seo?.description || {}),
                    [currentLocale]: e.target.value,
                  };
                  updatePageSEO(currentPage.id, { description: updatedDesc });
                }}
                placeholder="Brief summary for search engines..."
                className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500/50 resize-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1">Canonical URL</label>
              <input
                type="text"
                value={currentPage?.seo?.canonical || ""}
                onChange={(e) => updatePageSEO(currentPage.id, { canonical: e.target.value })}
                placeholder="https://mysite.com/page"
                className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500/50 font-mono"
              />
            </div>

            <div className="border-t border-slate-800 pt-3 space-y-3">
              <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400">
                Open Graph
              </span>

              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">
                  OG Title ({currentLocale.toUpperCase()})
                </label>
                <input
                  type="text"
                  value={currentPage?.seo?.ogTitle?.[currentLocale] || ""}
                  onChange={(e) =>
                    updatePageSEO(currentPage.id, {
                      ogTitle: { ...(currentPage?.seo?.ogTitle || {}), [currentLocale]: e.target.value },
                    })
                  }
                  placeholder="Share title..."
                  className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500/50"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">
                  OG Description ({currentLocale.toUpperCase()})
                </label>
                <textarea
                  rows={3}
                  value={currentPage?.seo?.ogDescription?.[currentLocale] || ""}
                  onChange={(e) =>
                    updatePageSEO(currentPage.id, {
                      ogDescription: {
                        ...(currentPage?.seo?.ogDescription || {}),
                        [currentLocale]: e.target.value,
                      },
                    })
                  }
                  placeholder="Share description..."
                  className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500/50 resize-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">OG Image URL</label>
                <input
                  type="text"
                  value={currentPage?.seo?.ogImage || ""}
                  onChange={(e) => updatePageSEO(currentPage.id, { ogImage: e.target.value })}
                  placeholder="https://mysite.com/og.jpg"
                  className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500/50 font-mono"
                />
              </div>

              <label className="flex items-center justify-between gap-2 p-2 rounded border border-slate-800 bg-slate-950/60 cursor-pointer">
                <span className="text-xs text-slate-300">No Index (hide from search)</span>
                <input
                  type="checkbox"
                  checked={Boolean(currentPage?.seo?.noIndex)}
                  onChange={(e) => updatePageSEO(currentPage.id, { noIndex: e.target.checked })}
                  className="h-3.5 w-3.5 accent-emerald-500"
                />
              </label>
            </div>
          </div>
        )}

        {/* Content & Spacing Panels when a Block is Selected */}
        {activeTab !== "seo" && !selectedBlock && (
          <div className="py-12 text-center text-slate-500 font-mono text-xs">
            <Box className="h-6 w-6 mx-auto mb-2 text-slate-700" />
            SELECT_A_BLOCK_IN_CANVAS
          </div>
        )}

        {activeTab === "content" && selectedBlock && (
          <>
            {selectedBlock.content?.title !== undefined && (
              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">Heading Title</label>
                <input
                  type="text"
                  value={
                    typeof selectedBlock.content.title === "object"
                      ? (selectedBlock.content.title as any)?.[currentLocale] || ""
                      : (selectedBlock.content?.title as string) || ""
                  }
                  onChange={(e) => {
                    const current = (selectedBlock.content.title as any) || {};
                    const updated =
                      typeof current === "object"
                        ? { ...current, [currentLocale]: e.target.value }
                        : e.target.value;
                    updateBlockContent(selectedBlock.id, "title", updated);
                  }}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-fuchsia-500/50"
                />
              </div>
            )}

            {selectedBlock.content?.description !== undefined && (
              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={
                    typeof selectedBlock.content.description === "object"
                      ? (selectedBlock.content.description as any)?.[currentLocale] || ""
                      : (selectedBlock.content?.description as string) || ""
                  }
                  onChange={(e) => {
                    const current = (selectedBlock.content.description as any) || {};
                    const updated =
                      typeof current === "object"
                        ? { ...current, [currentLocale]: e.target.value }
                        : e.target.value;
                    updateBlockContent(selectedBlock.id, "description", updated);
                  }}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-fuchsia-500/50 resize-none"
                />
              </div>
            )}

            <div>
              <LinkControl
                label="Button Target (LinkControl)"
                value={(selectedBlock.content.primaryButtonLink as LinkConfig) || { type: "url", url: "#" }}
                pages={project.pages.map((p) => ({ id: p.id, title: p.title, slug: p.slug }))}
                onChange={(newLink) => updateBlockContent(selectedBlock.id, "primaryButtonLink", newLink)}
              />
            </div>

            {(selectedBlock.content?.image !== undefined ||
              ["hero", "text_image"].includes(selectedBlock.type)) && (
              <ImageControl
                label="Block Image (Media Vault)"
                value={(selectedBlock.content.image as string) || ""}
                onChange={(url) => updateBlockContent(selectedBlock.id, "image", url)}
              />
            )}

            {selectedBlock.content?.actionUrl !== undefined && (
              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">
                  Form Action URL (Formspree / Netlify)
                </label>
                <input
                  type="text"
                  value={(selectedBlock.content.actionUrl as string) || ""}
                  onChange={(e) => updateBlockContent(selectedBlock.id, "actionUrl", e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500/50 font-mono"
                />
              </div>
            )}
          </>
        )}

        {activeTab === "spacing" && selectedBlock && (
          <div className="space-y-4">
            <div className="p-2 rounded border border-cyan-500/20 bg-cyan-950/20 text-[10px] font-mono text-cyan-300">
              DESKTOP-FIRST CASCADE: editing for <strong className="uppercase">{currentBreakpoint}</strong>
            </div>

            <SpacingControl
              label="Padding (px)"
              value={resolveResponsiveValue(
                selectedBlock.styles?.spacing?.padding,
                currentBreakpoint,
                { top: 40, right: 24, bottom: 40, left: 24 }
              )}
              onChange={(newPadding) => {
                const existing = selectedBlock.styles?.spacing?.padding || {};
                const updated = {
                  ...existing,
                  [currentBreakpoint]: newPadding,
                };
                const spacingObj = {
                  ...(selectedBlock.styles?.spacing || {}),
                  padding: updated,
                };
                updateBlockStyle(selectedBlock.id, "spacing", spacingObj);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
