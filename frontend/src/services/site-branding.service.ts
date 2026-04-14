import { apiClient, type ApiResponse } from '@/src/lib/api-client';

export interface SiteBranding {
	id: string;
	site_name: string;
	site_description: string;
	main_logo_url: string;
	main_logo_alt: string;
	is_active: boolean;
	created_at: string;
	updated_at: string;
}

export interface UpdateSiteBrandingRequest {
	site_name: string;
	site_description?: string;
	main_logo_url: string;
	main_logo_alt?: string;
	is_active?: boolean;
}

class SiteBrandingService {
	private baseUrl = '/v1/site-branding';
	private adminBaseUrl = '/v1/admin/site-branding';

	async getCurrent(): Promise<ApiResponse<SiteBranding>> {
		return apiClient.get<SiteBranding>(this.baseUrl);
	}

	async getAdminCurrent(): Promise<ApiResponse<SiteBranding>> {
		return apiClient.get<SiteBranding>(this.adminBaseUrl);
	}

	async updateCurrent(payload: UpdateSiteBrandingRequest): Promise<ApiResponse<SiteBranding>> {
		return apiClient.put<SiteBranding>(this.adminBaseUrl, payload);
	}
}

export const siteBrandingService = new SiteBrandingService();
export default siteBrandingService;