"use client";

import { useState, useEffect } from "react";
import { useCanvasState, SectionId } from "@/lib/canvas-state";
import { PROFILE } from "@/data/profile";

const SCENES: { id: SectionId; num: string; label: string }[] = [
  { id: "entry", num: "01", label: "INDEX" },
  { id: "work", num: "02", label: "WORK" },
  { id: "lab", num: "03", label: "LAB" },
  { id: "capabilities", num: "04", label: "CAPABILITIES" },
  { id: "about", num: "05", label: "ABOUT" },
  { id: "contact", num: "06", label: "CONTACT" },
];

export function HUDNav() {
  const { activeSection, isReady } = useCanvasState();
  const [mounted, setMounted] = useState(false);
  const [quickNavOpen, setQuickNavOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      setQuickNavOpen(false);
    }
  };

  if (!mounted || !isReady) return null;

  return (
    <header className="fixed top-0 left-0 right-0 z-40 p-6 md:px-12 flex justify-between items-center pointer-events-none select-none">
      {/* Top Left Minimal Brand Token */}
      <div className="pointer-events-auto flex items-center gap-3">
        <button
          onClick={() => scrollTo("entry")}
          className="group flex items-center gap-2 text-left focus:outline-none focus:ring-1 focus:ring-accent rounded p-1"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-accent group-hover:scale-125 transition-transform" />
          <span className="font-mono text-xs tracking-widest text-zinc-300 group-hover:text-white font-semibold">
            {PROFILE.shortName}
          </span>
          <span className="hidden sm:inline text-[10px] font-mono text-muted tracking-wider">
            / 2026
          </span>
        </button>
      </div>

      {/* Top Right Scene Indicator (Desktop) */}
      <nav aria-label="Scene navigation" className="pointer-events-auto hidden md:flex items-center gap-6 text-xs font-mono">
        {SCENES.map((scene) => {
          const isActive = activeSection === scene.id;

          return (
            <button
              key={scene.id}
              onClick={() => scrollTo(scene.id)}
              className={`flex items-center gap-1.5 transition-all duration-300 py-1 px-2 rounded focus:outline-none ${
                isActive
                  ? "text-accent font-semibold bg-white/5 border border-accent/30"
                  : "text-muted hover:text-zinc-300"
              }`}
            >
              <span className="text-[10px] opacity-60">{scene.num}</span>
              <span className="tracking-widest">{scene.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Mobile Scene Indicator & Toggle */}
      <div className="pointer-events-auto md:hidden">
        <button
          onClick={() => setQuickNavOpen(!quickNavOpen)}
          className="px-3 py-1.5 rounded bg-white/5 border border-white/10 text-xs font-mono text-accent flex items-center gap-2"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          <span className="tracking-wider uppercase">
            {SCENES.find((s) => s.id === activeSection)?.label || "INDEX"}
          </span>
        </button>

        {quickNavOpen && (
          <div className="absolute top-16 right-6 w-48 bg-[#0c0c0f] border border-white/10 rounded-lg p-3 shadow-2xl space-y-2">
            {SCENES.map((scene) => (
              <button
                key={scene.id}
                onClick={() => scrollTo(scene.id)}
                className="w-full text-left py-1 px-2 rounded font-mono text-xs text-zinc-300 hover:text-white hover:bg-white/5 flex justify-between"
              >
                <span>{scene.label}</span>
                <span className="text-muted">{scene.num}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
