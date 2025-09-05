import { checkOnboardingStatus } from "@/app/actions/auth/check-onboarding-status";
import PrintersClient from "@/components/maker/printers-client";

export default async function MakerPrintersPage() {
  const user = await checkOnboardingStatus();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">My Printers</h1>
        <p className="text-sm text-muted-foreground">Manage your printer inventory and capabilities.</p>
      </div>
      <PrintersClient userId={user.id} />
    </div>
  );
}


