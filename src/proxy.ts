import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { AUTH_COOKIE_NAME } from "@/features/auth/constants/auth-cookie";

/**
 * مسیرهای محافظت‌شده — ناحیه‌ی مهمان (`/account/*`) هم مثل پنل مدیریت
 * نیاز به نشست دارد؛ بدون کوکی، کاربر به `/login` می‌رود.
 */
const PROTECTED_PREFIXES = ["/dashboard", "/account"];

function isProtectedPath(pathname: string): boolean {
  return PROTECTED_PREFIXES.some(
    (prefix) =>
      pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasToken = Boolean(
    request.cookies.get(AUTH_COOKIE_NAME)?.value,
  );

  if (isProtectedPath(pathname) && !hasToken) {
    const loginUrl = new URL("/login", request.url);

    loginUrl.searchParams.set(
      "from",
      pathname + request.nextUrl.search,
    );

    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};