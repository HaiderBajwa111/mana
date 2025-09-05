import { redirect } from "next/navigation";
import { checkOnboardingStatus } from "@/app/actions/auth/check-onboarding-status";
import DashboardWrapper from "@/components/dashboard/dashboard-wrapper";

export default async function MultiRoleDashboard() {
  console.log("🔍 [DASHBOARD] Starting dashboard page render");

  const user = await checkOnboardingStatus();

  console.log("🔍 [DASHBOARD] User data received:", {
    id: user.id,
    email: user.email,
    onboardingCompleted: user.onboardingCompleted,
    defaultRole: user.defaultRole,
    hasCreatorProfile: !!user.creatorProfile,
    hasManufacturerProfile: !!user.manufacturerProfile,
  });

  // Determine user roles based on profile existence and defaultRole
  let roles: string[] = [];
  let activeRole = user.defaultRole || "creator";

  // Check if user has creator profile (can be a buyer/customer)
  if (user.creatorProfile) {
    roles.push("creator");
  }

  // Check if user has manufacturer profile (can be a maker/seller)
  if (user.manufacturerProfile) {
    roles.push("maker");
  }

  // If no profiles exist, use defaultRole to determine the role
  if (roles.length === 0) {
    if (user.defaultRole === "maker") {
      roles = ["maker"];
      activeRole = "maker";
    } else {
      roles = ["creator"];
      activeRole = "creator";
    }
  }

  console.log("🔍 [DASHBOARD] Roles determined:", { roles, activeRole });

  // If user has only one role, redirect them to the appropriate dashboard
  if (roles.length <= 1) {
    const singleRole = roles[0];
    console.log(
      "🔍 [DASHBOARD] Single role detected, redirecting to:",
      singleRole
    );
    if (singleRole === "creator") redirect("/creator/dashboard");
    else if (singleRole === "maker") redirect("/maker/dashboard");
    else redirect("/auth"); // Fallback
  }

  console.log("🔍 [DASHBOARD] Rendering multi-role dashboard wrapper");
  return (
    <DashboardWrapper
      user={user}
      roles={roles}
      initialActiveRole={activeRole}
    />
  );
}
