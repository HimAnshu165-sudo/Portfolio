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

  const isLightSection = activeSection === "manifesto" || activeSection === "work" || activeSection === "capabilities";

  if (!mounted || !isReady) return null;

  return (
    <header className="fixed top-0 left-0 right-0 z-40 p-6 md:px-12 flex justify-between items-center pointer-events-none select-none transition-colors duration-500">
      {/* Top Left Minimal Brand Token */}
      <div className="pointer-events-auto flex items-center gap-3">
        <button
          onClick={() => scrollTo("entry")}
          className="group flex items-center gap-2 text-left focus:outline-none focus:ring-1 focus:ring-accent rounded p-1"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-accent group-hover:scale-125 transition-transform" />
          <span
            className={`font-mono text-xs tracking-widest font-semibold transition-colors duration-300 ${
              isLightSection
                ? "text-zinc-900 group-hover:text-black"
                : "text-zinc-300 group-hover:text-white"
            }`}
          >
            {PROFILE.shortName}
          </span>
          <span
            className={`hidden sm:inline text-[10px] font-mono tracking-wider transition-colors duration-300 ${
              isLightSection ? "text-zinc-400" : "text-muted"
            }`}
          >
            / 2026
          </span>
        </button>
      </div>

      {/* Top Right Scene Indicator (Desktop) */}
      <nav
        aria-label="Scene navigation"
        className={`pointer-events-auto hidden md:flex items-center gap-3 lg:gap-5 text-xs font-mono px-3 py-1.5 rounded-full backdrop-blur-md transition-all duration-500 ${
          isLightSection
            ? "bg-white/80 border border-zinc-200/80 shadow-sm text-zinc-600"
            : "bg-black/40 border border-white/10 text-muted"
        }`}
      >
        {SCENES.map((scene) => {
          const isActive = activeSection === scene.id;

          return (
            <button
              key={scene.id}
              onClick={() => scrollTo(scene.id)}
              className={`flex items-center gap-1.5 transition-all duration-300 py-1 px-2.5 rounded-full focus:outline-none ${
                isActive
                  ? isLightSection
                    ? "text-amber-800 font-bold bg-amber-500/20 border border-amber-600/30"
                    : "text-accent font-semibold bg-white/10 border border-accent/30"
                  : isLightSection
                  ? "text-zinc-500 hover:text-zinc-900"
                  : "text-zinc-400 hover:text-zinc-200"
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
          className={`px-3 py-1.5 rounded-full text-xs font-mono flex items-center gap-2 backdrop-blur-md transition-colors duration-300 ${
            isLightSection
              ? "bg-white/90 border border-zinc-200 text-amber-700 shadow-sm"
              : "bg-black/60 border border-white/10 text-accent"
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          <span className="tracking-wider uppercase font-semibold">
            {SCENES.find((s) => s.id === activeSection)?.label || "INDEX"}
          </span>
        </button>

        {quickNavOpen && (
          <div
            className={`absolute top-16 right-6 w-48 rounded-xl p-3 shadow-2xl space-y-2 backdrop-blur-lg border transition-all ${
              isLightSection
                ? "bg-white/95 border-zinc-200 text-zinc-900"
                : "bg-[#0c0c0f]/95 border-white/10 text-zinc-300"
            }`}
          >
            {SCENES.map((scene) => (
              <button
                key={scene.id}
                onClick={() => scrollTo(scene.id)}
                className={`w-full text-left py-1.5 px-2 rounded-lg font-mono text-xs flex justify-between transition-colors ${
                  isLightSection
                    ? "hover:bg-zinc-100 hover:text-black"
                    : "hover:bg-white/10 hover:text-white"
                }`}
              >
                <span>{scene.label}</span>
                <span className={isLightSection ? "text-zinc-400" : "text-muted"}>
                  {scene.num}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
