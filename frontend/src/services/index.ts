// Export all API services
export { authService, type User, type LoginRequest, type LoginResponse } from './auth.service';
export { studioService, type IStudioService, type StudioBooking } from './studio.service';
export { photoboothService, type PhotoboothEvent, type PhotoboothPackage } from './photobooth.service';
export { digitalService, type DigitalProject, type PortfolioItem } from './digital.service';
export { coffeeService, type MenuItem, type CoffeeOrder, type CoffeeEvent } from './coffee.service';
export {
	siteBrandingService,
	type SiteBranding,
	type UpdateSiteBrandingRequest,
} from './site-branding.service';
export {
	businessLineBrandingService,
	type BusinessLineLogo,
	type CreateBusinessLineLogoRequest,
	type UpdateBusinessLineLogoRequest,
	type LogoSection,
} from './branding.service';
export {
	businessLinePricingService,
	type BusinessLinePackage,
	type CreateBusinessLinePackageRequest,
	type UpdateBusinessLinePackageRequest,
} from './pricing.service';
export {
	contactInquiryService,
	type ContactInquiryItem,
	type ContactInquiryStatus,
	type CreateContactInquiryRequest,
	type UpdateContactInquiryStatusRequest,
} from './contact-inquiry.service';
export {
	businessProjectService,
	type BusinessLineSlug,
	type BusinessProjectItem,
	type BusinessProjectGalleryItem,
	type BusinessProjectAuditLog,
	type CreateBusinessProjectRequest,
	type UpdateBusinessProjectRequest,
} from './business-project.service';

// Re-export API client
export { apiClient, type ApiResponse, type PaginatedResponse } from '@/src/lib/api-client';
