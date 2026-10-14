import type { UserRole } from "@/features/auth/constants/auth-cookie";
import {
  firstParam,
  parsePositiveInt,
} from "@/libs/utils/url-params";

/** پارامترهای URL صفحه (هم‌شکل `searchParams` نکست). */
export type UsersSearchParams = Record<string, string | string[] | undefined>;

/** تعداد کاربر در هر صفحه. */
export const USERS_PAGE_SIZE = 10;

/** وضعیت حساب — فیلتر ساده‌ی دوتایی. */
export type UserActiveFilter = "active" | "inactive";

export const USER_ACTIVE_VALUES: readonly UserActiveFilter[] = ["active", "inactive"];

/** فیلترهای نرمال‌شده‌ی لیست کاربران (منبع حقیقت: URL). */
export interface UsersFilters {
  active: UserActiveFilter | null;
  page: number;
}

/** خواندن یک پارامتر به‌صورت رشته — مقدار غایب/آرایه‌ای نرمال می‌شود. */
function one(value: string | string[] | undefined): string {
  return firstParam(value) ?? "";
}

/** خواندن فیلترها از URL — مقادیر نامعتبر بی‌اثر می‌شوند. */
export function parseUsersFilters(params: UsersSearchParams): UsersFilters {
  const raw = one(params.status);
  const active = (USER_ACTIVE_VALUES as readonly string[]).includes(raw)
    ? (raw as UserActiveFilter)
    : null;

  return {
    active,
    page: parsePositiveInt(one(params.page)) ?? 1,
  };
}

/** آیا فیلتری (غیر از صفحه‌بندی) فعال است؟ */
export function hasActiveUsersFilters(filters: UsersFilters): boolean {
  return filters.active !== null;
}

export function toUsersApiQuery(
  filters: UsersFilters,
  roles: readonly UserRole[],
): string {
  const params = new URLSearchParams();
  params.set("page", String(filters.page));
  params.set("limit", String(USERS_PAGE_SIZE));

  if (roles.length > 0) params.set("roles", roles.join(","));
  if (filters.active) params.set("active", String(filters.active === "active"));

  return params.toString();
}
