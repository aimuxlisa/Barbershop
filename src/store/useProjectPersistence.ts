"use client";

import { useEffect, useRef } from "react";
import { useEditorStore } from "@/store/editorStore";

const AUTOSAVE_DEBOUNCE_MS = 700;

/**
 * Hydrates the editor project from IndexedDB on mount and autosaves
 * every project mutation with a 700ms debounce.
 */
export function useProjectPersistence() {
  const hydratedRef = useRef(false);

  useEffect(() => {
    let alive = true;
    let timer: ReturnType<typeof setTimeout> | null = null;

    const hydrate = async () => {
      await useEditorStore.getState().hydrateFromIndexedDb();
      if (alive) hydratedRef.current = true;
    };
    void hydrate();

    const unsubscribe = useEditorStore.subscribe((state, prevState) => {
      if (!hydratedRef.current) return;
      if (state.project === prevState.project) return;

      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        void useEditorStore.getState().saveToIndexedDb();
      }, AUTOSAVE_DEBOUNCE_MS);
    });

    return () => {
      alive = false;
      if (timer) clearTimeout(timer);
      unsubscribe();
    };
  }, []);
}
