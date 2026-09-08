"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { frameCache, TOTAL_FRAMES, IMPACT_FRAME } from "@/lib/frame-loader";
import { canvasStore } from "@/lib/canvas-state";
import { PROFILE } from "@/data/profile";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function HeroEntry() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textBackRef = useRef<HTMLDivElement>(null);
  const textFrontRef = useRef<HTMLDivElement>(null);
  const impactFlashRef = useRef<HTMLDivElement>(null);

  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
  const [hasImpacted, setHasImpacted] = useState(false);
  const [scrollHintVisible, setScrollHintVisible] = useState(true);

  // High performance canvas renderer
  const renderFrame = useCallback((frameIdx: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const img = frameCache.getFrame(frameIdx);
    if (!img || !img.complete || img.naturalWidth === 0) return;

    const width = canvas.width;
    const height = canvas.height;

    // Maintain 16:9 aspect ratio and cover canvas
    const imgRatio = 1920 / 1080;
    const canvasRatio = width / height;

    let drawW = width;
    let drawH = height;
    let offsetX = 0;
    let offsetY = 0;

    if (canvasRatio > imgRatio) {
      drawH = width / imgRatio;
      offsetY = (height - drawH) / 2;
    } else {
      drawW = height * imgRatio;
      offsetX = (width - drawW) / 2;
    }

    ctx.clearRect(0, 0, width, height);

    // Vignette/dark blend for seamless integration with #070709 background
    ctx.drawImage(img, offsetX, offsetY, drawW, drawH);
  }, []);

  // Handle Canvas Resizing with high DPI support
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      renderFrame(currentFrameIndex);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [currentFrameIndex, renderFrame]);

  // GSAP ScrollTrigger Sequence
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    // Preload & draw initial frame immediately
    const firstImg = new Image();
    firstImg.src = "/assets/entry/frames/ezgif-frame-001.jpg";
    firstImg.onload = () => renderFrame(0);

    const unsubscribeCache = frameCache.onProgress(() => {
      renderFrame(0);
    });

    const frameObject = { frame: 0 };
    let impactFired = false;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: container,
        start: "top top",
        end: "+=350%",
        pin: true,
        scrub: 0.6,
        anticipatePin: 1,
        onUpdate: (self) => {
          const progress = self.progress;
          canvasStore.setScrollProgress(progress);

          // Map progress to frames
          const targetFrame = Math.min(
            TOTAL_FRAMES - 1,
            Math.floor(progress * TOTAL_FRAMES)
          );

          frameObject.frame = targetFrame;
          setCurrentFrameIndex(targetFrame);
          renderFrame(targetFrame);

          // Fade out scroll instruction as soon as user scrolls
          if (progress > 0.04 && scrollHintVisible) {
            setScrollHintVisible(false);
          } else if (progress <= 0.02 && !scrollHintVisible) {
            setScrollHintVisible(true);
          }

          // KICK IMPACT DETECTION (~frame 200 - 225)
          if (targetFrame >= IMPACT_FRAME - 5 && targetFrame <= IMPACT_FRAME + 20) {
            const impactProg = (targetFrame - (IMPACT_FRAME - 5)) / 25;
            canvasStore.triggerImpact(impactProg);

            if (!impactFired) {
              impactFired = true;
              setHasImpacted(true);

              // Screen flash & camera recoil
              if (impactFlashRef.current) {
                gsap.fromTo(
                  impactFlashRef.current,
                  { opacity: 0.9, scale: 1 },
                  { opacity: 0, scale: 1.05, duration: 0.55, ease: "power3.out" }
                );
              }

              // Typography fragmentation burst
              if (textBackRef.current && textFrontRef.current) {
                gsap.to(textBackRef.current, {
                  scale: 1.15,
                  letterSpacing: "0.1em",
                  opacity: 0.08,
                  filter: "blur(4px)",
                  duration: 0.4,
                  ease: "power2.out",
                });
                gsap.to(textFrontRef.current, {
                  y: -30,
                  opacity: 0.3,
                  duration: 0.4,
                  ease: "power2.out",
                });
              }
            }
          } else {
            impactFired = false;
            setHasImpacted(false);
            canvasStore.resetImpact();

            if (textBackRef.current && textFrontRef.current) {
              gsap.to(textBackRef.current, {
                scale: 1,
                letterSpacing: "-0.04em",
                opacity: 0.14,
                filter: "blur(0px)",
                duration: 0.3,
              });
              gsap.to(textFrontRef.current, {
                y: 0,
                opacity: 1,
                duration: 0.3,
              });
            }
          }
        },
      });

      // Initial frame draw
      renderFrame(0);
    }, container);

    return () => {
      unsubscribeCache();
      ctx.revert();
    };
  }, [renderFrame, scrollHintVisible]);

  // Pointer 2.5D Parallax
  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      const normX = (e.clientX / window.innerWidth - 0.5) * 2;
      const normY = (e.clientY / window.innerHeight - 0.5) * 2;

      if (textBackRef.current) {
        gsap.to(textBackRef.current, {
          x: normX * -25,
          y: normY * -15,
          duration: 1.2,
          ease: "power2.out",
        });
      }

      if (textFrontRef.current) {
        gsap.to(textFrontRef.current, {
          x: normX * 18,
          y: normY * 12,
          duration: 1.2,
          ease: "power2.out",
        });
      }
    };

    window.addEventListener("mousemove", handleMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  return (
    <section
      ref={containerRef}
      id="entry"
      className="relative w-full h-screen overflow-hidden bg-background select-none"
    >
      {/* LAYER 1 (BACK): Enormous Background Display Typography */}
      <div
        ref={textBackRef}
        className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 opacity-14 transition-opacity"
      >
        <span className="font-display font-black text-hero-huge uppercase text-zinc-400 tracking-tighter select-none whitespace-nowrap">
          SHARMA
        </span>
      </div>

      {/* LAYER 2 (CENTER): Frame-driven Character Canvas with Ambient Blending */}
      <div className="absolute inset-0 z-20 flex items-center justify-center">
        <canvas
          ref={canvasRef}
          className="w-full h-full object-cover mix-blend-screen opacity-95 transition-opacity"
        />
        {/* Subtle radial dark mask around edges so character seamlessly merges with deep void */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-background via-transparent to-background/60" />
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-background via-transparent to-background" />
      </div>

      {/* LAYER 3 (MID-FRONT): Editorial Foreground Identity Typography */}
      <div
        ref={textFrontRef}
        className="absolute inset-0 z-30 pointer-events-none flex flex-col justify-between p-8 md:p-16"
      >
        {/* Top-Left Prominent Name */}
        <div className="space-y-1">
          <div className="text-[11px] font-mono tracking-widest text-accent uppercase flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            <span>DIRECT SCROLL SEQUENCE</span>
          </div>
          <h1 className="font-display font-extrabold text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight text-white uppercase leading-[0.92]">
            HIMANSHU<br />SHARMA
          </h1>
        </div>

        {/* Bottom Metadata & Positioning */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-2 max-w-md">
            <div className="font-mono text-xs md:text-sm tracking-widest text-zinc-300 space-y-1">
              {PROFILE.roles.map((role, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="text-accent">—</span>
                  <span className="font-medium tracking-wider">{role}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted font-mono tracking-wide">
              {PROFILE.experienceYears} YEARS EXP // {PROFILE.projectsShipped} SHIPPED
            </p>
          </div>

          {/* Scroll cue */}
          <div
            className={`transition-opacity duration-700 font-mono text-[11px] tracking-widest text-zinc-400 flex items-center gap-3 ${
              scrollHintVisible ? "opacity-100" : "opacity-0"
            }`}
          >
            <span className="text-accent animate-bounce">↓</span>
            <span>SCROLL TO ENTER</span>
          </div>
        </div>
      </div>

      {/* LAYER 4 (FRONT): Signature Impact Recoil Flash */}
      <div
        ref={impactFlashRef}
        className="absolute inset-0 z-40 pointer-events-none bg-amber-400/20 mix-blend-screen opacity-0"
      />

      {/* Frame / Status Counter in corner */}
      <div className="absolute bottom-4 right-6 z-30 font-mono text-[10px] text-muted tracking-widest">
        <span>FRM {String(currentFrameIndex + 1).padStart(3, "0")} / 240</span>
        {hasImpacted && <span className="ml-2 text-accent font-bold">[ IMPACT ]</span>}
      </div>
    </section>
  );
}
