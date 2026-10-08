"use client";

import React from "react";
import { useEditorStore } from "@/store/editorStore";
import { PageRenderer } from "@/builder/renderer/PageRenderer";
import { EditorBlockFrame } from "./EditorBlockFrame";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

function SortableBlockItem({
  block,
  isSelected,
  onSelect,
  onDuplicate,
  onDelete,
  children,
}: {
  block: any;
  isSelected: boolean;
  onSelect: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  children: React.ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="w-full">
      <EditorBlockFrame
        block={block}
        isSelected={isSelected}
        onSelect={onSelect}
        onDuplicate={onDuplicate}
        onDelete={onDelete}
        dragHandleProps={{ ...attributes, ...listeners }}
      >
        {children}
      </EditorBlockFrame>
    </div>
  );
}

export function EditorCanvas() {
  const {
    project,
    selectedPageId,
    selectedBlockId,
    currentLocale,
    currentBreakpoint,
    selectBlock,
    duplicateBlock,
    removeBlock,
    moveBlock,
  } = useEditorStore();

  const currentPage = project.pages.find((p) => p.id === selectedPageId) || project.pages[0];

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = currentPage.blocks.findIndex((b) => b.id === active.id);
      const newIndex = currentPage.blocks.findIndex((b) => b.id === over.id);
      if (oldIndex !== -1 && newIndex !== -1) {
        moveBlock(oldIndex, newIndex);
      }
    }
  };

  // Viewport width based on breakpoint
  const viewportMaxWidth =
    currentBreakpoint === "mobile"
      ? "max-w-[390px]"
      : currentBreakpoint === "tablet"
      ? "max-w-[768px]"
      : "max-w-[1100px]";

  return (
    <div
      onClick={() => selectBlock(null)}
      className={`w-full ${viewportMaxWidth} min-h-[600px] transition-all duration-300 rounded-xl border border-cyan-500/20 bg-[#07070c] shadow-[0_0_50px_rgba(0,0,0,0.9)] flex flex-col p-6 relative overflow-hidden`}
    >
      <div className="absolute inset-0 hud-grid opacity-20 pointer-events-none" />

      {/* Viewport Info Bar */}
      <div className="relative z-10 flex items-center justify-between pb-4 mb-4 border-b border-slate-800/80 font-mono text-[11px] text-slate-500">
        <span>
          CANVAS_MODE: <strong className="text-cyan-400 uppercase">{currentBreakpoint}</strong>
        </span>
        <span>
          PAGE: <strong className="text-slate-300">{currentPage.title}</strong> ({currentPage.blocks.length} BLOCKS)
        </span>
      </div>

      {/* Dnd Sortable Area */}
      <div className="relative z-10 w-full flex-1">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={currentPage.blocks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
            <PageRenderer
              page={currentPage}
              locale={currentLocale}
              breakpoint={currentBreakpoint}
              mode="editor"
              selectedBlockId={selectedBlockId}
              onSelectBlock={selectBlock}
              renderBlockWrapper={(block, renderedNode) => (
                <SortableBlockItem
                  key={block.id}
                  block={block}
                  isSelected={selectedBlockId === block.id}
                  onSelect={() => selectBlock(block.id)}
                  onDuplicate={() => duplicateBlock(block.id)}
                  onDelete={() => removeBlock(block.id)}
                >
                  {renderedNode}
                </SortableBlockItem>
              )}
            />
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
}
