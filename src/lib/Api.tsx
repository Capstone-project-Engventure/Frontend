"use client";
import dayjs from "dayjs"
import axios from "axios";
import Cookies from "js-cookie";
const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
export const useApi = () => {
  // const { currentLanguage } = useLocale();
  // const {reset} = useAuth()
  const api = axios.create({
    baseURL: baseURL,
    withCredentials: false,
  });

  // Request interceptor
  api.interceptors.request.use((config) => {
    let access_token = Cookies.get("access_token") || "";
    const isLoginEndpoint = config.url?.endsWith("/login");
    if (access_token && !isLoginEndpoint) {
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
            const { access_token, refresh_token } = refreshResponse.data;
            const cookieOptions = {
              expires: 7, // expires in 7 days or session
              secure: process.env.NEXT_PUBLIC_PRODUCTION === "production",
              sameSite: "Lax" as const,
            };
            Cookies.set("access_token",access_token, {
              ...cookieOptions,
              expires: dayjs().add(1, 'hour').toDate(),
            })
            Cookies.set("refresh_token",refresh_token, {
              ...cookieOptions,
              expires: dayjs().add(7, 'day').toDate(),
            })
          } catch (refreshError) {
            console.error(refreshError);
          }
        }
      }

      return Promise.reject(error);
    }
  );

  return api;
};
