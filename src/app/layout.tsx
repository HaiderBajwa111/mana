import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ScrollToTop } from "@/components/splash/scroll-to-top";
import { Toaster } from "@/components/ui/toaster";
// Note: keep ErrorBoundary out of the root layout tree while debugging chunk load issues
// import { ErrorBoundary } from "@/components/splash/error-boundary";
import { QueryProvider } from "@/components/providers/query-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mana - Print Your Imagination",
  description:
    "A futuristic, community-driven 3D printing platform connecting students, hobbyists, and Makers.",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryProvider>
          <ScrollToTop />
          {children}
          <Toaster />
        </QueryProvider>
      </body>
    </html>
  );
}
