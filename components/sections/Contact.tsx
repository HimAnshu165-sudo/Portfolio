"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { PROFILE } from "@/data/profile";
import { canvasStore } from "@/lib/canvas-state";
import { useInView } from "framer-motion";

export function Contact() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { margin: "-20% 0px -20% 0px" });

  useEffect(() => {
    if (isInView) {
      canvasStore.setActiveSection("contact");
    }
  }, [isInView]);

  return (
    <section
      ref={containerRef}
      id="contact"
      className="relative w-full min-h-screen py-32 md:py-48 px-6 md:px-16 lg:px-24 bg-[#050507] z-20 flex flex-col justify-between select-none"
    >
      {/* Top Header Tag */}
      <div className="max-w-7xl mx-auto w-full">
        <div className="font-mono text-xs tracking-widest text-accent flex items-center gap-3 uppercase">
          <span>06</span>
          <span className="w-8 h-[1px] bg-accent/40" />
          <span>CONTACT & COLLABORATION</span>
        </div>
      </div>

      {/* Main Massive Statement & Primary CTA */}
      <div className="max-w-7xl mx-auto w-full my-auto py-16 md:py-24 space-y-12">
        <div className="space-y-4">
          <p className="font-mono text-xs md:text-sm text-zinc-400 tracking-widest uppercase">
            HAVE AN IDEA?
          </p>

          <h2 className="font-display font-black text-editorial-large text-white uppercase tracking-tight leading-none">
            LET&apos;S MAKE<br />IT REAL.
          </h2>
        </div>

        {/* Primary Interactive CTA Button */}
        <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center gap-8">
          <a
            href={`mailto:${PROFILE.contacts.email}?subject=Project%20Inquiry%20%E2%80%94%20Himanshu%20Sharma`}
            className="group relative inline-flex items-center gap-4 px-8 py-5 rounded-full bg-white text-[#070709] font-mono text-sm md:text-base font-bold uppercase tracking-wider hover:bg-accent hover:text-black transition-all duration-300 shadow-2xl"
          >
            <span>START A CONVERSATION</span>
            <span className="group-hover:translate-x-1.5 transition-transform duration-300">
              →
            </span>
          </a>

          <span className="font-mono text-xs text-muted">
            AVAILABLE FOR CONTRACTS & CREATIVE BUILDS
          </span>
        </div>

        {/* Secondary Clean Editorial Links */}
        <div className="pt-12 border-t border-white/10 flex flex-wrap gap-8 md:gap-16 text-xs md:text-sm font-mono tracking-widest uppercase">
          <a
            href={`mailto:${PROFILE.contacts.email}`}
            className="text-zinc-400 hover:text-white transition-colors flex items-center gap-1.5"
          >
            <span>EMAIL</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>

          <a
            href={PROFILE.contacts.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-400 hover:text-white transition-colors flex items-center gap-1.5"
          >
            <span>GITHUB</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>

          <a
            href={PROFILE.contacts.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-400 hover:text-white transition-colors flex items-center gap-1.5"
          >
            <span>LINKEDIN</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* FINAL VISUAL CALLBACK: Subtle Still Silhouette and Ending Note */}
      <div className="max-w-7xl mx-auto w-full pt-16 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-6 text-xs font-mono text-zinc-600">
        <div className="flex items-center gap-4">
          <div className="relative w-8 h-8 rounded-full overflow-hidden border border-white/10 grayscale opacity-40">
            <Image
              src="/assets/entry/frames/ezgif-frame-001.jpg"
              alt="HS Silhouette"
              fill
              className="object-cover"
            />
          </div>
          <span className="text-zinc-400 tracking-wider uppercase font-semibold">
            {PROFILE.name}
          </span>
        </div>

        <div>
          <span>© 2026 // DESIGN IT. BUILD IT. MOVE IT. SHIP IT.</span>
        </div>
      </div>
    </section>
  );
}
