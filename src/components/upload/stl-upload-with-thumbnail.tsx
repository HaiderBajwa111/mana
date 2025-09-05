"use client";

import { useEffect, useState } from "react";
import { generateSTLThumbnail } from "@/lib/stl-thumbnail-generator-client";
import { saveThumbnailToPublic } from "@/app/actions/generate-stl-thumbnail";

interface STLUploadWithThumbnailProps {
  projectId: string;
  stlUrl: string;
  onThumbnailGenerated?: (thumbnailPath: string) => void;
}

export function STLUploadWithThumbnail({
  projectId,
  stlUrl,
  onThumbnailGenerated,
}: STLUploadWithThumbnailProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [thumbnailPath, setThumbnailPath] = useState<string | null>(null);

  useEffect(() => {
    const generateThumbnail = async () => {
      if (!stlUrl || !projectId || isGenerating) return;
      
      setIsGenerating(true);
      console.log(`[STL Upload Thumbnail] Generating for project ${projectId}`);
      
      try {
        // Generate thumbnail client-side
        const thumbnailDataUrl = await generateSTLThumbnail(stlUrl, {
          width: 512,
          height: 512,
          quality: 0.95,
        });
        
        if (thumbnailDataUrl) {
          // Save to public folder via server action
          const result = await saveThumbnailToPublic(projectId, thumbnailDataUrl);
          
          if (result.success && result.thumbnailPath) {
            console.log(`[STL Upload Thumbnail] Saved to ${result.thumbnailPath}`);
            setThumbnailPath(result.thumbnailPath);
            onThumbnailGenerated?.(result.thumbnailPath);
          }
        }
      } catch (error) {
        console.error("[STL Upload Thumbnail] Error:", error);
      } finally {
        setIsGenerating(false);
      }
    };
    
    generateThumbnail();
  }, [projectId, stlUrl, onThumbnailGenerated]);

  if (isGenerating) {
    return (
      <div className="text-sm text-muted-foreground">
        Generating preview thumbnail...
      </div>
    );
  }

  if (thumbnailPath) {
    return (
      <div className="text-sm text-green-600">
        ✓ Thumbnail generated
      </div>
    );
  }

  return null;
}