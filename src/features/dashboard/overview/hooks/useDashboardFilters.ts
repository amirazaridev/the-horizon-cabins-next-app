"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";

import {
  DEFAULT_COMPARE,
  PARAM_CABIN,
  PARAM_CITY,
  PARAM_COMPARE,
  PARAM_PAYMENT,
  PARAM_STATUS,
  isBookingStatus,
  isPaymentStatus,
  parseCompareParam,
  parseEnumListParam,
  parseNumberListParam,
} from "../constants/dashboard-params";
import { resolveDashboardDateRange } from "../lib/date-range";
import { MS_PER_DAY } from "../lib/metrics/range";
import {
  getDashboardRepository,
  type DashboardSnapshot,
} from "../data";
import type {
  CompareMode,
  DashboardFilters,
} from "../types/dashboard.types";

function readFilters(searchParams: Pick<URLSearchParams, "get">): DashboardFilters {
  const { from, to } = resolveDashboardDateRange(searchParams);

  const numDays = Math.max(
    1,
    Math.round((to.getTime() - from.getTime()) / MS_PER_DAY) + 1,
  );

  return {
    from,
    to,
    numDays,

    cities: parseNumberListParam(searchParams.get(PARAM_CITY)),
    cabinIds: parseNumberListParam(searchParams.get(PARAM_CABIN)),
    statuses: parseEnumListParam(searchParams.get(PARAM_STATUS), isBookingStatus),
    paymentStatuses: parseEnumListParam(
      searchParams.get(PARAM_PAYMENT),
      isPaymentStatus,
    ),

    compare: parseCompareParam(searchParams.get(PARAM_COMPARE)),
  };
}

export interface UseDashboardFiltersResult {
  /** فیلترهای تایپ‌شده که از URL مشتق شده‌اند */
  filters: DashboardFilters;
  /** snapshot کامل داده — تا وقتی اولین بارگذاری تمام نشده `null` است */
  snapshot: DashboardSnapshot | null;
  /** آیا داده‌ی مطابق فیلتر فعلی هنوز آماده نیست؟ */
  isLoading: boolean;
  /** خطای بارگذاری (اگر رخ دهد) */
  error: Error | null;
  /** زمان آخرین بارگذاری **موفق** — برای نشانگر تازگی داده */
  updatedAt: Date | null;
  /** بازخوانی اجباری snapshot فعلی (بدون تغییر فیلترها) */
  refresh: () => void;
}

/** وضعیت داخلی بارگذاری — یک‌جا نگه داشته می‌شود تا setState تکه‌تکه نشود. */
interface LoadState {
  /** کلیدی که `snapshot`/`error` مربوط به آن است */
  key: string | null;
  snapshot: DashboardSnapshot | null;
  error: Error | null;
  /** زمان آخرین موفقیت برای همان `key` */
  updatedAt: Date | null;
}

const INITIAL_LOAD_STATE: LoadState = {
  key: null,
  snapshot: null,
  error: null,
  updatedAt: null,
};

export function useDashboardFilters(): UseDashboardFiltersResult {
  const searchParams = useSearchParams();

  const filters = useMemo(() => readFilters(searchParams), [searchParams]);

  // کلید قطعی و قابل مقایسه برای کنترل تکرار بارگذاری
  const filtersKey = useMemo(
    () =>
      [
        filters.from.toISOString(),
        filters.to.toISOString(),
        filters.cities.join("."),
        filters.cabinIds.join("."),
        filters.statuses.join("."),
        filters.paymentStatuses.join("."),
        filters.compare,
      ].join("|"),
    [filters],
  );

  const [state, setState] = useState<LoadState>(INITIAL_LOAD_STATE);

  const [refreshToken, setRefreshToken] = useState(0);

  const requestIdRef = useRef(0);

  useEffect(() => {
    const requestId = ++requestIdRef.current;
    const repository = getDashboardRepository();

    let cancelled = false;

    repository
      .getSnapshot(filters)
      .then((next) => {
        if (cancelled || requestId !== requestIdRef.current) return;
        setState({
          key: filtersKey,
          snapshot: next,
          error: null,
          updatedAt: new Date(),
        });
      })
      .catch((cause: unknown) => {
        if (cancelled || requestId !== requestIdRef.current) return;
        setState({
          key: filtersKey,
          snapshot: null,
          error:
            cause instanceof Error
              ? cause
              : new Error("بارگذاری دادهٔ داشبورد ناموفق بود."),
          updatedAt: null,
        });
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtersKey, refreshToken]);

  const isLoading = state.key !== filtersKey;

  const refresh = useCallback(() => {
    setRefreshToken((token) => token + 1);
  }, []);

  return {
    filters,
    snapshot: state.snapshot,
    isLoading,
    error: state.error,
    updatedAt: state.updatedAt,
    refresh,
  };
}

/** پیش‌فرض مقایسه — برای استفاده در UI (سوییچ مقایسه). */
export { DEFAULT_COMPARE };
export type { CompareMode };
