"use client";

/**
 * استور گلوبال «جستجوی هسته».
 *
 * فقط پنج مقدار در اینجا نگه داشته می‌شود:
 *   destination · checkIn · checkOut · guests · maxPrice
 *
 * فیلترهای پیشرفته‌ی /cabins (اتاق خواب، سرویس، امکانات، بازه‌ی قیمت، صفحه)
 * عمداً اینجا نیستند؛ آن‌ها در URL همان صفحه زندگی می‌کنند.
 *
 * دو نسخه‌ی مقدار نگه داشته می‌شود:
 *   draft   → چیزی که کاربر در حال ویرایش است (هیچ fetchی نمی‌زند)
 *   applied → چیزی که تأیید شده و مبنای پیش‌نمایش است
 *
 * هیچ persistence‌ای (localStorage/sessionStorage) اضافه نشده؛
 * عمر این استور فقط تا زنده‌بودن تب است و نقشش «تداوم ناوبری» است.
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
  setMaxPrice: (maxPrice: number | null) => void;

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

  setMaxPrice: (maxPrice) =>
    set((state) => ({ draft: { ...state.draft, maxPrice } })),

  setFilters: (patch) =>
    set((state) => ({ draft: { ...state.draft, ...patch } })),

  apply: () => set((state) => ({ applied: { ...state.draft } })),

  reset: () =>
    set({ draft: EMPTY_SEARCH_FILTERS, applied: EMPTY_SEARCH_FILTERS }),
}));
