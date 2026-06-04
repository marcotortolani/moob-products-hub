export type Language = {
  lang: string
  label: string
  path: string
}

export type Product = {
  slug: string
  name: string
  description: string
  category: 'gaming' | 'cooking' | 'esoteric' | 'comics' | 'fitness' | 'viajes' | 'mujer' | 'other'
  variants: Language[]
  status: 'live' | 'wip' | 'coming-soon'
}

export const products: Product[] = [
  // ── COOKING ──────────────────────────────────────────
  {
    slug: 'locoporlacocina',
    name: 'Locos por la Cocina',
    description: 'Portal de gastronomía con recetas, videos y comunidad.',
    category: 'cooking',
    status: 'live',
    variants: [
      { lang: 'es', label: 'Español', path: '/locoporlacocina/es' },
      { lang: 'pt', label: 'Português', path: '/locoporlacocina/pt' },
      { lang: 'en', label: 'English', path: '/locoporlacocina/en' },
    ],
  },
  {
    slug: 'chefzone',
    name: 'Chef Zone',
    description: 'Recetas gourmet, técnicas de cocina y contenido de chefs destacados.',
    category: 'cooking',
    status: 'coming-soon',
    variants: [
      { lang: 'es', label: 'Español', path: '/chefzone/es' },
      { lang: 'en', label: 'English', path: '/chefzone/en' },
    ],
  },

  // ── GAMING ───────────────────────────────────────────
  {
    slug: 'teamgamers',
    name: 'Team Gamers V3',
    description: 'Portal de gaming con noticias, rankings y comunidad gamer.',
    category: 'gaming',
    status: 'wip',
    variants: [{ lang: 'es', label: 'Español', path: '/teamgamers' }],
  },
  {
    slug: 'arcadeclub',
    name: 'Arcade Club',
    description: 'Torneos, rankings en tiempo real y cobertura de eSports.',
    category: 'gaming',
    status: 'coming-soon',
    variants: [
      { lang: 'es', label: 'Español', path: '/arcadeclub/es' },
      { lang: 'pt', label: 'Português', path: '/arcadeclub/pt' },
    ],
  },

  // ── ESOTERIC ─────────────────────────────────────────
  {
    slug: 'clubdeenergia',
    name: 'Club de Energía',
    description: 'Portal esotérico con tarot, calendario lunar y gamificación.',
    category: 'esoteric',
    status: 'live',
    variants: [{ lang: 'es', label: 'Español', path: '/clubdeenergia' }],
  },
  {
    slug: 'mundoastral',
    name: 'Mundo Astral',
    description: 'Horóscopos diarios, carta natal interactiva y rituales guiados.',
    category: 'esoteric',
    status: 'wip',
    variants: [
      { lang: 'es', label: 'Español', path: '/mundoastral/es' },
      { lang: 'pt', label: 'Português', path: '/mundoastral/pt' },
    ],
  },

  // ── FITNESS ──────────────────────────────────────────
  {
    slug: 'totalfitness',
    name: 'Total Fitness',
    description: 'Rutinas de entrenamiento, seguimiento de progreso y nutrición.',
    category: 'fitness',
    status: 'wip',
    variants: [
      { lang: 'es', label: 'Español', path: '/totalfitness/es' },
      { lang: 'en', label: 'English', path: '/totalfitness/en' },
    ],
  },

  // ── VIAJES ───────────────────────────────────────────
  {
    slug: 'viajesclub',
    name: 'Viajes Club',
    description: 'Destinos, guías de viaje, ofertas exclusivas y comunidad viajera.',
    category: 'viajes',
    status: 'live',
    variants: [
      { lang: 'es', label: 'Español', path: '/viajesclub/es' },
      { lang: 'pt', label: 'Português', path: '/viajesclub/pt' },
      { lang: 'en', label: 'English', path: '/viajesclub/en' },
    ],
  },
  {
    slug: 'exploralatam',
    name: 'Explora LATAM',
    description: 'Turismo regional con rutas, tips locales y experiencias únicas.',
    category: 'viajes',
    status: 'coming-soon',
    variants: [
      { lang: 'es', label: 'Español', path: '/exploralatam/es' },
      { lang: 'pt', label: 'Português', path: '/exploralatam/pt' },
    ],
  },

  // ── MUJER ────────────────────────────────────────────
  {
    slug: 'mujerclub',
    name: 'Mujer Club',
    description: 'Contenido de lifestyle, moda, bienestar y comunidad femenina.',
    category: 'mujer',
    status: 'live',
    variants: [
      { lang: 'es', label: 'Español', path: '/mujerclub/es' },
      { lang: 'pt', label: 'Português', path: '/mujerclub/pt' },
    ],
  },
  {
    slug: 'ellamag',
    name: 'Ella Mag',
    description: 'Revista digital con moda, belleza, salud y tendencias para ellas.',
    category: 'mujer',
    status: 'wip',
    variants: [
      { lang: 'es', label: 'Español', path: '/ellamag/es' },
      { lang: 'en', label: 'English', path: '/ellamag/en' },
    ],
  },

  // ── COMICS ───────────────────────────────────────────
  {
    slug: 'toonverse',
    name: 'Toon Verse',
    description: 'Comics digitales, manga y webcomics con lector inmersivo.',
    category: 'comics',
    status: 'coming-soon',
    variants: [
      { lang: 'es', label: 'Español', path: '/toonverse/es' },
      { lang: 'en', label: 'English', path: '/toonverse/en' },
    ],
  },
]
