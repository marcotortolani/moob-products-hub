# Procedimiento — Agregar un producto nuevo al Products HUB

> Referencia técnica: [moob-products-hub.md](./moob-products-hub.md)

Este documento describe paso a paso cómo incorporar un nuevo portal al Moob Products HUB. El proceso completo toma menos de 10 minutos y **no requiere tocar DNS**.

---

## Índice

- [Procedimiento — Agregar un producto nuevo al Products HUB](#procedimiento--agregar-un-producto-nuevo-al-products-hub)
  - [Índice](#índice)
  - [Requisitos previos](#requisitos-previos)
  - [Paso 1 — Configurar el portal hijo (basePath)](#paso-1--configurar-el-portal-hijo-basepath)
  - [Paso 2 — Agregar el rewrite en vercel.json](#paso-2--agregar-el-rewrite-en-verceljson)
  - [Paso 3 — Registrar el producto en products.config.ts](#paso-3--registrar-el-producto-en-productsconfigts)
  - [Paso 4 — (Opcional) Portal multi-idioma](#paso-4--opcional-portal-multi-idioma)
  - [Paso 5 — Commit y deploy](#paso-5--commit-y-deploy)
  - [Paso 6 — Verificación](#paso-6--verificación)
  - [Referencia rápida de tipos](#referencia-rápida-de-tipos)
  - [Checklist de incorporación](#checklist-de-incorporación)

---

## Requisitos previos

Antes de empezar, asegurarse de contar con:

- El portal hijo ya deployado en Vercel (ej: `mi-portal-demo.vercel.app`)
- Acceso al repositorio `moob-products-hub`
- Acceso al repositorio del portal hijo para modificar su `next.config.js`
- Definido el **slug** que usará en el hub (ej: `miportal`) — solo minúsculas, sin espacios ni caracteres especiales

---

## Paso 1 — Configurar el portal hijo (basePath)

En el repositorio del **portal hijo**, agregar el `basePath` en su `next.config.js`. Esto es obligatorio para que los links internos, assets e imágenes resuelvan correctamente cuando el portal se sirve bajo una subruta del hub.

```js
// next.config.js del portal hijo
/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/miportal',
  // resto de la configuración existente...
}

module.exports = nextConfig
```

> El portal sigue funcionando en su `.vercel.app` original sin cambios — Next.js aplica el basePath de forma transparente.

Hacer deploy del portal hijo con este cambio antes de continuar.

---

## Paso 2 — Agregar el rewrite en vercel.json

En el repositorio `moob-products-hub`, abrir `vercel.json` y agregar una nueva entrada dentro del array `rewrites`.

**Portal de un solo idioma:**

```json
{
  "source": "/miportal/:path*",
  "destination": "https://mi-portal-demo.vercel.app/:path*"
}
```

**Portal multi-idioma** (ver [Paso 4](#paso-4--opcional-portal-multi-idioma) para el setup completo):

```json
{ "source": "/miportal/es/:path*", "destination": "https://mi-portal-es.vercel.app/:path*" },
{ "source": "/miportal/pt/:path*", "destination": "https://mi-portal-pt.vercel.app/:path*" }
```

**Reglas importantes:**

- Las rutas más específicas van **antes** que las genéricas (ej: `/miportal/es` antes que `/miportal`)
- Usar solo `rewrites`, nunca `redirects` — los redirects cambian la URL visible al usuario
- El `:path*` al final es obligatorio para que el proxy funcione en todas las subrutas

**Ejemplo del archivo completo con el nuevo portal agregado:**

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
    },
    {
      "source": "/miportal/:path*",
      "destination": "https://mi-portal-demo.vercel.app/:path*"
    }
  ]
}
```

---

## Paso 3 — Registrar el producto en products.config.ts

Abrir `config/products.config.ts` y agregar un nuevo objeto al array `products`.

```ts
{
  slug: 'miportal',
  name: 'Nombre visible del portal',
  description: 'Descripción breve del portal (una oración).',
  operator: 'Nombre del operador o cliente',
  category: 'fitness',   // ver categorías disponibles abajo
  status: 'live',        // 'live' | 'wip' | 'coming-soon'
  variants: [
    { lang: 'es', label: 'Español', path: '/miportal' },
  ],
}
```

**Categorías disponibles:** `'gaming'` | `'cooking'` | `'esoteric'` | `'comics'` | `'fitness'` | `'other'`

**Estados disponibles:**

| Valor         | Descripción                      | Color en UI |
| ------------- | -------------------------------- | ----------- |
| `live`        | Portal en producción y funcional | Verde       |
| `wip`         | En desarrollo activo             | Amarillo    |
| `coming-soon` | Anunciado, aún no disponible     | Gris        |

---

## Paso 4 — (Opcional) Portal multi-idioma

Si el portal tiene múltiples idiomas, cada idioma es un proyecto Vercel separado. Se siguen los mismos pasos anteriores pero se repiten por variante.

**vercel.json** — una entrada por idioma (rutas específicas primero):

```json
{ "source": "/miportal/es/:path*", "destination": "https://mi-portal-es.vercel.app/:path*" },
{ "source": "/miportal/pt/:path*", "destination": "https://mi-portal-pt.vercel.app/:path*" },
{ "source": "/miportal/en/:path*", "destination": "https://mi-portal-en.vercel.app/:path*" }
```

**basePath por variante** en cada proyecto hijo:

```js
// next.config.js de mi-portal-es
const nextConfig = { basePath: '/miportal/es' }

// next.config.js de mi-portal-pt
const nextConfig = { basePath: '/miportal/pt' }
```

**Redirect desde la raíz sin idioma** (agregar en la sección `redirects` de `vercel.json`):

```json
{
  "redirects": [
    {
      "source": "/miportal",
      "destination": "/miportal/es",
      "permanent": false
    }
  ]
}
```

**products.config.ts** — una variant por idioma:

```ts
{
  slug: 'miportal',
  name: 'Mi Portal',
  description: 'Descripción del portal.',
  operator: 'Operador',
  category: 'other',
  status: 'live',
  variants: [
    { lang: 'es', label: 'Español',    path: '/miportal/es' },
    { lang: 'pt', label: 'Português',  path: '/miportal/pt' },
    { lang: 'en', label: 'English',    path: '/miportal/en' },
  ],
}
```

---

## Paso 5 — Commit y deploy

Solo hay que commitear los cambios del hub. El portal hijo ya tiene su propio deploy.

```bash
git add vercel.json config/products.config.ts
git commit -m "feat: add <nombre del portal> portal"
git push
```

Vercel detecta el push y hace el deploy automáticamente a `product.dev.moob.club`. **No hay que tocar DNS.**

---

## Paso 6 — Verificación

Después del deploy (1-2 minutos), verificar:

1. **Catálogo**: el nuevo portal aparece en `product.dev.moob.club` con el card correcto
2. **Index**: `product.dev.moob.club/miportal` carga la home del portal
3. **Subrutas**: navegar a una ruta interna del portal (ej: `/miportal/seccion`) y confirmar que carga
4. **Assets**: imágenes, fuentes e íconos se cargan sin errores 404
5. **Portal original**: el portal en su `.vercel.app` original sigue funcionando sin cambios
6. **Multi-idioma** (si aplica): cada variante de idioma es accesible desde su path

---

## Referencia rápida de tipos

```ts
export type Language = {
  lang: string // código de idioma: 'es', 'pt', 'en', etc.
  label: string // texto visible en el botón: 'Español', 'Português', etc.
  path: string // path completo: '/miportal' o '/miportal/es'
}

export type Product = {
  slug: string // identificador único, sin espacios
  name: string // nombre visible en el catálogo
  description: string // descripción breve
  operator: string // cliente u operador (ej: 'Claro', 'Movistar')
  category: 'gaming' | 'cooking' | 'esoteric' | 'comics' | 'fitness' | 'other'
  variants: Language[] // al menos una variante
  status: 'live' | 'wip' | 'coming-soon'
}
```

---

## Checklist de incorporación

- [ ] Portal hijo deployado en Vercel y accesible en su `.vercel.app`
- [ ] `basePath` agregado en `next.config.js` del portal hijo y redeploy hecho
- [ ] Rewrite agregado en `vercel.json` del hub (con `:path*`)
- [ ] Producto registrado en `config/products.config.ts` (slug, name, category, status, variants)
- [ ] (Multi-idioma) Un rewrite por idioma, con rutas específicas primero
- [ ] (Multi-idioma) Redirect desde la raíz sin idioma configurado
- [ ] Commit pusheado: `git push` a `main`
- [ ] Deploy de Vercel completado (verificar en Vercel dashboard)
- [ ] Card visible en `product.dev.moob.club`
- [ ] Navegación en subrutas funcional
- [ ] Assets cargando correctamente
- [ ] Portal original en `.vercel.app` sin regresiones

---

_Documentación generada para Media Moob — Junio 2026_
