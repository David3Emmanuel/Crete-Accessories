import { cookies } from 'next/headers'
import Link from 'next/link'
import { 
  TrendingUp, 
  ShoppingBag, 
  Package, 
  AlertTriangle,
  ArrowRight,
  Plus,
  RefreshCw,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  DollarSign
} from 'lucide-react'

async function getDashboardData(jwt: string) {
  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'

  // Fetch all orders
  const ordersRes = await fetch(`${strapiUrl}/api/orders?sort=createdAt:desc&pagination[limit]=100`, {
    headers: { Authorization: `Bearer ${jwt}` },
    cache: 'no-store'
  })
  const ordersData = await ordersRes.json()

  // Fetch all products
  const productsRes = await fetch(`${strapiUrl}/api/products?pagination[limit]=100`, {
    headers: { Authorization: `Bearer ${jwt}` },
    cache: 'no-store'
  })
  const productsData = await productsRes.json()

  // Fetch categories
  const categoriesRes = await fetch(`${strapiUrl}/api/categories?pagination[limit]=100`, {
    headers: { Authorization: `Bearer ${jwt}` },
    cache: 'no-store'
  })
  const categoriesData = await categoriesRes.json()

  return {
    orders: ordersData?.data || [],
    products: productsData?.data || [],
    categoriesCount: categoriesData?.meta?.pagination?.total || categoriesData?.data?.length || 0
  }
}

export default async function AdminDashboardPage() {
  const cookieStore = await cookies()
  const jwt = cookieStore.get('jwt')?.value || ''
  
  let data = { orders: [], products: [], categoriesCount: 0 }
  let errorMsg = ''
  
  try {
    data = await getDashboardData(jwt)
  } catch (err: any) {
    console.error('Error fetching dashboard data:', err)
    errorMsg = 'Failed to fetch dashboard data. Please make sure the Strapi server is running.'
  }

  const { orders, products, categoriesCount } = data

  // Stats calculation
  const totalOrders = orders.length
  const recentOrders = orders.slice(0, 5)

  // Revenue is sum of orders that are 'paid', 'shipped', or 'delivered'
  const revenue = orders
    .filter((o: any) => ['paid', 'shipped', 'delivered'].includes(o.status))
    .reduce((acc: number, o: any) => acc + (Number(o.total) || 0), 0)

  const pendingOrders = orders.filter((o: any) => o.status === 'pending').length
  const paidOrders = orders.filter((o: any) => o.status === 'paid').length
  const shippedOrders = orders.filter((o: any) => o.status === 'shipped').length
  const deliveredOrders = orders.filter((o: any) => o.status === 'delivered').length
  const cancelledOrders = orders.filter((o: any) => o.status === 'cancelled').length

  const totalProducts = products.length
  const lowStockProducts = products.filter((p: any) => p.stockCount !== undefined && p.stockCount <= 5).map((p: any) => ({
    id: p.id,
    name: p.name,
    stockCount: p.stockCount,
    slug: p.slug
  }))

  const formatter = new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0
  })

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl text-on-surface tracking-wide">Overview</h1>
          <p className="text-on-surface/50 text-sm mt-1">Real-time statistics and summary of your store.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/products/new"
            className="flex items-center gap-2 bg-primary hover:bg-primary-container text-on-primary text-sm font-medium px-4 py-2.5 rounded-xl transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </Link>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 bg-red-950/40 border border-red-500/30 rounded-xl text-red-300 text-sm">
          {errorMsg}
        </div>
      )}

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Revenue */}
        <div className="bg-surface-base border border-surface-container/60 p-6 rounded-2xl relative overflow-hidden group hover:border-primary/30 transition-all duration-300">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <DollarSign className="w-24 h-24 text-primary" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-on-surface/50">Total Revenue</span>
            <span className="p-2 bg-primary/10 rounded-lg text-primary">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-semibold text-on-surface tracking-tight">{formatter.format(revenue)}</h3>
            <p className="text-xs text-on-surface/40 mt-1">From completed & paid sales</p>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-surface-base border border-surface-container/60 p-6 rounded-2xl relative overflow-hidden group hover:border-primary/30 transition-all duration-300">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <ShoppingBag className="w-24 h-24 text-primary" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-on-surface/50">Total Orders</span>
            <span className="p-2 bg-primary/10 rounded-lg text-primary">
              <ShoppingBag className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-semibold text-on-surface tracking-tight">{totalOrders}</h3>
            <p className="text-xs text-on-surface/40 mt-1">{pendingOrders} pending fulfillment</p>
          </div>
        </div>

        {/* Total Products */}
        <div className="bg-surface-base border border-surface-container/60 p-6 rounded-2xl relative overflow-hidden group hover:border-primary/30 transition-all duration-300">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Package className="w-24 h-24 text-primary" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-on-surface/50">Products</span>
            <span className="p-2 bg-primary/10 rounded-lg text-primary">
              <Package className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-semibold text-on-surface tracking-tight">{totalProducts}</h3>
            <p className="text-xs text-on-surface/40 mt-1">Across {categoriesCount} categories</p>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-surface-base border border-surface-container/60 p-6 rounded-2xl relative overflow-hidden group hover:border-primary/30 transition-all duration-300">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <AlertTriangle className="w-24 h-24 text-red-500" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-on-surface/50">Stock Alerts</span>
            <span className={`p-2 rounded-lg ${lowStockProducts.length > 0 ? 'bg-red-500/10 text-red-400' : 'bg-green-500/10 text-green-400'}`}>
              <AlertTriangle className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-semibold text-on-surface tracking-tight">{lowStockProducts.length}</h3>
            <p className="text-xs text-on-surface/40 mt-1">Products running low (≤ 5)</p>
          </div>
        </div>
      </div>

      {/* Main Grid: Orders & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Recent Orders List */}
        <div className="lg:col-span-2 bg-surface-base border border-surface-container/60 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-serif text-on-surface tracking-wide">Recent Orders</h2>
              <Link 
                href="/admin/orders" 
                className="text-xs text-primary hover:underline flex items-center gap-1"
              >
                <span>View All</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {recentOrders.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-surface-container rounded-xl">
                <ShoppingBag className="w-10 h-10 text-on-surface/20 mx-auto mb-3" />
                <p className="text-sm text-on-surface/50">No orders placed yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-surface-container/60 text-xs text-on-surface/40 uppercase font-medium">
                      <th className="pb-3">Order No.</th>
                      <th className="pb-3">Customer</th>
                      <th className="pb-3">Total</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3 text-right">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-container/30 text-sm">
                    {recentOrders.map((order: any) => (
                      <tr key={order.id} className="group hover:bg-surface-container/20 transition-colors">
                        <td className="py-3.5 font-medium text-primary">
                          <Link href={`/admin/orders?id=${order.id}`} className="hover:underline">
                            #{order.orderNumber || order.id}
                          </Link>
                        </td>
                        <td className="py-3.5 text-on-surface/80">
                          {order.deliveryAddress?.name || order.guestEmail || 'Guest Customer'}
                        </td>
                        <td className="py-3.5 font-medium">{formatter.format(order.total)}</td>
                        <td className="py-3.5">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            order.status === 'paid' ? 'bg-green-500/10 text-green-400' :
                            order.status === 'shipped' ? 'bg-blue-500/10 text-blue-400' :
                            order.status === 'delivered' ? 'bg-emerald-500/10 text-emerald-400' :
                            order.status === 'cancelled' ? 'bg-red-500/10 text-red-400' :
                            'bg-amber-500/10 text-amber-400' // pending
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="py-3.5 text-right text-on-surface/40 text-xs">
                          {new Date(order.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric'
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Stock Alerts Column */}
        <div className="bg-surface-base border border-surface-container/60 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-serif text-on-surface tracking-wide mb-6">Stock Alerts</h2>
            
            {lowStockProducts.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-surface-container rounded-xl">
                <CheckCircle className="w-10 h-10 text-green-500/30 mx-auto mb-3" />
                <p className="text-sm text-green-400/80">All items are in stock!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {lowStockProducts.map((p: any) => (
                  <div 
                    key={p.id} 
                    className="flex items-center justify-between p-3.5 bg-surface-dim/40 border border-surface-container rounded-xl hover:border-red-500/20 transition-all"
                  >
                    <div className="min-w-0">
                      <h4 className="text-sm font-medium truncate text-on-surface/90">{p.name}</h4>
                    </div>
                    <div className="text-right flex flex-col items-end">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                        p.stockCount === 0 ? 'bg-red-950 text-red-400' : 'bg-amber-950 text-amber-400'
                      }`}>
                        {p.stockCount} left
                      </span>
                      <Link 
                        href={`/admin/products/${p.id}`} 
                        className="text-[10px] text-primary hover:underline mt-1.5 flex items-center gap-0.5"
                      >
                        Restock
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {lowStockProducts.length > 0 && (
            <Link
              href="/admin/products"
              className="mt-6 w-full text-center py-2.5 border border-surface-container hover:border-primary/30 rounded-xl text-xs text-on-surface/60 hover:text-primary transition-all block"
            >
              Manage Inventory
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
