"use server";

import { createClient } from "@/lib/supabase/server";

export async function logoutUser() {
  try {
    // Create Supabase client
    const supabase = await createClient();

    // Sign out from Supabase
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Supabase logout error:", error);
      return {
        success: false,
        error: "Failed to logout",
      };
    }

    return {
      success: true,
      message: "Logged out successfully",
    };
  } catch (error) {
    console.error("Logout error:", error);
    return {
      success: false,
      error: "Internal server error",
    };
  }
}
