import { apiClient, type ApiResponse } from '@/src/lib/api-client';

export interface SiteBranding {
	id: string;
	site_name: string;
	site_description: string;
	main_logo_url: string;
	main_logo_alt: string;
	main_logo_size: number;
	header_logo_rounded: boolean;
	is_active: boolean;
	created_at: string;
	updated_at: string;
}

export interface UpdateSiteBrandingRequest {
	site_name: string;
	site_description?: string;
	main_logo_url: string;
	main_logo_alt?: string;
	main_logo_size?: number;
	header_logo_rounded?: boolean;
	is_active?: boolean;
}

type UploadLogoResponse = {
	url: string;
};

function isRouteNotFound(response: ApiResponse<unknown>): boolean {
	const msg = `${response.error || ''} ${response.message || ''}`.toLowerCase();
	return msg.includes('route not found') || msg.includes('404');
}

class SiteBrandingService {
	private baseUrl = '/v1/site-branding';
	private adminBaseUrl = '/v1/admin/site-branding';
	private uploadEndpoint = '/v1/admin/site-branding/upload-logo';

	async getCurrent(): Promise<ApiResponse<SiteBranding>> {
		return apiClient.get<SiteBranding>(this.baseUrl);
	}

	async getAdminCurrent(): Promise<ApiResponse<SiteBranding>> {
		const primary = await apiClient.get<SiteBranding>(this.adminBaseUrl);
		if (!primary.error || !isRouteNotFound(primary)) {
			return primary;
		}
		return apiClient.get<SiteBranding>(this.baseUrl);
	}

	async updateCurrent(payload: UpdateSiteBrandingRequest): Promise<ApiResponse<SiteBranding>> {
		const primary = await apiClient.put<SiteBranding>(this.adminBaseUrl, payload);
		if (!primary.error || !isRouteNotFound(primary)) {
			return primary;
		}
		return apiClient.put<SiteBranding>(this.baseUrl, payload);
	}

	async uploadLogo(file: File): Promise<ApiResponse<UploadLogoResponse>> {
		try {
			const formData = new FormData();
			formData.append('file', file);

			const response = await apiClient.getClient().post<ApiResponse<UploadLogoResponse>>(
				this.uploadEndpoint,
				formData,
				{
					headers: {
						'Content-Type': 'multipart/form-data',
					},
				}
			);

			return response.data;
		} catch (error: any) {
			return {
				success: false,
				error: error.response?.data?.error || error.message,
				message: error.response?.data?.message || 'Gagal upload logo utama',
			};
		}
	}
}

export const siteBrandingService = new SiteBrandingService();
export default siteBrandingService;