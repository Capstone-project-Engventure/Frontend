import Cookies from "js-cookie";
import { useApi } from "../Api";
import { User } from "../types/user";

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
      const cookieOptions = {
        expires: rememberMe ? 7 : undefined, // expires in 7 days or session
        secure: process.env.NEXT_PUBLIC_PRODUCTION === "production",
        sameSite: "Lax" as const,
      };

      Cookies.set("access_token", access_token, cookieOptions);
      Cookies.set("refresh_token", refresh_token, cookieOptions);
      Cookies.set("email", email, cookieOptions);

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
        // Clear cookies after logout
        Cookies.remove("access_token");
        Cookies.remove("refresh_token");
        Cookies.remove("email");

        // Redirect user or perform any other post-logout logic
        window.location.href = "/"; // Example redirect to login page
      } else {
        console.error("Logout failed:", response.data);
      }
    } catch (err) {
      console.error("Error during logout:", err);
    }
  }
}

const oauthService = new OAuthService();
export default oauthService;
