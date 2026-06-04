'use client'

import { useState, useMemo } from 'react'
import { Search, SlidersHorizontal } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import ProductCard from '@/components/ProductCard'
import { Product } from '@/config/products.config'

type Category = Product['category'] | 'all'
type Status = Product['status'] | 'all'
type SortKey = 'name-asc' | 'name-desc' | 'status'

const CATEGORIES: { value: Category; label: string }[] = [
  { value: 'all', label: 'Todos' },
  { value: 'gaming', label: 'Gaming' },
  { value: 'cooking', label: 'Cocina' },
  { value: 'esoteric', label: 'Esotérico' },
  { value: 'comics', label: 'Comics' },
  { value: 'fitness', label: 'Fitness' },
  { value: 'other', label: 'Otro' },
]

const STATUS_OPTIONS: { value: Status; label: string }[] = [
  { value: 'all', label: 'Todos los estados' },
  { value: 'live', label: 'Live' },
  { value: 'wip', label: 'En progreso' },
  { value: 'coming-soon', label: 'Próximamente' },
]

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'name-asc', label: 'Nombre A→Z' },
  { value: 'name-desc', label: 'Nombre Z→A' },
  { value: 'status', label: 'Por estado' },
]

const STATUS_ORDER: Record<Product['status'], number> = { live: 0, wip: 1, 'coming-soon': 2 }

interface Props {
  products: Product[]
}

export default function CatalogView({ products }: Props) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<Category>('all')
  const [status, setStatus] = useState<Status>('all')
  const [sort, setSort] = useState<SortKey>('name-asc')
  const [showFilters, setShowFilters] = useState(false)

  const filtered = useMemo(() => {
    let result = products.filter((p) => {
      const matchQuery =
        query.trim() === '' ||
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.description.toLowerCase().includes(query.toLowerCase())
      const matchCategory = category === 'all' || p.category === category
      const matchStatus = status === 'all' || p.status === status
      return matchQuery && matchCategory && matchStatus
    })

    if (sort === 'name-asc') result = [...result].sort((a, b) => a.name.localeCompare(b.name))
    if (sort === 'name-desc') result = [...result].sort((a, b) => b.name.localeCompare(a.name))
    if (sort === 'status') result = [...result].sort((a, b) => STATUS_ORDER[a.status] - STATUS_ORDER[b.status])

    return result
  }, [products, query, category, status, sort])

  const hasActiveFilters = category !== 'all' || status !== 'all' || query.trim() !== ''

  function clearFilters() {
    setQuery('')
    setCategory('all')
    setStatus('all')
    setSort('name-asc')
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Search + filter toggle row */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <Input
            type="search"
            placeholder="Buscar portal..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9 bg-secondary/50 border-border/50 focus:border-primary/50 h-9"
          />
        </div>
        <Button
          variant={showFilters ? 'default' : 'outline'}
          size="sm"
          onClick={() => setShowFilters((v) => !v)}
          className={cn('h-9 gap-2 cursor-pointer shrink-0', showFilters && 'ring-1 ring-primary/40')}
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span className="hidden sm:inline">Filtros</span>
          {hasActiveFilters && (
            <span className="w-2 h-2 rounded-full bg-primary" />
          )}
        </Button>
      </div>

      {/* Expanded filters */}
      {showFilters && (
        <div className="flex flex-col gap-4 p-4 rounded-xl border border-border/50 bg-card/50">
          {/* Category chips */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Categoría</span>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setCategory(cat.value)}
                  className={cn(
                    'px-3 py-1 text-xs rounded-full border transition-colors duration-150 cursor-pointer',
                    category === cat.value
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-secondary/50 text-muted-foreground border-border/50 hover:border-primary/40 hover:text-foreground'
                  )}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Status + Sort row */}
          <div className="flex flex-wrap gap-4">
            <div className="flex flex-col gap-2 min-w-[160px]">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Estado</span>
              <div className="flex flex-wrap gap-2">
                {STATUS_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setStatus(opt.value)}
                    className={cn(
                      'px-3 py-1 text-xs rounded-full border transition-colors duration-150 cursor-pointer',
                      status === opt.value
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-secondary/50 text-muted-foreground border-border/50 hover:border-primary/40 hover:text-foreground'
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Ordenar</span>
              <div className="flex flex-wrap gap-2">
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setSort(opt.value)}
                    className={cn(
                      'px-3 py-1 text-xs rounded-full border transition-colors duration-150 cursor-pointer',
                      sort === opt.value
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-secondary/50 text-muted-foreground border-border/50 hover:border-primary/40 hover:text-foreground'
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Results meta */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          {filtered.length === products.length
            ? `${products.length} portales`
            : `${filtered.length} de ${products.length} portales`}
        </span>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-2 cursor-pointer transition-colors"
          >
            Limpiar filtros
          </button>
        )}
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 gap-3 text-center">
          <Search className="w-8 h-8 text-muted-foreground/40" />
          <p className="text-muted-foreground text-sm">
            Ningún portal coincide con tu búsqueda.
          </p>
          <button
            onClick={clearFilters}
            className="text-xs text-primary hover:underline cursor-pointer"
          >
            Limpiar filtros
          </button>
        </div>
      )}
    </div>
  )
}
