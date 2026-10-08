"use client";

import React, { useState } from "react";
import { 
  BarChart3, 
  Search, 
  AlertTriangle, 
  CheckCircle2, 
  ExternalLink, 
  Share2, 
  Zap, 
  X,
  Gauge
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEditorStore } from "@/store/editorStore";

interface SeoAuditorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SeoAuditorModal({ isOpen, onClose }: SeoAuditorModalProps) {
  const { project, selectedPageId, currentLocale } = useEditorStore();
  const currentPage = project.pages.find((p) => p.id === selectedPageId) || project.pages[0];

  if (!isOpen) return null;

  const pageTitle = currentPage?.seo?.title?.[currentLocale] || "";
  const pageDesc = currentPage?.seo?.description?.[currentLocale] || "";
  const canonical = currentPage?.seo?.canonical || "";

  const titleLength = pageTitle.length;
  const descLength = pageDesc.length;

  const isTitleOptimal = titleLength >= 30 && titleLength <= 60;
  const isDescOptimal = descLength >= 70 && descLength <= 160;
  const hasCanonical = canonical.length > 0;
  const hasHeroBlock = currentPage?.blocks.some((b) => b.type === "hero");

  // Calculate SEO health score
  let score = 0;
  if (isTitleOptimal) score += 30;
  else if (titleLength > 0) score += 15;

  if (isDescOptimal) score += 30;
  else if (descLength > 0) score += 15;

  if (hasCanonical) score += 20;
  if (hasHeroBlock) score += 20;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 select-none font-sans">
      <div className="w-full max-w-2xl rounded-xl border border-emerald-500/40 bg-[#07070c] shadow-[0_0_60px_rgba(16,185,129,0.2)] flex flex-col max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-emerald-500/20 bg-black/50">
          <div className="flex items-center gap-2 text-emerald-300 font-mono text-sm font-bold">
            <Gauge className="h-4 w-4" />
            <span>SEO_HEALTH_&_SERP_AUDITOR</span>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6 text-xs">
          {/* Score header */}
          <div className="flex items-center justify-between p-4 rounded-xl border border-slate-800 bg-slate-950/60">
            <div>
              <span className="text-slate-400 font-mono block">PAGE OPTIMIZATION SCORE</span>
              <span className="text-2xl font-mono font-extrabold text-white">
                {currentPage?.title} ({currentLocale.toUpperCase()})
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`text-3xl font-extrabold font-mono ${
                  score >= 80 ? "text-emerald-400" : score >= 50 ? "text-yellow-400" : "text-red-400"
                }`}
              >
                {score}/100
              </span>
            </div>
          </div>

          {/* Google SERP Preview Simulation */}
          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-2 font-semibold">
              GOOGLE SEARCH PREVIEW (SERP)
            </span>
            <div className="p-4 rounded-lg border border-slate-800 bg-black/60 font-sans space-y-1">
              <div className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                <span>https://example.com</span>
                <span className="text-slate-600">›</span>
                <span className="text-slate-500">{currentPage?.slug}</span>
              </div>
              <h3 className="text-sm font-medium text-blue-400 hover:underline cursor-pointer truncate">
                {pageTitle || "Untitled Page — Please add SEO Title"}
              </h3>
              <p className="text-xs text-slate-400 line-clamp-2">
                {pageDesc || "No meta description provided. Search engines will generate a snippet from page content."}
              </p>
            </div>
          </div>

          {/* Detailed Audit Items */}
          <div className="space-y-2">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1 font-semibold">
              DIAGNOSTIC CHECKLIST
            </span>

            <div className="flex items-center justify-between p-2.5 rounded border border-slate-800 bg-slate-950/40">
              <div className="flex items-center gap-2">
                {isTitleOptimal ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-yellow-400" />
                )}
                <span>Title Length: {titleLength} chars (Optimal: 30–60)</span>
              </div>
              <span className="font-mono text-[10px] text-slate-500">
                {isTitleOptimal ? "PASSED" : "REVIEW"}
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded border border-slate-800 bg-slate-950/40">
              <div className="flex items-center gap-2">
                {isDescOptimal ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-yellow-400" />
                )}
                <span>Description Length: {descLength} chars (Optimal: 70–160)</span>
              </div>
              <span className="font-mono text-[10px] text-slate-500">
                {isDescOptimal ? "PASSED" : "REVIEW"}
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded border border-slate-800 bg-slate-950/40">
              <div className="flex items-center gap-2">
                {hasCanonical ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-slate-500" />
                )}
                <span>Canonical Tag: {hasCanonical ? canonical : "Not defined"}</span>
              </div>
              <span className="font-mono text-[10px] text-slate-500">
                {hasCanonical ? "PASSED" : "OPTIONAL"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
