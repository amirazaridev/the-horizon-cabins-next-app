import "server-only";

import { authFetch } from "@/libs/api/authFetch";
import type { GuestAccountProfile } from "../types/guest-account.types";

/**
 * سرویس پروفایل حساب مهمان — **server-only**.
 *
 * ⚠️ چرا واقعی و نه ماک؟ چون همین اندپوینت (`GET /user/me`) از قبل توسط
 * سرویس نشست برای تشخیص نقش استفاده می‌شود؛ پس اتکای اضافه‌ای ایجاد نمی‌کند
 * و داده‌ی نمایش‌داده‌شده، مشخصات واقعی خودِ کاربر است.
 */

type ApiMeResponse = {
  status: "success" | "fail" | "error";
  data?: {
    user?: { id: number; email: string };
    guest?: {
      fullName?: string | null;
      phoneNumber?: string | null;
      nationalId?: string | null;
      dateOfBirth?: string | null;
    } | null;
  };
};

/** پروفایل کاربر جاری یا `null` اگر نشست نامعتبر/بک‌اند در دسترس نبود. */
export async function getGuestAccountProfile(): Promise<GuestAccountProfile | null> {
  try {
    const res = await authFetch("user/me", { cache: "no-store" });
    if (!res.ok) return null;

    const json = (await res.json().catch(() => null)) as ApiMeResponse | null;
    const user = json?.data?.user;
    if (!user) return null;

    const guest = json?.data?.guest ?? null;

    return {
      email: user.email,
      fullName: guest?.fullName ?? "",
      phoneNumber: guest?.phoneNumber ?? "",
      nationalId: guest?.nationalId ?? "",
      // `@db.Date` با زمان UTC می‌آید؛ فقط بخش تاریخ لازم است.
      dateOfBirth: guest?.dateOfBirth ? guest.dateOfBirth.slice(0, 10) : "",
    };
  } catch {
    // خطای شبکه/در دسترس نبودن بک‌اند → صفحه به ورود هدایت می‌کند.
    return null;
  }
}
