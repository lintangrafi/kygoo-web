import { apiClient, ApiResponse } from '@/src/lib/api-client';
import { normalizeMediaUrl } from '@/src/lib/media-url';

export type BusinessLineSlug = 'studio' | 'photobooth' | 'digital' | 'coffee';

export interface BusinessProjectItem {
  id: string;
  business_line: BusinessLineSlug;
  name: string;
  event_location: string;
  day: number;
  month: number;
  year: string;
  impact: string;
  sort_order: number;
  is_active: boolean;
  gallery: BusinessProjectGalleryItem[];
  created_at: string;
  updated_at: string;
}

export interface BusinessProjectGalleryItem {
  id: string;
  project_id: string;
  file_url: string;
  file_name: string;
  is_cover: boolean;
  sort_order: number;
  created_at: string;
}

export interface BusinessProjectAuditLog {
  id: string;
  project_id: string;
  action: 'create' | 'update' | 'delete';
  changed_by: string;
  changed_at: string;
  before_data: string;
  after_data: string;
}

export interface CreateBusinessProjectRequest {
  business_line: BusinessLineSlug;
  name: string;
  event_location: string;
  day: number;
  month: number;
  year: string;
  impact: string;
  sort_order: number;
  is_active: boolean;
}

export interface UpdateBusinessProjectRequest {
  business_line?: BusinessLineSlug;
  name?: string;
  event_location?: string;
  day?: number;
  month?: number;
  year?: string;
  impact?: string;
  sort_order?: number;
  is_active?: boolean;
}

class BusinessProjectService {
  private adminBaseUrl = '/v1/admin/business-projects';
  private publicBaseUrl = '/v1/business-projects';

  private normalizeProject(project: BusinessProjectItem): BusinessProjectItem {
    return {
      ...project,
      gallery: (project.gallery || []).map(item => ({
        ...item,
        file_url: normalizeMediaUrl(item.file_url),
      })),
    };
  }

  private normalizeProjects(projects: BusinessProjectItem[]): BusinessProjectItem[] {
    return (projects || []).map(project => this.normalizeProject(project));
  }

  async getProjectsByLine(line: BusinessLineSlug): Promise<ApiResponse<BusinessProjectItem[]>> {
    const response = await apiClient.get<BusinessProjectItem[]>(`${this.publicBaseUrl}`, {
      business_line: line,
    });

    if (!response.error && response.data) {
      response.data = this.normalizeProjects(response.data);
    }

    return response;
  }

  async getAllProjects(includeInactive = true): Promise<ApiResponse<BusinessProjectItem[]>> {
    const response = await apiClient.get<BusinessProjectItem[]>(`${this.adminBaseUrl}`, {
      include_inactive: includeInactive,
    });

    if (!response.error && response.data) {
      response.data = this.normalizeProjects(response.data);
    }

    return response;
  }

  async createProject(payload: CreateBusinessProjectRequest): Promise<ApiResponse<BusinessProjectItem>> {
    const response = await apiClient.post<BusinessProjectItem>(`${this.adminBaseUrl}`, payload);
    if (!response.error && response.data) {
      response.data = this.normalizeProject(response.data);
    }
    return response;
  }

  async updateProject(id: string, payload: UpdateBusinessProjectRequest): Promise<ApiResponse<BusinessProjectItem>> {
    const response = await apiClient.put<BusinessProjectItem>(`${this.adminBaseUrl}/${id}`, payload);
    if (!response.error && response.data) {
      response.data = this.normalizeProject(response.data);
    }
    return response;
  }

  async deleteProject(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`${this.adminBaseUrl}/${id}`);
  }

  async getAuditLogs(projectId?: string, limit = 50): Promise<ApiResponse<BusinessProjectAuditLog[]>> {
    return apiClient.get<BusinessProjectAuditLog[]>(`${this.adminBaseUrl}/audit-logs`, {
      project_id: projectId,
      limit,
    });
  }

  async getProjectDetail(id: string): Promise<ApiResponse<BusinessProjectItem>> {
    const response = await apiClient.get<BusinessProjectItem>(`${this.publicBaseUrl}/${id}`);
    if (!response.error && response.data) {
      response.data = this.normalizeProject(response.data);
    }
    return response;
  }

  async uploadProjectGallery(id: string, files: File[]): Promise<ApiResponse<BusinessProjectGalleryItem[]>> {
    try {
      const formData = new FormData();
      files.forEach(file => formData.append('files', file));

      const response = await apiClient.getClient().post<ApiResponse<BusinessProjectGalleryItem[]>>(
        `${this.adminBaseUrl}/${id}/gallery`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (!response.data.error && response.data.data) {
        response.data.data = response.data.data.map(item => ({
          ...item,
          file_url: normalizeMediaUrl(item.file_url),
        }));
      }

      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || error.message,
        message: error.response?.data?.message || 'Gagal upload file galeri',
      };
    }
  }

  async deleteProjectGalleryItem(projectId: string, mediaId: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`${this.adminBaseUrl}/${projectId}/gallery/${mediaId}`);
  }

  async updateProjectGallerySort(projectId: string, mediaId: string, sortOrder: number): Promise<ApiResponse<void>> {
    return apiClient.put<void>(`${this.adminBaseUrl}/${projectId}/gallery/${mediaId}/sort`, {
      sort_order: sortOrder,
    });
  }

  async setProjectGalleryCover(projectId: string, mediaId: string): Promise<ApiResponse<void>> {
    return apiClient.put<void>(`${this.adminBaseUrl}/${projectId}/gallery/${mediaId}/cover`);
  }
}

export const businessProjectService = new BusinessProjectService();
