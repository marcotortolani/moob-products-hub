'use client'

import Image from 'next/image'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { Sun, Moon, Monitor } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export default function Header() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const isDark = resolvedTheme === 'dark'

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <Image
            src="/moob-logo.svg"
            alt="Media Moob"
            width={72}
            height={22}
            className={cn('h-5 w-auto', !isDark && 'invert')}
            priority
          />
          <div className="h-4 w-px bg-border/70" aria-hidden />
          <span className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">
            Products HUB
          </span>
        </div>

        {/* Theme toggle */}
        {mounted && (
          <div className="flex items-center gap-1 p-1 rounded-lg bg-muted/60 border border-border/40">
            {[
              { value: 'light', icon: Sun, label: 'Claro' },
              { value: 'system', icon: Monitor, label: 'Sistema' },
              { value: 'dark', icon: Moon, label: 'Oscuro' },
            ].map(({ value, icon: Icon, label }) => (
              <button
                key={value}
                onClick={() => setTheme(value)}
                aria-label={label}
                title={label}
                className={cn(
                  'p-1.5 rounded-md transition-all duration-150 cursor-pointer',
                  theme === value
                    ? 'bg-background shadow-sm text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <Icon className="w-3.5 h-3.5" />
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  )
}
