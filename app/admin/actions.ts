'use server'

import fs from 'fs'
import path from 'path'
import { Product } from '@/config/products.config'

export type VariantInput = {
  lang: string
  label: string
  vercelUrl: string
}

export type ProductInput = {
  slug: string
  name: string
  description: string
  category: Product['category']
  status: Product['status']
  variants: VariantInput[]
  addRedirect: boolean
}

export type ActionResult = {
  success: boolean
  message: string
  error?: string
}

const ROOT = process.cwd()
const CONFIG_PATH = path.join(ROOT, 'config/products.config.ts')
const VERCEL_JSON_PATH = path.join(ROOT, 'vercel.json')

function buildVariantsString(input: ProductInput): string {
  const isMulti = input.variants.length > 1
  if (!isMulti) {
    const v = input.variants[0]
    return `    variants: [{ lang: '${v.lang}', label: '${v.label}', path: '/${input.slug}' }],`
  }
  const lines = input.variants.map(
    v => `      { lang: '${v.lang}', label: '${v.label}', path: '/${input.slug}/${v.lang}' },`
  )
  return `    variants: [\n${lines.join('\n')}\n    ],`
}

function buildProductEntry(input: ProductInput): string {
  const cat = input.category.toUpperCase()
  const dashes = '─'.repeat(Math.max(2, 47 - cat.length))
  const header = `  // ── ${cat} ${dashes}`
  const variants = buildVariantsString(input)

  return [
    header,
    '  {',
    `    slug: '${input.slug}',`,
    `    name: '${input.name}',`,
    `    description: '${input.description}',`,
    `    category: '${input.category}',`,
    `    status: '${input.status}',`,
    variants,
    '  },',
  ].join('\n')
}

function validateInput(input: ProductInput): string | null {
  if (!input.slug) return 'El slug es obligatorio.'
  if (!/^[a-z0-9]+$/.test(input.slug)) return 'El slug solo puede contener minúsculas y números.'
  if (!input.name.trim()) return 'El nombre es obligatorio.'
  if (!input.description.trim()) return 'La descripción es obligatoria.'
  if (input.variants.length === 0) return 'Debe haber al menos una variante.'
  for (const v of input.variants) {
    if (!v.lang) return 'Todas las variantes deben tener un código de idioma.'
    if (!v.label) return 'Todas las variantes deben tener una etiqueta.'
    if (!v.vercelUrl) return 'Todas las variantes deben tener una URL de Vercel.'
    if (!v.vercelUrl.startsWith('https://')) return 'La URL de Vercel debe comenzar con https://'
  }
  return null
}

export async function addProduct(input: ProductInput): Promise<ActionResult> {
  if (process.env.NODE_ENV !== 'development') {
    return { success: false, message: 'Operación no permitida', error: 'Solo disponible en desarrollo.' }
  }

  const validationError = validateInput(input)
  if (validationError) {
    return { success: false, message: 'Datos inválidos', error: validationError }
  }

  try {
    const configContent = fs.readFileSync(CONFIG_PATH, 'utf-8')

    if (configContent.includes(`slug: '${input.slug}'`)) {
      return {
        success: false,
        message: 'Slug duplicado',
        error: `El slug "${input.slug}" ya existe en products.config.ts.`,
      }
    }

    const insertionPoint = configContent.lastIndexOf('\n]')
    if (insertionPoint === -1) {
      return {
        success: false,
        message: 'Error de formato',
        error: 'No se encontró el cierre del array en products.config.ts.',
      }
    }

    const newEntry = buildProductEntry(input)
    const newConfigContent =
      configContent.slice(0, insertionPoint) +
      '\n\n' + newEntry + '\n' +
      configContent.slice(insertionPoint)

    // Update vercel.json
    const vercelJson = JSON.parse(fs.readFileSync(VERCEL_JSON_PATH, 'utf-8'))
    const isMulti = input.variants.length > 1

    const newRewrites = input.variants.map(v => ({
      source: isMulti
        ? `/${input.slug}/${v.lang}/:path*`
        : `/${input.slug}/:path*`,
      destination: `${v.vercelUrl.replace(/\/$/, '')}/:path*`,
    }))

    const existingSources = new Set(
      (vercelJson.rewrites || []).map((r: { source: string }) => r.source)
    )
    const uniqueNewRewrites = newRewrites.filter(r => !existingSources.has(r.source))
    vercelJson.rewrites = [...(vercelJson.rewrites || []), ...uniqueNewRewrites]

    if (isMulti && input.addRedirect) {
      const redirect = {
        source: `/${input.slug}`,
        destination: `/${input.slug}/${input.variants[0].lang}`,
        permanent: false,
      }
      const existingRedirects = (vercelJson.redirects || []) as Array<{ source: string }>
      if (!existingRedirects.find(r => r.source === redirect.source)) {
        vercelJson.redirects = [...existingRedirects, redirect]
      }
    }

    fs.writeFileSync(CONFIG_PATH, newConfigContent, 'utf-8')
    fs.writeFileSync(VERCEL_JSON_PATH, JSON.stringify(vercelJson, null, 2) + '\n', 'utf-8')

    return { success: true, message: `Producto "${input.name}" agregado correctamente.` }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error desconocido'
    return { success: false, message: 'Error al guardar archivos', error: message }
  }
}
