"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/ui/use-toast";
import { useCurrentUser } from "@/hooks/auth/use-current-user";
import { saveOnboarding } from "@/app/actions/onboarding/save-onboarding";
import { UnifiedOnboardingFlow } from "./unified-onboarding-flow";
import type { BaseOnboardingData, UserRole } from "@/types/onboarding";

// ============================================================================
// INTERFACES
// ============================================================================

interface OnboardingFlowV2Props {
  initialRole: UserRole;
  onComplete?: (role: UserRole, data: BaseOnboardingData) => void;
}

// ============================================================================
// COMPONENT
// ============================================================================

export function OnboardingFlowV2({
  initialRole,
  onComplete,
}: OnboardingFlowV2Props) {
  // ========================================================================
  // STATE MANAGEMENT
  // ========================================================================

  const [currentRole, setCurrentRole] = useState<UserRole>(initialRole);
  const [isSaving, setIsSaving] = useState(false);

  // ========================================================================
  // HOOKS
  // ========================================================================

  const router = useRouter();
  const { toast } = useToast();
  const { user: currentUser } = useCurrentUser();

  // ========================================================================
  // EFFECTS
  // ========================================================================

  // Reset state when initial role changes
  useEffect(() => {
    setCurrentRole(initialRole);
    // Clear any existing onboarding data when role changes
    localStorage.removeItem("mana_unified_onboarding_data");
    localStorage.removeItem("mana_unified_onboarding_progress");
  }, [initialRole]);

  // ========================================================================
  // HANDLERS
  // ========================================================================

  const handleDataUpdate = (data: BaseOnboardingData) => {
    // Optional: Handle data updates if needed
    console.log("Onboarding data updated:", data);
  };

  const handleStepChange = (stepId: string, stepIndex: number) => {
    // Optional: Handle step changes if needed
    console.log(`Step changed to: ${stepId} (${stepIndex})`);
  };

  const handleComplete = async (data: BaseOnboardingData) => {
    console.log("🎉 Onboarding flow completed for role:", currentRole);

    if (!currentUser?.id) {
      toast({
        title: "Error",
        description: "User not authenticated. Please log in again.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);

    try {
      // Get pending roles from session storage
      const pendingRoles = JSON.parse(
        sessionStorage.getItem("mana_onboarding_roles_pending") || "[]"
      );

      // Prepare form data for backend
      const formData = new FormData();
      formData.append("userId", currentUser.id.toString());

      // Debug log: print onboarding data before sending
      console.log(
        `📝 [${new Date().toISOString()}] Submitting onboarding data:`,
        data
      );

      // Handle file uploads if present
      if (data.profilePicture) {
        formData.append("profilePicture", data.profilePicture);
      }

      if (
        data.makerData?.samplePrints &&
        data.makerData.samplePrints.length > 0
      ) {
        data.makerData.samplePrints.forEach((file) => {
          formData.append("samplePrints", file);
        });
      }

      // Remove file objects from data before JSON serialization
      const { samplePrints, ...makerDataWithoutFiles } = data.makerData || {};

      formData.append(
        "onboardingData",
        JSON.stringify({
          ...data,
          makerData: makerDataWithoutFiles,
          roles: pendingRoles,
        })
      );

      // Save to backend
      const result = await saveOnboarding(formData);

      if (!result.success) {
        throw new Error(result.error || "Failed to save onboarding data");
      }

      // Determine redirect path
      const { redirectPath, activeRole } = determineRedirectPath(pendingRoles);

      // Prepare completion data with additional properties
      const completionData = {
        ...data,
        redirectPath,
        activeRole,
      };

      toast({
        title: "Success!",
        description: "Your profile has been saved successfully.",
      });

      // Call the original onComplete if provided
      if (onComplete && currentRole) {
        onComplete(currentRole, completionData);
      }

      // Clear persisted data
      localStorage.removeItem("mana_unified_onboarding_data");
      localStorage.removeItem("mana_unified_onboarding_progress");

      // Finalize roles and redirect
      sessionStorage.setItem(
        "mana_onboarding_roles",
        JSON.stringify(pendingRoles)
      );
      sessionStorage.setItem("onboarding_completed_main", "true");
      sessionStorage.setItem("mana_active_role", activeRole);
      sessionStorage.removeItem("mana_onboarding_roles_pending");

      console.log("🚀 Redirecting to:", redirectPath);
      router.push(redirectPath);
    } catch (error) {
      console.error("Error saving onboarding data:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to save your profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // ========================================================================
  // UTILITY FUNCTIONS
  // ========================================================================

  const determineRedirectPath = (roles: string[]) => {
    let redirectPath = "/dashboard";
    let activeRole = roles.length > 0 ? roles[0] : "creator";

    if (roles.length === 1) {
      const singleRole = roles[0];
      if (singleRole === "creator") {
        redirectPath = "/creator/dashboard";
        activeRole = "creator";
      } else if (singleRole === "maker") {
        redirectPath = "/maker/dashboard";
        activeRole = "maker";
      }
    } else if (roles.length > 1) {
      activeRole = roles.includes("creator") ? "creator" : roles[0];
      redirectPath = "/dashboard";
    }

    return { redirectPath, activeRole };
  };

  // ========================================================================
  // RENDERING LOGIC
  // ========================================================================

  const renderInvalidRole = () => (
    <div className="text-center p-8 text-slate-600">
      <h2 className="text-xl font-semibold mb-4">Invalid Role</h2>
      <p>
        Invalid role or role not selected. Please go back to role selection.
      </p>
      <button
        onClick={() => router.push("/onboarding/role-selection")}
        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
      >
        Back to Role Selection
      </button>
    </div>
  );

  const renderLoadingOverlay = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background border border-border rounded-xl p-6 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-foreground">Saving your profile...</p>
      </div>
    </div>
  );

  // ========================================================================
  // MAIN RENDER
  // ========================================================================

  if (!currentRole) {
    return renderInvalidRole();
  }

  return (
    <div className="w-full min-h-screen bg-background">
      {isSaving && renderLoadingOverlay()}

      <AnimatePresence mode="wait">
        <motion.div
          key={currentRole}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
          className="pt-16"
        >
          <UnifiedOnboardingFlow
            role={currentRole}
            onComplete={handleComplete}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
