"use client";

import { useCallback, useMemo } from "react";

import { useSearchStore } from "../store/search.store";
import type { SearchController, SearchFilters } from "../types/search.types";
import { nightsBetween, rescaleBudgetBetween } from "../utils/budget";

/**
 * کنترلر سرچ روی استور گلوبال — برای صفحه‌ی لندینگ.
 *
 * کامپوننت‌های مصرف‌کننده فقط `SearchController` را می‌بینند و
 * نمی‌دانند پشت آن Zustand است یا URL.
 */
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

  /**
   * ⭐ تاریخ‌ها از `setFilters` رد می‌شوند (ادغام **تابعی** روی آخرین draft
   * استور)، نه از `setDates` با مقدار جفتِ خوانده‌شده از closure.
   *
   * چرا؟ پنل تقویم با هر انتخابِ بازه، **دو** فراخوانی پشت‌سرهم می‌زند:
   * اول `checkIn` و بعد `checkOut`. نسخه‌ی قبلی `setDates(value, draft.checkOut)`
   * بود؛ اما `draft` در closure همان رندرِ قبلی قفل شده است و در همان تیک،
   * هر دو فراخوانی همان مقدار کهنه را می‌خوانند. نتیجه: فراخوانی دوم ورودِ
   * کهنه (null) را برمی‌گرداند و در نهایت فقط «خروج» ثبت می‌شد.
   *
   * `setFilters` روی آخرین وضعیت استور ادغام می‌کند، پس ترتیب فراخوانی‌ها
   * بی‌اهمیت است و هر دو تاریخ درست می‌نشینند.
   */
  const setField = useCallback(
    <K extends keyof SearchFilters>(key: K, value: SearchFilters[K]) => {
      switch (key) {
        case "destination":
          setDestination(value as SearchFilters["destination"]);
          break;
        case "checkIn":
        case "checkOut": {
          /*
           * بودجه یک مقدار است با دو معنا (هر شب / کل سفر)؛ با تغییر تاریخ
           * تعداد شب عوض می‌شود و مقدار باید مقیاس بگیرد تا قصد «هر شب»
           * کاربر حفظ شود (۵–۱۰ م/شب × ۳ شب ← ۱۵–۳۰ م کل).
           *
           * مقدار قبلی از **آخرین draft استور** خوانده می‌شود، نه از closure
           * این رندر؛ چون پنل تقویم با هر انتخابِ بازه دو فراخوانی پشت‌سرهم
           * (checkIn و بعد checkOut) می‌زند و closure کهنه می‌شود.
           */
          const prev = useSearchStore.getState().draft;
          const next = { ...prev, [key]: value } as SearchFilters;
          setFilters({
            [key]: value,
            budget: rescaleBudgetBetween(
              nightsBetween(prev.checkIn, prev.checkOut),
              nightsBetween(next.checkIn, next.checkOut),
              next.budget,
            ),
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
