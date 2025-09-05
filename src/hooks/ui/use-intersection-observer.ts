"use client";

import { useEffect, useState, useRef } from "react";
import type { RefObject } from "react";

interface IntersectionObserverOptions extends IntersectionObserverInit {
  freezeOnceVisible?: boolean;
}

export function useIntersectionObserver(
  elementRef: RefObject<Element>,
  {
    threshold = 0.1,
    root = null,
    rootMargin = "0%",
    freezeOnceVisible = true,
  }: IntersectionObserverOptions = {},
): boolean {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (observerRef.current && freezeOnceVisible && isIntersecting) {
      observerRef.current.disconnect();
      return;
    }

    const node = elementRef?.current; // DOM Ref
    if (!node) return;

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          if (freezeOnceVisible && observerRef.current) {
            observerRef.current.unobserve(node);
          }
        } else {
          // Optionally, set to false if you want animations to reverse when scrolling out
          // For "reveal once", we don't set it back to false if freezeOnceVisible is true
          if (!freezeOnceVisible) {
            setIsIntersecting(false);
          }
        }
      },
      { threshold, root, rootMargin },
    );

    observerRef.current.observe(node);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [
    elementRef,
    threshold,
    root,
    rootMargin,
    freezeOnceVisible,
    isIntersecting,
  ]);

  return isIntersecting;
}
