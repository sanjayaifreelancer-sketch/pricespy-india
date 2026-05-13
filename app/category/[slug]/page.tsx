import { categories } from '@/lib/utils'
import CategoryClient from './CategoryClient'

export function generateStaticParams() {
  return categories.map(cat => ({ slug: cat.slug }))
}

export default function CategoryPage({ params }: { params: { slug: string } }) {
  return <CategoryClient slug={params.slug} />
}
