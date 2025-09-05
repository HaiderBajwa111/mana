"use client";

import { useState } from "react";
import { Package } from "lucide-react";
import { cn } from "@/lib/utils";

interface StaticSTLThumbnailProps {
  thumbnailUrl?: string | null;
  fileUrl?: string | null;
  alt?: string;
  className?: string;
  width?: number;
  height?: number;
  showFallback?: boolean;
}

/**
 * Displays a static STL thumbnail image
 * This component just shows the pre-generated thumbnail, no 3D rendering
 */
export function StaticSTLThumbnail({
  thumbnailUrl,
  fileUrl,
  alt = "3D Model",
  className = "",
  width = 64,
  height = 64,
  showFallback = true,
}: StaticSTLThumbnailProps) {
  const [imageError, setImageError] = useState(false);

  // Use local thumbnail if it starts with /thumbnails/
  // Otherwise use the provided URL (for Supabase storage)
  const imageSrc = thumbnailUrl?.startsWith('/thumbnails/') 
    ? thumbnailUrl 
    : thumbnailUrl;

  // If we have a thumbnail URL, use it
  if (imageSrc && !imageError) {
    return (
      <div
        className={cn("rounded-lg overflow-hidden bg-gray-50", className)}
        style={{ width, height }}
      >
        <img
          src={imageSrc}
          alt={alt}
          className="w-full h-full object-cover"
          onError={() => {
            console.log(`[Static Thumbnail] Failed to load: ${imageSrc}`);
            setImageError(true);
          }}
          loading="lazy"
        />
      </div>
    );
  }

  // Fallback to a nice placeholder
  if (showFallback) {
    return (
      <div
        className={cn(
          "rounded-lg overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center",
          className
        )}
        style={{ width, height }}
      >
        <Package className="w-6 h-6 text-blue-600" />
      </div>
    );
  }

  return null;
}