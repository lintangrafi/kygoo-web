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

export default function DigitalPage() {
  const [digitalProjects, setDigitalProjects] = useState<BusinessLineProject[]>(BUSINESS_LINE_MAP.digital.projects);

  useEffect(() => {
    let mounted = true;

    const hydrateProjects = async () => {
      const projects = await fetchProjectsByLine('digital');
      if (!mounted || projects.length === 0) return;
      setDigitalProjects(projects);
    };

    hydrateProjects();

    return () => {
      mounted = false;
    };
  }, []);

  const stats: BusinessLineStat[] = [
    { label: 'Projects', value: '150+' },
    { label: 'Clients', value: '80+' },
    { label: 'Tech Stack', value: '30+' },
  ];

  const services: BusinessLineService[] = [
    { icon: '💻', title: 'Web Development', desc: 'Modern, fast, responsive applications.' },
    { icon: '📱', title: 'Mobile Apps', desc: 'Native and cross-platform solutions.' },
    { icon: '🎨', title: 'UI/UX Design', desc: 'Beautiful and intuitive interfaces.' },
    { icon: '🔧', title: 'API Development', desc: 'Scalable backend systems.' },
    { icon: '📊', title: 'Data Solutions', desc: 'Analytics and insights platforms.' },
    { icon: '☁️', title: 'Cloud Services', desc: 'Deployment and infrastructure.' },
  ];

  return (
    <BusinessLinePageTemplate
      businessName="Digital"
      accent="#00d084"
      secondaryAccent="#00e5ff"
      heroKicker="Code • Innovate • Build"
      heroTitle="Transform your digital vision."
      heroLead="Web design, app development, and digital solutions that elevate your business. We write code that matters."
      ctaPrimaryLabel="Start Project"
      stats={stats}
      services={services}
      projects={digitalProjects}
      pricingTitle="Pricing Plans"
      pricingPackages={[
        {
          name: 'Startup',
          price: '5,000,000',
          features: ['Landing Page', 'Responsive Design', 'SEO Basics', '3 Months Support'],
        },
        {
          name: 'Growth',
          price: '15,000,000',
          features: ['Full Web App', 'Custom Design', 'Database Setup', 'API Integration', '6 Months Support'],
          highlight: true,
        },
        {
          name: 'Enterprise',
          price: 'Custom',
          features: ['Mobile + Web', 'Advanced Features', 'Dedicated Team', 'Ongoing Support'],
        },
      ]}
      closingTitle="Ready to build something amazing?"
      closingLead="Let's turn your idea into reality. Contact us for a free consultation."
    />
  );
}
