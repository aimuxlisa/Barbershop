import { PageBlock } from "@/types/project";
import { blockRegistry } from "@/builder/registry/blockRegistry";

export interface PageTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  createBlocks: () => PageBlock[];
}

export const templates: PageTemplate[] = [
  {
    id: "tpl_landing",
    name: "Cyber Landing",
    description: "Full conversion page with Hero, Features, Stats, CTA & Footer",
    category: "Landing",
    createBlocks: () => [
      blockRegistry.createBlock("hero", "centered")!,
      blockRegistry.createBlock("features", "grid")!,
      blockRegistry.createBlock("statistics", "default")!,
      blockRegistry.createBlock("cta", "default")!,
      blockRegistry.createBlock("footer", "default")!,
    ],
  },
  {
    id: "tpl_corporate",
    name: "Corporate / Business",
    description: "Professional corporate layout with Services, Team and Reviews",
    category: "Business",
    createBlocks: () => [
      blockRegistry.createBlock("hero", "split")!,
      blockRegistry.createBlock("services", "default")!,
      blockRegistry.createBlock("team", "default")!,
      blockRegistry.createBlock("reviews", "default")!,
      blockRegistry.createBlock("footer", "default")!,
    ],
  },
  {
    id: "tpl_contacts",
    name: "Contacts & FAQ",
    description: "Contact form with Formspree action and FAQ accordion",
    category: "Support",
    createBlocks: () => [
      blockRegistry.createBlock("hero", "centered")!,
      blockRegistry.createBlock("contacts", "default")!,
      blockRegistry.createBlock("faq", "default")!,
      blockRegistry.createBlock("footer", "default")!,
    ],
  },
];
