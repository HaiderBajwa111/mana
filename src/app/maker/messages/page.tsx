import { checkOnboardingStatus } from "@/app/actions/auth/check-onboarding-status";
import MakerMessagesView from "@/components/dashboard/maker/maker-messages-view";

export default async function MakerMessagesPage() {
  const user = await checkOnboardingStatus();

  return (
    <main className="min-h-screen pb-6 px-4 md:px-6 space-y-6">
      <MakerMessagesView />
    </main>
  );
}
