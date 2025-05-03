// // middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode";

export function middleware(request: NextRequest) {


  const url = request.nextUrl.clone();


  return NextResponse.next();
}
export const config = {
  matcher: ["/admin/:path*"],
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
