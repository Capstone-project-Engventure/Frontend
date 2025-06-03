// // middleware.ts
import { NextRequest, NextResponse } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
// import { parseAuthCookie, verifyJwt } from './lib/utils/jwt';
import { decodeJwt, jwtVerify, importSPKI } from "jose";
import { PUBLIC_KEY_PEM } from "@/lib/key/publicKey";
import Cookies from "js-cookie";

const intlMiddleware = createIntlMiddleware({
  locales: ["en", "vi"],
  defaultLocale: "en",
});

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;
  const pathname = request.nextUrl.pathname;
  const locale = pathname.split("/")[1];
  const isValidLocale = ["en", "vi"].includes(locale);
  const resolvedLocale = isValidLocale ? locale : "en";
  const isLocaleRoot = pathname === `/${resolvedLocale}` || pathname === `/${resolvedLocale}/` || pathname === "/";

  let role = "anonymous";
  let isValidToken = false;

  // Validate token if present
  if (token) {
    try {
      const publicKey = await importSPKI(PUBLIC_KEY_PEM, "RS256");
      const { payload } = await jwtVerify(token, publicKey);
      isValidToken = true;
      role = payload.scope?.includes("admin") ? "admin" : "student";
    } catch (error) {
      console.error("JWT verification failed:", error);
    }
  }

  // Redirect based on locale
  const intlResponse = intlMiddleware(request);
  if (intlResponse.redirected) {
    return intlResponse;
  }

  // Authenticated user landing on root → redirect to role-specific dashboard
  if (isLocaleRoot && isValidToken) {
    const destination =
      role === "admin"
        ? `/${resolvedLocale}/admin/home`
        : `/${resolvedLocale}/student/my-course`;

    if (pathname !== destination) {
      return NextResponse.redirect(new URL(destination, request.url));
    }
  }

  // If trying to access a protected route and unauthenticated → redirect to home
  const isProtectedRoute =
    pathname.startsWith(`/${resolvedLocale}/admin`) ||
    pathname.startsWith(`/${resolvedLocale}/student`);

  if (isProtectedRoute && !isValidToken) {
    return NextResponse.redirect(new URL(`/${resolvedLocale}/`, request.url));
  }

  return intlResponse;
}

export const config = {
  matcher: ["/", "/(en|vi)/:path*"],
};

function checkAuthStatus(req: NextRequest): string | null {
  try {
    const cookie = req.cookies.get("access_token")?.value;
    return JSON.parse(cookie || "false");
  } catch {
    return null;
  }
}

function validateJwtToken(token: string) {
  try {
    const decoded = decodeJwt(token);
    const now = Math.floor(Date.now() / 1000);
    if (decoded.exp && decoded.exp < now) {
      console.log("expired: ", decoded.exp, now);
      Cookies.remove("access_token");
      return false;
    }
    return true;
  } catch (error) {
    console.error("JWT verification failed:", error);
    return false;
  }
}

// 1. Specify protected and public routes
const protectedRoutes = ["/dashboard"];
const publicRoutes = ["/login", "/signup", "/"];
