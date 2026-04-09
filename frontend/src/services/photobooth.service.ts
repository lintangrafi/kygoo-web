import { apiClient, ApiResponse, PaginatedResponse } from '@/src/lib/api-client';

export interface PhotoboothPackage {
  id: string;
  name: string;
  description: string;
  duration_hours: number;
  price: number;
  features: string[];
}

export interface PhotoboothEvent {
  id: string;
  package_id: string;
  event_name: string;
  event_date: string;
  event_time: string;
  location: string;
  organizer_name: string;
  organizer_email: string;
  organizer_phone: string;
  guest_count: number;
  special_requests?: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  price: number;
}

export interface PhotoboothGallery {
  id: string;
  event_id: string;
  image_url: string;
  uploaded_at: string;
}

class PhotoboothService {
  private baseUrl = '/photobooth';

  // Get all packages
  async getPackages(): Promise<ApiResponse<PhotoboothPackage[]>> {
    return apiClient.get<PhotoboothPackage[]>(`${this.baseUrl}/packages`);
  }

  // Get package by ID
  async getPackage(id: string): Promise<ApiResponse<PhotoboothPackage>> {
    return apiClient.get<PhotoboothPackage>(`${this.baseUrl}/packages/${id}`);
  }

  // Create event booking
  async createEvent(event: Omit<PhotoboothEvent, 'id' | 'status'>): Promise<ApiResponse<PhotoboothEvent>> {
    return apiClient.post<PhotoboothEvent>(`${this.baseUrl}/events`, event);
  }

  // Get events
  async getEvents(page = 1, limit = 10): Promise<ApiResponse<PaginatedResponse<PhotoboothEvent>>> {
    return apiClient.get<PaginatedResponse<PhotoboothEvent>>(`${this.baseUrl}/events`, {
      page,
      limit,
    });
  }

  // Get event by ID
  async getEvent(id: string): Promise<ApiResponse<PhotoboothEvent>> {
    return apiClient.get<PhotoboothEvent>(`${this.baseUrl}/events/${id}`);
  }

  // Update event
  async updateEvent(id: string, event: Partial<PhotoboothEvent>): Promise<ApiResponse<PhotoboothEvent>> {
    return apiClient.put<PhotoboothEvent>(`${this.baseUrl}/events/${id}`, event);
  }

  // Cancel event
  async cancelEvent(id: string): Promise<ApiResponse<PhotoboothEvent>> {
    return apiClient.put<PhotoboothEvent>(`${this.baseUrl}/events/${id}/cancel`, {});
  }

  // Get event gallery
  async getEventGallery(eventId: string): Promise<ApiResponse<PhotoboothGallery[]>> {
    return apiClient.get<PhotoboothGallery[]>(`${this.baseUrl}/events/${eventId}/gallery`);
  }

  // Upload photo
  async uploadPhoto(eventId: string, file: File): Promise<ApiResponse<PhotoboothGallery>> {
    const formData = new FormData();
    formData.append('image', file);

    // Note: This bypasses the normal apiClient for FormData
    const response = await apiClient.getClient().post<ApiResponse<PhotoboothGallery>>(
      `${this.baseUrl}/events/${eventId}/upload`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  }

  // Get trending photos
  async getTrendingPhotos(limit = 12): Promise<ApiResponse<PhotoboothGallery[]>> {
    return apiClient.get<PhotoboothGallery[]>(`${this.baseUrl}/trending`, { limit });
  }
}

export const photoboothService = new PhotoboothService();
export default photoboothService;
