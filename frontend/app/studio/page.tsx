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

export default function StudioPage() {
  const [studioProjects, setStudioProjects] = useState<BusinessLineProject[]>(BUSINESS_LINE_MAP.studio.projects);

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
      pricingPackages={[
        {
          name: 'Snow White',
          price: '50K / 10 menit',
          features: ['75K / 15 menit', 'Clean white setup', 'Soft bright portrait look'],
        },
        {
          name: 'Nassau Blue',
          price: '50K / 10 menit',
          features: ['75K / 15 menit', 'Blue backdrop style', 'Portrait-ready studio look'],
          highlight: true,
        },
        {
          name: 'Grey Curtain',
          price: '35K / 5 menit',
          features: ['50K / 10 menit', 'Curtain-style background', 'Minimal and clean mood'],
        },
        {
          name: 'Livingroom',
          price: '50K / 10 menit',
          features: ['75K / 15 menit', 'Cozy indoor living room feel', 'Soft lifestyle look'],
        },
        {
          name: 'Spotlight Box',
          price: '50K / 10 menit',
          features: ['75K / 15 menit', 'Single subject spotlight', 'Strong studio contrast'],
        },
        {
          name: 'Elevator Vintage',
          price: '35K / 1 sesi',
          features: ['50K / 2 sesi', 'Vintage lift-inspired set', 'Retro editorial aesthetic'],
        },
        {
          name: 'Window Background',
          price: '50K / 10 menit',
          features: ['75K / 15 menit', 'Window-frame backdrop', 'Soft natural portrait style'],
        },
        {
          name: 'Beige',
          price: '50K / 10 menit',
          features: ['75K / 15 menit', 'Warm beige tone', 'Neutral and elegant result'],
        },
        {
          name: 'Vintage Box',
          price: '50K / 10 menit',
          features: ['75K / 15 menit', 'Old-school box interior', 'Classic nostalgic composition'],
        },
        {
          name: 'Industrial Wall',
          price: '50K / 10 menit',
          features: ['75K / 15 menit', 'Concrete industrial texture', 'Bold urban portrait look'],
        },
      ]}
      closingTitle="Siap pilih backdrop studio?"
      closingLead="Pilih tema yang paling sesuai, lalu lanjutkan booking untuk sesi foto yang Anda inginkan."
    />
  );
}
