"use client";

import type React from "react";
import { z } from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/ui/use-toast";
import { Eye, EyeOff, Box } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { createUser } from "@/app/actions/user/create-user";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const SignupSchema = z
      .object({
        firstName: z.string().nonempty("Please fill in all required fields."),
        lastName: z.string().nonempty("Please fill in all required fields."),
        email: z
          .string()
          .nonempty("Please fill in all required fields.")
          .email("Please enter a valid email address."),
        password: z
          .string()
          .nonempty("Please fill in all required fields.")
          .min(8, "Password must be at least 8 characters long."),
        confirmPassword: z
          .string()
          .nonempty("Please fill in all required fields."),
        agreeToTerms: z.boolean().refine((val) => val, {
          message: "Please agree to the Terms of Service and Privacy Policy.",
        }),
      })
      .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match.",
        path: ["confirmPassword"],
      });

    const validationResult = SignupSchema.safeParse(formData);

    if (!validationResult.success) {
      const error = validationResult.error.errors[0];
      toast({
        title: error.message,
        description: error.path.includes("confirmPassword")
          ? "Passwords do not match."
          : error.message,
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Create FormData for server action
      const formDataToSend = new FormData();
      formDataToSend.append("firstName", formData.firstName);
      formDataToSend.append("lastName", formData.lastName);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("password", formData.password);

      // Call the server action
      const result = await createUser(formDataToSend);

      if (!result.success) {
        throw new Error(result.error || "Failed to create account");
      }

      if (!result.user) {
        throw new Error("User data not returned from server");
      }

      // Store user data for onboarding
      sessionStorage.setItem("user_firstName", formData.firstName);
      sessionStorage.setItem("user_lastName", formData.lastName);
      sessionStorage.setItem("user_email", formData.email);
      sessionStorage.setItem("user_id", result.user.id.toString());
      sessionStorage.setItem("signup_timestamp", Date.now().toString());

      toast({
        title: "Account Created!",
        description: `Welcome to Mana, ${formData.firstName}! Let's set up your profile.`,
        className: "bg-blue-600 text-white",
      });

      // Redirect directly to role selection
      router.push("/onboarding/role-selection");
    } catch (error) {
      console.error("Signup error:", error);
      toast({
        title: "Signup Failed",
        description:
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Side - Branding & Visual */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100/30 via-background to-slate-100/30">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(59,130,246,0.1),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,rgba(100,116,139,0.1),transparent_50%)]" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-12 py-16">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-16"
          >
            <Image src="/assets/logos/mana-logo.png" alt="Mana Logo" width={200} height={200} />
          </motion.div>

          {/* Main Heading */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-8"
          >
            <h2 className="text-5xl font-bold text-slate-900 leading-tight mb-6">
              Create your
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-500">
                Mana account
              </span>
            </h2>
            <p className="text-xl text-slate-600 leading-relaxed max-w-md">
              Join the future of 3D printing. Connect with creators, makers, and
              discover endless possibilities in our digital marketplace.
            </p>
          </motion.div>

          {/* 3D Visual Element */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="flex-1 flex items-center justify-center"
          >
            <div className="relative w-80 h-80">
              {/* Animated 3D-like wireframe */}
              <svg
                viewBox="0 0 300 300"
                className="w-full h-full"
                style={{
                  filter: "drop-shadow(0 0 20px rgba(37, 99, 235, 0.3))",
                }}
              >
                <defs>
                  <linearGradient
                    id="wireframe-gradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#2563eb" stopOpacity="0.8" />
                    <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#1e40af" stopOpacity="0.4" />
                  </linearGradient>
                </defs>

                {/* Outer ring */}
                <motion.circle
                  cx="150"
                  cy="150"
                  r="120"
                  fill="none"
                  stroke="url(#wireframe-gradient)"
                  strokeWidth="2"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2, delay: 0.5 }}
                />

                {/* Middle ring */}
                <motion.circle
                  cx="150"
                  cy="150"
                  r="80"
                  fill="none"
                  stroke="url(#wireframe-gradient)"
                  strokeWidth="1.5"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2, delay: 0.7 }}
                />

                {/* Inner ring */}
                <motion.circle
                  cx="150"
                  cy="150"
                  r="40"
                  fill="none"
                  stroke="url(#wireframe-gradient)"
                  strokeWidth="1"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2, delay: 0.9 }}
                />

                {/* Connecting lines */}
                <motion.line
                  x1="30"
                  y1="150"
                  x2="270"
                  y2="150"
                  stroke="url(#wireframe-gradient)"
                  strokeWidth="1"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, delay: 1.1 }}
                />

                <motion.line
                  x1="150"
                  y1="30"
                  x2="150"
                  y2="270"
                  stroke="url(#wireframe-gradient)"
                  strokeWidth="1"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, delay: 1.3 }}
                />

                {/* Center dot */}
                <motion.circle
                  cx="150"
                  cy="150"
                  r="4"
                  fill="#2563eb"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 1.5 }}
                />
              </svg>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8 text-center">
            <Image src="/assets/logos/mana-logo.png" alt="Mana Logo" width={200} height={200} />
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              Create your account
            </h2>
            <p className="text-slate-600">Join the future of 3D printing</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="firstName"
                  className="text-slate-900 text-sm font-medium"
                >
                  First name
                </Label>
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                  className="bg-background border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:ring-blue-600/20 h-12"
                  placeholder="First name"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="lastName"
                  className="text-slate-900 text-sm font-medium"
                >
                  Last name
                </Label>
                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                  className="bg-background border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:ring-blue-600/20 h-12"
                  placeholder="Last name"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-foreground text-sm font-medium"
              >
                Email address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="bg-background border-border text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:ring-primary/20 h-12"
                placeholder="Email address"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-foreground text-sm font-medium"
              >
                Password (at least 8 characters)
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="bg-background border-border text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:ring-primary/20 h-12 pr-10"
                  placeholder="Password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-900"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label
                htmlFor="confirmPassword"
                className="text-foreground text-sm font-medium"
              >
                Confirm password
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                  className="bg-background border-border text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:ring-primary/20 h-12 pr-10"
                  placeholder="Confirm password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-900"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Terms */}
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={formData.agreeToTerms}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        agreeToTerms: e.target.checked,
                      }))
                    }
                    className="w-4 h-4 text-blue-600 bg-background border-2 border-slate-300 rounded focus:ring-blue-600 focus:ring-2 accent-blue-600"
                    required
                  />
                </div>
                <Label
                  htmlFor="terms"
                  className="text-sm text-slate-600 leading-relaxed cursor-pointer"
                >
                  I agree to the{" "}
                  <Link
                    href="/terms"
                    className="text-blue-600 hover:underline font-medium"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    className="text-blue-600 hover:underline font-medium"
                  >
                    Privacy Policy
                  </Link>
                </Label>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full font-semibold transition-all duration-300 h-12 text-base rounded-full disabled:opacity-50 bg-blue-600 hover:bg-blue-700 text-white border-0"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Creating Account...
                </div>
              ) : (
                "Continue"
              )}
            </Button>
            {/* Already started text */}
            <div className="text-center">
              <p className="text-sm text-slate-600">
                Already started?{" "}
                <Link
                  href="/auth"
                  className="text-blue-600 hover:underline font-medium"
                >
                  Log in to complete your account
                </Link>
              </p>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
