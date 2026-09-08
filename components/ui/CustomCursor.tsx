"use client";

import { useEffect, useState, useRef } from "react";
import { useCanvasState } from "@/lib/canvas-state";
import { ArrowUpRight } from "lucide-react";

export function CustomCursor() {
  const { hoveredProjectId } = useCanvasState();
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const cursorFollowerRef = useRef<HTMLDivElement>(null);

  const [visible, setVisible] = useState(false);
  const [isFinePointer, setIsFinePointer] = useState(false);

  useEffect(() => {
    // Only enable on desktop fine pointers
    if (window.matchMedia("(pointer: fine)").matches) {
      setIsFinePointer(true);
    } else {
      return;
    }

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let followerX = mouseX;
    let followerY = mouseY;
    let animId: number;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!visible) setVisible(true);

      if (cursorDotRef.current) {
        cursorDotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      }
    };

    const handleMouseLeave = () => setVisible(false);
    const handleMouseEnter = () => setVisible(true);

    const updateFollower = () => {
      // Smooth lerp
      followerX += (mouseX - followerX) * 0.18;
      followerY += (mouseY - followerY) * 0.18;

      if (cursorFollowerRef.current) {
        cursorFollowerRef.current.style.transform = `translate3d(${followerX}px, ${followerY}px, 0)`;
      }

      animId = requestAnimationFrame(updateFollower);
    };

    animId = requestAnimationFrame(updateFollower);

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [visible]);

  if (!isFinePointer || !visible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden" aria-hidden="true">
      {/* Small Precision Center Dot */}
      <div
        ref={cursorDotRef}
        className={`fixed top-0 left-0 w-2 h-2 -ml-1 -mt-1 rounded-full bg-accent transition-opacity duration-200 ${
          hoveredProjectId ? "opacity-0" : "opacity-100"
        }`}
      />

      {/* Smooth Trailing Follower with Context Morph */}
      <div
        ref={cursorFollowerRef}
        className={`fixed top-0 left-0 -ml-4 -mt-4 transition-all duration-300 ease-out flex items-center justify-center ${
          hoveredProjectId
            ? "w-20 h-8 -ml-10 -mt-4 rounded-full bg-accent text-background font-mono text-[11px] font-bold tracking-wider px-2 shadow-xl"
            : "w-8 h-8 rounded-full border border-white/30 bg-white/5"
        }`}
      >
        {hoveredProjectId && (
          <span className="flex items-center gap-1">
            <span>VIEW</span>
            <ArrowUpRight className="w-3 h-3" />
          </span>
        )}
      </div>
    </div>
  );
}
