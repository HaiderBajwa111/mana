import { checkOnboardingStatus } from "@/app/actions/auth/check-onboarding-status";
import MakerSettingsClient from "@/components/settings/maker-settings-client";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function MakerSettingsPage() {
  const user = await checkOnboardingStatus();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Manage your maker profile, printers, and account.
        </p>
      </div>

      <MakerSettingsClient user={user} />

      <Card>
        <CardHeader>
          <CardTitle>Role</CardTitle>
          <CardDescription>Switch between Maker and Creator</CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="bg-blue-600 hover:bg-blue-700" asChild>
            <a href="/creator/dashboard">Switch to Creator</a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}


