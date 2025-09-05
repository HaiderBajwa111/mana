"use server";

import { createClient } from "@/lib/supabase/server";
import db from "@/db";
import { z } from "zod";
// import { stripe } from "@/lib/stripe"; // Stripe to be added later

const CreateUserSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

export async function createUser(formData: FormData) {
  try {
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    // Validate input
    const validation = CreateUserSchema.safeParse({
      firstName,
      lastName,
      email,
      password,
    });

    if (!validation.success) {
      return {
        success: false,
        error: validation.error.errors[0].message,
      };
    }

    // Check if user already exists in database
    const existingDbUser = await db.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingDbUser) {
      return {
        success: false,
        error: "User with this email already exists",
      };
    }

    // Create Supabase client
    const supabase = await createClient();

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: process.env.NEXT_PUBLIC_SITE_URL + "/auth/callback", // optional
        data: {
          firstName,
          lastName,
          full_name: `${firstName} ${lastName}`,
        },
      },
    });

    if (authError) {
      console.error("Supabase auth error:", authError);
      return {
        success: false,
        error: "Failed to create user account",
      };
    }

    if (!authData.user) {
      return {
        success: false,
        error: "Failed to create user account",
      };
    }

    // Create user in database
    const dbUser = await db.user.create({
      data: {
        id: authData.user.id, // Use Supabase Auth UID as primary key
        email: email.toLowerCase(),
        firstName,
        lastName,
        createdAt: new Date(),
      },
    });

    // Stripe integration to be added later
    // try {
    //   if (!dbUser.stripeCustomerId && stripe) {
    //     const customer = await stripe.customers.create({
    //       email: dbUser.email,
    //       name:
    //         [dbUser.firstName, dbUser.lastName].filter(Boolean).join(" ") ||
    //         undefined,
    //       metadata: { userId: dbUser.id },
    //     });
    //     await db.user.update({
    //       where: { id: dbUser.id },
    //       data: { stripeCustomerId: customer.id },
    //     });
    //   }
    // } catch (stripeError) {
    //   console.error(
    //     "Signup: failed to create Stripe customer (continuing)",
    //     stripeError
    //   );
    // }

    // After creating the user in database, sign them in
    const { data: signInData, error: signInError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (signInError) {
      console.error("Auto-login error:", signInError);
      // Don't fail the signup, just log the error
    }

    return {
      success: true,
      user: {
        id: dbUser.id,
        email: dbUser.email,
        firstName: dbUser.firstName,
        lastName: dbUser.lastName,
        // stripeCustomerId may or may not be present immediately depending on Stripe availability
        // It can be fetched later via getCurrentUser or re-ensured via ensureStripeCustomerForCurrentUser
        // @ts-ignore - field exists in Prisma schema at runtime
        stripeCustomerId: (dbUser as any).stripeCustomerId,
      },
      session: signInData?.session,
      message: "User created successfully",
    };
  } catch (error) {
    console.error("Create user error:", error);
    return {
      success: false,
      error: "Internal server error",
    };
  }
}
