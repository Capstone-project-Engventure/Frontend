"use client";
import dayjs from "dayjs"
import axios from "axios";
import Cookies from "js-cookie";
import { isTokenExpiringSoon } from "./utils/jwt";

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

export const useApi = () => {
  // const { currentLanguage } = useLocale();
  // const {reset} = useAuth()
  const api = axios.create({
    baseURL: baseURL,
    withCredentials: false,
  });

  // Request interceptor
  api.interceptors.request.use(async (config) => {
    let access_token = Cookies.get("access_token") || "";
    const isLoginEndpoint = config.url?.endsWith("/login");
    const isRefreshEndpoint = config.url?.endsWith("/refresh-token");
    
    if (access_token && !isLoginEndpoint && !isRefreshEndpoint) {
      // Check if token is expiring soon and refresh proactively
      if (isTokenExpiringSoon(access_token)) {
        const refresh_token = Cookies.get("refresh_token") || "";
        if (refresh_token?.trim() !== "") {
          try {
            const formData = new FormData();
            formData.append("refresh_token", refresh_token);
            
            const refreshResponse = await axios.post(
              `${baseURL}/users/refresh-token`,
              formData
            );
            const { access_token: new_access_token, refresh_token: new_refresh_token } = refreshResponse.data;
            
            // Update cookies with new tokens
            const rememberMe = Cookies.get("rememberMe") === "true";
            const email = Cookies.get("email") || "";
            
            Cookies.set("access_token", new_access_token, {
              expires: rememberMe ? 1 : 1, // 1 day
              secure: process.env.NEXT_PUBLIC_PRODUCTION === "production",
              sameSite: "lax",
              path: "/",
            });
            
            Cookies.set("refresh_token", new_refresh_token, {
              expires: rememberMe ? 30 : 7, // 30 days for remember me, 7 days for normal
              secure: process.env.NEXT_PUBLIC_PRODUCTION === "production",
              sameSite: "lax",
              path: "/",
            });
            
            access_token = new_access_token;
          } catch (refreshError) {
            console.error("Proactive token refresh failed:", refreshError);
          }
        }
      }
      
      config.headers["Authorization"] = `Bearer ${access_token}`;
    }
    return config;
  });

  // Response error interceptor
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const response = error.response;

      if (response?.status === 401 || response?.status === 403) {
        const refresh_token = Cookies.get("refresh_token") || "";
        if (refresh_token?.trim() !== "") {
          const formData = new FormData();
          formData.append("refresh_token", refresh_token);

          try {
            const refreshResponse = await axios.post(
              `${baseURL}/users/refresh-token`,
              formData
            );
            const { access_token, refresh_token: new_refresh_token } = refreshResponse.data;
            
            // Update cookies with new tokens
            const rememberMe = Cookies.get("rememberMe") === "true";
            
            Cookies.set("access_token", access_token, {
              expires: rememberMe ? 1 : 1, // 1 day
              secure: process.env.NEXT_PUBLIC_PRODUCTION === "production",
              sameSite: "lax",
              path: "/",
            });
            
            Cookies.set("refresh_token", new_refresh_token, {
              expires: rememberMe ? 30 : 7, // 30 days for remember me, 7 days for normal
              secure: process.env.NEXT_PUBLIC_PRODUCTION === "production",
              sameSite: "lax",
              path: "/",
            });
            
            // Retry the original request with new token
            const originalRequest = error.config;
            originalRequest.headers["Authorization"] = `Bearer ${access_token}`;
            return api(originalRequest);
          } catch (refreshError) {
            console.error("Token refresh failed:", refreshError);
            // Clear cookies and redirect to login
            Cookies.remove("access_token");
            Cookies.remove("refresh_token");
            Cookies.remove("email");
            window.location.href = "/";
          }
        }
      }

      return Promise.reject(error);
    }
  );

  return api;
};
