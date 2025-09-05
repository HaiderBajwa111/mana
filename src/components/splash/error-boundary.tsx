"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown, info: unknown) {
    console.error("💥 Unhandled error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-mana-black text-mana-text">
          <h1 className="text-3xl font-bold">Something went wrong.</h1>
          <p className="text-mana-text-secondary">
            An update failed to load. Please try reloading the page.
          </p>
          <Button size="lg" onClick={() => window.location.reload()}>
            Reload
          </Button>
        </main>
      );
    }

    return this.props.children;
  }
}
