"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Project } from "@/data/projects";
import { ExternalLink } from "lucide-react";

export function ProjectPreviewVisual({ project }: { project: Project }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Subtle 3D tilt
    setRotateX(((y - centerY) / centerY) * -8);
    setRotateY(((x - centerX) / centerX) * 8);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ rotateX, rotateY }}
      transition={{ type: "spring", stiffness: 350, damping: 25 }}
      style={{ perspective: 1000 }}
      className="relative w-full h-48 md:h-64 rounded-lg overflow-hidden border border-white/10 bg-[#0c0c0f] shadow-2xl flex flex-col justify-between p-6 group/visual"
    >
      {/* Dynamic generative background tailored to project's accent color */}
      <div
        className="absolute inset-0 opacity-20 group-hover/visual:opacity-35 transition-opacity duration-700 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 30%, ${project.accentColor || "#f59e0b"} 0%, transparent 70%)`,
        }}
      />

      {/* Grid line pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      {/* Top Header of Preview Card */}
      <div className="relative z-10 flex justify-between items-center text-xs font-mono text-zinc-400">
        <div className="flex items-center gap-2">
          <span
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ backgroundColor: project.accentColor || "#f59e0b" }}
          />
          <span className="tracking-wider uppercase">{project.category}</span>
        </div>
        <span className="text-[10px] text-zinc-500">{project.year} // VERIFIED BUILD</span>
      </div>

      {/* Center Display */}
      <div className="relative z-10 space-y-2 text-center my-auto">
        <h4 className="font-display font-black text-2xl md:text-3xl text-white tracking-tight uppercase drop-shadow-md">
          {project.title}
        </h4>
        {project.subtitle && (
          <p className="text-[11px] font-mono tracking-widest text-zinc-400 uppercase">
            {project.subtitle}
          </p>
        )}
      </div>

      {/* Bottom Footer with Tech Pills & Action */}
      <div className="relative z-10 flex flex-wrap justify-between items-center gap-3 pt-3 border-t border-white/5">
        <div className="flex flex-wrap gap-1.5">
          {project.technologies.slice(0, 4).map((tech, idx) => (
            <span
              key={idx}
              className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-zinc-300 border border-white/5"
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-1 text-xs font-mono text-accent group-hover/visual:translate-x-1 transition-transform">
          <span>VISIT LIVE</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </div>
      </div>
    </motion.div>
  );
}
