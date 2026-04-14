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

export default function StudioPage() {
  const [studioProjects, setStudioProjects] = useState<BusinessLineProject[]>(BUSINESS_LINE_MAP.studio.projects);
  const [pricingPackages, setPricingPackages] = useState<BusinessLinePricingCard[]>(getDefaultBusinessLinePricing('studio'));

  useEffect(() => {
    let mounted = true;

    const hydrateProjects = async () => {
      const projects = await fetchProjectsByLine('studio');
      if (!mounted || projects.length === 0) return;
      setStudioProjects(projects);
    };

    hydrateProjects();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;

    const hydratePricing = async () => {
      const response = await businessLinePricingService.listPackages('studio');
      if (!mounted || response.error || !response.data || response.data.length === 0) return;
      setPricingPackages(sortPricingCards(mapPricingApiItemsToCards(response.data)));
    };

    hydratePricing();

    return () => {
      mounted = false;
    };
  }, []);

  const stats: BusinessLineStat[] = [
    { label: 'Sessions', value: '120+' },
    { label: 'Clients', value: '80+' },
    { label: 'Albums', value: '300+' },
  ];

  const services: BusinessLineService[] = [
    { icon: '💒', title: 'Wedding Photography', desc: 'Comprehensive wedding coverage from preparation to celebration.' },
    { icon: '🏢', title: 'Corporate Events', desc: 'Professional coverage of conferences, launches, and corporate functions.' },
    { icon: '🎭', title: 'Portrait Sessions', desc: 'Studio and outdoor portraits that capture personality.' },
    { icon: '🎬', title: 'Videography', desc: 'Professional cinematic videos for all occasions.' },
    { icon: '✨', title: 'Editing & Retouching', desc: 'Premium post-production services for stunning results.' },
    { icon: '📖', title: 'Album Design', desc: 'Beautiful printed albums and digital galleries.' },
  ];

  return (
    <BusinessLinePageTemplate
      businessName="Studio"
      accent="#d4af37"
      secondaryAccent="#f59e0b"
      heroKicker="Premium Photography Services"
      heroTitle="Capture your most precious moments."
      heroLead="Professional photography and videography for weddings, corporate events, and special occasions. We create timeless memories with artistic excellence and technical mastery."
      ctaPrimaryLabel="Book Session"
      stats={stats}
      services={services}
      projects={studioProjects}
      pricingTitle="Studio Pricelist"
      pricingPackages={pricingPackages}
      closingTitle="Siap pilih backdrop studio?"
      closingLead="Pilih tema yang paling sesuai, lalu lanjutkan booking untuk sesi foto yang Anda inginkan."
    />
  );
}
