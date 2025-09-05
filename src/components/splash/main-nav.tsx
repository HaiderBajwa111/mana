"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { useIsMobile } from "@/hooks/ui/use-mobile";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Printer,
  Box,
  Layers,
  Menu,
  X,
  LogOut,
  User,
  Heart,
  PanelLeft,
  Upload,
  Database,
  Settings,
} from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { useCurrentUser } from "@/hooks/auth/use-current-user";
import { LayoutDashboard } from "lucide-react";

export default function MainNav() {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);
  const { user, loading } = useCurrentUser();

  const navItems = [
    { name: "How It Works", href: "/auth" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <nav className="h-16 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-2"
          >
            <Link href="/" className="flex items-center gap-2">
              <Image src="/assets/logos/mana-logo.png" alt="Mana Logo" width={28} height={28} />
              <span className="text-xl font-bold text-slate-900">Mana</span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          {!isMobile && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="hidden md:flex items-center space-x-1"
            >
              {navItems.map((item) => (
                <Link key={item.name} href={item.href}>
                  <Button
                    variant="ghost"
                    className="text-sm font-medium relative text-slate-700 hover:text-slate-900"
                  >
                    {item.name}
                    {item.comingSoon && (
                      <span className="ml-1 text-[10px] text-blue-600 font-bold">
                        (Soon)
                      </span>
                    )}
                  </Button>
                </Link>
              ))}
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="flex items-center gap-2"
          >
            {!loading && (
              <>
                {user ? (
                  // Authenticated user - show Dashboard button
                  <Link href="/dashboard">
                    <Button
                      className="rounded-full bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
                      size={isMobile ? "sm" : "default"}
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      {isMobile ? "Dashboard" : "Go to Dashboard"}
                    </Button>
                  </Link>
                ) : (
                  // Not authenticated - show Login and Join buttons
                  <>
                    {!isMobile && (
                      <Link href="/auth">
                        <Button
                          variant="ghost"
                          className="text-sm font-medium text-slate-700 hover:text-slate-900"
                        >
                          Log In
                        </Button>
                      </Link>
                    )}
                    <Link href="/auth">
                      <Button
                        className="rounded-full bg-blue-600 hover:bg-blue-700"
                        size={isMobile ? "sm" : "default"}
                      >
                        {isMobile ? "Join" : "Join Mana"}
                      </Button>
                    </Link>
                  </>
                )}
              </>
            )}

            {/* Mobile menu button - moved to after Join button */}
            {isMobile && (
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                  <SheetTitle className="sr-only">
                    Mana Navigation Menu
                  </SheetTitle>
                  <SheetDescription className="sr-only">
                    Navigation options for Mana platform
                  </SheetDescription>

                  <div className="px-1 py-6 flex flex-col h-full">
                    {/* Our custom close button */}
                    <div className="flex items-center justify-end mb-6">
                      <SheetClose asChild>
                        <Button variant="ghost" size="icon">
                          <X className="h-5 w-5" />
                        </Button>
                      </SheetClose>
                    </div>

                    <div className="space-y-4 py-6">
                      {navItems.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          onClick={() => setIsOpen(false)}
                        >
                          <Button
                            variant="ghost"
                            className="w-full justify-start text-lg relative text-slate-700 hover:text-slate-900"
                          >
                            {item.name}
                            {item.comingSoon && (
                              <span className="ml-2 text-[10px] text-blue-600 font-bold">
                                (Soon)
                              </span>
                            )}
                          </Button>
                        </Link>
                      ))}
                    </div>

                    <div className="mt-auto space-y-3">
                      {!loading && (
                        <>
                          {user ? (
                            // Authenticated user - show Dashboard button
                            <Link
                              href="/dashboard"
                              onClick={() => setIsOpen(false)}
                            >
                              <Button className="w-full bg-blue-600 hover:bg-blue-700 flex items-center gap-2">
                                <LayoutDashboard className="h-4 w-4" />
                                Go to Dashboard
                              </Button>
                            </Link>
                          ) : (
                            // Not authenticated - show Login and Sign Up buttons
                            <>
                              <Link
                                href="/auth"
                                onClick={() => setIsOpen(false)}
                              >
                                <Button
                                  variant="outline"
                                  className="w-full text-slate-700 border-slate-300 hover:bg-slate-50"
                                >
                                  Log In
                                </Button>
                              </Link>
                              <Link
                                href="/auth"
                                onClick={() => setIsOpen(false)}
                              >
                                <Button className="w-full">Sign Up</Button>
                              </Link>
                            </>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            )}
          </motion.div>
        </nav>
      </div>
    </header>
  );
}
