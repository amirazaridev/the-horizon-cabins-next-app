"use client";

import { useEffect, type ReactNode } from "react";
import toast from "react-hot-toast";

type Props = {
  /** متن آماده‌ی هشدار (شامل فهرست فیلدهای ناقص). */
  message: string;
};

/**
 * توست «اطلاعات باید تکمیل شود» — یک‌بار و بعد از رسیدن به صفحه‌ی تنظیمات.
 *
 * ⚠️ چرا کامپوننت جدا و کلاینتی؟ توست یک side effect کلاینتی است و صفحه‌ی
 * تنظیمات یک Server Component است؛ این پوسته‌ی کوچک همان یک کار را می‌کند.
 *
 * ⚠️ `id` ثابت است تا اگر کاربر چند بار بین ویلا و تنظیمات رفت‌وبرگشت کند،
 * چند توست روی هم باز نشود و فقط همان یکی تازه شود.
 */
export default function BookingProfileToast({ message }: Props): ReactNode {
  useEffect(() => {
    toast.error(message, { duration: 7000, id: "booking-profile-required" });
  }, [message]);

  return null;
}
