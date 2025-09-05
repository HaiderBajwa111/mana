import { createClient } from "@/lib/supabase/server";
import { v4 as uuidv4 } from "uuid";

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface UploadedFile {
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
}

export interface StorageUploadResult {
  success: boolean;
  data?: UploadedFile;
  error?: string;
}

// ============================================================================
// VALIDATION FUNCTIONS
// ============================================================================

export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
];

export const ALLOWED_3D_MODEL_TYPES = [
  "model/stl",
  "model/obj",
  "model/3mf",
  "application/octet-stream", // STL files often have this MIME type
];

export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

export function validateImageFile(file: File): string | null {
  // Check file type
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return `Invalid file type. Allowed types: ${ALLOWED_IMAGE_TYPES.join(", ")}`;
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return `File too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB`;
  }

  // Check file name
  if (!file.name || file.name.length > 255) {
    return "Invalid file name";
  }

  return null;
}

export function validate3DModelFile(file: File): string | null {
  // Check file extension (more reliable than MIME type for 3D files)
  const fileExtension = file.name.toLowerCase().split(".").pop();
  const allowedExtensions = ["stl", "obj", "3mf"];

  if (!allowedExtensions.includes(fileExtension || "")) {
    return `Invalid file type. Allowed types: ${allowedExtensions.join(", ")}`;
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return `File too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB`;
  }

  // Check file name
  if (!file.name || file.name.length > 255) {
    return "Invalid file name";
  }

  return null;
}

// ============================================================================
// STORAGE FUNCTIONS
// ============================================================================

export async function upload3DModel(
  userId: string,
  file: File,
  projectId?: string
): Promise<StorageUploadResult> {
  try {

    // Validate file
    const validationError = validate3DModelFile(file);
    if (validationError) {
      return { success: false, error: validationError };
    }

    const supabase = await createClient();

    // Generate unique file name
    const fileExtension = file.name.split(".").pop();
    const modelId = uuidv4();
    const fileName = `model_${modelId}.${fileExtension}`;

    // Create folder path
    const folderPath = projectId
      ? `${userId}/models/${projectId}/${fileName}`
      : `${userId}/models/${fileName}`;


    // Upload to Supabase storage
    const { data, error } = await supabase.storage
      .from("main")
      .upload(folderPath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      return { success: false, error: "Failed to upload file" };
    }


    // Get public URL
    const { data: urlData } = supabase.storage
      .from("main")
      .getPublicUrl(folderPath);


    return {
      success: true,
      data: {
        fileName: file.name,
        fileUrl: urlData.publicUrl,
        fileSize: file.size,
        mimeType: file.type,
      },
    };
  } catch (error) {
    return { success: false, error: "Internal server error" };
  }
}

export async function uploadProfilePicture(
  userId: string, // changed from number to string
  file: File
): Promise<StorageUploadResult> {
  try {

    // Validate file
    const validationError = validateImageFile(file);
    if (validationError) {
      return { success: false, error: validationError };
    }

    const supabase = await createClient();

    // Generate unique file name
    const fileExtension = file.name.split(".").pop();
    const photoId = uuidv4();
    const fileName = `profile_${photoId}.${fileExtension}`;
    const filePath = `${userId}/profile_picture/${fileName}`;


    // Upload to Supabase storage
    const { data, error } = await supabase.storage
      .from("main")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      return { success: false, error: "Failed to upload file" };
    }


    // Get public URL
    const { data: urlData } = supabase.storage
      .from("main")
      .getPublicUrl(filePath);


    return {
      success: true,
      data: {
        fileName: file.name,
        fileUrl: urlData.publicUrl,
        fileSize: file.size,
        mimeType: file.type,
      },
    };
  } catch (error) {
    return { success: false, error: "Internal server error" };
  }
}

export async function uploadSampleWorkPhoto(
  userId: string, // changed from number to string
  file: File,
  projectId?: string
): Promise<StorageUploadResult> {
  try {

    // Validate file
    const validationError = validateImageFile(file);
    if (validationError) {
      return { success: false, error: validationError };
    }

    const supabase = await createClient();

    // Generate unique file name
    const fileExtension = file.name.split(".").pop();
    const photoId = uuidv4();
    const fileName = `sample_${photoId}.${fileExtension}`;

    // Create folder path
    const folderPath = projectId
      ? `${userId}/sample_photos/${projectId}/${fileName}`
      : `${userId}/sample_photos/${fileName}`;


    // Upload to Supabase storage
    const { data, error } = await supabase.storage
      .from("main")
      .upload(folderPath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      return { success: false, error: "Failed to upload file" };
    }


    // Get public URL
    const { data: urlData } = supabase.storage
      .from("main")
      .getPublicUrl(folderPath);


    return {
      success: true,
      data: {
        fileName: file.name,
        fileUrl: urlData.publicUrl,
        fileSize: file.size,
        mimeType: file.type,
      },
    };
  } catch (error) {
    return { success: false, error: "Internal server error" };
  }
}

export async function deleteFile(filePath: string): Promise<boolean> {
  try {
    const supabase = await createClient();

    const { error } = await supabase.storage.from("main").remove([filePath]);

    if (error) {
      return false;
    }

    return true;
  } catch (error) {
    console.error("File deletion error:", error);
    return false;
  }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export function extractFilePathFromUrl(url: string): string | null {
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split("/");
    const storageIndex = pathParts.findIndex((part) => part === "storage");

    if (storageIndex === -1) return null;

    // Extract path after storage/v1/object/public/bucket-name/
    const bucketIndex = storageIndex + 4;
    if (bucketIndex >= pathParts.length) return null;

    return pathParts.slice(bucketIndex + 1).join("/");
  } catch (error) {
    return null;
  }
}
