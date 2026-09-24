"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { CABIN_FILTER_KEYS } from "../../utils/cabin-filters";

/** خواندن/نوشتن فیلترهای cabins در URL (بدون پرش اسکرول) */
export function useCabinQuery() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const replace = useCallback(
    (params: URLSearchParams) => {
      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, {
        scroll: false,
      });
    },
    [router, pathname],
  );

  const setParam = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === null || value === "") params.delete(key);
      else params.set(key, value);
      replace(params);
    },
    [searchParams, replace],
  );

  /**
   * به‌روزرسانی دسته‌ای چند پارامتر با یک navigation واحد.
   * برای فیلترهای چندکلیدی (مثل checkIn/checkOut تاریخ) لازم است چون
   * فراخوانی پشت‌سرهم setParam با snapshot قدیمی، تغییر قبلی را گم می‌کند.
   */
  const setParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value === null || value === "") params.delete(key);
        else params.set(key, value);
      }
      replace(params);
    },
    [searchParams, replace],
  );

  const clearFilters = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    for (const key of CABIN_FILTER_KEYS) params.delete(key);
    replace(params);
  }, [searchParams, replace]);

  return { searchParams, setParam, setParams, clearFilters };
}
