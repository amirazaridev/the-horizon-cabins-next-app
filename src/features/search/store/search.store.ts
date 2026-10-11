"use client";

import { create } from "zustand";

import { EMPTY_SEARCH_FILTERS } from "@/features/search/constants/search-defaults";
import type { SearchFilters } from "@/features/search/types/search.types";

//* استور گلوبال «جستجوی هسته» — فقط پنج مقدار: destination / checkIn / checkOut / guests / budget.
//* فیلترهای پیشرفته‌ی /cabins (اتاق خواب، امکانات، صفحه) در URL همان صفحه‌اند، نه اینجا.
//* دو نسخه نگه داشته می‌شود: draft (در حال ویرایش، بدون fetch) و applied (تأییدشده، مبنای پیش‌نمایش).
//* بدون persistence؛ عمرش تا زنده‌بودن تب است و «آخرین جستجو» فیچر جداگانه‌ای است.

type SearchStoreState = {
  draft: SearchFilters;
  applied: SearchFilters;
  //* شمارنده‌ی «نسل جستجو». لازم است چون با فیلترهای بدون تغییر کلید کوئری ثابت می‌ماند و دکمه‌ی «جستجو» بی‌اثر می‌شود؛ این شمارنده هر «اعمال» را به یک پرس‌وجوی تازه تبدیل می‌کند.
  appliedToken: number;

  setDestination: (destination: SearchFilters["destination"]) => void;
  setDates: (checkIn: Date | null, checkOut: Date | null) => void;
  setGuests: (guests: number | null) => void;
  setBudget: (budget: SearchFilters["budget"]) => void;

  //* به‌روزرسانی یک‌جای چند فیلد draft
  setFilters: (patch: Partial<SearchFilters>) => void;

  //* تأیید draft و تبدیلش به مبنای fetch پیش‌نمایش
  apply: (patch?: Partial<SearchFilters>) => void;

  //* پاک‌کردن کامل (draft + applied)
  reset: () => void;

  //* فقط draft؛ applied دست‌نخورده می‌ماند
  resetDraft: () => void;
};

export const useSearchStore = create<SearchStoreState>((set) => ({
  draft: EMPTY_SEARCH_FILTERS,
  applied: EMPTY_SEARCH_FILTERS,
  appliedToken: 0,

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

  //* `patch` اختیاری = مقداری که همان لحظه در یک پنل انتخاب شده و باید همراه با اعمال وارد draft شود (دکمه‌ی «اعمال» پنل بودجه).
  apply: (patch) =>
    set((state) => {
      const draft = patch ? { ...state.draft, ...patch } : state.draft;
      return {
        draft,
        applied: { ...draft },
        appliedToken: state.appliedToken + 1,
      };
    }),

  resetDraft: () => set({ draft: EMPTY_SEARCH_FILTERS }),

  //* پاک‌کردن کامل: draft + applied + شمارنده‌ی نسل
  reset: () =>
    set({
      draft: EMPTY_SEARCH_FILTERS,
      applied: EMPTY_SEARCH_FILTERS,
      appliedToken: 0,
    }),
}));
