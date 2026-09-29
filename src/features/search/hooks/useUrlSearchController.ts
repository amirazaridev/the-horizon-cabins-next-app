"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { useUrlQuery, type RawSearchParams } from "@/hooks/useUrlQuery";
import { useSearchStore } from "../store/search.store";
import {
  EMPTY_SEARCH_FILTERS,
  type SearchController,
  type SearchFilters,
} from "../types/search.types";
import {
  SEARCH_PARAM_KEYS,
  parseSearchFilters,
  searchFiltersToQueryString,
  serializeSearchFiltersForUpdate,
} from "../utils/search-params";

/**
 * کنترلر سرچ بر پایه‌ی URL — برای صفحه‌ی `/cabins`.
 *
 * در این صفحه URL «منبع حقیقت» است:
 *  - مقدار اعمال‌شده همیشه از URL پارس می‌شود،
 *  - draft محلی است و فقط با فشردن «اعمال» در URL نوشته می‌شود،
 *  - اگر کاربر خودش پارامتری را از URL حذف کند، draft با URL هم‌گام می‌شود.
 *
 * هیچ حلقه‌ی دوطرفه‌ی Store ↔ URL وجود ندارد؛ جریان یک‌طرفه است.
 */
export function useUrlSearchController(
  searchParams: RawSearchParams,
): SearchController {
  const { setParams, clearParams } = useUrlQuery(searchParams);
  const resetStore = useSearchStore((state) => state.reset);

  const applied = useMemo(
    () => parseSearchFilters(searchParams),
    [searchParams],
  );
  const appliedKey = searchFiltersToQueryString(applied);

  const [draft, setDraft] = useState<SearchFilters>(applied);
  const [syncedKey, setSyncedKey] = useState(appliedKey);

  /*
   * هم‌گام‌سازی draft با URL — با الگوی رسمی React
   * («تنظیم state هنگام تغییر prop») و بدون effect.
   * اگر کاربر خودش پارامتری را از URL حذف کند، اینجا draft با URL
   * هم‌گام می‌شود؛ و هیچ حلقه‌ی Store ↔ URL ساخته نمی‌شود.
   */
  if (syncedKey !== appliedKey) {
    setSyncedKey(appliedKey);
    setDraft(applied);
  }

  /* هیدریت یک‌باره‌ی استور برای تداوم ناوبری (مثلاً باز شدن مستقیم لینک) */
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
      setDraft((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const setFilters = useCallback((patch: Partial<SearchFilters>) => {
    setDraft((prev) => ({ ...prev, ...patch }));
  }, []);

  const apply = useCallback(() => {
    setParams(serializeSearchFiltersForUpdate(draft));
  }, [setParams, draft]);

  const reset = useCallback(() => {
    setDraft(EMPTY_SEARCH_FILTERS);
    resetStore();
    clearParams(SEARCH_PARAM_KEYS);
  }, [clearParams, resetStore]);

  return useMemo(
    () => ({ draft, applied, setField, setFilters, apply, reset }),
    [draft, applied, setField, setFilters, apply, reset],
  );
}
