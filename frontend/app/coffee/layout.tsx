import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Kygoo Coffee',
}

export default function CoffeeLayout({ children }: { children: React.ReactNode }) {
  return children
}
