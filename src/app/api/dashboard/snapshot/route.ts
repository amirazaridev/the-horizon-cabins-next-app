import { type NextRequest } from "next/server";

import { authFetch } from "@/libs/api/authFetch";

/**
 * پروکسی داخلی به `GET /dashboard/snapshot` بک‌اند.
 *
 *     GET /api/dashboard/snapshot?from=2026-06-01&to=2026-06-30&compare=prev-period
 *
 * چرا Route Handler و نه fetch مستقیم در کلاینت؟
 *  - `authFetch` با `server-only` علامت خورده و `API_URL` یک متغیر محیطی
 *    سروری است؛ کلاینت نه می‌تواند و نه باید مستقیم به بک‌اند بزند.
 *  - این پروکسی توکن (کوکی `jwt`) را سرور-ساید فوروارد می‌کند و آدرس
 *    بک‌اند هرگز به باندل مرورگر نمی‌رسد.
 *
 * پاسخ: خودِ آبجکت `snapshot` (بدون پوشش `{ status, data }`) تا مصرف‌کننده‌ی
 * کلاینت فقط با `hydrateSnapshot` تاریخ‌ها را بازسازی کند.
 */
export async function GET(request: NextRequest): Promise<Response> {
  const res = await authFetch(
    `dashboard/snapshot?${request.nextUrl.searchParams.toString()}`,
    { cache: "no-store" },
  );

  if (!res.ok) {
    // ۴۰۱/۴۰۳ را عیناً عبور می‌دهیم (احراز هویت/دسترسی)؛ بقیه ۵۰۲ (خطای بالادست).
    const status = res.status === 401 || res.status === 403 ? res.status : 502;
    return Response.json(
      { message: "دریافت دادهٔ داشبورد ناموفق بود." },
      { status },
    );
  }

  const json = (await res.json()) as { data?: { snapshot?: unknown } };

  if (!json.data?.snapshot) {
    return Response.json(
      { message: "پاسخ داشبورد نامعتبر بود." },
      { status: 502 },
    );
  }

  return Response.json(json.data.snapshot);
}
