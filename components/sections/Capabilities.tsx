"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { PROFILE, CapabilityCategory } from "@/data/profile";
import { canvasStore } from "@/lib/canvas-state";
import { useInView } from "framer-motion";

export function Capabilities() {
  const [activeCapability, setActiveCapability] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { margin: "-20% 0px -20% 0px" });

  useEffect(() => {
    if (isInView) {
      canvasStore.setActiveSection("capabilities");
    }
  }, [isInView]);

  return (
    <section
      ref={containerRef}
      id="capabilities"
      className="relative w-full py-32 md:py-48 bg-[#ffffff] text-[#1d1d1f] z-20 select-none transition-colors duration-700 shadow-sm"
    >
      {/* SECTION HEADER (Apple Studio Clean) */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 mb-16 md:mb-24">
        <div className="space-y-4 max-w-4xl">
          <div className="font-mono text-xs tracking-widest text-amber-700 flex items-center gap-3 uppercase">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-600/20 font-bold">
              04
            </span>
            <span className="w-8 h-[1px] bg-amber-600/40" />
            <span className="font-semibold tracking-wider">FULL-LIFECYCLE EXECUTION</span>
          </div>

          <h2 className="font-display font-black text-editorial-large text-[#1d1d1f] uppercase tracking-tight">
            I CAN TAKE AN IDEA<br />FROM ZERO TO LIVE.
          </h2>

          <p className="text-base md:text-lg text-zinc-600 font-sans max-w-2xl leading-relaxed pt-2">
            Complete digital execution without handoff friction. Design it, engineer the full stack, choreograph the motion, and deploy it to production.
          </p>
        </div>
      </div>

      {/* FOUR FULL-WIDTH INTERACTIVE ROWS */}
      <div className="w-full border-t border-zinc-200">
        {PROFILE.capabilities.map((cap: CapabilityCategory) => {
          const isHovered = activeCapability === cap.id;

          return (
            <div
              key={cap.id}
              onMouseEnter={() => setActiveCapability(cap.id)}
              onMouseLeave={() => setActiveCapability(null)}
              className={`group relative w-full border-b border-zinc-200 py-10 md:py-16 transition-all duration-500 cursor-default ${
                isHovered
                  ? "bg-white shadow-[0_20px_45px_-15px_rgba(0,0,0,0.08)] border-amber-500/40"
                  : "bg-transparent hover:bg-zinc-50/70"
              }`}
            >
              {/* Subtle accent hover indicator line */}
              {isHovered && (
                <motion.div
                  layoutId="cap-accent-line"
                  className="absolute left-0 top-0 bottom-0 w-1.5 bg-amber-500"
                />
              )}

              <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start lg:items-center">
                {/* Number & Primary Title */}
                <div className="lg:col-span-5 flex items-baseline gap-8 md:gap-12">
                  <span
                    className={`font-mono text-base md:text-xl transition-colors duration-300 ${
                      isHovered ? "text-amber-700 font-bold" : "text-zinc-400 font-bold"
                    }`}
                  >
                    {cap.number}
                  </span>

                  <div className="space-y-1">
                    <h3
                      className={`font-display font-black text-4xl md:text-6xl lg:text-7xl uppercase tracking-tight transition-all duration-300 ${
                        isHovered
                          ? "text-black translate-x-2"
                          : "text-zinc-800 group-hover:text-black"
                      }`}
                    >
                      {cap.title}
                    </h3>
                    <p className="font-mono text-xs text-amber-700 font-semibold uppercase tracking-widest">
                      {cap.subtitle}
                    </p>
                  </div>
                </div>

                {/* Description */}
                <div className="lg:col-span-4 space-y-2">
                  <p className="text-sm md:text-base text-zinc-600 font-sans leading-relaxed">
                    {cap.description}
                  </p>
                </div>

                {/* Capability Skills / Tags */}
                <div className="lg:col-span-3 flex flex-wrap gap-2 justify-start lg:justify-end">
                  {cap.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className={`text-xs font-mono px-3 py-1 rounded transition-colors duration-300 ${
                        isHovered
                          ? "bg-amber-500/10 text-amber-900 border border-amber-500/30 font-semibold"
                          : "bg-zinc-100 text-zinc-700 border border-zinc-200"
                      }`}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
