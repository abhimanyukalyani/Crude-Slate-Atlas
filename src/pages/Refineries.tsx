import { Link, useParams } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { DataTable, SlateBadge } from '@/components/DataTable'
import { CountUp, Reveal, Stagger, StaggerItem } from '@/components/Motion'
import { PageHead } from '@/components/PageHead'
import { regionEssays } from '@/content/regions'
import {
  formatKbd,
  refineries,
  refineryBySlug,
  regionName,
  slateName,
  countries,
  refineriesInCountry,
} from '@/lib/atlas'
import { NotFound } from './NotFound'

export function RefineriesIndex() {
  return (
    <div className="mx-auto max-w-[1180px] px-6 py-12">
      <PageHead
        eyebrow="Refineries"
        title="The plants that set the price of a barrel"
        standfirst={`${refineries.length} of the world’s largest refineries, ranked by nameplate capacity. Complexity is listed where a Nelson index has been published — it is the single best guide to which crude a plant can actually buy.`}
      />
      <Reveal delay={0.05}>
        <DataTable initialView="refineries" showTabs={false} />
      </Reveal>
    </div>
  )
}

/** Nelson index rendered against the tier scale, so the number has context. */
function ComplexityScale({ value }: { value: number }) {
  const reduced = useReducedMotion()
  const pct = Math.min(100, (value / 22) * 100)

  return (
    <div>
      <div className="relative h-2 overflow-hidden rounded-full bg-rule">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full bg-accent"
          initial={reduced ? false : { width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
      <div className="mt-1.5 flex justify-between font-mono text-[10px] text-muted">
        <span>1 — distillation only</span>
        <span>22 — deepest conversion</span>
      </div>
    </div>
  )
}

export function RefineryDetail() {
  const { slug } = useParams<{ slug: string }>()
  const refinery = slug ? refineryBySlug(slug) : undefined

  if (!refinery) return <NotFound />

  const rank = refineries.findIndex((r) => r.id === refinery.id) + 1
  const siblings = refineriesInCountry(refinery.country_name).filter((r) => r.id !== refinery.id)
  const country = countries.find((c) => c.name === refinery.country_name)

  return (
    <div className="mx-auto max-w-[1180px] px-6 py-12">
      <nav className="mb-6 font-mono text-[11.5px] text-muted">
        <Link to="/refineries" className="no-underline hover:text-accent">
          Refineries
        </Link>
        <span className="px-1.5">/</span>
        <Link
          to={`/regions/${refinery.region_code.toLowerCase()}`}
          className="no-underline hover:text-accent"
        >
          {regionName(refinery.region_code)}
        </Link>
      </nav>

      <PageHead
        eyebrow={`${refinery.operator} · ${refinery.country_name}`}
        title={refinery.name}
        standfirst={refinery.note}
      >
        <div className="flex flex-wrap gap-x-8 gap-y-3">
          <Metric
            label="Nameplate capacity"
            value={<CountUp value={refinery.capacity_kbd} suffix=" kb/d" />}
          />
          <Metric label="World rank by size" value={`#${rank}`} />
          <Metric
            label="Nelson complexity"
            value={refinery.nelson_index !== null ? <CountUp value={refinery.nelson_index} decimals={1} /> : '—'}
          />
          <Metric label="Crude slate" value={slateName(refinery.slate_code)} />
        </div>
      </PageHead>

      <div className="mt-10 grid gap-11 lg:grid-cols-[1.1fr_0.9fr] [&>*]:min-w-0">
        <Reveal>
          <div>
            <h2 className="text-[18px] font-semibold tracking-[-0.015em]">What it runs</h2>
            <p className="prose-editorial mt-3">{refinery.slate_detail}</p>

            {refinery.nelson_index !== null && (
              <div className="mt-7">
                <h3 className="text-[15px] font-semibold">Complexity in context</h3>
                <p className="mt-2 text-[13.5px] leading-relaxed text-ink-2">
                  A Nelson index of {refinery.nelson_index} puts this plant{' '}
                  {refinery.nelson_index >= 15
                    ? 'in the deep-conversion tier — it can buy the barrels almost nobody else can process.'
                    : refinery.nelson_index >= 10
                      ? 'in the coking tier: residue becomes distillate, so heavy sour crude is an opportunity rather than a problem.'
                      : 'in the cracking tier — comfortable on medium sour grades, but without the depth to chase the deepest discounts.'}
                </p>
                <div className="mt-4">
                  <ComplexityScale value={refinery.nelson_index} />
                </div>
              </div>
            )}
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <aside className="rounded-[10px] border border-rule bg-surface p-5 shadow-card">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
              At a glance
            </h2>
            <dl className="mt-4 space-y-3.5">
              <Row label="Operator" value={refinery.operator} />
              <Row
                label="Country"
                value={
                  country ? (
                    <Link to={`/countries/${country.slug}`} className="text-accent no-underline">
                      {refinery.country_name}
                    </Link>
                  ) : (
                    refinery.country_name
                  )
                }
              />
              <Row
                label="Region"
                value={
                  <Link
                    to={`/regions/${refinery.region_code.toLowerCase()}`}
                    className="text-accent no-underline"
                  >
                    {regionEssays[refinery.region_code].tag}
                  </Link>
                }
              />
              <Row label="Capacity" value={formatKbd(refinery.capacity_kbd)} />
              <Row label="Slate" value={<SlateBadge code={refinery.slate_code} />} />
            </dl>

            {siblings.length > 0 && (
              <div className="mt-6 border-t border-rule-soft pt-5">
                <h3 className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
                  Also in {refinery.country_name}
                </h3>
                <ul className="mt-3 space-y-2">
                  {siblings.map((sibling) => (
                    <li key={sibling.id}>
                      <Link
                        to={`/refineries/${sibling.slug}`}
                        className="flex items-baseline justify-between gap-3 text-[13.5px] no-underline"
                      >
                        <span className="text-ink-2 hover:text-accent">{sibling.name}</span>
                        <span className="tabular shrink-0 font-mono text-[12px] text-muted">
                          {formatKbd(sibling.capacity_kbd)}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </Reveal>
      </div>

      <Reveal>
        <section className="mt-14 border-t border-rule pt-8">
          <h2 className="text-[clamp(20px,2.4vw,26px)] font-semibold tracking-[-0.02em]">
            Nearby in the ranking
          </h2>
          <Stagger className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {refineries
              .slice(Math.max(0, rank - 3), Math.max(0, rank - 3) + 4)
              .map((peer) => (
                <StaggerItem key={peer.id}>
                  <Link
                    to={`/refineries/${peer.slug}`}
                    className={`flex h-full flex-col rounded-[10px] border p-4 no-underline transition-shadow hover:shadow-lift ${
                      peer.id === refinery.id
                        ? 'border-accent-line bg-accent-wash'
                        : 'border-rule bg-surface shadow-card'
                    }`}
                  >
                    <span className="text-[14.5px] font-semibold text-ink">{peer.name}</span>
                    <span className="mt-0.5 font-mono text-[11.5px] text-muted">
                      {peer.country_name}
                    </span>
                    <span className="tabular mt-2.5 font-mono text-[13px] text-ink">
                      {formatKbd(peer.capacity_kbd)}
                    </span>
                  </Link>
                </StaggerItem>
              ))}
          </Stagger>
        </section>
      </Reveal>
    </div>
  )
}

function Metric({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <div className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-muted">{label}</div>
      <div className="mt-1 text-[22px] font-bold tracking-[-0.02em]">{value}</div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="shrink-0 text-[12.5px] text-muted">{label}</dt>
      <dd className="m-0 text-right text-[13.5px] font-medium text-ink">{value}</dd>
    </div>
  )
}
