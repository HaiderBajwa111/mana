"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { logoutUser } from "@/app/actions/auth/logout";
import { useToast } from "@/hooks/ui/use-toast";
import { useRouter } from "next/navigation";

interface MakerSettingsClientProps {
  user: any;
}

export default function MakerSettingsClient({ user }: MakerSettingsClientProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    const res = await logoutUser();
    if (res.success) {
      try {
        sessionStorage.clear();
        localStorage.clear();
      } catch {}
      toast({ title: "Signed out" });
      router.replace("/auth");
    } else {
      toast({ title: "Logout failed", description: res.error, variant: "destructive" });
    }
    setIsLoggingOut(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-base">Account</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-muted-foreground">
            Signed in as <span className="text-foreground font-medium">{user?.email}</span>
          </div>

          <Button
            variant="destructive"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full sm:w-auto"
          >
            {isLoggingOut ? "Signing out..." : "Sign out"}
          </Button>
        </CardContent>
      </Card>

      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-base">Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">Coming soon</div>
        </CardContent>
      </Card>
    </div>
  );
}


