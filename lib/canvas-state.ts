"use client";

import { useSyncExternalStore } from "react";

export type SectionId = "entry" | "manifesto" | "work" | "lab" | "capabilities" | "about" | "contact";

interface CanvasState {
  activeSection: SectionId;
  scrollProgress: number;
  impactProgress: number; // 0 to 1 during the kick impact
  isImpactActive: boolean;
  hoveredProjectId: string | null;
  pointer: { x: number; y: number }; // normalized -1 to 1
  isReady: boolean;
}

let state: CanvasState = {
  activeSection: "entry",
  scrollProgress: 0,
  impactProgress: 0,
  isImpactActive: false,
  hoveredProjectId: null,
  pointer: { x: 0, y: 0 },
  isReady: false,
};

const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((listener) => listener());
}

export const canvasStore = {
  get: () => state,
  subscribe: (listener: () => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  setActiveSection: (activeSection: SectionId) => {
    if (state.activeSection !== activeSection) {
      state = { ...state, activeSection };
      notify();
    }
  },
  setScrollProgress: (scrollProgress: number) => {
    state = { ...state, scrollProgress };
    notify();
  },
  triggerImpact: (progress: number = 1) => {
    state = { ...state, isImpactActive: true, impactProgress: progress };
    notify();
  },
  resetImpact: () => {
    state = { ...state, isImpactActive: false, impactProgress: 0 };
    notify();
  },
  setHoveredProject: (hoveredProjectId: string | null) => {
    if (state.hoveredProjectId !== hoveredProjectId) {
      state = { ...state, hoveredProjectId };
      notify();
    }
  },
  setPointer: (x: number, y: number) => {
    state = { ...state, pointer: { x, y } };
    notify();
  },
  setReady: (isReady: boolean) => {
    state = { ...state, isReady };
    notify();
  },
};

export function useCanvasState(): CanvasState {
  return useSyncExternalStore(canvasStore.subscribe, canvasStore.get, () => state);
}
