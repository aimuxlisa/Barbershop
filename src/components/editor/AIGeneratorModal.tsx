"use client";

import React, { useState } from "react";
import { Sparkles, Wand2, X, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEditorStore } from "@/store/editorStore";
import { blockRegistry } from "@/builder/registry/blockRegistry";

interface AIGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AIGeneratorModal({ isOpen, onClose }: AIGeneratorModalProps) {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [status, setStatus] = useState("");
  const { addBlock, addBlocksFromAI } = useEditorStore();

  if (!isOpen) return null;

  const generateLocally = () => {
    const lower = prompt.toLowerCase();
    if (lower.includes("магазин") || lower.includes("shop") || lower.includes("товар")) {
      addBlock("hero", "centered");
      addBlock("pricing", "cards");
      addBlock("features", "grid");
      addBlock("contacts", "default");
    } else if (lower.includes("портфолио") || lower.includes("portfolio")) {
      addBlock("hero", "split");
      addBlock("gallery", "grid");
      addBlock("reviews", "default");
      addBlock("contacts", "default");
    } else {
      // General Landing layout
      addBlock("hero", "centered");
      addBlock("features", "grid");
      addBlock("statistics", "default");
      addBlock("cta", "default");
      addBlock("footer", "default");
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setStatus("CONTACTING_SERVER_AI...");

    const allowedBlockTypes = blockRegistry.getAll().map((def) => def.type);

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, allowedBlockTypes }),
      });
      const data = await res.json().catch(() => null);

      if (res.ok && Array.isArray(data?.blocks) && data.blocks.length > 0) {
        addBlocksFromAI(data.blocks);
        setStatus("");
        setIsGenerating(false);
        onClose();
        return;
      }

      setStatus(`SERVER_AI: ${data?.error || "unavailable"} // LOCAL_SYNTH`);
    } catch {
      setStatus("SERVER_AI: unreachable // LOCAL_SYNTH");
    }

    await new Promise((resolve) => setTimeout(resolve, 700));
    generateLocally();
    setStatus("");
    setIsGenerating(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 select-none font-sans">
      <div className="w-full max-w-lg rounded-xl border border-fuchsia-500/40 bg-[#07070c] shadow-[0_0_50px_rgba(255,0,128,0.25)] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-fuchsia-500/20 bg-black/50">
          <div className="flex items-center gap-2 text-fuchsia-300 font-mono text-sm font-bold">
            <Sparkles className="h-4 w-4" />
            <span>AI_PAGE_SYNTHESIZER</span>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleGenerate} className="p-4 space-y-4">
          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1.5">
              Describe your desired page structure:
            </label>
            <textarea
              rows={4}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. 'Cyberpunk tech agency landing page with hero, services, metrics and a contact command terminal'"
              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-fuchsia-500/60 resize-none"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <span
              className={`text-[10px] font-mono ${
                status ? "text-amber-400" : "text-slate-500"
              }`}
            >
              {status || "Validated against BlockRegistry schema"}
            </span>
            <Button
              type="submit"
              disabled={isGenerating || !prompt.trim()}
              className="bg-gradient-to-r from-fuchsia-600 to-cyan-500 text-black font-semibold text-xs h-8"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" /> SYNTHESIZING...
                </>
              ) : (
                <>
                  <Wand2 className="h-3.5 w-3.5 mr-1" /> GENERATE PAGE
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
