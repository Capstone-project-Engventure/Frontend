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

  async getUserInfo():Promise<any>{
    const api = useApi();
    const res = await api.get("/users/user_info");
    return res.data;

  }
}

const oauthService = new OAuthService();
export default oauthService;
