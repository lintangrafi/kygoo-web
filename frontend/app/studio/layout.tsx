import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Kygoo Studio',
}

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return children
}
