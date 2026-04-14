'use client';

import { useEffect, useState } from 'react';
import { BUSINESS_LINE_MAP } from '@/lib/business-lines';
import { fetchProjectsByLine } from '@/lib/business-projects-client';
import { getDefaultBusinessLinePricing, mapPricingApiItemsToCards, sortPricingCards, type BusinessLinePricingCard } from '@/lib/business-line-pricing';
import { businessLinePricingService } from '@/src/services';
import {
  BusinessLinePageTemplate,
  type BusinessLineProject,
  type BusinessLineService,
  type BusinessLineStat,
} from '@/src/components/BusinessLinePageTemplate';

export default function PhotoboothPage() {
  const [photoboothProjects, setPhotoboothProjects] = useState<BusinessLineProject[]>(BUSINESS_LINE_MAP.photobooth.projects);
  const [pricingPackages, setPricingPackages] = useState<BusinessLinePricingCard[]>(getDefaultBusinessLinePricing('photobooth'));

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

  useEffect(() => {
    let mounted = true;

    const hydratePricing = async () => {
      const response = await businessLinePricingService.listPackages('photobooth');
      if (!mounted || response.error || !response.data || response.data.length === 0) return;
      setPricingPackages(sortPricingCards(mapPricingApiItemsToCards(response.data)));
    };

    hydratePricing();

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
      pricingPackages={pricingPackages}
      closingTitle="Ready to make your event feel more alive?"
      closingLead="Ceritakan jumlah tamu, tema acara, dan kebutuhan output. Kami siapkan setup photobooth yang pas."
    />
  );
}
