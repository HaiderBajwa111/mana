"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { syncUserFromAuth } from "@/app/actions/auth/sync-user";
import { getCurrentUser } from "@/app/actions/auth/get-current-user";
import { useRouter } from "next/navigation";

export default function SyncPage() {
  const [status, setStatus] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSync = async () => {
    setLoading(true);
    setStatus("Syncing user account...");

    try {
      const syncResult = await syncUserFromAuth();
      if (syncResult.success) {
        setStatus("✅ User account synced successfully!");
        
        // Check if user needs onboarding
        setTimeout(() => {
          router.push("/onboarding/role-selection");
        }, 2000);
      } else {
        setStatus(`❌ Sync failed: ${syncResult.error}`);
      }
    } catch (error) {
      setStatus(`❌ Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckUser = async () => {
    setLoading(true);
    setStatus("Checking current user...");

    try {
      const userResult = await getCurrentUser();
      if (userResult.success && "user" in userResult) {
        setStatus(`✅ User found: ${userResult.user.email} (ID: ${userResult.user.id})`);
      } else {
        setStatus(`❌ User check failed: ${userResult.error}`);
      }
    } catch (error) {
      setStatus(`❌ Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Account Sync</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            If you're getting "user not authenticated" errors, use this page to sync your account.
          </p>
          
          <Button 
            onClick={handleCheckUser} 
            disabled={loading}
            variant="outline"
            className="w-full"
          >
            Check Current User
          </Button>
          
          <Button 
            onClick={handleSync} 
            disabled={loading}
            className="w-full"
          >
            Sync Account
          </Button>
          
          {status && (
            <div className="p-3 bg-muted rounded-md">
              <p className="text-sm">{status}</p>
            </div>
          )}
          
          <Button 
            onClick={() => router.push("/")} 
            variant="ghost"
            className="w-full"
          >
            Back to Home
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
