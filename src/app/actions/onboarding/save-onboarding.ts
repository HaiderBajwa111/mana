"use server";

import db from "@/db";
import { PhotoType, CreatorType, AccountType } from "@prisma/client";
import { getCurrentUser } from "@/app/actions/auth/get-current-user";
import {
  uploadProfilePicture,
  uploadSampleWorkPhoto,
  type UploadedFile,
} from "@/lib/storage";

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function extractCreatorData(creatorData: any) {
  const {
    // User fields (should be saved to User model)
    firstName,
    lastName,
    email,
    password,
    phone,
    // Creator profile fields (should be saved to CreatorProfile model)
    useCase,
    categoryInterests,
    accountType,
    businessName,
    portfolioLink,
    bio,
    // Other fields that don't map to either model
    phoneVerified,
    agreedToTerms,
    emailNotifications,
    shippingSetupLater,
    paymentSetupLater,
    shippingAddress,
    paymentMethodAdded,
    ...rest
  } = creatorData;

  return {
    // User fields
    userData: {
      firstName,
      lastName,
      // Note: email and password are handled separately in auth flow
    },
    // Creator profile fields - map to actual CreatorProfile model fields
    creatorProfileData: {
      bio, // Use the new bio field directly
      portfolioLink, // Use the new portfolioLink field directly
      location: shippingAddress?.city
        ? `${shippingAddress.city}, ${shippingAddress.state || ""}`
        : null,
      designPreferences: categoryInterests?.join(", "), // Map categoryInterests to designPreferences
      canPickupLocally: false, // Default value
      // Normalize to enum values
      creatorType: (creatorData?.creatorType
        ? String(creatorData.creatorType)
        : "HOBBYIST"
      )
        .toUpperCase()
        .replace(/\s+/g, "_") as keyof typeof CreatorType as CreatorType,
      accountType: (accountType ? String(accountType) : "INDIVIDUAL")
        .toUpperCase()
        .replace(/\s+/g, "_") as keyof typeof AccountType as AccountType,
      businessName,
    },
  };
}

function extractManufacturerData(makerData: any) {
  const {
    businessName,
    bio,
    printerTypes,
    // Extract other fields that might be relevant
    ...rest
  } = makerData;

  return {
    businessName:
      businessName || `${makerData.firstName} ${makerData.lastName}`,
    description: bio,
    capabilities: printerTypes?.join(", "),
  };
}

// ============================================================================
// PHOTO UPLOAD HANDLERS
// ============================================================================

async function handleProfilePictureUpload(
  userId: string, // changed from number to string
  profilePicture: File | null
): Promise<UploadedFile | null> {
  if (!profilePicture) return null;

  const result = await uploadProfilePicture(userId, profilePicture);

  if (!result.success) {
    throw new Error(result.error || "Failed to upload profile picture");
  }

  return result.data || null;
}

async function handleSampleWorkUploads(
  userId: string, // changed from number to string
  samplePrints: File[] | null
): Promise<UploadedFile[]> {
  if (!samplePrints || samplePrints.length === 0) return [];

  const uploadedFiles: UploadedFile[] = [];

  for (const file of samplePrints) {
    const result = await uploadSampleWorkPhoto(userId, file);

    if (result.success && result.data) {
      uploadedFiles.push(result.data);
    } else {
      console.error("Failed to upload sample work photo:", result.error);
      // Continue with other files even if one fails
    }
  }

  return uploadedFiles;
}

// ============================================================================
// MAIN SAVE FUNCTION
// ============================================================================

export async function saveOnboarding(formData: FormData) {
  try {
    console.log("🖥️ Server: Starting saveOnboarding...");

    // Get current user (from auth and db)
    const currentUser = await getCurrentUser();

    if (!currentUser.success) {
      console.log(
        `❌ [${new Date().toISOString()}] Server: User not authenticated`
      );
      return {
        success: false,
        error: "User not authenticated",
      };
    }

    if (!("user" in currentUser)) {
      console.log(
        `❌ [${new Date().toISOString()}] Server: No user property in result`
      );
      return {
        success: false,
        error: "No user property in result",
      };
    }

    const userId = currentUser.user.id;
    console.log(`👤 [${new Date().toISOString()}] Server: User ID:`, userId);

    const onboardingData = JSON.parse(formData.get("onboardingData") as string);
    const roles = onboardingData.roles || [];

    // Get files from FormData (they're now passed separately)
    const profilePicture = formData.get("profilePicture") as File | null;
    const samplePrints = formData.getAll("samplePrints") as File[];

    console.log(
      "📸 Server: Profile picture received:",
      profilePicture ? "YES" : "NO"
    );
    console.log("🖼️ Server: Sample prints received:", samplePrints.length);

    // Set default_role on the user (first role, or 'maker' if both)
    let defaultRole = roles[0] || null;
    if (roles.includes("maker") && roles.includes("creator")) {
      defaultRole = "maker";
    }

    // Handle photo uploads first
    let profilePictureUrl: string | null = null;
    let uploadedSamplePhotos: UploadedFile[] = [];

    // Upload profile picture if provided
    if (profilePicture) {
      console.log("🚀 Server: Starting profile picture upload...");
      try {
        const uploadedProfile = await handleProfilePictureUpload(
          userId,
          profilePicture
        );
        if (uploadedProfile) {
          profilePictureUrl = uploadedProfile.fileUrl;
          console.log(
            "✅ Server: Profile picture uploaded successfully:",
            profilePictureUrl
          );
        }
      } catch (error) {
        console.error("❌ Server: Profile picture upload failed:", error);
        // Continue without profile picture
      }
    }

    // Upload sample work photos if provided
    if (samplePrints && samplePrints.length > 0) {
      console.log("🚀 Server: Starting sample prints upload...");
      try {
        uploadedSamplePhotos = await handleSampleWorkUploads(
          userId,
          samplePrints
        );
        console.log(
          "✅ Server: Sample prints uploaded successfully:",
          uploadedSamplePhotos.length
        );
      } catch (error) {
        console.error("❌ Server: Sample work upload failed:", error);
        // Continue without sample photos
      }
    }

    console.log("💾 Server: Saving to database...");

    // Update user with basic info and mark onboarding as complete
    await db.user.update({
      where: { id: userId },
      data: {
        defaultRole: defaultRole || undefined,
        onboardingCompleted: true,
        profilePictureUrl: profilePictureUrl || undefined,
        // Add any user fields that should be updated
        ...(onboardingData.creatorData?.firstName && {
          firstName: onboardingData.creatorData.firstName,
        }),
        ...(onboardingData.creatorData?.lastName && {
          lastName: onboardingData.creatorData.lastName,
        }),
        ...(onboardingData.makerData?.firstName && {
          firstName: onboardingData.makerData.firstName,
        }),
        ...(onboardingData.makerData?.lastName && {
          lastName: onboardingData.makerData.lastName,
        }),
      },
    });

    // Save profile picture to database if uploaded
    if (profilePictureUrl && profilePicture) {
      console.log("💾 Server: Saving profile picture to database...");
      await db.userPhoto.create({
        data: {
          userId,
          photoType: PhotoType.PROFILE,
          fileName: profilePicture.name,
          fileUrl: profilePictureUrl,
          fileSize: profilePicture.size,
          mimeType: profilePicture.type,
        },
      });
    }

    // Save sample work photos to database if uploaded
    if (uploadedSamplePhotos.length > 0) {
      console.log("💾 Server: Saving sample photos to database...");
      for (const photo of uploadedSamplePhotos) {
        await db.sampleWorkPhoto.create({
          data: {
            userId,
            fileName: photo.fileName,
            fileUrl: photo.fileUrl,
            fileSize: photo.fileSize,
            mimeType: photo.mimeType,
          },
        });
      }
    }

    // Save creator profile data
    if (roles.includes("creator") && onboardingData.creatorData) {
      const { creatorProfileData } = extractCreatorData(
        onboardingData.creatorData
      );

      // Debug log: print creatorProfileData before upsert
      console.log(
        `🛠️ [${new Date().toISOString()}] Server: creatorProfileData to upsert:`,
        creatorProfileData
      );

      await db.creatorProfile.upsert({
        where: { userId },
        update: creatorProfileData,
        create: {
          userId,
          ...creatorProfileData,
        },
      });
    }

    // Save manufacturer profile data
    if (roles.includes("maker") && onboardingData.makerData) {
      // Clean fallback for businessName
      const fallbackBusinessName =
        onboardingData.makerData.businessName ||
        onboardingData.businessName ||
        onboardingData.creatorData?.businessName;
      const manufacturerData = extractManufacturerData({
        ...onboardingData.makerData,
        businessName: fallbackBusinessName,
      });
      await db.manufacturerProfile.upsert({
        where: { userId },
        update: manufacturerData,
        create: {
          userId,
          ...manufacturerData,
        },
      });

      // Persist printers list if provided: create ManufacturerPrinter rows for selected catalog models
      if (Array.isArray(onboardingData.makerData.printers)) {
        const manufacturer = await db.manufacturerProfile.findUnique({
          where: { userId },
          select: { id: true },
        });

        if (manufacturer) {
          const printers = onboardingData.makerData.printers.slice(0, 10);
          for (const p of printers) {
            if (p.printerModelId) {
              await db.manufacturerPrinter.create({
                data: {
                  manufacturerProfileId: manufacturer.id,
                  printerModelId: p.printerModelId,
                  customName: p.customName || null,
                  quantity: p.quantity ?? 1,
                  notes: p.notes || null,
                },
              });
            }
          }
        }
      }
    }

    console.log("✅ Server: Onboarding completed successfully");
    return {
      success: true,
      message: "Onboarding completed successfully",
      uploadedPhotos: {
        profilePicture: profilePictureUrl,
        samplePhotos: uploadedSamplePhotos.length,
      },
    };
  } catch (error) {
    console.error("❌ Server: Save onboarding error:", error);
    return {
      success: false,
      error: "Failed to save onboarding data",
    };
  }
}
