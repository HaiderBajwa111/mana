import { Suspense } from "react";
import { checkOnboardingRedirect } from "@/app/actions/auth/check-onboarding-status";
import RoleSelectionClient from "@/components/onboarding/role-selection-client";
import { Loader2 } from "lucide-react";

export default async function RoleSelectionPage() {
  console.log("🔍 [ROLE_SELECTION] Starting role selection page render");

  // Check if user has already completed onboarding and redirect if needed
  await checkOnboardingRedirect();

  console.log(
    "🔍 [ROLE_SELECTION] checkOnboardingRedirect completed, rendering page"
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100/30 via-background to-slate-100/30 flex flex-col items-center justify-center p-4">
      <Suspense
        fallback={
          <div className="flex items-center justify-center text-blue-600">
            <Loader2 className="w-10 h-10 animate-spin" />
          </div>
        }
      >
        <RoleSelectionClient />
      </Suspense>
    </div>
  );
}
