import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'kygoo photobooth',
}

export default function PhotoboothLayout({ children }: { children: React.ReactNode }) {
  return children
}
