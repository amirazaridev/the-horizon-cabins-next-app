"use client";
import { PropsWithChildren } from "react";
import useLandingAnimation from "@/features/landing/hooks/useLandingAnimation";

export default function LandingAnimationProvider({
  children,
}: PropsWithChildren) {
  const { landingRef } = useLandingAnimation();
  return (
    <div ref={landingRef} className="bg-background text-text min-h-screen">
      {children}
    </div>
  );
}
