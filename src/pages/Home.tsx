import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { BarrelYield } from '@/components/charts/BarrelYield'
import { CapacityBars } from '@/components/charts/CapacityBars'
import { CrudeScatter } from '@/components/charts/CrudeScatter'
import { RegionStack } from '@/components/charts/RegionStack'
import { CountUp, Reveal, Stagger, StaggerItem } from '@/components/Motion'
import { axes, complexityTiers, regionEssays } from '@/content/regions'
import { countries, formatMbd, regions, shareOfWorld, totalCapacityKbd } from '@/lib/atlas'

const topTwoShare = shareOfWorld(countries[0].capacity_kbd + countries[1].capacity_kbd)

export function Home() {
  return (
    <>
      <Masthead />
      <StatBand />
      <ReadingASlate />
      <CrudeMap />
      <Rankings />
      <RegionReads />
    </>
  )
}

function Masthead() {
  const ref = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '22%'])
  const opacity = useTransform(scrollYProgress, [0, 0.85], [1, 0])

  return (
    <header ref={ref} className="relative overflow-hidden border-b border-rule bg-band">
      {/* slow-drifting slick behind the type */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="csa-slick absolute -inset-1/4 opacity-70"
          style={{
            background:
              'radial-gradient(40% 55% at 22% 30%, rgba(79,191,164,.18), transparent 70%),' +
              'radial-gradient(35% 45% at 78% 25%, rgba(42,120,214,.16), transparent 70%),' +
              'radial-gradient(45% 50% at 60% 85%, rgba(235,104,52,.10), transparent 70%)',
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,.035) 1px, transparent 1px),' +
              'linear-gradient(90deg, rgba(255,255,255,.035) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
          }}
        />
      </div>

      <motion.div
        style={reduced ? undefined : { y, opacity }}
        className="relative mx-auto max-w-[1180px] px-6 pt-16"
      >
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="font-mono text-[11px] uppercase tracking-[0.16em] text-band-muted"
        >
          Global refining · capacity, crude slate, complexity
        </motion.div>

        <motion.h1
          initial={reduced ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.08, ease: [0.22, 0.65, 0.3, 1] }}
          className="mt-3.5 max-w-[16ch] text-[clamp(40px,6.2vw,74px)] font-bold leading-[1.02] tracking-[-0.028em] text-band-ink"
        >
          Every barrel has to find a refinery{' '}
          <em className="not-italic text-[#4fbfa4]">built for it</em>.
        </motion.h1>

        <motion.p
          initial={reduced ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.16, ease: [0.22, 0.65, 0.3, 1] }}
          className="mt-5 max-w-[62ch] font-serif text-[18px] leading-relaxed text-band-muted"
        >
          Refining capacity is not fungible. A plant is engineered around a{' '}
          <b className="font-semibold text-band-ink">crude slate</b> — a target range of density and
          sulphur — and a barrel outside that range is either discounted, blended down, or refused.
          This is the world’s {formatMbd(totalCapacityKbd)} mb/d of distillation capacity sorted by{' '}
          <b className="font-semibold text-band-ink">who owns it</b> and{' '}
          <b className="font-semibold text-band-ink">what it can actually digest</b>.
        </motion.p>

        <motion.div
          initial={reduced ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.24 }}
          className="mt-8 flex flex-wrap gap-2.5"
        >
          <Link
            to="/atlas"
            className="rounded-lg bg-[#4fbfa4] px-4 py-2.5 text-[14px] font-semibold text-[#052019] no-underline transition-transform hover:-translate-y-0.5"
          >
            Explore the atlas
          </Link>
          <Link
            to="/regions"
            className="rounded-lg border border-white/20 px-4 py-2.5 text-[14px] font-semibold text-band-ink no-underline transition-colors hover:border-white/45"
          >
            Read the regions
          </Link>
        </motion.div>

        <div className="mt-11 grid gap-px border-t border-white/10 bg-white/10 md:grid-cols-3">
          {axes.map((axis, i) => (
            <motion.div
              key={axis.key}
              initial={reduced ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.32 + i * 0.08 }}
              className="bg-band px-5 pb-6 pt-5"
            >
              <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#4fbfa4]">
                {axis.key}
              </div>
              <div className="mt-2 text-[19px] font-semibold tracking-[-0.01em] text-band-ink">
                {axis.title}
              </div>
              <p className="mt-1.5 text-[13.5px] leading-snug text-band-muted">{axis.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </header>
  )
}

const stats = [
  { value: 103.3, decimals: 1, suffix: ' mb/d', label: 'World atmospheric distillation capacity' },
  { value: topTwoShare, decimals: 0, suffix: '%', label: 'Held by China and the United States alone' },
  { value: 13, decimals: 0, prefix: '>', label: 'Average Nelson index, US Gulf Coast — the world’s deepest conversion' },
  { value: 6.5, decimals: 1, prefix: '~', label: 'Average Nelson index, Europe — largely built for sweet crude' },
  { value: 21.1, decimals: 1, label: 'Nelson index at Jamnagar, the most complex refinery on earth' },
]

function StatBand() {
  return (
    <div className="border-b border-rule bg-rule">
      <div className="mx-auto max-w-[1180px] px-6">
        <div className="grid grid-cols-2 gap-px bg-rule lg:grid-cols-5">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-surface px-4 py-5">
              <div className="text-[29px] font-bold leading-tight tracking-[-0.02em]">
                <CountUp
                  value={stat.value}
                  decimals={stat.decimals}
                  prefix={stat.prefix ?? ''}
                  suffix={stat.suffix ?? ''}
                />
              </div>
              <div className="mt-1.5 text-[12px] leading-snug text-muted">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function ReadingASlate() {
  return (
    <section className="py-14">
      <div className="mx-auto max-w-[1180px] px-6">
        <Reveal>
          <h2 className="text-[clamp(24px,3vw,32px)] font-semibold tracking-[-0.022em]">
            Reading a slate
          </h2>
        </Reveal>

        <div className="mt-7 grid items-start gap-11 lg:grid-cols-[1.25fr_0.95fr] [&>*]:min-w-0">
          <Reveal>
            <p className="prose-editorial">
              The economics are simple and the engineering is not. Heavy sour crude trades at a
              discount to light sweet because fewer plants can run it — the discount is the market
              paying for kit that most refiners do not own. A refinery with a coker and a big
              hydrotreater buys that discount and converts residue into diesel; a hydroskimmer
              without them buys expensive light sweet crude and still ends up with fuel oil it can
              barely sell.
            </p>
            <p className="prose-editorial mt-4">
              That is why “capacity” alone misleads. Europe has roughly 13–14 mb/d of distillation
              capacity but an average complexity around 6.5, so much of it competes for the same
              light sweet barrels as everyone else. India has a third of that capacity and can run
              almost anything on the water. When sanctions redirect a heavy sour stream — Urals,
              Merey, Iranian Heavy — the barrels do not go wherever is nearest.{' '}
              <strong>They go wherever there is a coker.</strong>
            </p>

            <Stagger className="mt-6 flex flex-col gap-px overflow-hidden rounded-lg border border-rule bg-rule">
              {complexityTiers.map((tier) => (
                <StaggerItem key={tier.name}>
                  <div className="grid grid-cols-[64px_1fr] items-start gap-4 bg-surface px-4 py-3.5">
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
                </StaggerItem>
              ))}
            </Stagger>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="rounded-lg border border-rule bg-surface p-5 shadow-card">
              <h3 className="text-[15px] font-semibold">Why heavy crude needs a coker</h3>
              <div className="mt-3">
                <BarrelYield />
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

function CrudeMap() {
  return (
    <section className="border-y border-rule bg-surface-2 py-14">
      <div className="mx-auto max-w-[1180px] px-6">
        <Reveal>
          <h2 className="text-[clamp(24px,3vw,32px)] font-semibold tracking-[-0.022em]">
            The crude map
          </h2>
          <p className="prose-editorial mt-2.5 max-w-[70ch]">
            Where the world’s traded grades sit on the two axes that matter, and where the capacity
            to process them actually lives.
          </p>
        </Reveal>

        <div className="mt-7 grid gap-5 lg:grid-cols-[1.35fr_1fr] [&>*]:min-w-0">
          <Reveal>
            <div className="h-full rounded-[10px] border border-rule bg-surface p-5 shadow-card">
              <h3 className="text-[16px] font-semibold tracking-[-0.01em]">
                API gravity vs sulphur content
              </h3>
              <p className="mt-1 text-[12.5px] text-muted">
                Typical assay values for traded crude streams. Up and left is harder to refine.
              </p>
              <div className="mt-2">
                <CrudeScatter />
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="h-full rounded-[10px] border border-rule bg-surface p-5 shadow-card">
              <h3 className="text-[16px] font-semibold tracking-[-0.01em]">Capacity by region</h3>
              <p className="mt-1 text-[12.5px] text-muted">
                Share of {formatMbd(totalCapacityKbd)} mb/d of world distillation capacity.
              </p>
              <RegionStack />
              <p className="mt-5 text-[12.5px] leading-relaxed text-muted">
                Asia-Pacific overtook the Atlantic basin during the 2010s and the gap is still
                widening: essentially all net capacity added since 2020 sits in China, India and the
                Gulf, while Europe, Japan and Australia have been closing plants.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

function Rankings() {
  return (
    <section className="py-14">
      <div className="mx-auto max-w-[1180px] px-6">
        <Reveal>
          <h2 className="text-[clamp(24px,3vw,32px)] font-semibold tracking-[-0.022em]">
            Twenty countries, four fifths of the world
          </h2>
          <p className="prose-editorial mt-2.5 max-w-[70ch]">
            Nameplate atmospheric distillation capacity. Several of these plants are not running
            anywhere near it — Russia’s fleet is under sustained drone attack, Venezuela’s has been
            decaying for a decade, and Mexico’s utilisation has rarely cleared 60%.
          </p>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="mt-7 rounded-[10px] border border-rule bg-surface p-5 shadow-card">
            <CapacityBars />
            <p className="mt-4 text-[12.5px] leading-relaxed text-muted">
              Bars are coloured by region; select any country for its full slate.{' '}
              <Link to="/atlas" className="text-accent">
                See all {countries.length} countries →
              </Link>
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function RegionReads() {
  return (
    <section className="border-t border-rule bg-surface-2 py-14">
      <div className="mx-auto max-w-[1180px] px-6">
        <Reveal>
          <h2 className="text-[clamp(24px,3vw,32px)] font-semibold tracking-[-0.022em]">
            What the slate explains in 2026
          </h2>
        </Reveal>

        <Stagger className="mt-7 grid gap-px overflow-hidden rounded-[10px] border border-rule bg-rule md:grid-cols-2 xl:grid-cols-3">
          {regions.map((region) => {
            const essay = regionEssays[region.code]
            return (
              <StaggerItem key={region.code}>
                <Link
                  to={`/regions/${region.code.toLowerCase()}`}
                  className="group flex h-full flex-col bg-surface px-5 py-5.5 no-underline transition-colors hover:bg-accent-wash"
                >
                  <span className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-accent">
                    {essay.tag}
                  </span>
                  <h3 className="mt-2.5 text-[16px] font-semibold leading-snug tracking-[-0.01em] text-ink">
                    {essay.headline}
                  </h3>
                  <p className="mt-2 text-[13.5px] leading-relaxed text-ink-2">
                    {essay.standfirst}
                  </p>
                  <span className="mt-auto pt-4 font-mono text-[11px] uppercase tracking-[0.1em] text-muted transition-colors group-hover:text-accent">
                    Read →
                  </span>
                </Link>
              </StaggerItem>
            )
          })}
        </Stagger>
      </div>
    </section>
  )
}
