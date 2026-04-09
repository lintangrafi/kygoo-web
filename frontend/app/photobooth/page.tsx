'use client';

import { useEffect, useState } from 'react';
import { BUSINESS_LINE_MAP } from '@/lib/business-lines';
import { fetchProjectsByLine } from '@/lib/business-projects-client';
import {
  BusinessLinePageTemplate,
  type BusinessLineProject,
  type BusinessLineService,
  type BusinessLineStat,
} from '@/src/components/BusinessLinePageTemplate';

export default function PhotoboothPage() {
  const [photoboothProjects, setPhotoboothProjects] = useState<BusinessLineProject[]>(BUSINESS_LINE_MAP.photobooth.projects);

  useEffect(() => {
    let mounted = true;

    const hydrateProjects = async () => {
      const projects = await fetchProjectsByLine('photobooth');
      if (!mounted || projects.length === 0) return;
      setPhotoboothProjects(projects);
    };

    hydrateProjects();

    return () => {
      mounted = false;
    };
  }, []);

  const stats: BusinessLineStat[] = [
    { label: 'Events', value: '60+' },
    { label: 'Frames', value: '25+' },
    { label: 'Cities', value: '5+' },
  ];

  const services: BusinessLineService[] = [
    { icon: '📸', title: 'Interactive Booth', desc: 'Booth experience dengan layar dan flow yang cepat.' },
    { icon: '🪞', title: 'Custom Frame', desc: 'Template frame yang disesuaikan dengan tema acara.' },
    { icon: '🖨️', title: 'Instant Print', desc: 'Cetak hasil langsung untuk tamu yang ingin pulang bawa momen.' },
    { icon: '📲', title: 'Digital Share', desc: 'Output digital untuk sharing ke audience secara cepat.' },
    { icon: '🎨', title: 'Brand Activation', desc: 'Cocok untuk campaign experience dan social engagement.' },
    { icon: '🛠️', title: 'On-site Operation', desc: 'Crew, setup, dan teardown terkoordinasi.' },
  ];

  return (
    <BusinessLinePageTemplate
      businessName="Photobooth"
      accent="#ff006e"
      secondaryAccent="#f472b6"
      heroKicker="Interactive Photobooth for Events and Brands"
      heroTitle="Photobooth experience yang membuat tamu ikut jadi bagian dari momen."
      heroLead="Setup photobooth yang interaktif untuk wedding, corporate event, product launch, dan brand activation. Kami handle flow on-site dari setup sampai sharing hasil ke tamu."
      ctaPrimaryLabel="Book Photobooth"
      stats={stats}
      services={services}
      projects={photoboothProjects}
      pricingTitle="Photobooth Pricelist"
      pricingPackages={[
        {
          name: 'Classic Photobooth',
          price: 'Mulai 1.800K',
          features: [
            '2 jam unlimited: 1.800K',
            '3 jam unlimited: 2.200K',
            '4 jam unlimited: 2.600K',
            'Spec: iPad Air 6 preview, Canon DSLR, Fuji Ask-400, Godox SK-400 II V',
            'Include: unlimited photo print + GIF, 2-3 crew, backdrop, accessories',
            'Add-on: extend 400K/jam, 30 menit 250K, wishbook 200K, custom pouch 250K/100 pcs',
          ],
        },
        {
          name: 'Full Body Photobooth',
          price: 'Mulai 2.350K',
          features: [
            '2 jam unlimited: 2.350K',
            '3 jam unlimited: 3.000K',
            '4 jam unlimited: 3.650K',
            'Spec: 24 inch touch screen, Canon mirrorless, Fuji Ask-400, Godox SK-400 II V',
            'Include: unlimited photo print + GIF, 2-3 crew, backdrop, accessories',
            'Add-on: extend 650K/jam, 30 menit 250K, wishbook 250K, custom pouch 250K/100 pcs',
          ],
          highlight: true,
        },
        {
          name: 'iPad Booth',
          price: 'Mulai 1.500K',
          features: [
            '2 jam unlimited: 1.500K',
            '3 jam unlimited: 1.850K',
            '4 jam unlimited: 2.200K',
            'Spec: iPad Booth 11 inch, Fuji Ask-400, standing box, continuous light',
            'Include: unlimited photo print + GIF, 2-3 crew, backdrop, accessories',
            'Add-on: extend 650K/jam, 30 menit 250K, wishbook 250K, custom pouch 250K/100 pcs',
          ],
        },
        {
          name: 'Mingle Photo Booth',
          price: 'Mulai 2.250K',
          features: [
            '2 jam unlimited: 2.250K',
            '3 jam unlimited: 2.750K',
            '4 jam unlimited: 3.250K',
            'Spec: fotografer profesional, Canon mirrorless, Fuji Ask-400, Godox TT-600',
            'Include: unlimited photo print + GIF, 2-3 crew, custom design by request',
            'Add-on: extend 650K/jam, 30 menit 300K, wishbook 250K, custom pouch 250K/100 pcs',
          ],
        },
        {
          name: 'High Angle Photobooth',
          price: 'Mulai 3.000K',
          features: [
            'Pricelist day: 1 hari (10 jam) 12.000K, 3 hari 30.000K, 1 minggu 50.000K',
            'Pricelist hour: 2 jam 3.000K, 3 jam 3.800K, 4 jam 4.600K',
            'Spec: Canon mirrorless, Fuji Ask-400, iPad Air 6 live view, high angle setup',
            'Include: staff 2 person, branding box, custom frame, unlimited paper print',
            'Add-on: extend 800K/jam, wishbook 250K/100 pcs, custom pouch 200K',
          ],
        },
        {
          name: 'Videobooth Pricelist',
          price: 'Mulai 2.000K',
          features: [
            '3 jam unlimited: 2.000K',
            '4 jam unlimited: 2.400K',
            '5 jam unlimited: 2.800K',
            'Spec: spin 360 max 7-8 orang, iPhone 14 video, standing light',
            'Include: free custom design, max 2x revisi, free request music',
            'Add-on: extend 450K/jam, 30 menit 250K',
          ],
        },
        {
          name: 'Wedding Content Creator',
          price: '799K',
          features: [
            '8 hours standby',
            'Up to 10-15 Instagram Story',
            'Up to 5 Story + Reels Instagram (edited)',
            '2 video trend TikTok (free request)',
            'Device iPhone 15 + raw file via Google Drive max 24 jam after event',
          ],
        },
      ]}
      closingTitle="Ready to make your event feel more alive?"
      closingLead="Ceritakan jumlah tamu, tema acara, dan kebutuhan output. Kami siapkan setup photobooth yang pas."
    />
  );
}
