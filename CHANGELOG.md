# Changelog

Todos los cambios relevantes del proyecto se documentan en este archivo.
Formato basado en [Keep a Changelog](https://keepachangelog.com/es/1.0.0/).

---

## [1.1.0] — 2026-06-04

### Rediseño UI, dark/light mode, animaciones y fix de aislamiento de portales

#### Agregado

- **Dark / light / system theme** — `next-themes` con detección de preferencia del sistema y persistencia en `localStorage`; toggle de 3 botones (Sol / Monitor / Luna) en el header
- **Header sticky** — `components/Header.tsx` con backdrop blur, logo, label "PRODUCTS HUB" y el toggle de tema; extraído del layout para ser exclusivo de la home
- **Animaciones de ícono por categoría** — al hacer hover en una card, el ícono anima según su categoría: wiggle (gaming), bounce (cooking / viajes), spin lento (esotérico), tada (comics), pump (fitness / mujer), spin-once (otro); implementado con `onMouseEnter`/`onMouseLeave` + inline style para evitar problemas de escaneo de clases en Tailwind v4
- **Animación del panel de filtros** — apertura y cierre con transición suave via `grid-rows-[0fr] → grid-rows-[1fr]` + `opacity` + `translate-y`; el panel permanece en el DOM sin desmontarse
- **9 portales de ejemplo** incorporados al catálogo: Chef Zone, Arcade Club, Mundo Astral, Total Fitness, Viajes Club, Explora LATAM, Mujer Club, Ella Mag, Toon Verse
- **Categorías nuevas**: `viajes` (ícono `Plane`, celeste) y `mujer` (ícono `Heart`, rosa)
- `components/Footer.tsx` — separador + "Media Moob — Product HUB" + versión leída de `package.json`

#### Modificado

- **Contraste de cards** — dark mode: background `oklch(0.10)` / card `oklch(0.17)` (delta visible); light mode: background gris claro / card blanca con `shadow-sm`
- **Colores de badge y ícono** adaptativos con variantes `dark:` para funcionar en ambos modos
- **`ProductCard`** convertido a client component (`'use client'`) para manejar hover state
- **CSS variables** (globals.css) — paleta OKLCH propia para dark y light con acento azul eléctrico `oklch(0.65 0.22 264)`
- Logo del header: se invierte (`invert`) en light mode para mantener visibilidad

#### Fix arquitectural

- **Route group `(hub)`** — `app/(hub)/layout.tsx` contiene Header y Footer; `app/layout.tsx` raíz solo tiene `ThemeProvider`; las rutas de portales (`/clubdeenergia`, `/teamgamers`, etc.) ya no heredan el chrome del HUB
- En producción Vercel intercepta las rutas de portales antes de llegar a Next.js (rewrites); en desarrollo local tampoco aplica el layout del HUB a esas rutas

#### Decisiones técnicas

- `group-hover:animate-*` de Tailwind no funciona con clases generadas dinámicamente desde objetos TS ni con el `group/card` nombrado de shadcn → solución: inline style con `animation` property + `onMouseEnter`/`onMouseLeave`
- `operator` eliminado del modelo de datos — todos los portales son entornos de demo/testing

---

## [1.0.0] — 2026-06-04

### Inicial

Primera versión del Moob Products HUB.

#### Agregado

- Proyecto Next.js 16 (App Router) con TypeScript y Tailwind CSS v4
- shadcn/ui configurado con tema dark personalizado (OKLCH, acento azul eléctrico)
- `config/products.config.ts` — catálogo de portales con tipos `Product` y `Language`
- `vercel.json` — rewrites proxy transparentes hacia los 3 portales iniciales:
  - Locos por la Cocina (es / pt / en) → `loco-por-la-cocina-*.vercel.app`
  - Team Gamers V3 → `team-gamers-demo.vercel.app`
  - Club de Energía → `club-de-energia-test.vercel.app`
- Redirect `/locoporlacocina` → `/locoporlacocina/es`
- UI del catálogo con grid responsive (1 / 2 / 3 columnas)
- `ProductCard` con ícono Lucide por categoría, badge coloreado, dot de status animado (live)
- `CatalogView` — búsqueda en tiempo real, filtros por categoría y estado, ordenamiento (A→Z, Z→A, por estado)
- Empty state cuando ningún portal coincide con la búsqueda
- Footer con versión del proyecto
- Logo SVG de Media Moob en el header
- Deploy en Vercel + dominio `product.dev.moob.club` conectado

#### Decisiones técnicas

- `operator` eliminado del modelo de datos — todos los portales son entornos de demo/testing
- shadcn Button usa `@base-ui/react`; los links de variante usan `buttonVariants` directo sobre `<Link>`
- `CatalogView` es client component; `page.tsx` es server component estático
