# Moob Products HUB

Plataforma centralizada de demos y portales de testing de **Media Moob**, accesible desde `product.dev.moob.club`.

Actúa como proxy transparente: el usuario navega bajo un único dominio sin que la URL cambie, mientras el tráfico se enruta internamente hacia cada portal desplegado en Vercel.

---

## Portales activos

| Portal                  | Categoría | Estado      | Rutas                                                                 |
| ----------------------- | --------- | ----------- | --------------------------------------------------------------------- |
| **Locos por la Cocina** | Cocina    | Live        | `/locoporlacocina/es` · `/locoporlacocina/pt` · `/locoporlacocina/en` |
| **Team Gamers V3**      | Gaming    | En progreso | `/teamgamers`                                                         |
| **Club de Energía**     | Esotérico | Live        | `/clubdeenergia`                                                      |

> Todos los portales son entornos de **demo y testing**. No corresponden a productos en producción.

---

## Stack

- **Next.js 16** (App Router) — framework del hub
- **Tailwind CSS v4** + **shadcn/ui** — sistema de diseño
- **Vercel** — deploy y proxy vía `vercel.json` rewrites

---

## Arquitectura

```
product.dev.moob.club
        │
        ▼
┌──────────────────┐
│  moob-products-  │  ← este proyecto (hub)
│      hub         │
└────────┬─────────┘
         │  vercel.json rewrites
         │
    ┌────┴─────────────────────────────────┐
    │                                      │
    ▼                                      ▼
/locoporlacocina/es|pt|en          /teamgamers/:path*
        │                                  │
loco-por-la-cocina-*.vercel.app    team-gamers-demo.vercel.app
```

El hub no necesita tocar DNS nunca más. Agregar un portal nuevo = una entrada en `vercel.json` + una entrada en `config/products.config.ts`.

---

## Desarrollo local

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

---

## Agregar un portal nuevo

**1. `vercel.json`**

```json
{
  "source": "/mportal/:path*",
  "destination": "https://mi-portal.vercel.app/:path*"
}
```

**2. `config/products.config.ts`**

```ts
{
  slug: 'mportal',
  name: 'Mi Portal',
  description: 'Descripción breve.',
  category: 'other',
  status: 'wip',
  variants: [{ lang: 'es', label: 'Español', path: '/mportal' }],
}
```

**3. Portal hijo — `next.config.js`**

```js
const nextConfig = { basePath: '/mportal' }
```

**4. Push → deploy automático en Vercel. No tocar DNS.**

---

## Estructura de carpetas

```
moob-products-hub/
├── app/
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/               ← shadcn/ui
│   ├── CatalogView.tsx   ← búsqueda, filtros y ordenamiento
│   ├── Footer.tsx
│   └── ProductCard.tsx
├── config/
│   └── products.config.ts  ← fuente de verdad de portales
├── public/
│   └── moob-logo.svg
├── vercel.json             ← rewrites hacia portales hijo
└── CHANGELOG.md
```

---

_Media Moob — [product.dev.moob.club](https://product.dev.moob.club)_
