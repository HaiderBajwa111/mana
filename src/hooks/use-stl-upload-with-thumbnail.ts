import { useState } from "react";
import { generateSTLThumbnail } from "@/lib/stl-thumbnail-generator-client";
import { toast } from "@/components/ui/use-toast";

interface UploadOptions {
  onThumbnailGenerated?: (thumbnailUrl: string) => void;
  onUploadComplete?: (projectId: string, fileUrl: string) => void;
  onError?: (error: string) => void;
}

export function useSTLUploadWithThumbnail(options: UploadOptions = {}) {
  const [isUploading, setIsUploading] = useState(false);
  const [isGeneratingThumbnail, setIsGeneratingThumbnail] = useState(false);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

  const uploadSTLWithThumbnail = async (
    file: File,
    formData: FormData
  ): Promise<{ success: boolean; projectId?: string; error?: string }> => {
    try {
      setIsUploading(true);

      // Step 1: Upload the STL file
      console.log("[Upload with Thumbnail] Uploading STL file...");
      const uploadResponse = await fetch("/api/creator/upload-stl", {
        method: "POST",
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload STL file");
      }

      const uploadResult = await uploadResponse.json();
      if (!uploadResult.success) {
        throw new Error(uploadResult.error || "Upload failed");
      }

      const projectId = uploadResult.data.projectId;
      const fileUrl = uploadResult.data.fileUrl;

      console.log(`[Upload with Thumbnail] STL uploaded. Project ID: ${projectId}`);

      // Step 2: Generate thumbnail
      setIsGeneratingThumbnail(true);
      console.log("[Upload with Thumbnail] Generating thumbnail...");

      const thumbnailDataUrl = await generateSTLThumbnail(fileUrl, {
        width: 512,
        height: 512,
        quality: 0.95,
      });

      if (thumbnailDataUrl) {
        setThumbnailPreview(thumbnailDataUrl);
        
        // Step 3: Save thumbnail to storage
        console.log("[Upload with Thumbnail] Saving thumbnail...");
        const thumbnailResponse = await fetch("/api/generate-thumbnail", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            projectId,
            thumbnailDataUrl,
          }),
        });

        if (thumbnailResponse.ok) {
          const thumbnailResult = await thumbnailResponse.json();
          console.log(`[Upload with Thumbnail] Thumbnail saved: ${thumbnailResult.thumbnailUrl}`);
          
          options.onThumbnailGenerated?.(thumbnailResult.thumbnailUrl);
          
          toast({
            title: "Success!",
            description: "STL file uploaded and thumbnail generated",
          });
        } else {
          console.warn("[Upload with Thumbnail] Failed to save thumbnail, but STL uploaded successfully");
          toast({
            title: "Partial Success",
            description: "STL uploaded but thumbnail generation failed",
            variant: "default",
          });
        }
      } else {
        console.warn("[Upload with Thumbnail] Could not generate thumbnail");
      }

      setIsGeneratingThumbnail(false);
      options.onUploadComplete?.(projectId, fileUrl);

      return {
        success: true,
        projectId,
      };
    } catch (error: any) {
      console.error("[Upload with Thumbnail] Error:", error);
      
      const errorMessage = error.message || "Failed to upload file";
      options.onError?.(errorMessage);
      
      toast({
        title: "Upload Failed",
        description: errorMessage,
        variant: "destructive",
      });

      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      setIsUploading(false);
      setIsGeneratingThumbnail(false);
    }
  };

  const resetThumbnail = () => {
    setThumbnailPreview(null);
  };

  return {
    uploadSTLWithThumbnail,
    isUploading,
    isGeneratingThumbnail,
    thumbnailPreview,
    resetThumbnail,
  };
}