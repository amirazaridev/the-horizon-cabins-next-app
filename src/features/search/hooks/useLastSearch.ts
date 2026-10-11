"use client";

import { useEffect, useMemo, useSyncExternalStore } from "react";

import {
  clearLastSearch,
  getLastSearchQuery,
  getServerLastSearchQuery,
  saveLastSearchQuery,
  subscribeLastSearch,
} from "@/features/search/services/recent-search.storage";
import type { SearchFilters } from "@/features/search/types/search.types";
import {
  parseSearchFilters,
  searchFiltersToQueryString,
} from "@/features/search/utils/search-params";

//* ذخیره‌ی خودکار آخرین جستجوی اعمال‌شده. این افکت فقط یک «سیستم خارجی» (localStorage) را به‌روز می‌کند و هیچ setState ندارد؛ پس نه رندر آبشاری می‌سازد و نه با StrictMode تعارض دارد.
export function usePersistLastSearch(filters: SearchFilters): void {
  const query = searchFiltersToQueryString(filters);

  useEffect(() => {
    if (!query) return;
    saveLastSearchQuery(query);
  }, [query]);
}

export type LastSearchState = {
  //* آخرین جستجوی ذخیره‌شده (null یعنی چیزی ذخیره نشده)
  lastSearch: SearchFilters | null;
  //* حذف آخرین جستجو از حافظه
  dismiss: () => void;
};

//* خواندن آخرین جستجو از حافظه با `useSyncExternalStore` (روش استاندارد استور خارجی): رندر سرور خالی است، بعد از hydration مقدار واقعی می‌آید، و هر تغییر حافظه (همین تب یا تب دیگر) خودکار به‌روز می‌شود.
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
