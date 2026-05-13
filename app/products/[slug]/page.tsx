import { getAllProducts } from '@/lib/utils'
import ProductDetailClient from './ProductDetailClient'

export function generateStaticParams() {
  return getAllProducts().map(product => ({ slug: product.slug }))
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  return <ProductDetailClient slug={params.slug} />
}
