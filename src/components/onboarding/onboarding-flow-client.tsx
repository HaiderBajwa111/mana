"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/hooks/ui/use-toast";
import { motion } from "framer-motion";
import { OnboardingFlowV2 } from "@/components/onboarding/onboarding-flow-v2";
import type { UserRole, BaseOnboardingData } from "@/types/onboarding";
import { Loader2 } from "lucide-react";

export default function OnboardingFlowClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const [initialRole, setInitialRole] = useState<UserRole>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Read ?role=... once on mount – avoids infinite re-render loop
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    // These keys are only used for onboarding flow state, not for backend role logic
    const completedOnboarding = sessionStorage.getItem(
      "onboarding_completed_main"
    );
    const finalizedRoles = JSON.parse(
      sessionStorage.getItem("mana_onboarding_roles") || "null"
    );

    if (
      completedOnboarding === "true" &&
      finalizedRoles &&
      finalizedRoles.length > 0
    ) {
      // User has already completed onboarding, redirect to appropriate dashboard
      let redirectPath = "/dashboard";
      if (finalizedRoles.length === 1) {
        const singleRole = finalizedRoles[0];
        if (singleRole === "creator") redirectPath = "/creator/dashboard";
        else if (singleRole === "maker") redirectPath = "/maker/dashboard";
      }
      router.replace(redirectPath);
      return;
    }

    // Check if user has pending roles from role selection
    const pendingRoles = JSON.parse(
      sessionStorage.getItem("mana_onboarding_roles_pending") || "null"
    );
    if (!pendingRoles || pendingRoles.length === 0) {
      // No pending roles, send back to role selection
      toast({
        title: "Role Selection Required",
        description: "Please select your role first.",
        variant: "destructive",
      });
      router.replace("/onboarding/role-selection");
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const roleFromQuery = params.get("role") as UserRole;

    const validRoles: UserRole[] = ["creator", "maker"];

    if (roleFromQuery && validRoles.includes(roleFromQuery)) {
      setInitialRole(roleFromQuery);
    } else {
      toast({
        title: "Invalid Onboarding Role",
        description: "No valid role specified. Redirecting to role selection.",
        variant: "destructive",
      });
      router.replace("/onboarding/role-selection");
      return;
    }
    setIsLoading(false);
  }, [router, toast]);

  const handleOnboardingComplete = (
    roleCompleted: UserRole,
    data: BaseOnboardingData
  ) => {
    console.log("Onboarding Complete for role:", roleCompleted, "Data:", data);

    toast({
      title: "Onboarding Complete!",
      description: `Welcome to Mana! Your profile is set up.`,
      className: "bg-blue-600 text-white",
    });

    // Get pending roles and finalize them
    const pendingRoles = JSON.parse(
      sessionStorage.getItem("mana_onboarding_roles_pending") || "[]"
    );

    // Finalize the user's roles (for onboarding flow only)
    sessionStorage.setItem(
      "mana_onboarding_roles",
      JSON.stringify(pendingRoles)
    );
    sessionStorage.setItem("onboarding_completed_main", "true");
    sessionStorage.removeItem("mana_onboarding_roles_pending"); // Clean up

    // Determine redirect path
    let redirectPath = "/dashboard";
    let activeRole = pendingRoles.length > 0 ? pendingRoles[0] : "buyer";

    if (pendingRoles.length === 1) {
      const singleRole = pendingRoles[0];
      if (singleRole === "creator") {
        redirectPath = "/creator/dashboard";
        activeRole = "creator";
      } else if (singleRole === "maker") {
        redirectPath = "/maker/dashboard";
        activeRole = "maker";
      }
    } else if (pendingRoles.length > 1) {
      activeRole = pendingRoles.includes("buyer") ? "buyer" : pendingRoles[0];
      redirectPath = "/dashboard";
    }

    sessionStorage.setItem("mana_active_role", activeRole);

    console.log("🚀 Redirecting to:", redirectPath);

    // Redirect to the appropriate dashboard
    router.push(redirectPath);
  };

  if (isLoading || !initialRole) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 1,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
          className="w-12 h-12 border-2 border-blue-600 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <OnboardingFlowV2
      initialRole={initialRole}
      onComplete={handleOnboardingComplete}
    />
  );
}
