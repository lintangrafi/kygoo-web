import { notFound } from 'next/navigation'

interface LayoutProps {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export default async function RootLayout({ children, params }: LayoutProps) {
  const { locale } = await params
  const validLocales = ['en', 'id']
  if (!validLocales.includes(locale)) {
    notFound()
  }

  return (
    <html lang={locale}>
      <body>{children}</body>
    </html>
  )
}

export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'id' }]
}
