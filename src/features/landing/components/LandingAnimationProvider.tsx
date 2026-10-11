"use client";

import type { PropsWithChildren } from "react";

import useLandingAnimation from "@/features/landing/hooks/useLandingAnimation";
import { useLandingReady } from "@/features/landing/hooks/useLandingReady";
import LandingPreloader from "@/features/landing/components/LandingPreloader";

//* پوسته‌ی انیمیشن لندینگ.
export default function LandingAnimationProvider({
  children,
}: PropsWithChildren) {
  const ready = useLandingReady();
  const { landingRef } = useLandingAnimation(ready);

  return (
    <div ref={landingRef} className="bg-background text-text min-h-screen">
      <LandingPreloader done={ready} />
      {children}
    </div>
  );
}
