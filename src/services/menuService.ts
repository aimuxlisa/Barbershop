import { get, set } from "idb-keyval";
import { Menu, MenuItem } from "@/types/menu";

const MENUS_KEY = "cms_menus";

export const defaultMenu: Menu = {
  id: "main",
  name: "Main Menu",
  items: [],
};

export class MenuService {
  async getAll(): Promise<Menu[]> {
    try {
      const list = await get<Menu[]>(MENUS_KEY);
      if (!Array.isArray(list)) return [{ ...defaultMenu, items: [] }];
      return list;
    } catch {
      return [{ ...defaultMenu, items: [] }];
    }
  }

  async getMain(): Promise<Menu> {
    const menus = await this.getAll();
    return menus.find((m) => m.id === "main") || { ...defaultMenu, items: [] };
  }

  async saveMenu(menu: Menu): Promise<void> {
    try {
      const menus = await this.getAll();
      const updated = [menu, ...menus.filter((m) => m.id !== menu.id)];
      await set(MENUS_KEY, updated);
    } catch {
      // Quota exceeded — menu stays in memory for the current session
    }
  }

  createItem(label: string): MenuItem {
    return {
      id: `mi_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      label: { ru: label, en: label, uz: label },
      link: { type: "url", url: "#", openInNewTab: false },
    };
  }
}

export const menuService = new MenuService();
