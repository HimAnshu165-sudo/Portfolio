"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Project } from "@/data/projects";
import { ProjectPreviewVisual } from "./ProjectPreviewVisual";
import { ArrowUpRight } from "lucide-react";
import { canvasStore } from "@/lib/canvas-state";

interface ProjectRowProps {
  project: Project;
  isHoveredByParent: boolean;
  onHoverStart: () => void;
  onHoverEnd: () => void;
}

export function ProjectRow({
  project,
  isHoveredByParent,
  onHoverStart,
  onHoverEnd,
}: ProjectRowProps) {
  const [isSelfHovered, setIsSelfHovered] = useState(false);

  const isExpanded = isSelfHovered;

  const handleMouseEnter = () => {
    setIsSelfHovered(true);
    canvasStore.setHoveredProject(project.id);
    onHoverStart();
  };

  const handleMouseLeave = () => {
    setIsSelfHovered(false);
    canvasStore.setHoveredProject(null);
    onHoverEnd();
  };

  const handleRowClick = () => {
    window.open(project.url, "_blank", "noopener,noreferrer");
  };

  return (
    <motion.div
      layout
      transition={{
        layout: { type: "spring", stiffness: 280, damping: 26 },
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleRowClick}
      className={`group relative w-full border-b border-white/10 cursor-pointer overflow-hidden transition-colors duration-500 select-none ${
        isExpanded
          ? "bg-surface-raised/90 py-8 md:py-12 border-accent/40 shadow-2xl"
          : "bg-transparent py-6 md:py-8 hover:border-white/20"
      } ${
        isHoveredByParent && !isSelfHovered ? "opacity-35 blur-[0.5px]" : "opacity-100"
      }`}
    >
      {/* Background glow when expanded */}
      {isExpanded && (
        <motion.div
          layoutId={`glow-${project.id}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 pointer-events-none bg-gradient-to-r from-accent/5 via-transparent to-accent/5"
        />
      )}

      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full flex flex-col justify-between">
        {/* ROW HEADER (Always visible, transforms smoothly) */}
        <div className="flex items-center justify-between gap-4 w-full">
          {/* Index & Title */}
          <div className="flex items-baseline gap-6 md:gap-12">
            <span
              className={`font-mono text-sm md:text-base transition-colors duration-300 ${
                isExpanded ? "text-accent font-bold" : "text-muted"
              }`}
            >
              {project.index}
            </span>

            <motion.h3
              layout="position"
              className={`font-display font-extrabold uppercase tracking-tight transition-all duration-300 ${
                isExpanded
                  ? "text-3xl md:text-5xl lg:text-6xl text-white translate-x-2"
                  : "text-2xl md:text-4xl lg:text-5xl text-zinc-300 group-hover:text-white"
              }`}
            >
              {project.title}
            </motion.h3>
          </div>

          {/* Right Category, Year & Arrow */}
          <div className="flex items-center gap-6 md:gap-12">
            <span className="hidden md:inline font-mono text-xs text-muted uppercase tracking-widest">
              {project.category}
            </span>

            <span className="hidden sm:inline font-mono text-xs text-zinc-500">
              {project.year}
            </span>

            {/* Elastic Arrow Icon */}
            <motion.div
              animate={{
                rotate: isExpanded ? 45 : 0,
                scale: isExpanded ? 1.25 : 1,
              }}
              transition={{ type: "spring", stiffness: 350, damping: 20 }}
              className={`w-10 h-10 rounded-full flex items-center justify-center border transition-colors ${
                isExpanded
                  ? "border-accent bg-accent text-background"
                  : "border-white/10 text-zinc-400 group-hover:border-white/30 group-hover:text-white"
              }`}
            >
              <ArrowUpRight className="w-5 h-5" />
            </motion.div>
          </div>
        </div>

        {/* EXPANDED CONTENT (Reveals when row stretches) */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: 20 }}
              animate={{
                opacity: 1,
                height: "auto",
                y: 0,
                transition: {
                  height: { type: "spring", stiffness: 280, damping: 26 },
                  opacity: { duration: 0.35, delay: 0.08 },
                },
              }}
              exit={{
                opacity: 0,
                height: 0,
                y: 10,
                transition: { duration: 0.25 },
              }}
              className="mt-8 pt-6 border-t border-white/10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
            >
              {/* Left Column: Description & Metadata */}
              <div className="lg:col-span-5 space-y-6">
                <div className="space-y-2">
                  <span className="text-[11px] font-mono tracking-widest text-accent uppercase">
                    Architecture & Execution
                  </span>
                  <p className="text-sm md:text-base text-zinc-300 font-sans leading-relaxed">
                    {project.description}
                  </p>
                </div>

                {/* Tech Stack Pills */}
                <div className="space-y-2">
                  <span className="text-[10px] font-mono tracking-wider text-muted uppercase">
                    Core Technologies
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech, idx) => (
                      <span
                        key={idx}
                        className="text-xs font-mono px-2.5 py-1 rounded bg-white/5 border border-white/10 text-zinc-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Link button */}
                <div className="pt-2">
                  <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-accent text-background font-mono text-xs font-bold uppercase tracking-wider hover:bg-white transition-colors shadow-lg">
                    <span>EXPLORE LIVE PLATFORM</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </span>
                </div>
              </div>

              {/* Right Column: Dynamic Preview Visual */}
              <div className="lg:col-span-7">
                <ProjectPreviewVisual project={project} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
