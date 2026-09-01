import { motion, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { capacityByRegion, formatMbd, shareOfWorld } from '@/lib/atlas'
import { regionEssays } from '@/content/regions'

/** Share of world distillation capacity, as one continuous bar. */
export function RegionStack() {
  const reduced = useReducedMotion()

  return (
    <div>
      <div className="mt-5 flex h-9 gap-0.5 overflow-hidden rounded">
        {capacityByRegion.map((region, i) => (
          <motion.div
            key={region.code}
            className="relative cursor-default transition-[filter] hover:brightness-110"
            style={{
              background: `var(--csa-${region.color_token})`,
              flexBasis: `${shareOfWorld(region.capacity_kbd)}%`,
              transformOrigin: 'left',
            }}
            title={`${region.name} — ${formatMbd(region.capacity_kbd)} mb/d`}
            initial={reduced ? false : { scaleX: 0, opacity: 0 }}
            whileInView={{ scaleX: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: reduced ? 0 : i * 0.07, ease: [0.22, 0.65, 0.3, 1] }}
          />
        ))}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-x-5 gap-y-3 sm:grid-cols-2">
        {capacityByRegion.map((region) => (
          <Link
            key={region.code}
            to={`/regions/${region.code.toLowerCase()}`}
            className="flex items-start gap-2 no-underline"
          >
            <span
              className="mt-1 h-2.5 w-2.5 shrink-0 rounded-[3px]"
              style={{ background: `var(--csa-${region.color_token})` }}
            />
            <span>
              <span className="block text-[13px] font-semibold text-ink">
                {regionEssays[region.code].tag}
              </span>
              <span className="block font-mono text-[11.5px] text-muted">
                {formatMbd(region.capacity_kbd)} mb/d ·{' '}
                {shareOfWorld(region.capacity_kbd).toFixed(1)}%
              </span>
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
