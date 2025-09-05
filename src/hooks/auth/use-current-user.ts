import { useState, useEffect } from "react";
import { getCurrentUser } from "@/app/actions/auth/get-current-user";

export interface CurrentUser {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  externalAuthId: string | null;
  profilePictureUrl: string | null;
  creatorProfile?: any;
  manufacturerProfile?: any;
  projects?: Array<{
    id: string;
    title: string;
    createdAt: Date;
  }>;
  onboardingCompleted: boolean | null;
  defaultRole: string | null;
}

export function useCurrentUser(options?: { enabled?: boolean }) {
  const enabled = options?.enabled ?? true;
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      return;
    }
    const fetchCurrentUser = async () => {
      try {
        setLoading(true);
        const result = await getCurrentUser();

        if (!result.success) {
          if ("error" in result && result.error === "Not authenticated") {
            setUser(null);
            setError(null);
          } else {
            throw new Error(
              "error" in result ? result.error : "Failed to fetch user"
            );
          }
        } else {
          if ("user" in result && result.user) {
            console.log("useCurrentUser - User data received:", {
              id: result.user.id,
              email: result.user.email,
              profilePictureUrl: result.user.profilePictureUrl,
            });
            setUser(result.user);
            setError(null);
          } else {
            throw new Error("User data not returned from server");
          }
        }
      } catch (err) {
        console.error("Error fetching current user:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, [enabled]);

  const refetch = async () => {
    if (!enabled) return;
    setLoading(true);
    const result = await getCurrentUser();

    if (result.success && "user" in result && result.user) {
      setUser(result.user);
      setError(null);
    } else {
      setUser(null);
    }
    setLoading(false);
  };

  return { user, loading, error, refetch };
}
