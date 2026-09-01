// Writes dist/sitemap.xml from the data snapshot, after the Vite build.
import { readFileSync, writeFileSync } from 'node:fs'

const origin = process.env.SITE_ORIGIN ?? 'https://crude-slate-atlas.pages.dev'
const atlas = JSON.parse(readFileSync(new URL('../src/generated/atlas.json', import.meta.url), 'utf8'))

const paths = [
  '/',
  '/atlas',
  '/regions',
  '/refineries',
  '/methodology',
  ...atlas.regions.map((r) => `/regions/${r.code.toLowerCase()}`),
  ...atlas.refineries.map((r) => `/refineries/${r.slug}`),
  ...atlas.countries.map((c) => `/countries/${c.slug}`),
]

const today = new Date().toISOString().slice(0, 10)
const body = paths
  .map((p) => `  <url><loc>${origin}${p}</loc><lastmod>${today}</lastmod></url>`)
  .join('\n')

writeFileSync(
  new URL('../dist/sitemap.xml', import.meta.url),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`,
)

console.log(`sitemap.xml: ${paths.length} urls`)
