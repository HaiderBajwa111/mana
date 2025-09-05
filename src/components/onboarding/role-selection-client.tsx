"use client";

import type React from "react";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { FloatingShapes } from "@/components/splash/floating-shapes";
import { useToast } from "@/hooks/ui/use-toast";
import {
  ShoppingBag,
  UploadCloud,
  Wrench,
  Zap,
  ArrowRight,
  Box,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export type UserRole = "creator" | "maker" | "both";

interface RoleOption {
  id: UserRole;
  icon: React.ElementType;
  title: string;
  subtitle: string;
  description: string;
  color: string;
  bgColor: string;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const ROLE_OPTIONS: RoleOption[] = [
  {
    id: "creator",
    icon: UploadCloud,
    title: "Creator",
    subtitle: "Upload and print your models",
    description:
      "Turn your digital designs into physical objects with our network of skilled Makers and Printers.",
    color: "text-blue-500",
    bgColor: "bg-blue-50",
  },
  {
    id: "maker",
    icon: Wrench,
    title: "Maker",
    subtitle: "Offer your printing services",
    description:
      "Share your expertise and equipment to help bring others' ideas to life.",
    color: "text-blue-700",
    bgColor: "bg-blue-50",
  },
];

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function convertRoleToRolesArray(selectedRole: UserRole): string[] {
  switch (selectedRole) {
    case "creator":
      return ["creator"];
    case "maker":
      return ["maker"];
    case "both":
      return ["creator", "maker"];
  }
  // This should never be reached due to exhaustive switch
  return [];
}

function getRedirectPathForExistingRoles(existingRoles: string[]): string {
  if (existingRoles.length === 1) {
    const singleRole = existingRoles[0];
    switch (singleRole) {
      case "creator":
        return "/creator/dashboard";
      case "maker":
        return "/maker/dashboard";
      case "both":
        return "/dashboard";
      default:
        return "/dashboard";
    }
  }
  return "/dashboard";
}

// ============================================================================
// COMPONENT
// ============================================================================

export default function RoleSelectionClient() {
  // ========================================================================
  // STATE MANAGEMENT
  // ========================================================================

  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  // ========================================================================
  // HOOKS
  // ========================================================================

  const router = useRouter();
  const { toast } = useToast();

  // ========================================================================
  // EFFECTS
  // ========================================================================

  useEffect(() => {
    // This key is only used for onboarding flow state, not for backend role logic
    const existingRoles = JSON.parse(
      sessionStorage.getItem("mana_onboarding_roles") || "null"
    );
    if (existingRoles && existingRoles.length > 0) {
      // User already has roles, redirect to appropriate dashboard
      const redirectPath = getRedirectPathForExistingRoles(existingRoles);
      router.replace(redirectPath);
    }
  }, [router]);

  // ========================================================================
  // EVENT HANDLERS
  // ========================================================================

  const handleRoleSelect = useCallback((roleId: UserRole) => {
    setSelectedRole(roleId);
  }, []);

  const handleContinue = useCallback(() => {
    if (!selectedRole) {
      toast({
        title: "Select a Role",
        description: "Please choose how you'd like to use Mana.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Convert role selection to roles array
      const roles = convertRoleToRolesArray(selectedRole);

      // Store roles as pending (not finalized until onboarding completes)
      sessionStorage.setItem(
        "mana_onboarding_roles_pending",
        JSON.stringify(roles)
      );
      sessionStorage.setItem("selected_onboarding_role", selectedRole);

      // Route based on selected role
      if (selectedRole === "both") {
        // Both users go through hybrid onboarding flow
        router.push(`/onboarding/flow?role=${selectedRole}`);
      } else {
        // Other roles go through onboarding flow
        router.push(`/onboarding/flow?role=${selectedRole}`);
      }
    } catch (error) {
      console.error("Error storing role or navigating:", error);
      toast({
        title: "Navigation Error",
        description: "Could not proceed with role selection. Please try again.",
        variant: "destructive",
      });
    }
  }, [selectedRole, router, toast]);

  // ========================================================================
  // ANIMATION VARIANTS
  // ========================================================================

  const containerVariants = useMemo(
    () =>
      ({
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2,
          },
        },
      }) as const,
    []
  );

  const itemVariants = useMemo(
    () =>
      ({
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.5,
            ease: "easeOut" as const,
          },
        },
      }) as const,
    []
  );

  // ========================================================================
  // RENDERING LOGIC
  // ========================================================================

  const renderRoleCard: (role: RoleOption) => React.ReactNode = useCallback(
    (role) => (
      <motion.button
        key={role.id}
        onClick={() => handleRoleSelect(role.id)}
        className={`relative p-8 rounded-3xl border-2 text-left group overflow-hidden transition-all duration-300 ${
          selectedRole === role.id
            ? role.id === "creator"
              ? "border-blue-500 scale-105 shadow-lg"
              : role.id === "maker"
                ? "border-blue-700 scale-105 shadow-lg"
                : "border-transparent scale-105 shadow-lg"
            : "border-slate-200 hover:border-blue-300/50"
        } ${role.bgColor}`}
        style={
          role.id === "both"
            ? {
                background:
                  "linear-gradient(90deg, #eff6ff 0%, #fff 50%, #f1f5f9 100%)",
              }
            : {}
        }
        whileHover={{ scale: selectedRole === role.id ? 1.05 : 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Background glow effect */}
        <div
          className={`absolute inset-0 ${role.id === "both" ? "bg-gradient-to-r from-blue-500/10 to-slate-500/10" : role.id === "creator" ? "bg-blue-500/10" : role.id === "maker" ? "bg-blue-700/10" : ""} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
        />
        {/* Content */}
        <div className="relative z-10">
          {/* Icon */}
          <div
            className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 ${role.id === "creator" ? "bg-blue-100" : role.id === "maker" ? "bg-blue-100" : "bg-gradient-to-r from-blue-100 to-slate-100"}`}
          >
            {role.id === "both" && role.icon === Zap ? (
              <Zap
                className="w-8 h-8"
                style={{ stroke: "url(#mana-both-gradient)" }}
              />
            ) : (
              // @ts-ignore
              <role.icon className={`w-8 h-8 ${role.color}`} />
            )}
          </div>
          {/* Text */}
          <h3
            className={`text-2xl font-bold mb-2 ${role.id === "both" ? "bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent" : role.color} group-hover:brightness-110 transition-all duration-300`}
          >
            {role.title}
          </h3>
          <p className="text-slate-600 text-sm mb-4 font-medium">
            {role.subtitle}
          </p>
          <p className="text-slate-600 text-sm leading-relaxed">
            {role.description}
          </p>
        </div>
        {/* Selection indicator */}
        {selectedRole === role.id && (
          <motion.div
            layoutId="selectedIndicator"
            className={`absolute top-4 right-4 w-6 h-6 ${role.id === "creator" ? "bg-blue-500" : role.id === "maker" ? "bg-blue-700" : "bg-gradient-to-r from-blue-600 to-blue-500"} rounded-full flex items-center justify-center`}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
          >
            <div className="w-3 h-3 bg-white rounded-full" />
          </motion.div>
        )}
      </motion.button>
    ),
    [selectedRole, handleRoleSelect]
  );

  const renderHeader = useMemo(
    () => (
      <motion.div variants={itemVariants} className="mb-16">
        <div className="text-sm text-slate-500 mb-4 tracking-wider">
          Onboarding • role-selection
        </div>
        <div className="mb-8 flex items-center gap-2 justify-center">
          <Image src="/assets/logos/mana-logo.png" alt="Mana Logo" width={200} height={200} />
        </div>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-500">
          Welcome to Mana
        </h1>
        <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
          Choose your path in the future of making. You can always change this
          later.
        </p>
      </motion.div>
    ),
    [itemVariants]
  );

  const renderRoleCards = useMemo(
    () => (
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-16"
      >
        {ROLE_OPTIONS.map(renderRoleCard)}
      </motion.div>
    ),
    [itemVariants, renderRoleCard]
  );

  const renderContinueButton = useMemo(() => {
    let btnClass = "bg-gray-200";
    if (selectedRole === "creator") btnClass = "bg-blue-500 hover:bg-blue-600";
    else if (selectedRole === "maker")
      btnClass = "bg-blue-700 hover:bg-blue-800";
    else if (selectedRole === "both")
      btnClass =
        "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600";
    return (
      <motion.div variants={itemVariants} className="mb-8">
        <Button
          onClick={handleContinue}
          disabled={!selectedRole}
          size="lg"
          className={`font-semibold rounded-xl px-12 py-4 text-lg transition-all duration-300 transform hover:scale-105 focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:transform-none text-white border-0 ${btnClass}`}
          style={{ transition: "background 0.4s cubic-bezier(0.4,0,0.2,1)" }}
        >
          Continue <ArrowRight className="w-5 h-5 ml-2 text-white" />
        </Button>
      </motion.div>
    );
  }, [itemVariants, handleContinue, selectedRole]);

  const renderFooter = useMemo(
    () => (
      <motion.div variants={itemVariants}>
        <p className="text-sm text-slate-500">
          Not sure? Start with Buyer and upgrade to Maker anytime.
        </p>
      </motion.div>
    ),
    [itemVariants]
  );

  // ========================================================================
  // MAIN RENDER
  // ========================================================================

  return (
    <>
      {/* SVG gradient for the 'both' icon */}
      <svg width="0" height="0">
        <linearGradient
          id="mana-both-gradient"
          x1="100%"
          y1="100%"
          x2="0%"
          y2="0%"
        >
          <stop stopColor="#3b82f6" offset="0%" />
          <stop stopColor="#1e40af" offset="100%" />
        </linearGradient>
      </svg>
      <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
        <FloatingShapes />
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0opacity-90" />
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10 w-full max-w-6xl text-center"
        >
          {renderHeader}
          {renderRoleCards}
          {renderContinueButton}
          {renderFooter}
        </motion.div>
      </div>
    </>
  );
}
