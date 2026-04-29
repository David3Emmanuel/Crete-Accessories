import type { Schema } from '@strapi/strapi' // needed for ScalarDoc constraint

// Resolves intersections into a flat object shape — useful for inspecting
// inferred types in your IDE by hovering over Prettify<SomeType>.
export type Prettify<T> = { [K in keyof T]: T[K] } & {}

// ─── Scalar attribute inference ───────────────────────────────────────────────
// Maps Schema.Attribute.* to its JavaScript runtime primitive.
// Relations and components are excluded — override them explicitly per project.

// Match on the `type` discriminant — more reliable than `T extends Schema.Attribute.Xxx`
// because @strapi/types uses Pretty<Intersect<[...]>> internally, which flattens all
// attribute types to plain objects and breaks generic pattern matching.
export type InferAttr<T> = T extends {
  type:
    | 'string'
    | 'text'
    | 'email'
    | 'uid'
    | 'password'
    | 'richtext'
    | 'datetime'
    | 'date'
    | 'time'
    | 'timestamp'
    | 'biginteger'
}
  ? string
  : T extends { type: 'integer' | 'decimal' | 'float' }
    ? number
    : T extends { type: 'boolean' }
      ? boolean
      : T extends { type: 'json' }
        ? unknown
        : T extends { type: 'blocks' }
          ? BlocksNode[]
          : T extends { type: 'enumeration'; enum: infer V extends string[] }
            ? V[number]
            : T extends { type: 'media'; multiple?: infer M }
              ? [M] extends [true]
                ? StrapiMedia[]
                : StrapiMedia | null
              : never

type IsIncluded<T> = T extends {
  type: 'relation' | 'component' | 'dynamiczone'
}
  ? false
  : T extends { private: true }
    ? false
    : InferAttr<T> extends never
      ? false
      : true

// Strip private, relation and component attributes, map the rest to their
// runtime type. Required schema fields become required properties; all others
// are optional since populate depth is variable.
export type ScalarDoc<
  TAttrs extends Record<string, Schema.Attribute.AnyAttribute>,
> = {
  [K in keyof TAttrs as IsIncluded<TAttrs[K]> extends true
    ? TAttrs[K] extends { required: true }
      ? K
      : never
    : never]: InferAttr<TAttrs[K]>
} & {
  [K in keyof TAttrs as IsIncluded<TAttrs[K]> extends true
    ? TAttrs[K] extends { required: true }
      ? never
      : K
    : never]?: InferAttr<TAttrs[K]>
}

// Derives a component type from a Strapi component schema.
export type InferComponent<
  TSchema extends { attributes: Record<string, Schema.Attribute.AnyAttribute> },
> = { id?: number } & ScalarDoc<TSchema['attributes']>

// Derives a full document type from a Strapi schema.
// TOverrides replaces auto-inferred fields and adds relations/components.
// Only the inferred base is prettified — TOverrides values keep their named types.
export type InferDoc<
  TSchema extends { attributes: Record<string, Schema.Attribute.AnyAttribute> },
  TOverrides extends Record<string, unknown> = Record<never, never>,
> = Prettify<
  Omit<StrapiBase & ScalarDoc<TSchema['attributes']>, keyof TOverrides>
> &
  TOverrides

// ─── Strapi base fields ────────────────────────────────────────────────────────

export interface StrapiBase {
  id: number
  documentId: string
  createdAt: string
  updatedAt: string
  publishedAt: string | null
}

// ─── Media ────────────────────────────────────────────────────────────────────

export interface StrapiMediaFormat {
  url: string
  width: number
  height: number
  size: number
  name: string
  hash: string
  ext: string
  mime: string
}

export interface StrapiMedia {
  id: number
  documentId: string
  name: string
  alternativeText: string | null
  caption: string | null
  url: string
  width: number | null
  height: number | null
  formats: {
    thumbnail?: StrapiMediaFormat
    small?: StrapiMediaFormat
    medium?: StrapiMediaFormat
    large?: StrapiMediaFormat
  } | null
  mime: string
  size: number
  ext: string | null
}

// ─── Blocks ───────────────────────────────────────────────────────────────────

export type BlocksNode = {
  type: string
  children?: BlocksNode[]
  text?: string
  url?: string
  level?: number
  format?: string
  [key: string]: unknown
}

// ─── Payload ─────────────────────────────────────────────────────────────────

export type Payload<T> = Omit<T, keyof StrapiBase>

// ─── API response wrappers ────────────────────────────────────────────────────

export interface StrapiListResponse<T> {
  data: T[]
  meta: {
    pagination: {
      page: number
      pageSize: number
      pageCount: number
      total: number
    }
  }
}

export interface StrapiSingleResponse<T> {
  data: T
  meta: Record<string, unknown>
}

export interface StrapiError {
  data: null
  error: {
    status: number
    name: string
    message: string
  }
}
