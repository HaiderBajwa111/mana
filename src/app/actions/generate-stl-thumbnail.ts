"use server";

import { generateSTLThumbnail } from "@/lib/stl-thumbnail-generator-client";
import fs from "fs/promises";
import path from "path";

export interface ThumbnailGenerationResult {
  success: boolean;
  thumbnailPath?: string;
  error?: string;
}

/**
 * Server action to generate and save STL thumbnail locally
 */
export async function generateAndSaveSTLThumbnail(
  projectId: string,
  stlUrl: string
): Promise<ThumbnailGenerationResult> {
  try {
    console.log(`[Generate STL Thumbnail] Starting for project ${projectId}`);
    
    // This needs to be called from client side since it uses browser APIs
    // We'll return the path where it should be saved
    const thumbnailFileName = `${projectId}.png`;
    const thumbnailPath = `/thumbnails/${thumbnailFileName}`;
    
    return {
      success: true,
      thumbnailPath,
    };
  } catch (error: any) {
    console.error("[Generate STL Thumbnail] Error:", error);
    return {
      success: false,
      error: error.message || "Failed to generate thumbnail",
    };
  }
}

/**
 * Save base64 thumbnail to public folder
 */
export async function saveThumbnailToPublic(
  projectId: string,
  base64Data: string
): Promise<ThumbnailGenerationResult> {
  try {
    // Remove data URL prefix if present
    const base64Image = base64Data.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Image, "base64");
    
    // Save to public/thumbnails folder
    const thumbnailFileName = `${projectId}.png`;
    const publicPath = path.join(process.cwd(), "public", "thumbnails", thumbnailFileName);
    
    await fs.writeFile(publicPath, buffer);
    
    console.log(`[Save Thumbnail] Saved to ${publicPath}`);
    
    return {
      success: true,
      thumbnailPath: `/thumbnails/${thumbnailFileName}`,
    };
  } catch (error: any) {
    console.error("[Save Thumbnail] Error:", error);
    return {
      success: false,
      error: error.message || "Failed to save thumbnail",
    };
  }
}