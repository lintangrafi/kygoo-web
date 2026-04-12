import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/src/infrastructure/stores/auth-store';

function resolveApiBaseUrl(rawUrl?: string): string {
  const fallback = 'http://localhost:8080/api';

  if (!rawUrl) {
    return fallback;
  }

  const normalized = rawUrl.trim().replace(/\/+$/, '');

  // Supported inputs:
  // - https://api.example.com
  // - https://api.example.com/api
  // - https://api.example.com/v1
  // - https://api.example.com/api/v1
  if (/\/api\/v1$/i.test(normalized)) {
    return normalized.replace(/\/v1$/i, '');
  }

  if (/\/v1$/i.test(normalized)) {
    return normalized.replace(/\/v1$/i, '/api');
  }

  if (/\/api$/i.test(normalized)) {
    return normalized;
  }

  return `${normalized}/api`;
}

const API_BASE_URL = resolveApiBaseUrl(process.env.NEXT_PUBLIC_API_URL);

/**
 * Create axios instance with base configuration
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

/**
 * Request interceptor to add auth token
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const { accessToken } = useAuthStore.getState();
    
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor to handle token refresh
 */
apiClient.interceptors.response.use(
  (response: any) => response,
  async (error: any) => {
    const originalRequest = error.config;

    // Don't retry if this is already a refresh token request (prevent infinite loop)
    if (originalRequest.url?.includes('/auth/refresh')) {
      return Promise.reject(error);
    }

    // If error is 401 and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const { refreshToken, refreshAccessToken } = useAuthStore.getState();
        
        if (refreshToken) {
          // Try to refresh the token
          await refreshAccessToken();
          
          // Retry the original request with new token
          const { accessToken } = useAuthStore.getState();
          if (accessToken && originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          }
          
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, logout user
        const { logout } = useAuthStore.getState();
        logout();
        
        // Redirect to login
        if (typeof window !== 'undefined') {
          window.location.href = '/auth/login';
        }
        
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
