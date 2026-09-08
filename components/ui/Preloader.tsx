"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { frameCache } from "@/lib/frame-loader";
import { canvasStore } from "@/lib/canvas-state";

export function Preloader({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [systemLogs, setSystemLogs] = useState<string[]>([
    "HS/CORE.V26 BOOT",
    "INITIALIZING DISPLAY MATRIX",
  ]);

  useEffect(() => {
    // Start preloading frames
    frameCache.preloadAll();

    const unsubscribe = frameCache.onProgress((prog, ready) => {
      setProgress(prog);

      if (prog > 30 && !systemLogs.includes("MOUNTING WEBGL SHADER PIPELINE")) {
        setSystemLogs((prev) => [...prev, "MOUNTING WEBGL SHADER PIPELINE"]);
      }
      if (prog > 70 && !systemLogs.includes("BUFFERING FRAME SEQUENCE [240/240]")) {
        setSystemLogs((prev) => [...prev, "BUFFERING FRAME SEQUENCE [240/240]"]);
      }
      if (prog >= 100 || ready) {
        if (!systemLogs.includes("SYSTEM READY // ENGINE ACTIVE")) {
          setSystemLogs((prev) => [...prev, "SYSTEM READY // ENGINE ACTIVE"]);
        }
        canvasStore.setReady(true);
        setTimeout(() => {
          setIsReady(true);
          setTimeout(onComplete, 400);
        }, 300);
      }
    });

    return () => unsubscribe();
  }, [onComplete, systemLogs]);

  return (
    <AnimatePresence>
      {!isReady && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } }}
          className="fixed inset-0 z-50 flex flex-col justify-between p-6 md:p-12 bg-[#070709] text-[#f4f4f5] select-none"
        >
          {/* Top Row Metadata */}
          <div className="flex justify-between items-start text-xs font-mono tracking-widest text-muted-light">
            <div className="flex items-center gap-3">
              <span className="inline-block w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span>HIMANSHU.SHARMA</span>
            </div>
            <div className="text-right">
              <span>HS / 2026</span>
              <span className="block text-[10px] text-muted">BUILD 01.5.0</span>
            </div>
          </div>

          {/* Center Identity */}
          <div className="max-w-xl mx-auto w-full space-y-6">
            <div className="space-y-2">
              <span className="text-[11px] font-mono tracking-widest text-accent uppercase">
                Creative Engineering Environment
              </span>
              <h1 className="text-2xl md:text-4xl font-display font-medium tracking-tight text-white">
                INITIALIZING EXPERIENCE
              </h1>
            </div>

            {/* Minimal Progress Bar */}
            <div className="space-y-2">
              <div className="w-full h-[2px] bg-white/10 overflow-hidden relative">
                <motion.div
                  className="h-full bg-accent"
                  style={{ width: `${progress}%` }}
                  transition={{ ease: "easeOut", duration: 0.2 }}
                />
              </div>
              <div className="flex justify-between text-[11px] font-mono text-muted">
                <span>BUFFERING SEQUENCE</span>
                <span className="text-accent font-semibold">{progress}%</span>
              </div>
            </div>

            {/* System Logs */}
            <div className="font-mono text-[10px] text-muted space-y-1 h-14 overflow-hidden">
              {systemLogs.slice(-3).map((log, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="text-accent/60">&gt;</span>
                  <span>{log}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Row Technical Status */}
          <div className="flex justify-between items-end text-[11px] font-mono text-muted">
            <div className="flex gap-6">
              <span>WEBGL: 2.0</span>
              <span>MOTION: GSAP/FRAMER</span>
              <span className="hidden sm:inline">TARGET: 60FPS</span>
            </div>
            <div>
              <span>SCROLL-DRIVEN ARCHITECTURE</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
