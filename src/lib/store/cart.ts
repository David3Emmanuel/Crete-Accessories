import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Product } from '@/lib/strapi/types'

export interface CartItem {
  product: Product
  quantity: number
  variant?: string
}

interface CartStore {
  items: CartItem[]
  drawerOpen: boolean
  openDrawer: () => void
  closeDrawer: () => void
  addItem: (product: Product, variant?: string) => void
  removeItem: (productId: number, variant?: string) => void
  updateQty: (productId: number, quantity: number, variant?: string) => void
  clearCart: () => void
  totalItems: () => number
  subtotal: () => number
}

const key = (productId: number, variant?: string) =>
  variant ? `${productId}::${variant}` : String(productId)

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      drawerOpen: false,
      openDrawer: () => set({ drawerOpen: true }),
      closeDrawer: () => set({ drawerOpen: false }),

      addItem(product, variant) {
        set((state) => {
          const k = key(product.id, variant)
          const existing = state.items.find(
            (i) => key(i.product.id, i.variant) === k,
          )
          if (existing) {
            return {
              items: state.items.map((i) =>
                key(i.product.id, i.variant) === k
                  ? { ...i, quantity: i.quantity + 1 }
                  : i,
              ),
            }
          }
          return { items: [...state.items, { product, quantity: 1, variant }] }
        })
      },

      removeItem(productId, variant) {
        const k = key(productId, variant)
        set((state) => ({
          items: state.items.filter((i) => key(i.product.id, i.variant) !== k),
        }))
      },

      updateQty(productId, quantity, variant) {
        const k = key(productId, variant)
        if (quantity < 1) {
          set((state) => ({
            items: state.items.filter(
              (i) => key(i.product.id, i.variant) !== k,
            ),
          }))
          return
        }
        set((state) => ({
          items: state.items.map((i) =>
            key(i.product.id, i.variant) === k ? { ...i, quantity } : i,
          ),
        }))
      },

      clearCart: () => set({ items: [] }),

      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

      subtotal: () =>
        get().items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),
    }),
    { name: 'crete-cart' },
  ),
)
