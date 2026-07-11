import { cookies } from 'next/headers'
import { connection } from 'next/server'
import ProductForm from '../ProductForm'

interface PageProps {
  params: Promise<{ id: string }>
}

async function getCategories(jwt: string) {
  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'
  
  const res = await fetch(`${strapiUrl}/api/categories?sort=name:asc&pagination[limit]=100`, {
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
    cache: 'no-store',
  })

  if (!res.ok) {
    throw new Error('Failed to fetch categories')
  }

  const data = await res.json()
  return data?.data || []
}

async function getProduct(id: string, jwt: string) {
  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'
  
  const res = await fetch(`${strapiUrl}/api/products/${id}?populate=*`, {
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
    cache: 'no-store',
  })

  if (!res.ok) {
    throw new Error(`Failed to fetch product with ID ${id}`)
  }

  const data = await res.json()
  return data?.data || null
}

export async function generateStaticParams() {
  return [{ id: '1' }]
}

export default async function AdminEditProductPage({ params }: PageProps) {
  await connection()
  const { id } = await params
  const cookieStore = await cookies()
  const jwt = cookieStore.get('jwt')?.value || ''
  
  let categories = []
  let product = null
  
  try {
    categories = await getCategories(jwt)
    product = await getProduct(id, jwt)
  } catch (error) {
    console.error('Error loading edit product page details:', error)
  }

  if (!product) {
    return (
      <div className="text-center py-20 bg-surface-base border border-surface-container rounded-2xl">
        <h2 className="text-xl font-semibold text-red-400">Product Not Found</h2>
        <p className="text-on-surface/50 text-sm mt-2">The product you are trying to edit could not be loaded.</p>
      </div>
    )
  }

  // Map Strapi's payload structure to form-ready payload structure
  const formReadyData = {
    id: product.id,
    documentId: product.documentId,
    name: product.name,
    slug: product.slug,
    price: product.price,
    description: product.description || '',
    badge: product.badge || '',
    material: product.material || '',
    specifications: product.specifications || [],
    variants: product.variants || [],
    inStock: product.inStock !== false,
    stockCount: product.stockCount !== undefined ? product.stockCount : 10,
    isLimitedEdition: !!product.isLimitedEdition,
    category: product.category ? { id: product.category.id } : null,
    images: product.images || []
  }

  return (
    <ProductForm initialData={formReadyData} categories={categories} jwt={jwt} />
  )
}
