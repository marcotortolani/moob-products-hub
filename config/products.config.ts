export type Language = {
  lang: string
  label: string
  path: string
}

export type Product = {
  slug: string
  name: string
  description: string
  category: 'gaming' | 'cooking' | 'esoteric' | 'comics' | 'fitness' | 'other'
  variants: Language[]
  status: 'live' | 'wip' | 'coming-soon'
}

export const products: Product[] = [
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
    slug: 'teamgamers',
    name: 'Team Gamers V3',
    description: 'Portal de gaming con noticias, rankings y comunidad gamer.',
    category: 'gaming',
    status: 'wip',
    variants: [{ lang: 'es', label: 'Español', path: '/teamgamers' }],
  },
  {
    slug: 'clubdeenergia',
    name: 'Club de Energía',
    description: 'Portal esotérico con tarot, calendario lunar y gamificación.',
    category: 'esoteric',
    status: 'live',
    variants: [{ lang: 'es', label: 'Español', path: '/clubdeenergia' }],
  },
]
