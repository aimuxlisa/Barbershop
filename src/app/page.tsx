"use client";

import Link from "next/link";
import { 
  Layers, 
  Sparkles, 
  Cpu, 
  Database, 
  Monitor, 
  Smartphone, 
  Tablet, 
  ArrowRight,
  ShieldCheck,
  Zap,
  HardDrive
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function HomePage() {
  return (
    <main className="hud-grid relative min-h-screen flex flex-col justify-between p-6 md:p-12 overflow-hidden bg-[#07070c]">
      {/* Glow Orbs */}
      <div className="absolute top-1/4 left-1/4 -z-10 h-96 w-96 rounded-full bg-fuchsia-600/15 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 -z-10 h-96 w-96 rounded-full bg-cyan-500/15 blur-[120px] pointer-events-none" />

      {/* Top HUD Nav */}
      <header className="flex items-center justify-between border-b border-cyan-500/20 pb-4 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-cyan-400 bg-cyan-950/40 text-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.4)]">
            <Cpu className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <h1 className="font-mono text-lg font-bold tracking-wider text-cyan-300">
              KMS<span className="text-fuchsia-500">::</span>CONTROL_CENTER
            </h1>
            <p className="font-mono text-xs text-muted-foreground">VISUAL SITE BUILDER ARCHITECTURE v2.0</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/20 px-3 py-1 font-mono text-xs text-emerald-400">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            CORE_ONLINE
          </div>
          <Link href="/editor/demo">
            <Button className="bg-gradient-to-r from-fuchsia-600 to-cyan-500 text-black font-semibold hover:opacity-90 transition-all shadow-[0_0_20px_rgba(255,0,128,0.4)]">
              LAUNCH BUILDER <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Center Hero Section */}
      <section className="my-auto py-12 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-fuchsia-500/30 bg-fuchsia-950/30 px-4 py-1.5 font-mono text-xs text-fuchsia-300 mb-6 shadow-[0_0_15px_rgba(255,0,128,0.2)]">
          <Sparkles className="h-3.5 w-3.5 text-fuchsia-400" />
          <span>CYBERPUNK HIGH-TECH CMS ENGINE</span>
        </div>

        <h2 className="max-w-4xl text-4xl sm:text-6xl font-extrabold tracking-tight bg-gradient-to-b from-white via-slate-200 to-slate-500 bg-clip-text text-transparent">
          Architectural Foundation for Multi-Page Sites
        </h2>
        
        <p className="mt-4 max-w-2xl text-slate-400 text-sm sm:text-base leading-relaxed">
          State-of-the-art block-based visual builder with IndexedDB persistent memory, 
          Desktop-First responsive cascades, universal link mapping, and static export.
        </p>

        {/* Feature Grid */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl text-left">
          <Card className="border-cyan-500/30 bg-black/60 backdrop-blur-md shadow-[0_0_15px_rgba(0,240,255,0.08)]">
            <CardHeader>
              <div className="h-8 w-8 rounded bg-cyan-950/60 border border-cyan-500/40 flex items-center justify-center text-cyan-400 mb-2">
                <HardDrive className="h-4 w-4" />
              </div>
              <CardTitle className="text-cyan-300 text-lg font-mono">IndexedDB Storage</CardTitle>
              <CardDescription className="text-slate-400 text-xs">
                Unlimited media and schema storage via idb-keyval, eliminating 5MB LocalStorage limits.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-fuchsia-500/30 bg-black/60 backdrop-blur-md shadow-[0_0_15px_rgba(255,0,128,0.08)]">
            <CardHeader>
              <div className="h-8 w-8 rounded bg-fuchsia-950/60 border border-fuchsia-500/40 flex items-center justify-center text-fuchsia-400 mb-2">
                <Monitor className="h-4 w-4" />
              </div>
              <CardTitle className="text-fuchsia-300 text-lg font-mono">Desktop-First Cascade</CardTitle>
              <CardDescription className="text-slate-400 text-xs">
                Intuitive style inheritance flowing downwards: Desktop &rarr; Tablet &rarr; Mobile.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-blue-500/30 bg-black/60 backdrop-blur-md shadow-[0_0_15px_rgba(59,130,246,0.08)]">
            <CardHeader>
              <div className="h-8 w-8 rounded bg-blue-950/60 border border-blue-500/40 flex items-center justify-center text-blue-400 mb-2">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <CardTitle className="text-blue-300 text-lg font-mono">Project Backup & Export</CardTitle>
              <CardDescription className="text-slate-400 text-xs">
                One-click JSON project backups, Formspree Action URLs, and static ZIP bundles.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Footer Status Feed */}
      <footer className="flex flex-col sm:flex-row items-center justify-between border-t border-slate-800 pt-4 font-mono text-xs text-muted-foreground gap-2">
        <div className="flex items-center gap-2">
          <Zap className="h-3.5 w-3.5 text-yellow-400" />
          <span>PHASE 0: BOOTSTRAP COMPLETE</span>
        </div>
        <div>
          <span>Visual Site Builder &bull; Built with Next.js & Tailwind</span>
        </div>
      </footer>
    </main>
  );
}
