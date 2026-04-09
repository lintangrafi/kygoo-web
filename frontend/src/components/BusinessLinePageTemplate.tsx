'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export type BusinessLineStat = {
  label: string;
  value: string;
};

export type BusinessLineService = {
  icon: string;
  title: string;
  desc: string;
};

export type BusinessLineProject = {
  id?: string;
  event_location?: string;
  year: string;
  day?: number;
  month?: number;
  created_at?: string;
  name: string;
  impact: string;
  sort_order?: number;
  gallery?: Array<{
    id: string;
    file_url: string;
    file_name: string;
    is_cover?: boolean;
    sort_order?: number;
  }>;
};

type PricingPackage = {
  name: string;
  price: string;
  features: string[];
  highlight?: boolean;
};

type BusinessLinePageTemplateProps = {
  businessName: string;
  accent: string;
  secondaryAccent: string;
  heroKicker: string;
  heroTitle: string;
  heroLead: string;
  ctaPrimaryLabel: string;
  stats: BusinessLineStat[];
  services: BusinessLineService[];
  projects: BusinessLineProject[];
  pricingTitle: string;
  pricingPackages: PricingPackage[];
  closingTitle: string;
  closingLead: string;
  showTechBackground?: boolean;
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

function formatDate(day?: number, month?: number, year?: string): string {
  if (!day || !month || !year) return '';
  const padDay = String(day).padStart(2, '0');
  const padMonth = String(month).padStart(2, '0');
  return `${padDay}/${padMonth}/${year}`;
}

export function BusinessLinePageTemplate({
  businessName,
  accent,
  secondaryAccent,
  heroKicker,
  heroTitle,
  heroLead,
  ctaPrimaryLabel,
  stats,
  services,
  projects,
  pricingTitle,
  pricingPackages,
  closingTitle,
  closingLead,
  showTechBackground = true,
}: BusinessLinePageTemplateProps) {
  const orderedProjects = [...projects].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));

  return (
    <div className="w-full bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden">
      {showTechBackground && (
        <div className="fixed inset-0 pointer-events-none opacity-10">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `linear-gradient(0deg, transparent 24%, ${accent}25%, ${accent}25%, transparent 26%, transparent 74%, ${accent}25%, ${accent}25%, transparent 76%, transparent), linear-gradient(90deg, transparent 24%, ${accent}25%, ${accent}25%, transparent 26%, transparent 74%, ${accent}25%, ${accent}25%, transparent 76%, transparent)`,
              backgroundSize: '50px 50px',
            }}
          />
        </div>
      )}

      <nav className="border-b border-slate-800/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center relative z-10">
          <Link href="/" className="text-xl font-bold font-mono">
            Kygoo <span style={{ color: accent }}>{businessName}</span>
          </Link>
          <Link
            href="/contact"
            className="px-6 py-2 rounded-lg border border-slate-700 hover:border-current transition-all"
            style={{ color: accent }}
          >
            Booking
          </Link>
        </div>
      </nav>

      <section className="min-h-[80vh] flex items-center justify-center px-4 py-20 relative">
        <motion.div
          className="absolute top-20 right-10 w-72 h-72 rounded-full"
          style={{ background: `${accent}10` }}
          animate={{ y: [0, 20, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 left-10 w-96 h-96 rounded-full"
          style={{ background: `${secondaryAccent}10` }}
          animate={{ y: [0, -20, 0], rotate: [0, -5, 0] }}
          transition={{ duration: 7, repeat: Infinity }}
        />

        <motion.div
          className="max-w-4xl text-center relative z-10"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.p
            variants={itemVariants}
            className="text-sm tracking-widest uppercase font-bold mb-4"
            style={{ color: accent }}
          >
            {heroKicker}
          </motion.p>

          <motion.h1 variants={itemVariants} className="text-6xl md:text-7xl font-bold leading-tight mb-6">
            {heroTitle}
          </motion.h1>

          <motion.p variants={itemVariants} className="text-lg text-gray-300 mb-8 leading-relaxed">
            {heroLead}
          </motion.p>

          <motion.div variants={itemVariants} className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/contact"
              className="px-8 py-3 font-bold rounded transition-all hover:translate-y-[-2px]"
              style={{ background: accent, color: '#000' }}
            >
              {ctaPrimaryLabel}
            </Link>
            <Link
              href="#services"
              className="px-8 py-3 font-bold rounded border-2 transition-all hover:translate-y-[-2px]"
              style={{ borderColor: accent, color: accent }}
            >
              View Services
            </Link>
          </motion.div>

          <motion.div variants={itemVariants} className="mt-16 grid grid-cols-3 gap-4 text-center">
            {stats.map((stat) => (
              <div key={stat.label} className="p-4 rounded" style={{ background: `${accent}20` }}>
                <div className="text-2xl font-bold" style={{ color: accent }}>
                  {stat.value}
                </div>
                <div className="text-xs uppercase tracking-widest text-gray-400">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      <motion.section
        id="services"
        className="py-20 px-4 max-w-6xl mx-auto relative z-10"
        initial="hidden"
        whileInView="visible"
        variants={containerVariants}
      >
        <h2 className="text-4xl font-bold mb-12 text-center">Core Services</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <motion.div
              key={service.title}
              variants={itemVariants}
              className="p-6 rounded border-2 transition-all relative overflow-hidden"
              style={{
                borderColor: 'rgba(107, 114, 128, 0.25)',
                background: 'rgba(15, 15, 35, 0.5)',
              }}
              whileHover={{ scale: 1.05, y: -8 }}
            >
              <div className="text-5xl mb-3 relative z-10">{service.icon}</div>
              <h3 className="font-bold text-lg mb-2 relative z-10">{service.title}</h3>
              <p className="text-gray-300 text-sm relative z-10">{service.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      <motion.section
        className="py-20 px-4 max-w-6xl mx-auto relative z-10"
        initial="hidden"
        whileInView="visible"
        variants={containerVariants}
      >
        <h2 className="text-4xl font-bold mb-12 text-center">Completed Projects</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {orderedProjects.map((project) => {
            const gallery = [...(project.gallery ?? [])].sort((a, b) => {
              if (a.is_cover && !b.is_cover) return -1;
              if (!a.is_cover && b.is_cover) return 1;
              return (a.sort_order ?? 0) - (b.sort_order ?? 0);
            });
            const coverImage = gallery.find(item => item.is_cover) ?? gallery[0] ?? null;

            return (
            <motion.div
              key={project.id ?? project.name}
              variants={itemVariants}
              className="rounded-xl overflow-hidden relative group p-0 border border-slate-800"
              style={{ backgroundColor: `${accent}20` }}
              whileHover={{ scale: 1.05 }}
            >
              {coverImage ? (
                <img
                  src={coverImage.file_url}
                  alt={coverImage.file_name || project.name}
                  className="h-48 w-full object-cover"
                />
              ) : null}
              <div className="p-6">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm" style={{ color: accent }}>
                    {formatDate(project.day, project.month, project.year) || project.year}
                  </p>
                  {gallery.length > 0 && (
                    <span className="rounded bg-slate-800 px-2 py-1 text-[10px] uppercase tracking-[0.12em] text-slate-300">
                      {gallery.length} foto
                    </span>
                  )}
                </div>
                <h3 className="mt-2 text-xl font-bold">{project.name}</h3>
                {project.event_location ? (
                  <p className="mt-1 text-xs uppercase tracking-[0.12em] text-slate-400">{project.event_location}</p>
                ) : null}
                <p className="mt-3 text-gray-300">{project.impact}</p>
                {project.id ? (
                  <Link href={`/projects/${project.id}`} className="mt-4 inline-flex text-sm font-semibold" style={{ color: accent }}>
                    Buka galeri
                  </Link>
                ) : null}
              </div>
            </motion.div>
            );
          })}
        </div>
      </motion.section>

      <motion.section
        className="py-20 px-4"
        initial="hidden"
        whileInView="visible"
        variants={containerVariants}
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">{pricingTitle}</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPackages.map((pkg) => (
              <motion.div
                key={pkg.name}
                variants={itemVariants}
                className="p-8 rounded-xl border-2 transition-all"
                style={{
                  borderColor: pkg.highlight ? accent : 'rgba(107, 114, 128, 0.3)',
                  backgroundColor: pkg.highlight ? `${accent}20` : 'rgba(30, 41, 59, 0.5)',
                  transform: pkg.highlight ? 'scale(1.05)' : 'scale(1)',
                }}
              >
                <h3 className="text-2xl font-bold mb-2">{pkg.name}</h3>
                <div className="mb-6">
                  <span className="text-3xl font-bold" style={{ color: accent }}>
                    Rp {pkg.price}
                  </span>
                </div>
                <ul className="space-y-3 mb-8">
                  {pkg.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <span style={{ color: accent }}>✓</span>
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/contact"
                  className="w-full inline-flex justify-center py-3 rounded-lg font-semibold transition-all hover:translate-y-[-2px]"
                  style={{
                    background: pkg.highlight ? accent : 'transparent',
                    color: pkg.highlight ? '#000' : accent,
                    border: pkg.highlight ? 'none' : `2px solid ${accent}`,
                  }}
                >
                  Choose Plan
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      <motion.section
        className="py-20 px-4"
        initial="hidden"
        whileInView="visible"
        variants={containerVariants}
      >
        <div
          className="max-w-4xl mx-auto p-12 rounded-xl text-center"
          style={{
            backgroundColor: `${accent}20`,
            border: `2px solid ${accent}40`,
          }}
        >
          <motion.h2 variants={itemVariants} className="text-4xl font-bold mb-4">
            {closingTitle}
          </motion.h2>
          <motion.p variants={itemVariants} className="text-lg text-gray-300 mb-8">
            {closingLead}
          </motion.p>
          <motion.div variants={itemVariants} className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/contact"
              className="px-8 py-3 font-semibold rounded-lg transition-all hover:translate-y-[-2px]"
              style={{ background: accent, color: '#000' }}
            >
              Book Consultation
            </Link>
            <Link
              href="/"
              className="px-8 py-3 font-semibold rounded-lg border-2 transition-all hover:translate-y-[-2px]"
              style={{ borderColor: accent, color: accent }}
            >
              Back to Home
            </Link>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}
