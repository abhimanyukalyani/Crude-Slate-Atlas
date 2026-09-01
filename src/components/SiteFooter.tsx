import { Link } from 'react-router-dom'
import { regions, totalCapacityKbd, formatMbd } from '@/lib/atlas'
import { regionEssays } from '@/content/regions'

export function SiteFooter() {
  return (
    <footer className="border-t border-rule bg-surface">
      <div className="mx-auto max-w-[1180px] px-6 py-12">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <div className="text-[17px] font-semibold tracking-[-0.015em]">Crude Slate Atlas</div>
            <p className="mt-3 max-w-[46ch] font-serif text-[15px] leading-relaxed text-ink-2">
              The world’s {formatMbd(totalCapacityKbd)} mb/d of atmospheric distillation capacity,
              sorted by who owns it and what it can actually digest.
            </p>
          </div>

          <div>
            <h3 className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted">Regions</h3>
            <ul className="mt-3 space-y-1.5">
              {regions.map((region) => (
                <li key={region.code}>
                  <Link
                    to={`/regions/${region.code.toLowerCase()}`}
                    className="text-[13.5px] text-ink-2 no-underline hover:text-accent"
                  >
                    {regionEssays[region.code].tag}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted">Sections</h3>
            <ul className="mt-3 space-y-1.5">
              {[
                { to: '/atlas', label: 'The atlas' },
                { to: '/refineries', label: 'Major refineries' },
                { to: '/methodology', label: 'Methodology & sources' },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-[13.5px] text-ink-2 no-underline hover:text-accent"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="mt-10 border-t border-rule-soft pt-6 font-mono text-[11.5px] tracking-[0.03em] text-muted">
          Nameplate capacity, 2025–26 estimates. Figures are indicative, not contractual.
        </p>
      </div>
    </footer>
  )
}
