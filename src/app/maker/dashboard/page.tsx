import { checkOnboardingStatus } from "@/app/actions/auth/check-onboarding-status";
import MakerDashboardView from "@/components/dashboard/maker/maker-dashboard-view";

export default async function MakerDashboardPage() {
  const user = await checkOnboardingStatus();

  return (
    <main className="min-h-screen pb-6 px-4 md:px-6 space-y-6">
      <MakerDashboardView />
    </main>
  );
}
