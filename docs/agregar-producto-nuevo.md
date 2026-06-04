# Procedimiento — Agregar un producto nuevo al Products HUB

> Referencia técnica: [moob-products-hub.md](./moob-products-hub.md)

Hay dos formas de incorporar un nuevo portal. El panel `/admin` es el camino rápido cuando se trabaja en local; el procedimiento manual es el fallback para cualquier otro contexto.

---

## Índice

- [Requisitos previos (ambos métodos)](#requisitos-previos-ambos-métodos)
- [Método 1 — Panel /admin](#método-1--panel-admin-solo-en-dev)
- [Método 2 — Procedimiento manual](#método-2--procedimiento-manual)
  - [Paso 1 — basePath en el portal hijo](#paso-1--configurar-el-portal-hijo-basepath)
  - [Paso 2 — Rewrite en vercel.json](#paso-2--agregar-el-rewrite-en-verceljson)
  - [Paso 3 — Registro en products.config.ts](#paso-3--registrar-el-producto-en-productsconfigts)
  - [Paso 4 — Portal multi-idioma (opcional)](#paso-4--opcional-portal-multi-idioma)
  - [Paso 5 — Commit y deploy](#paso-5--commit-y-deploy)
  - [Paso 6 — Verificación](#paso-6--verificación)
- [Referencia rápida de tipos](#referencia-rápida-de-tipos)
- [Checklist de incorporación](#checklist-de-incorporación)

---

## Requisitos previos (ambos métodos)

- El portal hijo ya deployado en Vercel (ej: `mi-portal-demo.vercel.app`)
- Acceso al repositorio del portal hijo para modificar su `next.config.js`
- Definido el **slug** que usará en el hub (ej: `miportal`) — solo minúsculas y números, sin espacios

---

## Método 1 — Panel /admin _(solo en dev)_

> Disponible únicamente con `npm run dev`. En producción la ruta devuelve 404.

Este método escribe `products.config.ts` y `vercel.json` automáticamente desde un formulario con preview en tiempo real.

### Paso 1 — basePath en el portal hijo

Antes de abrir el panel, configurar el `basePath` en el portal hijo y hacer deploy:

```js
// next.config.js del portal hijo
const nextConfig = {
  basePath: '/miportal',        // un idioma
  // basePath: '/miportal/es', // multi-idioma: un deploy por variante
}
module.exports = nextConfig
```

### Paso 2 — Abrir el panel

Con el hub corriendo en local:

```
http://localhost:3000/admin
```

### Paso 3 — Completar el formulario

| Campo | Qué ingresar |
|---|---|
| **Slug** | Identificador único, solo minúsculas y números (ej: `totalfitness`) |
| **Nombre visible** | El nombre que aparece en la card del catálogo |
| **Descripción** | Una oración descriptiva |
| **Categoría** | gaming / cooking / esoteric / comics / fitness / viajes / mujer / other |
| **Estado** | `live`, `wip` o `coming-soon` |
| **Variantes** | Una fila por idioma: código (`es`), etiqueta (auto-completa), URL Vercel del portal |

Para portales multi-idioma, usar **Agregar idioma** para sumar filas. Marcar el checkbox de redirect si se quiere que `/{slug}` redirija al primer idioma.

La sección **"Rutas que se generarán"** muestra los rewrites antes de confirmar.

### Paso 4 — Guardar y hacer push

Hacer clic en **Guardar producto**. El panel escribe los dos archivos directamente.

Luego:

```bash
git add vercel.json config/products.config.ts
git commit -m "feat: add <nombre del portal> portal"
git push
```

Vercel hace el deploy automáticamente. **No hay que tocar DNS.**

---

## Método 2 — Procedimiento manual

Usar cuando no se está en entorno de desarrollo local o se necesita control total sobre los cambios.

### Paso 1 — Configurar el portal hijo (basePath)

En el repositorio del **portal hijo**, agregar el `basePath` en su `next.config.js`. Obligatorio para que los links internos, assets e imágenes resuelvan correctamente cuando el portal se sirve bajo una subruta del hub.

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

### Paso 2 — Agregar el rewrite en vercel.json

Abrir `vercel.json` y agregar una nueva entrada dentro del array `rewrites`.

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

---

### Paso 3 — Registrar el producto en products.config.ts

Abrir `config/products.config.ts` y agregar un nuevo objeto al array `products`.

```ts
{
  slug: 'miportal',
  name: 'Nombre visible del portal',
  description: 'Descripción breve del portal (una oración).',
  category: 'fitness',   // ver categorías disponibles abajo
  status: 'live',        // 'live' | 'wip' | 'coming-soon'
  variants: [
    { lang: 'es', label: 'Español', path: '/miportal' },
  ],
}
```

**Categorías disponibles:** `'gaming'` | `'cooking'` | `'esoteric'` | `'comics'` | `'fitness'` | `'viajes'` | `'mujer'` | `'other'`

**Estados disponibles:**

| Valor | Descripción | Color en UI |
|---|---|---|
| `live` | Portal en producción y funcional | Verde |
| `wip` | En desarrollo activo | Amarillo |
| `coming-soon` | Anunciado, aún no disponible | Gris |

---

### Paso 4 — (Opcional) Portal multi-idioma

Si el portal tiene múltiples idiomas, cada idioma es un proyecto Vercel separado.

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

**Redirect desde la raíz sin idioma** (sección `redirects` de `vercel.json`):

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
  category: 'other',
  status: 'live',
  variants: [
    { lang: 'es', label: 'Español',   path: '/miportal/es' },
    { lang: 'pt', label: 'Português', path: '/miportal/pt' },
    { lang: 'en', label: 'English',   path: '/miportal/en' },
  ],
}
```

---

### Paso 5 — Commit y deploy

```bash
git add vercel.json config/products.config.ts
git commit -m "feat: add <nombre del portal> portal"
git push
```

Vercel detecta el push y hace el deploy automáticamente. **No hay que tocar DNS.**

---

### Paso 6 — Verificación

Después del deploy (1-2 minutos), verificar:

1. **Catálogo**: el nuevo portal aparece en `product.dev.moob.club` con el card correcto
2. **Index**: `product.dev.moob.club/miportal` carga la home del portal
3. **Subrutas**: navegar a una ruta interna (ej: `/miportal/seccion`) y confirmar que carga
4. **Assets**: imágenes, fuentes e íconos se cargan sin errores 404
5. **Portal original**: el portal en su `.vercel.app` sigue funcionando sin cambios
6. **Multi-idioma** (si aplica): cada variante es accesible desde su path

---

## Referencia rápida de tipos

```ts
export type Language = {
  lang: string    // código de idioma: 'es', 'pt', 'en', etc.
  label: string   // texto visible en el botón: 'Español', 'Português', etc.
  path: string    // path completo: '/miportal' o '/miportal/es'
}

export type Product = {
  slug: string
  name: string
  description: string
  category: 'gaming' | 'cooking' | 'esoteric' | 'comics' | 'fitness' | 'viajes' | 'mujer' | 'other'
  variants: Language[]
  status: 'live' | 'wip' | 'coming-soon'
}
```

---

## Checklist de incorporación

- [ ] Portal hijo deployado en Vercel y accesible en su `.vercel.app`
- [ ] `basePath` configurado en `next.config.js` del portal hijo y redeploy hecho
- [ ] **Método /admin**: formulario completado y guardado → ir directo al `git push`
- [ ] **Método manual**: rewrite en `vercel.json` + producto en `products.config.ts`
- [ ] (Multi-idioma) Un rewrite por idioma con rutas específicas primero
- [ ] (Multi-idioma) Redirect desde la raíz sin idioma configurado
- [ ] `git push` a `main` y deploy de Vercel completado
- [ ] Card visible en `product.dev.moob.club`
- [ ] Navegación en subrutas funcional
- [ ] Assets cargando correctamente
- [ ] Portal original en `.vercel.app` sin regresiones

---

_Documentación generada para Media Moob — Junio 2026_
