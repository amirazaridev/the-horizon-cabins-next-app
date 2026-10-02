import { redirect } from "next/navigation";
import type { Metadata } from "next";

import Landing from "@/features/landing";
import { canAccessDashboard } from "@/features/auth/constants/auth-cookie";
import { getCurrentUser } from "@/features/auth/services/session.service";

export const metadata: Metadata = {
  title: "ویلاهای لوکس",
};

/**
 * صفحه‌ی اصلی — Server Component.
 *
 * ⚠️ قاعده‌ی نقش: اگر کاربر جاری admin یا owner باشد، به‌جای دیدن صفحه‌ی
 * اصلی مستقیم به `/dashboard` هدایت می‌شود. کاربر مهمانِ وارد‌شده و
 * بازدیدکننده‌ی عادی همان صفحه‌ی اصلی را می‌بینند.
 *
 * تشخیص نقش از سرویس نشست می‌آید که کوکی را به API می‌فرستد؛ پس این
 * تصمیم «سمت سرور» و بر اساس واقعیتِ سرور گرفته می‌شود، نه صرفِ وجود کوکی.
 */
export default async function Home() {
  

  return <Landing />;
}
