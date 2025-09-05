"use server";

import { createClient } from "@/lib/supabase/server";
import db from "@/db";
import { z } from "zod";

const UpdateUserSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  username: z.string().optional(),
  profilePictureUrl: z.string().url().optional(),
});

export async function updateUser(formData: FormData) {
  try {
    const userId = formData.get("userId") as string;
    const firstName = formData.get("firstName") as string | null;
    const lastName = formData.get("lastName") as string | null;
    const username = formData.get("username") as string | null;
    const profilePictureUrl = formData.get("profilePictureUrl") as
      | string
      | null;

    // Validate input
    const validation = UpdateUserSchema.safeParse({
      userId,
      firstName: firstName || undefined,
      lastName: lastName || undefined,
      username: username || undefined,
      profilePictureUrl: profilePictureUrl || undefined,
    });

    if (!validation.success) {
      return {
        success: false,
        error: validation.error.errors[0].message,
      };
    }

    // Check if user exists
    const existingUser = await db.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      return {
        success: false,
        error: "User not found",
      };
    }

    // Validate username uniqueness if provided
    if (username) {
      const usernameExists = await db.user.findFirst({
        where: {
          username: username,
          id: { not: userId }, // Exclude current user from uniqueness check
        },
      });

      if (usernameExists) {
        return {
          success: false,
          error: "Username already taken",
        };
      }
    }

    // Build update data object with only provided fields
    const updateData: any = {};

    if (firstName !== null) updateData.firstName = firstName;
    if (lastName !== null) updateData.lastName = lastName;
    if (username !== null) updateData.username = username;
    if (profilePictureUrl !== null)
      updateData.profilePictureUrl = profilePictureUrl;

    // Update user in database
    const updatedUser = await db.user.update({
      where: { id: userId },
      data: updateData,
    });

    // Update user metadata in Supabase Auth if name fields changed
    if (firstName !== null || lastName !== null) {
      const supabase = await createClient();

      const newFirstName = firstName ?? existingUser.firstName;
      const newLastName = lastName ?? existingUser.lastName;

      if (existingUser.id) {
        await supabase.auth.admin.updateUserById(existingUser.id, {
          user_metadata: {
            firstName: newFirstName,
            lastName: newLastName,
            full_name: `${newFirstName} ${newLastName}`,
          },
        });
      }
    }

    return {
      success: true,
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        username: updatedUser.username,
        profilePictureUrl: updatedUser.profilePictureUrl,
      },
      message: "User updated successfully",
    };
  } catch (error) {
    console.error("Update user error:", error);
    return {
      success: false,
      error: "Internal server error",
    };
  }
}
