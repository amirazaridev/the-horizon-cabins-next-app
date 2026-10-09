"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from "react";

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
import { nightsBetween, rescaleBudgetBetween } from "../utils/budget";

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

  /*
   * ناوبری داخل `startTransition` می‌رود تا `isPending` تا لحظه‌ی
   * رندر شدن نتایج جدید true بماند و UI بتواند spinner نشان دهد.
   */
  const [isPending, startTransition] = useTransition();

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
      setDraft((prev) => {
        const next = { ...prev, [key]: value };

        /*
         * بودجه یک مقدار است با دو معنا (هر شب / کل سفر)؛ با تغییر تاریخ
         * تعداد شب عوض می‌شود و مقدار باید مقیاس بگیرد تا قصد «هر شب»
         * کاربر حفظ شود. چون به‌روزرسانی تابعی است، `prev` همیشه تازه است و
         * دو فراخوانی پشت‌سرهمِ پنل تقویم (checkIn و بعد checkOut) درست
         * روی هم می‌نشینند.
         */
        if (key === "checkIn" || key === "checkOut") {
          next.budget = rescaleBudgetBetween(
            nightsBetween(prev.checkIn, prev.checkOut),
            nightsBetween(next.checkIn, next.checkOut),
            prev.budget,
          );
        }

        return next;
      });
    },
    [],
  );

  const setFilters = useCallback((patch: Partial<SearchFilters>) => {
    setDraft((prev) => ({ ...prev, ...patch }));
  }, []);

  /**
   * اعمال جستجو روی URL.
   *
   * `patch` اختیاری برای «اعمال اتمیک» است: مقدار تازه‌ی یک پنل باید در
   * همان فراخوانی وارد draft شود، چون `setDraft` (مثل هر setState) در همان
   * تیک اعمال نمی‌شود و اگر دوباره `draft` کهنه را سریال می‌کردیم، آخرین
   * انتخاب کاربر (مثلاً بودجه‌ی تازه‌کشیده) از URL می‌افتاد.
   */
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

  /** فقط draft؛ نتایج/URL پشت شیت دست‌نخورده می‌ماند */
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
