import { NextResponse } from "next/server";
import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";
import { defaultLocale, isLocale } from "@/lib/i18n/config";

const { auth } = NextAuth(authConfig);

function getLocaleFromPath(pathname: string): string | null {
  const segment = pathname.split("/")[1] ?? "";
  return isLocale(segment) ? segment : null;
}

export default auth((req) => {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/admin")) {
    const isLoggedIn = !!req.auth?.user;
    const isLoginPage = pathname === "/admin/login";

    if (isLoggedIn && isLoginPage) return NextResponse.redirect(new URL("/admin", req.nextUrl));
    if (!isLoggedIn && !isLoginPage) return NextResponse.redirect(new URL("/admin/login", req.nextUrl));
    return NextResponse.next();
  }

  if (pathname.startsWith("/api")) return NextResponse.next();

  const locale = getLocaleFromPath(pathname);
  if (!locale) {
    const url = req.nextUrl.clone();
    url.pathname = `/${defaultLocale}${pathname === "/" ? "" : pathname}`;
    return NextResponse.redirect(url);
  }

  const response = NextResponse.next();
  response.headers.set("x-locale", locale);
  return response;
});

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"],
};
