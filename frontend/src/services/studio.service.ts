import { apiClient, ApiResponse, PaginatedResponse } from '@/src/lib/api-client';

export interface IStudioService {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: string;
  gallery?: string[];
}

export interface StudioPackage {
  id: string;
  name: string;
  price: number;
  duration: string;
  features: string[];
  included: string[];
}

export interface StudioBooking {
  id: string;
  service_id: string;
  customer_name: string;
  customer_email: string;
  date: string;
  time: string;
  notes?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
}

class StudioService {
  private baseUrl = '/studio';

  // Get all services
  async getServices(): Promise<ApiResponse<IStudioService[]>> {
    return apiClient.get<IStudioService[]>(`${this.baseUrl}/services`);
  }

  // Get single service
  async getService(id: string): Promise<ApiResponse<IStudioService>> {
    return apiClient.get<IStudioService>(`${this.baseUrl}/services/${id}`);
  }

  // Get all packages
  async getPackages(): Promise<ApiResponse<StudioPackage[]>> {
    return apiClient.get<StudioPackage[]>(`${this.baseUrl}/packages`);
  }

  // Get package by ID
  async getPackage(id: string): Promise<ApiResponse<StudioPackage>> {
    return apiClient.get<StudioPackage>(`${this.baseUrl}/packages/${id}`);
  }

  // Create booking
  async createBooking(booking: Omit<StudioBooking, 'id' | 'status'>): Promise<ApiResponse<StudioBooking>> {
    return apiClient.post<StudioBooking>(`${this.baseUrl}/bookings`, booking);
  }

  // Get bookings
  async getBookings(page = 1, limit = 10): Promise<ApiResponse<PaginatedResponse<StudioBooking>>> {
    return apiClient.get<PaginatedResponse<StudioBooking>>(`${this.baseUrl}/bookings`, {
      page,
      limit,
    });
  }

  // Get booking by ID
  async getBooking(id: string): Promise<ApiResponse<StudioBooking>> {
    return apiClient.get<StudioBooking>(`${this.baseUrl}/bookings/${id}`);
  }

  // Update booking
  async updateBooking(id: string, booking: Partial<StudioBooking>): Promise<ApiResponse<StudioBooking>> {
    return apiClient.put<StudioBooking>(`${this.baseUrl}/bookings/${id}`, booking);
  }

  // Cancel booking
  async cancelBooking(id: string): Promise<ApiResponse<StudioBooking>> {
    return apiClient.put<StudioBooking>(`${this.baseUrl}/bookings/${id}/cancel`, {});
  }

  // Get gallery images
  async getGallery(): Promise<ApiResponse<string[]>> {
    return apiClient.get<string[]>(`${this.baseUrl}/gallery`);
  }
}

export const studioService = new StudioService();
export default studioService;
