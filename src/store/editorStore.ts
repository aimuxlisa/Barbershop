import { create } from "zustand";
import { SiteProject, Breakpoint, PageBlock, Page, PageSEO } from "@/types/project";
import { demoProject } from "@/fixtures/demoProject";
import { blockRegistry } from "@/builder/registry/blockRegistry";
import { templates } from "@/builder/templates/pageTemplates";
import { IndexedDbProjectRepository } from "@/repositories/IndexedDbProjectRepository";

const repository = new IndexedDbProjectRepository();

interface EditorState {
  project: SiteProject;
  selectedPageId: string;
  selectedBlockId: string | null;
  currentLocale: string;
  currentBreakpoint: Breakpoint;
  isDirty: boolean;
  saveStatus: "idle" | "saving" | "saved" | "error";

  // History for Undo/Redo
  past: SiteProject[];
  future: SiteProject[];

  // Navigation
  selectPage: (id: string) => void;
  selectBlock: (id: string | null) => void;
  setLocale: (locale: string) => void;
  setBreakpoint: (bp: Breakpoint) => void;

  // Page CRUD & SEO
  addPage: (title: string, slug: string, templateId?: string) => void;
  deletePage: (id: string) => void;
  renamePage: (id: string, title: string, slug: string) => void;
  updatePageSEO: (id: string, seo: Partial<PageSEO>) => void;

  // Block CRUD
  addBlock: (type: string, variant?: string, targetIndex?: number) => void;
  addBlocksFromAI: (
    specs: Array<{ type: string; variant?: string; content?: Record<string, unknown> }>
  ) => void;
  removeBlock: (id: string) => void;
  duplicateBlock: (id: string) => void;
  moveBlock: (fromIndex: number, toIndex: number) => void;
  updateBlockContent: (blockId: string, key: string, value: any) => void;
  updateBlockStyle: (blockId: string, path: string, value: any) => void;

  // Undo / Redo
  undo: () => void;
  redo: () => void;
  pushHistory: () => void;

  // Persistence helpers
  setProject: (project: SiteProject) => void;
  setSaveStatus: (status: "idle" | "saving" | "saved" | "error") => void;
  saveToIndexedDb: () => Promise<void>;
  hydrateFromIndexedDb: () => Promise<void>;
}

export const useEditorStore = create<EditorState>((set, get) => ({
  project: demoProject,
  selectedPageId: demoProject.pages[0].id,
  selectedBlockId: demoProject.pages[0].blocks[0]?.id || null,
  currentLocale: "ru",
  currentBreakpoint: "desktop",
  isDirty: false,
  saveStatus: "saved",
  past: [],
  future: [],

  selectPage: (id) => set({ selectedPageId: id, selectedBlockId: null }),
  selectBlock: (id) => set({ selectedBlockId: id }),
  setLocale: (locale) => set({ currentLocale: locale }),
  setBreakpoint: (bp) => set({ currentBreakpoint: bp }),
  setSaveStatus: (status) => set({ saveStatus: status }),
  setProject: (project) => set({ project, past: [], future: [] }),

  pushHistory: () => {
    const { project, past } = get();
    const newPast = [...past, JSON.parse(JSON.stringify(project))];
    if (newPast.length > 50) newPast.shift();
    set({ past: newPast, future: [] });
  },

  undo: () => {
    const { past, project, future } = get();
    if (past.length === 0) return;
    const previous = past[past.length - 1];
    const newPast = past.slice(0, past.length - 1);
    set({
      project: previous,
      past: newPast,
      future: [JSON.parse(JSON.stringify(project)), ...future],
      isDirty: true,
    });
  },

  redo: () => {
    const { past, project, future } = get();
    if (future.length === 0) return;
    const next = future[0];
    const newFuture = future.slice(1);
    set({
      project: next,
      past: [...past, JSON.parse(JSON.stringify(project))],
      future: newFuture,
      isDirty: true,
    });
  },

  // Page Management
  addPage: (title, slug, templateId) => {
    get().pushHistory();
    const { project } = get();

    const template = templateId ? templates.find((t) => t.id === templateId) : undefined;
    const templateBlocks = (template?.createBlocks() || []).filter(
      (block): block is PageBlock => Boolean(block)
    );

    const defaultHero: PageBlock = {
      id: `block_hero_${Date.now()}`,
      type: "hero",
      variant: "centered",
      content: {
        title: { ru: `${title} — Добро пожаловать`, en: `${title} — Welcome`, uz: `${title} — Xush kelibsiz` },
        description: { ru: "Новая страница создана.", en: "New page created.", uz: "Yangi sahifa yaratildi." },
        primaryButtonText: { ru: "На главную", en: "Go Home", uz: "Bosh sahifaga" },
        primaryButtonLink: { type: "url", url: "/", openInNewTab: false },
      },
      styles: {
        spacing: { padding: { desktop: { top: 64, bottom: 64, left: 24, right: 24 } } },
      },
    };

    const blocks = templateBlocks.length > 0 ? templateBlocks : [defaultHero];

    const newPage: Page = {
      id: `page_${Date.now()}`,
      title,
      slug,
      status: "published",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      seo: {
        title: { ru: title, en: title, uz: title },
        description: { ru: `${title} page description`, en: `${title} page description`, uz: `${title} sahifa tavsifi` },
      },
      blocks,
    };

    set({
      project: { ...project, pages: [...project.pages, newPage] },
      selectedPageId: newPage.id,
      selectedBlockId: blocks[0]?.id || null,
      isDirty: true,
    });
  },

  deletePage: (id) => {
    get().pushHistory();
    const { project, selectedPageId } = get();
    if (project.pages.length <= 1) {
      alert("Cannot delete the only remaining page.");
      return;
    }
    const updatedPages = project.pages.filter((p) => p.id !== id);
    set({
      project: { ...project, pages: updatedPages },
      selectedPageId: selectedPageId === id ? updatedPages[0].id : selectedPageId,
      selectedBlockId: null,
      isDirty: true,
    });
  },

  renamePage: (id, title, slug) => {
    get().pushHistory();
    const { project } = get();
    const updatedPages = project.pages.map((p) => {
      if (p.id !== id) return p;
      return { ...p, title, slug, updatedAt: new Date().toISOString() };
    });
    set({ project: { ...project, pages: updatedPages }, isDirty: true });
  },

  updatePageSEO: (id, seoData) => {
    get().pushHistory();
    const { project } = get();
    const updatedPages = project.pages.map((p) => {
      if (p.id !== id) return p;
      return {
        ...p,
        seo: { ...p.seo, ...seoData },
        updatedAt: new Date().toISOString(),
      };
    });
    set({ project: { ...project, pages: updatedPages }, isDirty: true });
  },

  addBlock: (type, variant, targetIndex) => {
    get().pushHistory();
    const newBlock = blockRegistry.createBlock(type, variant);
    if (!newBlock) return;

    const { project, selectedPageId } = get();
    const updatedPages = project.pages.map((page) => {
      if (page.id !== selectedPageId) return page;
      const blocks = [...page.blocks];
      if (typeof targetIndex === "number") {
        blocks.splice(targetIndex, 0, newBlock);
      } else {
        blocks.push(newBlock);
      }
      return { ...page, blocks, updatedAt: new Date().toISOString() };
    });

    set({
      project: { ...project, pages: updatedPages },
      selectedBlockId: newBlock.id,
      isDirty: true,
    });
  },

  addBlocksFromAI: (specs) => {
    const newBlocks = specs
      .map((spec) => {
        const block = blockRegistry.createBlock(spec.type, spec.variant);
        if (!block) return null;
        if (spec.content && typeof spec.content === "object") {
          block.content = { ...block.content, ...spec.content };
        }
        return block;
      })
      .filter((b): b is PageBlock => b !== null);

    if (newBlocks.length === 0) return;

    get().pushHistory();

    const { project, selectedPageId } = get();
    const updatedPages = project.pages.map((page) => {
      if (page.id !== selectedPageId) return page;
      return {
        ...page,
        blocks: [...page.blocks, ...newBlocks],
        updatedAt: new Date().toISOString(),
      };
    });

    set({
      project: { ...project, pages: updatedPages },
      selectedBlockId: newBlocks[0].id,
      isDirty: true,
    });
  },

  removeBlock: (id) => {
    get().pushHistory();
    const { project, selectedPageId, selectedBlockId } = get();
    const updatedPages = project.pages.map((page) => {
      if (page.id !== selectedPageId) return page;
      return {
        ...page,
        blocks: page.blocks.filter((b) => b.id !== id),
        updatedAt: new Date().toISOString(),
      };
    });

    set({
      project: { ...project, pages: updatedPages },
      selectedBlockId: selectedBlockId === id ? null : selectedBlockId,
      isDirty: true,
    });
  },

  duplicateBlock: (id) => {
    get().pushHistory();
    const { project, selectedPageId } = get();
    const updatedPages = project.pages.map((page) => {
      if (page.id !== selectedPageId) return page;
      const index = page.blocks.findIndex((b) => b.id === id);
      if (index === -1) return page;
      const original = page.blocks[index];
      const clone: PageBlock = {
        ...JSON.parse(JSON.stringify(original)),
        id: `block_${original.type}_${Date.now()}`,
      };
      const blocks = [...page.blocks];
      blocks.splice(index + 1, 0, clone);
      return { ...page, blocks, updatedAt: new Date().toISOString() };
    });

    set({
      project: { ...project, pages: updatedPages },
      isDirty: true,
    });
  },

  moveBlock: (fromIndex, toIndex) => {
    get().pushHistory();
    const { project, selectedPageId } = get();
    const updatedPages = project.pages.map((page) => {
      if (page.id !== selectedPageId) return page;
      const blocks = [...page.blocks];
      const [moved] = blocks.splice(fromIndex, 1);
      blocks.splice(toIndex, 0, moved);
      return { ...page, blocks, updatedAt: new Date().toISOString() };
    });

    set({
      project: { ...project, pages: updatedPages },
      isDirty: true,
    });
  },

  updateBlockContent: (blockId, key, value) => {
    const { project, selectedPageId } = get();
    const updatedPages = project.pages.map((page) => {
      if (page.id !== selectedPageId) return page;
      const blocks = page.blocks.map((b) => {
        if (b.id !== blockId) return b;
        return {
          ...b,
          content: { ...b.content, [key]: value },
        };
      });
      return { ...page, blocks, updatedAt: new Date().toISOString() };
    });

    set({
      project: { ...project, pages: updatedPages },
      isDirty: true,
    });
  },

  updateBlockStyle: (blockId, path, value) => {
    const { project, selectedPageId } = get();
    const updatedPages = project.pages.map((page) => {
      if (page.id !== selectedPageId) return page;
      const blocks = page.blocks.map((b) => {
        if (b.id !== blockId) return b;
        const styles = JSON.parse(JSON.stringify(b.styles || {}));
        styles[path] = value;
        return { ...b, styles };
      });
      return { ...page, blocks, updatedAt: new Date().toISOString() };
    });

    set({
      project: { ...project, pages: updatedPages },
      isDirty: true,
    });
  },

  saveToIndexedDb: async () => {
    const { project } = get();
    set({ saveStatus: "saving" });
    try {
      await repository.save(project);
      set({ saveStatus: "saved", isDirty: false });
    } catch (e) {
      set({ saveStatus: "error" });
    }
  },

  hydrateFromIndexedDb: async () => {
    try {
      let project: SiteProject | null = await repository.load(get().project.id);

      if (!project) {
        const index = (await repository.listProjects?.()) || [];
        if (index.length > 0) {
          const latest = [...index].sort((a, b) =>
            (b.updatedAt || "").localeCompare(a.updatedAt || "")
          )[0];
          project = await repository.load(latest.id);
        }
      }

      if (project && project.pages) {
        set({
          project,
          selectedPageId: project.pages[0]?.id || "",
          selectedBlockId: null,
          past: [],
          future: [],
          saveStatus: "saved",
          isDirty: false,
        });
      }
    } catch {
      set({ saveStatus: "error" });
    }
  },
}));
