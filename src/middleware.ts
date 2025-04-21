// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
// import jwt from 'jsonwebtoken';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('accessToken')?.value;
  const url = request.nextUrl.clone();

  if (url.pathname.startsWith('/admin')) {
    if (!token) {
      url.pathname = '/admin/login';
      console.log("Middleware trigger"); // Not access
      return NextResponse.redirect(url);
    }

    // const user: any = jwt.decode(token);
    // if (user?.role !== 'admin') {
    //   url.pathname = '/unauthorized';
    //   return NextResponse.redirect(url);
    // }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
