"use client";

import React from "react";
import { PageBlock } from "@/types/project";
import { Copy, Trash2, GripVertical, EyeOff } from "lucide-react";
import { blockRegistry } from "@/builder/registry/blockRegistry";

interface EditorBlockFrameProps {
  block: PageBlock;
  isSelected: boolean;
  onSelect: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  dragHandleProps?: any;
  children: React.ReactNode;
}

export function EditorBlockFrame({
  block,
  isSelected,
  onSelect,
  onDuplicate,
  onDelete,
  dragHandleProps,
  children,
}: EditorBlockFrameProps) {
  const def = blockRegistry.get(block.type);
  const label = def?.label || block.type;

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      className={`group relative w-full rounded-lg transition-all duration-150 ${
        isSelected
          ? "ring-2 ring-fuchsia-500 shadow-[0_0_20px_rgba(255,0,128,0.25)]"
          : "hover:ring-1 hover:ring-cyan-500/50"
      }`}
    >
      {/* Top Floating Control Bar */}
      <div
        className={`absolute -top-7 left-2 z-30 flex items-center gap-1 rounded bg-black/90 border px-2 py-0.5 font-mono text-[10px] backdrop-blur-md transition-opacity ${
          isSelected
            ? "border-fuchsia-500/60 text-fuchsia-300 opacity-100"
            : "border-slate-800 text-slate-400 opacity-0 group-hover:opacity-100"
        }`}
      >
        <div {...dragHandleProps} className="cursor-grab active:cursor-grabbing p-0.5 hover:text-cyan-400">
          <GripVertical className="h-3 w-3" />
        </div>
        <span className="font-semibold uppercase">{label}</span>
        {block.variant && <span className="text-slate-500">({block.variant})</span>}

        <div className="ml-2 flex items-center gap-1 border-l border-slate-700 pl-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDuplicate();
            }}
            title="Duplicate block"
            className="p-0.5 hover:text-cyan-400"
          >
            <Copy className="h-3 w-3" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            title="Delete block"
            className="p-0.5 hover:text-red-400"
          >
            <Trash2 className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* Rendered Block Content */}
      <div className="w-full pointer-events-auto">{children}</div>
    </div>
  );
}
