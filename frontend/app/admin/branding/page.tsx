'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { MainLayout } from '@/src/presentation/components/layout/main-layout';
import { ProtectedRoute } from '@/src/presentation/components/layout/protected-route';
import { Button } from '@/src/presentation/components/ui/button';
import { Input } from '@/src/presentation/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/presentation/components/ui/card';
import { Alert, AlertDescription } from '@/src/presentation/components/ui/alert';
import {
	businessLineBrandingService,
	type BusinessLineLogo,
	type CreateBusinessLineLogoRequest,
	type UpdateBusinessLineLogoRequest,
} from '@/src/services';
import { type BusinessLineSlug } from '@/lib/business-line-pricing';
import { type AnyLogoSection } from '@/src/services/branding.service';

type LogoFormState = {
	id?: string;
	business_line: BusinessLineSlug;
	section: AnyLogoSection;
	name: string;
	image_url: string;
	alt_text: string;
	display_order: number;
	is_active: boolean;
};

const EMPTY_FORM: LogoFormState = {
	business_line: 'photobooth',
	section: 'partner',
	name: '',
	image_url: '',
	alt_text: '',
	display_order: 0,
	is_active: true,
};

const BUSINESS_LINES: Array<{ value: BusinessLineSlug; label: string; color: string }> = [
	{ value: 'studio', label: 'Studio', color: '#d4af37' },
	{ value: 'photobooth', label: 'Photobooth', color: '#ff006e' },
	{ value: 'digital', label: 'Digital', color: '#00d084' },
	{ value: 'coffee', label: 'Coffee', color: '#d97706' },
];

const SECTIONS: Array<{ value: AnyLogoSection; label: string }> = [
	{ value: 'partner', label: 'Our Partner' },
	{ value: 'client', label: 'Our Client' },
	{ value: 'header', label: 'Header Logo' },
];

export default function AdminBrandingPage() {
	const [logos, setLogos] = useState<BusinessLineLogo[]>([]);
	const [form, setForm] = useState<LogoFormState>(EMPTY_FORM);
	const [isLoading, setIsLoading] = useState(true);
	const [isSaving, setIsSaving] = useState(false);
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');

	const filteredLogos = useMemo(
		() => logos.filter((item) => item.business_line === form.business_line),
		[logos, form.business_line]
	);

	const loadLogos = async () => {
		setIsLoading(true);
		setError('');
		const response = await businessLineBrandingService.listAdminLogos(true);
		if (response.error || !response.data) {
			setError(response.message || response.error || 'Gagal memuat logos.');
			setLogos([]);
		} else {
			setLogos(response.data);
		}
		setIsLoading(false);
	};

	useEffect(() => {
		void loadLogos();
	}, []);

	const resetForm = (line: BusinessLineSlug = form.business_line) => {
		setForm({ ...EMPTY_FORM, business_line: line });
	};

	const handleEdit = (item: BusinessLineLogo) => {
		setForm({
			id: item.id,
			business_line: item.business_line,
			section: item.section,
			name: item.name,
			image_url: item.image_url,
			alt_text: item.alt_text || '',
			display_order: item.display_order,
			is_active: item.is_active,
		});
	};

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setIsSaving(true);
		setError('');
		setSuccess('');

		const payloadBase = {
			business_line: form.business_line,
			section: form.section,
			name: form.name.trim(),
			image_url: form.image_url.trim(),
			alt_text: form.alt_text.trim(),
			display_order: form.display_order,
			is_active: form.is_active,
		};

		const response = form.id
			? await businessLineBrandingService.updateLogo(form.id, payloadBase as UpdateBusinessLineLogoRequest)
			: await businessLineBrandingService.createLogo(payloadBase as CreateBusinessLineLogoRequest);

		if (response.error || !response.data) {
			setError(response.message || response.error || 'Gagal menyimpan logo.');
			setIsSaving(false);
			return;
		}

		setSuccess(form.id ? 'Logo berhasil diperbarui.' : 'Logo berhasil dibuat.');
		resetForm(form.business_line);
		await loadLogos();
		setIsSaving(false);
	};

	const handleDelete = async (id: string) => {
		if (!window.confirm('Hapus logo ini?')) {
			return;
		}

		setError('');
		setSuccess('');
		const response = await businessLineBrandingService.deleteLogo(id);
		if (response.error) {
			setError(response.message || response.error || 'Gagal menghapus logo.');
			return;
		}

		if (form.id === id) {
			resetForm(form.business_line);
		}
		setSuccess('Logo berhasil dihapus.');
		await loadLogos();
	};

	return (
		<ProtectedRoute>
			<MainLayout>
				<div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
					<div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
						<div className="flex items-center justify-between gap-4 flex-wrap">
							<div>
								<p className="text-sm uppercase tracking-[0.2em] text-slate-400">CMS</p>
								<h1 className="text-3xl font-bold">Brand Logos Manager</h1>
								<p className="text-slate-400 mt-2">Kelola logo partner dan client per lini bisnis dari backend Coolify.</p>
							</div>
							<Link href="/admin" className="text-sm px-4 py-2 rounded border border-slate-700 hover:border-white transition-all">
								← Back to Admin
							</Link>
						</div>

						{error && (
							<Alert className="border-red-500/40 bg-red-500/10 text-red-50">
								<AlertDescription>{error}</AlertDescription>
							</Alert>
						)}
						{success && (
							<Alert className="border-emerald-500/40 bg-emerald-500/10 text-emerald-50">
								<AlertDescription>{success}</AlertDescription>
							</Alert>
						)}

						<div className="grid grid-cols-1 xl:grid-cols-[1.25fr_0.9fr] gap-6">
							<Card className="border-slate-800 bg-slate-950/60">
								<CardHeader>
									<CardTitle>Logo list</CardTitle>
									<CardDescription>Logo untuk tampilan public photobooth sekarang dan lini lain nanti.</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="flex flex-wrap gap-2">
										{BUSINESS_LINES.map((line) => (
											<button
												key={line.value}
												type="button"
												onClick={() => setForm((prev) => ({ ...prev, business_line: line.value }))}
												className="px-4 py-2 rounded-full border text-sm transition-all"
												style={{
													borderColor: form.business_line === line.value ? line.color : 'rgba(100, 116, 139, 0.35)',
													background: form.business_line === line.value ? `${line.color}20` : 'rgba(15, 23, 42, 0.6)',
													color: form.business_line === line.value ? line.color : '#cbd5e1',
												}}
											>
												{line.label}
											</button>
										))}
									</div>

									{isLoading ? (
										<p className="text-sm text-slate-400">Memuat data...</p>
									) : filteredLogos.length === 0 ? (
										<p className="text-sm text-slate-400">Belum ada logo untuk lini bisnis ini.</p>
									) : (
										<div className="space-y-3">
											{filteredLogos.map((item) => (
												<div key={item.id} className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
													<div className="flex items-start justify-between gap-3">
														<div className="flex items-center gap-4">
															<img src={item.image_url} alt={item.alt_text || item.name} className="h-16 w-32 rounded-lg object-contain bg-slate-950/70 p-2 border border-white/10" />
															<div>
																<div className="flex flex-wrap items-center gap-2">
																	<h3 className="font-semibold text-lg">{item.name}</h3>
																	{!item.is_active && <span className="text-xs px-2 py-1 rounded-full bg-slate-700 text-slate-300">Inactive</span>}
																</div>
																<p className="text-sm text-slate-300 mt-1">{item.section === 'partner' ? 'Our Partner' : item.section === 'client' ? 'Our Client' : 'Header Logo'}</p>
																<p className="text-xs text-slate-500 mt-1 break-all">{item.image_url}</p>
															</div>
														</div>
														<div className="flex gap-2">
															<Button type="button" onClick={() => handleEdit(item)} variant="outline" size="sm">Edit</Button>
															<Button type="button" onClick={() => handleDelete(item.id)} variant="destructive" size="sm">Delete</Button>
														</div>
													</div>
												</div>
											))}
										</div>
									)}
								</CardContent>
							</Card>

							<Card className="border-slate-800 bg-slate-950/60 h-fit sticky top-6">
								<CardHeader>
									<CardTitle>{form.id ? 'Edit logo' : 'Create logo'}</CardTitle>
									<CardDescription>Tambahkan logo baru atau hapus yang tidak dipakai lagi.</CardDescription>
								</CardHeader>
								<CardContent>
									<form className="space-y-4" onSubmit={handleSubmit}>
										<label className="block text-sm text-slate-300 space-y-2">
											<span>Business line</span>
											<select className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2" value={form.business_line} onChange={(event) => setForm((prev) => ({ ...prev, business_line: event.target.value as BusinessLineSlug }))}>
												{BUSINESS_LINES.map((line) => <option key={line.value} value={line.value}>{line.label}</option>)}
											</select>
										</label>
										<label className="block text-sm text-slate-300 space-y-2">
											<span>Section</span>
											<select className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2" value={form.section} onChange={(event) => setForm((prev) => ({ ...prev, section: event.target.value as AnyLogoSection }))}>
												{SECTIONS.map((section) => <option key={section.value} value={section.value}>{section.label}</option>)}
											</select>
										</label>
										<label className="block text-sm text-slate-300 space-y-2">
											<span>Name</span>
											<Input value={form.name} onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))} />
										</label>
										<label className="block text-sm text-slate-300 space-y-2">
											<span>Image URL</span>
											<Input value={form.image_url} onChange={(event) => setForm((prev) => ({ ...prev, image_url: event.target.value }))} />
										</label>
										<label className="block text-sm text-slate-300 space-y-2">
											<span>Alt text</span>
											<Input value={form.alt_text} onChange={(event) => setForm((prev) => ({ ...prev, alt_text: event.target.value }))} />
										</label>
										<div className="grid grid-cols-2 gap-3">
											<label className="block text-sm text-slate-300 space-y-2">
												<span>Sort order</span>
												<Input type="number" value={form.display_order} onChange={(event) => setForm((prev) => ({ ...prev, display_order: Number(event.target.value) }))} />
											</label>
											<label className="block text-sm text-slate-300 space-y-2">
												<span>Active</span>
												<select className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2" value={String(form.is_active)} onChange={(event) => setForm((prev) => ({ ...prev, is_active: event.target.value === 'true' }))}>
													<option value="true">Active</option>
													<option value="false">Inactive</option>
												</select>
											</label>
										</div>
										<div className="grid grid-cols-2 gap-3">
											<Button type="button" variant="outline" onClick={() => resetForm(form.business_line)}>Reset</Button>
											<Button type="submit" disabled={isSaving}>{isSaving ? 'Saving...' : form.id ? 'Update logo' : 'Create logo'}</Button>
										</div>
									</form>
								</CardContent>
							</Card>
						</div>
					</div>
				</div>
			</MainLayout>
		</ProtectedRoute>
	);
}