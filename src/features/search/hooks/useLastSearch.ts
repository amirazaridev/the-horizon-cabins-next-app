"use client";

import { useEffect, useMemo, useSyncExternalStore } from "react";

import {
  clearLastSearch,
  getLastSearchQuery,
  getServerLastSearchQuery,
  saveLastSearchQuery,
  subscribeLastSearch,
} from "../services/recent-search.storage";
import type { SearchFilters } from "../types/search.types";
import {
  parseSearchFilters,
  searchFiltersToQueryString,
} from "../utils/search-params";

/**
 * ذخیره‌ی خودکار آخرین جستجوی اعمال‌شده.
 *
 * این افکت فقط یک «سیستم خارجی» (localStorage) را به‌روز می‌کند و هیچ
 * setState‌ای ندارد؛ پس نه رندر آبشاری می‌سازد و نه با StrictMode تعارض دارد.
 * چون کلید ذخیره‌سازی یک رشته‌ی پایدار است، وابستگی افکت دقیقاً معادل
 * «تغییر واقعی فیلترها» است و نوشتن تکراری رخ نمی‌دهد.
 */
export function usePersistLastSearch(filters: SearchFilters): void {
  const query = searchFiltersToQueryString(filters);

  useEffect(() => {
    if (!query) return;
    saveLastSearchQuery(query);
  }, [query]);
}

export type LastSearchState = {
  /** آخرین جستجوی ذخیره‌شده (null یعنی چیزی ذخیره نشده) */
  lastSearch: SearchFilters | null;
  /** حذف آخرین جستجو از حافظه */
  dismiss: () => void;
};

/**
 * خواندن آخرین جستجو از حافظه.
 *
 * از `useSyncExternalStore` استفاده می‌کند (روش استاندارد React برای
 * استورهای خارجی): رندر سرور خالی است، بعد از hydration مقدار واقعی
 * می‌آید، و هر تغییر حافظه (ذخیره/حذف در همین تب یا تب دیگر) باعث
 * به‌روزرسانی خودکار می‌شود.
 */
export function useLastSearch(): LastSearchState {
  const query = useSyncExternalStore(
    subscribeLastSearch,
    getLastSearchQuery,
    getServerLastSearchQuery,
  );

  const lastSearch = useMemo(
    () => (query ? parseSearchFilters(new URLSearchParams(query)) : null),
    [query],
  );

  return { lastSearch, dismiss: clearLastSearch };
}
