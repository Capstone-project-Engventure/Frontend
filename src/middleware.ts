// // middleware.ts
import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("access_token");

  // Redirect logged-in users from "/" to dashboard
  if (request.nextUrl.pathname === "/" && token) {
    return NextResponse.redirect(new URL("/student/my-course", request.url));
  }

  // Protect routes
  if (request.nextUrl.pathname.startsWith("/student") && !token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/student/:path*"],
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
const protectedRoutes = ['/dashboard']
const publicRoutes = ['/login', '/signup', '/']
