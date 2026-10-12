"use client";

import { useCallback, useMemo } from "react";

import { useSearchStore } from "@/features/search/store/search.store";
import type {
  SearchController,
  SearchFilters,
} from "@/features/search/types/search.types";
import {
  rescaleBudgetOnDateChange,
} from "@/features/search/utils/budget";

//* کنترلر سرچ روی استور گلوبال — برای صفحه‌ی لندینگ. مصرف‌کننده‌ها فقط `SearchController` را می‌بینند و نمی‌دانند پشتش Zustand است یا URL.
export function useLandingSearchController(): SearchController {
  const draft = useSearchStore((state) => state.draft);
  const applied = useSearchStore((state) => state.applied);

  const setDestination = useSearchStore((state) => state.setDestination);
  const setGuests = useSearchStore((state) => state.setGuests);
  const setBudget = useSearchStore((state) => state.setBudget);
  const setFilters = useSearchStore((state) => state.setFilters);
  const apply = useSearchStore((state) => state.apply);
  const reset = useSearchStore((state) => state.reset);
  const resetDraft = useSearchStore((state) => state.resetDraft);

  //* ⭐ تاریخ‌ها از `setFilters` (ادغام **تابعی** روی آخرین draft استور) رد می‌شوند، نه از یک متد جفت‌مقدار با مقادیر خوانده‌شده از closure.
  //* چرا؟ پنل تقویم با هر انتخابِ بازه **دو** فراخوانی پشت‌سرهم می‌زند (اول `checkIn` و بعد `checkOut`)؛ با `draft` قفل‌شده در closure، هر دو فراخوانی مقدار کهنه می‌خوانند و در نهایت فقط «خروج» ثبت می‌شد.
  const setField = useCallback(
    <K extends keyof SearchFilters>(key: K, value: SearchFilters[K]) => {
      switch (key) {
        case "destination":
          setDestination(value as SearchFilters["destination"]);
          break;
        case "checkIn":
        case "checkOut": {
          //* بودجه یک مقدار با دو معناست (هر شب / کل سفر)؛ با تغییر تعداد شب باید مقیاس بگیرد تا قصد «هر شب» حفظ شود (۵–۱۰ م/شب × ۳ شب ← ۱۵–۳۰ م کل).
          //* مقدار قبلی از **آخرین draft استور** خوانده می‌شود، نه از closure این رندر؛ منطق مشترک در `rescaleBudgetOnDateChange`.
          const prev = useSearchStore.getState().draft;
          const next = rescaleBudgetOnDateChange(prev, key, value as Date | null);
          setFilters({
            [key]: next[key],
            budget: next.budget,
          } as Partial<SearchFilters>);
          break;
        }
        case "guests":
          setGuests(value as number | null);
          break;
        case "budget":
          setBudget(value as SearchFilters["budget"]);
          break;
        default:
          setFilters({ [key]: value } as Partial<SearchFilters>);
      }
    },
    [setDestination, setGuests, setBudget, setFilters],
  );

  return useMemo(
    () => ({ draft, applied, setField, setFilters, apply, reset, resetDraft }),
    [draft, applied, setField, setFilters, apply, reset, resetDraft],
  );
}
