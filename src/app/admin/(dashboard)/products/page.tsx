import { cookies } from 'next/headers'
import ProductsClient from './ProductsClient'

async function getProductsData(jwt: string) {
  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'

  // Fetch products
  const productsRes = await fetch(
    `${strapiUrl}/api/products?populate[0]=images&populate[1]=category&sort=createdAt:desc&pagination[limit]=100`,
    {
      headers: { Authorization: `Bearer ${jwt}` },
      cache: 'no-store',
    }
  )

  if (!productsRes.ok) {
    throw new Error('Failed to fetch products')
  }

  // Fetch categories for filters
  const categoriesRes = await fetch(
    `${strapiUrl}/api/categories?sort=name:asc&pagination[limit]=100`,
    {
      headers: { Authorization: `Bearer ${jwt}` },
      cache: 'no-store',
    }
  )

  if (!categoriesRes.ok) {
    throw new Error('Failed to fetch categories')
  }

  const productsData = await productsRes.json()
  const categoriesData = await categoriesRes.json()

  return {
    products: productsData?.data || [],
    categories: categoriesData?.data || [],
  }
}

export default async function AdminProductsPage() {
  const cookieStore = await cookies()
  const jwt = cookieStore.get('jwt')?.value || ''
  
  let products = []
  let categories = []
  
  try {
    const data = await getDashboardDataWithFallback(jwt)
    products = data.products
    categories = data.categories
  } catch (error) {
    console.error('Error loading products list:', error)
  }

  return <ProductsClient initialProducts={products} categories={categories} jwt={jwt} />
}

async function getDashboardDataWithFallback(jwt: string) {
  try {
    return await getProductsData(jwt)
  } catch {
    return { products: [], categories: [] }
  }
}
