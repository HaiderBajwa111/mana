"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
// Use plain <img> for guaranteed immediate render from public/
import {
  Home,
  Package,
  MessageSquare,
  Settings,
  Box,
  LogOut,
  FileText,
  Printer,
  User,
  ChevronLeft,
  ChevronRight,
  UploadCloud,
  Wrench,
  Palette,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { logoutUser } from "@/app/actions/auth/logout";
import { useToast } from "@/hooks/ui/use-toast";
import { useCurrentUser } from "@/hooks/auth/use-current-user";
import { useSidebar } from "@/contexts/sidebar-context";

// Navigation configurations for different user types
const navigationConfigs = {
  creator: [
    { name: "Dashboard", href: "/creator/dashboard", icon: Home },
    { name: "Messages", href: "/creator/messages", icon: MessageSquare },
    { name: "Settings", href: "/creator/settings", icon: Settings },
  ],
  maker: [
    { name: "Dashboard", href: "/maker/dashboard", icon: Home },
    { name: "Messages", href: "/maker/messages", icon: MessageSquare },
    { name: "Settings", href: "/maker/settings", icon: Settings },
  ],
};

interface SidebarProps {
  userType: "creator" | "maker";
  user?: any;
}

export default function Sidebar({ userType, user: userProp }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();
  const {
    isMinimized,
    isMobileOpen,
    toggleMinimized,
    toggleMobile,
    closeMobile,
  } = useSidebar();
  const {
    user: fetchedUser,
    loading,
    error,
  } = useCurrentUser({
    enabled: !userProp,
  });
  const user = userProp ?? fetchedUser;
  const [isRoleSwitching, setIsRoleSwitching] = useState(false);

  const navItems = navigationConfigs[userType];

  // Color configurations for different user types
  const colorConfigs = {
    creator: {
      bgGradient: "from-blue-500 to-blue-600",
      tagBg: "from-blue-500 to-blue-600",
      tagText: "text-blue-500",
      bgColor: "bg-blue-50",
      hoverBg: "hover:bg-blue-50",
      activeBg: "bg-blue-100",
    },
    maker: {
      bgGradient: "from-purple-500 to-purple-600",
      tagBg: "from-purple-500 to-purple-600",
      tagText: "text-purple-500",
      bgColor: "bg-purple-50",
      hoverBg: "hover:bg-purple-50",
      activeBg: "bg-purple-100",
    },
  };

  const colors = colorConfigs[userType];

  const handleSignOut = async () => {
    try {
      const result = await logoutUser();

      if (result.success) {
        // Clear session storage
        sessionStorage.clear();
        localStorage.clear();

        toast({
          title: "Logged out successfully",
          description: "You have been signed out.",
        });

        // Redirect to home page
        router.push("/");
      } else {
        throw new Error(result.error || "Logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Logout failed",
        description: "There was an error signing you out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleViewProfile = () => {
    // Navigate to profile/settings page based on user type
    const profilePath =
      userType === "creator" ? "/creator/settings" : "/maker/settings";
    router.push(profilePath);
  };

  const handleRoleSwitch = async () => {
    setIsRoleSwitching(true);

    // Add a small delay for animation effect
    await new Promise((resolve) => setTimeout(resolve, 400));

    const newRole = userType === "creator" ? "maker" : "creator";
    const newPath =
      newRole === "creator" ? "/creator/dashboard" : "/maker/dashboard";
    router.push(newPath);
  };

  // Get user display name
  const getDisplayName = () => {
    if (loading) return "Loading...";
    if (error || !user) return "User";
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    if (user.firstName) {
      return user.firstName;
    }
    if (user.email) {
      return user.email.split("@")[0];
    }
    return "User";
  };

  // Get user initials for avatar fallback
  const getInitials = () => {
    if (error || !user) return "U";
    if (user.firstName) {
      return user.firstName[0].toUpperCase();
    }
    if (user.email) {
      return user.email[0].toUpperCase();
    }
    return "U";
  };

  // Get user type gradient background for avatar fallback
  const getUserTypeGradient = () => {
    return userType === "creator"
      ? "from-blue-500 to-blue-600"
      : "from-purple-500 to-purple-600";
  };

  const SidebarContent = () => (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen transition-all duration-300 ease-in-out bg-card border-r border-border",
        isMinimized ? "w-16" : "w-64",
        "lg:translate-x-0",
        isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}
    >
      <div className="flex h-full flex-col">
        {/* Header with Logo, Tag, and Collapse Button */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-border">
          <Link href="/" className="flex items-center gap-2">
            <motion.div className="flex-shrink-0" animate={{ scale: isRoleSwitching ? [1, 1.1, 1] : 1 }} transition={{ duration: 0.4 }}>
              <Image src="/assets/logos/mana-logo.png" alt="Mana Logo" width={28} height={28} />
            </motion.div>
            {!isMinimized && (
              <>
                <motion.span
                  className={`text-xl font-bold bg-gradient-to-r ${colors.bgGradient} bg-clip-text text-transparent flex-shrink-0`}
                  animate={{ scale: isRoleSwitching ? [1, 1.05, 1] : 1 }}
                  transition={{ duration: 0.4 }}
                >
                  Mana
                </motion.span>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={userType}
                    className={`ml-2 px-1.5 py-0.5 rounded-full ${colors.bgColor} border border-border text-[11px] font-semibold tracking-wide shadow-sm`}
                    initial={{ scale: 0.8, opacity: 0, y: -5 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.8, opacity: 0, y: 5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <span className={colors.tagText}>
                      {userType.charAt(0).toUpperCase() + userType.slice(1)}
                    </span>
                  </motion.span>
                </AnimatePresence>
              </>
            )}
          </Link>

          <div className="flex items-center gap-2">
            {/* Mobile close button */}
            <button
              onClick={closeMobile}
              className="lg:hidden p-1 rounded-md hover:bg-accent transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Desktop collapse button */}
            <button
              onClick={toggleMinimized}
              className="hidden lg:block p-1 rounded-md hover:bg-accent transition-colors"
            >
              {isMinimized ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-1 p-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={closeMobile}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? `${colors.activeBg} ${colors.tagText}`
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )}
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                {!isMinimized && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Separator */}
        <div className="p-2">
          <div className="h-px bg-border" />
        </div>

        {/* Contextual CTA */}
        <div className="p-2">
          <Link
            href={userType === "maker" ? "/maker/prints?status=COMPLETED" : "/creator/start-print"}
            onClick={closeMobile}
            className={cn(
              "w-full flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all duration-300 hover:bg-accent/50 text-foreground"
            )}
          >
            <Package className="h-4 w-4 flex-shrink-0" />
            {!isMinimized && (
              <span>{userType === "maker" ? "View Completed Orders" : "Create a Print"}</span>
            )}
          </Link>
        </div>

        {/* Role Switch moved to Settings: show a hint link here */}
        <div className="p-2">
          <Link
            href={userType === "creator" ? "/creator/settings" : "/maker/settings"}
            className="w-full flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-all duration-300 hover:bg-accent/50"
            onClick={closeMobile}
          >
            {userType === "creator" ? (
              <Wrench className={cn("h-4 w-4", colors.tagText)} />
            ) : (
              <UploadCloud className={cn("h-4 w-4", colors.tagText)} />
            )}
            {!isMinimized && (
              <span className={cn("text-sm font-medium", colors.tagText)}>
                Change role in Settings
              </span>
            )}
          </Link>
        </div>

        {/* User Profile Section */}
        <div className="p-2 border-t border-border">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-full flex items-center gap-3 rounded-md px-3 py-2 hover:bg-accent transition-colors">
                {loading ? (
                  <>
                    <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
                    {!isMinimized && <Skeleton className="h-4 flex-1" />}
                  </>
                ) : (
                  <>
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarImage
                        src={user?.profilePictureUrl || undefined}
                        alt={getDisplayName()}
                      />
                      <AvatarFallback
                        className={`text-xs font-medium text-white bg-gradient-to-br ${getUserTypeGradient()} flex items-center justify-center`}
                      >
                        {getInitials()}
                      </AvatarFallback>
                    </Avatar>
                    {!isMinimized && (
                      <div className="flex-1 text-left">
                        <p className="text-sm font-medium text-foreground truncate">
                          {getDisplayName().split(" ")[0]}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {user?.email}
                        </p>
                      </div>
                    )}
                  </>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={handleViewProfile}>
                <User className="mr-2 h-4 w-4" />
                <span>View Profile</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleSignOut}
                className="text-destructive focus:text-destructive"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </aside>
  );

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={toggleMobile}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 rounded-md bg-card border border-border shadow-lg"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={closeMobile}
          />
        )}
      </AnimatePresence>

      {/* Sidebar Content */}
      <SidebarContent />
    </>
  );
}
