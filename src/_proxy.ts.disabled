import { NextResponse } from "next/server";
import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";
import { defaultLocale, isLocale, allLocales } from "@/lib/i18n/config";

const { auth } = NextAuth(authConfig);

function getLocaleFromPath(pathname: string): string | null {
  const segment = pathname.split("/")[1] ?? "";
  return isLocale(segment) ? segment : null;
}

// A path like /hi/converter has a *recognized* locale segment (hi has
// translation data, see allLocales) that just isn't active right now - drop
// it rather than prepending defaultLocale in front of it, which would
// otherwise produce a nonsensical /en/hi/converter.
function stripKnownInactiveLocale(pathname: string): string {
  const segments = pathname.split("/");
  const first = segments[1] ?? "";
  if ((allLocales as readonly string[]).includes(first) && !isLocale(first)) {
    const rest = segments.slice(2).join("/");
    return rest ? `/${rest}` : "/";
  }
  return pathname;
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
    const cleanPath = stripKnownInactiveLocale(pathname);
    url.pathname = `/${defaultLocale}${cleanPath === "/" ? "" : cleanPath}`;
    return NextResponse.redirect(url);
  }

  const response = NextResponse.next();
  response.headers.set("x-locale", locale);
  return response;
});

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"],
};
