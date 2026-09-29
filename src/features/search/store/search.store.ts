"use client";

/**
 * استور گلوبال «جستجوی هسته».
 *
 * فقط پنج مقدار در اینجا نگه داشته می‌شود:
 *   destination · checkIn · checkOut · guests · budget
 *
 * فیلترهای پیشرفته‌ی /cabins (اتاق خواب، امکانات، صفحه) عمداً اینجا
 * نیستند؛ آن‌ها در URL همان صفحه زندگی می‌کنند.
 *
 * دو نسخه‌ی مقدار نگه داشته می‌شود:
 *   draft   → چیزی که کاربر در حال ویرایش است (هیچ fetchی نمی‌زند)
 *   applied → چیزی که تأیید شده و مبنای پیش‌نمایش است
 *
 * هیچ persistence‌ای روی خود استور نیست؛ عمرش فقط تا زنده‌بودن تب است و
 * نقشش «تداوم ناوبری» است. ذخیره‌ی «آخرین جستجو» یک فیچر جداگانه است
 * (`services/recent-search.storage.ts`) و به این استور گره نخورده.
 */

import { create } from "zustand";

import {
  EMPTY_SEARCH_FILTERS,
  type SearchFilters,
} from "../types/search.types";

type SearchStoreState = {
  draft: SearchFilters;
  applied: SearchFilters;

  setDestination: (destination: SearchFilters["destination"]) => void;
  setDates: (checkIn: Date | null, checkOut: Date | null) => void;
  setGuests: (guests: number | null) => void;
  setBudget: (budget: SearchFilters["budget"]) => void;

  /** به‌روزرسانی یک‌جای چند فیلد draft */
  setFilters: (patch: Partial<SearchFilters>) => void;

  /** تأیید draft و تبدیل آن به مبنای fetch پیش‌نمایش */
  apply: () => void;

  /** پاک‌کردن کامل (draft + applied) */
  reset: () => void;
};

export const useSearchStore = create<SearchStoreState>((set) => ({
  draft: EMPTY_SEARCH_FILTERS,
  applied: EMPTY_SEARCH_FILTERS,

  setDestination: (destination) =>
    set((state) => ({ draft: { ...state.draft, destination } })),

  setDates: (checkIn, checkOut) =>
    set((state) => ({ draft: { ...state.draft, checkIn, checkOut } })),

  setGuests: (guests) =>
    set((state) => ({ draft: { ...state.draft, guests } })),

  setBudget: (budget) =>
    set((state) => ({ draft: { ...state.draft, budget } })),

  setFilters: (patch) =>
    set((state) => ({ draft: { ...state.draft, ...patch } })),

  apply: () => set((state) => ({ applied: { ...state.draft } })),

  reset: () =>
    set({ draft: EMPTY_SEARCH_FILTERS, applied: EMPTY_SEARCH_FILTERS }),
}));
