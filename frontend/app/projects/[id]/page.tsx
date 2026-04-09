'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { businessProjectService, type BusinessProjectGalleryItem, type BusinessProjectItem } from '@/src/services';

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
                <img
                  src={coverImage.file_url}
                  alt={coverImage.file_name || project.name}
                  className="h-[420px] w-full object-cover"
                />
              </button>
              <div className="flex items-center justify-between gap-4 px-5 py-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-cyan-400">Cover</p>
                  <p className="text-sm text-slate-300">Klik gambar untuk preview penuh</p>
                </div>
                <p className="text-xs text-slate-500">{gallery.length} foto</p>
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
                  <img
                    src={item.file_url}
                    alt={`Photo`}
                    className="h-64 w-full object-cover"
                    loading="lazy"
                  />
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
            <img
              src={activeImage.file_url}
              alt={`Photo`}
              className="max-h-[78vh] w-full bg-black object-contain"
            />
            <div className="flex items-center justify-between gap-3 px-4 py-3">
              <div>
                <p className="text-xs text-slate-500">Klik di luar gambar untuk menutup</p>
              </div>
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
      )}
    </main>
  );
}
