'use client';

import type { CSSProperties } from 'react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Cormorant_Garamond, Urbanist } from 'next/font/google';
import { AnimatePresence, motion } from 'framer-motion';
import styles from './landing-main.module.css';
import { BUSINESS_LINES, mergeProjectsIntoLines } from '@/lib/business-lines';
import { fetchAllProjectsMap } from '@/lib/business-projects-client';
import { siteBrandingService, type SiteBranding } from '@/src/services';

const displayFont = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-kygoo-display',
  weight: ['500', '600', '700'],
});

const bodyFont = Urbanist({
  subsets: ['latin'],
  variable: '--font-kygoo-body',
  weight: ['400', '500', '600', '700'],
});

const businessLines = BUSINESS_LINES;

const sectionTransition = {
  duration: 0.7,
  ease: [0.22, 1, 0.36, 1] as const,
};

const heroLoops = [
  { label: 'Studio', phase: 0 },
  { label: 'Photobooth', phase: 0.9 },
  { label: 'Digital', phase: 1.8 },
  { label: 'Coffee', phase: 2.7 },
];

function formatDate(day?: number, month?: number, year?: string): string {
  if (!day || !month || !year) return '';
  const padDay = String(day).padStart(2, '0');
  const padMonth = String(month).padStart(2, '0');
  return `${padDay}/${padMonth}/${year}`;
}

export default function HomePage() {
  const [businessLines, setBusinessLines] = useState(BUSINESS_LINES);
  const [activeSlug, setActiveSlug] = useState<(typeof businessLines)[number]['slug']>('studio');
  const [branding, setBranding] = useState<SiteBranding | null>(null);
  const activeLine = businessLines.find(line => line.slug === activeSlug) ?? businessLines[0];
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    let mounted = true;

    const hydrateBranding = async () => {
      const response = await siteBrandingService.getCurrent();
      if (!mounted || response.error || !response.data) {
        return;
      }

      setBranding(response.data);
    };

    const hydrateProjects = async () => {
      const projectMap = await fetchAllProjectsMap();
      if (!mounted) return;

      setBusinessLines(prev => mergeProjectsIntoLines(prev, projectMap));

      const firstLineWithProjects = (['studio', 'photobooth', 'digital', 'coffee'] as const).find(
        slug => (projectMap[slug]?.length ?? 0) > 0
      );

      if (firstLineWithProjects) {
        setActiveSlug(current => (current === 'studio' ? firstLineWithProjects : current));
      }
    };

    void hydrateBranding();
    hydrateProjects();

    return () => {
      mounted = false;
    };
  }, []);

  const accentVars = {
    '--line-accent': activeLine.accent,
  } as CSSProperties;

  return (
    <main className={`${styles.page} ${displayFont.variable} ${bodyFont.variable}`} style={accentVars}>
      <div className={styles.noise} aria-hidden="true" />
      <div className={styles.orbA} aria-hidden="true" />
      <div className={styles.orbB} aria-hidden="true" />

      <section className={styles.heroWrap}>
        <header className={styles.topbar}>
          <div className={styles.brandWrap}>
            <img
              src={branding?.main_logo_url || '/logo_icon.png'}
              alt={branding?.main_logo_alt || 'Kygoo Group'}
              className={branding?.header_logo_rounded === false ? styles.brandLogoRounded : styles.brandLogoCircle}
              style={{
                width: `${branding?.main_logo_size || 40}px`,
                height: `${branding?.main_logo_size || 40}px`,
              }}
            />
            <p className={styles.brand}>KYGOO GROUP</p>
          </div>
          <nav className={styles.quickNav} aria-label="Business navigation">
            {businessLines.map(line => (
              <Link key={line.slug} href={`/${line.slug}`}>
                {line.badge.replace('Kygoo ', '')}
              </Link>
            ))}
          </nav>
        </header>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={sectionTransition}
          className={styles.heroGrid}
        >
          <div className={styles.heroCopy}>
            <p className={styles.kicker}>One house. Four signatures.</p>
            <h1 className={styles.heroTitle}>
              Layanan profesional untuk event, brand, dan digital dalam satu ekosistem.
            </h1>
            <p className={styles.heroLead}>
              Kygoo merangkai studio visual, photobooth interaktif, digital growth, dan coffee experience
              dalam satu ekosistem layanan. Anda memilih kebutuhannya, kami orkestrasi eksekusinya.
            </p>

            <div className={styles.heroActions}>
              <Link href={`/${activeLine.slug}`} className={styles.primaryCta}>
                Lihat {activeLine.badge.replace('Kygoo ', '')}
              </Link>
              <Link href="/contact" className={styles.secondaryCta}>
                Hubungi tim bisnis
              </Link>
            </div>
          </div>

          <aside className={styles.heroVisual} aria-hidden="true">
            <div className={styles.heroVisualCenter}>KYGOO</div>
            {heroLoops.map(loop => (
              <motion.div
                key={loop.label}
                className={styles.heroLoop}
                animate={{ rotate: 360 }}
                transition={{
                  duration: 16,
                  ease: 'linear',
                  repeat: Infinity,
                  delay: loop.phase,
                }}
              >
                <span>{loop.label}</span>
                <span>{loop.label}</span>
              </motion.div>
            ))}
          </aside>
        </motion.div>
      </section>

      <section className={styles.selectorSection}>
        <div className={styles.selectorHeader}>
          <p>Lini bisnis</p>
          <h2>Pilih fokus, lihat kedalaman layanan.</h2>
        </div>

        <div className={styles.selectorRail} role="tablist" aria-label="Pilih lini bisnis">
          {businessLines.map(line => {
            const isActive = line.slug === activeSlug;
            return (
              <button
                key={line.slug}
                role="tab"
                aria-selected={isActive}
                aria-controls={`panel-${line.slug}`}
                id={`tab-${line.slug}`}
                className={styles.selectorButton}
                data-active={isActive}
                onClick={() => setActiveSlug(line.slug)}
                style={{ '--button-accent': line.accent } as CSSProperties}
              >
                <span>{line.badge}</span>
                <small>{line.title}</small>
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.article
            key={activeLine.slug}
            id={`panel-${activeLine.slug}`}
            role="tabpanel"
            aria-labelledby={`tab-${activeLine.slug}`}
            className={styles.detailPanel}
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={sectionTransition}
          >
            <p className={styles.detailBadge}>{activeLine.badge}</p>
            <h3>{activeLine.title}</h3>
            <p className={styles.detailDescription}>{activeLine.description}</p>
            <ul className={styles.detailList}>
              {activeLine.details.map(item => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <Link href={`/${activeLine.slug}`} className={styles.inlineLink}>
              Buka halaman {activeLine.badge}
            </Link>
          </motion.article>
        </AnimatePresence>
      </section>

      <section className={styles.systemSection}>
        <div className={styles.systemHeading}>
          <p>Completed projects</p>
          <h2>Proyek yang sudah diselesaikan oleh {activeLine.badge}.</h2>
        </div>
        <div className={styles.rhythmGrid}>
          {[...activeLine.projects]
            .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
            .map((project, index) => {
              const gallery = [...(project.gallery ?? [])].sort((a, b) => {
                if (a.is_cover && !b.is_cover) return -1;
                if (!a.is_cover && b.is_cover) return 1;
                return (a.sort_order ?? 0) - (b.sort_order ?? 0);
              });
              const coverImage = gallery.find(item => item.is_cover) ?? gallery[0] ?? null;

              return (
                <motion.article
                  key={project.id ?? project.name}
                  className={styles.rhythmCard}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ ...sectionTransition, delay: index * 0.08 }}
                >
                  {coverImage ? (
                    <img
                      src={coverImage.file_url}
                      alt={coverImage.file_name || project.name}
                      style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '18px', marginBottom: '1rem' }}
                    />
                  ) : null}
                  <p>{formatDate(project.day, project.month, project.year) || project.year}</p>
                  {project.id ? (
                    <Link href={`/projects/${project.id}`} className={styles.inlineLink}>
                      <h3>{project.name}</h3>
                    </Link>
                  ) : (
                    <h3>{project.name}</h3>
                  )}
                  {project.event_location ? <p>{project.event_location}</p> : null}
                  <p>{project.impact}</p>
                </motion.article>
              );
            })}
        </div>
      </section>

      <section id="contact" className={styles.closingSection}>
        <p className={styles.kicker}>Main landing, many trajectories</p>
        <h2>Mulai dari satu brief, lalu biarkan tiap unit Kygoo bekerja sinkron.</h2>
        <p>
          Kami bantu merancang kombinasi layanan paling relevan untuk brand, campaign, atau event Anda.
          Tidak perlu pilih sendiri dari nol.
        </p>
        <div className={styles.heroActions}>
          <Link href="/contact" className={styles.primaryCta}>
            Mulai konsultasi
          </Link>
          <Link href="/auth/login" className={styles.secondaryCta}>
            Masuk dashboard Admin
          </Link>
        </div>
      </section>

      <footer className={styles.footerSection}>
        <div className={styles.footerBlock}>
          <p className={styles.footerLabel}>Business Lines</p>
          <div className={styles.footerLinks}>
            {businessLines.map(line => (
              <Link key={line.slug} href={`/${line.slug}`}>
                {line.badge}
              </Link>
            ))}
          </div>
        </div>

        <div className={styles.footerBlock}>
          <p className={styles.footerLabel}>WhatsApp</p>
          <a
            href="https://wa.me/6285717531630"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.footerContact}
          >
            +62 857-1753-1630
          </a>
        </div>

        <div className={styles.footerBlock}>
          <p className={styles.footerLabel}>Email</p>
          <a href="mailto:info@kygoo.group" className={styles.footerContact}>
            info@kygoo.group
          </a>
        </div>

        <div className={styles.footerMeta}>
          <p>Kygoo Group © {currentYear}. All rights reserved.</p>
          <p>Jl. Gatot Subroto No. 21, Jakarta Selatan</p>
        </div>
      </footer>
    </main>
  );
}
