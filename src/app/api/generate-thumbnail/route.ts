import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
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
    
    console.log(`[Generate Thumbnail API] Processing thumbnail for project ${projectId}`);
    
    // Convert data URL to buffer
    const base64Data = thumbnailDataUrl.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");
    
    // Upload to Supabase storage
    const supabase = await createClient();
    const fileName = `thumbnails/${projectId}.png`;
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("main")
      .upload(fileName, buffer, {
        contentType: "image/png",
        upsert: true, // Replace if exists
      });
    
    if (uploadError) {
      console.error(`[Generate Thumbnail API] Upload error:`, uploadError);
      return NextResponse.json(
        { error: "Failed to upload thumbnail" },
        { status: 500 }
      );
    }
    
    // Get public URL for the thumbnail
    const { data: urlData } = supabase.storage
      .from("main")
      .getPublicUrl(fileName);
    
    const thumbnailUrl = urlData.publicUrl;
    
    // Update project with thumbnail URL
    await db.project.update({
      where: { id: projectId },
      data: { thumbnailUrl },
    });
    
    console.log(`[Generate Thumbnail API] Thumbnail saved: ${thumbnailUrl}`);
    
    return NextResponse.json({
      success: true,
      thumbnailUrl,
    });
  } catch (error: any) {
    console.error("[Generate Thumbnail API] Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate thumbnail" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { projectId } = await request.json();
    
    if (!projectId) {
      return NextResponse.json(
        { error: "Project ID is required" },
        { status: 400 }
      );
    }
    
    console.log(`[Generate Thumbnail API] Deleting thumbnail for project ${projectId}`);
    
    // Delete from Supabase storage
    const supabase = await createClient();
    const fileName = `thumbnails/${projectId}.png`;
    
    const { error: deleteError } = await supabase.storage
      .from("main")
      .remove([fileName]);
    
    if (deleteError) {
      console.error(`[Generate Thumbnail API] Delete error:`, deleteError);
      return NextResponse.json(
        { error: "Failed to delete thumbnail" },
        { status: 500 }
      );
    }
    
    // Clear thumbnail URL in database
    await db.project.update({
      where: { id: projectId },
      data: { thumbnailUrl: null },
    });
    
    console.log(`[Generate Thumbnail API] Thumbnail deleted`);
    
    return NextResponse.json({
      success: true,
    });
  } catch (error: any) {
    console.error("[Generate Thumbnail API] Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete thumbnail" },
      { status: 500 }
    );
  }
}