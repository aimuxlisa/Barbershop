"use client";

import React from "react";
import { LinkConfig, LinkType } from "@/types/project";
import { Link2, ExternalLink, Phone, Mail, FileText } from "lucide-react";

interface LinkControlProps {
  label: string;
  value?: LinkConfig;
  pages?: Array<{ id: string; title: string; slug: string }>;
  onChange: (value: LinkConfig) => void;
}

export function LinkControl({
  label,
  value = { type: "url", url: "", openInNewTab: false },
  pages = [],
  onChange,
}: LinkControlProps) {
  const currentType = value.type || "url";

  const handleTypeChange = (type: LinkType) => {
    onChange({
      ...value,
      type,
      url: type === "page" ? undefined : value.url || "",
      pageId: type === "page" ? pages[0]?.id || "" : undefined,
    });
  };

  return (
    <div className="space-y-2 rounded-lg border border-slate-800 bg-slate-950/60 p-2.5 text-xs font-sans">
      <div className="flex items-center justify-between">
        <label className="font-mono text-[11px] text-slate-400 font-semibold">{label}</label>
        {currentType === "url" && (
          <label className="flex items-center gap-1.5 cursor-pointer text-[10px] text-slate-400 hover:text-slate-200">
            <input
              type="checkbox"
              checked={!!value.openInNewTab}
              onChange={(e) => onChange({ ...value, openInNewTab: e.target.checked })}
              className="rounded bg-slate-900 border-slate-700 text-fuchsia-500 focus:ring-0"
            />
            <span>New tab</span>
          </label>
        )}
      </div>

      {/* Type buttons */}
      <div className="grid grid-cols-4 gap-1 font-mono text-[10px]">
        <button
          type="button"
          onClick={() => handleTypeChange("url")}
          className={`flex items-center justify-center gap-1 py-1 rounded border transition-colors ${
            currentType === "url"
              ? "bg-cyan-950 border-cyan-500/60 text-cyan-300 shadow-[0_0_8px_rgba(0,240,255,0.2)]"
              : "border-slate-800 bg-black/40 text-slate-400 hover:text-slate-200"
          }`}
        >
          <ExternalLink className="h-3 w-3" /> URL
        </button>

        <button
          type="button"
          onClick={() => handleTypeChange("page")}
          className={`flex items-center justify-center gap-1 py-1 rounded border transition-colors ${
            currentType === "page"
              ? "bg-fuchsia-950 border-fuchsia-500/60 text-fuchsia-300 shadow-[0_0_8px_rgba(255,0,128,0.2)]"
              : "border-slate-800 bg-black/40 text-slate-400 hover:text-slate-200"
          }`}
        >
          <FileText className="h-3 w-3" /> Page
        </button>

        <button
          type="button"
          onClick={() => handleTypeChange("tel")}
          className={`flex items-center justify-center gap-1 py-1 rounded border transition-colors ${
            currentType === "tel"
              ? "bg-emerald-950 border-emerald-500/60 text-emerald-300 shadow-[0_0_8px_rgba(16,185,129,0.2)]"
              : "border-slate-800 bg-black/40 text-slate-400 hover:text-slate-200"
          }`}
        >
          <Phone className="h-3 w-3" /> Tel
        </button>

        <button
          type="button"
          onClick={() => handleTypeChange("email")}
          className={`flex items-center justify-center gap-1 py-1 rounded border transition-colors ${
            currentType === "email"
              ? "bg-blue-950 border-blue-500/60 text-blue-300 shadow-[0_0_8px_rgba(59,130,246,0.2)]"
              : "border-slate-800 bg-black/40 text-slate-400 hover:text-slate-200"
          }`}
        >
          <Mail className="h-3 w-3" /> Email
        </button>
      </div>

      {/* Inputs per type */}
      {currentType === "url" && (
        <input
          type="text"
          value={value.url || ""}
          onChange={(e) => onChange({ ...value, url: e.target.value })}
          placeholder="https://example.com"
          className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500/50 font-mono"
        />
      )}

      {currentType === "page" && (
        <select
          value={value.pageId || (pages[0]?.id || "")}
          onChange={(e) => onChange({ ...value, pageId: e.target.value })}
          className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-fuchsia-500/50 font-mono"
        >
          {pages.map((p) => (
            <option key={p.id} value={p.id}>
              {p.title} (/{p.slug})
            </option>
          ))}
        </select>
      )}

      {currentType === "tel" && (
        <input
          type="tel"
          value={value.url || ""}
          onChange={(e) => onChange({ ...value, url: e.target.value })}
          placeholder="+1 234 567 8900"
          className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500/50 font-mono"
        />
      )}

      {currentType === "email" && (
        <input
          type="email"
          value={value.url || ""}
          onChange={(e) => onChange({ ...value, url: e.target.value })}
          placeholder="operator@system.io"
          className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500/50 font-mono"
        />
      )}
    </div>
  );
}
