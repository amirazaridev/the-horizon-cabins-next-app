"use client";

import { usePathname, useRouter } from "next/navigation";
import { useCallback, useRef } from "react";

/** شکل خام searchParams در Server Componentهای Next */
export type RawSearchParams = Record<string, string | string[] | undefined>;

export function toURLSearchParams(sp: RawSearchParams): URLSearchParams {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(sp ?? {})) {
    if (value === undefined) continue;

    if (Array.isArray(value)) {
      for (const item of value) params.append(key, item);
    } else {
      params.set(key, value);
    }
  }

  return params;
}

/**
 * خواندن/نوشتن پارامترهای URL **بدون** `useSearchParams`.
 *
 * مقدار فعلی از props سرور (searchParams) میآید — دقیقاً مثل صفحهٔ /cabins —
 * بنابراین کامپوننت نیازی به bailout سمت کلاینت ندارد.
 *
 * نکته: چون props سرور فقط بعد از کامل شدن navigation بهروز میشود، آخرین
 * query stringـی که خودمان push کردهایم در یک ref نگه داشته میشود. این کار
 * از گم شدن تغییر جلوگیری میکند وقتی کاربر پشتسرهم روی چند فیلتر کلیک میکند
 * (باگی که در نسخهٔ قبلیِ داشبورد وجود داشت).
 */
export function useUrlQuery(searchParams: RawSearchParams) {
  const router = useRouter();
  const pathname = usePathname();
  const pendingRef = useRef<string | null>(null);

  const readBase = useCallback((): URLSearchParams => {
    const fromProps = toURLSearchParams(searchParams).toString();
    const pending = pendingRef.current;

    // سرور بهروز شده (یا هنوز چیزی push نکردهایم) => props معتبر است
    if (pending === null || pending === fromProps) {
      pendingRef.current = null;
      return new URLSearchParams(fromProps);
    }

    // سرور هنوز عقب است => از آخرین مقداری که خودمان فرستادیم ادامه بده
    return new URLSearchParams(pending);
  }, [searchParams]);

  const commit = useCallback(
    (params: URLSearchParams) => {
      const query = params.toString();
      pendingRef.current = query;
      router.replace(query ? `${pathname}?${query}` : pathname, {
        scroll: false,
      });
    },
    [router, pathname],
  );

  /** بهروزرسانی دستهای چند پارامتر با یک navigation واحد */
  const setParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = readBase();

      for (const [key, value] of Object.entries(updates)) {
        if (value === null || value === "") params.delete(key);
        else params.set(key, value);
      }

      // تغییر فیلتر باید به صفحهٔ اول برگردد
      params.delete("page");

      commit(params);
    },
    [readBase, commit],
  );

  /** حذف یکجای چند کلید (مثل دکمهٔ «حذف فیلترها») */
  const clearParams = useCallback(
    (keys: readonly string[]) => {
      const params = readBase();
      for (const key of keys) params.delete(key);
      params.delete("page");
      commit(params);
    },
    [readBase, commit],
  );

  return { setParams, clearParams };
}
