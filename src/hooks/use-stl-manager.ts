import { useEffect, useRef, useCallback, useState } from "react";

interface STLManagerOptions {
  maxConcurrentLoads?: number;
  preloadDistance?: string;
  unloadDistance?: string;
}

// Global manager for STL loading queue
class STLLoadManager {
  private static instance: STLLoadManager;
  private loadQueue: Set<string> = new Set();
  private activeLoads: Map<string, boolean> = new Map();
  private maxConcurrent: number = 3;

  static getInstance(): STLLoadManager {
    if (!STLLoadManager.instance) {
      STLLoadManager.instance = new STLLoadManager();
    }
    return STLLoadManager.instance;
  }

  setMaxConcurrent(max: number) {
    this.maxConcurrent = max;
  }

  canLoad(url: string): boolean {
    // Check if already loading or queued
    if (this.activeLoads.has(url) || this.loadQueue.has(url)) {
      return false;
    }
    
    // Check if we're at max concurrent loads
    return this.activeLoads.size < this.maxConcurrent;
  }

  startLoad(url: string) {
    if (this.canLoad(url)) {
      this.activeLoads.set(url, true);
      return true;
    }
    
    // Add to queue if can't load immediately
    this.loadQueue.add(url);
    return false;
  }

  finishLoad(url: string) {
    this.activeLoads.delete(url);
    this.loadQueue.delete(url);
    
    // Process queue
    if (this.loadQueue.size > 0 && this.activeLoads.size < this.maxConcurrent) {
      const next = this.loadQueue.values().next().value;
      if (next) {
        this.loadQueue.delete(next);
        this.startLoad(next);
      }
    }
  }

  reset() {
    this.loadQueue.clear();
    this.activeLoads.clear();
  }
}

export function useSTLManager(options: STLManagerOptions = {}) {
  const manager = useRef(STLLoadManager.getInstance());
  
  useEffect(() => {
    if (options.maxConcurrentLoads) {
      manager.current.setMaxConcurrent(options.maxConcurrentLoads);
    }
  }, [options.maxConcurrentLoads]);

  const requestLoad = useCallback((url: string): boolean => {
    return manager.current.startLoad(url);
  }, []);

  const releaseLoad = useCallback((url: string) => {
    manager.current.finishLoad(url);
  }, []);

  const reset = useCallback(() => {
    manager.current.reset();
  }, []);

  return {
    requestLoad,
    releaseLoad,
    reset,
  };
}

// Hook for managing performance based on device capabilities
export function useDevicePerformance() {
  const getPerformanceProfile = useCallback(() => {
    // Check if we're on the server
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return 'medium'; // Default for SSR
    }

    // Check for WebGL support and capabilities
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    
    if (!gl) {
      return 'low';
    }

    // Check device memory (if available)
    const memory = (navigator as any).deviceMemory;
    const cores = navigator.hardwareConcurrency || 1;
    
    // Simple heuristic for device performance
    if (memory && memory <= 2) return 'low';
    if (cores <= 2) return 'low';
    if (memory && memory >= 8 && cores >= 4) return 'high';
    
    return 'medium';
  }, []);

  const [profile, setProfile] = useState<'low' | 'medium' | 'high'>('medium');

  useEffect(() => {
    // Only run on client side
    setProfile(getPerformanceProfile() as 'low' | 'medium' | 'high');
  }, [getPerformanceProfile]);
  
  return {
    profile,
    maxConcurrentLoads: profile === 'low' ? 1 : profile === 'medium' ? 2 : 3,
    defaultQuality: profile as 'low' | 'medium' | 'high',
    enableAutoRotate: profile !== 'low',
    enableShadows: profile === 'high',
  };
}