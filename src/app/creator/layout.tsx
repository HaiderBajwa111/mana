import React from "react";
import Sidebar from "@/components/dashboard/sidebar";
import { SidebarProvider } from "@/contexts/sidebar-context";

// Simplified layout without auth call - auth will be handled by pages
export default function CreatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="bg-background min-h-screen text-foreground font-sans">
        <Sidebar userType="creator" />
        <div className="ml-16 lg:ml-64 transition-all duration-300 ease-in-out">
          <div className="min-h-screen p-6">{children}</div>
        </div>
      </div>
    </SidebarProvider>
  );
}
