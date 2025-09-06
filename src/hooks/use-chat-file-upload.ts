"use client";

import { useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { v4 as uuidv4 } from "uuid";
import { useToast } from "@/hooks/ui/use-toast";

export interface ChatFileAttachment {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  fileUrl: string;
  mimeType: string;
}

export interface UploadProgress {
  fileName: string;
  progress: number;
  status: "uploading" | "completed" | "error";
  error?: string;
}

export function useChatFileUpload() {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([]);
  const { toast } = useToast();

  const validateFile = useCallback((file: File): string | null => {
    // Check file size (max 50MB)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      return "File size must be less than 50MB";
    }

    // Check file type
    const validImageTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
    const valid3DTypes = [".stl", ".obj", ".3mf", ".ply", ".step", ".iges"];
    
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf("."));
    const isValidImage = validImageTypes.includes(file.type);
    const isValid3D = valid3DTypes.includes(fileExtension);

    if (!isValidImage && !isValid3D) {
      return "Invalid file type. Please upload images (JPG, PNG, GIF, WebP) or 3D models (STL, OBJ, 3MF, PLY, STEP, IGES)";
    }

    return null;
  }, []);

  const uploadFile = useCallback(async (
    file: File,
    userId: string,
    conversationId: string
  ): Promise<ChatFileAttachment | null> => {
    console.log("🔍 [FILE_UPLOAD] Starting file upload:", { fileName: file.name, userId, conversationId });
    
    // Validate file
    const validationError = validateFile(file);
    if (validationError) {
      console.log("🔍 [FILE_UPLOAD] File validation failed:", validationError);
      toast({
        title: "Invalid File",
        description: validationError,
        variant: "destructive",
      });
      return null;
    }

    if (!userId || !conversationId) {
      console.log("🔍 [FILE_UPLOAD] Missing required parameters:", { userId, conversationId });
      toast({
        title: "Upload Error",
        description: "Missing user or conversation information",
        variant: "destructive",
      });
      return null;
    }

    setUploading(true);
    
    // Add to progress tracking
    const progressId = uuidv4();
    setUploadProgress(prev => [...prev, {
      fileName: file.name,
      progress: 0,
      status: "uploading"
    }]);

    try {
      // Create Supabase client
      const supabase = createClient();
      
      // Generate unique file name
      const fileExtension = file.name.split(".").pop();
      const fileId = uuidv4();
      const fileName = `chat_${fileId}.${fileExtension}`;
      
      // Create folder path for chat attachments
      const folderPath = `${userId}/chat_attachments/${conversationId}/${fileName}`;
      
      console.log("🔍 [FILE_UPLOAD] Uploading to path:", folderPath);

      // Upload to Supabase storage
      const { data, error } = await supabase.storage
        .from("main")
        .upload(folderPath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        console.error("🔍 [FILE_UPLOAD] Supabase upload error:", error);
        throw new Error(`Failed to upload file: ${error.message}`);
      }

      console.log("🔍 [FILE_UPLOAD] Upload successful, getting public URL");

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("main")
        .getPublicUrl(folderPath);

      // Update progress to completed
      setUploadProgress(prev => 
        prev.map(p => 
          p.fileName === file.name 
            ? { ...p, progress: 100, status: "completed" as const }
            : p
        )
      );

      const attachment: ChatFileAttachment = {
        id: fileId,
        fileName: file.name,
        fileType: fileExtension || "unknown",
        fileSize: file.size,
        fileUrl: urlData.publicUrl,
        mimeType: file.type,
      };

      return attachment;
    } catch (error) {
      console.error("Error uploading file:", error);
      
      // Update progress to error
      setUploadProgress(prev => 
        prev.map(p => 
          p.fileName === file.name 
            ? { 
                ...p, 
                progress: 0, 
                status: "error" as const, 
                error: error instanceof Error ? error.message : "Upload failed" 
              }
            : p
        )
      );

      toast({
        title: "Upload Failed",
        description: "Failed to upload file. Please try again.",
        variant: "destructive",
      });
      
      return null;
    } finally {
      setUploading(false);
      
      // Clear progress after a delay
      setTimeout(() => {
        setUploadProgress(prev => prev.filter(p => p.fileName !== file.name));
      }, 3000);
    }
  }, [validateFile, toast]);

  const uploadMultipleFiles = useCallback(async (
    files: File[],
    userId: string,
    conversationId: string
  ): Promise<ChatFileAttachment[]> => {
    const uploadPromises = files.map(file => uploadFile(file, userId, conversationId));
    const results = await Promise.all(uploadPromises);
    return results.filter((result): result is ChatFileAttachment => result !== null);
  }, [uploadFile]);

  const clearProgress = useCallback(() => {
    setUploadProgress([]);
  }, []);

  return {
    uploading,
    uploadProgress,
    uploadFile,
    uploadMultipleFiles,
    clearProgress,
    validateFile,
  };
}
