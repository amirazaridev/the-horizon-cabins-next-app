import { type NextRequest } from "next/server";

import { authFetch } from "@/libs/api/authFetch";

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
