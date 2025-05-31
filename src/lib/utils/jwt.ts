import Cookies from "js-cookie";

// export function parseAuthCookie(
//   cookieHeader: string | undefined
// ): string | null {
//   if (!cookieHeader) return null;
//   const cookies = Cookie.parse(cookieHeader);
//   return cookies.authToken || null;
// }

export function saveTokenCookies(access_token: string, refresh_token: string,rememberMe:boolean, email:string) {
  try {

    Cookies.remove("access_token");
    Cookies.remove("refresh_token");
    Cookies.remove("email");
    
    const cookieOptions = {
      expires: rememberMe ? 7 : undefined, // expires in 7 days or session
      secure: process.env.NEXT_PUBLIC_PRODUCTION === "production",
      sameSite: "Lax" as const,
    };

    Cookies.set("access_token", access_token, cookieOptions);
    Cookies.set("refresh_token", refresh_token, cookieOptions);
    Cookies.set("email", email, cookieOptions);
  } catch (error) {
    console.error("JWT verification failed:", error);
    return null;
  }
}
