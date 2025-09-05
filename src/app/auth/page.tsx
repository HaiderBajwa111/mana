"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/ui/use-toast";
import { Loader2, Eye, EyeOff, LogIn, Box } from "lucide-react";
import { FloatingShapes } from "@/components/splash/floating-shapes"; // Re-using for immersive background
import Image from "next/image";
import { loginUser } from "@/app/actions/auth";
import { useAutoLogin } from "@/hooks/auth/use-auth";
import { createClient } from "@/lib/supabase/client";

// Type for user data returned from login
interface LoginUser {
  id: string; // changed from number to string
  email: string;
  firstName: string | null;
  lastName: string | null;
  defaultRole: string | null;
  onboardingCompleted: boolean | null;
  creatorProfile?: any;
  manufacturerProfile?: any;
}

// Helper function to determine redirect path based on user roles and onboarding status
function getRedirectPath(user: LoginUser): string {
  // If user hasn't completed onboarding, redirect to role selection
  if (!user.onboardingCompleted) {
    return "/onboarding/role-selection";
  }

  // If user has a default role, redirect to appropriate dashboard
  if (user.defaultRole) {
    switch (user.defaultRole) {
      case "creator":
        return "/creator/dashboard";
      case "maker":
        return "/maker/dashboard";
      default:
        return "/dashboard";
    }
  }

  // Fallback to multi-role dashboard
  return "/dashboard";
}

// Helper function to set up session storage for dashboard
function setupSessionStorage(user: LoginUser) {
  // Store basic user data
  sessionStorage.setItem("user_id", user.id.toString());
  sessionStorage.setItem("user_email", user.email);
  sessionStorage.setItem("user_firstName", user.firstName || "");
  sessionStorage.setItem("user_lastName", user.lastName || "");

  // Set up roles for dashboard (based on profile existence and default role)
  let roles: string[] = [];
  let activeRole = user.defaultRole || "creator";

  // Check if user has creator profile (can be a buyer/customer)
  if (user.creatorProfile) {
    roles.push("creator");
  }

  // Check if user has manufacturer profile (can be a maker/seller)
  if (user.manufacturerProfile) {
    roles.push("maker");
  }

  // If no profiles exist, default to creator
  if (roles.length === 0) {
    roles = ["creator"];
    activeRole = "creator";
  }

  // Store roles for dashboard
  sessionStorage.setItem("mana_user_roles", JSON.stringify(roles));
  sessionStorage.setItem("mana_active_role", activeRole);
}

export default function AuthPage() {
  const [isChecking, setIsChecking] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        router.replace("/dashboard");
      } else {
        setIsChecking(false);
      }
    };
    checkAuth();
  }, [router]);

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        {/* Your spinner here */}
        <div className="w-14 h-14 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    if (!email || !password) {
      toast({
        title: "Missing Fields",
        description: "Please enter both email and password.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      // Create FormData for server action
      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);

      // Call the server action
      const result = await loginUser(formData);

      if (!result.success) {
        throw new Error(result.error || "Login failed");
      }

      if (!result.user) {
        throw new Error("User data not returned from server");
      }

      // Set up session storage for dashboard
      setupSessionStorage(result.user);

      // Determine redirect path based on user's role and onboarding status
      const redirectPath = getRedirectPath(result.user);

      toast({
        title: "Login Successful!",
        description: `Welcome back, ${result.user.firstName || "User"}!`,
        className: "bg-blue-600 text-white",
      });

      // Redirect to appropriate dashboard
      router.push(redirectPath);
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login Failed",
        description:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      <FloatingShapes />
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100/50 via-background to-slate-100/50 opacity-80"></div>

      <div className="relative z-10 grid md:grid-cols-2 items-center gap-0 w-full max-w-5xl bg-card backdrop-blur-xl shadow-2xl rounded-3xl border border-border overflow-hidden">
        {/* Left Side - Visual/Branding */}
        <div className="hidden md:flex flex-col items-center justify-center p-12 h-full bg-gradient-to-br from-blue-50 via-background to-slate-50 border-r border-slate-200">
          <div className="mb-8 flex items-center gap-2">
            <Image src="/assets/logos/mana-logo.png" alt="Mana Logo" width={200} height={200} />
          </div>
          <p className="text-slate-600 text-center text-lg mb-4">
            Welcome back to the future of creation.
          </p>
          <p className="text-slate-500 text-center text-sm">
            Log in to access your projects, connect with makers, or explore the
            marketplace.
          </p>
          {/* You can add more complex animations or visuals here */}
          <div className="mt-12 w-48 h-48 relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-tl from-blue-400 to-blue-600 opacity-20 animate-pulse"></div>
            <LogIn
              className="absolute inset-0 m-auto w-24 h-24 text-blue-600 opacity-60"
              strokeWidth={1}
            />
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="p-8 sm:p-12">
          <div className="md:hidden text-center mb-8">
            <Image src="/assets/logos/mana-logo.png" alt="Mana Logo" width={200} height={200} />
          </div>
          <h2 className="text-3xl font-semibold text-slate-900 mb-3 text-center md:text-left">
            Log In to Mana
          </h2>
          <p className="text-slate-600 mb-8 text-sm text-center md:text-left">
            Enter your credentials to continue.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="email" className="text-slate-700 text-sm">
                Email Address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 bg-background border-slate-300 focus:border-blue-600 focus:ring-blue-600/20 rounded-xl h-12 text-slate-900 placeholder:text-slate-400"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-slate-700 text-sm">
                  Password
                </Label>
                <Link
                  href="/auth/forgot-password"
                  className="text-xs text-blue-600 hover:text-blue-700 transition-colors"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative mt-1">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-background border-slate-300 focus:border-blue-600 focus:ring-blue-600/20 rounded-xl h-12 text-slate-900 placeholder:text-slate-400 pr-10"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-blue-600"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Keep me logged in - Optional, like Robinhood */}
            {/* <div className="flex items-center">
              <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-primary border-border rounded focus:ring-primary" />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-muted-foreground"> Keep me logged in </label>
            </div> */}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full font-semibold rounded-xl h-12 text-base shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none bg-blue-600 hover:bg-blue-700 text-white border-0"
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <LogIn className="mr-2 h-5 w-5" />
              )}
              {isLoading ? "Logging In..." : "Log In"}
            </Button>

            {/* Optional: Log in with Passkeys button, like Robinhood */}
            {/* <Button
              type="button"
              variant="outline"
              className="w-full border-border text-muted-foreground hover:bg-muted hover:border-primary rounded-xl h-12"
              // onClick={() => {/* Handle Passkey login * /}}
            >
              <KeyRound className="mr-2 h-5 w-5" />
              Log In with Passkey
            </Button> */}

            <div className="text-center text-sm text-slate-600 pt-4">
              Not on Mana?{" "}
              <Link
                href="/auth/signup"
                className="font-semibold text-blue-600 hover:text-blue-700 transition-colors"
              >
                Create an account
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
