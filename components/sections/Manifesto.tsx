"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

export function Manifesto() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: false, margin: "-15% 0px -15% 0px" });

  const lineVariants = {
    hidden: { opacity: 0, y: 40, filter: "blur(8px)" },
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
      className="relative w-full py-32 md:py-48 px-6 md:px-16 lg:px-24 bg-background z-20 flex flex-col justify-center"
    >
      <div className="max-w-6xl mx-auto w-full space-y-12">
        {/* Subtle section identifier */}
        <motion.div
          custom={0}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={lineVariants}
          className="font-mono text-xs tracking-widest text-accent flex items-center gap-3 uppercase"
        >
          <span>01</span>
          <span className="w-8 h-[1px] bg-accent/40" />
          <span>POSITIONING & MANIFESTO</span>
        </motion.div>

        {/* Large Editorial Headline Sequence */}
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
              className="font-display font-black text-editorial-large text-white uppercase tracking-tight"
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
              className="font-display font-semibold text-2xl md:text-5xl text-accent tracking-wide uppercase"
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
          className="pt-6 border-t border-white/10 max-w-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
        >
          <p className="text-sm md:text-base text-muted-light font-sans font-light leading-relaxed">
            Full-stack development meets visual design and creative interaction. Every project is engineered to perform, captivate, and convert.
          </p>

          <div className="font-mono text-xs text-muted whitespace-nowrap">
            [ NEXT → SELECTED WORK ]
          </div>
        </motion.div>
      </div>
    </section>
  );
}
