import type { MetadataRoute } from 'next'
const host = 'https://research.mahastrategies.com'
export default function robots(): MetadataRoute.Robots { return { rules: { userAgent: '*', allow: '/', disallow: ['/operator/', '/api/'] }, host, sitemap: [`${host}/sitemap-index.xml`, `${host}/sitemap.xml`] } }
