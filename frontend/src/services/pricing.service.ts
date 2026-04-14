import { apiClient, type ApiResponse } from '@/src/lib/api-client';
import { type BusinessLineSlug } from '@/lib/business-line-pricing';

export interface BusinessLinePackage {
	id: string;
	business_line: BusinessLineSlug;
	name: string;
	description: string;
	price_label: string;
	features: string[];
	highlight: boolean;
	display_order: number;
	is_active: boolean;
	created_at: string;
	updated_at: string;
}

export interface CreateBusinessLinePackageRequest {
	business_line: BusinessLineSlug;
	name: string;
	description?: string;
	price_label: string;
	features?: string[];
	highlight?: boolean;
	display_order?: number;
	is_active?: boolean;
}

export interface UpdateBusinessLinePackageRequest {
	business_line?: BusinessLineSlug;
	name?: string;
	description?: string;
	price_label?: string;
	features?: string[];
	highlight?: boolean;
	display_order?: number;
	is_active?: boolean;
}

class BusinessLinePricingService {
	private baseUrl = '/v1/pricing';
	private adminBaseUrl = '/v1/admin/pricing';

	async listPackages(
		businessLine?: BusinessLineSlug,
		includeInactive = false
	): Promise<ApiResponse<BusinessLinePackage[]>> {
		return apiClient.get<BusinessLinePackage[]>(this.baseUrl, {
			business_line: businessLine,
			include_inactive: includeInactive,
		});
	}

	async getPackage(id: string, includeInactive = false): Promise<ApiResponse<BusinessLinePackage>> {
		return apiClient.get<BusinessLinePackage>(`${this.baseUrl}/${id}`, { include_inactive: includeInactive });
	}

	async listAdminPackages(includeInactive = true): Promise<ApiResponse<BusinessLinePackage[]>> {
		return apiClient.get<BusinessLinePackage[]>(this.adminBaseUrl, {
			include_inactive: includeInactive,
		});
	}

	async createPackage(payload: CreateBusinessLinePackageRequest): Promise<ApiResponse<BusinessLinePackage>> {
		return apiClient.post<BusinessLinePackage>(this.adminBaseUrl, payload);
	}

	async updatePackage(id: string, payload: UpdateBusinessLinePackageRequest): Promise<ApiResponse<BusinessLinePackage>> {
		return apiClient.put<BusinessLinePackage>(`${this.adminBaseUrl}/${id}`, payload);
	}

	async deletePackage(id: string): Promise<ApiResponse<null>> {
		return apiClient.delete<null>(`${this.adminBaseUrl}/${id}`);
	}
}

export const businessLinePricingService = new BusinessLinePricingService();
export default businessLinePricingService;