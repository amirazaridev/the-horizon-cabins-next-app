import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const COOKIE_NAME = "JWT";
export function proxy(request: NextRequest) {
  // const token = request.cookies.get(COOKIE_NAME)?.value;

  // if (!token) {
  //   const loginUrl = new URL("/login", request.url);
  //   loginUrl.searchParams.set("from", request.nextUrl.pathname);
  //       return NextResponse.redirect(loginUrl)
  // }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
