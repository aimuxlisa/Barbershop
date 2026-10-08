import { LocalizedText, LinkConfig } from "@/types/project";

export interface MenuItem {
  id: string;
  label: LocalizedText;
  link: LinkConfig;
}

export interface Menu {
  id: string;
  name: string;
  items: MenuItem[];
}
