import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import type { ErrorResponseDTO } from "../types/error";
import { setAccessToken, getAccessToken } from "./tokenStore";
export { setAccessToken };

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to attach token
apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getAccessToken();
  if (token) {
    config.headers.set("Authorization", `Bearer ${token}`);
  }
  return config;
});

// For the mutex/queue
let isRefreshing = false;
let failedQueue: Array<{ resolve: (value?: unknown) => void; reject: (reason?: any) => void }> = [];

const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ErrorResponseDTO>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      if (originalRequest.url?.includes('/auth/login') || originalRequest.url?.includes('/auth/refresh')) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.set('Authorization', `Bearer ${token}`);
            return apiClient.request(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await axios.post(
          `${import.meta.env.VITE_BACKEND_API_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );
        // Assuming data contains the new token
        const newAccessToken = data.accessToken || data.token;
        if (newAccessToken) {
           setAccessToken(newAccessToken);
        }
        processQueue(null, newAccessToken);
        
        if (newAccessToken) {
          originalRequest.headers.set('Authorization', `Bearer ${newAccessToken}`);
        }
        return apiClient.request(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError as AxiosError, null);
        setAccessToken(null);
        
        // Prevent infinite reload loop if already on /login
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    if (error.response && error.response.data && error.response.data.message) {
      return Promise.reject(new Error(error.response.data.message));
    }

    if (error.response && error.response.status === 403) {
      return Promise.reject(new Error("No tienes permisos suficientes para realizar esta acción."));
    }

    return Promise.reject(new Error("Ocurrió un error de red o en el servidor. Intenta de nuevo más tarde."));
  }
);
