"use client";

import { useCallback, useMemo } from "react";

import { useSearchStore } from "../store/search.store";
import type { SearchController } from "../types/search.types";

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
  const setDates = useSearchStore((state) => state.setDates);
  const setGuests = useSearchStore((state) => state.setGuests);
  const setMaxPrice = useSearchStore((state) => state.setMaxPrice);
  const setFilters = useSearchStore((state) => state.setFilters);
  const apply = useSearchStore((state) => state.apply);
  const reset = useSearchStore((state) => state.reset);

  const setField = useCallback(
    <K extends keyof typeof draft>(key: K, value: (typeof draft)[K]) => {
      switch (key) {
        case "destination":
          setDestination(value as (typeof draft)["destination"]);
          break;
        case "checkIn":
          setDates(value as Date | null, draft.checkOut);
          break;
        case "checkOut":
          setDates(draft.checkIn, value as Date | null);
          break;
        case "guests":
          setGuests(value as number | null);
          break;
        case "maxPrice":
          setMaxPrice(value as number | null);
          break;
        default:
          setFilters({ [key]: value } as never);
      }
    },
    [draft.checkIn, draft.checkOut, setDestination, setDates, setGuests, setMaxPrice, setFilters],
  );

  return useMemo(
    () => ({ draft, applied, setField, setFilters, apply, reset }),
    [draft, applied, setField, setFilters, apply, reset],
  );
}
