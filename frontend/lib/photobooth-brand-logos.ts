import { type BusinessLineLogo, type LogoSection } from '@/src/services/branding.service';

export type BrandLogoGroup = {
	section: LogoSection;
	title: string;
	items: BusinessLineLogo[];
};

const DEFAULT_PHOTOBOOTH_LOGOS: BusinessLineLogo[] = [
	{
		id: 'photobooth-partner-1',
		business_line: 'photobooth',
		section: 'partner',
		name: 'Partner 1',
		image_url: 'https://placehold.co/220x100/111827/f8fafc?text=Partner+1',
		alt_text: 'Partner logo 1',
		display_order: 1,
		is_active: true,
		created_at: '',
		updated_at: '',
	},
	{
		id: 'photobooth-partner-2',
		business_line: 'photobooth',
		section: 'partner',
		name: 'Partner 2',
		image_url: 'https://placehold.co/220x100/111827/f8fafc?text=Partner+2',
		alt_text: 'Partner logo 2',
		display_order: 2,
		is_active: true,
		created_at: '',
		updated_at: '',
	},
	{
		id: 'photobooth-partner-3',
		business_line: 'photobooth',
		section: 'partner',
		name: 'Partner 3',
		image_url: 'https://placehold.co/220x100/111827/f8fafc?text=Partner+3',
		alt_text: 'Partner logo 3',
		display_order: 3,
		is_active: true,
		created_at: '',
		updated_at: '',
	},
	{
		id: 'photobooth-client-1',
		business_line: 'photobooth',
		section: 'client',
		name: 'Client 1',
		image_url: 'https://placehold.co/220x100/1f2937/f8fafc?text=Client+1',
		alt_text: 'Client logo 1',
		display_order: 1,
		is_active: true,
		created_at: '',
		updated_at: '',
	},
	{
		id: 'photobooth-client-2',
		business_line: 'photobooth',
		section: 'client',
		name: 'Client 2',
		image_url: 'https://placehold.co/220x100/1f2937/f8fafc?text=Client+2',
		alt_text: 'Client logo 2',
		display_order: 2,
		is_active: true,
		created_at: '',
		updated_at: '',
	},
	{
		id: 'photobooth-client-3',
		business_line: 'photobooth',
		section: 'client',
		name: 'Client 3',
		image_url: 'https://placehold.co/220x100/1f2937/f8fafc?text=Client+3',
		alt_text: 'Client logo 3',
		display_order: 3,
		is_active: true,
		created_at: '',
		updated_at: '',
	},
];

export function getDefaultPhotoboothBrandLogos(): BrandLogoGroup[] {
	return [
		{ section: 'partner', title: 'Our Partner', items: DEFAULT_PHOTOBOOTH_LOGOS.filter((item) => item.section === 'partner') },
		{ section: 'client', title: 'Our Client', items: DEFAULT_PHOTOBOOTH_LOGOS.filter((item) => item.section === 'client') },
	];
}

export function groupBrandLogos(logos: BusinessLineLogo[]): BrandLogoGroup[] {
	const activeLogos = logos.filter((logo) => logo.is_active);
	const partner = activeLogos.filter((logo) => logo.section === 'partner');
	const client = activeLogos.filter((logo) => logo.section === 'client');

	return [
		{ section: 'partner', title: 'Our Partner', items: partner.length > 0 ? partner : getDefaultPhotoboothBrandLogos()[0].items },
		{ section: 'client', title: 'Our Client', items: client.length > 0 ? client : getDefaultPhotoboothBrandLogos()[1].items },
	];
}