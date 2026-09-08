"use client";

import { useState, useRef, useEffect } from "react";
import { PROJECTS } from "@/data/projects";
import { ProjectRow } from "../projects/ProjectRow";
import { canvasStore } from "@/lib/canvas-state";
import { useInView } from "framer-motion";

export function SelectedWork() {
  const [hoveredProjectId, setHoveredProjectId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { margin: "-20% 0px -20% 0px" });

  useEffect(() => {
    if (isInView) {
      canvasStore.setActiveSection("work");
    }
  }, [isInView]);

  return (
    <section
      ref={containerRef}
      id="work"
      className="relative w-full py-24 md:py-36 bg-[#f5f5f7] text-[#1d1d1f] z-20 transition-colors duration-700 shadow-sm"
    >
      {/* SECTION HEADER (Apple Studio Style) */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 mb-16 md:mb-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-300/80 pb-8">
          <div className="space-y-2">
            <div className="font-mono text-xs tracking-widest text-amber-700 flex items-center gap-3 uppercase">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-600/20 font-bold">
                02
              </span>
              <span className="w-8 h-[1px] bg-amber-600/40" />
              <span className="font-semibold tracking-wider">SELECTED COMMISSIONS & BUILDS</span>
            </div>
            <h2 className="font-display font-black text-editorial-large text-[#1d1d1f] uppercase tracking-tight">
              SELECTED<br />WORK
            </h2>
          </div>

          <div className="space-y-1 text-left md:text-right font-mono text-xs text-zinc-500">
            <p className="text-zinc-900 font-bold uppercase tracking-wider">
              10+ PRODUCTION BUILDS SHIPPED
            </p>
            <p className="text-zinc-500">HOVER OR TAP TO EXPAND ARCHITECTURE</p>
          </div>
        </div>
      </div>

      {/* FULL-WIDTH ELASTIC PROJECT ROWS */}
      <div className="w-full border-t border-zinc-300/80">
        {PROJECTS.map((project) => (
          <ProjectRow
            key={project.id}
            project={project}
            isHoveredByParent={hoveredProjectId !== null}
            onHoverStart={() => setHoveredProjectId(project.id)}
            onHoverEnd={() => setHoveredProjectId(null)}
          />
        ))}
      </div>
    </section>
  );
}
