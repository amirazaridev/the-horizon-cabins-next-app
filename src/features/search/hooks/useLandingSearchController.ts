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

  const setField = useCallback(
    <K extends keyof SearchFilters>(key: K, value: SearchFilters[K]) => {
      switch (key) {
        case "destination":
          setDestination(value as SearchFilters["destination"]);
          break;
        case "checkIn":
        case "checkOut": {
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
