import JSZip from "jszip";
import { SiteProject, Page, PageBlock } from "@/types/project";
import { Post } from "@/types/post";
import { Menu, MenuItem } from "@/types/menu";
import { getLocalizedText } from "@/builder/renderer/styleResolver";
import { postsService } from "@/services/postsService";
import { menuService } from "@/services/menuService";
import { resolveLinkHref } from "@/lib/resolveLink";

interface ExportContext {
  posts: Post[];
  menu: Menu | null;
}

export class ExportService {
  /**
   * Public async renderer: resolves dynamic data (posts, menu) and renders the page HTML
   */
  async renderPageHtml(page: Page, project: SiteProject, locale: string): Promise<string> {
    const ctx = await this.loadContext();
    return this.renderPageToHtml(page, project, locale, ctx);
  }

  private async loadContext(): Promise<ExportContext> {
    try {
      const [posts, menu] = await Promise.all([postsService.getAll(), menuService.getMain()]);
      return { posts, menu: menu.items.length > 0 ? menu : null };
    } catch {
      return { posts: [], menu: null };
    }
  }

  /**
   * Generates pure standalone HTML for a page
   */
  private renderPageToHtml(page: Page, project: SiteProject, locale: string, ctx: ExportContext): string {
    const pageTitle = getLocalizedText(page.seo?.title, locale) || page.title;
    const pageDesc = getLocalizedText(page.seo?.description, locale) || "";
    const canonical = page.seo?.canonical || "";
    const ogTitle = getLocalizedText(page.seo?.ogTitle, locale) || pageTitle;
    const ogDesc = getLocalizedText(page.seo?.ogDescription, locale) || pageDesc;
    const ogImage = page.seo?.ogImage || "";
    const noIndex = Boolean(page.seo?.noIndex);

    const blocksHtml = page.blocks
      .map((block) => this.renderBlockToHtml(block, project, locale, ctx))
      .join("\n");

    return `<!DOCTYPE html>
<html lang="${locale}" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(pageTitle)}</title>
  <meta name="description" content="${escapeHtml(pageDesc)}">
  ${noIndex ? `<meta name="robots" content="noindex, nofollow">` : ""}
  ${canonical ? `<link rel="canonical" href="${escapeHtml(canonical)}">` : ""}
  <!-- OpenGraph -->
  <meta property="og:title" content="${escapeHtml(ogTitle)}">
  <meta property="og:description" content="${escapeHtml(ogDesc)}">
  <meta property="og:type" content="website">
  ${ogImage ? `<meta property="og:image" content="${escapeHtml(ogImage)}">` : ""}
  <!-- Styles -->
  <link rel="stylesheet" href="assets/styles.css">
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          colors: {
            brand: '${project.globalStyles?.colors?.primary || "#ff0080"}',
            accent: '${project.globalStyles?.colors?.secondary || "#00f0ff"}'
          }
        }
      }
    }
  </script>
</head>
<body class="min-h-screen bg-[#07070c] text-slate-100 font-sans antialiased">
  <div class="max-w-6xl mx-auto px-4 py-8 space-y-12">
    ${blocksHtml}
  </div>
</body>
</html>`;
  }

  /**
   * Generates clean HTML for an individual block with Action URLs and LinkControl resolution
   */
  private renderBlockToHtml(block: PageBlock, project: SiteProject, locale: string, ctx: ExportContext = { posts: [], menu: null }): string {
    const { content, type, variant } = block;
    const title = escapeHtml(getLocalizedText(content.title as any, locale));
    const desc = escapeHtml(getLocalizedText(content.description as any, locale));

    if (type === "hero") {
      const btnText = escapeHtml(getLocalizedText(content.primaryButtonText as any, locale));
      const btnLink = (content.primaryButtonLink as any)?.url || "#";
      const badge = escapeHtml(getLocalizedText(content.badgeText as any, locale));

      return `
      <section class="py-16 text-center">
        ${badge ? `<div class="inline-block rounded-full border border-fuchsia-500/40 bg-fuchsia-950/30 px-3 py-1 text-xs text-fuchsia-300 mb-4">${badge}</div>` : ""}
        <h1 class="text-4xl sm:text-6xl font-extrabold text-white tracking-tight">${title}</h1>
        ${desc ? `<p class="mt-4 text-base text-slate-400 max-w-2xl mx-auto">${desc}</p>` : ""}
        ${btnText ? `<div class="mt-8"><a href="${btnLink}" class="inline-block rounded-lg bg-gradient-to-r from-fuchsia-600 to-cyan-500 px-6 py-3 font-semibold text-black hover:opacity-90 transition-all">${btnText}</a></div>` : ""}
      </section>`;
    }

    if (type === "contacts") {
      const actionUrl = (content.actionUrl as string) || "https://formspree.io/f/demo";
      return `
      <section class="py-12 max-w-lg mx-auto rounded-xl border border-cyan-500/30 bg-black/60 p-6 backdrop-blur-md">
        <h2 class="text-2xl font-bold text-cyan-300 font-mono text-center mb-6">${title || "Contact Us"}</h2>
        <form action="${escapeHtml(actionUrl)}" method="POST" class="space-y-4">
          <div>
            <label class="block text-xs font-mono text-slate-400 mb-1">Email</label>
            <input type="email" name="email" required class="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-xs text-white focus:border-cyan-400 outline-none" placeholder="operator@system.io">
          </div>
          <div>
            <label class="block text-xs font-mono text-slate-400 mb-1">Message</label>
            <textarea name="message" rows="4" required class="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-xs text-white focus:border-cyan-400 outline-none resize-none" placeholder="Enter transmission..."></textarea>
          </div>
          <button type="submit" class="w-full rounded bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs py-2.5 transition-colors">TRANSMIT (POST)</button>
        </form>
      </section>`;
    }

    if (type === "header") {
      const brand = title || "KMS::CMS";
      const menuItems: MenuItem[] = ctx.menu
        ? ctx.menu.items
        : project.pages.map((p) => ({
            id: `auto_${p.id}`,
            label: { ru: p.title, en: p.title, uz: p.title },
            link: { type: "page" as const, pageId: p.id },
          }));
      const links = menuItems
        .map((it) => {
          const href = escapeHtml(resolveLinkHref(it.link, project.pages, "export"));
          const label = escapeHtml(getLocalizedText(it.label, locale));
          const target = it.link?.openInNewTab ? ' target="_blank" rel="noopener noreferrer"' : "";
          return `<a href="${href}"${target} class="px-3 py-1.5 rounded text-slate-400 hover:text-cyan-300 transition-colors">${label}</a>`;
        })
        .join("");

      return `
  <header class="border-b border-slate-800/80 bg-black/40 backdrop-blur-md">
    <div class="max-w-6xl mx-auto flex items-center justify-between gap-4 px-4 py-3">
      <div class="text-cyan-400 font-mono font-bold text-sm">${brand}</div>
      <nav class="flex flex-wrap items-center justify-end gap-1 text-xs font-mono">${links}</nav>
    </div>
  </header>`;
    }

    if (type === "features") {
      const items = (content.items as any[]) || [];
      const itemsHtml = items
        .map(
          (it) => `
        <div class="p-5 rounded-lg border border-slate-800 bg-slate-950/60">
          <h3 class="text-sm font-semibold text-cyan-300 font-mono">${escapeHtml(getLocalizedText(it.title, locale))}</h3>
          <p class="mt-1 text-xs text-slate-400">${escapeHtml(getLocalizedText(it.desc, locale))}</p>
        </div>`
        )
        .join("");

      return `
      <section class="py-12 text-center">
        <h2 class="text-3xl font-bold text-white font-mono">${title}</h2>
        <div class="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">${itemsHtml}</div>
      </section>`;
    }

    if (type === "cta") {
      const btnText = escapeHtml(getLocalizedText(content.buttonText as any, locale) || "Get Started");
      return `
      <section class="py-12 text-center rounded-xl border border-fuchsia-500/40 bg-fuchsia-950/20 p-8">
        <h2 class="text-3xl font-bold text-white font-mono">${title}</h2>
        <a href="#" class="mt-6 inline-block rounded-lg bg-gradient-to-r from-fuchsia-600 to-cyan-500 px-6 py-3 font-semibold text-black">${btnText}</a>
      </section>`;
    }

    if (type === "footer") {
      return `
      <footer class="border-t border-slate-800 pt-8 mt-12 text-center text-xs text-slate-500 font-mono">
        © 2026 KMS Visual Site Builder // Pure Static Export
      </footer>`;
    }

    if (type === "blog_preview") {
      const limit = typeof content.limit === "number" && content.limit > 0 ? content.limit : 6;
      const cards = ctx.posts
        .filter((p) => p.status === "published")
        .slice(0, limit)
        .map((p) => {
          const cardTitle = escapeHtml(getLocalizedText(p.title, locale));
          const excerpt = escapeHtml(getLocalizedText(p.excerpt, locale));
          const date = p.publishedAt ? new Date(p.publishedAt).toLocaleDateString() : "";
          const category = p.categoryIds[0] ? `#${escapeHtml(p.categoryIds[0])}` : "";
          const cover = p.cover
            ? `<img src="${escapeHtml(p.cover)}" alt="${cardTitle}" class="h-32 w-full object-cover">`
            : `<div class="h-32 w-full bg-gradient-to-br from-fuchsia-950/40 to-cyan-950/40"></div>`;
          return `
        <article class="overflow-hidden rounded-lg border border-slate-800 bg-slate-950/60">
          ${cover}
          <div class="p-4">
            <div class="flex items-center gap-2 text-[10px] font-mono text-slate-500">
              ${category ? `<span class="uppercase text-cyan-400">${category}</span>` : ""}
              <span>${date}</span>
            </div>
            <h3 class="mt-2 text-sm font-semibold text-slate-100">${cardTitle}</h3>
            <p class="mt-1 text-xs text-slate-400">${excerpt}</p>
          </div>
        </article>`;
        })
        .join("");

      return `
      <section class="py-12 text-center">
        <h2 class="text-3xl font-bold text-white font-mono">${title}</h2>
        <div class="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">${cards}</div>
      </section>`;
    }

    return `<section class="py-8 text-center"><h2 class="text-xl font-bold text-white">${title}</h2></section>`;
  }

  /**
   * Generates complete static ZIP package containing all pages, SEO, sitemap and robots.txt
   */
  async exportToZip(project: SiteProject, locale: string = "ru"): Promise<Blob> {
    const zip = new JSZip();
    const ctx = await this.loadContext();
    const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://example.com").replace(/\/+$/, "");

    // 1. Render all published pages
    project.pages.forEach((page) => {
      const html = this.renderPageToHtml(page, project, locale, ctx);
      if (page.slug === "index" || page.slug === "") {
        zip.file("index.html", html);
      } else {
        zip.file(`${page.slug}.html`, html);
      }
    });

    // 2. assets/styles.css
    const css = `
      :root {
        --primary: ${project.globalStyles?.colors?.primary || "#ff0080"};
        --secondary: ${project.globalStyles?.colors?.secondary || "#00f0ff"};
      }
      body { background-color: #07070c; color: #f8fafc; font-family: sans-serif; }
    `;
    zip.file("assets/styles.css", css);

    // 3. sitemap.xml
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${project.pages
  .map(
    (p) => `  <url>
    <loc>${siteUrl}/${p.slug === "index" ? "" : p.slug + ".html"}</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
  </url>`
  )
  .join("\n")}
</urlset>`;
    zip.file("sitemap.xml", sitemap);

    // 4. robots.txt
    const robots = `User-agent: *\nAllow: /\nSitemap: ${siteUrl}/sitemap.xml\n`;
    zip.file("robots.txt", robots);

    return await zip.generateAsync({ type: "blob" });
  }

  /**
   * Trigger direct browser download of the export ZIP
   */
  async downloadExportZip(project: SiteProject, locale: string = "ru"): Promise<void> {
    if (typeof window === "undefined") return;
    const blob = await this.exportToZip(project, locale);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${project.name.toLowerCase().replace(/\s+/g, "-")}-static-export.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

function escapeHtml(str?: string) {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export const exportService = new ExportService();
