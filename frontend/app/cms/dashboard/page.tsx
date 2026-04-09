'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/src/lib/api-client';
import { contactInquiryService, type ContactInquiryItem } from '@/src/services';

type ProfileData = {
  id: string;
  email: string;
  role?: string;
  roles?: string[];
};

export default function CmsDashboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [inquiries, setInquiries] = useState<ContactInquiryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingInquiries, setLoadingInquiries] = useState(true);
  const [error, setError] = useState('');
  const [inquiryError, setInquiryError] = useState('');

  useEffect(() => {
    let mounted = true;

    const verifySession = async () => {
      if (typeof window !== 'undefined') {
        const hasToken = !!localStorage.getItem('access_token');
        const hasCmsSession = localStorage.getItem('cms_logged_in') === 'true';
        if (!hasToken || !hasCmsSession) {
          router.replace('/auth/login');
          return;
        }
      }

      const response = await apiClient.get<ProfileData>('/v1/auth/profile');
      if (!mounted) return;

      const profileData = response.data ?? (response as unknown as ProfileData);

      if ((response as { error?: string }).error || !profileData) {
        const errorResponse = response as { message?: string; error?: string };
        setError(errorResponse.message || errorResponse.error || 'Sesi tidak valid.');
        setLoading(false);
        setLoadingInquiries(false);
        return;
      }

      const roles = profileData.roles ?? (profileData.role ? [profileData.role] : []);
      const hasCmsAccess = roles.some(role =>
        ['Admin', 'Super Admin', 'admin', 'super_admin'].includes(role)
      );

      if (!hasCmsAccess) {
        setError('Akses dashboard CMS ditolak.');
        setLoading(false);
        setLoadingInquiries(false);
        return;
      }

      setProfile(profileData);
      setLoading(false);

      const inquiryResponse = await contactInquiryService.getRecentInquiries(6);
      if (!mounted) return;

      if (inquiryResponse.error || !inquiryResponse.data) {
        setInquiryError(inquiryResponse.message || inquiryResponse.error || 'Gagal memuat inquiry.');
      } else {
        setInquiries(inquiryResponse.data);
      }

      setLoadingInquiries(false);
    };

    verifySession();

    return () => {
      mounted = false;
    };
  }, [router]);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('cms_logged_in');
      document.cookie = 'cms_logged_in=; path=/; max-age=0; samesite=lax';
    }
    router.replace('/auth/login');
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <p className="text-slate-300">Memuat dashboard CMS...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-400">Kygoo CMS</p>
            <h1 className="mt-2 text-3xl font-bold">Dashboard</h1>
            <p className="mt-2 text-sm text-slate-400">
              Login sebagai: {profile?.email || '-'} ({profile?.roles?.[0] || profile?.role || '-'})
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold hover:border-slate-500"
          >
            Logout
          </button>
        </header>

        {error && (
          <p className="mt-6 rounded-lg border border-rose-600/50 bg-rose-900/20 px-4 py-3 text-sm text-rose-300">
            {error}
          </p>
        )}

        <section className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/admin/content/projects"
            className="rounded-xl border border-cyan-700/40 bg-cyan-900/10 p-5 transition hover:border-cyan-400"
          >
            <p className="text-xs uppercase tracking-[0.12em] text-cyan-300">Primary</p>
            <h2 className="mt-2 text-xl font-semibold">Projects CMS</h2>
            <p className="mt-2 text-sm text-slate-300">
              Kelola completed project per lini bisnis + audit log.
            </p>
          </Link>

          <Link
            href="/admin/content"
            className="rounded-xl border border-slate-700 bg-slate-900/40 p-5 transition hover:border-slate-500"
          >
            <p className="text-xs uppercase tracking-[0.12em] text-slate-400">Content</p>
            <h2 className="mt-2 text-xl font-semibold">Content Manager</h2>
            <p className="mt-2 text-sm text-slate-300">Edit konten tiap unit bisnis.</p>
          </Link>

          <Link
            href="/admin"
            className="rounded-xl border border-slate-700 bg-slate-900/40 p-5 transition hover:border-slate-500"
          >
            <p className="text-xs uppercase tracking-[0.12em] text-slate-400">Admin</p>
            <h2 className="mt-2 text-xl font-semibold">Admin Hub</h2>
            <p className="mt-2 text-sm text-slate-300">Masuk ke modul admin lengkap.</p>
          </Link>
        </section>

        <section className="mt-10 rounded-xl border border-slate-800 bg-slate-900/40 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-cyan-400">Bookings</p>
              <h2 className="mt-2 text-2xl font-bold">Recent Contact Inquiries</h2>
            </div>
            <Link href="/admin/content/projects" className="text-sm text-cyan-300 hover:text-cyan-200">
              Manage projects
            </Link>
          </div>

          {inquiryError && (
            <p className="mt-4 rounded-lg border border-rose-600/50 bg-rose-900/20 px-4 py-3 text-sm text-rose-300">
              {inquiryError}
            </p>
          )}

          {loadingInquiries ? (
            <p className="mt-4 text-sm text-slate-400">Memuat inquiry terbaru...</p>
          ) : inquiries.length === 0 ? (
            <p className="mt-4 text-sm text-slate-400">Belum ada booking masuk.</p>
          ) : (
            <div className="mt-4 grid gap-3 lg:grid-cols-2">
              {inquiries.map((inquiry) => (
                <article key={inquiry.id} className="rounded-lg border border-slate-800 bg-slate-950/60 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="font-semibold">{inquiry.name}</h3>
                    <span className="rounded bg-slate-800 px-2 py-1 text-xs uppercase tracking-[0.12em] text-slate-300">
                      {inquiry.status}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-slate-300">
                    {inquiry.business_line} · {inquiry.event_type}
                  </p>
                  <p className="mt-1 text-sm text-slate-400">
                    {inquiry.event_date} · {inquiry.location} · {inquiry.guest_count}
                  </p>
                  <p className="mt-3 line-clamp-3 text-sm text-slate-300">{inquiry.message}</p>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
