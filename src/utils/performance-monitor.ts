import { useEffect, useState } from "react";

export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private frameCount = 0;
  private lastTime = typeof window !== 'undefined' ? performance.now() : 0;
  private fps = 0;
  private memoryUsage = 0;
  private listeners: Set<(stats: PerformanceStats) => void> = new Set();
  private animationFrameId: number | null = null;

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  start() {
    if (typeof window === 'undefined') return;
    if (this.animationFrameId !== null) return;
    
    const measure = () => {
      this.frameCount++;
      const currentTime = performance.now();
      
      if (currentTime >= this.lastTime + 1000) {
        this.fps = Math.round((this.frameCount * 1000) / (currentTime - this.lastTime));
        this.frameCount = 0;
        this.lastTime = currentTime;
        
        // Measure memory if available
        if ((performance as any).memory) {
          this.memoryUsage = Math.round(
            ((performance as any).memory.usedJSHeapSize / 1048576) * 100
          ) / 100;
        }
        
        // Notify listeners
        this.notifyListeners();
      }
      
      this.animationFrameId = requestAnimationFrame(measure);
    };
    
    measure();
  }

  stop() {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  subscribe(callback: (stats: PerformanceStats) => void) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  private notifyListeners() {
    const stats: PerformanceStats = {
      fps: this.fps,
      memoryUsage: this.memoryUsage,
      timestamp: Date.now(),
    };
    
    this.listeners.forEach((callback) => callback(stats));
  }

  getStats(): PerformanceStats {
    return {
      fps: this.fps,
      memoryUsage: this.memoryUsage,
      timestamp: Date.now(),
    };
  }
}

export interface PerformanceStats {
  fps: number;
  memoryUsage: number;
  timestamp: number;
}

// Hook for React components
export function usePerformanceMonitor() {
  const [stats, setStats] = useState<PerformanceStats>({
    fps: 0,
    memoryUsage: 0,
    timestamp: Date.now(),
  });

  useEffect(() => {
    const monitor = PerformanceMonitor.getInstance();
    monitor.start();
    
    const unsubscribe = monitor.subscribe((newStats) => {
      setStats(newStats);
    });
    
    return () => {
      unsubscribe();
    };
  }, []);

  return stats;
}