"use client";

import { usePerformanceMonitor } from "@/utils/performance-monitor";
import { useState } from "react";
import { Activity, MemoryStick, X } from "lucide-react";

export function PerformancePanel() {
  const [isVisible, setIsVisible] = useState(false);
  const stats = usePerformanceMonitor();

  // Only show in development
  if (process.env.NODE_ENV !== "development") return null;

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 z-50 p-2 bg-black/80 text-white rounded-lg shadow-lg hover:bg-black/90 transition-all"
        title="Show Performance Monitor"
      >
        <Activity className="w-4 h-4" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-black/90 text-white p-4 rounded-lg shadow-lg min-w-[200px]">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold">Performance</h3>
        <button
          onClick={() => setIsVisible(false)}
          className="p-1 hover:bg-white/20 rounded"
        >
          <X className="w-3 h-3" />
        </button>
      </div>
      
      <div className="space-y-2 text-xs">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1">
            <Activity className="w-3 h-3" />
            FPS:
          </span>
          <span className={`font-mono ${stats.fps < 30 ? "text-red-400" : stats.fps < 50 ? "text-yellow-400" : "text-green-400"}`}>
            {stats.fps}
          </span>
        </div>
        
        {stats.memoryUsage > 0 && (
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1">
              <MemoryStick className="w-3 h-3" />
              Memory:
            </span>
            <span className="font-mono">
              {stats.memoryUsage} MB
            </span>
          </div>
        )}
        
        <div className="pt-2 border-t border-white/20">
          <div className="flex items-center justify-between">
            <span>STL Quality:</span>
            <span className="text-xs">
              {window.innerWidth < 640 ? "Low" : window.innerWidth < 1024 ? "Medium" : "High"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}