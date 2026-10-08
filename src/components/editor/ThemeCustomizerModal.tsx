"use client";

import React, { useState } from "react";
import { 
  Palette, 
  X, 
  Check, 
  Sliders, 
  Layout, 
  Type, 
  Maximize2 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEditorStore } from "@/store/editorStore";

interface ThemeCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ThemeCustomizerModal({ isOpen, onClose }: ThemeCustomizerModalProps) {
  const { project, setProject } = useEditorStore();

  const themes = [
    {
      id: "cyber-magenta-cyan",
      name: "Cyberpunk Nexus (Default)",
      primary: "#ff0080",
      secondary: "#00f0ff",
      bg: "#07070c",
    },
    {
      id: "matrix-emerald",
      name: "Matrix Terminal",
      primary: "#10b981",
      secondary: "#06b6d4",
      bg: "#040d08",
    },
    {
      id: "deep-blue-void",
      name: "Deep Obsidian Blue",
      primary: "#3b82f6",
      secondary: "#8b5cf6",
      bg: "#050814",
    },
    {
      id: "sunset-neon",
      name: "Sunset Synthwave",
      primary: "#f97316",
      secondary: "#ec4899",
      bg: "#0f0814",
    },
  ];

  if (!isOpen) return null;

  const handleSelectTheme = (thm: typeof themes[0]) => {
    const updated = {
      ...project,
      globalStyles: {
        ...project.globalStyles,
        colors: {
          ...project.globalStyles.colors,
          primary: thm.primary,
          secondary: thm.secondary,
          background: thm.bg,
        },
      },
    };
    setProject(updated);
  };

  const handleRadiusChange = (radiusKey: "sm" | "md" | "lg", val: number) => {
    const updated = {
      ...project,
      globalStyles: {
        ...project.globalStyles,
        radius: {
          ...project.globalStyles.radius,
          [radiusKey]: val,
        },
      },
    };
    setProject(updated);
  };

  const handleContainerWidthChange = (val: number) => {
    const updated = {
      ...project,
      globalStyles: {
        ...project.globalStyles,
        containerMaxWidth: val,
      },
    };
    setProject(updated);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 select-none font-sans">
      <div className="w-full max-w-xl rounded-xl border border-fuchsia-500/40 bg-[#07070c] shadow-[0_0_50px_rgba(255,0,128,0.25)] flex flex-col max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-fuchsia-500/20 bg-black/50">
          <div className="flex items-center gap-2 text-fuchsia-300 font-mono text-sm font-bold">
            <Palette className="h-4 w-4" />
            <span>GLOBAL_DESIGN_SYSTEM_ENGINE</span>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 text-xs">
          {/* Preset Palettes */}
          <div>
            <label className="block text-[11px] font-mono text-slate-400 mb-2 font-semibold">
              PRESET COLOR HARMONIES
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {themes.map((t) => {
                const isActive =
                  project.globalStyles.colors.primary === t.primary &&
                  project.globalStyles.colors.secondary === t.secondary;

                return (
                  <div
                    key={t.id}
                    onClick={() => handleSelectTheme(t)}
                    className={`p-3 rounded-lg border cursor-pointer transition-all flex items-center justify-between ${
                      isActive
                        ? "border-cyan-400 bg-cyan-950/40 shadow-[0_0_15px_rgba(0,240,255,0.2)]"
                        : "border-slate-800 bg-slate-950/60 hover:border-slate-700"
                    }`}
                  >
                    <div>
                      <span className="font-mono text-xs font-semibold text-slate-200 block">
                        {t.name}
                      </span>
                      <div className="flex items-center gap-1.5 mt-2">
                        <span
                          className="h-4 w-4 rounded-full border border-black/40"
                          style={{ backgroundColor: t.primary }}
                        />
                        <span
                          className="h-4 w-4 rounded-full border border-black/40"
                          style={{ backgroundColor: t.secondary }}
                        />
                        <span
                          className="h-4 w-4 rounded-full border border-black/40"
                          style={{ backgroundColor: t.bg }}
                        />
                      </div>
                    </div>
                    {isActive && <Check className="h-4 w-4 text-cyan-400" />}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Container Width */}
          <div>
            <div className="flex items-center justify-between mb-1.5 font-mono text-[11px] text-slate-400">
              <span className="font-semibold">CONTAINER MAX WIDTH</span>
              <span className="text-cyan-300">{project.globalStyles.containerMaxWidth || 1200} px</span>
            </div>
            <input
              type="range"
              min={800}
              max={1600}
              step={20}
              value={project.globalStyles.containerMaxWidth || 1200}
              onChange={(e) => handleContainerWidthChange(Number(e.target.value))}
              className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          {/* Border Radius */}
          <div>
            <div className="flex items-center justify-between mb-1.5 font-mono text-[11px] text-slate-400">
              <span className="font-semibold">GLOBAL BORDER RADIUS</span>
              <span className="text-fuchsia-300">{project.globalStyles.radius.md || 8} px</span>
            </div>
            <input
              type="range"
              min={0}
              max={24}
              step={2}
              value={project.globalStyles.radius.md || 8}
              onChange={(e) => handleRadiusChange("md", Number(e.target.value))}
              className="w-full accent-fuchsia-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
