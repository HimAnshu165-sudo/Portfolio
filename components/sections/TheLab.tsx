"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { canvasStore } from "@/lib/canvas-state";
import { Sparkles, Terminal, Cpu, Globe, Layers } from "lucide-react";

interface TechCluster {
  category: string;
  icon: typeof Terminal;
  accent: string;
  items: { name: string; level: string; desc: string }[];
}

const CLUSTERS: TechCluster[] = [
  {
    category: "CREATIVE & WEBGL",
    icon: Sparkles,
    accent: "#f59e0b",
    items: [
      { name: "Three.js", level: "Core 3D Engine", desc: "Scene graph, PBR materials, custom geometry, and camera choreography." },
      { name: "React Three Fiber", level: "Declarative WebGL", desc: "Component-based canvas architecture with reactive state binding." },
      { name: "Custom GLSL Shaders", level: "Visual FX", desc: "Vertex displacement, fragment shockwaves, and chromatic aberration." },
      { name: "@react-three/drei", level: "Helper Suite", desc: "SDF 3D typography, spatial lines, and environment controllers." },
    ],
  },
  {
    category: "FRONTEND & FULL-STACK",
    icon: Globe,
    accent: "#38bdf8",
    items: [
      { name: "Next.js (App Router)", level: "Framework", desc: "Server components, hybrid rendering, and optimized production bundles." },
      { name: "React 19", level: "Core UI", desc: "Concurrent rendering, action hooks, and seamless UI state synchronization." },
      { name: "TypeScript", level: "Language", desc: "End-to-end type safety across components, canvas stores, and schemas." },
      { name: "Tailwind CSS", level: "Design System", desc: "Tokenized color systems, fluid clamp typography, and dark aesthetics." },
    ],
  },
  {
    category: "BACKEND & DATABASE",
    icon: Cpu,
    accent: "#10b981",
    items: [
      { name: "PostgreSQL", level: "Relational DB", desc: "Normalized schemas, relational modeling, and transactional reliability." },
      { name: "Neon", level: "Serverless Postgres", desc: "Instant branching, low-latency pooling, and cloud scale storage." },
      { name: "API Architecture", level: "Integration", desc: "REST & Server Action endpoints with robust input validation." },
      { name: "Authentication", level: "Security", desc: "Protected session management and frictionless user verification." },
    ],
  },
  {
    category: "MOTION & PERFORMANCE",
    icon: Layers,
    accent: "#a855f7",
    items: [
      { name: "GSAP & ScrollTrigger", level: "Scroll Choreography", desc: "Pinned timelines, frame scrubbing, and multi-layer parallax." },
      { name: "Framer Motion", level: "Physics & Layout", desc: "Elastic layout expansion, spring kinetics, and masked reveals." },
      { name: "Lenis Smooth Scroll", level: "Scroll Pipeline", desc: "Synchronized delta dispatch for zero-jitter frame scrubbing." },
      { name: "CI/CD & Vercel", level: "Deployment", desc: "Automated edge builds, domain routing, and performance tuning." },
    ],
  },
];

export function TheLab() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { margin: "-20% 0px -20% 0px" });
  const [activeClusterIndex, setActiveClusterIndex] = useState(0);

  useEffect(() => {
    if (isInView) {
      canvasStore.setActiveSection("lab");
    }
  }, [isInView]);

  return (
    <section
      ref={containerRef}
      id="lab"
      className="relative w-full min-h-screen py-32 md:py-48 px-6 md:px-16 lg:px-24 bg-[#070709] z-20 select-none border-t border-white/10"
    >
      {/* Background Matrix Grid Pattern (Always Deep Obsidian Black) */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:32px_32px] pointer-events-none opacity-40" />

      {/* Subtle Glow Flare */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full relative z-10 space-y-16">
        {/* Top Header */}
        <div className="space-y-4 max-w-3xl">
          <div className="font-mono text-xs tracking-widest text-accent flex items-center gap-3 uppercase">
            <span>03</span>
            <span className="w-8 h-[1px] bg-accent/40" />
            <span>CREATIVE TECHNOLOGY & SYSTEMS</span>
          </div>

          <h2 className="font-display font-black text-editorial-large text-white uppercase tracking-tight">
            THE LAB
          </h2>

          <p className="text-sm md:text-base text-zinc-400 font-sans leading-relaxed">
            A spatial playground demonstrating cross-discipline mastery. From full-stack Next.js and Neon PostgreSQL backends to custom WebGL shaders, spring kinematics, and production pipelines.
          </p>
        </div>

        {/* Category Selector Tabs */}
        <div className="flex flex-wrap gap-3 border-b border-white/10 pb-6">
          {CLUSTERS.map((cluster, idx) => {
            const Icon = cluster.icon;
            const isActive = activeClusterIndex === idx;

            return (
              <button
                key={cluster.category}
                onClick={() => setActiveClusterIndex(idx)}
                className={`flex items-center gap-2.5 px-5 py-2.5 rounded-full font-mono text-xs tracking-wider transition-all duration-300 focus:outline-none ${
                  isActive
                    ? "bg-white text-black font-bold shadow-lg scale-105"
                    : "bg-white/5 text-zinc-400 border border-white/10 hover:border-white/30 hover:text-white"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-black" : "text-accent"}`} />
                <span>{cluster.category}</span>
              </button>
            );
          })}
        </div>

        {/* Active Cluster Grid Cards */}
        <motion.div
          key={activeClusterIndex}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {CLUSTERS[activeClusterIndex].items.map((item, idx) => (
            <div
              key={idx}
              className="group relative p-6 rounded-xl bg-[#0c0c0f] border border-white/10 hover:border-accent/40 transition-all duration-300 flex flex-col justify-between space-y-6 hover:shadow-2xl"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs font-mono text-zinc-500">
                  <span className="text-accent font-semibold">0{idx + 1}</span>
                  <span className="px-2 py-0.5 rounded bg-white/5 text-[10px] text-zinc-400">
                    {item.level}
                  </span>
                </div>

                <h3 className="font-display font-bold text-xl md:text-2xl text-white uppercase tracking-tight group-hover:text-accent transition-colors">
                  {item.name}
                </h3>

                <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="pt-4 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-zinc-500">
                <span>STATUS: PRODUCTION</span>
                <span className="text-accent">VERIFIED ✓</span>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Bottom Technical Bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 text-xs font-mono text-muted">
          <div className="flex flex-wrap items-center gap-6">
            <span className="text-white font-semibold">ECOSYSTEM ACTIVE:</span>
            <span className="text-zinc-300">WEBGL 2.0</span>
            <span className="text-zinc-300">NEXT.JS 15</span>
            <span className="text-zinc-300">NEON POSTGRES</span>
            <span className="text-zinc-300">GSAP TIMELINES</span>
          </div>

          <div className="text-right text-[11px] text-zinc-500">
            <span>FULL-STACK & CREATIVE ARCHITECTURE</span>
          </div>
        </div>
      </div>
    </section>
  );
}
