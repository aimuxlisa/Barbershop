"use client";

import React, { useState } from "react";
import { 
  Keyboard, 
  X, 
  Command, 
  Save, 
  Undo, 
  Redo, 
  Eye, 
  HardDrive, 
  Sparkles, 
  Palette 
} from "lucide-react";

interface ShortcutsHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ShortcutsHelpModal({ isOpen, onClose }: ShortcutsHelpModalProps) {
  if (!isOpen) return null;

  const shortcuts = [
    { keys: ["Ctrl", "Z"], desc: "Undo last editor change", mac: ["⌘", "Z"] },
    { keys: ["Ctrl", "Shift", "Z"], desc: "Redo undone change", mac: ["⌘", "⇧", "Z"] },
    { keys: ["Ctrl", "Y"], desc: "Alternative Redo shortcut", mac: ["⌘", "Y"] },
    { keys: ["Click"], desc: "Select block to inspect", mac: ["Click"] },
    { keys: ["Drag Handle"], desc: "Reorder blocks via Drag-and-Drop", mac: ["Drag"] },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 select-none font-sans">
      <div className="w-full max-w-md rounded-xl border border-cyan-500/40 bg-[#07070c] shadow-[0_0_50px_rgba(0,240,255,0.2)] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-cyan-500/20 bg-black/50">
          <div className="flex items-center gap-2 text-cyan-300 font-mono text-sm font-bold">
            <Keyboard className="h-4 w-4" />
            <span>KEYBOARD_SHORTCUTS</span>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* List */}
        <div className="p-4 space-y-3 text-xs">
          {shortcuts.map((sc, i) => (
            <div key={i} className="flex items-center justify-between p-2 rounded border border-slate-800 bg-slate-950/60">
              <span className="text-slate-300">{sc.desc}</span>
              <div className="flex items-center gap-1 font-mono">
                {sc.keys.map((k, idx) => (
                  <kbd
                    key={idx}
                    className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] text-cyan-300 font-semibold shadow"
                  >
                    {k}
                  </kbd>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
