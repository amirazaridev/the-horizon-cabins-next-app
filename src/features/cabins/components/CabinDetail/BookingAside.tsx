"use client";

import type { ReactNode } from "react";
import CardContainer from "@/components/ui/CardContainer";
import BookingSummary from "./BookingSummary";

/**
 * پنل رزرو چسبان دسکتاپ.
 *
 * در موبایل پنهان است (`hidden lg:block`)؛ نقش آن را نوار ثابت پایین
 * صفحه به‌همراه باتم‌شیت بازی می‌کند.
 *
 * `top` از همان متغیرهای تم می‌آید: ارتفاع نوار بالا + نوار تب چسبان،
 * تا پنل دقیقاً زیر تب‌ها بایستد و روی آن‌ها نیفتد.
 */
export default function BookingAside(): ReactNode {
  return (
    <aside className="hidden lg:sticky lg:top-[calc(var(--hz-navbar-h)+var(--hz-tabs-h)+1rem)] lg:block lg:self-start">
      <CardContainer variant="gradient">
        <h3 className="text-text relative mb-6 text-lg font-bold">رزرو اقامت</h3>
        <BookingSummary showCta />
      </CardContainer>
    </aside>
  );
}
