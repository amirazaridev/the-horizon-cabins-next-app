"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { cabinSearchRepository } from "../services";
import type { Cabin } from "@/features/cabins/types/cabin.types";
import {
  SEARCH_PREVIEW_LIMIT,
  type SearchFilters,
} from "../types/search.types";
import {
  hasAnySearchFilter,
  searchFiltersToQueryString,
  toCabinSearchQuery,
} from "../utils/search-params";

export type SearchPreviewStatus =
  | "idle"
  | "loading"
  | "success"
  | "empty"
  | "error";

export type SearchPreviewState = {
  status: SearchPreviewStatus;
  cabins: Cabin[];
  total: number;
  source: "mock" | "api";
  /** برای دکمه‌ی «تلاش دوباره» در حالت خطا */
  retry: () => void;
};

/**
 * گرفتن پیش‌نمایش نتایج بر اساس مقدار «اعمال‌شده».
 *
 * نکات مهم:
 *  - هرگز روی draft صدا زده نمی‌شود (فقط applied).
 *  - کشیدن اسلایدر بودجه هیچ درخواستی تولید نمی‌کند.
 *  - هر تغییر مقدار، درخواست قبلی را بی‌اثر می‌کند (جلوگیری از race).
 *
 * ⚠️ هیچ «گارد تکراری‌بودن درخواست» جداگانه‌ای (ref) اینجا نیست.
 * وابستگی افکت (`key`) خودش دقیقاً معادل تغییر واقعی فیلترهاست. اگر گارد
 * ref می‌گذاشتیم، در حالت StrictMode که React افکت را دوبار اجرا می‌کند،
 * بار دوم زودهنگام return می‌شد و وضعیت برای همیشه روی «loading» گیر می‌کرد
 * (باگ «گیرکردن سکشن بعد از بازگشت به صفحه»).
 */
export function useSearchPreview(
  filters: SearchFilters,
  limit: number = SEARCH_PREVIEW_LIMIT,
): SearchPreviewState {
  const [status, setStatus] = useState<SearchPreviewStatus>("idle");
  const [cabins, setCabins] = useState<Cabin[]>([]);
  const [total, setTotal] = useState(0);
  const [source, setSource] = useState<"mock" | "api">("mock");
  const [retryToken, setRetryToken] = useState(0);

  /**
   * تازه‌ترین فیلترها برای افکت fetch.
   * این افکت قبل از افکت پایین تعریف شده تا همیشه اول اجرا شود
   * (ترتیب اجرای effectها درون یک کامپوننت تضمین‌شده است).
   */
  const filtersRef = useRef(filters);
  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

  const key = searchFiltersToQueryString(filters);

  useEffect(() => {
    const current = filtersRef.current;

    if (!hasAnySearchFilter(current)) {
      setStatus("idle");
      setCabins([]);
      setTotal(0);
      return;
    }

    let cancelled = false;
    setStatus("loading");

    cabinSearchRepository
      .search(toCabinSearchQuery(current, limit))
      .then((result) => {
        if (cancelled) return;
        setCabins(result.cabins);
        setTotal(result.total);
        setSource(result.source);
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
  }, [key, limit, retryToken]);

  const retry = useCallback(() => setRetryToken((token) => token + 1), []);

  return { status, cabins, total, source, retry };
}
