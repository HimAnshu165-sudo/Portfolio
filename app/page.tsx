"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Preloader } from "@/components/ui/Preloader";
import { HUDNav } from "@/components/ui/HUDNav";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { SmoothScrollProvider } from "@/components/ui/SmoothScrollProvider";
import { HeroEntry } from "@/components/sections/HeroEntry";
import { Manifesto } from "@/components/sections/Manifesto";
import { SelectedWork } from "@/components/sections/SelectedWork";
import { TheLab } from "@/components/sections/TheLab";
import { Capabilities } from "@/components/sections/Capabilities";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";

// Dynamically import persistent WebGL Canvas with SSR disabled
const SceneCanvas = dynamic(
  () => import("@/components/canvas/SceneCanvas"),
  { ssr: false }
);

export default function Home() {
  const [bootComplete, setBootComplete] = useState(false);

  return (
    <main className="relative min-h-screen bg-background text-foreground selection:bg-accent selection:text-background">
      {/* 00: Boot System Preloader */}
      {!bootComplete && (
        <Preloader onComplete={() => setBootComplete(true)} />
      )}

      {/* Persistent WebGL Canvas Universe */}
      <SceneCanvas />

      {/* Minimal HUD Navigation Indicator */}
      <HUDNav />

      {/* Context-Aware Custom Cursor */}
      <CustomCursor />

      {/* Smooth Scroll Cinematic Experience Container */}
      <SmoothScrollProvider>
        <div className="relative z-10 w-full overflow-hidden">
          {/* 01: Character Entrance & Kick Impact */}
          <HeroEntry />

          {/* 02: Positioning Manifesto */}
          <Manifesto />

          {/* 03: Selected Work (10 Real Projects in Elastic Rows) */}
          <SelectedWork />

          {/* 04: The Lab (3D Spatial Tech Environment) */}
          <TheLab />

          {/* 05: Capabilities (Full-Lifecycle Rows) */}
          <Capabilities />

          {/* 06: Behind The Screen (About + Integrated Numbers) */}
          <About />

          {/* 07: Final Scene & Contact */}
          <Contact />
        </div>
      </SmoothScrollProvider>
    </main>
  );
}
