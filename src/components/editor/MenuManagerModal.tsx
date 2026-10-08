"use client";

import React, { useEffect, useState } from "react";
import {
  Menu as MenuIcon,
  X,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Save,
  FileText,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Menu, MenuItem } from "@/types/menu";
import { menuService } from "@/services/menuService";
import { useEditorStore } from "@/store/editorStore";
import { LinkControl } from "@/components/controls/LinkControl";

interface MenuManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MenuManagerModal({ isOpen, onClose }: MenuManagerModalProps) {
  const pages = useEditorStore((s) => s.project.pages);
  const locales = useEditorStore((s) => s.project.locales);
  const [menu, setMenu] = useState<Menu | null>(null);
  const [savedFlash, setSavedFlash] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    let alive = true;
    menuService
      .getMain()
      .then((m) => {
        if (alive) setMenu(m);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [isOpen]);

  if (!isOpen || !menu) return null;

  const updateItem = (id: string, patch: Partial<MenuItem>) => {
    setMenu({
      ...menu,
      items: menu.items.map((it) => (it.id === id ? { ...it, ...patch } : it)),
    });
  };

  const addItem = () => {
    setMenu({ ...menu, items: [...menu.items, menuService.createItem("Новый пункт")] });
  };

  const addAllPages = () => {
    const existingPageIds = new Set(
      menu.items.filter((it) => it.link.type === "page").map((it) => it.link.pageId)
    );
    const additions = pages
      .filter((p) => !existingPageIds.has(p.id))
      .map((p) => ({
        id: `mi_${p.id}_${Date.now()}`,
        label: { ru: p.title, en: p.title, uz: p.title },
        link: { type: "page" as const, pageId: p.id },
      }));
    if (additions.length > 0) {
      setMenu({ ...menu, items: [...menu.items, ...additions] });
    }
  };

  const removeItem = (id: string) => {
    setMenu({ ...menu, items: menu.items.filter((it) => it.id !== id) });
  };

  const moveItem = (id: string, direction: -1 | 1) => {
    const items = [...menu.items];
    const index = items.findIndex((it) => it.id === id);
    const target = index + direction;
    if (index < 0 || target < 0 || target >= items.length) return;
    [items[index], items[target]] = [items[target], items[index]];
    setMenu({ ...menu, items });
  };

  const handleSave = async () => {
    await menuService.saveMenu(menu);
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 2000);
  };

  const labelValue = (item: MenuItem, locale: string) =>
    typeof item.label === "string" ? item.label : item.label[locale] || "";

  const setLabel = (item: MenuItem, locale: string, value: string) => {
    const base = typeof item.label === "string" ? { ru: item.label, en: item.label, uz: item.label } : item.label;
    updateItem(item.id, { label: { ...base, [locale]: value } });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 font-sans">
      <div className="w-full max-w-3xl rounded-xl border border-cyan-500/40 bg-[#07070c] shadow-[0_0_60px_rgba(0,240,255,0.25)] flex flex-col max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-cyan-500/20 bg-black/60">
          <div className="flex items-center gap-2 text-cyan-300 font-mono text-sm font-bold">
            <MenuIcon className="h-4 w-4" />
            <span>MENU_BUILDER // {menu.name.toUpperCase()}</span>
          </div>
          <div className="flex items-center gap-2">
            {savedFlash && (
              <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-400">
                <CheckCircle2 className="h-3.5 w-3.5" /> SAVED
              </span>
            )}
            <Button
              size="sm"
              onClick={handleSave}
              className="bg-cyan-950 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-900/60 font-mono text-xs h-7"
            >
              <Save className="h-3 w-3 mr-1" /> SAVE MENU
            </Button>
            <Button size="sm" variant="ghost" onClick={onClose} className="text-slate-400 hover:text-white h-7">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-mono text-slate-500">
              ITEMS: {menu.items.length} // HEADER RENDERS THIS MENU LIVE
            </p>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={addAllPages}
                className="h-7 border-slate-800 text-slate-300 hover:text-fuchsia-300 font-mono text-[11px]"
              >
                <FileText className="h-3 w-3 mr-1" /> ADD ALL PAGES
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={addItem}
                className="h-7 border-slate-800 text-slate-300 hover:text-cyan-300 font-mono text-[11px]"
              >
                <Plus className="h-3 w-3 mr-1" /> ADD ITEM
              </Button>
            </div>
          </div>

          {menu.items.length === 0 && (
            <div className="p-8 rounded-lg border border-dashed border-slate-800 text-center text-xs font-mono text-slate-500">
              MENU_IS_EMPTY // ADD ITEMS OR IMPORT ALL PAGES
            </div>
          )}

          {menu.items.map((item, index) => (
            <div
              key={item.id}
              className="rounded-lg border border-slate-800 bg-slate-950/60 p-3 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-fuchsia-300">#{index + 1}</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => moveItem(item.id, -1)}
                    disabled={index === 0}
                    className="p-1 rounded hover:bg-slate-800 text-slate-400 disabled:opacity-30"
                    title="Move up"
                  >
                    <ChevronUp className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => moveItem(item.id, 1)}
                    disabled={index === menu.items.length - 1}
                    className="p-1 rounded hover:bg-slate-800 text-slate-400 disabled:opacity-30"
                    title="Move down"
                  >
                    <ChevronDown className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-red-400"
                    title="Delete item"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Label translations */}
              <div className="grid grid-cols-3 gap-2">
                {locales.map((loc) => (
                  <div key={loc}>
                    <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1">
                      label_{loc}
                    </label>
                    <input
                      type="text"
                      value={labelValue(item, loc)}
                      onChange={(e) => setLabel(item, loc, e.target.value)}
                      placeholder="Item label..."
                      className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500/50"
                    />
                  </div>
                ))}
              </div>

              {/* Link */}
              <LinkControl
                label="Target (Page / URL / Tel / Email)"
                value={item.link}
                pages={pages.map((p) => ({ id: p.id, title: p.title, slug: p.slug }))}
                onChange={(link) => updateItem(item.id, { link })}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
