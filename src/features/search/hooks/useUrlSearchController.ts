"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";

import { useUrlQuery, type RawSearchParams } from "@/hooks/useUrlQuery";
import { useSearchStore } from "@/features/search/store/search.store";
import { EMPTY_SEARCH_FILTERS } from "@/features/search/constants/search-defaults";
import type {
  SearchController,
  SearchFilters,
} from "@/features/search/types/search.types";
import {
  rescaleBudgetOnDateChange,
} from "@/features/search/utils/budget";
import {
  SEARCH_PARAM_KEYS,
  parseSearchFilters,
  searchFiltersToQueryString,
  serializeSearchFiltersForUpdate,
} from "@/features/search/utils/search-params";

export function useUrlSearchController(
  searchParams: RawSearchParams,
): SearchController {
  const { setParams, clearParams } = useUrlQuery(searchParams);
  const resetStore = useSearchStore((state) => state.reset);

  //* ناوبری داخل `startTransition` می‌رود تا `isPending` تا رندر شدن نتایج جدید true بماند و UI بتواند spinner نشان دهد.
  const [isPending, startTransition] = useTransition();

  const applied = useMemo(
    () => parseSearchFilters(searchParams),
    [searchParams],
  );
  const appliedKey = searchFiltersToQueryString(applied);

  const [draft, setDraft] = useState<SearchFilters>(applied);
  const [syncedKey, setSyncedKey] = useState(appliedKey);

  //* هم‌گام‌سازی draft با URL — با الگوی رسمی React («تنظیم state هنگام تغییر prop») و بدون effect. اگر کاربر پارامتری را از URL حذف کند، اینجا draft هم‌گام می‌شود.
  if (syncedKey !== appliedKey) {
    setSyncedKey(appliedKey);
    setDraft(applied);
  }

  //* هیدریت یک‌باره‌ی استور برای تداوم ناوبری (مثلاً باز شدن مستقیم لینک)
  const hydrated = useRef(false);
  useEffect(() => {
    if (hydrated.current) return;
    hydrated.current = true;
    const store = useSearchStore.getState();
    if (appliedKey && !searchFiltersToQueryString(store.applied)) {
      store.setFilters(applied);
      store.apply();
    }
  }, [applied, appliedKey]);

  const setField = useCallback(
    <K extends keyof SearchFilters>(key: K, value: SearchFilters[K]) => {
      setDraft((prev) => {
        if (key === "checkIn" || key === "checkOut") {
          return rescaleBudgetOnDateChange(
            prev,
            key,
            value as Date | null,
          );
        }

        return { ...prev, [key]: value };
      });
    },
    [],
  );

  const setFilters = useCallback((patch: Partial<SearchFilters>) => {
    setDraft((prev) => ({ ...prev, ...patch }));
  }, []);

  //* `patch` برای «اعمال اتمیک» است: `setDraft` (مثل هر setState) در همان تیک اعمال نمی‌شود، پس اگر دوباره `draft` کهنه را سریال می‌کردیم آخرین انتخاب کاربر (مثلاً بودجه‌ی تازه‌کشیده) از URL می‌افتاد.
  const apply = useCallback(
    (patch?: Partial<SearchFilters>) => {
      const next = patch ? { ...draft, ...patch } : draft;
      if (patch) setDraft(next);
      startTransition(() => {
        setParams(serializeSearchFiltersForUpdate(next));
      });
    },
    [setParams, draft],
  );

  //* فقط draft؛ نتایج/URL پشت شیت دست‌نخورده می‌ماند
  const resetDraft = useCallback(() => {
    setDraft(EMPTY_SEARCH_FILTERS);
  }, []);

  const reset = useCallback(() => {
    setDraft(EMPTY_SEARCH_FILTERS);
    resetStore();
    startTransition(() => {
      clearParams(SEARCH_PARAM_KEYS);
    });
  }, [clearParams, resetStore]);

  return useMemo(
    () => ({
      draft,
      applied,
      setField,
      setFilters,
      apply,
      reset,
      resetDraft,
      isPending,
    }),
    [
      draft,
      applied,
      setField,
      setFilters,
      apply,
      reset,
      resetDraft,
      isPending,
    ],
  );
}
