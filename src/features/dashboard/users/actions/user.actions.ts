"use server";

import { revalidatePath } from "next/cache";

import { authFetch } from "@/libs/api/authFetch";
import type { UserRole } from "@/features/auth/constants/auth-cookie";
import type { UserActionFeedback } from "../types/user.types";

/**
 * Server Actionهای عملیات مدیریتی کاربران.
 *
 * - فعال/غیرفعال‌کردن حساب → `PATCH /user/:id/status` (admin|owner).
 * - تغییر نقش → `PATCH /user/:id/role` (فقط owner؛ بک‌اند ۴۰۳ می‌دهد).
 *
 * هر دو از `authFetch` استفاده می‌کنند تا توکن از کوکی سرور فوروارد شود.
 */

async function patchUser(
  userId: number,
  path: string,
  body: Record<string, unknown>,
  messages: { success: string; failure: string },
): Promise<UserActionFeedback> {
  try {
    const res = await authFetch(`user/${userId}/${path}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    if (!res.ok) {
      return { success: false, message: messages.failure };
    }

    revalidatePath("/dashboard/users");
    return { success: true, message: messages.success };
  } catch {
    return { success: false, message: "ارتباط با سرور برقرار نشد." };
  }
}

/** فعال/غیرفعال‌کردن حساب کاربر. */
export async function setUserStatusAction(
  userId: number,
  active: boolean,
): Promise<UserActionFeedback> {
  return patchUser(userId, "status", { active }, {
    success: active ? "حساب کاربر فعال شد." : "حساب کاربر غیرفعال شد.",
    failure: active
      ? "فعال‌سازی حساب ناموفق بود."
      : "غیرفعال‌سازی حساب ناموفق بود.",
  });
}

/** تغییر نقش کاربر (فقط مالک). */
export async function setUserRoleAction(
  userId: number,
  role: UserRole,
): Promise<UserActionFeedback> {
  return patchUser(userId, "role", { role }, {
    success: "نقش کاربر با موفقیت تغییر کرد.",
    failure: "تغییر نقش ناموفق بود؛ ممکن است دسترسی کافی نداشته باشید.",
  });
}
