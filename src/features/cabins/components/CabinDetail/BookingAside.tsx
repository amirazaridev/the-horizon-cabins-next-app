"use client";

import type { ReactNode } from "react";
import CardContainer from "@/components/ui/CardContainer";
import BookingSummary from "./BookingSummary";

export default function BookingAside(): ReactNode {
  return (
    <aside className="hidden lg:sticky lg:top-[calc(var(--hz-navbar-h)+var(--hz-tabs-h)+1rem)] lg:block lg:self-start">
      <CardContainer variant="gradient" contentClassName="p-5">
        <BookingSummary showCta />
      </CardContainer>
    </aside>
  );
}
