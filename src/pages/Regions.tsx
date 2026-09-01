import { Link, useParams } from 'react-router-dom'
import { CapacityBars } from '@/components/charts/CapacityBars'
import { DataTable } from '@/components/DataTable'
import { CountUp, Reveal, Stagger, StaggerItem } from '@/components/Motion'
import { PageHead } from '@/components/PageHead'
import { SlateBadge } from '@/components/DataTable'
import { regionEssays } from '@/content/regions'
import {
  capacityByRegion,
  countriesInRegion,
  formatKbd,
  formatMbd,
  refineriesInRegion,
  regionByCode,
  shareOfWorld,
  type RegionCode,
} from '@/lib/atlas'
import { NotFound } from './NotFound'

export function RegionsIndex() {
  return (
    <div className="mx-auto max-w-[1180px] px-6 py-12">
      <PageHead
        eyebrow="Regions"
        title="Seven refining worlds, one market"
        standfirst="Capacity is global but not interchangeable. Each region built its fleet around the crude it could reach — and is now living with that decision."
      />

      <Stagger className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {capacityByRegion.map((region) => {
          const essay = regionEssays[region.code]
          return (
            <StaggerItem key={region.code}>
              <Link
                to={`/regions/${region.code.toLowerCase()}`}
                className="group flex h-full flex-col rounded-[10px] border border-rule bg-surface p-5 no-underline shadow-card transition-shadow hover:shadow-lift"
              >
                <span
                  className="h-1 w-10 rounded-full"
                  style={{ background: `var(--csa-${region.color_token})` }}
                />
                <span className="mt-4 text-[18px] font-semibold tracking-[-0.015em] text-ink">
                  {essay.tag}
                </span>
                <span className="tabular mt-1 font-mono text-[12px] text-muted">
                  {formatMbd(region.capacity_kbd)} mb/d ·{' '}
                  {shareOfWorld(region.capacity_kbd).toFixed(1)}% of world ·{' '}
                  {region.countryCount} countries
                </span>
                <span className="mt-3.5 text-[14.5px] font-semibold leading-snug text-ink">
                  {essay.headline}
                </span>
                <span className="mt-2 text-[13.5px] leading-relaxed text-ink-2">
                  {essay.standfirst}
                </span>
                <span className="mt-auto pt-4 font-mono text-[11px] uppercase tracking-[0.1em] text-muted transition-colors group-hover:text-accent">
                  Read →
                </span>
              </Link>
            </StaggerItem>
          )
        })}
      </Stagger>
    </div>
  )
}

export function RegionDetail() {
  const { code } = useParams<{ code: string }>()
  const regionCode = code?.toUpperCase() as RegionCode | undefined
  const region = regionCode ? regionByCode.get(regionCode) : undefined

  if (!region || !regionCode) return <NotFound />

  const essay = regionEssays[regionCode]
  const members = countriesInRegion(regionCode)
  const plants = refineriesInRegion(regionCode)
  const capacity = members.reduce((sum, c) => sum + c.capacity_kbd, 0)

  return (
    <div className="mx-auto max-w-[1180px] px-6 py-12">
      <PageHead eyebrow={essay.tag} title={essay.headline} standfirst={essay.standfirst}>
        <div className="flex flex-wrap gap-x-8 gap-y-3">
          <Metric label="Regional capacity" value={<CountUp value={capacity / 1000} decimals={1} suffix=" mb/d" />} />
          <Metric
            label="Share of world"
            value={<CountUp value={shareOfWorld(capacity)} decimals={1} suffix="%" />}
          />
          <Metric label="Countries" value={<CountUp value={members.length} />} />
          <Metric label="Major refineries listed" value={<CountUp value={plants.length} />} />
        </div>
      </PageHead>

      <div className="mt-10 grid gap-11 lg:grid-cols-[1.15fr_0.85fr] [&>*]:min-w-0">
        <Reveal>
          <div>
            {essay.paragraphs.map((paragraph, i) => (
              <p key={i} className="prose-editorial mt-4 first:mt-0">
                {paragraph}
              </p>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="rounded-[10px] border border-rule bg-surface p-5 shadow-card">
            <h2 className="text-[15px] font-semibold">Capacity in {essay.tag}</h2>
            <p className="mt-1 text-[12.5px] text-muted">
              Nameplate atmospheric distillation, by country.
            </p>
            <CapacityBars rows={members} />
          </div>
        </Reveal>
      </div>

      {plants.length > 0 && (
        <Reveal>
          <section className="mt-14">
            <h2 className="text-[clamp(20px,2.4vw,26px)] font-semibold tracking-[-0.02em]">
              Major plants in {essay.tag}
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
                      {plant.operator} · {plant.country_name}
                    </span>
                    <span className="tabular mt-3 font-mono text-[13px] text-ink">
                      {formatKbd(plant.capacity_kbd)}
                      {plant.nelson_index !== null && (
                        <span className="text-muted"> · Nelson {plant.nelson_index}</span>
                      )}
                    </span>
                    <span className="mt-3">
                      <SlateBadge code={plant.slate_code} />
                    </span>
                  </Link>
                </StaggerItem>
              ))}
            </Stagger>
          </section>
        </Reveal>
      )}

      <Reveal>
        <section className="mt-14">
          <h2 className="text-[clamp(20px,2.4vw,26px)] font-semibold tracking-[-0.02em]">
            The {essay.tag} table
          </h2>
          <DataTable regionFilter={regionCode} showTabs={false} />
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
