'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Camera } from 'lucide-react'
import { useTranslation } from '@/lib/i18n'

export default function StudioPage() {
  const params = useParams()
  const locale = params.locale as string
  const t = useTranslation(locale)

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href={`/${locale}`} className="flex items-center gap-2 text-slate-400 hover:text-white">
            <ArrowLeft className="w-4 h-4" />
            {t('common.back')}
          </Link>
          <h1 className="text-2xl font-bold text-white">{t('services.studio.name')}</h1>
          <div className="w-12" />
        </div>
      </div>

      {/* Hero */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-5xl font-bold text-white">
                Professional Photography & Videography
              </h2>
              <p className="text-lg text-slate-400">
                Our studio is equipped with state-of-the-art equipment and experienced professionals dedicated to capturing your most important moments.
              </p>
              <div className="space-y-2">
                <p className="text-slate-300"><span className="text-cyan-400">✓</span> 4K & 8K Videography</p>
                <p className="text-slate-300"><span className="text-cyan-400">✓</span> Professional Lighting Setup</p>
                <p className="text-slate-300"><span className="text-cyan-400">✓</span> Post-Production Editing</p>
                <p className="text-slate-300"><span className="text-cyan-400">✓</span> Drone Photography</p>
                <p className="text-slate-300"><span className="text-cyan-400">✓</span> Same-Day Editing</p>
              </div>
              <a href="https://wa.me/6281284917960" target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="bg-cyan-500 hover:bg-cyan-600">
                  💬 {t('common.contact')} via WhatsApp
                </Button>
              </a>
            </div>
            <div className="bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-lg h-96 flex items-center justify-center border border-slate-700">
              <Camera className="w-24 h-24 text-cyan-400/50" />
            </div>
          </div>
        </div>
      </section>

      {/* Packages */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-3xl font-bold text-white mb-12">Our Packages</h3>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: 'Basic', price: '5,000,000', duration: '4 hours' },
              { name: 'Premium', price: '10,000,000', duration: '8 hours' },
              { name: 'Exclusive', price: 'Custom', duration: 'Full day +' }
            ].map((pkg) => (
              <div key={pkg.name} className="bg-slate-800 border border-slate-700 rounded-lg p-8 hover:border-cyan-500/50 transition">
                <h4 className="text-2xl font-bold text-white mb-2">{pkg.name}</h4>
                <p className="text-slate-400 mb-4">{pkg.duration}</p>
                <p className="text-3xl font-bold text-cyan-400 mb-6">Rp {pkg.price}</p>
                <Button className="w-full bg-slate-700 hover:bg-slate-600 text-white">More Info</Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Preview */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-3xl font-bold text-white mb-12">Recent Works</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-slate-800 rounded-lg h-64 flex items-center justify-center border border-slate-700">
                <p className="text-slate-400">Portfolio Image {i}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
