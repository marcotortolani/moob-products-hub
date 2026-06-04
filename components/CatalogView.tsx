'use client'

import { useState, useMemo } from 'react'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
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
  { value: 'viajes', label: 'Viajes' },
  { value: 'mujer', label: 'Mujer' },
  { value: 'comics', label: 'Comics' },
  { value: 'fitness', label: 'Fitness' },
  { value: 'other', label: 'Otro' },
]

const STATUS_OPTIONS: { value: Status; label: string }[] = [
  { value: 'all', label: 'Todos' },
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

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'px-3 py-1 text-xs rounded-full border transition-colors duration-150 cursor-pointer',
        active
          ? 'bg-primary text-primary-foreground border-primary'
          : 'bg-secondary/50 text-muted-foreground border-border/50 hover:border-primary/40 hover:text-foreground'
      )}
    >
      {children}
    </button>
  )
}

function SidebarSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</span>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  )
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
    <div className="flex gap-8 items-start">

      {/* ── Sidebar (xl+) ── */}
      <aside className="hidden xl:flex flex-col gap-5 w-52 shrink-0 sticky top-6">
        <div className="flex flex-col gap-5 p-4 rounded-xl border border-border/50 bg-card/50">

          {/* Search */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Buscar</span>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
              <Input
                type="search"
                placeholder="Buscar portal..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-8 h-8 text-xs bg-secondary/50 border-border/50 focus:border-primary/50"
              />
            </div>
          </div>

          <div className="h-px bg-border/40" />

          {/* Category */}
          <SidebarSection label="Categoría">
            {CATEGORIES.map((cat) => (
              <FilterChip
                key={cat.value}
                active={category === cat.value}
                onClick={() => setCategory(cat.value)}
              >
                {cat.label}
              </FilterChip>
            ))}
          </SidebarSection>

          <div className="h-px bg-border/40" />

          {/* Status */}
          <SidebarSection label="Estado">
            {STATUS_OPTIONS.map((opt) => (
              <FilterChip
                key={opt.value}
                active={status === opt.value}
                onClick={() => setStatus(opt.value)}
              >
                {opt.label}
              </FilterChip>
            ))}
          </SidebarSection>

          <div className="h-px bg-border/40" />

          {/* Sort */}
          <SidebarSection label="Ordenar">
            {SORT_OPTIONS.map((opt) => (
              <FilterChip
                key={opt.value}
                active={sort === opt.value}
                onClick={() => setSort(opt.value)}
              >
                {opt.label}
              </FilterChip>
            ))}
          </SidebarSection>

          {/* Clear */}
          {hasActiveFilters && (
            <>
              <div className="h-px bg-border/40" />
              <button
                onClick={clearFilters}
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                <X className="w-3 h-3" />
                Limpiar filtros
              </button>
            </>
          )}
        </div>

        {/* Results count */}
        <span className="text-xs text-muted-foreground px-1">
          {filtered.length === products.length
            ? `${products.length} portales`
            : `${filtered.length} de ${products.length} portales`}
        </span>
      </aside>

      {/* ── Main content ── */}
      <div className="flex flex-col gap-6 flex-1 min-w-0">

        {/* Search + filter toggle — mobile/tablet only */}
        <div className="flex gap-3 xl:hidden">
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

        {/* Animated filter panel — mobile/tablet only */}
        <div
          className={cn(
            'xl:hidden grid transition-all duration-300 ease-out',
            showFilters ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
          )}
        >
          <div className="overflow-hidden">
            <div
              className={cn(
                'flex flex-col gap-4 p-4 rounded-xl border border-border/50 bg-card/50 mb-0.5',
                'transition-all duration-300 ease-out',
                showFilters ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
              )}
            >
              <div className="flex flex-col gap-2">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Categoría</span>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((cat) => (
                    <FilterChip
                      key={cat.value}
                      active={category === cat.value}
                      onClick={() => setCategory(cat.value)}
                    >
                      {cat.label}
                    </FilterChip>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <div className="flex flex-col gap-2 min-w-[160px]">
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Estado</span>
                  <div className="flex flex-wrap gap-2">
                    {STATUS_OPTIONS.map((opt) => (
                      <FilterChip
                        key={opt.value}
                        active={status === opt.value}
                        onClick={() => setStatus(opt.value)}
                      >
                        {opt.label}
                      </FilterChip>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Ordenar</span>
                  <div className="flex flex-wrap gap-2">
                    {SORT_OPTIONS.map((opt) => (
                      <FilterChip
                        key={opt.value}
                        active={sort === opt.value}
                        onClick={() => setSort(opt.value)}
                      >
                        {opt.label}
                      </FilterChip>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results meta — mobile/tablet only */}
        <div className="flex items-center justify-between xl:hidden">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2 2xl:grid-cols-3 gap-5">
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
    </div>
  )
}
