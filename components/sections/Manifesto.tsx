"use client";

import { useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { canvasStore } from "@/lib/canvas-state";

export function Manifesto() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: false, margin: "-20% 0px -20% 0px" });

  useEffect(() => {
    if (isInView) {
      canvasStore.setActiveSection("manifesto");
    }
  }, [isInView]);

  const lineVariants = {
    hidden: { opacity: 0, y: 35, filter: "blur(6px)" },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.8,
        delay: custom * 0.15,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      },
    }),
  };

  return (
    <section
      ref={containerRef}
      id="manifesto"
      className="relative w-full py-32 md:py-48 px-6 md:px-16 lg:px-24 bg-[#fbfbfd] text-[#1d1d1f] z-20 flex flex-col justify-center transition-colors duration-700 shadow-sm"
    >
      <div className="max-w-6xl mx-auto w-full space-y-12">
        {/* Subtle section identifier with Apple pill badge */}
        <motion.div
          custom={0}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={lineVariants}
          className="font-mono text-xs tracking-widest text-amber-700 flex items-center gap-3 uppercase"
        >
          <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-600/20 font-bold">
            01
          </span>
          <span className="w-8 h-[1px] bg-amber-600/40" />
          <span className="font-semibold tracking-wider">POSITIONING & MANIFESTO</span>
        </motion.div>

        {/* Large Editorial Headline Sequence (Apple Style High-Contrast) */}
        <div className="space-y-4 md:space-y-6">
          <div className="overflow-hidden">
            <motion.h2
              custom={1}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              variants={lineVariants}
              className="font-display font-extrabold text-editorial-large text-zinc-400 uppercase tracking-tight"
            >
              I BUILD FOR THE WEB.
            </motion.h2>
          </div>

          <div className="overflow-hidden">
            <motion.h2
              custom={2}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              variants={lineVariants}
              className="font-display font-black text-editorial-large text-[#1d1d1f] uppercase tracking-tight"
            >
              BUT I DON&apos;T BUILD BORING WEBSITES.
            </motion.h2>
          </div>

          <div className="overflow-hidden pt-4">
            <motion.h3
              custom={3}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              variants={lineVariants}
              className="font-display font-bold text-2xl md:text-5xl text-amber-600 tracking-wide uppercase"
            >
              CODE. DESIGN. MOTION.
            </motion.h3>
          </div>
        </div>

        {/* Supporting concise thesis */}
        <motion.div
          custom={4}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={lineVariants}
          className="pt-8 border-t border-zinc-200 max-w-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
        >
          <p className="text-base md:text-lg text-zinc-600 font-sans font-normal leading-relaxed">
            Full-stack development meets visual design and creative interaction. Every project is engineered to perform, captivate, and convert.
          </p>

          <div className="font-mono text-xs font-semibold text-zinc-400 whitespace-nowrap tracking-wider">
            [ NEXT → SELECTED WORK ]
          </div>
        </motion.div>
      </div>
    </section>
  );
}
