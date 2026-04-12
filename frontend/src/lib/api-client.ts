import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';

function resolveApiBaseUrl(rawUrl?: string): string {
  const fallback = 'http://localhost:8080/api';

  if (!rawUrl) {
    return fallback;
  }

  const normalized = rawUrl.trim().replace(/\/+$/, '');

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

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add JWT token
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error: AxiosError) => Promise.reject(error)
    );

    // Response interceptor to handle errors
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          this.clearToken();
          // Optionally redirect to login
          if (typeof window !== 'undefined') {
            // window.location.href = '/auth/login';
          }
        }
        return Promise.reject(error);
      }
    );
  }

  private getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('access_token');
  }

  private clearToken(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }

  public setToken(token: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('access_token', token);
  }

  public getClient(): AxiosInstance {
    return this.client;
  }

  public async get<T>(url: string, params?: any): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.get<ApiResponse<T>>(url, { params });
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  public async post<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.post<ApiResponse<T>>(url, data);
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  public async put<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.put<ApiResponse<T>>(url, data);
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  public async delete<T>(url: string): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.delete<ApiResponse<T>>(url);
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  private handleError(error: any): ApiResponse {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        error: error.response?.data?.error || error.message,
        message: error.response?.data?.message || 'An error occurred',
      };
    }
    return {
      success: false,
      error: 'Unknown error occurred',
    };
  }
}

export const apiClient = new ApiClient();
export default apiClient;
