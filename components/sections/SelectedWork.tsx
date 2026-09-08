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
      className="relative w-full py-24 md:py-36 bg-background z-20"
    >
      {/* SECTION HEADER */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 mb-16 md:mb-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
          <div className="space-y-2">
            <div className="font-mono text-xs tracking-widest text-accent flex items-center gap-3 uppercase">
              <span>02</span>
              <span className="w-8 h-[1px] bg-accent/40" />
              <span>SELECTED COMMISSIONS & BUILDS</span>
            </div>
            <h2 className="font-display font-black text-editorial-large text-white uppercase tracking-tight">
              SELECTED<br />WORK
            </h2>
          </div>

          <div className="space-y-1 text-right font-mono text-xs text-muted">
            <p className="text-zinc-300 font-semibold uppercase tracking-wider">
              10+ PRODUCTION BUILDS SHIPPED
            </p>
            <p>HOVER OR TAP TO EXPAND ARCHITECTURE</p>
          </div>
        </div>
      </div>

      {/* FULL-WIDTH ELASTIC PROJECT ROWS */}
      <div className="w-full border-t border-white/10">
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
