import { apiClient, type ApiResponse } from '@/src/lib/api-client';

export type LogoSection = 'partner' | 'client';
export type HeaderLogoSection = 'header';
export type AnyLogoSection = LogoSection | HeaderLogoSection;

export interface BusinessLineLogo {
	id: string;
	business_line: 'studio' | 'photobooth' | 'digital' | 'coffee';
	section: AnyLogoSection;
	name: string;
	image_url: string;
	alt_text: string;
	display_order: number;
	display_width: number;
	display_height: number;
	is_active: boolean;
	created_at: string;
	updated_at: string;
}

export interface CreateBusinessLineLogoRequest {
	business_line: BusinessLineLogo['business_line'];
	section: AnyLogoSection;
	name: string;
	image_url: string;
	alt_text?: string;
	display_order?: number;
	display_width?: number;
	display_height?: number;
	is_active?: boolean;
}

export interface UpdateBusinessLineLogoRequest {
	business_line?: BusinessLineLogo['business_line'];
	section?: AnyLogoSection;
	name?: string;
	image_url?: string;
	alt_text?: string;
	display_order?: number;
	display_width?: number;
	display_height?: number;
	is_active?: boolean;
}

type UploadLogoResponse = {
	url: string;
};

function isRouteNotFound(response: ApiResponse<unknown>): boolean {
	const msg = `${response.error || ''} ${response.message || ''}`.toLowerCase();
	return msg.includes('route not found') || msg.includes('404');
}

class BusinessLineBrandingService {
	private baseUrl = '/v1/branding/logos';
	private adminBaseUrl = '/v1/admin/branding/logos';
	private uploadUrl = '/v1/admin/branding/logos/upload';

	async listLogos(businessLine?: BusinessLineLogo['business_line'], includeInactive = false): Promise<ApiResponse<BusinessLineLogo[]>> {
		return apiClient.get<BusinessLineLogo[]>(this.baseUrl, {
			business_line: businessLine,
			include_inactive: includeInactive,
		});
	}

	async getLogo(id: string, includeInactive = false): Promise<ApiResponse<BusinessLineLogo>> {
		return apiClient.get<BusinessLineLogo>(`${this.baseUrl}/${id}`, { include_inactive: includeInactive });
	}

	async listAdminLogos(includeInactive = true): Promise<ApiResponse<BusinessLineLogo[]>> {
		const primary = await apiClient.get<BusinessLineLogo[]>(this.adminBaseUrl, { include_inactive: includeInactive });
		if (!primary.error || !isRouteNotFound(primary)) {
			return primary;
		}
		return this.listLogos(undefined, includeInactive);
	}

	async createLogo(payload: CreateBusinessLineLogoRequest): Promise<ApiResponse<BusinessLineLogo>> {
		const primary = await apiClient.post<BusinessLineLogo>(this.adminBaseUrl, payload);
		if (!primary.error || !isRouteNotFound(primary)) {
			return primary;
		}
		return apiClient.post<BusinessLineLogo>(this.baseUrl, payload);
	}

	async updateLogo(id: string, payload: UpdateBusinessLineLogoRequest): Promise<ApiResponse<BusinessLineLogo>> {
		const primary = await apiClient.put<BusinessLineLogo>(`${this.adminBaseUrl}/${id}`, payload);
		if (!primary.error || !isRouteNotFound(primary)) {
			return primary;
		}
		return apiClient.put<BusinessLineLogo>(`${this.baseUrl}/${id}`, payload);
	}

	async deleteLogo(id: string): Promise<ApiResponse<null>> {
		const primary = await apiClient.delete<null>(`${this.adminBaseUrl}/${id}`);
		if (!primary.error || !isRouteNotFound(primary)) {
			return primary;
		}
		return apiClient.delete<null>(`${this.baseUrl}/${id}`);
	}

	async uploadLogo(file: File, businessLine?: BusinessLineLogo['business_line']): Promise<ApiResponse<UploadLogoResponse>> {
		try {
			const formData = new FormData();
			formData.append('file', file);
			if (businessLine) {
				formData.append('business_line', businessLine);
			}

			const response = await apiClient.getClient().post<ApiResponse<UploadLogoResponse>>(
				this.uploadUrl,
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
				message: error.response?.data?.message || 'Gagal upload logo',
			};
		}
	}
}

export const businessLineBrandingService = new BusinessLineBrandingService();
export default businessLineBrandingService;