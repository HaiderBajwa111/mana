"use server";

import { createClient } from "@/lib/supabase/server";
import db from "@/db";

export async function syncUserFromAuth() {
  try {
    const supabase = await createClient();
    
    // Get current user from Supabase Auth
    const { data: { user: authUser }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !authUser) {
      console.log("No authenticated user found");
      return { success: false, error: "Not authenticated" };
    }

    console.log("Found Supabase auth user:", authUser.id, authUser.email);

    // Check if user exists in database
    const existingUser = await db.user.findUnique({
      where: { id: authUser.id }
    });

    if (existingUser) {
      console.log("User already exists in database");
      return { success: true, user: existingUser };
    }

    // Create user in database from Supabase Auth data
    console.log("Creating user in database from Supabase Auth data");
    const dbUser = await db.user.create({
      data: {
        id: authUser.id,
        email: authUser.email || "",
        firstName: authUser.user_metadata?.firstName || authUser.user_metadata?.first_name || "User",
        lastName: authUser.user_metadata?.lastName || authUser.user_metadata?.last_name || "",
        onboardingCompleted: false,
        defaultRole: null,
        createdAt: new Date(authUser.created_at || new Date()),
      },
    });

    console.log("User synced to database:", dbUser.id);
    return { success: true, user: dbUser };

  } catch (error) {
    console.error("Error syncing user from auth:", error);
    return { success: false, error: "Failed to sync user" };
  }
}
