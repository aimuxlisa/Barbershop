import React from "react";

interface EditorShellProps {
  topbar: React.ReactNode;
  leftSidebar: React.ReactNode;
  canvas: React.ReactNode;
  inspector: React.ReactNode;
}

export function EditorShell({
  topbar,
  leftSidebar,
  canvas,
  inspector,
}: EditorShellProps) {
  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-[#0a0a10] text-slate-100 select-none">
      {/* Topbar: Fixed height HUD header */}
      <header className="h-14 shrink-0 border-b border-cyan-500/20 bg-black/80 backdrop-blur-md z-30">
        {topbar}
      </header>

      {/* Main 3-column Layout */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Left Sidebar: Block Library / Pages */}
        <aside className="w-72 shrink-0 border-r border-cyan-500/20 bg-black/60 backdrop-blur-md flex flex-col z-20">
          {leftSidebar}
        </aside>

        {/* Center: Canvas Viewport */}
        <main className="flex-1 bg-[#050508] relative overflow-auto flex items-center justify-center p-4">
          {canvas}
        </main>

        {/* Right Sidebar: Inspector */}
        <aside className="w-80 shrink-0 border-l border-fuchsia-500/20 bg-black/60 backdrop-blur-md flex flex-col z-20">
          {inspector}
        </aside>
      </div>
    </div>
  );
}
