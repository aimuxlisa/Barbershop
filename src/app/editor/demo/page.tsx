"use client";

import dynamic from "next/dynamic";
import { useProjectPersistence } from "@/store/useProjectPersistence";

const EditorDemo = dynamic(() => import("@/components/editor/EditorDemo"), {
  ssr: false,
  loading: () => (
    <div className="flex h-screen items-center justify-center bg-[#07070c] font-mono text-xs text-cyan-400">
      LOADING_EDITOR...
    </div>
  ),
});

export default function EditorDemoPage() {
  useProjectPersistence();

  return <EditorDemo />;
}
