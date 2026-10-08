"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, BookOpen, Trash2, Edit3, Check, Save, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Post } from "@/types/post";
import { postsService } from "@/services/postsService";
import { ArticleEditor } from "@/components/editor/ArticleEditor";
import { ImageControl } from "@/components/controls/ImageControl";

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newTitle, setNewTitle] = useState("");
  const [newSlug, setNewSlug] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    postsService
      .getAll()
      .then((list) => {
        if (alive) setPosts(list);
      })
      .finally(() => {
        if (alive) setIsLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  const persist = (next: Post[]) => {
    setPosts(next);
    void postsService.saveAll(next);
  };

  const handleAddPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newSlug.trim()) return;

    const newPost: Post = {
      id: `post_${Date.now()}`,
      slug: newSlug.trim().toLowerCase().replace(/\s+/g, "-"),
      title: { ru: newTitle, en: newTitle, uz: newTitle },
      excerpt: { ru: "Новая статья", en: "New article", uz: "Yangi maqola" },
      categoryIds: ["general"],
      blocks: [],
      status: "draft",
      seo: {},
    };

    persist([newPost, ...posts]);
    setNewTitle("");
    setNewSlug("");
  };

  const handleDelete = (id: string) => {
    persist(posts.filter((p) => p.id !== id));
  };

  const handleToggleStatus = (id: string) => {
    persist(
      posts.map((p) =>
        p.id === id
          ? {
              ...p,
              status: p.status === "published" ? "draft" : "published",
              publishedAt: p.status === "published" ? undefined : new Date().toISOString(),
            }
          : p
      )
    );
  };

  const startEdit = (post: Post) => {
    setEditingId(post.id);
    setEditingTitle(post.title.ru);
  };

  const handleBlocks = (id: string, blocks: Post["blocks"]) => {
    persist(posts.map((p) => (p.id === id ? { ...p, blocks } : p)));
  };

  const handleCover = (id: string, cover: string) => {
    persist(posts.map((p) => (p.id === id ? { ...p, cover: cover || undefined } : p)));
  };

  const commitEdit = (id: string) => {
    const title = editingTitle.trim();
    if (title) {
      persist(
        posts.map((p) =>
          p.id === id
            ? { ...p, title: { ...p.title, ru: title, en: title, uz: title } }
            : p
        )
      );
    }
    setEditingId(null);
    setEditingTitle("");
  };

  return (
    <div className="min-h-screen bg-[#07070c] text-slate-100 p-6 sm:p-12 font-sans">
      {/* Header */}
      <header className="max-w-4xl mx-auto flex items-center justify-between border-b border-cyan-500/20 pb-4 mb-8">
        <div className="flex items-center gap-3">
          <Link href="/editor/demo">
            <Button size="sm" variant="outline" className="h-8 border-slate-800 text-slate-300 hover:text-cyan-300 font-mono text-xs">
              <ArrowLeft className="h-3.5 w-3.5 mr-1" /> EDITOR
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-fuchsia-400" />
            <h1 className="text-lg font-bold font-mono text-cyan-300">POSTS_&_BLOG_ENGINE</h1>
          </div>
        </div>
        <span className="text-[10px] font-mono text-slate-500">
          {isLoading ? "LOADING_INDEXEDDB..." : "SYNCED // INDEXEDDB"}
        </span>
      </header>

      <main className="max-w-4xl mx-auto space-y-8">
        {/* Create Form */}
        <form onSubmit={handleAddPost} className="p-5 rounded-xl border border-slate-800 bg-black/60 space-y-3">
          <h2 className="text-sm font-bold font-mono text-fuchsia-300">CREATE_NEW_ARTICLE</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Article title..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded px-3 py-2 text-xs text-white focus:border-cyan-400 outline-none"
            />
            <input
              type="text"
              placeholder="Slug (e.g. jamstack-future)"
              value={newSlug}
              onChange={(e) => setNewSlug(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded px-3 py-2 text-xs text-white focus:border-cyan-400 outline-none font-mono"
            />
          </div>
          <Button size="sm" type="submit" className="bg-gradient-to-r from-fuchsia-600 to-cyan-500 text-black font-semibold text-xs h-8">
            <Plus className="h-3.5 w-3.5 mr-1" /> Create Article
          </Button>
        </form>

        {/* Posts List */}
        <div className="space-y-4">
          <h2 className="text-xs font-mono uppercase text-slate-500 tracking-wider">
            Articles ({posts.length})
          </h2>
          <div className="space-y-3">
            {posts.map((post) => (
              <div
                key={post.id}
                className="rounded-xl border border-slate-800/80 bg-slate-950/60 hover:border-cyan-500/40 transition-all"
              >
                <div className="p-5 flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 rounded">
                      /{post.slug}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">
                      BLOCKS ({post.blocks.length})
                    </span>
                    <button
                      onClick={() => handleToggleStatus(post.id)}
                      className={`text-[10px] font-mono px-2 py-0.5 rounded border transition-colors ${
                        post.status === "published"
                          ? "bg-emerald-950 text-emerald-300 border-emerald-500/30 hover:border-emerald-400"
                          : "bg-slate-900 text-slate-400 border-slate-700 hover:border-slate-500"
                      }`}
                      title="Toggle draft / published"
                    >
                      {post.status === "published" ? "PUBLISHED" : "DRAFT"}
                    </button>
                    {post.publishedAt && (
                      <span className="text-xs text-slate-500 font-mono">
                        {new Date(post.publishedAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>

                  {editingId === post.id ? (
                    <div className="mt-2 flex items-center gap-2">
                      <input
                        type="text"
                        value={editingTitle}
                        onChange={(e) => setEditingTitle(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") commitEdit(post.id);
                          if (e.key === "Escape") setEditingId(null);
                        }}
                        autoFocus
                        className="flex-1 bg-slate-900 border border-cyan-500/50 rounded px-2 py-1.5 text-sm text-white outline-none"
                      />
                      <button
                        onClick={() => commitEdit(post.id)}
                        className="p-1.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-900/60"
                        title="Save title"
                      >
                        <Save className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="p-1.5 rounded hover:bg-slate-800 text-slate-400"
                        title="Cancel"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <h3 className="text-base font-semibold text-slate-100 mt-2">{post.title.ru}</h3>
                  )}
                  <p className="text-xs text-slate-400 mt-1">{post.excerpt.ru}</p>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => setOpenId(openId === post.id ? null : post.id)}
                    className={`p-1.5 rounded transition-colors hover:bg-slate-800 ${
                      openId === post.id
                        ? "text-cyan-400 bg-slate-800"
                        : "text-slate-500 hover:text-cyan-400"
                    }`}
                    title="Edit article content"
                  >
                    <Layers className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => startEdit(post)}
                    className="p-1.5 rounded hover:bg-slate-800 text-slate-500 hover:text-cyan-400 transition-colors"
                    title="Edit title"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="p-1.5 rounded hover:bg-slate-800 text-slate-500 hover:text-red-400 transition-colors"
                    title="Delete Article"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                </div>

                {openId === post.id && (
                  <div className="border-t border-slate-800 p-5 space-y-3">
                    <ImageControl
                      label="Cover image"
                      value={post.cover}
                      onChange={(url) => handleCover(post.id, url)}
                    />
                    <ArticleEditor
                      blocks={post.blocks}
                      onChange={(blocks) => handleBlocks(post.id, blocks)}
                    />
                  </div>
                )}
              </div>
            ))}

            {!isLoading && posts.length === 0 && (
              <div className="p-8 rounded-xl border border-dashed border-slate-800 text-center text-xs font-mono text-slate-500">
                NO_ARTICLES_YET // CREATE THE FIRST ONE ABOVE
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
