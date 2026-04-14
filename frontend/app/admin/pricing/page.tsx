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
	businessLinePricingService,
	type BusinessLinePackage,
	type CreateBusinessLinePackageRequest,
	type UpdateBusinessLinePackageRequest,
} from '@/src/services';
import { type BusinessLineSlug } from '@/lib/business-line-pricing';

type PackageFormState = {
	id?: string;
	business_line: BusinessLineSlug;
	name: string;
	description: string;
	price_label: string;
	featuresText: string;
	highlight: boolean;
	display_order: number;
	is_active: boolean;
};

const EMPTY_FORM: PackageFormState = {
	business_line: 'studio',
	name: '',
	description: '',
	price_label: '',
	featuresText: '',
	highlight: false,
	display_order: 0,
	is_active: true,
};

const BUSINESS_LINES: Array<{ value: BusinessLineSlug; label: string; color: string }> = [
	{ value: 'studio', label: 'Studio', color: '#d4af37' },
	{ value: 'photobooth', label: 'Photobooth', color: '#ff006e' },
	{ value: 'digital', label: 'Digital', color: '#00d084' },
	{ value: 'coffee', label: 'Coffee', color: '#d97706' },
];

function toFeaturesText(features: string[]): string {
	return features.join('\n');
}

export default function AdminPricingPage() {
	const [packages, setPackages] = useState<BusinessLinePackage[]>([]);
	const [form, setForm] = useState<PackageFormState>(EMPTY_FORM);
	const [isLoading, setIsLoading] = useState(true);
	const [isSaving, setIsSaving] = useState(false);
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');

	const filteredPackages = useMemo(
		() => packages.filter((item) => item.business_line === form.business_line),
		[packages, form.business_line]
	);

	const loadPackages = async () => {
		setIsLoading(true);
		setError('');
		const response = await businessLinePricingService.listAdminPackages(true);
		if (response.error || !response.data) {
			setError(response.message || response.error || 'Gagal memuat pricing.');
			setPackages([]);
		} else {
			setPackages(response.data);
		}
		setIsLoading(false);
	};

	useEffect(() => {
		void loadPackages();
	}, []);

	const resetForm = (line: BusinessLineSlug = form.business_line) => {
		setForm({ ...EMPTY_FORM, business_line: line });
	};

	const handleEdit = (item: BusinessLinePackage) => {
		setForm({
			id: item.id,
			business_line: item.business_line,
			name: item.name,
			description: item.description || '',
			price_label: item.price_label,
			featuresText: toFeaturesText(item.features || []),
			highlight: item.highlight,
			display_order: item.display_order,
			is_active: item.is_active,
		});
	};

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setIsSaving(true);
		setError('');
		setSuccess('');

		const features = form.featuresText
			.split('\n')
			.map((line) => line.trim())
			.filter(Boolean);

		const payloadBase = {
			business_line: form.business_line,
			name: form.name.trim(),
			description: form.description.trim(),
			price_label: form.price_label.trim(),
			features,
			highlight: form.highlight,
			display_order: form.display_order,
			is_active: form.is_active,
		};

		const response = form.id
			? await businessLinePricingService.updatePackage(form.id, payloadBase as UpdateBusinessLinePackageRequest)
			: await businessLinePricingService.createPackage(payloadBase as CreateBusinessLinePackageRequest);

		if (response.error || !response.data) {
			setError(response.message || response.error || 'Gagal menyimpan package.');
			setIsSaving(false);
			return;
		}

		setSuccess(form.id ? 'Package berhasil diperbarui.' : 'Package berhasil dibuat.');
		resetForm(form.business_line);
		await loadPackages();
		setIsSaving(false);
	};

	const handleDelete = async (id: string) => {
		if (!window.confirm('Hapus package ini?')) {
			return;
		}

		setError('');
		setSuccess('');
		const response = await businessLinePricingService.deletePackage(id);
		if (response.error) {
			setError(response.message || response.error || 'Gagal menghapus package.');
			return;
		}

		if (form.id === id) {
			resetForm(form.business_line);
		}
		setSuccess('Package berhasil dihapus.');
		await loadPackages();
	};

	return (
		<ProtectedRoute>
			<MainLayout>
				<div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
					<div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
						<div className="flex items-center justify-between gap-4 flex-wrap">
							<div>
								<p className="text-sm uppercase tracking-[0.2em] text-slate-400">CMS</p>
								<h1 className="text-3xl font-bold">Pricing Manager</h1>
								<p className="text-slate-400 mt-2">Kelola price list untuk semua lini bisnis dari backend Coolify.</p>
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
									<CardTitle>Package list</CardTitle>
									<CardDescription>Semua paket yang tampil di public site dan form booking.</CardDescription>
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
									) : filteredPackages.length === 0 ? (
										<p className="text-sm text-slate-400">Belum ada package untuk lini bisnis ini.</p>
									) : (
										<div className="space-y-3">
											{filteredPackages.map((item) => (
												<div key={item.id} className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
													<div className="flex items-start justify-between gap-3">
														<div>
															<div className="flex flex-wrap items-center gap-2">
																<h3 className="font-semibold text-lg">{item.name}</h3>
																{item.highlight && <span className="text-xs px-2 py-1 rounded-full bg-amber-400/20 text-amber-200">Featured</span>}
																{!item.is_active && <span className="text-xs px-2 py-1 rounded-full bg-slate-700 text-slate-300">Inactive</span>}
															</div>
															<p className="text-sm text-slate-300 mt-1">{item.price_label}</p>
															<p className="text-xs text-slate-500 mt-1">{item.description || 'No description'}</p>
														</div>
														<div className="flex gap-2">
															<Button type="button" onClick={() => handleEdit(item)} variant="outline" size="sm">
																Edit
															</Button>
															<Button type="button" onClick={() => handleDelete(item.id)} variant="destructive" size="sm">
																Delete
															</Button>
														</div>
													</div>
													{item.features.length > 0 && (
														<ul className="mt-3 grid gap-2 text-sm text-slate-300">
															{item.features.map((feature) => (
																<li key={feature} className="rounded-lg bg-slate-950/70 px-3 py-2">
																	{feature}
																</li>
															))}
														</ul>
													)}
												</div>
											))}
										</div>
									)}
								</CardContent>
							</Card>

							<Card className="border-slate-800 bg-slate-950/60 h-fit sticky top-6">
								<CardHeader>
									<CardTitle>{form.id ? 'Edit package' : 'Create package'}</CardTitle>
									<CardDescription>Edit price list untuk CMS dan booking form.</CardDescription>
								</CardHeader>
								<CardContent>
									<form className="space-y-4" onSubmit={handleSubmit}>
										<label className="block text-sm text-slate-300 space-y-2">
											<span>Business line</span>
											<select
												className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2"
												value={form.business_line}
												onChange={(event) => setForm((prev) => ({ ...prev, business_line: event.target.value as BusinessLineSlug }))}
											>
												{BUSINESS_LINES.map((line) => (
													<option key={line.value} value={line.value}>{line.label}</option>
												))}
											</select>
										</label>

										<label className="block text-sm text-slate-300 space-y-2">
											<span>Name</span>
											<Input value={form.name} onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))} />
										</label>

										<label className="block text-sm text-slate-300 space-y-2">
											<span>Description</span>
											<textarea
												className="w-full min-h-24 rounded-lg bg-slate-900 border border-slate-700 px-3 py-2"
												value={form.description}
												onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
											/>
										</label>

										<label className="block text-sm text-slate-300 space-y-2">
											<span>Price label</span>
											<Input value={form.price_label} onChange={(event) => setForm((prev) => ({ ...prev, price_label: event.target.value }))} />
										</label>

										<label className="block text-sm text-slate-300 space-y-2">
											<span>Features, one per line</span>
											<textarea
												className="w-full min-h-32 rounded-lg bg-slate-900 border border-slate-700 px-3 py-2"
												value={form.featuresText}
												onChange={(event) => setForm((prev) => ({ ...prev, featuresText: event.target.value }))}
											/>
										</label>

										<div className="grid grid-cols-2 gap-3">
											<label className="block text-sm text-slate-300 space-y-2">
												<span>Sort order</span>
												<Input
													type="number"
													value={form.display_order}
													onChange={(event) => setForm((prev) => ({ ...prev, display_order: Number(event.target.value) }))}
												/>
											</label>
											<label className="block text-sm text-slate-300 space-y-2">
												<span>Highlight</span>
												<select
													className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2"
													value={String(form.highlight)}
													onChange={(event) => setForm((prev) => ({ ...prev, highlight: event.target.value === 'true' }))}
												>
													<option value="false">No</option>
													<option value="true">Yes</option>
												</select>
											</label>
										</div>

										<div className="grid grid-cols-2 gap-3">
											<label className="block text-sm text-slate-300 space-y-2">
												<span>Active</span>
												<select
													className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2"
													value={String(form.is_active)}
													onChange={(event) => setForm((prev) => ({ ...prev, is_active: event.target.value === 'true' }))}
												>
													<option value="true">Active</option>
													<option value="false">Inactive</option>
												</select>
											</label>
											<div className="flex items-end gap-2">
												<Button type="button" variant="outline" className="w-full" onClick={() => resetForm(form.business_line)}>
													Reset
												</Button>
											</div>
										</div>

										<Button type="submit" className="w-full" disabled={isSaving}>
											{isSaving ? 'Saving...' : form.id ? 'Update package' : 'Create package'}
										</Button>
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