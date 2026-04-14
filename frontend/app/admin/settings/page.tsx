'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
	businessLineBrandingService,
	type BusinessLineLogo,
	type CreateBusinessLineLogoRequest,
	type UpdateBusinessLineLogoRequest,
	siteBrandingService,
	type UpdateSiteBrandingRequest,
} from '@/src/services';
import { type BusinessLineSlug } from '@/lib/business-line-pricing';
import { type AnyLogoSection } from '@/src/services/branding.service';

const containerVariants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: { staggerChildren: 0.1, delayChildren: 0.2 },
	},
};

const itemVariants = {
	hidden: { opacity: 0, y: 20 },
	visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

type SiteBrandingForm = {
	siteName: string;
	siteDescription: string;
	mainLogoUrl: string;
	mainLogoAlt: string;
	mainLogoSize: number;
	headerLogoRounded: boolean;
	isActive: boolean;
};

type BusinessLogoForm = {
	id?: string;
	business_line: BusinessLineSlug;
	section: AnyLogoSection;
	name: string;
	image_url: string;
	alt_text: string;
	display_order: number;
	display_width: number;
	display_height: number;
	is_active: boolean;
};

const EMPTY_BUSINESS_LOGO: BusinessLogoForm = {
	business_line: 'photobooth',
	section: 'partner',
	name: '',
	image_url: '',
	alt_text: '',
	display_order: 0,
	display_width: 150,
	display_height: 64,
	is_active: true,
};

const BUSINESS_LINES: Array<{ value: BusinessLineSlug; label: string; color: string }> = [
	{ value: 'studio', label: 'Studio', color: '#d4af37' },
	{ value: 'photobooth', label: 'Photobooth', color: '#ff006e' },
	{ value: 'digital', label: 'Digital', color: '#00d084' },
	{ value: 'coffee', label: 'Coffee', color: '#d97706' },
];

export default function SettingsPage() {
	const [activeTab, setActiveTab] = useState<string>('branding');
	const [siteBranding, setSiteBranding] = useState<SiteBrandingForm>({
		siteName: 'Kygoo Group',
		siteDescription: 'Premium services across multiple business lines',
		mainLogoUrl: '/logo_icon.png',
		mainLogoAlt: 'Kygoo Group',
		mainLogoSize: 40,
		headerLogoRounded: true,
		isActive: true,
	});
	const [siteBrandingLoading, setSiteBrandingLoading] = useState(true);
	const [siteBrandingSaving, setSiteBrandingSaving] = useState(false);
	const [siteBrandingUploading, setSiteBrandingUploading] = useState(false);
	const [siteBrandingError, setSiteBrandingError] = useState('');

	const [businessLogos, setBusinessLogos] = useState<BusinessLineLogo[]>([]);
	const [businessLogoForm, setBusinessLogoForm] = useState<BusinessLogoForm>(EMPTY_BUSINESS_LOGO);
	const [businessLoading, setBusinessLoading] = useState(true);
	const [businessSaving, setBusinessSaving] = useState(false);
	const [businessUploading, setBusinessUploading] = useState(false);
	const [businessError, setBusinessError] = useState('');
	const [businessSuccess, setBusinessSuccess] = useState('');

	const filteredBusinessLogos = useMemo(
		() => businessLogos.filter((logo) => logo.business_line === businessLogoForm.business_line),
		[businessLogos, businessLogoForm.business_line]
	);

	useEffect(() => {
		let mounted = true;

		const loadBranding = async () => {
			setSiteBrandingLoading(true);
			setSiteBrandingError('');

			const [brandingResponse, logosResponse] = await Promise.all([
				siteBrandingService.getAdminCurrent(),
				businessLineBrandingService.listAdminLogos(true),
			]);

			if (!mounted) {
				return;
			}

			if (!brandingResponse.error && brandingResponse.data) {
				setSiteBranding({
					siteName: brandingResponse.data.site_name,
					siteDescription: brandingResponse.data.site_description,
					mainLogoUrl: brandingResponse.data.main_logo_url,
					mainLogoAlt: brandingResponse.data.main_logo_alt,
					mainLogoSize: brandingResponse.data.main_logo_size || 40,
					headerLogoRounded:
						typeof brandingResponse.data.header_logo_rounded === 'boolean'
							? brandingResponse.data.header_logo_rounded
							: true,
					isActive: brandingResponse.data.is_active,
				});
			} else {
				setSiteBrandingError(brandingResponse.message || brandingResponse.error || 'Gagal memuat site branding.');
			}

			if (!logosResponse.error && logosResponse.data) {
				setBusinessLogos(logosResponse.data);
			} else {
				setBusinessError(logosResponse.message || logosResponse.error || 'Gagal memuat business logos.');
			}

			setSiteBrandingLoading(false);
			setBusinessLoading(false);
		};

		loadBranding();

		return () => {
			mounted = false;
		};
	}, []);

	const handleSaveSiteBranding = async () => {
		setSiteBrandingSaving(true);
		setSiteBrandingError('');

		const payload: UpdateSiteBrandingRequest = {
			site_name: siteBranding.siteName.trim(),
			site_description: siteBranding.siteDescription.trim(),
			main_logo_url: siteBranding.mainLogoUrl.trim(),
			main_logo_alt: siteBranding.mainLogoAlt.trim(),
			main_logo_size: siteBranding.mainLogoSize,
			header_logo_rounded: siteBranding.headerLogoRounded,
			is_active: siteBranding.isActive,
		};

		const response = await siteBrandingService.updateCurrent(payload);
		if (response.error || !response.data) {
			setSiteBrandingError(response.message || response.error || 'Gagal menyimpan branding utama.');
		} else {
			setSiteBranding({
				siteName: response.data.site_name,
				siteDescription: response.data.site_description,
				mainLogoUrl: response.data.main_logo_url,
				mainLogoAlt: response.data.main_logo_alt,
				mainLogoSize: response.data.main_logo_size || 40,
				headerLogoRounded:
					typeof response.data.header_logo_rounded === 'boolean' ? response.data.header_logo_rounded : true,
				isActive: response.data.is_active,
			});
		}

		setSiteBrandingSaving(false);
	};

	const resetBusinessForm = (line: BusinessLineSlug = businessLogoForm.business_line) => {
		setBusinessLogoForm({ ...EMPTY_BUSINESS_LOGO, business_line: line });
	};

	const handleEditBusinessLogo = (logo: BusinessLineLogo) => {
		setBusinessLogoForm({
			id: logo.id,
			business_line: logo.business_line,
			section: logo.section,
			name: logo.name,
			image_url: logo.image_url,
			alt_text: logo.alt_text || '',
			display_order: logo.display_order,
			display_width: logo.display_width || 150,
			display_height: logo.display_height || 64,
			is_active: logo.is_active,
		});
	};

	const handleUploadMainLogo = async (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (!file) {
			return;
		}

		setSiteBrandingUploading(true);
		setSiteBrandingError('');

		const response = await siteBrandingService.uploadLogo(file);
		if (response.error || !response.data?.url) {
			setSiteBrandingError(response.message || response.error || 'Gagal upload logo utama.');
		} else {
			setSiteBranding((prev) => ({ ...prev, mainLogoUrl: response.data?.url || prev.mainLogoUrl }));
		}

		event.target.value = '';
		setSiteBrandingUploading(false);
	};

	const handleUploadBusinessLogo = async (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (!file) {
			return;
		}

		setBusinessUploading(true);
		setBusinessError('');

		const response = await businessLineBrandingService.uploadLogo(file, businessLogoForm.business_line);
		if (response.error || !response.data?.url) {
			setBusinessError(response.message || response.error || 'Gagal upload logo lini bisnis.');
		} else {
			setBusinessLogoForm((prev) => ({ ...prev, image_url: response.data?.url || prev.image_url }));
		}

		event.target.value = '';
		setBusinessUploading(false);
	};

	const handleSaveBusinessLogo = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setBusinessSaving(true);
		setBusinessError('');
		setBusinessSuccess('');

		const payload = {
			business_line: businessLogoForm.business_line,
			section: businessLogoForm.section,
			name: businessLogoForm.name.trim(),
			image_url: businessLogoForm.image_url.trim(),
			alt_text: businessLogoForm.alt_text.trim(),
			display_order: businessLogoForm.display_order,
			display_width: businessLogoForm.display_width,
			display_height: businessLogoForm.display_height,
			is_active: businessLogoForm.is_active,
		};

		const response = businessLogoForm.id
			? await businessLineBrandingService.updateLogo(businessLogoForm.id, payload as UpdateBusinessLineLogoRequest)
			: await businessLineBrandingService.createLogo(payload as CreateBusinessLineLogoRequest);

		if (response.error || !response.data) {
			setBusinessError(response.message || response.error || 'Gagal menyimpan logo lini bisnis.');
		} else {
			setBusinessSuccess(businessLogoForm.id ? 'Logo diperbarui.' : 'Logo ditambahkan.');
			resetBusinessForm(businessLogoForm.business_line);
			const refreshed = await businessLineBrandingService.listAdminLogos(true);
			if (!refreshed.error && refreshed.data) {
				setBusinessLogos(refreshed.data);
			}
		}

		setBusinessSaving(false);
	};

	const handleDeleteBusinessLogo = async (id: string) => {
		if (!window.confirm('Hapus logo ini?')) {
			return;
		}

		setBusinessError('');
		setBusinessSuccess('');

		const response = await businessLineBrandingService.deleteLogo(id);
		if (response.error) {
			setBusinessError(response.message || response.error || 'Gagal menghapus logo.');
			return;
		}

		if (businessLogoForm.id === id) {
			resetBusinessForm(businessLogoForm.business_line);
		}

		const refreshed = await businessLineBrandingService.listAdminLogos(true);
		if (!refreshed.error && refreshed.data) {
			setBusinessLogos(refreshed.data);
		}
	};

	return (
		<div className="w-full bg-gradient-to-b from-slate-950 via-gray-900 to-slate-950 min-h-screen text-white">
			<div className="border-b border-slate-800/50 backdrop-blur-md sticky top-0 z-50">
				<div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
					<div>
						<h1 className="text-3xl font-bold">Settings</h1>
						<p className="text-gray-400 text-sm mt-1">Kelola logo utama Kygoo Group dan logo lini bisnis dari CMS</p>
					</div>
					<Link href="/admin" className="px-6 py-2 rounded-lg border border-slate-700 hover:border-current transition-all">
						← Back
					</Link>
				</div>
			</div>

			<div className="max-w-7xl mx-auto px-6 py-12">
				<motion.div className="flex gap-4 mb-8 border-b border-slate-800 pb-4 flex-wrap" variants={containerVariants} initial="hidden" animate="visible">
					{[
						{ id: 'branding', label: 'Branding', icon: '🪪' },
						{ id: 'general', label: 'General', icon: '⚙️' },
						{ id: 'business', label: 'Business Lines', icon: '🏢' },
						{ id: 'integrations', label: 'Integrations', icon: '🔌' },
						{ id: 'security', label: 'Security', icon: '🔒' },
					].map((tab) => (
						<motion.button
							key={tab.id}
							variants={itemVariants}
							onClick={() => setActiveTab(tab.id)}
							className="px-4 py-2 rounded-lg transition-all font-semibold text-sm"
							style={{
								background: activeTab === tab.id ? '#00d08430' : 'transparent',
								color: activeTab === tab.id ? '#00d084' : '#d1d5db',
								borderBottom: activeTab === tab.id ? '2px solid #00d084' : 'none',
							}}
							whileHover={{ scale: 1.05 }}
						>
							{tab.icon} {tab.label}
						</motion.button>
					))}
				</motion.div>

				{activeTab === 'branding' && (
					<motion.section className="grid grid-cols-1 xl:grid-cols-[0.95fr_1.05fr] gap-8" variants={containerVariants} initial="hidden" animate="visible">
						<motion.div variants={itemVariants} className="p-6 rounded-lg border border-slate-800 bg-slate-900/50 space-y-4">
							<div>
								<h2 className="text-xl font-bold">Main Kygoo Group Logo</h2>
								<p className="text-gray-400 text-sm mt-1">Logo utama yang dipakai sebagai identitas Kygoo Group.</p>
							</div>

							{siteBrandingLoading ? (
								<p className="text-sm text-slate-400">Memuat branding...</p>
							) : (
								<>
									<div className="flex items-center gap-4 rounded-lg border border-slate-800 bg-slate-950/60 p-4">
										<img
											src={siteBranding.mainLogoUrl || '/logo_icon.png'}
											alt={siteBranding.mainLogoAlt}
											className={`object-contain bg-white/5 p-2 ${siteBranding.headerLogoRounded ? 'rounded-full' : 'rounded-xl'}`}
											style={{ width: `${siteBranding.mainLogoSize}px`, height: `${siteBranding.mainLogoSize}px` }}
										/>
										<div>
											<p className="text-sm text-slate-400">Preview</p>
											<p className="font-semibold">{siteBranding.siteName}</p>
											<p className="text-xs text-slate-500">{siteBranding.mainLogoUrl}</p>
										</div>
									</div>

									{siteBrandingError && <p className="text-sm text-red-300">{siteBrandingError}</p>}

									<label className="block text-sm text-slate-300 space-y-2">
										<span>Site name</span>
										<input className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2" value={siteBranding.siteName} onChange={(event) => setSiteBranding((prev) => ({ ...prev, siteName: event.target.value }))} />
									</label>

									<label className="block text-sm text-slate-300 space-y-2">
										<span>Site description</span>
										<textarea className="w-full min-h-28 rounded-lg bg-slate-900 border border-slate-700 px-3 py-2" value={siteBranding.siteDescription} onChange={(event) => setSiteBranding((prev) => ({ ...prev, siteDescription: event.target.value }))} />
									</label>

									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<label className="block text-sm text-slate-300 space-y-2">
											<span>Main logo URL</span>
											<input className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2" value={siteBranding.mainLogoUrl} onChange={(event) => setSiteBranding((prev) => ({ ...prev, mainLogoUrl: event.target.value }))} />
										</label>
										<label className="block text-sm text-slate-300 space-y-2">
											<span>Main logo alt text</span>
											<input className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2" value={siteBranding.mainLogoAlt} onChange={(event) => setSiteBranding((prev) => ({ ...prev, mainLogoAlt: event.target.value }))} />
										</label>
									</div>

									<div className="rounded-lg border border-slate-800 bg-slate-950/60 p-4 space-y-3">
										<div className="flex items-center justify-between gap-4 flex-wrap">
											<p className="text-sm text-slate-300">Upload main logo file</p>
											<label className="px-3 py-2 rounded bg-slate-800 hover:bg-slate-700 text-xs font-semibold cursor-pointer">
												{siteBrandingUploading ? 'Uploading...' : 'Choose file'}
												<input type="file" accept=".png,.jpg,.jpeg,.webp,.svg" className="hidden" onChange={handleUploadMainLogo} disabled={siteBrandingUploading} />
											</label>
										</div>
										<p className="text-xs text-slate-500">File akan diupload ke backend dan URL-nya diisi otomatis.</p>
									</div>

									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<label className="block text-sm text-slate-300 space-y-2">
											<span>Header logo size (px)</span>
											<input type="number" min={24} max={160} className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2" value={siteBranding.mainLogoSize} onChange={(event) => setSiteBranding((prev) => ({ ...prev, mainLogoSize: Number(event.target.value) || 40 }))} />
										</label>
										<div className="flex items-end justify-between gap-4 rounded-lg border border-slate-800 bg-slate-950/60 px-4 py-3">
											<div>
												<p className="font-semibold">Header logo rounded</p>
												<p className="text-xs text-slate-500">Default bentuk bulat untuk logo header kiri.</p>
											</div>
											<button type="button" onClick={() => setSiteBranding((prev) => ({ ...prev, headerLogoRounded: !prev.headerLogoRounded }))} className={`w-12 h-6 rounded-full transition-all ${siteBranding.headerLogoRounded ? 'bg-green-500' : 'bg-slate-700'}`}>
												<motion.div className="w-5 h-5 rounded-full bg-white" animate={{ x: siteBranding.headerLogoRounded ? 22 : 2 }} />
											</button>
										</div>
									</div>

									<div className="flex items-center justify-between gap-4 rounded-lg border border-slate-800 bg-slate-950/60 px-4 py-3">
										<div>
											<p className="font-semibold">Brand active</p>
											<p className="text-xs text-slate-500">Tampilkan branding ini di admin/public UI yang memakai service ini.</p>
										</div>
										<button type="button" onClick={() => setSiteBranding((prev) => ({ ...prev, isActive: !prev.isActive }))} className={`w-12 h-6 rounded-full transition-all ${siteBranding.isActive ? 'bg-green-500' : 'bg-slate-700'}`}>
											<motion.div className="w-5 h-5 rounded-full bg-white" animate={{ x: siteBranding.isActive ? 22 : 2 }} />
										</button>
									</div>

									<button type="button" onClick={handleSaveSiteBranding} disabled={siteBrandingSaving} className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 rounded font-semibold transition-all disabled:opacity-60">
										{siteBrandingSaving ? 'Saving...' : 'Save main logo'}
									</button>
								</>
							)}
						</motion.div>

						<motion.div variants={itemVariants} className="p-6 rounded-lg border border-slate-800 bg-slate-900/50 space-y-4">
							<div className="flex items-center justify-between gap-4 flex-wrap">
								<div>
									<h2 className="text-xl font-bold">Business Line Logos</h2>
									<p className="text-gray-400 text-sm mt-1">Kelola logo partner dan client per lini bisnis. Saat ini dipakai dulu di Photobooth, nanti siap dipakai lini lain.</p>
								</div>
								<div className="flex flex-wrap gap-2">
									{BUSINESS_LINES.map((line) => (
										<button key={line.value} type="button" onClick={() => setBusinessLogoForm((prev) => ({ ...prev, business_line: line.value }))} className="px-3 py-2 rounded-full border text-xs font-semibold transition-all" style={{ borderColor: businessLogoForm.business_line === line.value ? line.color : 'rgba(100, 116, 139, 0.35)', background: businessLogoForm.business_line === line.value ? `${line.color}20` : 'rgba(15, 23, 42, 0.6)', color: businessLogoForm.business_line === line.value ? line.color : '#cbd5e1' }}>
											{line.label}
										</button>
									))}
								</div>
							</div>

							{businessError && <p className="text-sm text-red-300">{businessError}</p>}
							{businessSuccess && <p className="text-sm text-emerald-300">{businessSuccess}</p>}

							<form className="space-y-4" onSubmit={handleSaveBusinessLogo}>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<label className="block text-sm text-slate-300 space-y-2">
										<span>Section</span>
										<select className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2" value={businessLogoForm.section} onChange={(event) => setBusinessLogoForm((prev) => ({ ...prev, section: event.target.value as AnyLogoSection }))}>
											<option value="partner">Our Partner</option>
											<option value="client">Our Client</option>
											<option value="header">Header Logo</option>
										</select>
									</label>
									<label className="block text-sm text-slate-300 space-y-2">
										<span>Name</span>
										<input className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2" value={businessLogoForm.name} onChange={(event) => setBusinessLogoForm((prev) => ({ ...prev, name: event.target.value }))} />
									</label>
								</div>

								<div className="rounded-lg border border-slate-800 bg-slate-950/60 p-4 space-y-3">
									<div className="flex items-center justify-between gap-4 flex-wrap">
										<p className="text-sm text-slate-300">Upload logo file</p>
										<label className="px-3 py-2 rounded bg-slate-800 hover:bg-slate-700 text-xs font-semibold cursor-pointer">
											{businessUploading ? 'Uploading...' : 'Choose file'}
											<input type="file" accept=".png,.jpg,.jpeg,.webp,.svg" className="hidden" onChange={handleUploadBusinessLogo} disabled={businessUploading} />
										</label>
									</div>
									<p className="text-xs text-slate-500">File disimpan di backend lalu URL diisi otomatis ke field Image URL.</p>
								</div>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<label className="block text-sm text-slate-300 space-y-2">
										<span>Image URL</span>
										<input className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2" value={businessLogoForm.image_url} onChange={(event) => setBusinessLogoForm((prev) => ({ ...prev, image_url: event.target.value }))} />
									</label>
									<label className="block text-sm text-slate-300 space-y-2">
										<span>Alt text</span>
										<input className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2" value={businessLogoForm.alt_text} onChange={(event) => setBusinessLogoForm((prev) => ({ ...prev, alt_text: event.target.value }))} />
									</label>
								</div>

								<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
									<label className="block text-sm text-slate-300 space-y-2">
										<span>Sort order</span>
										<input type="number" className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2" value={businessLogoForm.display_order} onChange={(event) => setBusinessLogoForm((prev) => ({ ...prev, display_order: Number(event.target.value) }))} />
									</label>
									<label className="block text-sm text-slate-300 space-y-2">
										<span>Width (px)</span>
										<input type="number" min={24} max={1000} className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2" value={businessLogoForm.display_width} onChange={(event) => setBusinessLogoForm((prev) => ({ ...prev, display_width: Number(event.target.value) || 150 }))} />
									</label>
									<label className="block text-sm text-slate-300 space-y-2">
										<span>Height (px)</span>
										<input type="number" min={24} max={1000} className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2" value={businessLogoForm.display_height} onChange={(event) => setBusinessLogoForm((prev) => ({ ...prev, display_height: Number(event.target.value) || 64 }))} />
									</label>
								</div>

								<div className="flex items-end justify-between gap-4 rounded-lg border border-slate-800 bg-slate-950/60 px-4 py-3">
									<div>
										<p className="font-semibold">Active</p>
										<p className="text-xs text-slate-500">Toggle logo aktif atau sembunyikan dari public view.</p>
									</div>
									<button type="button" onClick={() => setBusinessLogoForm((prev) => ({ ...prev, is_active: !prev.is_active }))} className={`w-12 h-6 rounded-full transition-all ${businessLogoForm.is_active ? 'bg-green-500' : 'bg-slate-700'}`}>
										<motion.div className="w-5 h-5 rounded-full bg-white" animate={{ x: businessLogoForm.is_active ? 22 : 2 }} />
									</button>
								</div>

								<div className="grid grid-cols-2 gap-3">
									<button type="button" onClick={() => resetBusinessForm(businessLogoForm.business_line)} className="px-4 py-2 rounded-lg border border-slate-700 hover:border-white transition-all font-semibold text-sm">Reset</button>
									<button type="submit" disabled={businessSaving} className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 transition-all font-semibold text-sm disabled:opacity-60">{businessSaving ? 'Saving...' : businessLogoForm.id ? 'Update logo' : 'Create logo'}</button>
								</div>
							</form>

							<div className="space-y-3">
								{businessLoading ? (
									<p className="text-sm text-slate-400">Memuat logo...</p>
								) : filteredBusinessLogos.length === 0 ? (
									<p className="text-sm text-slate-400">Belum ada logo untuk lini bisnis ini.</p>
								) : (
									filteredBusinessLogos.map((logo) => (
										<div key={logo.id} className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 flex items-start justify-between gap-4">
											<div className="flex items-center gap-4">
												<img
													src={logo.image_url}
													alt={logo.alt_text || logo.name}
													className="rounded-lg object-contain bg-white/5 p-2"
													style={{ width: `${logo.display_width || 150}px`, height: `${logo.display_height || 64}px` }}
												/>
												<div>
													<div className="flex items-center gap-2">
														<h3 className="font-semibold">{logo.name}</h3>
														{!logo.is_active && <span className="text-xs px-2 py-1 rounded-full bg-slate-700 text-slate-300">Inactive</span>}
													</div>
													<p className="text-sm text-slate-400">{logo.section === 'partner' ? 'Our Partner' : logo.section === 'client' ? 'Our Client' : 'Header Logo'}</p>
													<p className="text-xs text-slate-500">Size: {logo.display_width || 150} x {logo.display_height || 64}px</p>
													<p className="text-xs text-slate-500 break-all">{logo.image_url}</p>
												</div>
											</div>
											<div className="flex gap-2">
												<button type="button" onClick={() => handleEditBusinessLogo(logo)} className="px-3 py-2 rounded-lg border border-slate-700 hover:border-white transition-all text-sm font-semibold">Edit</button>
												<button type="button" onClick={() => handleDeleteBusinessLogo(logo.id)} className="px-3 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition-all text-sm font-semibold">Delete</button>
											</div>
										</div>
									))
								)}
							</div>
						</motion.div>
					</motion.section>
				)}

				{activeTab === 'general' && (
					<motion.section className="grid grid-cols-1 lg:grid-cols-3 gap-8" variants={containerVariants} initial="hidden" animate="visible">
						<div className="lg:col-span-2 space-y-6">
							<motion.div variants={itemVariants} className="p-6 rounded-lg border border-slate-800 bg-slate-900/50">
								<p className="text-sm text-gray-400 mb-2">Status</p>
								<h3 className="text-xl font-bold">Settings now includes branding management.</h3>
								<p className="text-gray-400 text-sm mt-2">Logo utama dan logo lini bisnis dapat dikelola di tab Branding.</p>
							</motion.div>
						</div>
						<motion.div variants={itemVariants} className="p-6 rounded-lg border border-slate-800 bg-gradient-to-br from-green-900/30 to-green-900/10 h-fit">
							<h3 className="font-bold text-lg mb-4">Quick Actions</h3>
							<div className="space-y-3">
								<button className="w-full px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded font-semibold text-sm transition-all" onClick={() => setActiveTab('branding')}>Go to Branding</button>
								<Link href="/admin/branding" className="block w-full px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded font-semibold text-sm transition-all text-center">Open Brand Logos CMS</Link>
							</div>
						</motion.div>
					</motion.section>
				)}

				{activeTab === 'business' && (
					<motion.section className="grid grid-cols-1 md:grid-cols-2 gap-6" variants={containerVariants} initial="hidden" animate="visible">
						{BUSINESS_LINES.map((line) => {
							const count = businessLogos.filter((logo) => logo.business_line === line.value).length;
							return (
								<motion.div key={line.value} variants={itemVariants} className="p-6 rounded-lg border border-slate-800 bg-slate-900/50">
									<div className="flex justify-between items-start mb-4">
										<h3 className="font-bold text-lg">{line.label}</h3>
										<span className="px-3 py-1 rounded-full text-xs font-bold" style={{ background: `${line.color}30`, color: line.color }}>{count} logos</span>
									</div>
									<p className="text-gray-400 text-sm mb-3">Atur logo line ini melalui tab Branding.</p>
									<button className="w-full px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded text-sm font-semibold transition-all" onClick={() => { setBusinessLogoForm((prev) => ({ ...prev, business_line: line.value })); setActiveTab('branding'); }}>
										Manage Logos
									</button>
								</motion.div>
							);
						})}
					</motion.section>
				)}

				{activeTab === 'integrations' && (
					<motion.section className="space-y-6" variants={containerVariants} initial="hidden" animate="visible">
						{[
							{ name: 'Payment Gateway', status: 'connected', service: 'Midtrans' },
							{ name: 'Email Service', status: 'connected', service: 'SendGrid' },
							{ name: 'Analytics', status: 'connected', service: 'Google Analytics' },
							{ name: 'CRM', status: 'pending', service: 'HubSpot' },
						].map((integration) => (
							<motion.div key={integration.name} variants={itemVariants} className="p-6 rounded-lg border border-slate-800 bg-slate-900/50 flex justify-between items-center">
								<div>
									<h3 className="font-bold text-lg">{integration.name}</h3>
									<p className="text-gray-400 text-sm">{integration.service}</p>
								</div>
								<div className="flex gap-3 items-center">
									<span className={`px-3 py-1 rounded-full text-xs font-bold ${integration.status === 'connected' ? 'bg-green-500/30 text-green-400' : 'bg-yellow-500/30 text-yellow-400'}`}>
										{integration.status}
									</span>
									<motion.button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded font-semibold text-sm" whileHover={{ scale: 1.05 }}>
										Configure
									</motion.button>
								</div>
							</motion.div>
						))}
					</motion.section>
				)}

				{activeTab === 'security' && (
					<motion.section className="space-y-6" variants={containerVariants} initial="hidden" animate="visible">
						<motion.div variants={itemVariants} className="p-6 rounded-lg border border-slate-800 bg-slate-900/50">
							<h3 className="font-bold text-lg mb-2">Security</h3>
							<p className="text-gray-400 text-sm">Logo changes are restricted to authenticated admin users.</p>
						</motion.div>
					</motion.section>
				)}
			</div>
		</div>
	);
}