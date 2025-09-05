"use server";

import { getCurrentUser } from "@/app/actions/auth/get-current-user";
import { upload3DModel } from "@/lib/storage";
import db from "@/db";

export async function uploadSTLFile(formData: FormData) {
  try {
    console.log("📤 Starting STL upload...");
    
    // Get current user
    const userResult = await getCurrentUser();
    if (!userResult.success) {
      return {
        success: false,
        error: "User not authenticated",
      };
    }
    
    if (!("user" in userResult)) {
      return {
        success: false,
        error: "User not found",
      };
    }
    
    const userId = userResult.user.id;
    const file = formData.get("file") as File;
    const projectTitle = (formData.get("title") as string) || file.name.replace(/\.[^/.]+$/, "");
    const description = (formData.get("description") as string) || "3D Print Project";
    const pickupLocation = (formData.get("pickupLocation") as string) || null;
    const color = (formData.get("color") as string) || "Black";
    const postProcessing = (formData.get("postProcessing") as string) === "true";
    const finishNotes = (formData.get("finishNotes") as string) || null;
    
    if (!file) {
      return {
        success: false,
        error: "No file provided",
      };
    }
    
    console.log("📁 File details:", {
      name: file.name,
      size: file.size,
      type: file.type,
    });
    
    // Upload to Supabase storage bucket (to the 'stl' folder)
    const uploadResult = await upload3DModel(userId, file);
    
    if (!uploadResult.success) {
      console.error("❌ Upload failed:", uploadResult.error);
      return {
        success: false,
        error: uploadResult.error || "Failed to upload file",
      };
    }
    
    console.log("✅ File uploaded to storage:", uploadResult.data?.fileUrl);
    
    // Create a submitted project record (not draft) so it appears for makers
    const project = await db.project.create({
      data: {
        creatorId: userId,
        title: projectTitle,
        description: description,
        fileUrl: uploadResult.data!.fileUrl,
        fileName: uploadResult.data!.fileName,
        fileSize: uploadResult.data!.fileSize,
        status: "SUBMITTED", // Changed from DRAFT to SUBMITTED
        paymentStatus: "PENDING",
        material: "PLA",
        color: color,
        finish: postProcessing ? "Post-processed" : "Standard",
        resolution: "0.2mm",
        quantity: 1,
        designNotes: finishNotes || `Pickup: ${pickupLocation}`, // Store pickup location in designNotes
      },
    });
    
    console.log("💾 Project saved to database:", project.id);
    
    // Generate thumbnail path (client will generate the actual image)
    const thumbnailPath = `/thumbnails/${project.id}.png`;
    
    // Update project with thumbnail path
    await db.project.update({
      where: { id: project.id },
      data: { thumbnailUrl: thumbnailPath },
    });
    
    return {
      success: true,
      data: {
        projectId: project.id,
        fileUrl: uploadResult.data!.fileUrl,
        fileName: uploadResult.data!.fileName,
        thumbnailPath,
      },
    };
  } catch (error) {
    console.error("❌ Upload STL error:", error);
    return {
      success: false,
      error: "Failed to upload STL file",
    };
  }
}