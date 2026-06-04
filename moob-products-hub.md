# 🗂️ Moob Products HUB — Documentación técnica

> Plataforma centralizada de demos y productos de Media Moob, accesible desde `product.dev.moob.club`.

---

## Índice

- [🗂️ Moob Products HUB — Documentación técnica](#️-moob-products-hub--documentación-técnica)
  - [Índice](#índice)
  - [1. Concepto](#1-concepto)
  - [2. Arquitectura](#2-arquitectura)
    - [Flujo de una request](#flujo-de-una-request)
  - [3. Setup del proyecto](#3-setup-del-proyecto)
  - [4. Configuración de dominio](#4-configuración-de-dominio)
  - [5. vercel.json — Rewrites](#5-verceljson--rewrites)
    - [Comportamiento](#comportamiento)
  - [6. products.config.ts — Catálogo](#6-productsconfigts--catálogo)
  - [7. Home — UI del catálogo](#7-home--ui-del-catálogo)
  - [8. basePath en portales hijo](#8-basepath-en-portales-hijo)
    - [Qué corrige el basePath](#qué-corrige-el-basepath)
  - [9. Multi-idioma por portal](#9-multi-idioma-por-portal)
    - [vercel.json (hub)](#verceljson-hub)
    - [basePath por variante](#basepath-por-variante)
    - [Redirect desde /locoporlacocina (sin idioma)](#redirect-desde-locoporlacocina-sin-idioma)
  - [10. Agregar un portal nuevo](#10-agregar-un-portal-nuevo)
    - [Paso 1 — Agregar al vercel.json del hub](#paso-1--agregar-al-verceljson-del-hub)
    - [Paso 2 — Agregar al products.config.ts](#paso-2--agregar-al-productsconfigts)
    - [Paso 3 — Agregar basePath al portal hijo](#paso-3--agregar-basepath-al-portal-hijo)
    - [Paso 4 — Push + deploy](#paso-4--push--deploy)
  - [11. Deploy](#11-deploy)
    - [Primera vez](#primera-vez)
    - [Deploy continuo](#deploy-continuo)
  - [12. Estructura de carpetas](#12-estructura-de-carpetas)
  - [Checklist de lanzamiento](#checklist-de-lanzamiento)

---

## 1. Concepto

El Moob Products HUB es un proyecto Next.js desplegado en Vercel que actúa como:

- **Proxy transparente** hacia los distintos portales de Media Moob (el usuario nunca ve cambiar la URL)
- **Catálogo visual** de todos los productos disponibles con sus variantes de idioma
- **Único punto de configuración DNS** — el dominio `product.dev.moob.club` se conecta una sola vez a este proyecto y nunca más se toca

Los portales individuales (`team-gamers-demo.vercel.app`, etc.) no necesitan dominio custom propio.

---

## 2. Arquitectura

```
product.dev.moob.club
        │
        ▼
┌──────────────────┐
│  moob-products-  │  ← este proyecto (Next.js hub)
│      hub         │
└────────┬─────────┘
         │  vercel.json rewrites (proxy transparente)
         │
    ┌────┴────────────────────────────────┐
    │                                     │
    ▼                                     ▼
/locoporlacocina/es              /teamgamers/:path*
/locoporlacocina/pt                      │
/locoporlacocina/en                      ▼
        │                    team-gamers-demo.vercel.app
        ▼
loco-por-la-cocina-es.vercel.app
loco-por-la-cocina-pt.vercel.app
loco-por-la-cocina-en.vercel.app
```

### Flujo de una request

```
Usuario → product.dev.moob.club/teamgamers/partidas
               │
         [hub: rewrite]  ← URL NO cambia en el browser
               │
         team-gamers-demo.vercel.app/teamgamers/partidas
               │
         [basePath='/teamgamers' en el portal]
               │
         Renderiza correctamente ✅
```

---

## 3. Setup del proyecto

```bash
npx create-next-app@latest moob-products-hub \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --no-src-dir

cd moob-products-hub
```

Dependencias mínimas — no requiere nada extra más allá del stack base de Next.js + Tailwind.

---

## 4. Configuración de dominio

El dominio ya está gestionado por un tercero. Solo se necesita **un registro CNAME**:

| Campo | Valor                                                                 |
| ----- | --------------------------------------------------------------------- |
| Type  | `CNAME`                                                               |
| Name  | `product.dev`                                                         |
| Value | `<hash>.vercel-dns-016.com` ← lo provee Vercel al conectar el dominio |

**Pasos en Vercel:**

1. Ir al proyecto `moob-products-hub` → Settings → Domains
2. Agregar `product.dev.moob.club`
3. Copiar el valor CNAME que muestra Vercel
4. Pasarle ese valor exacto a quien gestiona el DNS
5. Una vez propagado, Vercel muestra "Valid Configuration" ✅

> **Importante:** esto se hace una sola vez. Todos los portales futuros heredan este dominio automáticamente vía rewrites.

---

## 5. vercel.json — Rewrites

El archivo `vercel.json` en la raíz del proyecto es el núcleo del sistema de routing.

```json
{
  "rewrites": [
    {
      "source": "/locoporlacocina/es/:path*",
      "destination": "https://loco-por-la-cocina-es.vercel.app/:path*"
    },
    {
      "source": "/locoporlacocina/pt/:path*",
      "destination": "https://loco-por-la-cocina-pt.vercel.app/:path*"
    },
    {
      "source": "/locoporlacocina/en/:path*",
      "destination": "https://loco-por-la-cocina-en.vercel.app/:path*"
    },
    {
      "source": "/teamgamers/:path*",
      "destination": "https://team-gamers-demo.vercel.app/:path*"
    },
    {
      "source": "/clubdeenergia/:path*",
      "destination": "https://club-de-energia.vercel.app/:path*"
    }
  ]
}
```

### Comportamiento

- **`rewrites`** → proxy transparente, URL no cambia en el browser
- **`redirects`** → NO usar, cambia la URL visible al usuario
- El orden importa: rutas más específicas van primero (ej: `/locoporlacocina/es` antes que `/locoporlacocina`)

---

## 6. products.config.ts — Catálogo

Archivo de configuración central. Agregar un producto nuevo = agregar un objeto aquí + una línea al `vercel.json`.

```ts
// config/products.config.ts

export type Language = {
  lang: string
  label: string
  path: string
}

export type Product = {
  slug: string
  name: string
  description: string
  operator: string
  category: 'gaming' | 'cooking' | 'esoteric' | 'comics' | 'fitness' | 'other'
  variants: Language[]
  status: 'live' | 'wip' | 'coming-soon'
}

export const products: Product[] = [
  {
    slug: 'locoporlacocina',
    name: 'Locos por la Cocina',
    description: 'Portal de gastronomía con recetas, videos y comunidad.',
    operator: 'TMCEL',
    category: 'cooking',
    status: 'live',
    variants: [
      { lang: 'es', label: 'Español', path: '/locoporlacocina/es' },
      { lang: 'pt', label: 'Português', path: '/locoporlacocina/pt' },
      { lang: 'en', label: 'English', path: '/locoporlacocina/en' },
    ],
  },
  {
    slug: 'teamgamers',
    name: 'Team Gamers V3',
    description: 'Portal de gaming con noticias, rankings y comunidad gamer.',
    operator: 'Movistar',
    category: 'gaming',
    status: 'wip',
    variants: [{ lang: 'es', label: 'Español', path: '/teamgamers' }],
  },
  {
    slug: 'clubdeenergia',
    name: 'Club de Energía',
    description: 'Portal esotérico con tarot, calendario lunar y gamificación.',
    operator: 'Personal',
    category: 'esoteric',
    status: 'live',
    variants: [{ lang: 'es', label: 'Español', path: '/clubdeenergia' }],
  },
]
```

---

## 7. Home — UI del catálogo

```tsx
// app/page.tsx

import { products } from '@/config/products.config'
import ProductCard from '@/components/ProductCard'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white px-6 py-12">
      <header className="mb-12">
        <img src="/moob-logo.svg" alt="Media Moob" className="h-8 mb-4" />
        <h1 className="text-3xl font-bold">Products HUB</h1>
        <p className="text-zinc-400 mt-1">Portales DEMO de Media Moob</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>
    </main>
  )
}
```

```tsx
// components/ProductCard.tsx

import { Product } from '@/config/products.config'
import Link from 'next/link'

const categoryColors = {
  gaming: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  cooking: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  esoteric: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  comics: 'bg-blue-500/10   text-blue-400   border-blue-500/20',
  fitness: 'bg-green-500/10  text-green-400  border-green-500/20',
  other: 'bg-zinc-500/10   text-zinc-400   border-zinc-500/20',
}

const statusLabel = {
  live: { label: 'Live', color: 'bg-green-500' },
  wip: { label: 'En progreso', color: 'bg-yellow-500' },
  'coming-soon': { label: 'Próximamente', color: 'bg-zinc-500' },
}

export default function ProductCard({ product }: { product: Product }) {
  const { label, color } = statusLabel[product.status]

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="font-semibold text-lg">{product.name}</h2>
          <span className="text-xs text-zinc-500">{product.operator}</span>
        </div>
        <span
          className={`flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-full border ${categoryColors[product.category]}`}
        >
          {product.category}
        </span>
      </div>

      {/* Description */}
      <p className="text-sm text-zinc-400">{product.description}</p>

      {/* Status */}
      <div className="flex items-center gap-2">
        <span className={`w-2 h-2 rounded-full ${color}`} />
        <span className="text-xs text-zinc-400">{label}</span>
      </div>

      {/* Language variants */}
      <div className="flex gap-2 flex-wrap mt-auto">
        {product.variants.map((variant) => (
          <Link
            key={variant.lang}
            href={variant.path}
            className="px-3 py-1.5 text-sm rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-colors font-medium"
          >
            {variant.label}
          </Link>
        ))}
      </div>
    </div>
  )
}
```

---

## 8. basePath en portales hijo

Cada portal que se sirve bajo una subruta del hub **debe declarar su `basePath`** en `next.config.js`. De lo contrario, los links internos y assets apuntan a rutas incorrectas.

```js
// next.config.js del portal "team-gamers-demo"

/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/teamgamers',
  // El resto de la configuración existente...
}

module.exports = nextConfig
```

```js
// next.config.js del portal "loco-por-la-cocina-es"
const nextConfig = {
  basePath: '/locoporlacocina/es',
}
```

### Qué corrige el basePath

| Sin basePath                               | Con basePath                                          |
| ------------------------------------------ | ----------------------------------------------------- |
| `<Link href="/articulo">` → `/articulo` ❌ | `<Link href="/articulo">` → `/teamgamers/articulo` ✅ |
| `<img src="/logo.png">` → `/logo.png` ❌   | `<img src="/logo.png">` → `/teamgamers/logo.png` ✅   |
| `router.push('/home')` → `/home` ❌        | `router.push('/home')` → `/teamgamers/home` ✅        |

> **Nota:** el portal sigue funcionando en su `.vercel.app` original sin cambios, ya que Next.js aplica el basePath de forma transparente.

---

## 9. Multi-idioma por portal

Para portales con múltiples idiomas, se crean proyectos Vercel separados por idioma (uno ya existente por deploy) y se ruteán con un segmento `/lang` en el path.

### vercel.json (hub)

```json
{
  "source": "/locoporlacocina/:lang(es|pt|en)/:path*",
  "destination": "https://loco-por-la-cocina-:lang.vercel.app/:path*"
}
```

> **Alternativa con proyectos nombrados distintos:**

```json
{ "source": "/locoporlacocina/es/:path*", "destination": "https://loco-cocina-es.vercel.app/:path*" },
{ "source": "/locoporlacocina/pt/:path*", "destination": "https://loco-cocina-pt.vercel.app/:path*" },
{ "source": "/locoporlacocina/en/:path*", "destination": "https://loco-cocina-en.vercel.app/:path*" }
```

### basePath por variante

```js
// next.config.js de loco-cocina-pt
const nextConfig = {
  basePath: '/locoporlacocina/pt',
}
```

### Redirect desde /locoporlacocina (sin idioma)

```json
{
  "redirects": [
    {
      "source": "/locoporlacocina",
      "destination": "/locoporlacocina/es",
      "permanent": false
    }
  ]
}
```

---

## 10. Agregar un portal nuevo

Cuando se crea un portal nuevo (ej: `total-fitness-demo.vercel.app`), solo hay que hacer dos cosas:

### Paso 1 — Agregar al vercel.json del hub

```json
{
  "source": "/totalfitness/:path*",
  "destination": "https://total-fitness-demo.vercel.app/:path*"
}
```

### Paso 2 — Agregar al products.config.ts

```ts
{
  slug: 'totalfitness',
  name: 'Total Fitness',
  description: 'Portal de fitness con rutinas y seguimiento.',
  operator: 'Claro',
  category: 'fitness',
  status: 'live',
  variants: [
    { lang: 'es', label: 'Español', path: '/totalfitness' },
  ],
}
```

### Paso 3 — Agregar basePath al portal hijo

```js
// next.config.js de total-fitness-demo
const nextConfig = {
  basePath: '/totalfitness',
}
```

### Paso 4 — Push + deploy

```bash
git add vercel.json config/products.config.ts
git commit -m "feat: add Total Fitness portal"
git push
```

Vercel hace el deploy automáticamente. **No hay que tocar DNS.**

---

## 11. Deploy

### Primera vez

```bash
# Instalar Vercel CLI si no está
npm i -g vercel

# Deploy desde la raíz del proyecto
vercel

# Conectar dominio custom
vercel domains add product.dev.moob.club
```

### Deploy continuo

El proyecto usa el flujo estándar de Vercel con GitHub:

- Push a `main` → deploy a producción (`product.dev.moob.club`)
- Push a cualquier otra rama → deploy de preview (`moob-products-hub-git-branch.vercel.app`)

---

## 12. Estructura de carpetas

```
moob-products-hub/
├── app/
│   ├── layout.tsx          # Layout global con metadata
│   └── page.tsx            # Home — catálogo de productos
├── components/
│   └── ProductCard.tsx     # Card individual de producto
├── config/
│   └── products.config.ts  # ← fuente de verdad de todos los portales
├── public/
│   └── moob-logo.svg
├── vercel.json             # ← rewrites hacia portales hijo
├── next.config.js
├── tailwind.config.ts
└── package.json
```

---

## Checklist de lanzamiento

- [ ] Proyecto creado y deployado en Vercel
- [ ] Dominio `product.dev.moob.club` conectado (CNAME válido)
- [ ] `vercel.json` con rewrites de portales existentes
- [ ] `products.config.ts` con todos los portales actuales
- [ ] Home UI deployada y visible
- [ ] `basePath` configurado en cada portal hijo
- [ ] Verificar navegación en subrutas (no solo el index)
- [ ] Verificar carga de assets (imágenes, fuentes, JS)
- [ ] Verificar que los portales siguen funcionando en sus `.vercel.app` originales
- [ ] Presentación interna al equipo

---

_Documentación generada para Media Moob — Junio 2026_
