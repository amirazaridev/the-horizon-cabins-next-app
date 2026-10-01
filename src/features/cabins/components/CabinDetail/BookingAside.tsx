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
 *
 * ⚠️ **عنوان پنل اینجا نیست.** عنوان («نرخ هر شب» / «صورت‌حساب») شرطی است
 * و داخل `BookingSummary` رندر می‌شود تا بین aside، باتم‌شیت و مودال
 * تک‌منبع بماند.
 *
 * ⚠️ **اسکرول کلی aside عمداً غیرفعال است.** پنل چسبان است و اگر خودش
 * اسکرول بخورد، کاربر دو ناحیه‌ی اسکرول روی هم می‌گیرد. به‌جایش چیدمان
 * فشرده شده (`contentClassName="p-5"`) و تنها بخش «جزییات حساب» در صورت
 * بلندشدن محتوا اسکرول داخلی می‌گیرد.
 */
export default function BookingAside(): ReactNode {
  return (
    <aside className="hidden lg:sticky lg:top-[calc(var(--hz-navbar-h)+var(--hz-tabs-h)+1rem)] lg:block lg:self-start">
      <CardContainer variant="gradient" contentClassName="p-5">
        <BookingSummary showCta />
      </CardContainer>
    </aside>
  );
}
