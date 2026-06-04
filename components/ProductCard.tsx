'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Gamepad2, UtensilsCrossed, Sparkles, BookOpen, Dumbbell, Plane, Heart, LayoutGrid } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Product } from '@/config/products.config'

const categoryConfig: Record<
  Product['category'],
  {
    label: string
    icon: React.ElementType
    badge: string
    border: string
    iconBg: string
    animation: string
  }
> = {
  gaming: {
    label: 'Gaming',
    icon: Gamepad2,
    badge: 'bg-purple-500/10 text-purple-700 border-purple-400/30 dark:text-purple-300 dark:border-purple-500/25',
    border: 'hover:border-purple-400/50 dark:hover:border-purple-500/40',
    iconBg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
    animation: 'icon-wiggle 0.65s ease-in-out infinite',
  },
  cooking: {
    label: 'Cocina',
    icon: UtensilsCrossed,
    badge: 'bg-orange-500/10 text-orange-700 border-orange-400/30 dark:text-orange-300 dark:border-orange-500/25',
    border: 'hover:border-orange-400/50 dark:hover:border-orange-500/40',
    iconBg: 'bg-orange-500/10 text-orange-600 dark:text-orange-400',
    animation: 'icon-bounce-fun 0.70s ease-in-out infinite',
  },
  esoteric: {
    label: 'Esotérico',
    icon: Sparkles,
    badge: 'bg-yellow-500/10 text-yellow-700 border-yellow-400/30 dark:text-yellow-300 dark:border-yellow-500/25',
    border: 'hover:border-yellow-400/50 dark:hover:border-yellow-500/40',
    iconBg: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400',
    animation: 'icon-spin-slow 1.40s linear infinite',
  },
  comics: {
    label: 'Comics',
    icon: BookOpen,
    badge: 'bg-blue-500/10 text-blue-700 border-blue-400/30 dark:text-blue-300 dark:border-blue-500/25',
    border: 'hover:border-blue-400/50 dark:hover:border-blue-500/40',
    iconBg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
    animation: 'icon-tada 0.75s ease-in-out infinite',
  },
  fitness: {
    label: 'Fitness',
    icon: Dumbbell,
    badge: 'bg-green-500/10 text-green-700 border-green-400/30 dark:text-green-300 dark:border-green-500/25',
    border: 'hover:border-green-400/50 dark:hover:border-green-500/40',
    iconBg: 'bg-green-500/10 text-green-600 dark:text-green-400',
    animation: 'icon-pump 0.55s ease-in-out infinite',
  },
  viajes: {
    label: 'Viajes',
    icon: Plane,
    badge: 'bg-sky-500/10 text-sky-700 border-sky-400/30 dark:text-sky-300 dark:border-sky-500/25',
    border: 'hover:border-sky-400/50 dark:hover:border-sky-500/40',
    iconBg: 'bg-sky-500/10 text-sky-600 dark:text-sky-400',
    animation: 'icon-bounce-fun 0.70s ease-in-out infinite',
  },
  mujer: {
    label: 'Mujer',
    icon: Heart,
    badge: 'bg-pink-500/10 text-pink-700 border-pink-400/30 dark:text-pink-300 dark:border-pink-500/25',
    border: 'hover:border-pink-400/50 dark:hover:border-pink-500/40',
    iconBg: 'bg-pink-500/10 text-pink-600 dark:text-pink-400',
    animation: 'icon-pump 0.55s ease-in-out infinite',
  },
  other: {
    label: 'Otro',
    icon: LayoutGrid,
    badge: 'bg-zinc-500/10 text-zinc-600 border-zinc-400/30 dark:text-zinc-300 dark:border-zinc-500/25',
    border: 'hover:border-zinc-400/50 dark:hover:border-zinc-500/40',
    iconBg: 'bg-zinc-500/10 text-zinc-500 dark:text-zinc-400',
    animation: 'icon-spin-once 0.50s cubic-bezier(0.4, 0, 0.2, 1)',
  },
}

const statusConfig: Record<Product['status'], { label: string; dot: string; pulse: boolean }> = {
  live: { label: 'Live', dot: 'bg-emerald-500', pulse: true },
  wip: { label: 'En progreso', dot: 'bg-amber-400', pulse: false },
  'coming-soon': { label: 'Próximamente', dot: 'bg-zinc-400', pulse: false },
}

export default function ProductCard({ product }: { product: Product }) {
  const [hovered, setHovered] = useState(false)
  const cat = categoryConfig[product.category]
  const status = statusConfig[product.status]
  const Icon = cat.icon

  return (
    <Card
      className={cn(
        'flex flex-col gap-0 bg-card border-border/60',
        'transition-all duration-200 cursor-default',
        'shadow-sm hover:shadow-lg dark:hover:shadow-black/40',
        'hover:-translate-y-0.5',
        cat.border
      )}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className={cn('p-2 rounded-lg', cat.iconBg)}>
            <Icon
              className="w-4 h-4"
              style={{ animation: hovered ? cat.animation : 'none' }}
            />
          </div>
          <Badge variant="outline" className={cn('text-[11px] font-medium shrink-0', cat.badge)}>
            {cat.label}
          </Badge>
        </div>

        <div className="mt-3">
          <h2 className="font-semibold text-[15px] leading-snug text-foreground">
            {product.name}
          </h2>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-4 pt-0 flex-1">
        <p className="text-sm text-muted-foreground leading-relaxed flex-1">
          {product.description}
        </p>

        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            {status.pulse && (
              <span className={cn('animate-ping absolute inline-flex h-full w-full rounded-full opacity-60', status.dot)} />
            )}
            <span className={cn('relative inline-flex rounded-full h-2 w-2', status.dot)} />
          </span>
          <span className="text-xs text-muted-foreground">{status.label}</span>
        </div>

        <div className="flex gap-2 flex-wrap pt-1 border-t border-border/40">
          {product.variants.map((variant) => (
            <Link
              key={variant.lang}
              href={variant.path}
              className={cn(
                buttonVariants({ variant: 'secondary', size: 'sm' }),
                'text-xs h-7 cursor-pointer'
              )}
            >
              {variant.label}
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
