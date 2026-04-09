'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  businessProjectService,
  type BusinessLineSlug,
  type BusinessProjectItem,
} from '@/src/services';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
};

export default function AdminDashboard() {
  const [projects, setProjects] = useState<BusinessProjectItem[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  const [projectError, setProjectError] = useState('');

  useEffect(() => {
    let mounted = true;

    const loadProjects = async () => {
      setIsLoadingProjects(true);
      setProjectError('');

      const response = await businessProjectService.getAllProjects(true);
      if (!mounted) return;

      if (response.error) {
        setProjectError(response.message || response.error);
        setProjects([]);
      } else {
        setProjects(response.data || []);
      }

      setIsLoadingProjects(false);
    };

    loadProjects();

    return () => {
      mounted = false;
    };
  }, []);

  const liveProjectStats = useMemo(() => {
    const lines: Array<{ slug: BusinessLineSlug; label: string; color: string }> = [
      { slug: 'studio', label: 'Studio', color: '#d4af37' },
      { slug: 'photobooth', label: 'Photobooth', color: '#ff006e' },
      { slug: 'digital', label: 'Digital', color: '#00d084' },
      { slug: 'coffee', label: 'Coffee', color: '#d97706' },
    ];

    const activeProjects = projects.filter(project => project.is_active).length;
    const inactiveProjects = projects.length - activeProjects;

    return {
      total: projects.length,
      active: activeProjects,
      inactive: inactiveProjects,
      byLine: lines.map(line => ({
        ...line,
        count: projects.filter(project => project.business_line === line.slug).length,
      })),
    };
  }, [projects]);

  const adminSections = [
    {
      title: 'Projects CMS',
      description: 'Tambah, ubah, hapus, dan urutkan project untuk semua lini bisnis.',
      icon: '📝',
      href: '/admin/content/projects',
      color: '#d4af37',
    },
    {
      title: 'Content Hub',
      description: 'Kelola section lain dan arahkan tim ke halaman yang tepat.',
      icon: '🗂️',
      href: '/admin/content',
      color: '#22d3ee',
    },
    {
      title: 'Orders',
      description: 'View and manage customer orders across all business lines',
      icon: '📦',
      href: '/admin/orders',
      color: '#ff006e',
    },
    {
      title: 'Analytics',
      description: 'Track business metrics, traffic, and performance data',
      icon: '📊',
      href: '/admin/analytics',
      color: '#00d084',
    },
    {
      title: 'Users',
      description: 'Manage user accounts and permissions',
      icon: '👥',
      href: '/admin/users',
      color: '#00e5ff',
    },
    {
      title: 'Roles & Permissions',
      description: 'Configure role-based access control',
      icon: '🔐',
      href: '/admin/roles',
      color: '#a78bfa',
    },
    {
      title: 'Settings',
      description: 'App configuration and preferences',
      icon: '⚙️',
      href: '/admin/settings',
      color: '#fb923c',
    },
  ];

  const recentProjects = [...projects]
    .sort((left, right) => Number(right.year) - Number(left.year) || right.sort_order - left.sort_order)
    .slice(0, 6);

  return (
    <div className="w-full bg-gradient-to-b from-slate-950 via-gray-900 to-slate-950 min-h-screen text-white">
      {/* Header */}
      <div className="border-b border-slate-800/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-gray-400 text-sm mt-1">Welcome back, Administrator</p>
          </div>
          <Link
            href="/"
            className="px-6 py-2 rounded-lg border border-slate-700 hover:border-current transition-all"
          >
            ← Back to Site
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Quick Stats */}
        <motion.section
          className="mb-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <h2 className="text-2xl font-bold mb-6">Project Metrics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Total Projects', value: String(liveProjectStats.total), change: 'Live from API', color: '#00d084' },
              { label: 'Active Projects', value: String(liveProjectStats.active), change: 'Published', color: '#00e5ff' },
              { label: 'Inactive Projects', value: String(liveProjectStats.inactive), change: 'Hidden from site', color: '#d4af37' },
              { label: 'Project Lines', value: String(liveProjectStats.byLine.length), change: '4 business lines', color: '#ff006e' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                variants={itemVariants}
                className="p-6 rounded-lg border-2 border-slate-800 cursor-pointer transition-all"
                whileHover={{
                  borderColor: stat.color,
                  boxShadow: `0 0 20px ${stat.color}30`,
                }}
              >
                <p className="text-gray-400 text-sm mb-2">{stat.label}</p>
                <p className="text-3xl font-bold mb-2">{stat.value}</p>
                <p style={{ color: stat.color }} className="text-sm font-semibold">
                  {stat.change}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Admin Sections Grid */}
        <motion.section
          className="mb-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <h2 className="text-2xl font-bold mb-6">Management Sections</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {adminSections.map((section) => (
              <Link key={section.href} href={section.href}>
                <motion.div
                  variants={itemVariants}
                  className="p-8 rounded-lg border-2 border-slate-800 transition-all h-full"
                  style={{
                    background: `linear-gradient(135deg, ${section.color}10, ${section.color}05)`,
                  }}
                  whileHover={{
                    borderColor: section.color,
                    boxShadow: `0 0 30px ${section.color}30`,
                    y: -4,
                  }}
                >
                  <div className="text-4xl mb-4">{section.icon}</div>
                  <h3 className="text-lg font-bold mb-2">{section.title}</h3>
                  <p className="text-gray-400 text-sm">{section.description}</p>
                  <p style={{ color: section.color }} className="text-sm font-semibold mt-4">
                    Manage →
                  </p>
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.section>

        {/* Recent Activity */}
        <motion.section
          className="mb-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <h2 className="text-2xl font-bold mb-6">Project Management</h2>
          <div className="mb-6 rounded-2xl border border-cyan-700/40 bg-cyan-900/10 p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Projects CMS</p>
                <h3 className="mt-2 text-xl font-bold">Kelola project website dari satu tempat</h3>
                <p className="mt-2 text-sm text-slate-300">
                  Buka halaman CMS untuk menambah project baru, mengubah impact, dan mengatur urutan tampil di landing page.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/admin/content/projects"
                  className="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-black transition-all hover:bg-cyan-400"
                >
                  Open Projects CMS
                </Link>
                <Link
                  href="/admin/content"
                  className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold transition-all hover:border-slate-500"
                >
                  Open Content Hub
                </Link>
              </div>
            </div>

            <div className="mt-6 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
              {liveProjectStats.byLine.map(line => (
                <div
                  key={line.slug}
                  className="rounded-xl border border-slate-800 bg-slate-950/60 p-4"
                  style={{ boxShadow: `0 0 20px ${line.color}12` }}
                >
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{line.label}</p>
                  <p className="mt-2 text-3xl font-bold" style={{ color: line.color }}>
                    {line.count}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
            <div>
              <h3 className="mb-4 text-lg font-bold">Recent Projects</h3>
              {isLoadingProjects ? (
                <p className="text-sm text-slate-400">Loading projects...</p>
              ) : projectError ? (
                <p className="text-sm text-rose-400">{projectError}</p>
              ) : recentProjects.length === 0 ? (
                <p className="text-sm text-slate-400">Belum ada project yang tersimpan di backend.</p>
              ) : (
                <div className="space-y-3">
                  {recentProjects.map(project => (
                    <div
                      key={project.id}
                      className="rounded-lg border border-slate-800 bg-slate-900/50 p-4"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <h4 className="font-semibold">{project.name}</h4>
                          <p className="text-xs text-slate-400">
                            {project.business_line} · {project.year} · sort {project.sort_order}
                          </p>
                        </div>
                        <span
                          className="rounded-full px-3 py-1 text-xs font-semibold"
                          style={{
                            background: project.is_active ? '#0f172a' : '#2b0f18',
                            color: project.is_active ? '#86efac' : '#fda4af',
                          }}
                        >
                          {project.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-slate-300">{project.impact}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <h3 className="mb-4 text-lg font-bold">Quick Actions</h3>
              <div className="space-y-3">
                <Link
                  href="/admin/content/projects"
                  className="block rounded-lg border border-slate-800 bg-slate-900/50 p-4 transition-all hover:border-cyan-500/60"
                >
                  <p className="font-semibold">Tambah project baru</p>
                  <p className="mt-1 text-sm text-slate-400">Gunakan CMS untuk create project per lini bisnis.</p>
                </Link>
                <Link
                  href="/admin/content/projects"
                  className="block rounded-lg border border-slate-800 bg-slate-900/50 p-4 transition-all hover:border-cyan-500/60"
                >
                  <p className="font-semibold">Edit project yang sudah ada</p>
                  <p className="mt-1 text-sm text-slate-400">Ubah year, impact, urutan tampil, dan status aktif.</p>
                </Link>
                <Link
                  href="/admin/content/projects"
                  className="block rounded-lg border border-slate-800 bg-slate-900/50 p-4 transition-all hover:border-cyan-500/60"
                >
                  <p className="font-semibold">Lihat audit log</p>
                  <p className="mt-1 text-sm text-slate-400">Setiap create/update/delete tercatat otomatis di backend.</p>
                </Link>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Recent Activity */}
        <motion.section
          className="mb-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <h2 className="text-2xl font-bold mb-6">Recent Activity</h2>
          <div className="space-y-3">
            {[
              { type: 'CMS', message: 'Projects dashboard connected to backend CRUD API', time: 'just now' },
              { type: 'CMS', message: 'Live project list now shows the latest website entries', time: '2 mins ago' },
              { type: 'CMS', message: 'Admin can add, edit, and delete completed projects', time: '5 mins ago' },
              { type: 'CMS', message: 'Audit logs are available for every project change', time: '10 mins ago' },
            ].map((activity, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="p-4 rounded-lg border border-slate-800 bg-slate-900/50 flex justify-between items-center hover:border-slate-700 transition-all"
              >
                <div className="flex gap-4 items-center">
                  <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-sm font-bold">
                    {activity.type.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{activity.message}</p>
                    <p className="text-gray-500 text-xs">{activity.time}</p>
                  </div>
                </div>
                <span className="text-xs px-3 py-1 rounded-full bg-slate-800 text-gray-300">
                  {activity.type}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Quick Links */}
        <motion.section
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            variants={itemVariants}
            className="p-6 rounded-lg border border-slate-800 bg-gradient-to-br from-blue-900/30 to-blue-900/10"
          >
            <h3 className="font-bold text-lg mb-3">📧 Support</h3>
            <p className="text-gray-400 text-sm mb-4">
              Contact support team for technical assistance
            </p>
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-semibold transition-all">
              Send Ticket
            </button>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="p-6 rounded-lg border border-slate-800 bg-gradient-to-br from-green-900/30 to-green-900/10"
          >
            <h3 className="font-bold text-lg mb-3">📚 Documentation</h3>
            <p className="text-gray-400 text-sm mb-4">
              Read API docs and integration guides
            </p>
            <button className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-sm font-semibold transition-all">
              View Docs
            </button>
          </motion.div>
        </motion.section>
      </div>
    </div>
  );
}
