import { strapi } from '@strapi/client'

const baseURL = `${process.env.NEXT_PUBLIC_STRAPI_URL ?? 'http://localhost:1337'}/api`

// Server-side client — uses the full-access API token (never sent to the browser)
export const strapiServer = strapi({
  baseURL,
  auth: process.env.STRAPI_API_TOKEN,
})

// Browser-safe client — unauthenticated, for public read-only endpoints
export const strapiPublic = strapi({ baseURL })
