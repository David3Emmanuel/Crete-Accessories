'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getStrapiMediaUrl } from '@/lib/strapi/media'
import { 
  Plus, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  AlertCircle,
  CheckCircle,
  Info,
  ChevronRight,
  Package,
  Image as ImageIcon
} from 'lucide-react'

interface Category {
  id: number
  name: string
}

interface Product {
  id: number
  documentId?: string
  name: string
  slug: string
  price: number
  category?: Category | null
  images?: Array<{
    id: number
    url: string
  }> | null
  badge?: string | null
  inStock: boolean
  stockCount: number
}

interface ProductsClientProps {
  initialProducts: Product[]
  categories: Category[]
  jwt: string
}

export default function ProductsClient({ initialProducts, categories, jwt }: ProductsClientProps) {
  const router = useRouter()
  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'

  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedStockStatus, setSelectedStockStatus] = useState<string>('all')
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [loadingId, setLoadingId] = useState<number | null>(null)

  const formatter = new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0
  })

  const handleDelete = async (product: Product) => {
    if (!confirm(`Are you sure you want to delete "${product.name}"? This action cannot be undone.`)) {
      return
    }

    setLoadingId(product.id)
    setErrorMsg('')
    setSuccessMsg('')

    try {
      const identifier = product.documentId || product.id
      const res = await fetch(`${strapiUrl}/api/products/${identifier}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      })

      if (!res.ok) {
        const responseData = await res.json()
        throw new Error(responseData.error?.message || 'Failed to delete product')
      }

      setProducts(products.filter((p) => p.id !== product.id))
      setSuccessMsg(`Product "${product.name}" deleted successfully.`)
      router.refresh()
    } catch (err: any) {
      setErrorMsg(err.message || 'Error occurred while deleting')
    } finally {
      setLoadingId(null)
    }
  }

  // Filtering Logic
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      product.slug.toLowerCase().includes(searchTerm.toLowerCase())
    
    // Category match: product.category could be an object or a string depending on response shape. 
    // In Strapi populate category, it's typically { id, name, ... }.
    const productCategoryName = product.category?.name || ''
    const matchesCategory = selectedCategory === 'all' || productCategoryName === selectedCategory

    let matchesStock = true
    if (selectedStockStatus === 'low') {
      matchesStock = product.stockCount !== undefined && product.stockCount > 0 && product.stockCount <= 5
    } else if (selectedStockStatus === 'out') {
      matchesStock = product.stockCount === 0 || !product.inStock
    } else if (selectedStockStatus === 'in') {
      matchesStock = product.stockCount > 5
    }

    return matchesSearch && matchesCategory && matchesStock
  })

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl text-on-surface tracking-wide">Products</h1>
          <p className="text-on-surface/50 text-sm mt-1">Manage your shop inventory, pricing, and visual details.</p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 bg-primary hover:bg-primary-container text-on-primary text-sm font-medium px-4 py-2.5 rounded-xl transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Product</span>
        </Link>
      </div>

      {successMsg && (
        <div className="p-4 bg-green-950/40 border border-green-500/30 rounded-xl text-green-300 text-sm">
          {successMsg}
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-red-950/40 border border-red-500/30 rounded-xl text-red-300 text-sm">
          {errorMsg}
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-surface-base border border-surface-container/60 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center">
        {/* Search Input */}
        <div className="relative w-full md:flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface/40" />
          <input
            type="text"
            placeholder="Search by product name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-surface-dim/80 border border-surface-container rounded-xl text-sm text-on-surface placeholder:text-on-surface/30 focus:outline-none focus:border-primary/50 transition-colors"
          />
        </div>

        {/* Category Dropdown */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-on-surface/40 flex-shrink-0" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full md:w-48 px-3 py-2 bg-surface-dim/80 border border-surface-container rounded-xl text-xs text-on-surface focus:outline-none focus:border-primary/50 transition-colors"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Stock Status Dropdown */}
        <div className="w-full md:w-auto">
          <select
            value={selectedStockStatus}
            onChange={(e) => setSelectedStockStatus(e.target.value)}
            className="w-full md:w-48 px-3 py-2 bg-surface-dim/80 border border-surface-container rounded-xl text-xs text-on-surface focus:outline-none focus:border-primary/50 transition-colors"
          >
            <option value="all">All Stock Levels</option>
            <option value="in">Well Stocked (&gt; 5)</option>
            <option value="low">Low Stock (1-5)</option>
            <option value="out">Out of Stock</option>
          </select>
        </div>
      </div>

      {/* Products Table Card */}
      <div className="bg-surface-base border border-surface-container/60 rounded-2xl overflow-hidden">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 text-on-surface/40">
            <Package className="w-12 h-12 text-on-surface/20 mx-auto mb-3" />
            <p className="text-sm font-medium">No products match your criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-surface-container/60 text-xs text-on-surface/40 uppercase font-semibold">
                  <th className="p-4 pl-6">Product</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Stock</th>
                  <th className="p-4">Badge</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container/30 text-sm">
                {filteredProducts.map((p) => {
                  const firstImgUrl = p.images?.[0]?.url 
                    ? getStrapiMediaUrl(p.images[0].url) 
                    : null

                  // Stock styling
                  const isOutOfStock = p.stockCount === 0 || !p.inStock
                  const isLowStock = !isOutOfStock && p.stockCount <= 5
                  
                  return (
                    <tr key={p.id} className="group hover:bg-surface-container/10 transition-colors">
                      <td className="p-4 pl-6 flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-surface-container overflow-hidden flex-shrink-0 border border-surface-high flex items-center justify-center">
                          {firstImgUrl ? (
                            <img src={firstImgUrl} alt={p.name} className="w-full h-full object-cover" />
                          ) : (
                            <ImageIcon className="w-5 h-5 text-on-surface/30" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-semibold text-on-surface/90 truncate max-w-xs">{p.name}</h4>
                          <span className="text-xs text-on-surface/40 block truncate max-w-xs">{p.slug}</span>
                        </div>
                      </td>
                      
                      <td className="p-4">
                        {p.category ? (
                          <span className="text-xs border border-surface-container rounded px-2.5 py-1 text-on-surface/75 bg-surface-dim/40">
                            {p.category.name}
                          </span>
                        ) : (
                          <span className="text-xs text-on-surface/30 italic">Uncategorized</span>
                        )}
                      </td>

                      <td className="p-4 font-semibold">
                        {formatter.format(p.price)}
                      </td>

                      <td className="p-4">
                        {isOutOfStock ? (
                          <span className="inline-flex items-center gap-1 text-xs text-red-400 font-semibold bg-red-950/20 px-2 py-0.5 rounded">
                            <AlertCircle className="w-3 h-3" />
                            <span>Out of Stock</span>
                          </span>
                        ) : isLowStock ? (
                          <span className="inline-flex items-center gap-1 text-xs text-amber-400 font-semibold bg-amber-950/20 px-2 py-0.5 rounded">
                            <AlertCircle className="w-3 h-3" />
                            <span>{p.stockCount} left</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs text-green-400 font-semibold bg-green-950/20 px-2 py-0.5 rounded">
                            <CheckCircle className="w-3 h-3" />
                            <span>{p.stockCount} in stock</span>
                          </span>
                        )}
                      </td>

                      <td className="p-4">
                        {p.badge ? (
                          <span className="text-xs px-2 py-0.5 bg-primary/10 border border-primary/20 text-primary font-medium rounded-full uppercase tracking-wider">
                            {p.badge}
                          </span>
                        ) : (
                          <span className="text-xs text-on-surface/30">-</span>
                        )}
                      </td>

                      <td className="p-4 pr-6 text-right">
                        <div className="flex justify-end gap-2.5">
                          <Link
                            href={`/admin/products/${p.id}`}
                            className="p-2 border border-surface-container rounded-lg text-on-surface/60 hover:text-primary hover:border-primary/30 transition-all bg-surface-dim/40"
                          >
                            <Edit3 className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(p)}
                            disabled={loadingId === p.id}
                            className="p-2 border border-surface-container rounded-lg text-on-surface/60 hover:text-red-400 hover:border-red-900/30 transition-all bg-surface-dim/40 disabled:opacity-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
