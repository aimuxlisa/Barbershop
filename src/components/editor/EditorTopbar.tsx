"use client";

import React, { useRef, useEffect, useState } from "react";
import Link from "next/link";
import {
  Cpu,
  Monitor,
  Tablet,
  Smartphone,
  Download,
  Upload,
  Undo2,
  Redo2,
  CheckCircle2,
  ArrowLeft,
  Globe,
  Eye,
  Archive,
  Sparkles,
  HardDrive,
  Code,
  Palette,
  BookOpen,
  Gauge,
  Keyboard,
  Menu as MenuIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEditorStore } from "@/store/editorStore";
import { Breakpoint } from "@/types/project";
import { backupService } from "@/services/backupService";
import { exportService } from "@/services/exportService";
import { MediaManagerModal } from "./MediaManagerModal";
import { AIGeneratorModal } from "./AIGeneratorModal";
import { CodeExportModal } from "./CodeExportModal";
import { ThemeCustomizerModal } from "./ThemeCustomizerModal";
import { SeoAuditorModal } from "./SeoAuditorModal";
import { ShortcutsHelpModal } from "./ShortcutsHelpModal";
import { MenuManagerModal } from "./MenuManagerModal";

export function EditorTopbar() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isMediaOpen, setIsMediaOpen] = useState(false);
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [isCodeOpen, setIsCodeOpen] = useState(false);
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const [isSeoOpen, setIsSeoOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [rawHtmlCode, setRawHtmlCode] = useState("");

  const {
    project,
    selectedPageId,
    selectedBlockId,
    currentBreakpoint,
    currentLocale,
    saveStatus,
    past,
    future,
    undo,
    redo,
    setBreakpoint,
    setLocale,
    setProject,
    updateBlockContent,
  } = useEditorStore();

  const currentPage = project.pages.find((p) => p.id === selectedPageId) || project.pages[0];

  // Keyboard Shortcuts Ctrl+Z / Ctrl+Shift+Z / Cmd+Z
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "z") {
        if (e.shiftKey) {
          e.preventDefault();
          redo();
        } else {
          e.preventDefault();
          undo();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key === "y") {
        e.preventDefault();
        redo();
      } else if ((e.ctrlKey || e.metaKey) && e.key === "/") {
        e.preventDefault();
        setIsShortcutsOpen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [undo, redo]);

  const breakpoints: Array<{ id: Breakpoint; icon: React.ReactNode; label: string }> = [
    { id: "desktop", icon: <Monitor className="h-3.5 w-3.5" />, label: "Desktop" },
    { id: "tablet", icon: <Tablet className="h-3.5 w-3.5" />, label: "Tablet" },
    { id: "mobile", icon: <Smartphone className="h-3.5 w-3.5" />, label: "Mobile" },
  ];

  const locales = project.locales || ["ru", "en", "uz"];

  const handleExportBackup = () => {
    backupService.downloadBackupFile(project);
  };

  const handleDownloadStaticZip = () => {
    exportService.downloadExportZip(project, currentLocale);
  };

  const handleInspectHtml = async () => {
    const html = await exportService.renderPageHtml(currentPage, project, currentLocale);
    setRawHtmlCode(html);
    setIsCodeOpen(true);
  };

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const imported = await backupService.importProjectFromJson(text);
      setProject(imported);
      alert(`Project "${imported.name}" successfully imported and restored from backup!`);
    } catch (err: any) {
      alert(`Import failed: ${err.message}`);
    }
  };

  return (
    <>
      <div className="flex h-full items-center justify-between px-4 font-mono select-none">
        {/* Brand & Project info */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <div className="flex h-7 w-7 items-center justify-center rounded border border-cyan-400/40 bg-cyan-950/40 text-cyan-400">
              <Cpu className="h-4 w-4" />
            </div>
            <span className="font-bold text-xs tracking-wider hidden sm:inline">KMS::CMS</span>
          </Link>
          <span className="text-slate-600">/</span>
          <div className="text-xs text-slate-300 font-sans font-medium flex items-center gap-2">
            <span>{project.name}</span>
          </div>
        </div>

        {/* Breakpoint Switcher (Desktop-First) */}
        <div className="flex items-center gap-1 rounded-md border border-slate-800 bg-black/60 p-0.5">
          {breakpoints.map((bp) => {
            const isActive = currentBreakpoint === bp.id;
            return (
              <button
                key={bp.id}
                onClick={() => setBreakpoint(bp.id)}
                className={`flex h-7 px-2.5 items-center gap-1.5 rounded text-xs transition-all ${
                  isActive
                    ? "bg-cyan-950/80 text-cyan-300 border border-cyan-500/50 shadow-[0_0_10px_rgba(0,240,255,0.2)]"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                }`}
                title={`${bp.label} (Desktop-First)`}
              >
                {bp.icon}
                <span className="hidden md:inline text-[11px]">{bp.label}</span>
              </button>
            );
          })}
        </div>

        {/* Actions Toolbar */}
        <div className="flex items-center gap-2">
          {/* AI Generator Button */}
          <Button
            size="sm"
            onClick={() => setIsAIOpen(true)}
            className="h-7 px-2 text-xs bg-fuchsia-950/60 border border-fuchsia-500/50 text-fuchsia-300 hover:bg-fuchsia-900/60 font-mono"
            title="AI Page Synthesizer"
          >
            <Sparkles className="h-3 w-3 mr-1 text-fuchsia-400" /> AI
          </Button>

          {/* Theme Switcher Button */}
          <Button
            size="sm"
            onClick={() => setIsThemeOpen(true)}
            className="h-7 px-2 text-xs bg-purple-950/60 border border-purple-500/40 text-purple-300 hover:bg-purple-900/60 font-mono"
            title="Global Theme & Design Tokens"
          >
            <Palette className="h-3 w-3 mr-1 text-purple-400" /> THEME
          </Button>

          {/* SEO Auditor Button */}
          <Button
            size="sm"
            onClick={() => setIsSeoOpen(true)}
            className="h-7 px-2 text-xs bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/60 font-mono"
            title="SEO Health & SERP Auditor"
          >
            <Gauge className="h-3 w-3 mr-1 text-emerald-400" /> SEO
          </Button>

          {/* Media Vault Button */}
          <Button
            size="sm"
            onClick={() => setIsMediaOpen(true)}
            className="h-7 px-2 text-xs bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-900/60 font-mono"
            title="IndexedDB Media Vault"
          >
            <HardDrive className="h-3 w-3 mr-1 text-cyan-400" /> MEDIA
          </Button>

          {/* Menu Builder Button */}
          <Button
            size="sm"
            onClick={() => setIsMenuOpen(true)}
            className="h-7 px-2 text-xs bg-slate-900/60 border border-slate-700 text-slate-300 hover:bg-slate-800 font-mono"
            title="Menu Builder (Header navigation)"
          >
            <MenuIcon className="h-3 w-3 mr-1" /> MENU
          </Button>

          {/* Blog / Posts page link */}
          <Link href="/posts">
            <Button
              size="sm"
              variant="ghost"
              className="h-7 px-2 text-xs text-slate-400 hover:text-cyan-300 hover:bg-slate-900 font-mono"
              title="Manage Blog Articles"
            >
              <BookOpen className="h-3 w-3 mr-1" /> BLOG
            </Button>
          </Link>

          {/* Inspect HTML code button */}
          <Button
            size="sm"
            variant="ghost"
            onClick={handleInspectHtml}
            className="h-7 px-2 text-xs text-slate-400 hover:text-cyan-300 hover:bg-slate-900 font-mono"
            title="Inspect Standalone HTML"
          >
            <Code className="h-3.5 w-3.5" />
          </Button>

          {/* Shortcuts Help button */}
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsShortcutsOpen(true)}
            className="h-7 px-1.5 text-xs text-slate-400 hover:text-cyan-300 hover:bg-slate-900 font-mono"
            title="Keyboard Shortcuts (Ctrl+/)"
          >
            <Keyboard className="h-3.5 w-3.5" />
          </Button>

          {/* Undo / Redo */}
          <div className="flex items-center gap-0.5 border-r border-slate-800 pr-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={undo}
              disabled={past.length === 0}
              className="h-7 w-7 text-slate-400 hover:text-cyan-300 disabled:opacity-30"
              title="Undo (Ctrl+Z)"
            >
              <Undo2 className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={redo}
              disabled={future.length === 0}
              className="h-7 w-7 text-slate-400 hover:text-cyan-300 disabled:opacity-30"
              title="Redo (Ctrl+Shift+Z)"
            >
              <Redo2 className="h-3.5 w-3.5" />
            </Button>
          </div>

          {/* Backup export / import */}
          <div className="hidden 2xl:flex items-center gap-1 border-r border-slate-800 pr-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleExportBackup}
              className="h-7 px-2 text-[11px] text-slate-400 hover:text-cyan-300 hover:bg-slate-900"
              title="Export full project backup JSON"
            >
              <Download className="h-3 w-3 mr-1" /> Backup
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="h-7 px-2 text-[11px] text-slate-400 hover:text-fuchsia-300 hover:bg-slate-900"
              title="Import project backup JSON"
            >
              <Upload className="h-3 w-3 mr-1" /> Restore
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImportFile}
              className="hidden"
            />
          </div>

          {/* Language selector */}
          <div className="flex items-center gap-1 bg-slate-900/80 border border-slate-800 rounded px-1.5 py-0.5 text-xs">
            <Globe className="h-3 w-3 text-slate-400" />
            {locales.map((loc) => (
              <button
                key={loc}
                onClick={() => setLocale(loc)}
                className={`px-1.5 py-0.5 rounded uppercase text-[10px] font-bold ${
                  currentLocale === loc
                    ? "bg-fuchsia-950 border border-fuchsia-500/50 text-fuchsia-300"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {loc}
              </button>
            ))}
          </div>

          {/* Static ZIP Export Button */}
          <Button
            size="sm"
            onClick={handleDownloadStaticZip}
            className="h-7 px-2.5 text-xs border border-cyan-500/40 bg-cyan-950/40 text-cyan-300 hover:bg-cyan-900/60 font-mono"
            title="Export static HTML/CSS/ZIP"
          >
            <Archive className="h-3.5 w-3.5 mr-1" /> EXPORT ZIP
          </Button>

          {/* Preview Link */}
          <Link href="/preview">
            <Button size="sm" className="h-7 px-2.5 text-xs bg-gradient-to-r from-fuchsia-600 to-cyan-500 text-black font-semibold hover:opacity-90">
              <Eye className="h-3.5 w-3.5 mr-1" /> PREVIEW
            </Button>
          </Link>
        </div>
      </div>

      {/* Modals */}
      <MediaManagerModal
        isOpen={isMediaOpen}
        onClose={() => setIsMediaOpen(false)}
        onSelect={(url) => {
          if (selectedBlockId) {
            updateBlockContent(selectedBlockId, "image", url);
          } else {
            alert("Select a block in the canvas first — the image will be applied to it.");
          }
        }}
      />

      <AIGeneratorModal
        isOpen={isAIOpen}
        onClose={() => setIsAIOpen(false)}
      />

      <CodeExportModal
        isOpen={isCodeOpen}
        onClose={() => setIsCodeOpen(false)}
        code={rawHtmlCode}
        title={`RAW_HTML_OUTPUT // ${currentPage?.title.toUpperCase()}`}
      />

      <ThemeCustomizerModal
        isOpen={isThemeOpen}
        onClose={() => setIsThemeOpen(false)}
      />

      <SeoAuditorModal
        isOpen={isSeoOpen}
        onClose={() => setIsSeoOpen(false)}
      />

      <ShortcutsHelpModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />

      <MenuManagerModal
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
      />
    </>
  );
}
