'use client'

import { useState, useTransition } from 'react'
import { Plus, Trash2, CheckCircle2, XCircle } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import ProductCard from '@/components/ProductCard'
import { Product } from '@/config/products.config'
import { addProduct, type ProductInput, type ActionResult } from './actions'

const CATEGORIES: { value: Product['category']; label: string }[] = [
  { value: 'gaming', label: 'Gaming' },
  { value: 'cooking', label: 'Cocina' },
  { value: 'esoteric', label: 'Esotérico' },
  { value: 'comics', label: 'Comics' },
  { value: 'fitness', label: 'Fitness' },
  { value: 'viajes', label: 'Viajes' },
  { value: 'mujer', label: 'Mujer' },
  { value: 'other', label: 'Otro' },
]

const STATUSES: { value: Product['status']; label: string }[] = [
  { value: 'live', label: 'Live' },
  { value: 'wip', label: 'En progreso' },
  { value: 'coming-soon', label: 'Próximamente' },
]

const LANG_LABELS: Record<string, string> = {
  es: 'Español',
  pt: 'Português',
  en: 'English',
  fr: 'Français',
  de: 'Deutsch',
  it: 'Italiano',
}

type VariantForm = { lang: string; label: string; vercelUrl: string }

type FormState = {
  slug: string
  name: string
  description: string
  category: Product['category']
  status: Product['status']
  variants: VariantForm[]
  addRedirect: boolean
}

const INITIAL_STATE: FormState = {
  slug: '',
  name: '',
  description: '',
  category: 'other',
  status: 'wip',
  variants: [{ lang: 'es', label: 'Español', vercelUrl: '' }],
  addRedirect: true,
}

function toPreviewProduct(form: FormState): Product {
  const isMulti = form.variants.length > 1
  return {
    slug: form.slug || 'preview',
    name: form.name || 'Nombre del portal',
    description: form.description || 'Descripción del portal...',
    category: form.category,
    status: form.status,
    variants: form.variants.map(v => ({
      lang: v.lang || 'es',
      label: v.label || 'Idioma',
      path: isMulti
        ? `/${form.slug || 'preview'}/${v.lang || 'es'}`
        : `/${form.slug || 'preview'}`,
    })),
  }
}

const selectClass =
  'h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm text-foreground ' +
  'focus:outline-none focus:border-ring focus:ring-2 focus:ring-ring/50 dark:bg-input/30'

export default function AdminForm() {
  const [form, setForm] = useState<FormState>(INITIAL_STATE)
  const [result, setResult] = useState<ActionResult | null>(null)
  const [isPending, startTransition] = useTransition()

  const preview = toPreviewProduct(form)

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm(prev => ({ ...prev, [key]: value }))
    setResult(null)
  }

  function updateVariant(index: number, field: keyof VariantForm, value: string) {
    setForm(prev => {
      const variants = [...prev.variants]
      variants[index] = { ...variants[index], [field]: value }
      if (field === 'lang' && LANG_LABELS[value]) {
        variants[index].label = LANG_LABELS[value]
      }
      return { ...prev, variants }
    })
    setResult(null)
  }

  function addVariant() {
    setForm(prev => ({
      ...prev,
      variants: [...prev.variants, { lang: '', label: '', vercelUrl: '' }],
    }))
  }

  function removeVariant(index: number) {
    setForm(prev => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index),
    }))
  }

  function handleSubmit() {
    startTransition(async () => {
      const input: ProductInput = {
        slug: form.slug.trim(),
        name: form.name.trim(),
        description: form.description.trim(),
        category: form.category,
        status: form.status,
        variants: form.variants.map(v => ({
          lang: v.lang.trim(),
          label: v.label.trim(),
          vercelUrl: v.vercelUrl.trim(),
        })),
        addRedirect: form.addRedirect,
      }
      const res = await addProduct(input)
      setResult(res)
      if (res.success) setForm(INITIAL_STATE)
    })
  }

  const canSubmit = !isPending && !!form.slug && !!form.name && !!form.description

  return (
    <div className="min-h-screen bg-background p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <h1 className="text-2xl font-bold text-foreground">Admin</h1>
          <span className="text-xs font-mono bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-full">
            dev only
          </span>
        </div>
        <p className="text-sm text-muted-foreground">Agregar un nuevo producto al Products HUB</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-8 max-w-5xl">
        {/* ── FORM ────────────────────────────────────── */}
        <div className="space-y-5">

          {/* Basic info */}
          <section className="rounded-xl border border-border/60 bg-card p-5 space-y-4">
            <h2 className="text-sm font-semibold">Información básica</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Slug *</label>
                <Input
                  value={form.slug}
                  onChange={e =>
                    setField('slug', e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ''))
                  }
                  placeholder="miportal"
                  className="font-mono"
                />
                <p className="text-[11px] text-muted-foreground">Solo minúsculas y números</p>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Nombre visible *</label>
                <Input
                  value={form.name}
                  onChange={e => setField('name', e.target.value)}
                  placeholder="Mi Portal"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Descripción *</label>
              <Input
                value={form.description}
                onChange={e => setField('description', e.target.value)}
                placeholder="Descripción breve del portal (una oración)."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Categoría</label>
                <select
                  value={form.category}
                  onChange={e => setField('category', e.target.value as Product['category'])}
                  className={selectClass}
                >
                  {CATEGORIES.map(c => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Estado</label>
                <select
                  value={form.status}
                  onChange={e => setField('status', e.target.value as Product['status'])}
                  className={selectClass}
                >
                  {STATUSES.map(s => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          {/* Variants */}
          <section className="rounded-xl border border-border/60 bg-card p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold">Variantes de idioma</h2>
              <Button variant="outline" size="sm" onClick={addVariant}>
                <Plus className="size-3.5" />
                Agregar idioma
              </Button>
            </div>

            <div className="space-y-3">
              {form.variants.map((variant, i) => (
                <div key={i} className="grid grid-cols-[72px_120px_1fr_32px] gap-2 items-start">
                  <div className="space-y-1">
                    {i === 0 && (
                      <label className="text-[11px] text-muted-foreground">Código</label>
                    )}
                    <Input
                      value={variant.lang}
                      onChange={e => updateVariant(i, 'lang', e.target.value.toLowerCase().slice(0, 5))}
                      placeholder="es"
                      className="font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    {i === 0 && (
                      <label className="text-[11px] text-muted-foreground">Etiqueta</label>
                    )}
                    <Input
                      value={variant.label}
                      onChange={e => updateVariant(i, 'label', e.target.value)}
                      placeholder="Español"
                    />
                  </div>
                  <div className="space-y-1">
                    {i === 0 && (
                      <label className="text-[11px] text-muted-foreground">URL Vercel del portal</label>
                    )}
                    <Input
                      value={variant.vercelUrl}
                      onChange={e => updateVariant(i, 'vercelUrl', e.target.value)}
                      placeholder="https://mi-portal-es.vercel.app"
                      className="font-mono text-xs"
                    />
                  </div>
                  <div className={cn('flex items-center', i === 0 && 'mt-5')}>
                    {form.variants.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => removeVariant(i)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {form.variants.length > 1 && (
              <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer select-none pt-1">
                <input
                  type="checkbox"
                  checked={form.addRedirect}
                  onChange={e => setField('addRedirect', e.target.checked)}
                  className="rounded accent-primary"
                />
                Agregar redirect de{' '}
                <code className="text-xs bg-muted px-1 py-0.5 rounded">
                  /{form.slug || 'slug'}
                </code>{' '}
                al primer idioma
              </label>
            )}
          </section>

          {/* Generated paths preview */}
          {form.slug && (
            <section className="rounded-xl border border-border/60 bg-card p-5 space-y-3">
              <h2 className="text-sm font-semibold">Rutas que se generarán</h2>
              <div className="space-y-1.5 font-mono text-xs">
                {form.variants.map((v, i) => {
                  const isMulti = form.variants.length > 1
                  const src = isMulti
                    ? `/${form.slug}/${v.lang || '?'}/:path*`
                    : `/${form.slug}/:path*`
                  const dest = v.vercelUrl
                    ? `${v.vercelUrl.replace(/\/$/, '')}/:path*`
                    : '(URL pendiente)/:path*'
                  return (
                    <div key={i} className="flex items-center gap-2 flex-wrap">
                      <span className="text-primary">{src}</span>
                      <span className="text-muted-foreground">→</span>
                      <span className="text-muted-foreground">{dest}</span>
                    </div>
                  )
                })}
                {form.variants.length > 1 && form.addRedirect && (
                  <div className="flex items-center gap-2 flex-wrap border-t border-border/40 pt-1.5 mt-1">
                    <span className="text-amber-500">/{form.slug}</span>
                    <span className="text-muted-foreground">→ redirect →</span>
                    <span className="text-muted-foreground">
                      /{form.slug}/{form.variants[0]?.lang || '?'}
                    </span>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Result */}
          {result && (
            <div
              className={cn(
                'flex items-start gap-3 rounded-xl border p-4 text-sm',
                result.success
                  ? 'border-emerald-500/20 bg-emerald-500/5 text-emerald-700 dark:text-emerald-400'
                  : 'border-destructive/20 bg-destructive/5 text-destructive'
              )}
            >
              {result.success ? (
                <CheckCircle2 className="size-4 mt-0.5 shrink-0" />
              ) : (
                <XCircle className="size-4 mt-0.5 shrink-0" />
              )}
              <div>
                <p className="font-medium">{result.message}</p>
                {result.error && (
                  <p className="mt-0.5 text-xs opacity-75">{result.error}</p>
                )}
                {result.success && (
                  <p className="mt-1 text-xs opacity-75">
                    Recordá configurar <code>basePath</code> en el portal hijo y hacer{' '}
                    <code>git push</code>.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Submit */}
          <Button
            onClick={handleSubmit}
            disabled={!canSubmit}
            size="lg"
            className="w-full"
          >
            {isPending ? 'Guardando...' : 'Guardar producto'}
          </Button>
        </div>

        {/* ── PREVIEW ─────────────────────────────────── */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-muted-foreground">Preview</h2>
          <div className="pointer-events-none select-none">
            <ProductCard product={preview} />
          </div>
          <div className="rounded-xl border border-border/60 bg-card p-4 text-xs text-muted-foreground space-y-2">
            <p className="font-semibold text-foreground text-sm">Próximos pasos</p>
            <ol className="list-decimal pl-4 space-y-1 leading-relaxed">
              <li>
                Configurar{' '}
                <code className="bg-muted px-1 rounded">
                  basePath: &apos;/{form.slug || 'slug'}&apos;
                </code>{' '}
                en el portal hijo
              </li>
              <li>Deploy del portal hijo</li>
              <li>Guardar con el botón</li>
              <li>
                <code className="bg-muted px-1 rounded">git push</code> del hub
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}
