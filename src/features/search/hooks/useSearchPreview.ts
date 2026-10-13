"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import type { Cabin } from "@/features/cabins/types/cabin.types";
import { cabinSearchRepository } from "@/features/search/services";
import { SEARCH_PREVIEW_LIMIT } from "@/features/search/constants/search-limits";
import type { SearchFilters } from "@/features/search/types/search.types";
import {
  hasAnySearchFilter,
  searchFiltersToQueryString,
} from "@/features/search/utils/search-params";

export type SearchPreviewStatus =
  | "idle"
  | "loading"
  | "success"
  | "empty"
  | "error";

export type SearchPreviewState = {
  status: SearchPreviewStatus;
  cabins: Cabin[];
  //* تعداد کل نتایج پس از فیلتر (از `meta.totalItems`)، نه طول آرایه
  total: number;
  //* برای دکمه‌ی «تلاش دوباره» در حالت خطا
  retry: () => void;
};


export function useSearchPreview(
  filters: SearchFilters,
  limit: number = SEARCH_PREVIEW_LIMIT,
  token: number = 0,
): SearchPreviewState {
  const [status, setStatus] = useState<SearchPreviewStatus>("idle");
  const [cabins, setCabins] = useState<Cabin[]>([]);
  const [total, setTotal] = useState(0);
  const [retryToken, setRetryToken] = useState(0);

  //* تازه‌ترین فیلترها برای افکت fetch. این افکت قبل از افکت پایین تعریف شده تا همیشه اول اجرا شود (ترتیب اجرای effectها تضمین‌شده است).
  const filtersRef = useRef(filters);
  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

  const key = searchFiltersToQueryString(filters);

  useEffect(() => {
    const current = filtersRef.current;

    if (!hasAnySearchFilter(current) && token === 0) {
      setStatus("idle");
      setCabins([]);
      setTotal(0);
      return;
    }

    let cancelled = false;
    setStatus("loading");

    cabinSearchRepository
      .search(current, limit)
      .then((result) => {
        if (cancelled) return;
        setCabins(result.cabins);
        setTotal(result.total);
        setStatus(result.cabins.length > 0 ? "success" : "empty");
      })
      .catch(() => {
        if (cancelled) return;
        setCabins([]);
        setTotal(0);
        setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, [key, limit, token, retryToken]);

  const retry = useCallback(() => setRetryToken((token) => token + 1), []);

  return { status, cabins, total, retry };
}
