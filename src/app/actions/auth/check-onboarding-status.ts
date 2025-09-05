"use server";

import { redirect } from "next/navigation";
import { getCurrentUser } from "./get-current-user";

export async function checkOnboardingStatus() {
  console.log("🔍 [CHECK_ONBOARDING] Starting onboarding status check");

  const result = await getCurrentUser();

  if (!result.success) {
    console.log("🔍 [CHECK_ONBOARDING] No user found, redirecting to /auth");
    redirect("/auth");
  }

  if (!("user" in result)) {
    console.log(
      "🔍 [CHECK_ONBOARDING] No user property in result, redirecting to /auth"
    );
    redirect("/auth");
  }

  const { user } = result;

  console.log("🔍 [CHECK_ONBOARDING] User found:", {
    id: user.id,
    email: user.email,
    onboardingCompleted: user.onboardingCompleted,
    defaultRole: user.defaultRole,
  });

  // If user hasn't completed onboarding and is not on onboarding pages
  if (!user.onboardingCompleted) {
    console.log(
      "🔍 [CHECK_ONBOARDING] Onboarding not completed, redirecting to /onboarding/role-selection"
    );
    redirect("/onboarding/role-selection");
  }

  console.log("🔍 [CHECK_ONBOARDING] Onboarding completed, returning user");
  return user;
}

export async function checkOnboardingRedirect() {
  console.log(
    "🔍 [CHECK_ONBOARDING_REDIRECT] Starting onboarding redirect check"
  );

  const result = await getCurrentUser();

  if (!result.success) {
    console.log(
      "🔍 [CHECK_ONBOARDING_REDIRECT] No user found, redirecting to /auth"
    );
    redirect("/auth");
  }

  if (!("user" in result)) {
    console.log(
      "🔍 [CHECK_ONBOARDING_REDIRECT] No user property in result, redirecting to /auth"
    );
    redirect("/auth");
  }

  const { user } = result;

  console.log("🔍 [CHECK_ONBOARDING_REDIRECT] User found:", {
    id: user.id,
    email: user.email,
    onboardingCompleted: user.onboardingCompleted,
    defaultRole: user.defaultRole,
  });

  // If user has completed onboarding and is on onboarding pages
  if (user.onboardingCompleted) {
    let redirectPath = "/dashboard";

    if (user.defaultRole === "creator") {
      redirectPath = "/creator/dashboard";
    } else if (user.defaultRole === "maker") {
      redirectPath = "/maker/dashboard";
    }

    console.log(
      "🔍 [CHECK_ONBOARDING_REDIRECT] Onboarding completed, redirecting to:",
      redirectPath
    );
    redirect(redirectPath);
  }

  console.log(
    "🔍 [CHECK_ONBOARDING_REDIRECT] Onboarding not completed, returning user"
  );
  return user;
}
