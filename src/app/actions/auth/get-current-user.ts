"use server";

import { createClient } from "@/lib/supabase/server";
import db from "@/db";

export async function getCurrentUser() {
  console.log("🔍 [GET_CURRENT_USER] Starting getCurrentUser");

  try {
    const supabase = await createClient();

    // Get current user
    const {
      data: { user: authUser },
      error: userError,
    } = await supabase.auth.getUser();

    console.log("🔍 [GET_CURRENT_USER] Supabase auth result:", {
      hasUser: !!authUser,
      userId: authUser?.id,
      error: userError?.message,
    });

    if (userError || !authUser) {
      console.log("🔍 [GET_CURRENT_USER] No auth user found");
      return {
        success: false,
        error: "Not authenticated",
      };
    }

    // Find user in database by Supabase Auth UID
    const user = await db.user.findUnique({
      where: { id: authUser.id },
      include: {
        creatorProfile: true,
        manufacturerProfile: true,
        projects: {
          select: {
            id: true,
            title: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    console.log("🔍 [GET_CURRENT_USER] Database user lookup result:", {
      found: !!user,
      userId: user?.id,
      onboardingCompleted: user?.onboardingCompleted,
      defaultRole: user?.defaultRole,
    });

    if (!user) {
      console.log("🔍 [GET_CURRENT_USER] User not found in database, attempting to sync from auth");
      
      // Try to sync user from Supabase Auth
      try {
        const syncResult = await import("./sync-user").then(m => m.syncUserFromAuth());
        if (syncResult.success && syncResult.user) {
          console.log("🔍 [GET_CURRENT_USER] User synced successfully");
          const syncedUser = syncResult.user;
          
          // Return the synced user data in the expected format
          return {
            success: true,
            user: {
              id: syncedUser.id,
              email: syncedUser.email,
              firstName: syncedUser.firstName,
              lastName: syncedUser.lastName,
              externalAuthId: syncedUser.externalAuthId,
              profilePictureUrl: syncedUser.profilePictureUrl,
              stripeCustomerId: syncedUser.stripeCustomerId,
              creatorProfile: null,
              manufacturerProfile: null,
              onboardingCompleted: syncedUser.onboardingCompleted,
              defaultRole: syncedUser.defaultRole,
              projects: [],
            },
          };
        }
      } catch (syncError) {
        console.error("🔍 [GET_CURRENT_USER] Failed to sync user:", syncError);
      }
      
      console.log("🔍 [GET_CURRENT_USER] User not found in database and sync failed");
      return {
        success: false,
        error: "User not found in database",
      };
    }

    const result = {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        externalAuthId: user.externalAuthId,
        profilePictureUrl: user.profilePictureUrl,
        stripeCustomerId: user.stripeCustomerId,
        creatorProfile: user.creatorProfile,
        manufacturerProfile: user.manufacturerProfile,
        onboardingCompleted: user.onboardingCompleted,
        defaultRole: user.defaultRole,
        projects: user.projects,
      },
    };

    console.log("🔍 [GET_CURRENT_USER] Returning user data:", {
      id: result.user.id,
      email: result.user.email,
      onboardingCompleted: result.user.onboardingCompleted,
      defaultRole: result.user.defaultRole,
    });

    return result;
  } catch (error) {
    console.error("🔍 [GET_CURRENT_USER] Error:", error);
    return {
      success: false,
      error: "Internal server error",
    };
  }
}
