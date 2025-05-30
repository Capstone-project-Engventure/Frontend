// // middleware.ts
import { NextRequest, NextResponse } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
// import { parseAuthCookie, verifyJwt } from './lib/utils/jwt';
import {jwtVerify,importSPKI } from "jose";
import { PUBLIC_KEY_PEM } from '@/lib/key/publicKey';

const intlMiddleware = createIntlMiddleware({
  locales: ["en", "vi"],
  defaultLocale: "en",
});

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;
  const publicKey = await importSPKI(PUBLIC_KEY_PEM, 'RS256');
  const intlResponse = intlMiddleware(request);
  // If next-intl redirected (e.g. added /en/), stop here
  if (intlResponse.redirected) {
    return intlResponse;
  }
  const pathname = request.nextUrl.pathname;
  const locale = pathname.split("/")[1];
  const isValidLocale = ["en", "vi"].includes(locale);
  const resolvedLocale = isValidLocale ? locale : "en";
  let role = "anonymous"
  if(token){
    try{
      // const { payload } = await jwtVerify(token, new TextEncoder().encode(SECRET_KEY));
      const { payload } = await jwtVerify(token, publicKey);
      role = payload.scope?.includes("admin") ? "admin" : "student";    
    }catch (error) {
      console.error("JWT verification failed:", error);
      // return NextResponse.redirect(new URL('/', request.url));
    }
  }
 
  if ((pathname === "/" || pathname === `/${resolvedLocale}`)&& token) {
    if (role === "admin") {
      return NextResponse.redirect(
        new URL(`/${resolvedLocale}/admin/home`, request.url)
      );
    }else if(role === "student") {
      return NextResponse.redirect(
        new URL(`/${resolvedLocale}/student/my-course`, request.url)
      );
    }else{
      return NextResponse.redirect(new URL('/', request.url));
    }
   
  }
  // If the user is not authenticated and trying to access a protected route
  if (
    (pathname.startsWith(`/${resolvedLocale}/student`) ||
      pathname.startsWith(`/${resolvedLocale}/admin`)) &&
    !token
  ) {
    return NextResponse.redirect(new URL(`/${resolvedLocale}/`, request.url));
  }
  return intlResponse;
}

export const config = {
  matcher: ["/", "/(en|vi)/:path*"],
};

// 1. Specify protected and public routes
const protectedRoutes = ["/dashboard"];
const publicRoutes = ["/login", "/signup", "/"];
