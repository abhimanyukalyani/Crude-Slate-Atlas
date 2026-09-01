import { Link, useParams } from 'react-router-dom'
import { SlateBadge } from '@/components/DataTable'
import { CountUp, Reveal, Stagger, StaggerItem } from '@/components/Motion'
import { PageHead } from '@/components/PageHead'
import { regionEssays } from '@/content/regions'
import {
  countries,
  countryBySlug,
  formatKbd,
  refineriesInCountry,
  regionName,
  shareOfWorld,
  slateName,
} from '@/lib/atlas'
import { NotFound } from './NotFound'

export function CountryDetail() {
  const { slug } = useParams<{ slug: string }>()
  const country = slug ? countryBySlug(slug) : undefined

  if (!country) return <NotFound />

  const rank = countries.findIndex((c) => c.id === country.id) + 1
  const plants = refineriesInCountry(country.name)
  const listed = plants.reduce((sum, p) => sum + p.capacity_kbd, 0)

  return (
    <div className="mx-auto max-w-[1180px] px-6 py-12">
      <nav className="mb-6 font-mono text-[11.5px] text-muted">
        <Link to="/atlas" className="no-underline hover:text-accent">
          The atlas
        </Link>
        <span className="px-1.5">/</span>
        <Link
          to={`/regions/${country.region_code.toLowerCase()}`}
          className="no-underline hover:text-accent"
        >
          {regionName(country.region_code)}
        </Link>
      </nav>

      <PageHead
        eyebrow={`${regionEssays[country.region_code].tag} · rank #${rank}`}
        title={country.name}
        standfirst={country.note}
      >
        <div className="flex flex-wrap gap-x-8 gap-y-3">
          <Metric
            label="Nameplate capacity"
            value={<CountUp value={country.capacity_kbd} suffix=" kb/d" />}
          />
          <Metric
            label="Share of world"
            value={<CountUp value={shareOfWorld(country.capacity_kbd)} decimals={2} suffix="%" />}
          />
          <Metric label="Crude slate" value={slateName(country.slate_code)} />
          {plants.length > 0 && <Metric label="Major plants listed" value={`${plants.length}`} />}
        </div>
      </PageHead>

      <div className="mt-10 grid gap-11 lg:grid-cols-[1.1fr_0.9fr] [&>*]:min-w-0">
        <Reveal>
          <div>
            <h2 className="text-[18px] font-semibold tracking-[-0.015em]">What its refineries run</h2>
            <p className="prose-editorial mt-3">{country.slate_detail}</p>
            <div className="mt-4">
              <SlateBadge code={country.slate_code} />
            </div>

            {plants.length > 0 && (
              <p className="mt-7 text-[13.5px] leading-relaxed text-ink-2">
                The {plants.length} plant{plants.length > 1 ? 's' : ''} listed here account for{' '}
                <strong className="font-semibold text-ink">
                  {((listed / country.capacity_kbd) * 100).toFixed(0)}%
                </strong>{' '}
                of {country.name}’s nameplate capacity. The remainder is spread across smaller sites
                not individually tracked in this atlas.
              </p>
            )}
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <aside className="rounded-[10px] border border-rule bg-surface p-5 shadow-card">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
              At a glance
            </h2>
            <dl className="mt-4 space-y-3.5">
              <Row label="Capacity" value={formatKbd(country.capacity_kbd)} />
              <Row label="World rank" value={`#${rank} of ${countries.length}`} />
              <Row
                label="Region"
                value={
                  <Link
                    to={`/regions/${country.region_code.toLowerCase()}`}
                    className="text-accent no-underline"
                  >
                    {regionEssays[country.region_code].tag}
                  </Link>
                }
              />
              <Row label="Slate" value={<SlateBadge code={country.slate_code} />} />
            </dl>
          </aside>
        </Reveal>
      </div>

      {plants.length > 0 && (
        <Reveal>
          <section className="mt-14 border-t border-rule pt-8">
            <h2 className="text-[clamp(20px,2.4vw,26px)] font-semibold tracking-[-0.02em]">
              Major refineries in {country.name}
            </h2>
            <Stagger className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {plants.map((plant) => (
                <StaggerItem key={plant.id}>
                  <Link
                    to={`/refineries/${plant.slug}`}
                    className="flex h-full flex-col rounded-[10px] border border-rule bg-surface p-4 no-underline shadow-card transition-shadow hover:shadow-lift"
                  >
                    <span className="text-[15px] font-semibold text-ink">{plant.name}</span>
                    <span className="mt-0.5 font-mono text-[11.5px] text-muted">
                      {plant.operator}
                    </span>
                    <span className="tabular mt-3 font-mono text-[13px] text-ink">
                      {formatKbd(plant.capacity_kbd)}
                      {plant.nelson_index !== null && (
                        <span className="text-muted"> · Nelson {plant.nelson_index}</span>
                      )}
                    </span>
                    <span className="mt-3 text-[12.5px] leading-snug text-ink-2">{plant.note}</span>
                  </Link>
                </StaggerItem>
              ))}
            </Stagger>
          </section>
        </Reveal>
      )}
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
