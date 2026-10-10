/** پارامترهای URL صفحه (هم‌شکل `searchParams` نکست). */
export type UsersSearchParams = Record<string, string | string[] | undefined>;

/** تعداد کاربر در هر صفحه. */
export const USERS_PAGE_SIZE = 10;

/** وضعیت حساب — فیلتر ساده‌ی دوتایی. */
export type UserActiveFilter = "active" | "inactive";

export const USER_ACTIVE_VALUES: readonly UserActiveFilter[] = ["active", "inactive"];

/** فیلترهای نرمال‌شده‌ی صفحه‌ی کاربران (منبع حقیقت: URL). */
export interface UsersFilters {
  active: UserActiveFilter | null;
  /** جستجوی ایمیل/نام/تلفن. */
  query: string;
  page: number;
}

function one(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

function parsePositiveInt(raw: string): number | null {
  const value = Number(raw);
  return Number.isInteger(value) && value > 0 ? value : null;
}

/** خواندن فیلترها از URL — مقادیر نامعتبر بی‌اثر می‌شوند. */
export function parseUsersFilters(params: UsersSearchParams): UsersFilters {
  const raw = one(params.status);
  const active = (USER_ACTIVE_VALUES as readonly string[]).includes(raw)
    ? (raw as UserActiveFilter)
    : null;

  return {
    active,
    query: one(params.q).trim(),
    page: parsePositiveInt(one(params.page)) ?? 1,
  };
}

/** آیا فیلتری (غیر از صفحه‌بندی) فعال است؟ */
export function hasActiveUsersFilters(filters: UsersFilters): boolean {
  return filters.active !== null || filters.query !== "";
}

/**
 * ساخت کوئری API از فیلترها.
 *
 * ⚠️ `q` فقط با حداقل ۲ کاراکتر فرستاده می‌شود (قرارداد اعتبارسنجی بک‌اند)
 * تا درخواست بی‌دلیل ۴۰۰ نگیرد.
 */
export function toUsersApiQuery(filters: UsersFilters): string {
  const params = new URLSearchParams();
  params.set("page", String(filters.page));
  params.set("limit", String(USERS_PAGE_SIZE));

  if (filters.active) params.set("active", String(filters.active === "active"));
  if (filters.query.length >= 2) params.set("q", filters.query);

  return params.toString();
}
