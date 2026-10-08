import { LocalizedText, PageSEO } from "@/types/project";

export interface ArticleBlock {
  id: string;
  type: "paragraph" | "heading" | "image" | "quote" | "list" | "code";
  content: Record<string, unknown>;
}

export interface Post {
  id: string;
  slug: string;
  title: LocalizedText;
  excerpt: LocalizedText;
  cover?: string;
  categoryIds: string[];
  blocks: ArticleBlock[];
  status: "draft" | "published";
  publishedAt?: string;
  seo: PageSEO;
}
