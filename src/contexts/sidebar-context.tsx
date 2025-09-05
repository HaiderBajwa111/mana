"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface SidebarContextType {
  isMinimized: boolean;
  isMobileOpen: boolean;
  setIsMinimized: (minimized: boolean) => void;
  setIsMobileOpen: (open: boolean) => void;
  toggleMinimized: () => void;
  toggleMobile: () => void;
  closeMobile: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Close mobile sidebar on window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleMinimized = () => {
    setIsMinimized(!isMinimized);
  };

  const toggleMobile = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  const closeMobile = () => {
    setIsMobileOpen(false);
  };

  return (
    <SidebarContext.Provider
      value={{ 
        isMinimized, 
        isMobileOpen, 
        setIsMinimized, 
        setIsMobileOpen,
        toggleMinimized, 
        toggleMobile,
        closeMobile
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}
