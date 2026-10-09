"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

/*
 * پیش‌نویس رزرو — تاریخ‌ها و تعداد نفراتی که کاربر انتخاب کرده.
 *
 * ⚠️ **چرا zustand و نه Context؟** جریان فاز دوم یک ناوبری کامل است
 * (صفحه‌ی ویلا → `/login` یا `/account/settings` → بازگشت به همان صفحه‌ی
 * ویلا). Context داخل درخت React همان صفحه زندگی می‌کند و با unmount از بین
 * می‌رود، پس نمی‌تواند این رفت‌وبرگشت را تحمل کند. zustand یک استور
 * سطح‌ماژول است و با unmount نمی‌میرد.
 *
 * ⚠️ **چرا `sessionStorage`؟** تا یک reload هم دوام بیاورد ولی با بستن تب
 * پاک شود؛ `localStorage` باعث می‌شد کاربر هفته‌ها بعد تاریخ‌های کهنه ببیند.
 *
 * ⚠️ تاریخ‌ها عمداً به‌شکل رشته‌ی **میلادی** `YYYY-MM-DD` ذخیره می‌شوند (نه
 * `Date` و نه رشته‌ی شمسی): هم JSON-safe است، هم همان قالبی است که API
 * می‌پذیرد، و هم هنگام بازگرداندن با `parseDateParam` به `Date` محلی
 * برمی‌گردد. تبدیل شمسی↔میلادی در `utils/booking.ts` (سمت نمایش) انجام
 * می‌شود، نه اینجا.
 */
export type BookingDraft = {
  cabinId: number;
  /** تاریخ ورود میلادی `YYYY-MM-DD` (خروجی `toDateKey`). */
  checkIn: string | null;
  /** تاریخ خروج میلادی `YYYY-MM-DD`. */
  checkOut: string | null;
  guests: number;
};

type BookingDraftState = {
  draft: BookingDraft | null;
  saveDraft: (draft: BookingDraft) => void;
  clearDraft: () => void;
};

export const useBookingDraftStore = create<BookingDraftState>()(
  persist(
    (set) => ({
      draft: null,
      saveDraft: (draft) => set({ draft }),
      clearDraft: () => set({ draft: null }),
    }),
    {
      name: "horizon.booking-draft",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
