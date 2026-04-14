export type BusinessLineSlug = 'studio' | 'photobooth' | 'digital' | 'coffee';

export type BusinessLinePricingCard = {
	id?: string;
	business_line?: BusinessLineSlug;
	name: string;
	price: string;
	price_label?: string;
	features: string[];
	highlight?: boolean;
	description?: string;
	display_order?: number;
	is_active?: boolean;
};

const DEFAULT_BUSINESS_LINE_PRICING: Record<BusinessLineSlug, BusinessLinePricingCard[]> = {
	studio: [
		{
			name: 'Snow White',
			price: '50K / 10 menit',
			price_label: '50K / 10 menit',
			features: ['75K / 15 menit', 'Clean white setup', 'Soft bright portrait look'],
			description: 'Backdrop putih bersih untuk portrait yang clean dan lembut.',
		},
		{
			name: 'Nassau Blue',
			price: '50K / 10 menit',
			price_label: '50K / 10 menit',
			features: ['75K / 15 menit', 'Blue backdrop style', 'Portrait-ready studio look'],
			highlight: true,
			description: 'Background biru dengan mood studio yang tegas.',
		},
		{
			name: 'Grey Curtain',
			price: '35K / 5 menit',
			price_label: '35K / 5 menit',
			features: ['50K / 10 menit', 'Curtain-style background', 'Minimal and clean mood'],
			description: 'Set tirai abu-abu minimal untuk hasil foto yang kalem.',
		},
		{
			name: 'Livingroom',
			price: '50K / 10 menit',
			price_label: '50K / 10 menit',
			features: ['75K / 15 menit', 'Cozy indoor living room feel', 'Soft lifestyle look'],
			description: 'Nuansa ruang tamu hangat untuk sesi foto lifestyle.',
		},
		{
			name: 'Spotlight Box',
			price: '50K / 10 menit',
			price_label: '50K / 10 menit',
			features: ['75K / 15 menit', 'Single subject spotlight', 'Strong studio contrast'],
			description: 'Sesi dengan kontras spotlight untuk satu subjek.',
		},
		{
			name: 'Elevator Vintage',
			price: '35K / 1 sesi',
			price_label: '35K / 1 sesi',
			features: ['50K / 2 sesi', 'Vintage lift-inspired set', 'Retro editorial aesthetic'],
			description: 'Set bergaya vintage elevator untuk visual editorial.',
		},
		{
			name: 'Window Background',
			price: '50K / 10 menit',
			price_label: '50K / 10 menit',
			features: ['75K / 15 menit', 'Window-frame backdrop', 'Soft natural portrait style'],
			description: 'Backdrop frame jendela dengan mood natural.',
		},
		{
			name: 'Beige',
			price: '50K / 10 menit',
			price_label: '50K / 10 menit',
			features: ['75K / 15 menit', 'Warm beige tone', 'Neutral and elegant result'],
			description: 'Tone beige hangat dan elegan untuk portrait minimal.',
		},
		{
			name: 'Vintage Box',
			price: '50K / 10 menit',
			price_label: '50K / 10 menit',
			features: ['75K / 15 menit', 'Old-school box interior', 'Classic nostalgic composition'],
			description: 'Interior box vintage untuk hasil foto klasik.',
		},
		{
			name: 'Industrial Wall',
			price: '50K / 10 menit',
			price_label: '50K / 10 menit',
			features: ['75K / 15 menit', 'Concrete industrial texture', 'Bold urban portrait look'],
			description: 'Tekstur industrial concrete dengan karakter urban.',
		},
	],
	photobooth: [
		{
			name: 'Classic Photobooth',
			price: 'Mulai 1.800K',
			price_label: 'Mulai 1.800K',
			features: [
				'2 jam unlimited: 1.800K',
				'3 jam unlimited: 2.200K',
				'4 jam unlimited: 2.600K',
				'Include photo print + GIF',
				'2-3 crew, backdrop, accessories',
			],
			description: 'Paket dasar photobooth untuk event dengan flow cepat.',
		},
		{
			name: 'Full Body Photobooth',
			price: 'Mulai 2.350K',
			price_label: 'Mulai 2.350K',
			features: [
				'2 jam unlimited: 2.350K',
				'3 jam unlimited: 3.000K',
				'4 jam unlimited: 3.650K',
				'Include photo print + GIF',
				'2-3 crew, backdrop, accessories',
			],
			highlight: true,
			description: 'Format full body dengan set layar sentuh dan output print.',
		},
		{
			name: 'iPad Booth',
			price: 'Mulai 1.500K',
			price_label: 'Mulai 1.500K',
			features: [
				'2 jam unlimited: 1.500K',
				'3 jam unlimited: 1.850K',
				'4 jam unlimited: 2.200K',
				'Include photo print + GIF',
				'2-3 crew, backdrop, accessories',
			],
			description: 'Booth ringan dengan iPad untuk event yang lebih fleksibel.',
		},
		{
			name: 'Mingle Photo Booth',
			price: 'Mulai 2.250K',
			price_label: 'Mulai 2.250K',
			features: [
				'2 jam unlimited: 2.250K',
				'3 jam unlimited: 2.750K',
				'4 jam unlimited: 3.250K',
				'Custom design by request',
			],
			description: 'Booth untuk social activation dan experience yang ramai.',
		},
		{
			name: 'High Angle Photobooth',
			price: 'Mulai 3.000K',
			price_label: 'Mulai 3.000K',
			features: [
				'Pricelist day: 1 hari (10 jam) 12.000K',
				'3 hari 30.000K',
				'1 minggu 50.000K',
				'Include staff 2 person, branding box, custom frame',
			],
			description: 'Setup high angle untuk event yang butuh cakupan lebih lebar.',
		},
		{
			name: 'Videobooth Pricelist',
			price: 'Mulai 2.000K',
			price_label: 'Mulai 2.000K',
			features: [
				'3 jam unlimited: 2.000K',
				'4 jam unlimited: 2.400K',
				'5 jam unlimited: 2.800K',
				'Free custom design, request music',
			],
			description: 'Paket videobooth untuk output video singkat dan social content.',
		},
		{
			name: 'Wedding Content Creator',
			price: '799K',
			price_label: '799K',
			features: [
				'8 hours standby',
				'Up to 10-15 Instagram Story',
				'Up to 5 Story + Reels Instagram',
				'2 video trend TikTok',
			],
			description: 'Paket dokumentasi konten wedding dengan output vertikal.',
		},
	],
	digital: [
		{
			name: 'Startup',
			price: '5,000,000',
			price_label: '5,000,000',
			features: ['Landing Page', 'Responsive Design', 'SEO Basics', '3 Months Support'],
			description: 'Paket awal untuk landing page dan website sederhana.',
		},
		{
			name: 'Growth',
			price: '15,000,000',
			price_label: '15,000,000',
			features: ['Full Web App', 'Custom Design', 'Database Setup', 'API Integration', '6 Months Support'],
			highlight: true,
			description: 'Paket untuk web app dengan desain dan integrasi penuh.',
		},
		{
			name: 'Enterprise',
			price: 'Custom',
			price_label: 'Custom',
			features: ['Mobile + Web', 'Advanced Features', 'Dedicated Team', 'Ongoing Support'],
			description: 'Paket custom untuk solusi berskala besar.',
		},
	],
	coffee: [
		{
			name: 'Station',
			price: '3,500,000',
			price_label: '3,500,000',
			features: ['2 barista', 'Standard menu', 'Basic setup', '3 hours service'],
			description: 'Paket coffee station untuk event kecil hingga menengah.',
		},
		{
			name: 'Signature',
			price: '6,500,000',
			price_label: '6,500,000',
			features: ['3 barista', 'Signature menu', 'Custom cup branding', '5 hours service'],
			highlight: true,
			description: 'Paket signature dengan custom cup branding.',
		},
		{
			name: 'Hospitality',
			price: 'Custom',
			price_label: 'Custom',
			features: ['Dedicated crew', 'Premium menu', 'Brand experience', 'Full day coverage'],
			description: 'Paket premium untuk hospitality experience full day.',
		},
	],
};

export function getDefaultBusinessLinePricing(line: BusinessLineSlug): BusinessLinePricingCard[] {
	return DEFAULT_BUSINESS_LINE_PRICING[line].map((item, index) => ({
		...item,
		id: item.id ?? `${line}-${index + 1}`,
		business_line: line,
		price_label: item.price_label ?? item.price,
	}));
}

export function mapPricingApiItemsToCards(
	items: Array<{
		id: string;
		business_line: BusinessLineSlug;
		name: string;
		description: string;
		price_label: string;
		features: string[];
		highlight?: boolean;
		display_order?: number;
		is_active?: boolean;
	}>
): BusinessLinePricingCard[] {
	return items.map((item) => ({
		id: item.id,
		business_line: item.business_line,
		name: item.name,
		price: item.price_label,
		price_label: item.price_label,
		features: item.features ?? [],
		highlight: item.highlight,
		description: item.description,
		display_order: item.display_order,
		is_active: item.is_active,
	}));
}

export function sortPricingCards(cards: BusinessLinePricingCard[]): BusinessLinePricingCard[] {
	return [...cards].sort((left, right) => (left.display_order ?? 0) - (right.display_order ?? 0));
}