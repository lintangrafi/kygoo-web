import { apiClient, ApiResponse } from '@/src/lib/api-client';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin' | 'super_admin';
  avatar_url?: string;
  created_at: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  access_token: string;
  refresh_token: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface RegisterResponse {
  user: User;
  access_token: string;
  refresh_token: string;
}

export interface UpdateProfileRequest {
  name?: string;
  avatar_url?: string;
}

class AuthService {
  private baseUrl = '/auth';

  // Login
  async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    const response = await apiClient.post<LoginResponse>(`${this.baseUrl}/login`, credentials);
    if (response.data?.access_token) {
      apiClient.setToken(response.data.access_token);
    }
    return response;
  }

  // Register
  async register(data: RegisterRequest): Promise<ApiResponse<RegisterResponse>> {
    const response = await apiClient.post<RegisterResponse>(`${this.baseUrl}/register`, data);
    if (response.data?.access_token) {
      apiClient.setToken(response.data.access_token);
    }
    return response;
  }

  // Get current user
  async getCurrentUser(): Promise<ApiResponse<User>> {
    return apiClient.get<User>(`${this.baseUrl}/me`);
  }

  // Update profile
  async updateProfile(data: UpdateProfileRequest): Promise<ApiResponse<User>> {
    return apiClient.put<User>(`${this.baseUrl}/profile`, data);
  }

  // Change password
  async changePassword(currentPassword: string, newPassword: string): Promise<ApiResponse<void>> {
    return apiClient.put(`${this.baseUrl}/change-password`, {
      current_password: currentPassword,
      new_password: newPassword,
    });
  }

  // Logout
  async logout(): Promise<void> {
    try {
      await apiClient.post(`${this.baseUrl}/logout`, {});
    } catch (error) {
      console.error('Logout error:', error);
    }
    // Clear tokens locally
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
  }

  // Refresh token
  async refreshToken(refreshToken: string): Promise<ApiResponse<LoginResponse>> {
    const response = await apiClient.post<LoginResponse>(`${this.baseUrl}/refresh`, {
      refresh_token: refreshToken,
    });
    if (response.data?.access_token) {
      apiClient.setToken(response.data.access_token);
    }
    return response;
  }

  // Request password reset
  async requestPasswordReset(email: string): Promise<ApiResponse<void>> {
    return apiClient.post(`${this.baseUrl}/forgot-password`, { email });
  }

  // Reset password with token
  async resetPassword(token: string, newPassword: string): Promise<ApiResponse<void>> {
    return apiClient.post(`${this.baseUrl}/reset-password`, {
      token,
      new_password: newPassword,
    });
  }

  // Verify email
  async verifyEmail(token: string): Promise<ApiResponse<void>> {
    return apiClient.post(`${this.baseUrl}/verify-email`, { token });
  }

  // Resend verification email
  async resendVerificationEmail(email: string): Promise<ApiResponse<void>> {
    return apiClient.post(`${this.baseUrl}/resend-verification`, { email });
  }
}

export const authService = new AuthService();
export default authService;
