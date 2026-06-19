import { cookies } from 'next/headers'
import OrdersClient from './OrdersClient'

async function getOrders(jwt: string) {
  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'
  
  // Fetch orders populating items, product details, images and delivery address
  const res = await fetch(
    `${strapiUrl}/api/orders?populate[0]=items&populate[1]=items.product&populate[2]=items.product.images&populate[3]=deliveryAddress&sort=createdAt:desc&pagination[limit]=100`,
    {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
      cache: 'no-store',
    }
  )

  if (!res.ok) {
    throw new Error('Failed to fetch orders')
  }

  const data = await res.json()
  return data?.data || []
}

export default async function AdminOrdersPage() {
  const cookieStore = await cookies()
  const jwt = cookieStore.get('jwt')?.value || ''
  
  let orders = []
  try {
    orders = await getOrders(jwt)
  } catch (error) {
    console.error('Error loading orders in admin:', error)
  }

  return (
    <OrdersClient initialOrders={orders} jwt={jwt} />
  )
}
