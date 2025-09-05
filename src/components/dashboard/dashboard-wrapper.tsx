"use client";

import { useState } from "react";
import { BuyerDashboardView } from "@/components/dashboard/creator/buyer-dashboard-view";
import MakerDashboardView from "@/components/dashboard/maker/maker-dashboard-view";
import RoleSwitcher from "@/components/dashboard/role-switcher";

interface DashboardWrapperProps {
  roles: string[];
  initialActiveRole: string;
  user: any;
}

export default function DashboardWrapper({
  roles,
  initialActiveRole,
  user,
}: DashboardWrapperProps) {
  const [activeRole, setActiveRole] = useState(initialActiveRole);

  const handleRoleChange = (newRole: string) => {
    setActiveRole(newRole);
    // Store in session storage for persistence
    sessionStorage.setItem("mana_active_role", newRole);
  };

  return (
    <div className="relative">
      <RoleSwitcher
        roles={roles}
        activeRole={activeRole}
        onRoleChange={handleRoleChange}
      />
      <div className="transition-opacity duration-300">
        {activeRole === "creator" && (
          <BuyerDashboardView user={user} initialData={null} />
        )}
        {activeRole === "maker" && <MakerDashboardView />}
      </div>
    </div>
  );
}
