import { cookies } from 'next/headers'
import ProductForm from '../ProductForm'

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

export default async function AdminNewProductPage() {
  const cookieStore = await cookies()
  const jwt = cookieStore.get('jwt')?.value || ''
  
  let categories = []
  try {
    categories = await getCategories(jwt)
  } catch (error) {
    console.error('Error loading categories for product form:', error)
  }

  return (
    <ProductForm initialData={null} categories={categories} jwt={jwt} />
  )
}
