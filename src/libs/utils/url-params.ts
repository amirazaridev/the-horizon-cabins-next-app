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

export function firstParam(
  value: string | string[] | undefined,
): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export function parsePositiveInt(raw: string): number | null {
  const value = Number(raw);
  return Number.isInteger(value) && value > 0 ? value : null;
}

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
