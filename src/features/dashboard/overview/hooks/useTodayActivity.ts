"use client";

import { useCallback, useState } from "react";

import { getDashboardRepository } from "../data";
import type { DashboardBooking } from "../types/dashboard.types";

/* ==========================================================================
   اکشن‌های عملیاتی امروز (check-in / check-out)
   ========================================================================== */

export type TodayActionKind = "checkIn" | "checkOut";

export interface UseTodayActivityResult {
  /**
   * رزرو در حال انجام عملیات روی آن (یا `null`).
   * ⚠️ فقط **یک** عملیات هم‌زمان — برای جلوگیری از کلیک تکراری و
   * نمایش صحیح دکمه‌ی loading.
   */
  pendingId: number | null;
  /** متن خطای آخرین عملیات (یا `null`) */
  error: string | null;
  /**
   * اجرای عملیات.
   *
   * @param bookingId شناسه‌ی رزرو
   * @param kind نوع عملیات
   * @param onSuccess callback بعد از موفقیت — برای به‌روزرسانی UI
   *   (optimistic) توسط والد.
   *
   * ⚠️ در بک‌اند واقعی این تابع به Server Action → `PATCH /bookings/:id/status`
   * نگاشت می‌شود. اینجا فقط روی mock in-memory عمل می‌کند.
   */
  run: (
    bookingId: number,
    kind: TodayActionKind,
    onSuccess?: (booking: DashboardBooking) => void,
  ) => Promise<void>;
  /** پاک‌کردن خطا */
  clearError: () => void;
}

/**
 * هوک عملیات امروز — check-in/check-out با مدیریت loading و خطا.
 *
 * ⚠️ این هوک **داده را نگه نمی‌دارد**؛ فقط عملیات را اجرا می‌کند و
 * نتیجه را به `onSuccess` می‌دهد. مالکیت stateِ لیست رزروها با والد است
 * (repository منبع حقیقت است، ولی UI برای واکنش فوری یک کپی محلی دارد).
 */
export function useTodayActivity(): UseTodayActivityResult {
  const [pendingId, setPendingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const run = useCallback<UseTodayActivityResult["run"]>(
    async (bookingId, kind, onSuccess) => {
      setError(null);
      setPendingId(bookingId);

      try {
        const repository = getDashboardRepository();
        const updated =
          kind === "checkIn"
            ? await repository.checkIn(bookingId)
            : await repository.checkOut(bookingId);

        onSuccess?.(updated);
      } catch (cause: unknown) {
        setError(
          cause instanceof Error
            ? cause.message
            : "عملیات انجام نشد. دوباره تلاش کنید.",
        );
      } finally {
        setPendingId(null);
      }
    },
    [],
  );

  const clearError = useCallback(() => setError(null), []);

  return { pendingId, error, run, clearError };
}
