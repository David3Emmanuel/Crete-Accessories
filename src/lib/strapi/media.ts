const baseURL = process.env.NEXT_PUBLIC_STRAPI_URL ?? 'http://localhost:1337'

export function getStrapiMediaUrl(url: string | null | undefined): string {
  if (!url) return ''
  if (url.startsWith('http')) return url
  return `${baseURL}${url}`
}
