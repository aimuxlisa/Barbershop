import { LinkConfig, Page } from "@/types/project";

/**
 * Resolves a LinkControl config to a concrete href.
 * - app mode: internal pages open via the /view/[slug] route
 * - export mode: internal pages map to exported .html files
 */
export function resolveLinkHref(
  link: LinkConfig | undefined,
  pages: Page[],
  mode: "app" | "export" = "app"
): string {
  if (!link) return "#";

  if (link.type === "page") {
    const page = pages.find((p) => p.id === link.pageId);
    if (!page) return "#";
    if (mode === "export") {
      return page.slug === "index" || page.slug === "" ? "./" : `./${page.slug}.html`;
    }
    return `/view/${page.slug}`;
  }

  if (link.type === "tel") return `tel:${link.url || ""}`;
  if (link.type === "email") return `mailto:${link.url || ""}`;

  return link.url || "#";
}
