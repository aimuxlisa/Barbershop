"use client";

import React, { useState } from "react";
import { Copy, Check, Code, Eye, Laptop } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CodeExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  code: string;
  language?: string;
  title?: string;
}

export function CodeExportModal({
  isOpen,
  onClose,
  code,
  language = "html",
  title = "INSPECT_RAW_OUTPUT",
}: CodeExportModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 select-none font-sans">
      <div className="w-full max-w-4xl rounded-xl border border-cyan-500/40 bg-[#07070c] shadow-[0_0_60px_rgba(0,240,255,0.25)] flex flex-col max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-cyan-500/20 bg-black/60">
          <div className="flex items-center gap-2 text-cyan-300 font-mono text-sm font-bold">
            <Code className="h-4 w-4" />
            <span>{title}</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={handleCopy}
              className="bg-cyan-950 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-900/60 font-mono text-xs h-7"
            >
              {copied ? (
                <>
                  <Check className="h-3 w-3 mr-1 text-emerald-400" /> COPIED!
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3 mr-1" /> COPY CODE
                </>
              )}
            </Button>
            <Button size="sm" variant="ghost" onClick={onClose} className="text-slate-400 hover:text-white h-7">
              CLOSE
            </Button>
          </div>
        </div>

        {/* Code Content */}
        <div className="flex-1 overflow-auto p-4 bg-[#050508]">
          <pre className="font-mono text-xs text-cyan-100/90 leading-relaxed select-text">
            <code>{code}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}
