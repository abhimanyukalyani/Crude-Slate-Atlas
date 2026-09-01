import { motion, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { countries, formatKbd, regionColor, slateName, type Country } from '@/lib/atlas'

/** Ranked capacity bars, coloured by region. */
export function CapacityBars({ rows = countries.slice(0, 20) }: { rows?: Country[] }) {
  const reduced = useReducedMotion()
  const max = Math.max(...rows.map((r) => r.capacity_kbd), 1)

  return (
    <div className="mt-4 flex flex-col gap-1.5">
      {rows.map((country, i) => (
        <Link
          key={country.id}
          to={`/countries/${country.slug}`}
          title={`${country.name} — ${slateName(country.slate_code)}`}
          className="group grid grid-cols-[104px_1fr_74px] items-center gap-2.5 rounded px-1 py-0.5 no-underline transition-colors hover:bg-accent-wash sm:grid-cols-[128px_1fr_78px]"
        >
          <span className="truncate text-[13px] text-ink-2 group-hover:text-ink">
            {country.name}
          </span>
          <span className="relative h-4">
            <motion.span
              className="absolute inset-y-0 left-0 block rounded-r"
              style={{ background: regionColor(country.region_code) }}
              initial={reduced ? false : { width: 0 }}
              whileInView={{ width: `${(country.capacity_kbd / max) * 100}%` }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{
                duration: 0.7,
                delay: reduced ? 0 : i * 0.035,
                ease: [0.22, 0.65, 0.3, 1],
              }}
            />
          </span>
          <span className="tabular text-right font-mono text-[12.5px] text-ink">
            {formatKbd(country.capacity_kbd)}
          </span>
        </Link>
      ))}
    </div>
  )
}
