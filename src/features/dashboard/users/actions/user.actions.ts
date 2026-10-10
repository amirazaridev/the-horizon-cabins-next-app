"use server";

import { revalidatePath } from "next/cache";

import { authFetch } from "@/libs/api/authFetch";
import type { UserRole } from "@/features/auth/constants/auth-cookie";
import type { UserActionFeedback } from "../types/user.types";

/**
 * Server Actionهای عملیات مدیریتی کاربران.
 *
 * - فعال/غیرفعال‌کردن حساب → `PATCH /user/:id/status` (admin|owner؛ admin فقط مهمان).
 * - تغییر نقش → `PATCH /user/:id/role` (فقط owner).
 * - حذف حساب → `DELETE /user/:id` (فقط owner).
 *
 * همه از `authFetch` استفاده می‌کنند تا توکن از کوکی سرور فوروارد شود؛
 * گاردهای سیاست نهایی سمت بک‌اند اعمال می‌شوند و اینجا فقط پیام مناسب
 * به کاربر نشان داده می‌شود.
 */

/** مسیرهایی که لیست کاربران را نشان می‌دهند و بعد از هر عملیات تازه می‌شوند. */
const USER_LIST_PATHS = ["/dashboard/users", "/dashboard/admins"] as const;

function revalidateUserLists(): void {
  for (const path of USER_LIST_PATHS) revalidatePath(path);
}

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

    revalidateUserLists();
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

/** حذف کامل حساب کاربر (فقط مالک). */
export async function deleteUserAction(userId: number): Promise<UserActionFeedback> {
  try {
    const res = await authFetch(`user/${userId}`, {
      method: "DELETE",
      cache: "no-store",
    });

    if (!res.ok) {
      return {
        success: false,
        message:
          res.status === 409
            ? "این کاربر رزرو یا قاعده‌ی قیمت دارد و حذف نمی‌شود؛ به‌جای حذف، حساب را غیرفعال کنید."
            : "حذف کاربر ناموفق بود.",
      };
    }

    revalidateUserLists();
    return { success: true, message: "کاربر حذف شد." };
  } catch {
    return { success: false, message: "ارتباط با سرور برقرار نشد." };
  }
}
