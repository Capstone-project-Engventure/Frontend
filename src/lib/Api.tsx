"use client";
import axios from 'axios';
import { useAuth } from './context/AuthContext';

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

export const useApi = () => {
    const { tokenInfo, setTokenInfo, reset } = useAuth();
    // const { currentLanguage } = useLocale();
    const api = axios.create({
      baseURL: baseURL,
    });
  
    // Request interceptor
    api.interceptors.request.use((config) => {
      let access_token = tokenInfo?.accessToken?.trim() || null;
      if (access_token === '') access_token = null;
  
      // let language = currentLanguage?.trim() || null;
      // if (language === '') language = null;
  
      const isLoginEndpoint = config.url?.endsWith('/login');
  
      if (access_token && !isLoginEndpoint) {
        config.headers['Authorization'] = `Bearer ${access_token}`;
      }
      // if (language) {
      //   config.headers['Accept-Language'] = language;
      // }
  
      return config;
    });
  
    // Response error interceptor
    api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const response = error.response;
  
        if (response?.status === 401 || response?.status === 403) {
          const refresh_token = tokenInfo?.refreshToken;
          if (refresh_token?.trim() !== '') {
            const formData = new FormData();
            formData.append('refresh_token', refresh_token);

            try {
              const refreshResponse = await axios.post(
                `${baseURL}/users/refresh-token`,
                formData
              );
              const { access_token, refresh_token: newRefresh } = refreshResponse.data;
              setTokenInfo({ access_token, refresh_token: newRefresh });
  
              // Optionally retry original request
              // error.config.headers['Authorization'] = `Bearer ${access_token}`;
              // return api.request(error.config);
  
            } catch (refreshError) {
              console.error(refreshError);
              reset();
            }
          }
        }
  
        return Promise.reject(error);
      }
    );
  
    return api;
  };