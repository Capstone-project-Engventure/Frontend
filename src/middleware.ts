// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
// import jwt from 'jsonwebtoken';
import { jwtDecode } from "jwt-decode";

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get('accessToken')?.value;
  const url = request.nextUrl.clone();

  if (url.pathname.startsWith('/admin')) {
    const decoded = jwtDecode(accessToken);
    // const { sub, iat, exp, nbf, scope } = jwtDecode(accessToken);
    const scopes = Array.isArray(decoded.scope)
      ? decoded.scope
      : decoded.scope?.split(" ") || [];
      console.log("scopes",scopes);
    let role = "user";
    if (scopes.includes("admin")) {
      role = "admin";
    }
    if ((!accessToken || role != 'admin') && url.pathname !== "/admin/login"  ) {
      url.pathname = '/admin/login';
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
