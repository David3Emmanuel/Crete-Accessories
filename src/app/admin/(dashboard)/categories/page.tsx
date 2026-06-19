import { cookies } from 'next/headers'
import CategoriesClient from './CategoriesClient'

async function getCategories(jwt: string) {
  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'
  
  const res = await fetch(`${strapiUrl}/api/categories?populate=image&sort=name:asc`, {
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

export default async function AdminCategoriesPage() {
  const cookieStore = await cookies()
  const jwt = cookieStore.get('jwt')?.value || ''
  
  let categories = []
  try {
    categories = await getCategories(jwt)
  } catch (error) {
    console.error('Error loading categories in admin:', error)
  }

  return <CategoriesClient initialCategories={categories} jwt={jwt} />
}
