# Changelog

Todos los cambios relevantes del proyecto se documentan en este archivo.
Formato basado en [Keep a Changelog](https://keepachangelog.com/es/1.0.0/).

---

## [1.1.0] — 2026-06-04

### Catálogo — sidebar de filtros y nuevos portales

#### Agregado

- `CatalogPage` — nuevo componente cliente que reemplaza a `CatalogView` como controlador principal; centraliza el estado de todos los filtros
- Sidebar fijo en pantallas XL+ (`sticky top-14`, mismo contenedor `max-w-7xl` que el header para alineación pixel-perfect): búsqueda, categoría, estado, idioma y ordenamiento
- Filtro por idioma (Español / Português / English) — filtra por variantes del producto
- Panel de filtros mobile existente actualizado con la sección de idioma
- 9 portales nuevos incorporados al catálogo: Chef Zone, Arcade Club, Mundo Astral, Total Fitness, Viajes Club, Explora LATAM, Mujer Club, Ella Mag, Toon Verse
- Categorías nuevas: `viajes` y `mujer`

#### Modificado

- `page.tsx` simplificado a wrapper estático que renderiza `<CatalogPage />`
- Grid del catálogo ajustado a 2 columnas en XL (con sidebar activo) y 3 columnas en 2XL

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
