'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { getStrapiMediaUrl } from '@/lib/strapi/media'
import { 
  Search, 
  Filter, 
  ShoppingBag, 
  MapPin, 
  Mail, 
  Phone, 
  Calendar, 
  CreditCard, 
  TrendingUp, 
  Clipboard,
  CheckCircle,
  Truck,
  XCircle,
  Clock,
  Loader2,
  Image as ImageIcon
} from 'lucide-react'

interface Product {
  id: number
  name: string
  images?: Array<{ url: string }> | null
}

interface OrderItem {
  id: number
  quantity: number
  priceAtPurchase: number
  variant?: string | null
  product?: Product | null
}

interface DeliveryAddress {
  name: string
  phone: string
  address: string
  state: string
  city: string
}

interface Order {
  id: number
  documentId?: string
  orderNumber: string
  subtotal: number
  shipping: number
  vat: number
  total: number
  paystackReference?: string | null
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled'
  deliveryAddress: DeliveryAddress
  guestEmail?: string | null
  createdAt: string
}

interface OrdersClientProps {
  initialOrders: Order[]
  jwt: string
}

export default function OrdersClient({ initialOrders, jwt }: OrdersClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'

  const [orders, setOrders] = useState<Order[]>(initialOrders)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  
  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  
  // Action status
  const [updating, setUpdating] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  // Handle URL query param for selecting an order (e.g. from Dashboard stock or recent list)
  useEffect(() => {
    const orderId = searchParams.get('id')
    if (orderId) {
      const match = orders.find(o => o.id.toString() === orderId)
      if (match) {
        setSelectedOrder(match)
      }
    } else if (orders.length > 0 && !selectedOrder) {
      setSelectedOrder(orders[0])
    }
  }, [searchParams, orders])

  const formatter = new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0
  })

  // Filter orders
  const filteredOrders = orders.filter((o) => {
    const searchString = `${o.orderNumber || ''} ${o.deliveryAddress?.name || ''} ${o.guestEmail || ''}`.toLowerCase()
    const matchesSearch = searchString.includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleStatusChange = async (newStatus: string) => {
    if (!selectedOrder) return

    setUpdating(true)
    setErrorMsg('')
    setSuccessMsg('')

    try {
      const identifier = selectedOrder.documentId || selectedOrder.id
      const res = await fetch(`${strapiUrl}/api/orders/${identifier}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({
          data: { status: newStatus }
        })
      })

      const responseData = await res.json()

      if (!res.ok) {
        throw new Error(responseData.error?.message || 'Failed to update order status')
      }

      // Update state locally
      const updatedOrder = {
        ...selectedOrder,
        status: newStatus as any
      }

      setOrders(orders.map(o => o.id === selectedOrder.id ? updatedOrder : o))
      setSelectedOrder(updatedOrder)
      setSuccessMsg(`Order status successfully changed to "${newStatus}".`)
      
      router.refresh()
    } catch (err: any) {
      setErrorMsg(err.message || 'Error occurred while updating status')
    } finally {
      setUpdating(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert(`Copied: ${text}`)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle className="w-4 h-4 text-green-400" />
      case 'shipped': return <Truck className="w-4 h-4 text-blue-400" />
      case 'delivered': return <CheckCircle className="w-4 h-4 text-emerald-400" />
      case 'cancelled': return <XCircle className="w-4 h-4 text-red-400" />
      default: return <Clock className="w-4 h-4 text-amber-400" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="font-serif text-3xl text-on-surface tracking-wide">Orders</h1>
        <p className="text-on-surface/50 text-sm mt-1">Review transaction history, fulfill shipments, and update order statuses.</p>
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

      {/* Main Panel Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Order List (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Filters card */}
          <div className="bg-surface-base border border-surface-container/60 rounded-2xl p-4 space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface/40" />
              <input
                type="text"
                placeholder="Search by name, email, or order ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-surface-dim/80 border border-surface-container rounded-xl text-xs text-on-surface focus:outline-none focus:border-primary/50"
              />
            </div>
            
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 bg-surface-dim/80 border border-surface-container rounded-xl text-xs text-on-surface focus:outline-none"
              >
                <option value="all">All Fulfillment Statuses</option>
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* List Card */}
          <div className="bg-surface-base border border-surface-container/60 rounded-2xl p-4 space-y-2 max-h-[600px] overflow-y-auto">
            {filteredOrders.length === 0 ? (
              <div className="text-center py-16 text-on-surface/30">
                <ShoppingBag className="w-12 h-12 text-on-surface/10 mx-auto mb-3" />
                <p className="text-sm">No orders found.</p>
              </div>
            ) : (
              filteredOrders.map((order) => {
                const isSelected = selectedOrder?.id === order.id
                
                return (
                  <button
                    key={order.id}
                    onClick={() => {
                      setSelectedOrder(order)
                      setErrorMsg('')
                      setSuccessMsg('')
                    }}
                    className={`w-full text-left p-3.5 border rounded-xl transition-all flex flex-col gap-2 ${
                      isSelected 
                        ? 'bg-primary/10 border-primary text-primary' 
                        : 'bg-surface-dim/40 border-surface-container hover:bg-surface-container/30'
                    }`}
                  >
                    <div className="flex justify-between items-center w-full">
                      <span className="font-semibold text-sm text-primary">#{order.orderNumber || order.id}</span>
                      <span className="text-xs text-on-surface/40">
                        {new Date(order.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>

                    <div className="flex justify-between items-center w-full text-xs">
                      <span className="text-on-surface/80 truncate max-w-[160px]">
                        {order.deliveryAddress?.name || order.guestEmail || 'Guest Customer'}
                      </span>
                      <span className="font-semibold text-on-surface">{formatter.format(order.total)}</span>
                    </div>

                    <div className="flex items-center gap-1.5 mt-1 text-[11px] font-medium">
                      {getStatusIcon(order.status)}
                      <span className="capitalize">{order.status}</span>
                    </div>
                  </button>
                )
              })
            )}
          </div>
        </div>

        {/* Right Side: Order Detail Inspector (7 cols) */}
        <div className="lg:col-span-7 bg-surface-base border border-surface-container/60 rounded-2xl p-6">
          {!selectedOrder ? (
            <div className="h-[480px] flex flex-col items-center justify-center text-center text-on-surface/40 border border-dashed border-surface-container/80 rounded-xl">
              <ShoppingBag className="w-12 h-12 mb-3 text-on-surface/20" />
              <p className="text-sm font-medium">Select an order from the list to inspect details.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Order Inspector Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-surface-container/60 pb-4">
                <div>
                  <h3 className="font-serif text-xl font-semibold text-primary">
                    Order #{selectedOrder.orderNumber || selectedOrder.id}
                  </h3>
                  <p className="text-xs text-on-surface/40 mt-1 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Plated at: {new Date(selectedOrder.createdAt).toLocaleString()}</span>
                  </p>
                </div>

                {/* Status Dropdown Controller */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-on-surface/50 font-semibold uppercase">Fulfillment:</span>
                  <div className="relative">
                    {updating && (
                      <div className="absolute inset-y-0 right-8 flex items-center">
                        <Loader2 className="w-4 h-4 animate-spin text-primary" />
                      </div>
                    )}
                    <select
                      value={selectedOrder.status}
                      disabled={updating}
                      onChange={(e) => handleStatusChange(e.target.value)}
                      className="px-3 py-1.5 bg-surface-dim border border-surface-container rounded-lg text-xs font-semibold text-on-surface focus:outline-none"
                    >
                      <option value="pending">Pending</option>
                      <option value="paid">Paid</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Delivery Address & Customer Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Shipping Card */}
                <div className="bg-surface-dim/40 border border-surface-container p-4 rounded-xl space-y-3">
                  <h4 className="text-xs font-semibold text-primary uppercase tracking-wider flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Shipping Address</span>
                  </h4>
                  <div className="text-xs space-y-1 text-on-surface/80">
                    <p className="font-bold text-on-surface text-sm">{selectedOrder.deliveryAddress?.name}</p>
                    <p>{selectedOrder.deliveryAddress?.address}</p>
                    <p>{selectedOrder.deliveryAddress?.city}, {selectedOrder.deliveryAddress?.state}</p>
                  </div>
                </div>

                {/* Contact Card */}
                <div className="bg-surface-dim/40 border border-surface-container p-4 rounded-xl space-y-3">
                  <h4 className="text-xs font-semibold text-primary uppercase tracking-wider flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5" />
                    <span>Customer Contacts</span>
                  </h4>
                  <div className="text-xs space-y-2 text-on-surface/80">
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-on-surface/30" />
                      <span className="truncate">{selectedOrder.guestEmail || 'Registered user email'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-on-surface/30" />
                      <span>{selectedOrder.deliveryAddress?.phone || 'No phone provided'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Items Table */}
              <div className="border border-surface-container rounded-xl overflow-hidden">
                <div className="bg-surface-dim/40 px-4 py-2 border-b border-surface-container text-xs font-semibold text-on-surface/50 uppercase">
                  Purchased Items
                </div>
                <div className="p-2 space-y-2">
                  {/* Items loop */}
                  {/* In Strapi populates, if `items` is empty, handle gracefully */}
                  {!(selectedOrder as any).items || (selectedOrder as any).items.length === 0 ? (
                    <div className="text-center py-6 text-xs text-on-surface/40 italic">
                      No products details attached.
                    </div>
                  ) : (
                    (selectedOrder as any).items.map((item: OrderItem) => {
                      const itemImg = item.product?.images?.[0]?.url 
                        ? getStrapiMediaUrl(item.product.images[0].url) 
                        : null
                      
                      return (
                        <div 
                          key={item.id} 
                          className="flex items-center justify-between p-2 hover:bg-surface-container/20 rounded-lg transition-colors text-xs"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-10 h-10 rounded bg-surface-dim overflow-hidden border border-surface-container flex items-center justify-center flex-shrink-0">
                              {itemImg ? (
                                <img src={itemImg} alt="Thumbnail" className="w-full h-full object-cover" />
                              ) : (
                                <ImageIcon className="w-4 h-4 text-on-surface/20" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <h5 className="font-semibold text-on-surface truncate">{item.product?.name || 'Deleted Product'}</h5>
                              {item.variant && (
                                <p className="text-[10px] text-on-surface/40 mt-0.5">Variant: {item.variant}</p>
                              )}
                            </div>
                          </div>

                          <div className="text-right whitespace-nowrap">
                            <p className="font-medium">{formatter.format(item.priceAtPurchase)} × {item.quantity}</p>
                            <p className="text-[10px] text-primary/75 mt-0.5 font-bold">
                              {formatter.format(item.priceAtPurchase * item.quantity)}
                            </p>
                          </div>
                        </div>
                      )
                    })
                  )}
                </div>
              </div>

              {/* Totals Summary Column */}
              <div className="bg-surface-dim/40 border border-surface-container rounded-xl p-4 text-xs space-y-2">
                <div className="flex justify-between text-on-surface/60">
                  <span>Subtotal</span>
                  <span>{formatter.format(selectedOrder.subtotal)}</span>
                </div>
                <div className="flex justify-between text-on-surface/60">
                  <span>Shipping Fee</span>
                  <span>{formatter.format(selectedOrder.shipping)}</span>
                </div>
                <div className="flex justify-between text-on-surface/60">
                  <span>VAT (7.5%)</span>
                  <span>{formatter.format(selectedOrder.vat)}</span>
                </div>
                <div className="flex justify-between border-t border-surface-container/60 pt-2 font-semibold text-sm text-on-surface">
                  <span>Order Total</span>
                  <span className="text-primary">{formatter.format(selectedOrder.total)}</span>
                </div>
              </div>

              {/* Payment Details Section */}
              <div className="bg-surface-dim/40 border border-surface-container rounded-xl p-4 space-y-3">
                <h4 className="text-xs font-semibold text-primary uppercase tracking-wider flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Payment Information</span>
                </h4>
                
                <div className="text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="space-y-1">
                    <p className="text-on-surface/60">Paystack Transaction Reference:</p>
                    <p className="font-semibold text-on-surface/90 font-mono">
                      {selectedOrder.paystackReference || 'None (Created manually or draft)'}
                    </p>
                  </div>
                  {selectedOrder.paystackReference && (
                    <button
                      type="button"
                      onClick={() => copyToClipboard(selectedOrder.paystackReference!)}
                      className="flex items-center gap-1 px-2.5 py-1 rounded bg-surface-container border border-surface-high hover:border-primary/20 text-on-surface/80 hover:text-primary transition-all self-start sm:self-auto"
                    >
                      <Clipboard className="w-3 h-3" />
                      <span>Copy Ref</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
