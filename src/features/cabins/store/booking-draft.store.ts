"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

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
