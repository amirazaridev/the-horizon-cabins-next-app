import type { UserRole } from "@/features/auth/constants/auth-cookie";
import type { AdminUser } from "../types/user.types";

/**
 * اختیارات یک ردیف کاربر برای نقش بازیگر.
 *
 * ⚠️ این توابع فقط برای **نمایش/پنهان‌کردن** آیتم‌های منو هستند؛ اعتبارسنجی
 * نهایی و الزام‌آور سمت بک‌اند انجام می‌شود (`user.service`). اینجا همان
 * سیاست‌ها آینه شده‌اند تا کاربر آیتمی را نبیند که ۴۰۳ می‌گیرد.
 */
export interface UserRowPermissions {
  canToggleStatus: boolean;
  canChangeRole: boolean;
  canDelete: boolean;
}

/**
 * سیاست‌ها:
 * - `owner` روی مهمان و admin آزاد است؛ حساب مالکان دست‌نخورده می‌ماند.
 * - `admin` فقط روی حساب مهمان‌ها اختیار دارد.
 * - تغییر نقش و حذف، انحصاری `owner` است و هرگز روی مالکان اعمال نمی‌شود.
 */
export function userRowPermissions(
  actorRole: UserRole,
  target: AdminUser,
): UserRowPermissions {
  const actorIsOwner = actorRole === "owner";
  const actorIsAdmin = actorRole === "admin";

  const targetIsOwner = target.role === "owner";
  const targetIsGuest = target.role === "guest";

  return {
    canToggleStatus: (actorIsOwner && !targetIsOwner) || (actorIsAdmin && targetIsGuest),
    canChangeRole: actorIsOwner && !targetIsOwner,
    canDelete: actorIsOwner && !targetIsOwner,
  };
}
