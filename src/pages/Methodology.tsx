import { Reveal, Stagger, StaggerItem } from '@/components/Motion'
import { PageHead } from '@/components/PageHead'
import { axes, complexityTiers, methodologyCaveat } from '@/content/regions'
import { countries, grades, refineries, sources } from '@/lib/atlas'

export function Methodology() {
  return (
    <div className="mx-auto max-w-[1180px] px-6 py-12">
      <PageHead
        eyebrow="Methodology"
        title="What the numbers are, and what they are not"
        standfirst="This atlas blends published capacity figures with typical crude assays. Both are approximations, and the gap between nameplate and actual runs is the single largest source of error."
      />

      <div className="mt-10 grid gap-11 lg:grid-cols-[1.1fr_0.9fr] [&>*]:min-w-0">
        <Reveal>
          <div>
            <h2 className="text-[18px] font-semibold tracking-[-0.015em]">On the numbers</h2>
            <p className="prose-editorial mt-3">{methodologyCaveat}</p>

            <h2 className="mt-9 text-[18px] font-semibold tracking-[-0.015em]">The three axes</h2>
            <div className="mt-4 flex flex-col gap-px overflow-hidden rounded-lg border border-rule bg-rule">
              {axes.map((axis) => (
                <div key={axis.key} className="bg-surface px-4 py-3.5">
                  <div className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-accent">
                    {axis.key}
                  </div>
                  <div className="mt-1.5 text-[15px] font-semibold">{axis.title}</div>
                  <p className="mt-1 text-[13px] leading-snug text-ink-2">{axis.description}</p>
                </div>
              ))}
            </div>

            <h2 className="mt-9 text-[18px] font-semibold tracking-[-0.015em]">
              Complexity tiers
            </h2>
            <div className="mt-4 flex flex-col gap-px overflow-hidden rounded-lg border border-rule bg-rule">
              {complexityTiers.map((tier) => (
                <div
                  key={tier.name}
                  className="grid grid-cols-[64px_1fr] items-start gap-4 bg-surface px-4 py-3.5"
                >
                  <span className="pt-px font-mono text-[13px] font-semibold text-accent">
                    {tier.range}
                  </span>
                  <span>
                    <span className="block text-[14.5px] font-semibold">{tier.name}</span>
                    <span className="mt-1 block text-[13px] leading-snug text-ink-2">
                      {tier.description}
                    </span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <aside>
            <div className="rounded-[10px] border border-rule bg-surface p-5 shadow-card">
              <h2 className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
                Coverage
              </h2>
              <dl className="mt-4 space-y-3.5">
                <Row label="Refining countries" value={`${countries.length}`} />
                <Row label="Individual refineries" value={`${refineries.length}`} />
                <Row label="Crude grades assayed" value={`${grades.length}`} />
                <Row label="Sources cited" value={`${sources.length}`} />
              </dl>
            </div>

            <div className="mt-5 rounded-[10px] border border-rule bg-surface p-5 shadow-card">
              <h2 className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
                Where the data lives
              </h2>
              <p className="mt-3 text-[13.5px] leading-relaxed text-ink-2">
                The dataset is held in Postgres and published as a build-time snapshot, so the site
                itself is static and served from the edge. Correcting a figure means updating one
                row and rebuilding — no code change.
              </p>
            </div>
          </aside>
        </Reveal>
      </div>

      <Reveal>
        <section className="mt-14 border-t border-rule pt-8">
          <h2 className="text-[clamp(20px,2.4vw,26px)] font-semibold tracking-[-0.02em]">Sources</h2>
          <Stagger className="mt-5 grid gap-3 md:grid-cols-2">
            {sources.map((source) => (
              <StaggerItem key={source.id}>
                <a
                  href={source.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="block rounded-lg border border-rule bg-surface px-4 py-3 text-[13.5px] leading-snug text-ink-2 no-underline transition-colors hover:border-accent-line hover:text-accent"
                >
                  {source.title}
                </a>
              </StaggerItem>
            ))}
          </Stagger>
        </section>
      </Reveal>
    </div>
  )
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="shrink-0 text-[12.5px] text-muted">{label}</dt>
      <dd className="tabular m-0 text-right font-mono text-[14px] font-medium text-ink">{value}</dd>
    </div>
  )
}
