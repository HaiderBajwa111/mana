"use server";

import { z } from "zod";
import { getCurrentUser } from "@/app/actions/auth/get-current-user";
import { generateSTLThumbnail, uploadThumbnail } from "@/lib/stl-thumbnail";
import { upload3DModel } from "@/lib/storage";
import db from "@/db";
import { Material } from "@prisma/client";

const PrintRequestSchema = z.object({
  material: z.enum([
    // accept lowercase inputs from UI and map later
    "pla",
    "abs",
    "petg",
    "tpu",
    "resin",
    "nylon",
    "carbon_fiber",
    "metal",
    "wood",
    "ceramic",
    // also accept uppercase enum forms directly
    "PLA",
    "ABS",
    "PETG",
    "TPU",
    "RESIN",
    "NYLON",
    "CARBON_FIBER",
    "METAL",
    "WOOD",
    "CERAMIC",
  ]),
  resolution: z.string().min(1, "Resolution is required"),
  color: z.string().min(1, "Color is required"),
  customColor: z.string().optional(),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  deadline: z.string().optional(),
  finish: z.string().min(1, "Finish is required"),
  scale: z.number().min(1, "Scale must be at least 1"),
  infill: z.number().min(1, "Infill must be at least 1"),
  infillPattern: z.string().min(1, "Infill pattern is required"),
  designNotes: z.string().optional(),
  referenceImage: z.any().optional(),
});

export async function submitPrintRequest(formData: FormData) {
  try {
    console.log("🚀 submitPrintRequest: Starting submission process");
    
    const currentUser = await getCurrentUser();
    console.log("🔍 submitPrintRequest: Current user result:", {
      success: currentUser.success,
      hasUser: currentUser.success && "user" in currentUser,
      userId: currentUser.success && "user" in currentUser ? currentUser.user.id : null,
      userIdLength: currentUser.success && "user" in currentUser ? currentUser.user.id.length : 0,
      userIdFormat: currentUser.success && "user" in currentUser ? currentUser.user.id : null
    });
    
    if (!currentUser.success || !("user" in currentUser)) {
      console.error("❌ submitPrintRequest: User not authenticated", currentUser);
      return { success: false, error: "User not authenticated" };
    }

    const material = formData.get("material") as string;
    const resolution = formData.get("resolution") as string;
    const color = formData.get("color") as string;
    const customColor = formData.get("customColor") as string;
    const quantity = parseInt(formData.get("quantity") as string);
    const deadline = formData.get("deadline") as string;
    const finish = formData.get("finish") as string;
    const scale = parseInt(formData.get("scale") as string);
    const infill = parseInt(formData.get("infill") as string);
    const infillPattern = formData.get("infillPattern") as string;
    const designNotes = formData.get("designNotes") as string;
    const referenceImage = formData.get("referenceImage") as File;
    const stlFile = formData.get("file") as File;

    console.log("🔍 Form data received:", {
      material,
      resolution,
      color,
      customColor,
      quantity,
      deadline,
      finish,
      scale,
      infill,
      infillPattern,
      designNotes,
      stlFileName: stlFile?.name,
      stlFileSize: stlFile?.size,
    });

    const validation = PrintRequestSchema.safeParse({
      material,
      resolution,
      color,
      customColor,
      quantity,
      deadline,
      finish,
      scale,
      infill,
      infillPattern,
      designNotes,
      referenceImage,
    });

    if (!validation.success) {
      console.error("❌ submitPrintRequest: Validation failed:", validation.error.errors);
      return { success: false, error: `Validation error: ${validation.error.errors[0].message}` };
    }

    if (!stlFile) {
      console.error("❌ submitPrintRequest: No STL file provided");
      return { success: false, error: "STL file is required" };
    }

    console.log("✅ submitPrintRequest: Validation passed, STL file present");

    // Generate thumbnail from STL file
    let thumbnailUrl = "";
    try {
      console.log("🖼️ Generating thumbnail for STL file...");
      const thumbnailDataUrl = await generateSTLThumbnail(stlFile, 128);

      // Generate a unique file ID for the thumbnail
      const fileId = `print_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      console.log("📤 Uploading thumbnail to storage...");
      thumbnailUrl = await uploadThumbnail(thumbnailDataUrl, fileId);
      console.log("✅ Thumbnail uploaded successfully:", thumbnailUrl);
    } catch (thumbnailError) {
      console.warn(
        "⚠️ Thumbnail generation failed, continuing without thumbnail:",
        thumbnailError
      );
      // Continue without thumbnail - this is not critical
    }

    // Upload STL file to storage
    console.log("📤 Uploading STL file to storage...");
    const uploadResult = await upload3DModel(currentUser.user.id, stlFile);
    if (!uploadResult.success) {
      console.error("❌ STL upload failed:", uploadResult.error);
      return { success: false, error: "Failed to upload STL file" };
    }
    console.log(
      "✅ STL file uploaded successfully:",
      uploadResult.data?.fileUrl
    );

    console.log("💾 Server: Print request data:", {
      material,
      resolution,
      color,
      customColor,
      quantity,
      deadline,
      finish,
      scale,
      infill,
      infillPattern,
      designNotes,
      referenceImage,
      thumbnailUrl,
      // fileUrl: uploadResult.data?.fileUrl,
    });

    // Debug the material value before database creation
    console.log("🔍 About to create project with material:", material);
    console.log("🔍 Material type:", typeof material);
    console.log("🔍 Material value:", JSON.stringify(material));
    console.log("🔍 Material normalized to enum:", material.toUpperCase());

    // Save to database with thumbnail URL
    console.log("💾 submitPrintRequest: Creating project in database...");
    try {
      const projectData = {
        creatorId: currentUser.user.id,
        material: material
          ? (material.toUpperCase() as Material)
          : ("PLA" as Material),
        resolution: resolution, // This is just a string field
        color,
        customColor: customColor || null,
        quantity,
        deadline: deadline ? new Date(deadline) : null,
        designNotes: designNotes || null,
        finish,
        scale,
        infill,
        infillPattern,
        referenceImageUrl: thumbnailUrl || null,
        fileUrl: uploadResult.data?.fileUrl || "",
        fileName: stlFile.name,
        fileSize: stlFile.size,
        description: designNotes || `Print request for ${material} ${finish}`,
        status: "SUBMITTED",
        title: `Print Request - ${material} ${finish}`,
      };
      
      console.log("📄 submitPrintRequest: Project data to save:", projectData);
      
      const project = await db.project.create({
        data: projectData,
      });
      
      console.log("✅ submitPrintRequest: Project created with ID:", project.id);
      
      console.log("✅ Project created successfully:", project);
      return { success: true, projectId: project.id, thumbnailUrl };
    } catch (dbError) {
      console.error("❌ submitPrintRequest: Database error:", dbError);
      throw dbError;
    }
  } catch (error) {
    console.error("❌ Server: Error submitting print request:", error);
    
    // Provide more specific error details
    let errorMessage = "Failed to submit print request";
    if (error instanceof Error) {
      errorMessage = `Database error: ${error.message}`;
    }
    
    return { success: false, error: errorMessage };
  }
}
