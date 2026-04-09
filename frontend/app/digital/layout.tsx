import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Kygoo Digital',
}

export default function DigitalLayout({ children }: { children: React.ReactNode }) {
  return children
}
