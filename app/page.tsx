import Image from 'next/image'
import { products } from '@/config/products.config'
import CatalogView from '@/components/CatalogView'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Subtle gradient top glow */}
      <div
        className="fixed inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent"
        aria-hidden
      />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        {/* Header */}
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-6">
            <Image
              src="/moob-logo.svg"
              alt="Media Moob"
              width={80}
              height={24}
              className="h-6 w-auto opacity-90"
              priority
            />
            <div className="h-4 w-px bg-border/60" aria-hidden />
            <span className="text-xs text-muted-foreground font-medium tracking-widest uppercase">
              Products HUB
            </span>
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            Portales DEMO
          </h1>
          <p className="text-muted-foreground mt-2 text-[15px] max-w-lg">
            Catálogo de portales y demos activos de Media Moob. Todos los
            productos son entornos de testing y demostración.
          </p>
        </header>

        {/* Catalog with search + filters */}
        <CatalogView products={products} />
      </main>
    </div>
  )
}
