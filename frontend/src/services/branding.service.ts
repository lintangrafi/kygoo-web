import { apiClient, type ApiResponse } from '@/src/lib/api-client';

export type LogoSection = 'partner' | 'client';

export interface BusinessLineLogo {
	id: string;
	business_line: 'studio' | 'photobooth' | 'digital' | 'coffee';
	section: LogoSection;
	name: string;
	image_url: string;
	alt_text: string;
	display_order: number;
	is_active: boolean;
	created_at: string;
	updated_at: string;
}

export interface CreateBusinessLineLogoRequest {
	business_line: BusinessLineLogo['business_line'];
	section: LogoSection;
	name: string;
	image_url: string;
	alt_text?: string;
	display_order?: number;
	is_active?: boolean;
}

export interface UpdateBusinessLineLogoRequest {
	business_line?: BusinessLineLogo['business_line'];
	section?: LogoSection;
	name?: string;
	image_url?: string;
	alt_text?: string;
	display_order?: number;
	is_active?: boolean;
}

class BusinessLineBrandingService {
	private baseUrl = '/v1/branding/logos';
	private adminBaseUrl = '/v1/admin/branding/logos';

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
		return apiClient.get<BusinessLineLogo[]>(this.adminBaseUrl, { include_inactive: includeInactive });
	}

	async createLogo(payload: CreateBusinessLineLogoRequest): Promise<ApiResponse<BusinessLineLogo>> {
		return apiClient.post<BusinessLineLogo>(this.adminBaseUrl, payload);
	}

	async updateLogo(id: string, payload: UpdateBusinessLineLogoRequest): Promise<ApiResponse<BusinessLineLogo>> {
		return apiClient.put<BusinessLineLogo>(`${this.adminBaseUrl}/${id}`, payload);
	}

	async deleteLogo(id: string): Promise<ApiResponse<null>> {
		return apiClient.delete<null>(`${this.adminBaseUrl}/${id}`);
	}
}

export const businessLineBrandingService = new BusinessLineBrandingService();
export default businessLineBrandingService;