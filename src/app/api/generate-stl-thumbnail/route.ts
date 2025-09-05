import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import db from "@/db";

export async function POST(request: NextRequest) {
  try {
    const { projectId, thumbnailDataUrl } = await request.json();
    
    if (!projectId || !thumbnailDataUrl) {
      return NextResponse.json(
        { error: "Project ID and thumbnail data are required" },
        { status: 400 }
      );
    }
    
    console.log(`[Generate STL Thumbnail API] Processing thumbnail for project ${projectId}`);
    
    // Convert data URL to buffer
    const base64Data = thumbnailDataUrl.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");
    
    // Save to public/thumbnails folder
    const thumbnailFileName = `${projectId}.png`;
    const publicPath = path.join(process.cwd(), "public", "thumbnails", thumbnailFileName);
    
    // Ensure directory exists
    await fs.mkdir(path.dirname(publicPath), { recursive: true });
    
    // Write file
    await fs.writeFile(publicPath, buffer);
    
    const thumbnailUrl = `/thumbnails/${thumbnailFileName}`;
    
    // Update project with thumbnail URL
    try {
      await db.project.update({
        where: { id: projectId },
        data: { thumbnailUrl },
      });
      console.log(`[Generate STL Thumbnail API] Updated project with thumbnail URL: ${thumbnailUrl}`);
    } catch (dbError) {
      console.error(`[Generate STL Thumbnail API] Database update error:`, dbError);
      // Continue even if DB update fails - thumbnail is saved
    }
    
    console.log(`[Generate STL Thumbnail API] Thumbnail saved: ${thumbnailUrl}`);
    
    return NextResponse.json({
      success: true,
      thumbnailUrl,
    });
  } catch (error: any) {
    console.error("[Generate STL Thumbnail API] Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate thumbnail" },
      { status: 500 }
    );
  }
}