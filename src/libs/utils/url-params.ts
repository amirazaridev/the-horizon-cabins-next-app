/**
 * ابزارهای پارامترهای URL صفحه‌بندی — خالص، بدون React و بدون وابستگی به
 * هیچ فیچری.
 *
 * ⚠️ چرا از `pagination.ts` جدا شد؟ `pagination.ts` منطق «رندر بازه‌ی
 * شماره‌صفحه» است، ولی این‌ها منطق «خواندن/ساختن URL» هستند؛ دو نگرانی
 * متفاوت بودند که در یک فایل جمع شده بودند.
 *
 * ⚠️ `parseLimitParam` پیش از این مستقیماً `DEFAULT_CABINS_LIMIT` و
 * `MAX_CABINS_LIMIT` را از `@/constants/cabins` می‌خواند و لایه‌ی عمومی
 * `libs` را به دامنه‌ی «کابین» گره می‌زد. اکنون کران‌ها از بیرون تزریق
 * می‌شوند.
 */

export type SearchParamsInput =
  | Record<string, string | string[] | undefined>
  | URLSearchParams
  | undefined;

export type LimitBounds = {
  /** مقدار پیش‌فرض وقتی پارامتر غایب یا نامعتبر است. */
  fallback: number;
  /** سقف مجاز. */
  max: number;
};

/**
 * `limit` را با اعتبارسنجی از searchParams می‌خواند و همیشه یک عدد صحیح
 * در بازه‌ی `[1, bounds.max]` برمی‌گرداند (ورودی خراب/غایب => `fallback`).
 */
export function parseLimitParam(
  spLimit: string | string[] | undefined,
  bounds: LimitBounds,
): number {
  const rawLimit = Array.isArray(spLimit) ? spLimit[0] : spLimit;
  const parsedLimit = Number(rawLimit);

  return Number.isInteger(parsedLimit) && parsedLimit > 0
    ? Math.min(parsedLimit, bounds.max)
    : bounds.fallback;
}

/**
 * شمارهٔ صفحه را با اعتبارسنجی از searchParams می‌خواند — همیشه یک عدد
 * معتبر و حداقل ۱ برمی‌گرداند (ورودی خراب/منفی/غایب => صفحه ۱).
 */
export function parsePageParam(
  searchParams: Record<string, string | string[] | undefined> | undefined,
  pageParamName = "page",
): number {
  const raw = searchParams?.[pageParamName];
  const value = Array.isArray(raw) ? raw[0] : raw;
  const parsed = Number(value);

  if (!value || Number.isNaN(parsed) || parsed < 1) return 1;
  return Math.floor(parsed);
}

/**
 * یک صفحهٔ خاص را به query string فعلی اضافه می‌کند و بقیهٔ پارامترها
 * (سرچ، سورت، فیلتر و ...) را دست‌نخورده نگه می‌دارد.
 *
 * مثال: buildPageUrl('/admin/bookings', { status: 'confirmed' }, 3)
 *   => '/admin/bookings?status=confirmed&page=3'
 */
export function buildPageUrl(
  basePath: string,
  searchParams: SearchParamsInput,
  page: number,
  pageParamName = "page",
): string {
  const params = new URLSearchParams();

  if (searchParams instanceof URLSearchParams) {
    searchParams.forEach((value, key) => {
      if (key !== pageParamName) params.append(key, value);
    });
  } else if (searchParams) {
    for (const [key, value] of Object.entries(searchParams)) {
      if (value === undefined || key === pageParamName) continue;
      if (Array.isArray(value)) {
        value.forEach((v) => params.append(key, v));
      } else {
        params.set(key, value);
      }
    }
  }

  params.set(pageParamName, String(page));

  return `${basePath}?${params.toString()}`;
}
