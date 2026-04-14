'use client'

import { useEffect, useState } from 'react'
import { Menu } from 'lucide-react'
import { Button } from '@/src/presentation/components/ui/button'
import { ThemeToggle } from '@/src/presentation/components/theme-toggle'
import { siteBrandingService, type SiteBranding } from '@/src/services'

interface NavbarProps {
    onMenuToggle: () => void
}

export function Navbar({ onMenuToggle }: NavbarProps) {
    const [branding, setBranding] = useState<SiteBranding | null>(null)

    useEffect(() => {
        let mounted = true

        const loadBranding = async () => {
            const response = await siteBrandingService.getCurrent()
            if (!mounted || response.error || !response.data) {
                return
            }
            setBranding(response.data)
        }

        loadBranding()

        return () => {
            mounted = false
        }
    }, [])

    return (
        <nav className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
            <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
                {/* Menu toggle for mobile/tablet */}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onMenuToggle}
                    className="lg:hidden"
                    aria-label="Toggle sidebar"
                >
                    <Menu className="h-5 w-5" />
                </Button>

                {/* Logo (visible on mobile when sidebar is hidden) */}
                <div className="flex items-center space-x-2 lg:hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={branding?.main_logo_url || '/logo_icon.png'}
                        alt={branding?.main_logo_alt || 'Kygoo Group'}
                        className="h-8 w-8 rounded-lg object-contain dark:invert"
                    />
                    <span className="text-xl font-bold">{branding?.site_name || 'Kygoo Group'}</span>
                </div>

                {/* Spacer for desktop */}
                <div className="hidden lg:block flex-1" />

                {/* Right side actions */}
                <div className="flex items-center gap-2">
                    <ThemeToggle />
                </div>
            </div>
        </nav>
    )
}
