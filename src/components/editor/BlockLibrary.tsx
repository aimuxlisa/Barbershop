"use client";

import React, { useState } from "react";
import { 
  FileText, 
  Plus, 
  Trash2, 
  Globe, 
  Search, 
  Layers, 
  Box, 
  Settings2,
  ExternalLink,
  Pencil
} from "lucide-react";
import { blockRegistry } from "@/builder/registry/blockRegistry";
import { templates } from "@/builder/templates/pageTemplates";
import { useEditorStore } from "@/store/editorStore";
import { Button } from "@/components/ui/button";

export function BlockLibrary() {
  const [activeTab, setActiveTab] = useState<"blocks" | "pages">("blocks");
  const [search, setSearch] = useState("");
  const [newPageTitle, setNewPageTitle] = useState("");
  const [newPageSlug, setNewPageSlug] = useState("");
  const [newPageTemplate, setNewPageTemplate] = useState("");
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameTitle, setRenameTitle] = useState("");
  const [renameSlug, setRenameSlug] = useState("");

  const {
    project,
    selectedPageId,
    selectPage,
    addPage,
    deletePage,
    renamePage,
    addBlock,
  } = useEditorStore();

  const blocks = blockRegistry.getAll();
  const filteredBlocks = blocks.filter(
    (b) =>
      b.label.toLowerCase().includes(search.toLowerCase()) ||
      b.category.toLowerCase().includes(search.toLowerCase()) ||
      b.description.toLowerCase().includes(search.toLowerCase())
  );

  const categories = Array.from(new Set(blocks.map((b) => b.category)));

  const handleCreatePage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPageTitle.trim() || !newPageSlug.trim()) return;
    addPage(newPageTitle.trim(), newPageSlug.trim().toLowerCase(), newPageTemplate || undefined);
    setNewPageTitle("");
    setNewPageSlug("");
    setNewPageTemplate("");
  };

  const startRename = (id: string, title: string, slug: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setRenamingId(id);
    setRenameTitle(title);
    setRenameSlug(slug);
  };

  const commitRename = () => {
    if (!renamingId) return;
    if (renameTitle.trim() && renameSlug.trim()) {
      renamePage(renamingId, renameTitle.trim(), renameSlug.trim().toLowerCase());
    }
    setRenamingId(null);
  };

  return (
    <div className="flex h-full flex-col font-sans select-none">
      {/* Top Nav Switcher: Blocks vs Pages */}
      <div className="flex border-b border-cyan-500/20 bg-black/50 text-[11px] font-mono">
        <button
          onClick={() => setActiveTab("blocks")}
          className={`flex-1 py-2.5 flex items-center justify-center gap-1.5 transition-colors ${
            activeTab === "blocks"
              ? "text-cyan-300 border-b-2 border-cyan-500 bg-cyan-950/20 font-bold"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Layers className="h-3.5 w-3.5" /> BLOCKS
        </button>
        <button
          onClick={() => setActiveTab("pages")}
          className={`flex-1 py-2.5 flex items-center justify-center gap-1.5 transition-colors ${
            activeTab === "pages"
              ? "text-fuchsia-300 border-b-2 border-fuchsia-500 bg-fuchsia-950/20 font-bold"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <FileText className="h-3.5 w-3.5" /> PAGES ({project.pages.length})
        </button>
      </div>

      {/* Blocks Tab Content */}
      {activeTab === "blocks" && (
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="p-3 border-b border-slate-800 bg-black/40">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search blocks..."
                className="w-full bg-slate-900/80 border border-slate-800 rounded px-2.5 pl-8 py-1 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/60"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-4">
            {categories.map((cat) => {
              const catBlocks = filteredBlocks.filter((b) => b.category === cat);
              if (catBlocks.length === 0) return null;

              return (
                <div key={cat} className="space-y-2">
                  <span className="text-[10px] font-mono uppercase text-slate-500 tracking-wider">
                    {cat} ({catBlocks.length})
                  </span>
                  <div className="space-y-2">
                    {catBlocks.map((block) => (
                      <div
                        key={block.type}
                        onClick={() => addBlock(block.type)}
                        className="group p-2.5 rounded border border-slate-800 bg-slate-950/60 hover:border-cyan-500/50 hover:bg-cyan-950/30 transition-all cursor-pointer shadow-sm"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Box className="h-3.5 w-3.5 text-cyan-400" />
                            <span className="text-xs font-semibold text-slate-200 group-hover:text-cyan-300">
                              {block.label}
                            </span>
                          </div>
                          <span className="flex h-5 w-5 items-center justify-center rounded bg-slate-800 text-slate-400 group-hover:bg-cyan-500 group-hover:text-black transition-colors">
                            <Plus className="h-3 w-3" />
                          </span>
                        </div>
                        <p className="mt-1 text-[11px] text-slate-500 group-hover:text-slate-400 line-clamp-1">
                          {block.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Pages Tab Content */}
      {activeTab === "pages" && (
        <div className="flex-1 flex flex-col overflow-hidden p-3 space-y-4">
          <div className="space-y-2">
            <span className="text-[10px] font-mono uppercase text-slate-500 tracking-wider">
              Project Pages
            </span>
            <div className="space-y-1.5 max-h-60 overflow-y-auto">
              {project.pages.map((p) =>
                renamingId === p.id ? (
                  <div
                    key={p.id}
                    className="p-2 rounded border border-fuchsia-500/60 bg-fuchsia-950/30 space-y-1.5"
                  >
                    <input
                      autoFocus
                      type="text"
                      value={renameTitle}
                      onChange={(e) => setRenameTitle(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") commitRename();
                        if (e.key === "Escape") setRenamingId(null);
                      }}
                      placeholder="Page title"
                      className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-slate-200 focus:outline-none focus:border-fuchsia-500"
                    />
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-mono text-slate-500">/</span>
                      <input
                        type="text"
                        value={renameSlug}
                        onChange={(e) => setRenameSlug(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") commitRename();
                          if (e.key === "Escape") setRenamingId(null);
                        }}
                        placeholder="slug"
                        className="flex-1 bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-slate-200 font-mono focus:outline-none focus:border-fuchsia-500"
                      />
                    </div>
                    <div className="flex justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => setRenamingId(null)}
                        className="px-2 py-1 rounded text-[10px] font-mono text-slate-400 hover:text-slate-200 border border-slate-800"
                      >
                        CANCEL
                      </button>
                      <button
                        type="button"
                        onClick={commitRename}
                        className="px-2 py-1 rounded text-[10px] font-mono text-black bg-fuchsia-500 hover:bg-fuchsia-400 font-semibold"
                      >
                        SAVE
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    key={p.id}
                    onClick={() => selectPage(p.id)}
                    className={`flex items-center justify-between p-2 rounded border cursor-pointer transition-all ${
                      selectedPageId === p.id
                        ? "border-fuchsia-500/60 bg-fuchsia-950/40 text-fuchsia-300"
                        : "border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="h-3.5 w-3.5" />
                      <span className="text-xs font-medium">{p.title}</span>
                      <span className="text-[10px] font-mono text-slate-500">/{p.slug}</span>
                    </div>
                    <div className="flex items-center">
                      <button
                        onClick={(e) => startRename(p.id, p.title, p.slug, e)}
                        className="p-1 hover:text-fuchsia-400 text-slate-500"
                        title="Rename Page"
                      >
                        <Pencil className="h-3 w-3" />
                      </button>
                      {project.pages.length > 1 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deletePage(p.id);
                          }}
                          className="p-1 hover:text-red-400 text-slate-500"
                          title="Delete Page"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Add Page Form */}
          <form onSubmit={handleCreatePage} className="p-3 rounded-lg border border-slate-800 bg-black/60 space-y-2">
            <span className="text-[11px] font-mono text-cyan-300 font-semibold block">Create New Page</span>
            <input
              type="text"
              placeholder="Page title (e.g. Services)"
              value={newPageTitle}
              onChange={(e) => setNewPageTitle(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            />
            <input
              type="text"
              placeholder="Slug (e.g. services)"
              value={newPageSlug}
              onChange={(e) => setNewPageSlug(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
            />
            <select
              value={newPageTemplate}
              onChange={(e) => setNewPageTemplate(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="">Template: Blank (Hero only)</option>
              {templates.map((tpl) => (
                <option key={tpl.id} value={tpl.id}>
                  Template: {tpl.name} — {tpl.category}
                </option>
              ))}
            </select>
            <Button size="sm" type="submit" className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs h-7">
              <Plus className="h-3 w-3 mr-1" /> Add Page
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}
