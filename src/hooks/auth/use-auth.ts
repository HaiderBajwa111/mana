import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

export interface AuthUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  roles?: string[];
  onboardingCompleted?: boolean;
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const supabase = createClient();

        // Get the current user from Supabase
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) {
          console.error("User error:", userError);
          setUser(null);
          setError(userError.message);
          return;
        }

        if (!user) {
          setUser(null);
          setError(null);
          return;
        }

        // Fetch additional user data from your database
        const response = await fetch("/api/auth/get-current-user");

        if (!response.ok) {
          if (response.status === 401) {
            setUser(null);
            setError(null);
          } else {
            throw new Error("Failed to fetch user data");
          }
        } else {
          const data = await response.json();
          if (data.success) {
            // Combine Supabase user with your database user data
            setUser({
              id: user.id,
              email: user.email || "",
              firstName: data.user.firstName,
              lastName: data.user.lastName,
              roles: data.user.roles || [],
              onboardingCompleted: data.user.onboardingCompleted,
            });
            setError(null);
          } else {
            throw new Error(data.error || "Failed to fetch user data");
          }
        }
      } catch (err) {
        console.error("Error fetching user:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();

    // Set up auth state listener
    const supabase = createClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session) {
        await fetchUser();
      } else if (event === "SIGNED_OUT") {
        setUser(null);
        setError(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      setUser(null);
    } catch (err) {
      console.error("Error signing out:", err);
      setError(err instanceof Error ? err.message : "Sign out failed");
    }
  };

  return {
    user,
    loading,
    error,
    signOut,
    isAuthenticated: !!user,
  };
}

export function useAutoLogin(redirectPath = "/dashboard") {
  const router = useRouter();
  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        router.replace(redirectPath);
      }
    };
    checkAuth();
    // Only run on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, redirectPath]);
}
