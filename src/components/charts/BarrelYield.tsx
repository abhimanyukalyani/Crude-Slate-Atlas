import { motion, useReducedMotion } from 'framer-motion'

const cuts = [
  { name: 'Naphtha', light: 22, heavy: 9 },
  { name: 'Jet / kero', light: 13, heavy: 8 },
  { name: 'Diesel', light: 25, heavy: 17 },
  { name: 'VGO', light: 22, heavy: 22 },
  { name: 'Residue', light: 18, heavy: 44 },
]

const shades = ['#cde2fb', '#9ec5f4', '#5598e7', '#256abf', '#0d366b']

const TOP = 46
const HEIGHT = 214
const WIDTH = 74

/** Stacks each cut into {y, h}, so nothing has to be accumulated during render. */
const bands = (key: 'light' | 'heavy') => {
  let cursor = TOP
  return cuts.map((cut) => {
    const h = (HEIGHT * cut[key]) / 100
    const y = cursor
    cursor += h
    return { ...cut, value: cut[key], y, h }
  })
}

const lightBands = bands('light')
const heavyBands = bands('heavy')

/** Straight-run yields side by side: where the heavy barrel's volume actually goes. */
export function BarrelYield() {
  const reduced = useReducedMotion()

  const column = (band: ReturnType<typeof bands>, xPos: number) =>
    band.map((cut, i) => (
      <g key={`${xPos}-${cut.name}`}>
        <motion.rect
          x={xPos}
          y={cut.y + 1}
          width={WIDTH}
          height={Math.max(1, cut.h - 2)}
          rx={2}
          fill={shades[i]}
          initial={reduced ? false : { opacity: 0, scaleY: 0 }}
          whileInView={{ opacity: 1, scaleY: 1 }}
          viewport={{ once: true, margin: '-40px' }}
          style={{ transformOrigin: `${xPos + WIDTH / 2}px ${cut.y + cut.h / 2}px` }}
          transition={{ duration: 0.5, delay: reduced ? 0 : i * 0.08 }}
        />
        {cut.h > 13 && (
          <text
            x={xPos + WIDTH / 2}
            y={cut.y + cut.h / 2 + 3.5}
            textAnchor="middle"
            className="font-mono text-[10px]"
            fill={i >= 2 ? '#ffffff' : '#0b2748'}
          >
            {cut.value}%
          </text>
        )}
      </g>
    ))

  return (
    <figure className="m-0">
      <svg
        viewBox="0 0 300 296"
        className="block h-auto w-full"
        role="img"
        aria-label="Straight-run yields from light sweet crude versus heavy sour crude: the light barrel gives 18 percent residue, the heavy barrel 44 percent"
      >
        <text x={133} y={15} textAnchor="middle" className="fill-muted font-mono text-[10px]">
          LIGHT SWEET
        </text>
        <text
          x={133}
          y={29}
          textAnchor="middle"
          className="fill-muted font-mono text-[10px]"
          opacity={0.65}
        >
          38° · 0.4% S
        </text>
        <text x={233} y={15} textAnchor="middle" className="fill-muted font-mono text-[10px]">
          HEAVY SOUR
        </text>
        <text
          x={233}
          y={29}
          textAnchor="middle"
          className="fill-muted font-mono text-[10px]"
          opacity={0.65}
        >
          21° · 3.6% S
        </text>

        {column(lightBands, 96)}
        {column(heavyBands, 196)}

        {lightBands.map((cut) => (
          <text
            key={cut.name}
            x={88}
            y={cut.y + cut.h / 2 + 3.5}
            textAnchor="end"
            className="fill-muted font-mono text-[10px]"
          >
            {cut.name}
          </text>
        ))}

        <text x={150} y={283} textAnchor="middle" className="fill-muted font-mono text-[10px]">
          bands aligned to the light barrel’s cuts
        </text>
      </svg>
      <figcaption className="mt-3 text-[12.5px] leading-relaxed text-muted">
        Indicative straight-run yields; VGO is vacuum gasoil, the feed a cat cracker turns into
        gasoline. The heavy barrel gives up roughly half its volume as residue — tar a simple
        refinery can only sell as bunker fuel or bitumen. A coker turns that residue into distillate,
        which is the whole reason the discount exists.
      </figcaption>
    </figure>
  )
}
