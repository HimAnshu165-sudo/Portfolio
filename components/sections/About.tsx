"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PROFILE } from "@/data/profile";
import { canvasStore } from "@/lib/canvas-state";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function About() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textStreamRef1 = useRef<HTMLDivElement>(null);
  const textStreamRef2 = useRef<HTMLDivElement>(null);
  const characterRef = useRef<HTMLDivElement>(null);

  const isInView = useInView(containerRef, { margin: "-20% 0px -20% 0px" });

  useEffect(() => {
    if (isInView) {
      canvasStore.setActiveSection("about");
    }
  }, [isInView]);

  // Parallax on scroll for passing words behind & in front of character
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const ctx = gsap.context(() => {
      if (textStreamRef1.current) {
        gsap.to(textStreamRef1.current, {
          x: -120,
          ease: "none",
          scrollTrigger: {
            trigger: container,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        });
      }

      if (textStreamRef2.current) {
        gsap.to(textStreamRef2.current, {
          x: 140,
          ease: "none",
          scrollTrigger: {
            trigger: container,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        });
      }

      if (characterRef.current) {
        gsap.to(characterRef.current, {
          y: -40,
          ease: "none",
          scrollTrigger: {
            trigger: container,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.5,
          },
        });
      }
    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      id="about"
      className="relative w-full py-32 md:py-48 bg-background overflow-hidden z-20 select-none"
    >
      {/* Background Kinetic Stream 1 (Behind Character) */}
      <div
        ref={textStreamRef1}
        className="absolute top-1/4 left-0 w-[200vw] font-display font-black text-6xl md:text-9xl text-white/[0.03] whitespace-nowrap pointer-events-none uppercase tracking-tighter"
      >
        DESIGN — CODE — CREATE — SHIP — DESIGN — CODE — CREATE — SHIP
      </div>

      {/* Main Grid Content */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        {/* Left Column: Narrative & Typography */}
        <div className="lg:col-span-7 space-y-12">
          <div className="space-y-4">
            <div className="font-mono text-xs tracking-widest text-accent flex items-center gap-3 uppercase">
              <span>05</span>
              <span className="w-8 h-[1px] bg-accent/40" />
              <span>THE PERSON BEHIND THE INTERFACE</span>
            </div>

            <h2 className="font-display font-black text-editorial-large text-white uppercase tracking-tight">
              BEHIND<br />THE SCREEN.
            </h2>
          </div>

          <div className="space-y-6 max-w-xl">
            <div className="space-y-1">
              <h3 className="font-display font-bold text-2xl md:text-3xl text-zinc-100 uppercase">
                {PROFILE.name}
              </h3>
              <p className="font-mono text-xs text-accent uppercase tracking-widest">
                {PROFILE.title}
              </p>
            </div>

            <p className="text-base md:text-lg text-zinc-300 font-sans font-light leading-relaxed">
              {PROFILE.bio}
            </p>
          </div>

          {/* INTEGRATED TYPOGRAPHIC METRICS (NO GENERIC CARDS) */}
          <div className="pt-8 border-t border-white/10 grid grid-cols-2 gap-8 max-w-md">
            <div className="space-y-1">
              <span className="font-display font-black text-5xl md:text-7xl text-white tracking-tighter">
                {PROFILE.experienceYears}
              </span>
              <div className="font-mono text-xs text-muted uppercase tracking-widest">
                YEARS BUILDING<br />FOR THE WEB
              </div>
            </div>

            <div className="space-y-1">
              <span className="font-display font-black text-5xl md:text-7xl text-accent tracking-tighter">
                {PROFILE.projectsShipped}
              </span>
              <div className="font-mono text-xs text-muted uppercase tracking-widest">
                PRODUCTION BUILDS<br />SHIPPED
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Character Still Composition with Edge Crop */}
        <div
          ref={characterRef}
          className="lg:col-span-5 relative flex items-center justify-center lg:justify-end"
        >
          <div className="relative w-full max-w-md aspect-[3/4] rounded-2xl overflow-hidden border border-white/10 bg-[#0c0c0f] shadow-2xl group">
            {/* Real photo provided by Himanshu */}
            <Image
              src="/assets/profile/himanshu.png"
              alt="Himanshu Sharma — Full-Stack Developer & Web Creator"
              fill
              className="object-cover object-center group-hover:scale-105 transition-transform duration-700 brightness-100 contrast-105"
              sizes="(max-width: 768px) 100vw, 500px"
              priority
            />

            {/* Subtle Vignette & Amber Accent Glow */}
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent pointer-events-none" />
            <div className="absolute inset-0 border border-white/10 rounded-2xl pointer-events-none" />

            {/* Corner Metadata Tag */}
            <div className="absolute bottom-4 left-4 right-4 z-10 flex justify-between items-center text-[10px] font-mono text-zinc-300 bg-black/70 backdrop-blur-md px-3.5 py-2 rounded-lg border border-white/10">
              <span className="font-semibold tracking-wider">HIMANSHU SHARMA</span>
              <span className="text-accent font-bold">HS // VERIFIED</span>
            </div>
          </div>
        </div>
      </div>

      {/* Background Kinetic Stream 2 (In front / lower) */}
      <div
        ref={textStreamRef2}
        className="mt-16 w-[200vw] font-display font-black text-5xl md:text-8xl text-white/[0.025] whitespace-nowrap pointer-events-none uppercase tracking-tighter"
      >
        FULL-STACK — WEB CREATOR — WEB DESIGNER — FULL-STACK — WEB CREATOR
      </div>
    </section>
  );
}
