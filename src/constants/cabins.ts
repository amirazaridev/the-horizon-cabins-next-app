import type { LimitBounds } from "@/libs/utils/url-params";

export const DEFAULT_CABINS_LIMIT = 6;
export const MAX_CABINS_LIMIT = 100;

/** کران‌های `limit` برای `parseLimitParam` — تا لایه‌ی عمومی به این دامنه گره نخورد. */
export const CABINS_LIMIT_BOUNDS: LimitBounds = {
  fallback: DEFAULT_CABINS_LIMIT,
  max: MAX_CABINS_LIMIT,
};
