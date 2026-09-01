// Bootstraps src/generated/atlas.json from the migration SQL, for environments
// that cannot reach Supabase. Produces the same shape as scripts/pull-data.mjs.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'

const blocks = (file) => {
  const sql = readFileSync(new URL(`../supabase/migrations/${file}`, import.meta.url), 'utf8')
  return [...sql.matchAll(/\$json\$([\s\S]*?)\$json\$/g)].map((m) => JSON.parse(m[1]))
}

const slug = (name) =>
  name
    .toLowerCase()
    .replace(/[ôóõ]/g, 'o')
    .replace(/[áàãâ]/g, 'a')
    .replace(/[éèê]/g, 'e')
    .replace(/[íì]/g, 'i')
    .replace(/[úùü]/g, 'u')
    .replace(/[çć]/g, 'c')
    .replace(/[ńñ]/g, 'n')
    .replace(/ł/g, 'l')
    .replace(/&/g, '-')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

const withIds = (rows) => rows.map((r, i) => ({ id: i + 1, ...r }))

const [grades, sources] = blocks('0002_seed_reference.sql')
const [countries] = blocks('0003_seed_countries.sql')
const [refineries] = blocks('0004_seed_refineries.sql')

const atlas = {
  pulledAt: new Date().toISOString(),
  regions: [
    { code: 'NA', name: 'North America', color_token: 's1', sort_order: 1 },
    { code: 'LAT', name: 'Latin America', color_token: 's2', sort_order: 2 },
    { code: 'EUR', name: 'Europe', color_token: 's3', sort_order: 3 },
    { code: 'RUS', name: 'Russia & Caspian', color_token: 's4', sort_order: 4 },
    { code: 'ME', name: 'Middle East', color_token: 's5', sort_order: 5 },
    { code: 'AFR', name: 'Africa', color_token: 's6', sort_order: 6 },
    { code: 'APAC', name: 'Asia-Pacific', color_token: 's7', sort_order: 7 },
  ],
  slates: [
    { code: 'sweet', name: 'Light sweet', sort_order: 1 },
    { code: 'mixed', name: 'Mixed / medium', sort_order: 2 },
    { code: 'sour', name: 'Medium sour', sort_order: 3 },
    { code: 'heavy', name: 'Heavy sour', sort_order: 4 },
    { code: 'cond', name: 'Condensate-led', sort_order: 5 },
  ],
  countries: withIds(
    countries.map((c) => ({ ...c, slug: slug(c.name) })).sort((a, b) => b.capacity_kbd - a.capacity_kbd),
  ),
  refineries: withIds(
    refineries.map((r) => ({ ...r, slug: slug(r.name) })).sort((a, b) => b.capacity_kbd - a.capacity_kbd),
  ),
  grades: withIds([...grades].sort((a, b) => b.api_gravity - a.api_gravity)),
  sources: withIds(sources),
}

const out = new URL('../src/generated/', import.meta.url)
mkdirSync(out, { recursive: true })
writeFileSync(new URL('atlas.json', out), JSON.stringify(atlas, null, 2))
console.log(
  `atlas.json: ${atlas.countries.length} countries, ${atlas.refineries.length} refineries, ` +
    `${atlas.grades.length} grades, ${atlas.sources.length} sources`,
)
