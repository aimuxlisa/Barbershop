"use client";

import { EditorShell } from "@/components/editor/EditorShell";
import { EditorTopbar } from "@/components/editor/EditorTopbar";
import { BlockLibrary } from "@/components/editor/BlockLibrary";
import { EditorCanvas } from "@/components/editor/EditorCanvas";
import { Inspector } from "@/components/editor/Inspector";

export default function EditorDemo() {
  return (
    <EditorShell
      topbar={<EditorTopbar />}
      leftSidebar={<BlockLibrary />}
      canvas={<EditorCanvas />}
      inspector={<Inspector />}
    />
  );
}
