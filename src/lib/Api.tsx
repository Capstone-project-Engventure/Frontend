"use client";
import axios from "axios";
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
    let access_token = localStorage.getItem("accessToken") || "";
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
        const refresh_token = localStorage.getItem("refreshToken") || "";
        if (refresh_token?.trim() !== "") {
          const formData = new FormData();
          formData.append("refresh_token", refresh_token);

          try {
            const refreshResponse = await axios.post(
              `${baseURL}/users/refresh-token`,
              formData
            );
            const { access_token, refresh_token } = refreshResponse.data;

            localStorage.setItem("accessToken", access_token);
            localStorage.setItem("refreshToken", refresh_token);
            // setTokenInfo({ access_token, refresh_token: newRefresh });

            // Optionally retry original request
            // error.config.headers['Authorization'] = `Bearer ${access_token}`;
            // return api.request(error.config);
          } catch (refreshError) {
            console.error(refreshError);
            // reset();
          }
        }
      }

      return Promise.reject(error);
    }
  );

  return api;
};
