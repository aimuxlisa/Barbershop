import { get, set } from "idb-keyval";
import { Post } from "@/types/post";

const POSTS_KEY = "cms_posts";

const seedPosts: Post[] = [
  {
    id: "post_1",
    slug: "future-of-visual-builders",
    title: {
      ru: "Будущее визуальных конструкторов: IndexedDB и Jamstack",
      en: "The Future of Visual Builders: IndexedDB & Jamstack",
      uz: "Veb-konstruktorlarning kelajagi",
    },
    excerpt: {
      ru: "Как избавиться от серверной базы данных и ограничений LocalStorage.",
      en: "How to eliminate database servers and LocalStorage limits.",
      uz: "LocalStorage cheklovlaridan qutilish usullari.",
    },
    categoryIds: ["architecture"],
    blocks: [],
    status: "published",
    publishedAt: new Date().toISOString(),
    seo: {},
  },
  {
    id: "post_2",
    slug: "desktop-first-responsive-design",
    title: {
      ru: "Почему Desktop-First адаптивность удобнее для веб-дизайнеров",
      en: "Why Desktop-First Cascades are Superior for Web Designers",
      uz: "Desktop-First moslashuvchanlik",
    },
    excerpt: {
      ru: "Глубокий разбор логики desktop -> tablet -> mobile.",
      en: "Deep dive into desktop -> tablet -> mobile inheritance.",
      uz: "Kaskad merosi tahlili.",
    },
    categoryIds: ["design"],
    blocks: [],
    status: "published",
    publishedAt: new Date().toISOString(),
    seo: {},
  },
];

export class PostsService {
  async getAll(): Promise<Post[]> {
    try {
      const list = await get<Post[]>(POSTS_KEY);
      if (!Array.isArray(list)) {
        await set(POSTS_KEY, seedPosts);
        return [...seedPosts];
      }
      return list;
    } catch {
      return [...seedPosts];
    }
  }

  async saveAll(posts: Post[]): Promise<void> {
    try {
      await set(POSTS_KEY, posts);
    } catch {
      // Quota exceeded or corrupted storage — silently keep working in memory
    }
  }

  async getPublished(): Promise<Post[]> {
    const all = await this.getAll();
    return all.filter((p) => p.status === "published");
  }
}

export const postsService = new PostsService();
