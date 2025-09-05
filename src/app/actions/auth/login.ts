"use server";

import { createClient } from "@/lib/supabase/server";
import db from "@/db";
import { z } from "zod";

const LoginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

export async function loginUser(formData: FormData) {
  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    // Validate input
    const validation = LoginSchema.safeParse({ email, password });
    if (!validation.success) {
      return {
        success: false,
        error: validation.error.errors[0].message,
      };
    }

    // Create Supabase client
    const supabase = await createClient();

    // Sign in with Supabase
    const { data: authData, error: authError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (authError) {
      console.error("Supabase auth error:", authError);
      return {
        success: false,
        error: "Invalid email or password",
      };
    }

    if (!authData.user) {
      return {
        success: false,
        error: "Authentication failed",
      };
    }

    // Get user from database
    const dbUser = await db.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!dbUser) {
      return {
        success: false,
        error: "User not found in database",
      };
    }

    return {
      success: true,
      user: {
        id: dbUser.id,
        email: dbUser.email,
        firstName: dbUser.firstName,
        lastName: dbUser.lastName,
        defaultRole: dbUser.defaultRole,
        onboardingCompleted: dbUser.onboardingCompleted,
      },
      session: authData.session,
      message: "Login successful",
    };
  } catch (error) {
    console.error("Login error:", error);
    return {
      success: false,
      error: "Internal server error",
    };
  }
}
