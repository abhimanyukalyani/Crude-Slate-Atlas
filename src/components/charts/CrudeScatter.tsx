import { motion, useInView, useReducedMotion } from 'framer-motion'
import { useRef, useState } from 'react'
import { grades } from '@/lib/atlas'

const W = 620
const H = 430
const M = { t: 24, r: 18, b: 52, l: 56 }
const xw = W - M.l - M.r
const yh = H - M.t - M.b
const X_MIN = 8
const X_MAX = 48
const Y_MIN = 0
const Y_MAX = 6

const x = (v: number) => M.l + ((v - X_MIN) / (X_MAX - X_MIN)) * xw
const y = (v: number) => M.t + yh - ((v - Y_MIN) / (Y_MAX - Y_MIN)) * yh

const xTicks = [10, 15, 20, 25, 30, 35, 40, 45]
const yTicks = [0, 1, 2, 3, 4, 5, 6]

/**
 * API gravity against sulphur. Up and to the left is the barrel almost nobody
 * can run — which is exactly where the discount lives.
 */
export function CrudeScatter() {
  const reduced = useReducedMotion()
  const [active, setActive] = useState<number | null>(null)
  // The observer has to sit on an HTML element: IntersectionObserver does not
  // report SVG children in every engine, which would strand the dots hidden.
  const plotRef = useRef<HTMLDivElement>(null)
  const inView = useInView(plotRef, { once: true, margin: '-40px' })

  return (
    <figure className="m-0">
      <div className="overflow-x-auto" ref={plotRef}>
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="block h-auto w-full min-w-[440px]"
          role="img"
          aria-label="Scatter plot of traded crude grades by API gravity and sulphur content"
        >
          {/* hard-to-refine quadrant */}
          <rect
            x={x(X_MIN)}
            y={y(Y_MAX)}
            width={x(25) - x(X_MIN)}
            height={y(1.5) - y(Y_MAX)}
            fill="var(--csa-accent-wash)"
          />
          <text
            x={x(X_MIN) + 10}
            y={y(Y_MAX) + 18}
            className="fill-muted font-mono text-[9.5px] tracking-[0.08em]"
          >
            HEAVY · SOUR — NEEDS A COKER
          </text>
          <text
            x={x(X_MAX) - 10}
            y={y(0.15)}
            textAnchor="end"
            className="fill-muted font-mono text-[9.5px] tracking-[0.08em]"
          >
            LIGHT · SWEET — ANY REFINERY
          </text>

          {/* grid */}
          {xTicks.map((t) => (
            <line
              key={`x${t}`}
              x1={x(t)}
              x2={x(t)}
              y1={M.t}
              y2={M.t + yh}
              stroke="var(--csa-rule-soft)"
              strokeWidth={1}
            />
          ))}
          {yTicks.map((t) => (
            <line
              key={`y${t}`}
              x1={M.l}
              x2={M.l + xw}
              y1={y(t)}
              y2={y(t)}
              stroke="var(--csa-rule-soft)"
              strokeWidth={1}
            />
          ))}

          {/* axes */}
          <line
            x1={M.l}
            x2={M.l + xw}
            y1={M.t + yh}
            y2={M.t + yh}
            stroke="var(--csa-rule)"
            strokeWidth={1}
          />
          <line x1={M.l} x2={M.l} y1={M.t} y2={M.t + yh} stroke="var(--csa-rule)" strokeWidth={1} />

          {xTicks.map((t) => (
            <text
              key={`xl${t}`}
              x={x(t)}
              y={M.t + yh + 16}
              textAnchor="middle"
              className="fill-muted font-mono text-[10px]"
            >
              {t}°
            </text>
          ))}
          {yTicks.map((t) => (
            <text
              key={`yl${t}`}
              x={M.l - 10}
              y={y(t) + 3.5}
              textAnchor="end"
              className="fill-muted font-mono text-[10px]"
            >
              {t}%
            </text>
          ))}

          <text
            x={M.l + xw / 2}
            y={H - 12}
            textAnchor="middle"
            className="fill-ink-2 font-sans text-[11.5px] font-semibold"
          >
            API gravity — lighter to the right
          </text>
          <text
            x={-(M.t + yh / 2)}
            y={15}
            transform="rotate(-90)"
            textAnchor="middle"
            className="fill-ink-2 font-sans text-[11.5px] font-semibold"
          >
            Sulphur content — sourer upward
          </text>

          {grades.map((grade, i) => {
            const isActive = active === grade.id
            const cx = x(grade.api_gravity)
            const cy = y(grade.sulphur_pct)
            return (
              <g key={grade.id}>
                <motion.circle
                  cx={cx}
                  cy={cy}
                  r={isActive ? 8 : 5.5}
                  fill={grade.sanctioned ? 'var(--csa-s2)' : 'var(--csa-s1)'}
                  fillOpacity={active === null || isActive ? 0.92 : 0.28}
                  stroke="var(--csa-surface)"
                  strokeWidth={1.5}
                  className="cursor-pointer"
                  initial={reduced ? false : { opacity: 0 }}
                  animate={reduced ? undefined : { opacity: inView ? 1 : 0 }}
                  transition={{ duration: 0.4, delay: reduced ? 0 : i * 0.015 }}
                  onMouseEnter={() => setActive(grade.id)}
                  onMouseLeave={() => setActive(null)}
                />
                {isActive && (
                  <g pointerEvents="none">
                    <text
                      x={cx}
                      y={cy - 14}
                      textAnchor="middle"
                      className="fill-ink font-sans text-[12px] font-semibold"
                    >
                      {grade.name}
                    </text>
                    <text
                      x={cx}
                      y={cy - 1}
                      textAnchor="middle"
                      className="fill-muted font-mono text-[10px]"
                      dy={16}
                    >
                      {grade.api_gravity}° · {grade.sulphur_pct}% S · {grade.origin}
                    </text>
                  </g>
                )}
              </g>
            )
          })}
        </svg>
      </div>

      <div className="mt-3.5 flex flex-wrap gap-3.5 border-t border-rule-soft pt-3">
        <Legend color="var(--csa-s1)" label="Freely traded grade" />
        <Legend color="var(--csa-s2)" label="Under sanction or embargo (2026)" />
      </div>
      <figcaption className="mt-3 text-[12.5px] leading-relaxed text-muted">
        Hover any grade for its assay. Sanctioned barrels are chemically ordinary — their discounts
        come from politics, which is exactly why the buyers changed and the assays did not.
      </figcaption>
    </figure>
  )
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2 text-[12.5px] text-ink-2">
      <span className="h-2.5 w-2.5 shrink-0 rounded-[3px]" style={{ background: color }} />
      {label}
    </div>
  )
}
