import Cookies from "js-cookie";
import { useApi } from "../Api";
import { User } from "../types/user";
import { saveTokenCookies } from "../utils/jwt";
import resetAllStores from "@/lib/resetStores";


type LoginResponse = {
  access_token: string;
  refresh_token: string;
};

class OAuthService {
  async login(
    email: string,
    password: string,
    rememberMe: boolean
  ): Promise<LoginResponse> {
    const api = useApi();
    const formData = new FormData();
    formData.append("username", email);
    formData.append("password", password);

    const res = await api.post("/users/login", formData);
    const { access_token, refresh_token } = res.data;

    if (access_token && refresh_token) {
      // Set token in cookie
      saveTokenCookies(access_token, refresh_token, rememberMe, email);
      
      // Store remember me preference
      Cookies.set("rememberMe", rememberMe.toString(), {
        expires: rememberMe ? 30 : 7,
        secure: process.env.NEXT_PUBLIC_PRODUCTION === "production",
        sameSite: "lax",
        path: "/",
      });

      return { access_token, refresh_token };
    } else {
      throw new Error("Invalid login response");
    }
  }

  async getUserInfo(): Promise<any> {
    const api = useApi();
    const res = await api.get("/users/user_info");
    return res.data;
  }

  async logout() {
    try {
      const access_token = Cookies.get("access_token");
      const refresh_token = Cookies.get("refresh_token");

      if (!access_token || !refresh_token) {
        throw new Error("No tokens found");
      }
      const api = useApi();

      // Call API to revoke tokens
      const response = await api.post("/users/logout", {
        access_token,
        refresh_token,
      });

      // If the response is successful, clear cookies
      if (response.status === 200) {
        resetAllStores();

        Cookies.remove("access_token");
        Cookies.remove("refresh_token");
        Cookies.remove("email");
        Cookies.remove("rememberMe");

        window.location.href = "/";
      } else {
        console.error("Logout failed:", response.data);
      }
    } catch (err) {
      console.error("Error during logout:", err);
      // Even if API call fails, clear local cookies
      Cookies.remove("access_token");
      Cookies.remove("refresh_token");
      Cookies.remove("email");
      Cookies.remove("rememberMe");
      window.location.href = "/";
    }
  }

  // Check if user is currently logged in
  isLoggedIn(): boolean {
    const accessToken = Cookies.get("access_token");
    const refreshToken = Cookies.get("refresh_token");
    return !!(accessToken && refreshToken);
  }

  // Get current user's remember me preference
  getRememberMePreference(): boolean {
    return Cookies.get("rememberMe") === "true";
  }
}

export default OAuthService;
