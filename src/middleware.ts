// // middleware.ts
import { NextRequest, NextResponse } from "next/server";
import createIntlMiddleware from "next-intl/middleware";

const intlMiddleware = createIntlMiddleware({
  locales: ["en", "vi"],
  defaultLocale: "en",
});

export function middleware(request: NextRequest) {
  const token = request.cookies.get("access_token");
  console.log("Middleware token:", token);

  const intlResponse = intlMiddleware(request);
  // If next-intl redirected (e.g. added /en/), stop here
  if (intlResponse.redirected) {
    return intlResponse;
  }
  const pathname = request.nextUrl.pathname;
  const locale = pathname.split("/")[1];
  const isValidLocale = ["en", "vi"].includes(locale);
  const resolvedLocale = isValidLocale ? locale : "en";

  if (pathname === "/" && token) {
    return NextResponse.redirect(
      new URL(`/${resolvedLocale}/student/my-course`, request.url)
    );
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
  // return NextResponse.next();
}

export const config = {
  matcher: ["/", "/(en|vi)/:path*"],
};

// // export function middleware(request:NextRequest){

// //     const user = 'true'

// //     if (!user){
// //         return NextResponse.redirect(
// //             new URL('/', request.url)
// //         )
// //     }

// //     return NextResponse.next()
// // }

// // export const config = {
// //     matcher: ['/admin/:path*']
// // }

// 1. Specify protected and public routes
const protectedRoutes = ["/dashboard"];
const publicRoutes = ["/login", "/signup", "/"];
