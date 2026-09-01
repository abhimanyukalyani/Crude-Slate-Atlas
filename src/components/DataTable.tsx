import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  countries,
  formatKbd,
  refineries,
  regionName,
  regions,
  slateColor,
  slateName,
  slates,
  type RegionCode,
  type SlateCode,
} from '@/lib/atlas'

type View = 'countries' | 'refineries'
type SortDir = 'asc' | 'desc'

interface Row {
  id: number
  key: string
  name: string
  href: string
  meta: string
  region_code: RegionCode
  capacity_kbd: number
  slate_code: SlateCode
  slate_detail: string
  nelson_index: number | null
  note: string
}

const countryRows = (): Row[] =>
  countries.map((c) => ({
    id: c.id,
    key: `c-${c.id}`,
    name: c.name,
    href: `/countries/${c.slug}`,
    meta: regionName(c.region_code),
    region_code: c.region_code,
    capacity_kbd: c.capacity_kbd,
    slate_code: c.slate_code,
    slate_detail: c.slate_detail,
    nelson_index: null,
    note: c.note,
  }))

const refineryRows = (): Row[] =>
  refineries.map((r) => ({
    id: r.id,
    key: `r-${r.id}`,
    name: r.name,
    href: `/refineries/${r.slug}`,
    meta: `${r.operator} · ${r.country_name}`,
    region_code: r.region_code,
    capacity_kbd: r.capacity_kbd,
    slate_code: r.slate_code,
    slate_detail: r.slate_detail,
    nelson_index: r.nelson_index,
    note: r.note,
  }))

export function DataTable({
  initialView = 'countries',
  regionFilter,
  showTabs = true,
}: {
  initialView?: View
  regionFilter?: RegionCode
  showTabs?: boolean
}) {
  const reduced = useReducedMotion()
  const [view, setView] = useState<View>(initialView)
  const [query, setQuery] = useState('')
  const [region, setRegion] = useState<RegionCode | null>(regionFilter ?? null)
  const [slate, setSlate] = useState<SlateCode | null>(null)
  const [sortKey, setSortKey] = useState<'name' | 'capacity_kbd' | 'nelson_index'>('capacity_kbd')
  const [sortDir, setSortDir] = useState<SortDir>('desc')

  const rows = useMemo(() => {
    const base = view === 'countries' ? countryRows() : refineryRows()
    const q = query.trim().toLowerCase()

    const filtered = base.filter((row) => {
      if (regionFilter && row.region_code !== regionFilter) return false
      if (region && row.region_code !== region) return false
      if (slate && row.slate_code !== slate) return false
      if (!q) return true
      return (
        row.name.toLowerCase().includes(q) ||
        row.meta.toLowerCase().includes(q) ||
        row.slate_detail.toLowerCase().includes(q) ||
        row.note.toLowerCase().includes(q)
      )
    })

    return filtered.sort((a, b) => {
      const dir = sortDir === 'asc' ? 1 : -1
      if (sortKey === 'name') return a.name.localeCompare(b.name) * dir
      if (sortKey === 'nelson_index') {
        const av = a.nelson_index ?? -1
        const bv = b.nelson_index ?? -1
        return (av - bv) * dir
      }
      return (a.capacity_kbd - b.capacity_kbd) * dir
    })
  }, [view, query, region, slate, sortKey, sortDir, regionFilter])

  const sort = (key: typeof sortKey) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else {
      setSortKey(key)
      setSortDir(key === 'name' ? 'asc' : 'desc')
    }
  }

  const header = (key: typeof sortKey, label: string, numeric = false) => (
    <th
      scope="col"
      onClick={() => sort(key)}
      aria-sort={sortKey === key ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none'}
      className={`sticky top-0 z-[2] cursor-pointer select-none whitespace-nowrap border-b border-rule bg-surface-2 px-3.5 py-2.5 font-mono text-[10.5px] font-medium uppercase tracking-[0.1em] ${
        numeric ? 'text-right' : 'text-left'
      } ${sortKey === key ? 'text-accent' : 'text-muted hover:text-ink'}`}
    >
      {label}
      {sortKey === key && <span aria-hidden> {sortDir === 'asc' ? '↑' : '↓'}</span>}
    </th>
  )

  return (
    <div>
      {showTabs && (
        <div className="mt-6 flex gap-0.5 border-b border-rule" role="tablist">
          {(
            [
              ['countries', 'By country'],
              ['refineries', 'Major refineries'],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              role="tab"
              aria-selected={view === value}
              onClick={() => setView(value)}
              className={`relative -mb-px border-0 bg-transparent px-3.5 py-2.5 text-[14px] font-semibold transition-colors ${
                view === value ? 'text-accent' : 'text-muted hover:text-ink'
              }`}
            >
              {label}
              {view === value && (
                <motion.span
                  layoutId="csa-tab"
                  className="absolute inset-x-0 -bottom-px h-0.5 bg-accent"
                />
              )}
            </button>
          ))}
        </div>
      )}

      <div className="my-4 flex flex-wrap items-center gap-2.5">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search country, refinery, operator, crude grade…"
          aria-label="Search the atlas"
          className="min-w-[180px] flex-[1_1_210px] rounded-[7px] border border-rule bg-surface px-3 py-2 text-[13.5px] text-ink placeholder:text-muted"
        />

        {!regionFilter && (
          <div className="flex flex-wrap gap-1.5">
            {regions.map((r) => (
              <Chip
                key={r.code}
                active={region === r.code}
                onClick={() => setRegion(region === r.code ? null : r.code)}
              >
                {r.name}
              </Chip>
            ))}
          </div>
        )}

        <div className="flex flex-wrap gap-1.5">
          {slates.map((s) => (
            <Chip
              key={s.code}
              active={slate === s.code}
              onClick={() => setSlate(slate === s.code ? null : s.code)}
            >
              {s.name}
            </Chip>
          ))}
        </div>

        <span className="ml-auto font-mono text-[11.5px] text-muted">
          {rows.length} {view === 'countries' ? 'countries' : 'refineries'}
        </span>
      </div>

      <div className="overflow-x-auto rounded-[10px] border border-rule bg-surface">
        <table className="w-full min-w-[820px] border-collapse text-[13.5px]">
          <thead>
            <tr>
              {header('name', view === 'countries' ? 'Country' : 'Refinery')}
              <th
                scope="col"
                className="sticky top-0 z-[2] whitespace-nowrap border-b border-rule bg-surface-2 px-3.5 py-2.5 text-left font-mono text-[10.5px] font-medium uppercase tracking-[0.1em] text-muted"
              >
                {view === 'countries' ? 'Region' : 'Operator'}
              </th>
              {header('capacity_kbd', 'Capacity', true)}
              {view === 'refineries' && header('nelson_index', 'Nelson', true)}
              <th
                scope="col"
                className="sticky top-0 z-[2] whitespace-nowrap border-b border-rule bg-surface-2 px-3.5 py-2.5 text-left font-mono text-[10.5px] font-medium uppercase tracking-[0.1em] text-muted"
              >
                Crude slate
              </th>
              <th
                scope="col"
                className="sticky top-0 z-[2] whitespace-nowrap border-b border-rule bg-surface-2 px-3.5 py-2.5 text-left font-mono text-[10.5px] font-medium uppercase tracking-[0.1em] text-muted"
              >
                Notes
              </th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence initial={false}>
              {rows.map((row) => (
                <motion.tr
                  key={row.key}
                  layout={!reduced}
                  initial={reduced ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.18 }}
                  className="border-b border-rule-soft last:border-b-0 hover:bg-accent-wash"
                >
                  <td className="whitespace-nowrap px-3.5 py-2.5 align-top font-semibold">
                    <Link to={row.href} className="text-ink no-underline hover:text-accent">
                      {row.name}
                    </Link>
                  </td>
                  <td className="px-3.5 py-2.5 align-top font-mono text-[11.5px] tracking-[0.03em] text-muted">
                    {row.meta}
                  </td>
                  <td className="tabular whitespace-nowrap px-3.5 py-2.5 text-right align-top font-mono">
                    {formatKbd(row.capacity_kbd)}
                  </td>
                  {view === 'refineries' && (
                    <td className="tabular px-3.5 py-2.5 text-right align-top font-mono">
                      {row.nelson_index ?? <span className="text-muted">—</span>}
                    </td>
                  )}
                  <td className="px-3.5 py-2.5 align-top">
                    <SlateBadge code={row.slate_code} />
                    <div className="mt-1.5 max-w-[300px] text-[12.5px] leading-snug text-ink-2">
                      {row.slate_detail}
                    </div>
                  </td>
                  <td className="min-w-[210px] max-w-[330px] px-3.5 py-2.5 align-top text-[12.5px] leading-snug text-ink-2">
                    {row.note}
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {rows.length === 0 && (
        <p className="mt-4 text-center text-[13.5px] text-muted">
          Nothing matches those filters.
        </p>
      )}

      <p className="mt-2.5 font-mono text-[11px] tracking-[0.03em] text-muted">
        Scroll sideways for the full notes · click any header to sort
      </p>
    </div>
  )
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      aria-pressed={active}
      onClick={onClick}
      className={`rounded-full border px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.04em] transition-colors ${
        active
          ? 'border-accent bg-accent text-on-accent'
          : 'border-rule bg-surface text-ink-2 hover:border-accent-line'
      }`}
    >
      {children}
    </button>
  )
}

export function SlateBadge({ code }: { code: SlateCode }) {
  return (
    <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded border border-rule bg-surface-2 px-1.5 py-0.5 font-mono text-[11.5px] text-ink-2">
      <span
        className="h-1.5 w-1.5 shrink-0 rounded-sm"
        style={{ background: slateColor(code) }}
      />
      {slateName(code)}
    </span>
  )
}
