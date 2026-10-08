"use client";

import React from "react";
import { Page, Breakpoint, PageBlock } from "@/types/project";
import { blockRegistry } from "@/builder/registry/blockRegistry";

interface PageRendererProps {
  page: Page;
  locale: string;
  breakpoint: Breakpoint;
  mode?: "editor" | "preview" | "export";
  selectedBlockId?: string | null;
  onSelectBlock?: (blockId: string) => void;
  renderBlockWrapper?: (block: PageBlock, children: React.ReactNode) => React.ReactNode;
}

export function PageRenderer({
  page,
  locale,
  breakpoint,
  mode = "editor",
  selectedBlockId,
  onSelectBlock,
  renderBlockWrapper,
}: PageRendererProps) {
  if (!page || !page.blocks || page.blocks.length === 0) {
    return (
      <div className="py-20 text-center font-mono text-xs text-slate-500">
        NO_BLOCKS_DETECTED // DRAG OR ADD BLOCKS FROM REGISTRY
      </div>
    );
  }

  return (
    <div className="w-full space-y-4 flex flex-col items-center">
      {page.blocks.map((block) => {
        if (block.hidden) return null;
        const definition = blockRegistry.get(block.type);

        let renderedContent: React.ReactNode;

        if (!definition) {
          renderedContent = (
            <div className="p-4 rounded border border-yellow-500/40 bg-yellow-950/20 text-yellow-300 font-mono text-xs">
              UNKNOWN_BLOCK_TYPE: [{block.type}]
            </div>
          );
        } else {
          const Component = definition.renderer;
          renderedContent = (
            <Component
              block={block}
              locale={locale}
              breakpoint={breakpoint}
              isEditing={mode === "editor"}
            />
          );
        }

        if (renderBlockWrapper) {
          return renderBlockWrapper(block, renderedContent);
        }

        return <React.Fragment key={block.id}>{renderedContent}</React.Fragment>;
      })}
    </div>
  );
}
