import Link from 'next/link'
import { Gamepad2, UtensilsCrossed, Sparkles, BookOpen, Dumbbell, LayoutGrid } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Product } from '@/config/products.config'

const categoryConfig: Record<
  Product['category'],
  { label: string; icon: React.ElementType; badge: string; border: string; iconBg: string }
> = {
  gaming: {
    label: 'Gaming',
    icon: Gamepad2,
    badge: 'bg-purple-500/15 text-purple-300 border-purple-500/25',
    border: 'hover:border-purple-500/40',
    iconBg: 'bg-purple-500/15 text-purple-400',
  },
  cooking: {
    label: 'Cocina',
    icon: UtensilsCrossed,
    badge: 'bg-orange-500/15 text-orange-300 border-orange-500/25',
    border: 'hover:border-orange-500/40',
    iconBg: 'bg-orange-500/15 text-orange-400',
  },
  esoteric: {
    label: 'Esotérico',
    icon: Sparkles,
    badge: 'bg-yellow-500/15 text-yellow-300 border-yellow-500/25',
    border: 'hover:border-yellow-500/40',
    iconBg: 'bg-yellow-500/15 text-yellow-400',
  },
  comics: {
    label: 'Comics',
    icon: BookOpen,
    badge: 'bg-blue-500/15 text-blue-300 border-blue-500/25',
    border: 'hover:border-blue-500/40',
    iconBg: 'bg-blue-500/15 text-blue-400',
  },
  fitness: {
    label: 'Fitness',
    icon: Dumbbell,
    badge: 'bg-green-500/15 text-green-300 border-green-500/25',
    border: 'hover:border-green-500/40',
    iconBg: 'bg-green-500/15 text-green-400',
  },
  other: {
    label: 'Otro',
    icon: LayoutGrid,
    badge: 'bg-zinc-500/15 text-zinc-300 border-zinc-500/25',
    border: 'hover:border-zinc-500/40',
    iconBg: 'bg-zinc-500/15 text-zinc-400',
  },
}

const statusConfig: Record<Product['status'], { label: string; dot: string; pulse: boolean }> = {
  live: { label: 'Live', dot: 'bg-emerald-400', pulse: true },
  wip: { label: 'En progreso', dot: 'bg-amber-400', pulse: false },
  'coming-soon': { label: 'Próximamente', dot: 'bg-zinc-500', pulse: false },
}

export default function ProductCard({ product }: { product: Product }) {
  const cat = categoryConfig[product.category]
  const status = statusConfig[product.status]
  const Icon = cat.icon

  return (
    <Card
      className={cn(
        'group flex flex-col gap-0 border-border/50 bg-card transition-all duration-200',
        'hover:bg-card/80 hover:shadow-xl hover:shadow-black/30 hover:-translate-y-0.5',
        cat.border
      )}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className={cn('p-2 rounded-lg', cat.iconBg)}>
            <Icon className="w-4 h-4" />
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
