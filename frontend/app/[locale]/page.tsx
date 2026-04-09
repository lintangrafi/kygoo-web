'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Sparkles, Camera, Coffee, Code } from 'lucide-react'
import { useTranslation } from '@/lib/i18n'

export default function HomePage() {
  const params = useParams()
  const locale = params.locale as string
  const t = useTranslation(locale)

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-cyan-400" />
              <span className="text-xl font-bold text-white">Kygoo Group</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <Link href={`/${locale}/studio`} className="text-slate-400 hover:text-white transition">
                {t('nav.studio')}
              </Link>
              <Link href={`/${locale}/photobooth`} className="text-slate-400 hover:text-white transition">
                {t('nav.photobooth')}
              </Link>
              <Link href={`/${locale}/digital`} className="text-slate-400 hover:text-white transition">
                {t('nav.digital')}
              </Link>
              <Link href={`/${locale}/coffee`} className="text-slate-400 hover:text-white transition">
                {t('nav.coffee')}
              </Link>
            </div>
            <Link href={`/${locale}/admin`}>
              <Button variant="ghost" size="sm">
                Admin
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl sm:text-6xl font-bold text-white leading-tight">
                  {t('home.hero.title')}
                </h1>
                <p className="text-xl text-slate-400 leading-relaxed">
                  {t('home.hero.subtitle')}
                </p>
              </div>
              <div className="flex flex-wrap gap-4">
                <Link href={`/${locale}/photobooth`}>
                  <Button size="lg" className="bg-cyan-500 hover:bg-cyan-600">
                    {t('home.hero.cta1')}
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
                <Link href={`/${locale}/contact`}>
                  <Button size="lg" variant="outline" className="border-slate-600 text-white hover:bg-slate-800">
                    {t('home.hero.cta2')}
                  </Button>
                </Link>
              </div>
            </div>
            <div className="bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-lg h-96 flex items-center justify-center border border-slate-700">
              <div className="text-center">
                <Sparkles className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
                <p className="text-slate-400">Premium Creative Services</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">{t('home.services.title')}</h2>
            <p className="text-xl text-slate-400">{t('home.services.subtitle')}</p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {/* Studio */}
            <Link href={`/${locale}/studio`}>
              <div className="group bg-slate-800/50 hover:bg-slate-800 border border-slate-700 rounded-lg p-8 cursor-pointer transition-all hover:border-cyan-500/50">
                <Camera className="w-10 h-10 text-cyan-400 mb-4 group-hover:scale-110 transition" />
                <h3 className="text-xl font-semibold text-white mb-2">{t('services.studio.name')}</h3>
                <p className="text-slate-400 text-sm">{t('services.studio.description')}</p>
              </div>
            </Link>

            {/* Photobooth */}
            <Link href={`/${locale}/photobooth`}>
              <div className="group bg-slate-800/50 hover:bg-slate-800 border border-slate-700 rounded-lg p-8 cursor-pointer transition-all hover:border-purple-500/50">
                <Camera className="w-10 h-10 text-purple-400 mb-4 group-hover:scale-110 transition" />
                <h3 className="text-xl font-semibold text-white mb-2">{t('services.photobooth.name')}</h3>
                <p className="text-slate-400 text-sm">{t('services.photobooth.description')}</p>
              </div>
            </Link>

            {/* Digital */}
            <Link href={`/${locale}/digital`}>
              <div className="group bg-slate-800/50 hover:bg-slate-800 border border-slate-700 rounded-lg p-8 cursor-pointer transition-all hover:border-green-500/50">
                <Code className="w-10 h-10 text-green-400 mb-4 group-hover:scale-110 transition" />
                <h3 className="text-xl font-semibold text-white mb-2">{t('services.digital.name')}</h3>
                <p className="text-slate-400 text-sm">{t('services.digital.description')}</p>
              </div>
            </Link>

            {/* Coffee */}
            <Link href={`/${locale}/coffee`}>
              <div className="group bg-slate-800/50 hover:bg-slate-800 border border-slate-700 rounded-lg p-8 cursor-pointer transition-all hover:border-amber-500/50">
                <Coffee className="w-10 h-10 text-amber-400 mb-4 group-hover:scale-110 transition" />
                <h3 className="text-xl font-semibold text-white mb-2">{t('services.coffee.name')}</h3>
                <p className="text-slate-400 text-sm">{t('services.coffee.description')}</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-r from-cyan-600/20 to-purple-600/20 border border-slate-700 rounded-lg p-12 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">{t('home.cta.title')}</h2>
            <p className="text-lg text-slate-400 mb-8">{t('home.cta.description')}</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a href="https://wa.me/6285717531630" target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="bg-green-600 hover:bg-green-700">
                  💬 WhatsApp
                </Button>
              </a>
              <a href="https://instagram.com/kygoogroup" target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="bg-pink-600 hover:bg-pink-700">
                  📸 Instagram
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-12 px-4 sm:px-6 lg:px-8 bg-slate-950">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-semibold text-white mb-4">Kygoo Group</h4>
              <p className="text-slate-400 text-sm">Premium creative services for your events</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">{t('footer.services')}</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><Link href={`/${locale}/studio`}>{t('services.studio.name')}</Link></li>
                <li><Link href={`/${locale}/photobooth`}>{t('services.photobooth.name')}</Link></li>
                <li><Link href={`/${locale}/digital`}>{t('services.digital.name')}</Link></li>
                <li><Link href={`/${locale}/coffee`}>{t('services.coffee.name')}</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">{t('footer.company')}</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><Link href={`/${locale}/about`}>{t('nav.about')}</Link></li>
                <li><Link href={`/${locale}/portfolio`}>{t('nav.portfolio')}</Link></li>
                <li><Link href={`/${locale}/contact`}>{t('nav.contact')}</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">{t('footer.contact')}</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li>📧 info@kygoo.com</li>
                <li>📱 +62 812 345 678</li>
                <li>📍 Jakarta, Indonesia</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-slate-400 text-sm">
            <p>&copy; 2026 Kygoo Group. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
