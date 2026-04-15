'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { businessProjectService, type BusinessProjectGalleryItem, type BusinessProjectItem } from '@/src/services';

function isVideoFile(url: string, fileName?: string): boolean {
  const source = `${fileName || ''} ${url}`.toLowerCase();
  return source.includes('.mp4');
}

function isGifFile(url: string, fileName?: string): boolean {
  const source = `${fileName || ''} ${url}`.toLowerCase();
  return source.includes('.gif');
}

export default function ProjectGalleryPage() {
  const params = useParams<{ id?: string }>();
  const projectId = params?.id;

  const [project, setProject] = useState<BusinessProjectItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState<BusinessProjectGalleryItem | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadProject = async () => {
      if (!projectId) {
        setProject(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      const response = await businessProjectService.getProjectDetail(projectId);
      if (!mounted) return;

      if (response.error || !response.data) {
        setProject(null);
      } else {
        setProject(response.data);
      }
      setLoading(false);
    };

    loadProject();

    return () => {
      mounted = false;
    };
  }, [projectId]);

  const gallery = useMemo(() => {
    return [...(project?.gallery ?? [])].sort((a, b) => {
      if (a.is_cover && !b.is_cover) return -1;
      if (!a.is_cover && b.is_cover) return 1;
      return a.sort_order - b.sort_order;
    });
  }, [project]);

  const coverImage = gallery.find(item => item.is_cover) ?? gallery[0] ?? null;

  const activeIndex = useMemo(() => {
    if (!activeImage) return -1;
    return gallery.findIndex(item => item.id === activeImage.id);
  }, [activeImage, gallery]);

  const moveImage = (direction: 'prev' | 'next') => {
    if (!activeImage || gallery.length === 0) return;
    const currentIndex = gallery.findIndex(item => item.id === activeImage.id);
    if (currentIndex < 0) return;

    const nextIndex =
      direction === 'next'
        ? (currentIndex + 1) % gallery.length
        : (currentIndex - 1 + gallery.length) % gallery.length;

    setActiveImage(gallery[nextIndex]);
  };

  useEffect(() => {
    if (!activeImage) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        moveImage('next');
      }
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        moveImage('prev');
      }
      if (event.key === 'Escape') {
        event.preventDefault();
        setActiveImage(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeImage, gallery]);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 text-white">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Project Gallery</p>
          <h1 className="mt-3 text-3xl font-bold">Memuat galeri...</h1>
        </div>
      </main>
    );
  }

  if (!project) {
    return (
      <main className="min-h-screen bg-slate-950 text-white">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Project Gallery</p>
          <h1 className="mt-3 text-3xl font-bold">Project tidak ditemukan</h1>
          <p className="mt-3 text-slate-300">Project mungkin sudah nonaktif atau belum tersedia untuk publik.</p>
          <Link href="/" className="mt-6 inline-block rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold">
            Kembali ke landing
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <header className="border-b border-slate-800 pb-6">
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-400">Project Gallery</p>
          <h1 className="mt-2 text-3xl font-bold">{project.name}</h1>
          <p className="mt-2 text-sm text-slate-400">
            {project.business_line} · {project.year}
          </p>
          {project.event_location ? <p className="mt-1 text-xs uppercase tracking-[0.12em] text-slate-400">{project.event_location}</p> : null}
          <p className="mt-3 max-w-3xl text-slate-300">{project.impact}</p>
        </header>

        <section className="mt-8">
          {coverImage ? (
            <div className="mb-8 overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/40">
              <button type="button" className="block w-full text-left" onClick={() => setActiveImage(coverImage)}>
                {isVideoFile(coverImage.file_url, coverImage.file_name) ? (
                  <video
                    src={coverImage.file_url}
                    className="h-[420px] w-full bg-black object-cover"
                    controls
                    playsInline
                  />
                ) : (
                  <img
                    src={coverImage.file_url}
                    alt={coverImage.file_name || project.name}
                    className="h-[420px] w-full object-cover"
                  />
                )}
              </button>
              <div className="flex items-center justify-between gap-4 px-5 py-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-cyan-400">Cover</p>
                  <p className="text-sm text-slate-300">Klik gambar untuk preview penuh</p>
                </div>
                <div className="flex items-center gap-2">
                  {isVideoFile(coverImage.file_url, coverImage.file_name) ? (
                    <span className="rounded bg-violet-500/20 px-2 py-1 text-[10px] uppercase tracking-[0.12em] text-violet-200">
                      Video
                    </span>
                  ) : null}
                  {isGifFile(coverImage.file_url, coverImage.file_name) ? (
                    <span className="rounded bg-fuchsia-500/20 px-2 py-1 text-[10px] uppercase tracking-[0.12em] text-fuchsia-200">
                      GIF
                    </span>
                  ) : null}
                  <p className="text-xs text-slate-500">{gallery.length} file</p>
                </div>
              </div>
            </div>
          ) : null}

          {gallery.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {gallery.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveImage(item)}
                  className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/40 text-left transition hover:border-cyan-500"
                >
                  <div className="absolute ml-3 mt-3 flex items-center gap-2">
                    {isVideoFile(item.file_url, item.file_name) ? (
                      <span className="rounded bg-violet-500/25 px-2 py-1 text-[10px] uppercase tracking-[0.12em] text-violet-200">
                        Video
                      </span>
                    ) : null}
                    {isGifFile(item.file_url, item.file_name) ? (
                      <span className="rounded bg-fuchsia-500/25 px-2 py-1 text-[10px] uppercase tracking-[0.12em] text-fuchsia-200">
                        GIF
                      </span>
                    ) : null}
                  </div>
                  {isVideoFile(item.file_url, item.file_name) ? (
                    <video
                      src={item.file_url}
                      className="h-64 w-full bg-black object-cover"
                      muted
                      loop
                      playsInline
                      controls
                    />
                  ) : (
                    <img
                      src={item.file_url}
                      alt={`Photo`}
                      className="h-64 w-full object-cover"
                      loading="lazy"
                    />
                  )}
                  {item.is_cover && (
                    <div className="flex items-center justify-end gap-2 px-3 py-2">
                      <span className="rounded bg-cyan-500/20 px-2 py-1 text-[10px] uppercase text-cyan-300">
                        Cover
                      </span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          ) : (
            <p className="rounded-lg border border-slate-800 bg-slate-900/40 px-4 py-3 text-sm text-slate-300">
              Belum ada foto galeri untuk project ini.
            </p>
          )}
        </section>

        <Link href="/" className="mt-8 inline-block rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold">
          Kembali ke landing
        </Link>
      </div>

      {activeImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setActiveImage(null)}
        >
          <div
            className="max-h-[90vh] w-full max-w-5xl overflow-hidden rounded-2xl border border-slate-700 bg-slate-950"
            onClick={event => event.stopPropagation()}
          >
            <div className="relative">
              {isVideoFile(activeImage.file_url, activeImage.file_name) ? (
                <video
                  src={activeImage.file_url}
                  className="max-h-[78vh] w-full bg-black object-contain"
                  controls
                  autoPlay
                  loop
                  playsInline
                />
              ) : (
                <img
                  src={activeImage.file_url}
                  alt={`Photo`}
                  className="max-h-[78vh] w-full bg-black object-contain"
                />
              )}
              {gallery.length > 1 && (
                <>
                  <button
                    type="button"
                    className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full border border-slate-500/70 bg-slate-950/80 px-3 py-2 text-sm font-semibold text-slate-100"
                    onClick={() => moveImage('prev')}
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-slate-500/70 bg-slate-950/80 px-3 py-2 text-sm font-semibold text-slate-100"
                    onClick={() => moveImage('next')}
                  >
                    →
                  </button>
                </>
              )}
            </div>
            <div className="flex items-center justify-between gap-3 px-4 py-3">
              <div>
                <p className="text-xs text-slate-500">Klik di luar gambar untuk menutup</p>
                {activeIndex >= 0 && <p className="text-xs text-slate-500">Foto {activeIndex + 1} dari {gallery.length} · Gunakan ← → untuk pindah</p>}
                <div className="mt-1 flex items-center gap-2">
                  {isVideoFile(activeImage.file_url, activeImage.file_name) ? (
                    <span className="rounded bg-violet-500/20 px-2 py-1 text-[10px] uppercase tracking-[0.12em] text-violet-200">
                      Video
                    </span>
                  ) : null}
                  {isGifFile(activeImage.file_url, activeImage.file_name) ? (
                    <span className="rounded bg-fuchsia-500/20 px-2 py-1 text-[10px] uppercase tracking-[0.12em] text-fuchsia-200">
                      GIF
                    </span>
                  ) : null}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {gallery.length > 1 && (
                  <>
                    <button
                      type="button"
                      className="rounded-lg border border-slate-700 px-3 py-2 text-xs font-semibold"
                      onClick={() => moveImage('prev')}
                    >
                      Sebelumnya
                    </button>
                    <button
                      type="button"
                      className="rounded-lg border border-slate-700 px-3 py-2 text-xs font-semibold"
                      onClick={() => moveImage('next')}
                    >
                      Selanjutnya
                    </button>
                  </>
                )}
              <button
                type="button"
                className="rounded-lg border border-slate-700 px-3 py-2 text-xs font-semibold"
                onClick={() => setActiveImage(null)}
              >
                Tutup
              </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
