/* eslint-disable @typescript-eslint/no-empty-object-type */

import type {
  ApiCategoryCategory,
  ApiOrderItemOrderItem,
  ApiOrderOrder,
  ApiProductProduct,
} from '@/types/strapi/contentTypes'
import type { InferComponent, InferDoc, StrapiMedia } from './utils'
import type {
  OrderDeliveryAddress,
  ProductSpecification,
  ProductVariant,
} from '@/types/strapi/components'

export type {
  BlocksNode,
  InferComponent,
  InferDoc,
  Prettify,
  ScalarDoc,
  StrapiBase,
  StrapiError,
  StrapiListResponse,
  StrapiMedia,
  StrapiMediaFormat,
  StrapiSingleResponse,
} from './utils'

// ─── Components ───────────────────────────────────────────────────────────────

export interface Specification extends InferComponent<ProductSpecification> {}
export interface Variant extends InferComponent<ProductVariant> {}
export interface DeliveryAddress extends InferComponent<OrderDeliveryAddress> {}

// ─── Content types ────────────────────────────────────────────────────────────

export interface Category extends InferDoc<
  ApiCategoryCategory,
  { image: StrapiMedia | null }
> {}

export interface Product extends InferDoc<
  ApiProductProduct,
  {
    images: StrapiMedia[]
    category: Category | null
    specifications: Specification[]
    variants: Variant[]
  }
> {}

export interface OrderItem extends InferDoc<
  ApiOrderItemOrderItem,
  { product: Product | null }
> {}

export interface Order extends InferDoc<
  ApiOrderOrder,
  {
    deliveryAddress: DeliveryAddress
    items: OrderItem[]
  }
> {}
