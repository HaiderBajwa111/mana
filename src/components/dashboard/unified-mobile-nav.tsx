"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Upload,
  Package,
  MessageSquare,
  Settings,
  FileText,
  Printer,
  DollarSign,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface UnifiedMobileNavProps {
  userType: "creator" | "maker";
}

const mobileNavConfigs = {
  creator: [
    { href: "/creator/dashboard", icon: Home, label: "Dashboard" },
    { href: "/creator/start-print", icon: Upload, label: "Start" },
    { href: "/creator/prints", icon: Package, label: "Prints" },
    { href: "/creator/messages", icon: MessageSquare, label: "Messages" },
    { href: "/creator/settings", icon: Settings, label: "Settings" },
  ],
  maker: [
    { href: "/maker/dashboard", icon: Home, label: "Dashboard" },
    { href: "/maker/jobs", icon: FileText, label: "Jobs" },
    { href: "/maker/prints", icon: Package, label: "Prints" },
    { href: "/maker/earnings", icon: DollarSign, label: "Earnings" },
    { href: "/maker/settings", icon: Settings, label: "Settings" },
  ],
};

export default function UnifiedMobileNav({ userType }: UnifiedMobileNavProps) {
  const pathname = usePathname();
  const navItems = mobileNavConfigs[userType];

  // Color configurations for different user types
  const colorConfigs = {
    creator: {
      activeBg: "bg-blue-500/10",
      activeText: "text-blue-500",
      hoverBg: "hover:bg-blue-500/5",
      hoverText: "hover:text-blue-500",
    },
    maker: {
      activeBg: "bg-purple-500/10",
      activeText: "text-purple-500",
      hoverBg: "hover:bg-purple-500/5",
      hoverText: "hover:text-purple-500",
    },
  };

  const colors = colorConfigs[userType];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-card/90 backdrop-blur-lg border-t border-border p-2 z-50">
      <div className="grid grid-cols-5 gap-2">
        {navItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center gap-1 rounded-lg p-2 text-muted-foreground transition-colors",
              pathname === item.href
                ? `${colors.activeBg} ${colors.activeText}`
                : `${colors.hoverBg} ${colors.hoverText}`
            )}
          >
            <item.icon className="h-5 w-5" />
            <span className="text-xs font-medium">{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
