'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  businessProjectService,
  type BusinessLineSlug,
  type BusinessProjectAuditLog,
  type BusinessProjectGalleryItem,
  type BusinessProjectItem,
  type CreateBusinessProjectRequest,
} from '@/src/services';

const businessLines: Array<{ slug: BusinessLineSlug; label: string; color: string }> = [
  { slug: 'studio', label: 'Studio', color: '#d4af37' },
  { slug: 'photobooth', label: 'Photobooth', color: '#ff006e' },
  { slug: 'digital', label: 'Digital', color: '#00d084' },
  { slug: 'coffee', label: 'Coffee', color: '#d97706' },
];

function emptyForm(selectedLine: BusinessLineSlug): CreateBusinessProjectRequest {
  return {
    business_line: selectedLine,
    name: '',
    event_location: '',
    day: new Date().getDate(),
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear().toString(),
    impact: '',
    sort_order: 0,
    is_active: true,
  };
}

function formatDate(day: number, month: number, year: string | number): string {
  const padDay = String(day).padStart(2, '0');
  const padMonth = String(month).padStart(2, '0');
  return `${padDay}/${padMonth}/${year}`;
}

function getSessionLabel(businessLine: BusinessLineSlug, sortOrder: number): string {
  return businessLine === 'photobooth' ? `Session ${sortOrder}` : `sort ${sortOrder}`;
}

function isVideoFile(url: string, fileName?: string): boolean {
  const source = `${fileName || ''} ${url}`.toLowerCase();
  return source.includes('.mp4');
}

function isGifFile(url: string, fileName?: string): boolean {
  const source = `${fileName || ''} ${url}`.toLowerCase();
  return source.includes('.gif');
}

export default function AdminBusinessProjectsPage() {
  const [selectedLine, setSelectedLine] = useState<BusinessLineSlug>('studio');
  const [projects, setProjects] = useState<BusinessProjectItem[]>([]);
  const [auditLogs, setAuditLogs] = useState<BusinessProjectAuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [form, setForm] = useState<CreateBusinessProjectRequest>(emptyForm('studio'));
  const [pendingFiles, setPendingFiles] = useState<Record<string, File[]>>({});
  const [uploadingProjectId, setUploadingProjectId] = useState<string | null>(null);
  const [gallerySortValues, setGallerySortValues] = useState<Record<string, number>>({});
  const [gallerySortSavingId, setGallerySortSavingId] = useState<string | null>(null);
  const [draggingGalleryItem, setDraggingGalleryItem] = useState<{ projectId: string; mediaId: string } | null>(null);

  const selectedColor = useMemo(
    () => businessLines.find(line => line.slug === selectedLine)?.color ?? '#d4af37',
    [selectedLine]
  );

  const loadProjects = async (line: BusinessLineSlug) => {
    setIsLoading(true);
    setError('');
    try {
      const response = await businessProjectService.getProjectsByLine(line);
      if (response.error) {
        setError(response.message || response.error);
        setProjects([]);
      } else {
        setProjects(response.data || []);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const loadAuditLogs = async () => {
    const response = await businessProjectService.getAuditLogs(undefined, 20);
    if (!response.error) {
      setAuditLogs(response.data || []);
    }
  };

  useEffect(() => {
    loadProjects(selectedLine);
    setForm(emptyForm(selectedLine));
    setEditingId(null);
  }, [selectedLine]);

  useEffect(() => {
    loadAuditLogs();
  }, []);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage('');
    setError('');

    try {
      const payload = { ...form, business_line: selectedLine };
      if (editingId) {
        const response = await businessProjectService.updateProject(editingId, payload);
        if (response.error) {
          setError(response.message || response.error);
          return;
        }
        setMessage('Project berhasil diperbarui.');
      } else {
        const response = await businessProjectService.createProject(payload);
        if (response.error) {
          setError(response.message || response.error);
          return;
        }
        setMessage('Project berhasil ditambahkan.');
      }

      await loadProjects(selectedLine);
      await loadAuditLogs();
      setForm(emptyForm(selectedLine));
      setEditingId(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onEdit = (project: BusinessProjectItem) => {
    setEditingId(project.id);
    setForm({
      business_line: project.business_line,
      name: project.name,
      event_location: project.event_location,
      day: project.day,
      month: project.month,
      year: project.year || new Date().getFullYear().toString(),
      impact: project.impact,
      sort_order: project.sort_order,
      is_active: project.is_active,
    });
  };

  const onDelete = async (projectId: string) => {
    setError('');
    setMessage('');
    const response = await businessProjectService.deleteProject(projectId);
    if (response.error) {
      setError(response.message || response.error);
      return;
    }

    setMessage('Project berhasil dihapus.');
    await loadProjects(selectedLine);
    await loadAuditLogs();

    if (editingId === projectId) {
      setEditingId(null);
      setForm(emptyForm(selectedLine));
    }
  };

  const onFilesSelected = (projectId: string, files: FileList | null) => {
    if (!files || files.length === 0) {
      setPendingFiles(prev => ({ ...prev, [projectId]: [] }));
      return;
    }

    setPendingFiles(prev => ({ ...prev, [projectId]: Array.from(files) }));
  };

  const onUploadGallery = async (projectId: string) => {
    const files = pendingFiles[projectId] || [];
    if (files.length === 0) {
      setError('Pilih file gambar dulu sebelum upload.');
      return;
    }

    setUploadingProjectId(projectId);
    setError('');
    setMessage('');

    try {
      const response = await businessProjectService.uploadProjectGallery(projectId, files);
      if (response.error) {
        setError(response.message || response.error);
        return;
      }

      setMessage('File galeri berhasil diupload.');
      setPendingFiles(prev => ({ ...prev, [projectId]: [] }));
      await loadProjects(selectedLine);
    } finally {
      setUploadingProjectId(null);
    }
  };

  const onDeleteGalleryItem = async (projectId: string, mediaId: string) => {
    setError('');
    setMessage('');

    const response = await businessProjectService.deleteProjectGalleryItem(projectId, mediaId);
    if (response.error) {
      setError(response.message || response.error);
      return;
    }

    setMessage('Item galeri dihapus.');
    await loadProjects(selectedLine);
  };

  const onGallerySortChange = (mediaId: string, value: string) => {
    const nextValue = Number(value);
    setGallerySortValues(prev => ({
      ...prev,
      [mediaId]: Number.isNaN(nextValue) ? 0 : nextValue,
    }));
  };

  const onSaveGallerySort = async (projectId: string, mediaId: string) => {
    const sortOrder = gallerySortValues[mediaId] ?? 0;
    setGallerySortSavingId(mediaId);
    setError('');
    setMessage('');

    try {
      const response = await businessProjectService.updateProjectGallerySort(projectId, mediaId, sortOrder);
      if (response.error) {
        setError(response.message || response.error);
        return;
      }

      setMessage('Urutan foto galeri berhasil disimpan.');
      await loadProjects(selectedLine);
    } finally {
      setGallerySortSavingId(null);
    }
  };

  const persistGalleryOrder = async (project: BusinessProjectItem, orderedGallery: BusinessProjectGalleryItem[]) => {
    setGallerySortSavingId(project.id);
    try {
      const updates = orderedGallery.map((media, index) =>
        businessProjectService.updateProjectGallerySort(project.id, media.id, index)
      );
      const results = await Promise.all(updates);
      const failed = results.find(result => result.error);
      if (failed) {
        setError(failed.message || failed.error || 'Gagal menyimpan urutan galeri.');
        return;
      }

      setMessage('Urutan galeri berhasil disimpan.');
      await loadProjects(selectedLine);
    } finally {
      setGallerySortSavingId(null);
    }
  };

  const onGalleryDragStart = (projectId: string, mediaId: string) => {
    setDraggingGalleryItem({ projectId, mediaId });
  };

  const onGalleryDrop = async (project: BusinessProjectItem, targetMediaId: string) => {
    if (!draggingGalleryItem || draggingGalleryItem.projectId !== project.id || draggingGalleryItem.mediaId === targetMediaId) {
      return;
    }

    const orderedGallery = [...(project.gallery || [])].sort((a, b) => {
      if (a.is_cover && !b.is_cover) return -1;
      if (!a.is_cover && b.is_cover) return 1;
      return a.sort_order - b.sort_order;
    });
    const fromIndex = orderedGallery.findIndex(item => item.id === draggingGalleryItem.mediaId);
    const toIndex = orderedGallery.findIndex(item => item.id === targetMediaId);
    if (fromIndex < 0 || toIndex < 0) {
      return;
    }

    const nextGallery = [...orderedGallery];
    const [moved] = nextGallery.splice(fromIndex, 1);
    nextGallery.splice(toIndex, 0, moved);

    setProjects(prev =>
      prev.map(item =>
        item.id === project.id
          ? {
              ...item,
              gallery: nextGallery.map((media, index) => ({
                ...media,
                sort_order: index,
              })),
            }
          : item
      )
    );

    setDraggingGalleryItem(null);
    await persistGalleryOrder(project, nextGallery);
  };

  const onSetCover = async (projectId: string, mediaId: string) => {
    setError('');
    setMessage('');
    setGallerySortSavingId(mediaId);

    try {
      const response = await businessProjectService.setProjectGalleryCover(projectId, mediaId);
      if (response.error) {
        setError(response.message || response.error);
        return;
      }

      setMessage('Cover project berhasil diubah.');
      await loadProjects(selectedLine);
    } finally {
      setGallerySortSavingId(null);
    }
  };

  const onMoveGalleryItem = async (
    project: BusinessProjectItem,
    mediaId: string,
    direction: 'up' | 'down'
  ) => {
    const items = [...(project.gallery || [])].sort((a, b) => a.sort_order - b.sort_order);
    const currentIndex = items.findIndex(item => item.id === mediaId);
    if (currentIndex === -1) {
      return;
    }

    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= items.length) {
      return;
    }

    const currentItem = items[currentIndex];
    const targetItem = items[targetIndex];

    setError('');
    setMessage('');
    setGallerySortSavingId(mediaId);

    try {
      const firstUpdate = await businessProjectService.updateProjectGallerySort(
        project.id,
        currentItem.id,
        targetItem.sort_order
      );
      if (firstUpdate.error) {
        setError(firstUpdate.message || firstUpdate.error);
        return;
      }

      const secondUpdate = await businessProjectService.updateProjectGallerySort(
        project.id,
        targetItem.id,
        currentItem.sort_order
      );
      if (secondUpdate.error) {
        setError(secondUpdate.message || secondUpdate.error);
        return;
      }

      setMessage(`Foto berhasil dipindah ${direction === 'up' ? 'ke atas' : 'ke bawah'}.`);
      await loadProjects(selectedLine);
    } finally {
      setGallerySortSavingId(null);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      <section className="mx-auto max-w-7xl px-6 py-10">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Admin CMS</p>
            <h1 className="mt-2 text-3xl font-bold">Manage Completed Projects</h1>
            <p className="mt-2 text-sm text-slate-400">
              Update project untuk landing dan halaman lini bisnis langsung dari dashboard.
            </p>
          </div>
          <Link href="/admin/content" className="rounded-lg border border-slate-700 px-5 py-2 text-sm font-semibold hover:border-slate-500">
            Back to Content
          </Link>
        </header>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.2fr_1fr]">
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {businessLines.map(line => (
                <button
                  key={line.slug}
                  onClick={() => setSelectedLine(line.slug)}
                  className="rounded-lg border px-3 py-3 text-left transition-all"
                  style={{
                    borderColor: selectedLine === line.slug ? line.color : 'rgba(100,116,139,0.4)',
                    background: selectedLine === line.slug ? `${line.color}1f` : 'rgba(15,23,42,0.55)',
                  }}
                >
                  <p className="text-sm font-semibold">{line.label}</p>
                  <p className="text-xs text-slate-400">{line.slug}</p>
                </button>
              ))}
            </div>

            <form onSubmit={onSubmit} className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 space-y-4">
              <h2 className="text-lg font-semibold" style={{ color: selectedColor }}>
                {editingId ? 'Edit Project' : 'Tambah Project'}
              </h2>

              <label className="text-sm block">
                <span className="mb-1 block text-slate-300">Nama Project</span>
                <input
                  value={form.name}
                  onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2"
                  required
                />
              </label>

              <label className="text-sm block">
                <span className="mb-1 block text-slate-300">Lokasi Event</span>
                <input
                  value={form.event_location}
                  onChange={e => setForm(prev => ({ ...prev, event_location: e.target.value }))}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2"
                  placeholder="Contoh: Jakarta Convention Center"
                  required
                />
              </label>

              <label className="text-sm block">
                <span className="mb-1 block text-slate-300">Impact</span>
                <textarea
                  value={form.impact}
                  onChange={e => setForm(prev => ({ ...prev, impact: e.target.value }))}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2"
                  rows={4}
                  required
                />
              </label>
              <div className="grid gap-4 md:grid-cols-3">
                <label className="text-sm">
                  <span className="mb-1 block text-slate-300">Tanggal (1-31)</span>
                  <input
                    type="number"
                    value={form.day}
                    onChange={e => setForm(prev => ({ ...prev, day: Math.max(1, Math.min(31, Number(e.target.value) || 1)) }))}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2"
                    min={1}
                    max={31}
                    required
                  />
                </label>
                <label className="text-sm">
                  <span className="mb-1 block text-slate-300">Bulan (1-12)</span>
                  <input
                    type="number"
                    value={form.month}
                    onChange={e => setForm(prev => ({ ...prev, month: Math.max(1, Math.min(12, Number(e.target.value) || 1)) }))}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2"
                    min={1}
                    max={12}
                    required
                  />
                </label>
                <label className="text-sm">
                  <span className="mb-1 block text-slate-300">Tahun</span>
                  <input
                    value={form.year}
                    onChange={e => setForm(prev => ({ ...prev, year: e.target.value }))}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2"
                    maxLength={4}
                    required
                  />
                </label>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="text-sm">
                  <span className="mb-1 block text-slate-300">
                    {selectedLine === 'photobooth' ? 'Session' : 'Sort Order'}
                  </span>
                  <input
                    type="number"
                    value={form.sort_order}
                    onChange={e => setForm(prev => ({ ...prev, sort_order: Number(e.target.value) || 0 }))}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2"
                    min={0}
                  />
                </label>

                <label className="text-sm flex items-center gap-3 pt-6">
                  <input
                    type="checkbox"
                    checked={form.is_active}
                    onChange={e => setForm(prev => ({ ...prev, is_active: e.target.checked }))}
                  />
                  <span className="text-slate-300">Aktif</span>
                </label>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-lg px-4 py-2 font-semibold text-black disabled:opacity-60"
                  style={{ background: selectedColor }}
                >
                  {isSubmitting ? 'Menyimpan...' : editingId ? 'Update Project' : 'Tambah Project'}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(null);
                      setForm(emptyForm(selectedLine));
                    }}
                    className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold"
                  >
                    Batal Edit
                  </button>
                )}
              </div>

              {message && <p className="text-sm text-emerald-400">{message}</p>}
              {error && <p className="text-sm text-rose-400">{error}</p>}
            </form>

            <section className="rounded-xl border border-slate-800 bg-slate-900/40 p-5">
              <h2 className="text-lg font-semibold">Project List ({selectedLine})</h2>
              {isLoading ? (
                <p className="mt-4 text-sm text-slate-400">Loading projects...</p>
              ) : projects.length === 0 ? (
                <p className="mt-4 text-sm text-slate-400">Belum ada project untuk lini bisnis ini.</p>
              ) : (
                <div className="mt-4 space-y-3">
                  {projects.map(project => {
                    const isExpanded = editingId === project.id;
                    const impactPreview = project.impact.length > 120 ? `${project.impact.slice(0, 120)}...` : project.impact;

                    return (
                      <motion.article
                        key={project.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`rounded-lg border bg-slate-950/70 p-4 ${isExpanded ? 'border-cyan-700/70' : 'border-slate-800'}`}
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div>
                            <h3 className="font-semibold">{project.name}</h3>
                            {project.event_location ? (
                              <p className="mt-1 text-[11px] uppercase tracking-[0.12em] text-slate-400">Lokasi: {project.event_location}</p>
                            ) : null}
                          </div>
                          <div className="flex gap-2 text-xs">
                            <span className="rounded bg-slate-800 px-2 py-1">{formatDate(project.day, project.month, project.year)}</span>
                            <span className="rounded bg-slate-800 px-2 py-1">{getSessionLabel(project.business_line, project.sort_order)}</span>
                            <span className="rounded bg-slate-800 px-2 py-1">{project.is_active ? 'active' : 'inactive'}</span>
                            {isExpanded ? <span className="rounded bg-cyan-600/30 px-2 py-1 text-cyan-300">editing</span> : null}
                          </div>
                        </div>

                        <p className="mt-2 text-sm text-slate-300">{isExpanded ? project.impact : impactPreview}</p>

                        {!isExpanded ? (
                          <p className="mt-2 text-xs text-slate-500">Detail galeri ditutup untuk performa. Klik Edit untuk membuka project ini.</p>
                        ) : (
                          <div className="mt-3 rounded-lg border border-slate-800 bg-slate-900/40 p-3">
                            <p className="text-xs uppercase tracking-[0.12em] text-slate-400">Project Gallery</p>
                            <p className="mt-1 text-xs text-slate-500">Upload file langsung dari device (jpg/jpeg/png/webp/gif/mp4).</p>

                            <div className="mt-3 flex flex-wrap items-center gap-2">
                              <input
                                type="file"
                                accept="image/jpeg,image/png,image/webp,image/gif,video/mp4"
                                multiple
                                onChange={event => onFilesSelected(project.id, event.target.files)}
                                className="text-xs text-slate-300 file:mr-3 file:rounded file:border-0 file:bg-slate-700 file:px-3 file:py-1 file:text-xs file:font-semibold file:text-white"
                              />
                              <button
                                onClick={() => onUploadGallery(project.id)}
                                disabled={uploadingProjectId === project.id}
                                className="rounded border border-cyan-700 px-3 py-1 text-xs font-semibold text-cyan-300 disabled:opacity-60"
                              >
                                {uploadingProjectId === project.id ? 'Uploading...' : 'Upload File'}
                              </button>
                            </div>

                            {project.gallery?.length ? (
                              <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                                {[...project.gallery]
                                  .sort((a, b) => {
                                    if (a.is_cover && !b.is_cover) return -1;
                                    if (!a.is_cover && b.is_cover) return 1;
                                    return a.sort_order - b.sort_order;
                                  })
                                  .map((media: BusinessProjectGalleryItem) => (
                                    <article
                                      key={media.id}
                                      draggable
                                      onDragStart={() => onGalleryDragStart(project.id, media.id)}
                                      onDragOver={event => event.preventDefault()}
                                      onDrop={() => onGalleryDrop(project, media.id)}
                                      onDragEnd={() => setDraggingGalleryItem(null)}
                                      className={`rounded border border-slate-700 bg-slate-950/70 p-2 transition ${draggingGalleryItem?.mediaId === media.id ? 'opacity-60' : ''}`}
                                    >
                                      <div className="mb-2 flex items-center justify-end gap-2">
                                        {isVideoFile(media.file_url, media.file_name) ? (
                                          <span className="rounded bg-violet-500/20 px-2 py-1 text-[10px] uppercase tracking-[0.12em] text-violet-200">
                                            Video
                                          </span>
                                        ) : null}
                                        {isGifFile(media.file_url, media.file_name) ? (
                                          <span className="rounded bg-fuchsia-500/20 px-2 py-1 text-[10px] uppercase tracking-[0.12em] text-fuchsia-200">
                                            GIF
                                          </span>
                                        ) : null}
                                      </div>
                                      {isVideoFile(media.file_url, media.file_name) ? (
                                        <video
                                          src={media.file_url}
                                          className="h-24 w-full rounded bg-black object-cover"
                                          muted
                                          loop
                                          playsInline
                                          controls
                                        />
                                      ) : (
                                        <img src={media.file_url} alt="Photo" className="h-24 w-full rounded object-cover" />
                                      )}
                                      <div className="mt-2 flex items-center justify-end gap-2">
                                        {media.is_cover ? <span className="rounded bg-cyan-500/20 px-2 py-1 text-[10px] uppercase tracking-[0.12em] text-cyan-300">Cover</span> : null}
                                      </div>
                                      <label className="mt-2 block text-[10px] text-slate-400">
                                        Sort
                                        <input
                                          type="number"
                                          min={0}
                                          value={gallerySortValues[media.id] ?? media.sort_order}
                                          onChange={event => onGallerySortChange(media.id, event.target.value)}
                                          className="mt-1 w-full rounded border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-white"
                                        />
                                      </label>
                                      <button
                                        onClick={() => onSaveGallerySort(project.id, media.id)}
                                        disabled={gallerySortSavingId === media.id || gallerySortSavingId === project.id}
                                        className="mt-2 w-full rounded border border-cyan-700 px-2 py-1 text-[10px] font-semibold text-cyan-300 disabled:opacity-60"
                                      >
                                        {gallerySortSavingId === media.id || gallerySortSavingId === project.id ? 'Menyimpan...' : 'Simpan Urutan'}
                                      </button>
                                      <div className="mt-2 grid grid-cols-2 gap-2">
                                        <button
                                          onClick={() => onMoveGalleryItem(project, media.id, 'up')}
                                          disabled={gallerySortSavingId === media.id || gallerySortSavingId === project.id}
                                          className="rounded border border-slate-700 px-2 py-1 text-[10px] font-semibold text-slate-200 disabled:opacity-60"
                                        >
                                          Naik
                                        </button>
                                        <button
                                          onClick={() => onMoveGalleryItem(project, media.id, 'down')}
                                          disabled={gallerySortSavingId === media.id || gallerySortSavingId === project.id}
                                          className="rounded border border-slate-700 px-2 py-1 text-[10px] font-semibold text-slate-200 disabled:opacity-60"
                                        >
                                          Turun
                                        </button>
                                      </div>
                                      <button
                                        onClick={() => onSetCover(project.id, media.id)}
                                        disabled={gallerySortSavingId === media.id || gallerySortSavingId === project.id || media.is_cover}
                                        className="mt-2 w-full rounded border border-amber-700 px-2 py-1 text-[10px] font-semibold text-amber-300 disabled:opacity-60"
                                      >
                                        {media.is_cover ? 'Cover Aktif' : 'Jadikan Cover'}
                                      </button>
                                      <button
                                        onClick={() => onDeleteGalleryItem(project.id, media.id)}
                                        className="mt-2 rounded border border-rose-700 px-2 py-1 text-[10px] font-semibold text-rose-300"
                                      >
                                        Hapus Foto
                                      </button>
                                    </article>
                                  ))}
                              </div>
                            ) : (
                              <p className="mt-3 text-xs text-slate-500">Belum ada foto pada galeri project ini.</p>
                            )}
                          </div>
                        )}

                        <div className="mt-3 flex gap-2">
                          <button onClick={() => onEdit(project)} className="rounded border border-slate-600 px-3 py-1 text-xs font-semibold">
                            Edit
                          </button>
                          {isExpanded ? (
                            <button
                              onClick={() => {
                                setEditingId(null);
                                setForm(emptyForm(selectedLine));
                              }}
                              className="rounded border border-slate-600 px-3 py-1 text-xs font-semibold"
                            >
                              Tutup
                            </button>
                          ) : null}
                          <button
                            onClick={() => onDelete(project.id)}
                            className="rounded border border-rose-700 px-3 py-1 text-xs font-semibold text-rose-300"
                          >
                            Delete
                          </button>
                        </div>
                      </motion.article>
                    );
                  })}
                </div>
              )}
            </section>
          </div>

          <aside className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 h-fit">
            <h2 className="text-lg font-semibold">Audit Log</h2>
            <p className="mt-2 text-xs text-slate-400">20 perubahan terakhir.</p>
            <div className="mt-4 space-y-3">
              {auditLogs.length === 0 ? (
                <p className="text-sm text-slate-400">Belum ada audit log.</p>
              ) : (
                auditLogs.map(log => (
                  <article key={log.id} className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs uppercase tracking-wide text-slate-400">{log.action}</p>
                      <p className="text-xs text-slate-500">{new Date(log.changed_at).toLocaleString()}</p>
                    </div>
                    <p className="mt-2 text-xs text-slate-300">actor: {log.changed_by}</p>
                    <p className="mt-1 text-xs text-slate-500">project: {log.project_id}</p>
                  </article>
                ))
              )}
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
