import axios from "axios";
import {
  AuthResponse,
  LoginForm,
  RegisterForm,
  User,
} from "../types/auth.types";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

const publicRoutes = ["/auth/login", "/auth/register", "/auth/refresh-token"];

interface QueueItem {
  resolve: (token: string) => void;
  reject: (error: Error) => void;
}

let isRefreshing = false;
let failedQueue: QueueItem[] = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token!);
    }
  });

  failedQueue = [];
};

api.interceptors.request.use((config) => {
  const isPublicRoute = publicRoutes.some((route) =>
    config.url?.endsWith(route)
  );

  if (!isPublicRoute) {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const isLoginRoute = originalRequest.url?.endsWith("/auth/login");

    if (isLoginRoute) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        try {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return api(originalRequest);
            })
            .catch((err) => {
              return Promise.reject(err);
            });
        } catch (err) {
          return Promise.reject(err);
        }
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        const response = await api.post<{ accessToken: string }>(
          "/auth/refresh-token",
          { refreshToken }
        );
        const { accessToken } = response.data;

        localStorage.setItem("accessToken", accessToken);
        api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

        processQueue(null, accessToken);
        return api(originalRequest);
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Unknown error");
        processQueue(error, null);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
        return Promise.reject(error);
      } finally {
        isRefreshing = false;
      }
    }

    if (
      error.response?.status === 401 &&
      !originalRequest.url?.endsWith("/auth/login")
    ) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export const authService = {
  async register(data: RegisterForm) {
    const response = await api.post<User>("/auth/register", data);
    return response.data;
  },

  async login(data: LoginForm) {
    const response = await api.post<AuthResponse>("/auth/login", data);
    const { accessToken, refreshToken } = response.data;
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    return response.data;
  },

  async listUsers() {
    const response = await api.get<User[]>("/auth/users");
    return response.data;
  },

  logout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  },
};

export default api;
