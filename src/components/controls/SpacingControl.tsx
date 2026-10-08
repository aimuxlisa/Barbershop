"use client";

import React, { useState } from "react";
import { SpacingValue } from "@/types/project";
import { Link, Unlink } from "lucide-react";

interface SpacingControlProps {
  label: string;
  value?: SpacingValue;
  onChange: (value: SpacingValue) => void;
}

export function SpacingControl({
  label,
  value = { top: 0, right: 0, bottom: 0, left: 0 },
  onChange,
}: SpacingControlProps) {
  const [isLinked, setIsLinked] = useState(true);

  const handleAllChange = (num: number) => {
    onChange({ top: num, right: num, bottom: num, left: num });
  };

  const handleSingleChange = (side: keyof SpacingValue, num: number) => {
    if (isLinked) {
      handleAllChange(num);
    } else {
      onChange({ ...value, [side]: num });
    }
  };

  return (
    <div className="space-y-2 rounded-lg border border-slate-800 bg-slate-950/60 p-2.5 text-xs font-sans">
      <div className="flex items-center justify-between">
        <label className="font-mono text-[11px] text-slate-400 font-semibold">{label}</label>
        <button
          type="button"
          onClick={() => setIsLinked(!isLinked)}
          className={`flex items-center gap-1 text-[10px] font-mono px-1.5 py-0.5 rounded border transition-colors ${
            isLinked
              ? "border-cyan-500/40 bg-cyan-950/40 text-cyan-300"
              : "border-slate-800 text-slate-500"
          }`}
        >
          {isLinked ? <Link className="h-3 w-3" /> : <Unlink className="h-3 w-3" />}
          <span>{isLinked ? "LINKED" : "UNLINKED"}</span>
        </button>
      </div>

      <div className="grid grid-cols-4 gap-1.5 pt-1 text-center font-mono">
        <div>
          <span className="text-[9px] text-slate-500 block mb-0.5">TOP</span>
          <input
            type="number"
            value={value.top ?? 0}
            onChange={(e) => handleSingleChange("top", Number(e.target.value))}
            className="w-full bg-slate-900 border border-slate-800 rounded py-1 text-center text-xs text-slate-200 focus:border-cyan-500 outline-none"
          />
        </div>
        <div>
          <span className="text-[9px] text-slate-500 block mb-0.5">RIGHT</span>
          <input
            type="number"
            value={value.right ?? 0}
            onChange={(e) => handleSingleChange("right", Number(e.target.value))}
            className="w-full bg-slate-900 border border-slate-800 rounded py-1 text-center text-xs text-slate-200 focus:border-cyan-500 outline-none"
          />
        </div>
        <div>
          <span className="text-[9px] text-slate-500 block mb-0.5">BOTTOM</span>
          <input
            type="number"
            value={value.bottom ?? 0}
            onChange={(e) => handleSingleChange("bottom", Number(e.target.value))}
            className="w-full bg-slate-900 border border-slate-800 rounded py-1 text-center text-xs text-slate-200 focus:border-cyan-500 outline-none"
          />
        </div>
        <div>
          <span className="text-[9px] text-slate-500 block mb-0.5">LEFT</span>
          <input
            type="number"
            value={value.left ?? 0}
            onChange={(e) => handleSingleChange("left", Number(e.target.value))}
            className="w-full bg-slate-900 border border-slate-800 rounded py-1 text-center text-xs text-slate-200 focus:border-cyan-500 outline-none"
          />
        </div>
      </div>
    </div>
  );
}
