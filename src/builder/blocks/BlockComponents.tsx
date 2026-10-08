"use client";

import React, { useEffect, useState } from "react";
import { PageBlock, Breakpoint } from "@/types/project";
import { Post } from "@/types/post";
import { Menu, MenuItem } from "@/types/menu";
import { postsService } from "@/services/postsService";
import { menuService } from "@/services/menuService";
import { resolveLinkHref } from "@/lib/resolveLink";
import { useEditorStore } from "@/store/editorStore";
import { getLocalizedText, resolveResponsiveValue, formatSpacingStyle } from "@/builder/renderer/styleResolver";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight, 
  Sparkles, 
  Shield, 
  Cpu, 
  Image as ImageIcon, 
  TrendingUp, 
  Check, 
  Users, 
  Star, 
  HelpCircle, 
  Send,
  BookOpen,
  CalendarDays
} from "lucide-react";

interface BlockProps {
  block: PageBlock;
  locale: string;
  breakpoint: Breakpoint;
  isEditing?: boolean;
}

export function HeroBlock({ block, locale, breakpoint }: BlockProps) {
  const { content, styles, variant } = block;
  const padding = resolveResponsiveValue(styles?.spacing?.padding, breakpoint);
  const spacingStyle = formatSpacingStyle(padding);

  const title = getLocalizedText(content.title as any, locale) || "Untitled Hero";
  const desc = getLocalizedText(content.description as any, locale);
  const primaryBtn = getLocalizedText(content.primaryButtonText as any, locale);
  const secondaryBtn = getLocalizedText(content.secondaryButtonText as any, locale);
  const badge = getLocalizedText(content.badgeText as any, locale);
  const image = (content.image as string) || "";

  const isSplit = variant === "split";

  return (
    <div style={spacingStyle} className="w-full relative overflow-hidden transition-all duration-200">
      <div className={`mx-auto max-w-5xl ${isSplit ? "grid grid-cols-1 md:grid-cols-2 gap-8 items-center" : "flex flex-col items-center text-center"}`}>
        <div>
          {badge && (
            <div className="inline-flex items-center gap-2 rounded-full border border-fuchsia-500/40 bg-fuchsia-950/30 px-3 py-1 font-mono text-xs text-fuchsia-300 mb-4 shadow-[0_0_15px_rgba(255,0,128,0.2)]">
              <Sparkles className="h-3 w-3 text-fuchsia-400" />
              <span>{badge}</span>
            </div>
          )}
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-b from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
            {title}
          </h1>
          {desc && (
            <p className="mt-4 text-sm sm:text-base text-slate-400 leading-relaxed max-w-2xl mx-auto">
              {desc}
            </p>
          )}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            {primaryBtn && (
              <Button className="bg-gradient-to-r from-fuchsia-600 to-cyan-500 text-black font-semibold shadow-[0_0_20px_rgba(0,240,255,0.3)] hover:opacity-90">
                {primaryBtn} <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
            {secondaryBtn && (
              <Button variant="outline" className="border-slate-700 text-slate-200 hover:bg-slate-900">
                {secondaryBtn}
              </Button>
            )}
          </div>

          {image && !isSplit && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={image}
              alt=""
              className="mt-8 w-full max-w-3xl max-h-80 object-cover rounded-xl border border-cyan-500/30"
            />
          )}
        </div>

        {isSplit && (
          <div className="relative flex items-center justify-center p-8 rounded-xl border border-cyan-500/30 bg-cyan-950/10 backdrop-blur-md overflow-hidden">
            {image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={image} alt="" className="w-full h-64 object-cover rounded-lg" />
            ) : (
              <Cpu className="h-32 w-32 text-cyan-400 animate-pulse" />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export function FeaturesBlock({ block, locale, breakpoint }: BlockProps) {
  const { content, styles } = block;
  const padding = resolveResponsiveValue(styles?.spacing?.padding, breakpoint);
  const spacingStyle = formatSpacingStyle(padding);

  const title = getLocalizedText(content.title as any, locale) || "Features";
  const subtitle = getLocalizedText(content.subtitle as any, locale);
  const items = (content.items as Array<any>) || [];

  return (
    <div style={spacingStyle} className="w-full relative">
      <div className="mx-auto max-w-5xl text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-100 font-mono tracking-wide">{title}</h2>
        {subtitle && <p className="mt-2 text-xs sm:text-sm text-slate-400">{subtitle}</p>}

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {items.map((item, idx) => (
            <div key={idx} className="p-5 rounded-lg border border-slate-800 bg-slate-950/60 backdrop-blur-md hover:border-cyan-500/40 transition-all">
              <div className="h-8 w-8 rounded bg-cyan-950/60 border border-cyan-500/40 flex items-center justify-center text-cyan-400 mb-3">
                <Shield className="h-4 w-4" />
              </div>
              <h3 className="text-sm font-semibold text-cyan-300 font-mono">
                {getLocalizedText(item.title, locale)}
              </h3>
              <p className="mt-1 text-xs text-slate-400">
                {getLocalizedText(item.desc, locale)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ServicesBlock({ block, locale, breakpoint }: BlockProps) {
  const { content, styles } = block;
  const padding = resolveResponsiveValue(styles?.spacing?.padding, breakpoint);
  const spacingStyle = formatSpacingStyle(padding);

  const title = getLocalizedText(content.title as any, locale) || "Our Services";
  const desc = getLocalizedText(content.description as any, locale);

  return (
    <div style={spacingStyle} className="w-full">
      <div className="mx-auto max-w-5xl text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-100 font-mono">{title}</h2>
        {desc && <p className="mt-2 text-xs sm:text-sm text-slate-400">{desc}</p>}
        <div className="mt-6 p-6 rounded-lg border border-slate-800 bg-black/40">
          <p className="text-xs text-slate-500 font-mono">SERVICE MODULES READY FOR DEPLOYMENT</p>
        </div>
      </div>
    </div>
  );
}

export function TextImageBlock({ block, locale, breakpoint }: BlockProps) {
  const { content, styles } = block;
  const padding = resolveResponsiveValue(styles?.spacing?.padding, breakpoint);
  const spacingStyle = formatSpacingStyle(padding);

  const title = getLocalizedText(content.title as any, locale) || "Content Section";
  const desc = getLocalizedText(content.description as any, locale);
  const image = (content.image as string) || "";

  return (
    <div style={spacingStyle} className="w-full">
      <div className="mx-auto max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-100">{title}</h2>
          {desc && <p className="mt-3 text-xs sm:text-sm text-slate-400">{desc}</p>}
        </div>
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt={title}
            className="h-64 w-full object-cover rounded-lg border border-fuchsia-500/20"
          />
        ) : (
          <div className="h-48 rounded-lg border border-fuchsia-500/20 bg-fuchsia-950/20 flex items-center justify-center text-fuchsia-400 font-mono text-xs">
            IMAGE_PREVIEW_CANVAS
          </div>
        )}
      </div>
    </div>
  );
}

export function GalleryBlock({ block, locale, breakpoint }: BlockProps) {
  const { content, styles } = block;
  const padding = resolveResponsiveValue(styles?.spacing?.padding, breakpoint);
  const spacingStyle = formatSpacingStyle(padding);
  const title = getLocalizedText(content.title as any, locale) || "Media Gallery";

  return (
    <div style={spacingStyle} className="w-full text-center">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-2xl font-bold text-slate-100 font-mono mb-6">{title}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="aspect-video rounded-lg border border-slate-800 bg-slate-950/60 flex items-center justify-center text-slate-600 hover:border-cyan-500/40 transition-colors">
              <ImageIcon className="h-6 w-6 text-cyan-400" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function StatisticsBlock({ block, locale, breakpoint }: BlockProps) {
  const { content, styles } = block;
  const padding = resolveResponsiveValue(styles?.spacing?.padding, breakpoint);
  const spacingStyle = formatSpacingStyle(padding);
  const title = getLocalizedText(content.title as any, locale) || "Performance Metrics";

  return (
    <div style={spacingStyle} className="w-full text-center">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-2xl font-bold text-slate-100 font-mono mb-6">{title}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { val: "99.9%", label: "Uptime" },
            { val: "0ms", label: "Cold Start" },
            { val: "10x", label: "Export Speed" },
            { val: "∞", label: "IndexedDB Quota" },
          ].map((stat, i) => (
            <div key={i} className="p-4 rounded-lg border border-cyan-500/30 bg-cyan-950/20">
              <div className="text-2xl sm:text-3xl font-extrabold text-cyan-300 font-mono">{stat.val}</div>
              <div className="text-[11px] text-slate-400 font-mono mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function PricingBlock({ block, locale, breakpoint }: BlockProps) {
  const { content, styles } = block;
  const padding = resolveResponsiveValue(styles?.spacing?.padding, breakpoint);
  const spacingStyle = formatSpacingStyle(padding);
  const title = getLocalizedText(content.title as any, locale) || "Tiered Plans";

  return (
    <div style={spacingStyle} className="w-full text-center">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-100 font-mono mb-8">{title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {[
            { name: "Starter", price: "$0", desc: "For single landing pages" },
            { name: "Pro Matrix", price: "$29", desc: "Unlimited pages & media" },
            { name: "Enterprise", price: "$99", desc: "Dedicated deployment team" },
          ].map((plan, i) => (
            <div key={i} className="p-6 rounded-xl border border-slate-800 bg-black/60 hover:border-fuchsia-500/50 transition-all flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-fuchsia-300 font-mono">{plan.name}</h3>
                <div className="text-3xl font-extrabold text-white font-mono mt-2">{plan.price}</div>
                <p className="text-xs text-slate-400 mt-2">{plan.desc}</p>
              </div>
              <Button size="sm" className="mt-6 w-full bg-slate-900 border border-slate-700 hover:border-fuchsia-500 text-xs">
                Select Plan
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function TeamBlock({ block, locale, breakpoint }: BlockProps) {
  const { content, styles } = block;
  const padding = resolveResponsiveValue(styles?.spacing?.padding, breakpoint);
  const spacingStyle = formatSpacingStyle(padding);
  const title = getLocalizedText(content.title as any, locale) || "Core Architects";

  return (
    <div style={spacingStyle} className="w-full text-center">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-2xl font-bold text-slate-100 font-mono mb-6">{title}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {["Lead Architect", "Frontend Engineer", "UI/UX Specialist"].map((role, i) => (
            <div key={i} className="p-5 rounded-lg border border-slate-800 bg-slate-950/40 text-center">
              <Users className="h-10 w-10 mx-auto text-cyan-400 mb-2" />
              <div className="font-mono text-sm font-semibold text-slate-200">Operator #{i + 1}</div>
              <div className="text-xs text-slate-500 font-mono">{role}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ReviewsBlock({ block, locale, breakpoint }: BlockProps) {
  const { content, styles } = block;
  const padding = resolveResponsiveValue(styles?.spacing?.padding, breakpoint);
  const spacingStyle = formatSpacingStyle(padding);
  const title = getLocalizedText(content.title as any, locale) || "Operator Feedbacks";

  return (
    <div style={spacingStyle} className="w-full text-center">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-2xl font-bold text-slate-100 font-mono mb-6">{title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          {[1, 2].map((i) => (
            <div key={i} className="p-5 rounded-lg border border-slate-800 bg-slate-950/60">
              <div className="flex text-yellow-400 mb-2">
                {[...Array(5)].map((_, idx) => (
                  <Star key={idx} className="h-3.5 w-3.5 fill-current" />
                ))}
              </div>
              <p className="text-xs text-slate-300 italic">
                "The Desktop-First responsive cascade and IndexedDB storage make building multi-page platforms blazing fast."
              </p>
              <div className="mt-3 text-[11px] font-mono text-cyan-300">— Verified Developer</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function FAQBlock({ block, locale, breakpoint }: BlockProps) {
  const { content, styles } = block;
  const padding = resolveResponsiveValue(styles?.spacing?.padding, breakpoint);
  const spacingStyle = formatSpacingStyle(padding);
  const title = getLocalizedText(content.title as any, locale) || "Frequently Asked Questions";

  return (
    <div style={spacingStyle} className="w-full text-left">
      <div className="mx-auto max-w-3xl space-y-4">
        <h2 className="text-2xl font-bold text-slate-100 font-mono text-center mb-6">{title}</h2>
        {[
          { q: "How does Desktop-First cascade work?", a: "Styles flow downwards from Desktop to Tablet to Mobile automatically." },
          { q: "Are static contact forms functional?", a: "Yes, you configure the Action URL for Formspree, Netlify or Getform." },
        ].map((faq, i) => (
          <div key={i} className="p-4 rounded-lg border border-slate-800 bg-black/60">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
              <HelpCircle className="h-4 w-4 text-fuchsia-400" />
              <span>{faq.q}</span>
            </div>
            <p className="mt-2 text-xs text-slate-400 pl-6">{faq.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ContactsBlock({ block, locale, breakpoint }: BlockProps) {
  const { content, styles } = block;
  const padding = resolveResponsiveValue(styles?.spacing?.padding, breakpoint);
  const spacingStyle = formatSpacingStyle(padding);

  const title = getLocalizedText(content.title as any, locale) || "Contact Command";
  const actionUrl = (content.actionUrl as string) || "https://formspree.io/f/demo";

  return (
    <div style={spacingStyle} className="w-full">
      <div className="mx-auto max-w-lg rounded-xl border border-cyan-500/30 bg-black/80 p-6 backdrop-blur-md">
        <h2 className="text-xl font-bold text-cyan-300 font-mono text-center">{title}</h2>
        <form className="mt-4 space-y-3" onSubmit={(e) => e.preventDefault()}>
          <input
            type="email"
            placeholder="operator@system.io"
            className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-xs text-slate-100 focus:border-cyan-400 outline-none"
          />
          <textarea
            rows={3}
            placeholder="Transmission message..."
            className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-xs text-slate-100 focus:border-cyan-400 outline-none resize-none"
          />
          <div className="flex items-center justify-between pt-1">
            <span className="text-[10px] font-mono text-slate-500 truncate max-w-[200px]">
              ACTION: {actionUrl}
            </span>
            <Button size="sm" className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs h-7">
              TRANSMIT
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function FooterBlock({ block, locale, breakpoint }: BlockProps) {
  const { content, styles } = block;
  const padding = resolveResponsiveValue(styles?.spacing?.padding, breakpoint);
  const spacingStyle = formatSpacingStyle(padding);

  return (
    <div style={spacingStyle} className="w-full border-t border-slate-800/80 mt-12 pt-8">
      <div className="mx-auto max-w-5xl flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 font-mono gap-4">
        <div>© 2026 KMS Visual Site Builder // All systems nominal</div>
        <div className="flex gap-4">
          <a href="#" className="hover:text-cyan-300">Privacy</a>
          <a href="#" className="hover:text-cyan-300">Terms</a>
          <a href="#" className="hover:text-cyan-300">Documentation</a>
        </div>
      </div>
    </div>
  );
}

export function CTABlock({ block, locale, breakpoint }: BlockProps) {
  const { content, styles } = block;
  const padding = resolveResponsiveValue(styles?.spacing?.padding, breakpoint);
  const spacingStyle = formatSpacingStyle(padding);

  const title = getLocalizedText(content.title as any, locale) || "Ready to launch?";
  const btnText = getLocalizedText(content.buttonText as any, locale) || "Start Now";

  return (
    <div style={spacingStyle} className="w-full text-center">
      <div className="mx-auto max-w-3xl rounded-xl border border-fuchsia-500/40 bg-gradient-to-b from-fuchsia-950/20 to-black p-8 backdrop-blur-md">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-100 font-mono">{title}</h2>
        <Button className="mt-6 bg-gradient-to-r from-fuchsia-600 to-cyan-500 text-black font-semibold px-6 shadow-[0_0_20px_rgba(255,0,128,0.4)]">
          {btnText} <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export function BlogPreviewBlock({ block, locale, breakpoint }: BlockProps) {
  const { content, styles } = block;
  const padding = resolveResponsiveValue(styles?.spacing?.padding, breakpoint);
  const spacingStyle = formatSpacingStyle(padding);

  const title = getLocalizedText(content.title as any, locale) || "Latest Articles";
  const subtitle = getLocalizedText(content.subtitle as any, locale);
  const limit = typeof content.limit === "number" && content.limit > 0 ? content.limit : 6;

  const [posts, setPosts] = useState<Post[] | null>(null);

  useEffect(() => {
    let alive = true;
    postsService
      .getPublished()
      .then((list) => {
        if (alive) setPosts(list.slice(0, limit));
      })
      .catch(() => {
        if (alive) setPosts([]);
      });
    return () => {
      alive = false;
    };
  }, [limit]);

  return (
    <div style={spacingStyle} className="w-full">
      <div className="mx-auto max-w-5xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-fuchsia-500/40 bg-fuchsia-950/30 px-3 py-1 font-mono text-xs text-fuchsia-300 mb-3">
            <BookOpen className="h-3 w-3" />
            <span>BLOG_FEED</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-100 font-mono">{title}</h2>
          {subtitle && <p className="mt-2 text-xs sm:text-sm text-slate-400">{subtitle}</p>}
        </div>

        {posts === null ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 rounded-lg border border-slate-800 bg-slate-950/60 animate-pulse" />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="p-8 rounded-lg border border-dashed border-slate-800 text-center text-xs font-mono text-slate-500">
            NO_PUBLISHED_ARTICLES // CREATE THEM IN /posts
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {posts.map((post) => (
              <article
                key={post.id}
                className="overflow-hidden rounded-lg border border-slate-800 bg-slate-950/60 hover:border-cyan-500/40 transition-all flex flex-col"
              >
                {post.cover ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={post.cover} alt={getLocalizedText(post.title, locale)} className="h-32 w-full object-cover" />
                ) : (
                  <div className="h-32 w-full bg-gradient-to-br from-fuchsia-950/40 to-cyan-950/40 flex items-center justify-center">
                    <BookOpen className="h-8 w-8 text-cyan-400/60" />
                  </div>
                )}
                <div className="p-4 flex flex-col flex-1">
                  <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500">
                    {post.categoryIds[0] && (
                      <span className="uppercase text-cyan-400">#{post.categoryIds[0]}</span>
                    )}
                    {post.publishedAt && (
                      <span className="inline-flex items-center gap-1">
                        <CalendarDays className="h-3 w-3" />
                        {new Date(post.publishedAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  <h3 className="mt-2 text-sm font-semibold text-slate-100 line-clamp-2">
                    {getLocalizedText(post.title, locale)}
                  </h3>
                  <p className="mt-1 text-xs text-slate-400 line-clamp-3 flex-1">
                    {getLocalizedText(post.excerpt, locale)}
                  </p>
                  <span className="mt-3 inline-flex items-center gap-1 text-[11px] font-mono text-cyan-300 hover:text-cyan-200">
                    READ_MORE <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function HeaderBlock({ block, locale, breakpoint, isEditing }: BlockProps) {
  const { content, styles } = block;
  const padding = resolveResponsiveValue(styles?.spacing?.padding, breakpoint);
  const spacingStyle = formatSpacingStyle(padding);

  const pages = useEditorStore((s) => s.project.pages);
  const [menu, setMenu] = useState<Menu | null>(null);

  useEffect(() => {
    let alive = true;
    menuService
      .getMain()
      .then((m) => {
        if (alive) setMenu(m);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  const brand = getLocalizedText(content.title as any, locale) || "KMS::CMS";

  const items: MenuItem[] =
    menu && menu.items.length > 0
      ? menu.items
      : pages.map((p) => ({
          id: `auto_${p.id}`,
          label: { ru: p.title, en: p.title, uz: p.title },
          link: { type: "page" as const, pageId: p.id },
        }));

  return (
    <div
      style={spacingStyle}
      className="w-full border-b border-slate-800/80 bg-black/40 backdrop-blur-md"
    >
      <div className="mx-auto max-w-6xl flex items-center justify-between gap-4 px-4 py-3">
        <div className="flex items-center gap-2 text-cyan-400 font-mono font-bold text-sm">
          <Cpu className="h-4 w-4" />
          <span className="truncate">{brand}</span>
        </div>
        <nav className="flex flex-wrap items-center justify-end gap-1 sm:gap-2 text-xs font-mono">
          {items.map((item) => {
            const href = resolveLinkHref(item.link, pages);
            return (
              <a
                key={item.id}
                href={href}
                target={item.link?.openInNewTab ? "_blank" : undefined}
                rel="noreferrer"
                onClick={(e) => {
                  if (isEditing) e.preventDefault();
                }}
                className="px-2 py-1 rounded text-slate-400 hover:text-cyan-300 hover:bg-slate-900 transition-colors"
              >
                {getLocalizedText(item.label, locale)}
              </a>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
