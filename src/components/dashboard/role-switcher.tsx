"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import { Users, Printer } from "lucide-react";
import { cn } from "@/lib/utils";

interface RoleSwitcherProps {
  roles: string[];
  activeRole: string;
  onRoleChange: (role: string) => void;
}

const roleIcons: { [key: string]: React.ElementType } = {
  buyer: Users,
  maker: Printer,
};

const roleLabels: { [key: string]: string } = {
  buyer: "Buyer",
  maker: "Maker",
};

export default function RoleSwitcher({
  roles,
  activeRole,
  onRoleChange,
}: RoleSwitcherProps) {
  return (
    <div className="fixed top-5 right-5 z-50 bg-mana-gray/80 backdrop-blur-md p-1 rounded-full border border-mana-gray-light/20 shadow-lg">
      <div className="flex items-center gap-1">
        {roles.map((role) => {
          const Icon = roleIcons[role] || Users;
          return (
            <Button
              key={role}
              onClick={() => onRoleChange(role)}
              variant="ghost"
              size="sm"
              className={cn(
                "rounded-full px-3 py-1 h-auto text-xs font-semibold flex items-center gap-1.5 transition-all duration-300",
                activeRole === role
                  ? "bg-mana-mint text-mana-black shadow-md"
                  : "text-mana-text-secondary hover:bg-mana-gray-light/20 hover:text-mana-text"
              )}
            >
              <Icon className="w-4 h-4" />
              <span>{roleLabels[role]}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
