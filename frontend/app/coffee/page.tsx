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

export default function CoffeePage() {
  const [coffeeProjects, setCoffeeProjects] = useState<BusinessLineProject[]>(BUSINESS_LINE_MAP.coffee.projects);
  const [pricingPackages, setPricingPackages] = useState<BusinessLinePricingCard[]>(getDefaultBusinessLinePricing('coffee'));

  useEffect(() => {
    let mounted = true;

    const hydrateProjects = async () => {
      const projects = await fetchProjectsByLine('coffee');
      if (!mounted || projects.length === 0) return;
      setCoffeeProjects(projects);
    };

    hydrateProjects();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;

    const hydratePricing = async () => {
      const response = await businessLinePricingService.listPackages('coffee');
      if (!mounted || response.error || !response.data || response.data.length === 0) return;
      setPricingPackages(sortPricingCards(mapPricingApiItemsToCards(response.data)));
    };

    hydratePricing();

    return () => {
      mounted = false;
    };
  }, []);

  const stats: BusinessLineStat[] = [
    { label: 'Events', value: '50+' },
    { label: 'Menus', value: '12+' },
    { label: 'Cities', value: '4+' },
  ];

  const services: BusinessLineService[] = [
    { icon: '☕', title: 'Mobile Coffee Bar', desc: 'Setup fleksibel untuk indoor maupun outdoor event.' },
    { icon: '👨‍🍳', title: 'Barista Team', desc: 'Crew yang rapi, cepat, dan konsisten di service flow.' },
    { icon: '🧋', title: 'Custom Menu', desc: 'Menu signature, seasonal drinks, dan opsi brandable.' },
    { icon: '🎪', title: 'Event Activation', desc: 'Cocok untuk booth experience, launch, dan hospitality.' },
    { icon: '🧾', title: 'Menu Planning', desc: 'Rancangan menu berdasarkan target tamu dan venue.' },
    { icon: '🚚', title: 'On-site Logistics', desc: 'Pengantaran, setup, dan teardown terkoordinasi.' },
  ];

  return (
    <BusinessLinePageTemplate
      businessName="Coffee"
      accent="#d97706"
      secondaryAccent="#fbbf24"
      heroKicker="Coffee Experience for Events and Hospitality"
      heroTitle="Coffee service yang menghidupkan suasana event."
      heroLead="Mobile coffee bar untuk corporate event, private gathering, brand activation, dan hospitality experience yang butuh service flow cepat dengan tampilan yang rapi."
      ctaPrimaryLabel="Book Coffee Bar"
      stats={stats}
      services={services}
      projects={coffeeProjects}
      pricingTitle="Pricing Plans"
      pricingPackages={pricingPackages}
      closingTitle="Ready to serve a better event experience?"
      closingLead="Konsultasikan jumlah tamu, venue, dan menu yang Anda butuhkan. Kami akan bantu susun paket yang pas."
    />
  );
}
