import { products } from '@/config/products.config'
import CatalogPage from '@/components/CatalogPage'

export default function HomePage() {
  return <CatalogPage products={products} />
}
