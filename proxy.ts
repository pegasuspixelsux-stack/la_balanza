import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE } from "@/lib/auth-constants";

/**
 * Optimistic gate only: it checks for the presence of the session cookie and
 * redirects. The real signature check runs in `app/panel/layout.tsx` and in
 * every Server Action (see `lib/auth.ts`).
 */
export function proxy(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;
  const hasSession = request.cookies.has(SESSION_COOKIE);
  const isLogin = pathname === "/panel/login";

  if (!isLogin && !hasSession) {
    const url = request.nextUrl.clone();
    url.pathname = "/panel/login";
    return NextResponse.redirect(url);
  }

  if (isLogin && hasSession) {
    const url = request.nextUrl.clone();
    url.pathname = "/panel";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/panel/:path*",
};
