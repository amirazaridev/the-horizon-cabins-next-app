import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";

import {
  AUTH_COOKIE_MAX_AGE_SECONDS,
  AUTH_COOKIE_NAME,
  canAccessDashboard,
  type UserRole,
} from "../constants/auth-cookie";

const API_URL = process.env.API_URL;

/** کاربر جاری — همان چیزی که همه‌ی لایه‌های UI لازم دارند. */
export type CurrentUser = {
  id: number;
  email: string;
  role: UserRole;
};

/** شکل پاسخ `/user/me` در بک‌اند. */
type ApiMeResponse = {
  status: "success" | "fail" | "error";
  data?: {
    user: { id: number; email: string; role?: UserRole };
  };
};

export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    const res = await fetch(`${API_URL}user/me`, {
      headers: { Cookie: `jwt=${token}` },
      cache: "no-store",
    });

    if (!res.ok) return null;

    const json = (await res.json().catch(() => null)) as ApiMeResponse | null;
    const user = json?.data?.user;
    if (!user) return null;

    return {
      id: user.id,
      email: user.email,
      role: user.role ?? "guest",
    };
  } catch {
    // خطای شبکه/در دسترس نبودن بک‌اند → کاربر ناشناس در نظر گرفته می‌شود.
    return null;
  }
});

/** نقش کاربر جاری (یا `null` اگر وارد نشده باشد). */
export async function getCurrentRole(): Promise<UserRole | null> {
  return (await getCurrentUser())?.role ?? null;
}

/** آیا کاربر جاری اجازه‌ی ورود به پنل مدیریت را دارد؟ */
export async function canAccessDashboardAsCurrentUser(): Promise<boolean> {
  return canAccessDashboard((await getCurrentUser())?.role);
}

export async function createSession(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: AUTH_COOKIE_MAX_AGE_SECONDS,
  });
}

/** حذف کوکی نشست (خروج). */
export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE_NAME);
}

/** توکن خام فعلی — برای ارسال در هدر Cookie به بک‌اند (`authFetch`). */
export async function getRawToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(AUTH_COOKIE_NAME)?.value ?? null;
}
