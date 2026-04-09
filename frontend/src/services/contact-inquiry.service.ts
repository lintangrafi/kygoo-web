import { apiClient, type ApiResponse } from '@/src/lib/api-client';

export type ContactInquiryStatus = 'new' | 'responded' | 'closed';

export interface ContactInquiryItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  business_line: 'studio' | 'photobooth' | 'digital' | 'coffee';
  event_type: string;
  event_date: string;
  location: string;
  guest_count: string;
  budget_range: string;
  notes: string;
  message: string;
  status: ContactInquiryStatus;
  source: string;
  created_at: string;
  updated_at: string;
}

export interface CreateContactInquiryRequest {
  name: string;
  email: string;
  phone: string;
  business_line: ContactInquiryItem['business_line'];
  event_type: string;
  event_date: string;
  location: string;
  guest_count: string;
  budget_range: string;
  notes?: string;
  message: string;
  source?: string;
}

export interface UpdateContactInquiryStatusRequest {
  status: ContactInquiryStatus;
}

class ContactInquiryService {
  private baseUrl = '/v1/contact/inquiries';

  async createInquiry(payload: CreateContactInquiryRequest): Promise<ApiResponse<ContactInquiryItem>> {
    return apiClient.post<ContactInquiryItem>(this.baseUrl, payload);
  }

  async getRecentInquiries(limit = 10): Promise<ApiResponse<ContactInquiryItem[]>> {
    return apiClient.get<ContactInquiryItem[]>('/v1/admin/contact/inquiries', { limit });
  }

  async updateInquiryStatus(id: string, payload: UpdateContactInquiryStatusRequest): Promise<ApiResponse<ContactInquiryItem>> {
    return apiClient.put<ContactInquiryItem>(`/v1/admin/contact/inquiries/${id}`, payload);
  }
}

export const contactInquiryService = new ContactInquiryService();
export default contactInquiryService;
