"use client";

import React from "react";
import { RotateCcw } from "lucide-react";

interface SliderControlProps {
  label: string;
  value?: number;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  defaultValue?: number;
  onChange: (value: number) => void;
  onReset?: () => void;
}

export function SliderControl({
  label,
  value = 0,
  min = 0,
  max = 120,
  step = 1,
  unit = "px",
  defaultValue = 0,
  onChange,
  onReset,
}: SliderControlProps) {
  return (
    <div className="space-y-1.5 rounded-lg border border-slate-800 bg-slate-950/60 p-2.5 text-xs font-sans">
      <div className="flex items-center justify-between">
        <label className="font-mono text-[11px] text-slate-400 font-semibold">{label}</label>
        <div className="flex items-center gap-1.5">
          <span className="font-mono text-[11px] text-cyan-300 bg-cyan-950/60 border border-cyan-500/30 px-1.5 py-0.2 rounded">
            {value} {unit}
          </span>
          {onReset && (
            <button
              onClick={onReset}
              className="p-0.5 rounded text-slate-500 hover:text-slate-300 hover:bg-slate-800"
              title="Reset"
            >
              <RotateCcw className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 pt-1">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="flex-1 accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
        />
        <input
          type="number"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-14 bg-slate-900 border border-slate-800 rounded px-1.5 py-0.5 text-right text-xs text-slate-200 font-mono focus:border-cyan-500 outline-none"
        />
      </div>
    </div>
  );
}
