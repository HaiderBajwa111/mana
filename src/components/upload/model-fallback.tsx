"use client";

import { FileQuestion } from "lucide-react";

export function ModelFallback() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-muted/20 rounded-lg">
      <div className="text-center p-4">
        <FileQuestion className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
        <p className="text-xs text-muted-foreground">3D preview unavailable</p>
      </div>
    </div>
  );
}