"use client";

import React, { useState } from "react";
import { Image as ImageIcon, X, FolderOpen } from "lucide-react";
import { MediaManagerModal } from "@/components/editor/MediaManagerModal";

interface ImageControlProps {
  label: string;
  value?: string;
  onChange: (url: string) => void;
}

export function ImageControl({ label, value, onChange }: ImageControlProps) {
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [urlDraft, setUrlDraft] = useState(
    value && !value.startsWith("data:") ? value : ""
  );

  const commitDraft = () => {
    const next = urlDraft.trim();
    if (next && !next.startsWith("data:")) onChange(next);
  };

  return (
    <div className="space-y-2 rounded-lg border border-slate-800 bg-slate-950/60 p-2.5 text-xs font-sans">
      <div className="flex items-center justify-between">
        <label className="font-mono text-[11px] text-slate-400 font-semibold">{label}</label>
        {value && (
          <button
            onClick={() => {
              onChange("");
              setUrlDraft("");
            }}
            className="flex items-center gap-1 text-[10px] font-mono text-slate-500 hover:text-red-400"
            title="Remove image"
          >
            <X className="h-3 w-3" /> CLEAR
          </button>
        )}
      </div>

      {value ? (
        <div className="relative overflow-hidden rounded border border-slate-800 bg-black/60">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="Block visual" className="h-32 w-full object-cover" />
        </div>
      ) : (
        <div className="h-16 rounded border border-dashed border-slate-800 flex items-center justify-center text-slate-600 font-mono text-[10px]">
          <ImageIcon className="h-4 w-4 mr-1.5" /> NO_IMAGE_SELECTED
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={() => setIsPickerOpen(true)}
          className="flex-1 flex items-center justify-center gap-1.5 rounded bg-cyan-950/60 border border-cyan-500/40 py-1.5 text-[11px] font-mono text-cyan-300 hover:bg-cyan-900/60 transition-colors"
        >
          <FolderOpen className="h-3 w-3" /> MEDIA VAULT
        </button>
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={urlDraft}
          onChange={(e) => setUrlDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") commitDraft();
          }}
          placeholder="https://example.com/image.jpg"
          className="flex-1 bg-slate-900 border border-slate-800 rounded px-2 py-1.5 text-[11px] text-slate-200 focus:outline-none focus:border-cyan-500/50 font-mono"
        />
      </div>

      <MediaManagerModal
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        onSelect={(url) => {
          onChange(url);
          setUrlDraft(url.length > 64 ? "base64://asset" : url);
          setIsPickerOpen(false);
        }}
      />
    </div>
  );
}
