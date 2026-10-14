"use client";

import { useEffect, useRef } from "react";

import { gsap } from "@/features/landing/utils/gsap";
import {
  buildHeroIntro,
  buildHeroParallax,
  clearHeroProps,
} from "@/features/landing/utils/animations/hero";
import {
  buildCardGridReveal,
  buildRevealBatch,
  refreshScrollTriggersOnLoad,
} from "@/features/landing/utils/animations/sections";

export default function useLandingAnimation(enabled = true) {
  const landingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enabled) return;

    const scope = landingRef.current;
    if (!scope) return;

    let mm: ReturnType<typeof gsap.matchMedia> | null = null;

    try {
      mm = gsap.matchMedia();

      mm.add(
        "(prefers-reduced-motion: no-preference)",
        () => {
          buildHeroIntro();
          buildHeroParallax();
          buildRevealBatch();
          buildCardGridReveal();

          return refreshScrollTriggersOnLoad();
        },
        scope,
      );
    } catch {
      clearHeroProps(scope);
    }

    return () => {
      mm?.revert();
      clearHeroProps(scope);
    };
  }, [enabled]);

  return { landingRef };
}
