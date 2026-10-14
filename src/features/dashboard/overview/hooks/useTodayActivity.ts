"use client";

import { useCallback, useState } from "react";

import { getDashboardRepository } from "../data";
import type { DashboardBooking } from "../types/dashboard.types";

export type TodayActionKind = "checkIn" | "checkOut";

export interface UseTodayActivityResult {
  pendingId: number | null;
  /** متن خطای آخرین عملیات (یا `null`) */
  error: string | null;
  run: (
    bookingId: number,
    kind: TodayActionKind,
    onSuccess?: (booking: DashboardBooking) => void,
  ) => Promise<void>;
  /** پاک‌کردن خطا */
  clearError: () => void;
}

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
