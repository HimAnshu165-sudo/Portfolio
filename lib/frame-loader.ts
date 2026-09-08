// High-efficiency Image Frame Sequence Cache

export const TOTAL_FRAMES = 240;
export const IMPACT_FRAME = 205;

class FrameCache {
  private images: HTMLImageElement[] = [];
  private isLoaded = false;
  private loadProgress = 0;
  private listeners: ((progress: number, ready: boolean) => void)[] = [];

  constructor() {
    // Lazy initialized on client
  }

  public getFrame(index: number): HTMLImageElement | null {
    const clamped = Math.max(0, Math.min(index, TOTAL_FRAMES - 1));
    return this.images[clamped] || this.images[0] || null;
  }

  public onProgress(cb: (progress: number, ready: boolean) => void) {
    this.listeners.push(cb);
    cb(this.loadProgress, this.isLoaded);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== cb);
    };
  }

  public async preloadAll(): Promise<void> {
    if (typeof window === "undefined" || this.images.length > 0) return;

    let loadedCount = 0;
    const batchSize = 16;
    const framesToLoad: number[] = [];

    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      framesToLoad.push(i);
    }

    const loadSingleFrame = (frameNum: number): Promise<HTMLImageElement> => {
      return new Promise((resolve) => {
        const img = new Image();
        const padded = String(frameNum).padStart(3, "0");
        img.src = `/assets/entry/frames/ezgif-frame-${padded}.jpg`;
        img.onload = () => {
          this.images[frameNum - 1] = img;
          loadedCount++;
          this.loadProgress = Math.round((loadedCount / TOTAL_FRAMES) * 100);
          this.listeners.forEach((l) => l(this.loadProgress, loadedCount >= 40));
          resolve(img);
        };
        img.onerror = () => {
          // If a frame fails, reuse previous or fallback
          loadedCount++;
          this.loadProgress = Math.round((loadedCount / TOTAL_FRAMES) * 100);
          this.listeners.forEach((l) => l(this.loadProgress, loadedCount >= 40));
          resolve(img);
        };
      });
    };

    // Load first 20 frames immediately so user gets immediate visual boot
    for (let i = 1; i <= 20; i++) {
      await loadSingleFrame(i);
    }

    // Then load the rest in parallel batches
    const remaining = framesToLoad.slice(20);
    for (let i = 0; i < remaining.length; i += batchSize) {
      const chunk = remaining.slice(i, i + batchSize);
      await Promise.all(chunk.map(loadSingleFrame));
    }

    this.isLoaded = true;
    this.listeners.forEach((l) => l(100, true));
  }
}

export const frameCache = new FrameCache();
