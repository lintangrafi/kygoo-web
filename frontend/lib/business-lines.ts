export type BusinessProject = {
  id?: string;
  sort_order?: number;
  name: string;
  event_location?: string;
  day?: number;
  month?: number;
  year: string;
  impact: string;
  created_at?: string;
  gallery?: Array<{
    id: string;
    file_url: string;
    file_name: string;
    is_cover?: boolean;
    sort_order?: number;
  }>;
};

export type BusinessLine = {
  slug: 'studio' | 'photobooth' | 'digital' | 'coffee';
  badge: string;
  title: string;
  description: string;
  accent: string;
  details: string[];
  projects: BusinessProject[];
};

export const BUSINESS_LINES: BusinessLine[] = [
  {
    slug: 'studio',
    badge: 'Kygoo Studio',
    title: 'Frame moments with cinematic precision.',
    description:
      'Fotografi dan videografi premium untuk wedding, corporate, dan campaign dengan arah visual yang kuat.',
    accent: 'oklch(0.74 0.15 78)',
    details: [
      'Creative direction dan shot planning',
      'Coverage multi-kamera untuk acara skala besar',
      'Editing color profile sesuai karakter brand',
    ],
    projects: [
      {
        name: 'Nusa Inti Wedding Film',
        year: '2025',
        impact: 'Dokumentasi full-day dengan 2.1M organic views lintas platform.',
      },
      {
        name: 'Rivana Corporate Summit',
        year: '2024',
        impact: 'Produksi foto-video keynote dan publikasi internal untuk 1.300 peserta.',
      },
      {
        name: 'Asteria Product Launch Reel',
        year: '2025',
        impact: 'Hero campaign visual untuk peluncuran produk beauty tier nasional.',
      },
      {
        name: 'Pijar School Graduation',
        year: '2024',
        impact: 'Paket dokumentasi multi-venue dengan delivery galeri 48 jam.',
      },
    ],
  },
  {
    slug: 'photobooth',
    badge: 'Kygoo Photobooth',
    title: 'Turn crowded events into shared memories.',
    description:
      'Pengalaman photobooth interaktif dengan output digital, print instan, dan aktivasi sosial yang cepat.',
    accent: 'oklch(0.69 0.24 355)',
    details: [
      'Booth modular untuk indoor dan outdoor',
      'Template frame custom sesuai identitas event',
      'Integrasi galeri online realtime',
    ],
    projects: [
      {
        name: 'Brixton Year-End Party Booth',
        year: '2025',
        impact: '3.800 foto tercetak dan 6.400 file digital dalam satu malam event.',
      },
      {
        name: 'Urban Pop Festival Activation',
        year: '2024',
        impact: 'Antrian rata-rata turun 27% lewat alur scan-to-print yang dioptimasi.',
      },
      {
        name: 'Pik Avenue Mall Weekend Pop-up',
        year: '2025',
        impact: 'Meningkatkan dwell time area tenant selama 2 akhir pekan promosi.',
      },
      {
        name: 'Nexa HR Appreciation Day',
        year: '2024',
        impact: 'Template frame personalisasi divisi untuk engagement karyawan.',
      },
    ],
  },
  {
    slug: 'digital',
    badge: 'Kygoo Digital',
    title: 'Build digital products that convert.',
    description:
      'Web, aplikasi, konten, dan growth asset untuk membawa brand dari awareness ke transaksi.',
    accent: 'oklch(0.77 0.17 160)',
    details: [
      'Website dan aplikasi siap scale',
      'Campaign landing page berbasis performa',
      'Dashboard insight untuk keputusan cepat',
    ],
    projects: [
      {
        name: 'Kygoo Multi-line Landing Revamp',
        year: '2026',
        impact: 'Penyatuan funnel akuisisi untuk 4 unit bisnis dalam satu entry point.',
      },
      {
        name: 'Meraki Clinic Booking System',
        year: '2025',
        impact: 'Automasi booking menurunkan beban admin harian hingga 40%.',
      },
      {
        name: 'Fablo Retail Promo Engine',
        year: '2024',
        impact: 'Landing page campaign meningkatkan conversion promo seasonal.',
      },
      {
        name: 'Ruang Tumbuh Analytics Dashboard',
        year: '2025',
        impact: 'Monitoring performa campaign realtime untuk tim marketing internal.',
      },
    ],
  },
  {
    slug: 'coffee',
    badge: 'Kygoo Coffee',
    title: 'Design calm spaces with bold flavor.',
    description:
      'Kopi artisan, menu kurasi, dan layanan coffee experience untuk venue, kantor, hingga event premium.',
    accent: 'oklch(0.72 0.16 55)',
    details: [
      'Signature blend dan seasonal menu',
      'Pop-up coffee bar untuk event',
      'Hospitality flow yang hangat dan efisien',
    ],
    projects: [
      {
        name: 'Canvas Expo Coffee Bar',
        year: '2025',
        impact: 'Layanan pop-up untuk 4 hari expo dengan 5.200 cup tersaji.',
      },
      {
        name: 'Viora Office Brew Program',
        year: '2024',
        impact: 'Program weekly brew meningkatkan engagement area komunal kantor.',
      },
      {
        name: 'Rasa Kota Signature Menu Collab',
        year: '2025',
        impact: 'Kolaborasi menu seasonal untuk kampanye city-themed hospitality.',
      },
      {
        name: 'Nirmala Wedding Coffee Corner',
        year: '2024',
        impact: 'Integrasi coffee service premium di resepsi dengan service flow cepat.',
      },
    ],
  },
];

export const BUSINESS_LINE_MAP = BUSINESS_LINES.reduce<Record<BusinessLine['slug'], BusinessLine>>(
  (acc, line) => {
    acc[line.slug] = line;
    return acc;
  },
  {
    studio: BUSINESS_LINES[0],
    photobooth: BUSINESS_LINES[1],
    digital: BUSINESS_LINES[2],
    coffee: BUSINESS_LINES[3],
  }
);

export function mergeProjectsIntoLines(
  lines: BusinessLine[],
  projectMap: Partial<Record<BusinessLine['slug'], BusinessProject[]>>
): BusinessLine[] {
  return lines.map(line => ({
    ...line,
    projects:
      projectMap[line.slug] && projectMap[line.slug]!.length > 0
        ? [...projectMap[line.slug]!].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
        : line.projects,
  }));
}