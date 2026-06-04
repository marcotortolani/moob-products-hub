# Changelog

Todos los cambios relevantes del proyecto se documentan en este archivo.
Formato basado en [Keep a Changelog](https://keepachangelog.com/es/1.0.0/).

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
