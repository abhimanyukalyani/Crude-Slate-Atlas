// Pulls the dataset out of Supabase into src/generated/atlas.json, which the
// site imports directly. Run it whenever the database changes; the build uses
// the committed snapshot so a deploy never depends on the database being up.
import { mkdirSync, writeFileSync } from 'node:fs'
import { createClient } from '@supabase/supabase-js'

const url = process.env.VITE_SUPABASE_URL
const key = process.env.VITE_SUPABASE_ANON_KEY
if (!url || !key) throw new Error('VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be set')

const db = createClient(url, key)

const pull = async (table, order) => {
  const { data, error } = await db.from(table).select('*').order(order)
  if (error) throw new Error(`${table}: ${error.message}`)
  return data
}

const atlas = {
  pulledAt: new Date().toISOString(),
  regions: await pull('regions', 'sort_order'),
  slates: await pull('slates', 'sort_order'),
  countries: await pull('countries', 'capacity_kbd', { ascending: false }),
  refineries: await pull('refineries', 'capacity_kbd', { ascending: false }),
  grades: await pull('crude_grades', 'api_gravity'),
  sources: await pull('sources', 'sort_order'),
}

atlas.countries.sort((a, b) => b.capacity_kbd - a.capacity_kbd)
atlas.refineries.sort((a, b) => b.capacity_kbd - a.capacity_kbd)
atlas.grades.sort((a, b) => b.api_gravity - a.api_gravity)

const out = new URL('../src/generated/', import.meta.url)
mkdirSync(out, { recursive: true })
writeFileSync(new URL('atlas.json', out), JSON.stringify(atlas, null, 2))

console.log(
  `atlas.json: ${atlas.countries.length} countries, ${atlas.refineries.length} refineries, ` +
    `${atlas.grades.length} grades, ${atlas.sources.length} sources`,
)
