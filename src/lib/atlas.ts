import snapshot from '@/generated/atlas.json'

export type RegionCode = 'NA' | 'LAT' | 'EUR' | 'RUS' | 'ME' | 'AFR' | 'APAC'
export type SlateCode = 'sweet' | 'mixed' | 'sour' | 'heavy' | 'cond'

export interface Region {
  code: RegionCode
  name: string
  color_token: string
  sort_order: number
}

export interface Slate {
  code: SlateCode
  name: string
  sort_order: number
}

export interface Country {
  id: number
  name: string
  slug: string
  region_code: RegionCode
  capacity_kbd: number
  slate_code: SlateCode
  slate_detail: string
  note: string
}

export interface Refinery {
  id: number
  name: string
  slug: string
  country_name: string
  region_code: RegionCode
  operator: string
  capacity_kbd: number
  slate_code: SlateCode
  slate_detail: string
  nelson_index: number | null
  note: string
}

export interface Grade {
  id: number
  name: string
  api_gravity: number
  sulphur_pct: number
  origin: string
  sanctioned: boolean
}

export interface Source {
  id: number
  title: string
  url: string
  sort_order: number
}

interface Atlas {
  pulledAt: string
  regions: Region[]
  slates: Slate[]
  countries: Country[]
  refineries: Refinery[]
  grades: Grade[]
  sources: Source[]
}

const atlas = snapshot as unknown as Atlas

export const regions = atlas.regions
export const slates = atlas.slates
export const countries = atlas.countries
export const refineries = atlas.refineries
export const grades = atlas.grades
export const sources = atlas.sources

export const regionByCode = new Map(regions.map((r) => [r.code, r]))
export const slateByCode = new Map(slates.map((s) => [s.code, s]))

export const regionName = (code: RegionCode) => regionByCode.get(code)?.name ?? code
export const slateName = (code: SlateCode) => slateByCode.get(code)?.name ?? code

/** Every region colour resolves through the shared token palette. */
export const regionColor = (code: RegionCode) =>
  `var(--csa-${regionByCode.get(code)?.color_token ?? 's1'})`

const slateTokens: Record<SlateCode, string> = {
  sweet: 'sl1',
  mixed: 'sl2',
  sour: 'sl3',
  heavy: 'sl4',
  cond: 's2',
}

export const slateColor = (code: SlateCode) => `var(--csa-${slateTokens[code]})`

export const totalCapacityKbd = countries.reduce((sum, c) => sum + c.capacity_kbd, 0)

export const capacityByRegion = regions
  .map((region) => {
    const members = countries.filter((c) => c.region_code === region.code)
    return {
      ...region,
      capacity_kbd: members.reduce((sum, c) => sum + c.capacity_kbd, 0),
      countryCount: members.length,
    }
  })
  .sort((a, b) => b.capacity_kbd - a.capacity_kbd)

export const countryBySlug = (slug: string) => countries.find((c) => c.slug === slug)
export const refineryBySlug = (slug: string) => refineries.find((r) => r.slug === slug)

export const refineriesInRegion = (code: RegionCode) =>
  refineries.filter((r) => r.region_code === code)

export const countriesInRegion = (code: RegionCode) =>
  countries.filter((c) => c.region_code === code)

export const refineriesInCountry = (name: string) =>
  refineries.filter((r) => r.country_name === name)

export const formatKbd = (kbd: number) =>
  kbd >= 1000 ? `${(kbd / 1000).toFixed(2)} mb/d` : `${kbd.toLocaleString()} kb/d`

export const formatMbd = (kbd: number) => `${(kbd / 1000).toFixed(1)}`

export const shareOfWorld = (kbd: number) => (kbd / totalCapacityKbd) * 100
