"use client";

import type React from "react";
import { useRef } from "react";
import { useIntersectionObserver } from "@/hooks/ui/use-intersection-observer";
import { cn } from "@/lib/utils";

interface ScrollAnimatedContentProps {
  children: React.ReactNode;
  className?: string;
  animationClassName?: string; // e.g. "animate-fade-in-up"
  initialClassName?: string; // e.g. "opacity-0 translate-y-4"
  delay?: string; // e.g. "delay-200"
  threshold?: number;
  freezeOnceVisible?: boolean;
}

/**
 * Fade / slide elements into view as the user scrolls.
 *
 * Example:
 *   <ScrollAnimatedContent delay="delay-200">
 *     <h2>Hello&nbsp;world</h2>
 *   </ScrollAnimatedContent>
 */
export function ScrollAnimatedContent({
  children,
  className,
  animationClassName = "animate-fade-in-up",
  initialClassName = "opacity-0 translate-y-4",
  delay,
  threshold = 0.1,
  freezeOnceVisible = true,
}: ScrollAnimatedContentProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const isVisible = useIntersectionObserver(ref, {
    threshold,
    freezeOnceVisible,
  });

  return (
    <div
      ref={ref}
      className={cn(
        "transition-all duration-700 ease-out",
        initialClassName,
        isVisible && animationClassName,
        delay,
        className
      )}
    >
      {children}
    </div>
  );
}
