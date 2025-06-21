import Cookies from "js-cookie";

// export function parseAuthCookie(
//   cookieHeader: string | undefined
// ): string | null {
//   if (!cookieHeader) return null;
//   const cookies = Cookie.parse(cookieHeader);
//   return cookies.authToken || null;
// }

export function saveTokenCookies(access_token: string, refresh_token: string, rememberMe: boolean, email: string) {
  try {
    Cookies.remove("access_token");
    Cookies.remove("refresh_token");
    Cookies.remove("email");
    
    const cookieOptions = {
      expires: rememberMe ? 30 : 7, // 30 days for remember me, 7 days for normal session
      secure: process.env.NEXT_PUBLIC_PRODUCTION === "production",
      sameSite: "lax" as const,
      path: "/",
    };

    // Access token expires in 24 hours
    const accessTokenOptions = {
      ...cookieOptions,
      expires: rememberMe ? 1 : 1, // 1 day for access token
    };

    // Refresh token expires in 30 days for remember me, 7 days for normal
    const refreshTokenOptions = {
      ...cookieOptions,
      expires: rememberMe ? 30 : 7,
    };

    Cookies.set("access_token", access_token, accessTokenOptions);
    Cookies.set("refresh_token", refresh_token, refreshTokenOptions);
    Cookies.set("email", email, cookieOptions);
  } catch (error) {
    console.error("JWT verification failed:", error);
    return null;
  }
}

// Function to check if token is about to expire (within 5 minutes)
export function isTokenExpiringSoon(token: string): boolean {
  try {
    const decoded = JSON.parse(atob(token.split('.')[1]));
    const now = Math.floor(Date.now() / 1000);
    const fiveMinutes = 5 * 60; // 5 minutes in seconds
    return decoded.exp && (decoded.exp - now) < fiveMinutes;
  } catch (error) {
    console.error("Error checking token expiration:", error);
    return false;
  }
}

// Function to get token expiration time
export function getTokenExpirationTime(token: string): number | null {
  try {
    const decoded = JSON.parse(atob(token.split('.')[1]));
    return decoded.exp || null;
  } catch (error) {
    console.error("Error getting token expiration:", error);
    return null;
  }
}
