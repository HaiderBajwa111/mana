"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/hooks/auth/use-current-user";
import { LayoutDashboard } from "lucide-react";

export function StickyNav() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, loading } = useCurrentUser();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out 
                  ${isScrolled ? "bg-background/80 backdrop-blur-lg shadow-lg" : "bg-transparent"}`}
    >
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/assets/logos/mana-logo.png" alt="Mana Logo" width={28} height={28} />
          <span className="text-3xl font-bold tracking-extra-wide text-slate-900">MANA</span>
        </Link>
        <nav className="hidden md:flex items-center space-x-6">
          {!loading && (
            <>
              {user ? (
                // Authenticated user - show Dashboard button
                <Button
                  asChild
                  className="font-semibold rounded-lg px-5 py-2.5 text-sm bg-blue-600 hover:bg-blue-700 text-white
                             shadow-sm hover:shadow-md transition-all duration-300 ease-in-out
                             transform hover:scale-105 flex items-center gap-2"
                >
                  <Link href="/dashboard">
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Link>
                </Button>
              ) : (
                // Not authenticated - show Login and Get Started buttons
                <>
                  <Link
                    href="/auth"
                    className="text-slate-600 hover:text-slate-900 transition-all duration-300 ease-in-out text-sm font-medium relative group"
                  >
                    <span>Log In</span>
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 ease-out group-hover:w-full"></span>
                  </Link>
                  <Button
                    asChild
                    className="font-semibold rounded-lg px-5 py-2.5 text-sm
                               shadow-sm hover:shadow-md transition-all duration-300 ease-in-out
                               transform hover:scale-105"
                  >
                    <Link href="/auth">Get Started</Link>
                  </Button>
                </>
              )}
            </>
          )}
        </nav>
        <div className="md:hidden">
          {/* Mobile menu button can be added here */}
          <Button
            variant="ghost"
            size="icon"
            className="text-slate-600 hover:text-blue-600"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </Button>
        </div>
      </div>
    </header>
  );
}
