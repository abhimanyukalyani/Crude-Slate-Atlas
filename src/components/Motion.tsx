import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type Variants,
} from 'framer-motion'
import { useEffect, useRef, type ReactNode } from 'react'

/** Sections rise into place once, as the reader reaches them. */
export function Reveal({
  children,
  delay = 0,
  className,
  as = 'div',
}: {
  children: ReactNode
  delay?: number
  className?: string
  as?: 'div' | 'section' | 'article'
}) {
  const reduced = useReducedMotion()
  const Component = motion[as]

  return (
    <Component
      className={className}
      initial={reduced ? false : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, delay, ease: [0.22, 0.65, 0.3, 1] }}
    >
      {children}
    </Component>
  )
}

const staggerParent: Variants = {
  hidden: {},
  shown: { transition: { staggerChildren: 0.06 } },
}

const staggerChild: Variants = {
  hidden: { opacity: 0, y: 14 },
  shown: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 0.65, 0.3, 1] } },
}

/** Lists that should cascade rather than pop in as one block. */
export function Stagger({ children, className }: { children: ReactNode; className?: string }) {
  const reduced = useReducedMotion()
  return (
    <motion.div
      className={className}
      variants={staggerParent}
      initial={reduced ? false : 'hidden'}
      whileInView="shown"
      viewport={{ once: true, margin: '-60px' }}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div className={className} variants={staggerChild}>
      {children}
    </motion.div>
  )
}

const formatter = (decimals: number, prefix: string, suffix: string) => (n: number) =>
  `${prefix}${n.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}${suffix}`

/** Counts a number up when it scrolls into view. */
export function CountUp({
  value,
  decimals = 0,
  prefix = '',
  suffix = '',
  duration = 1.2,
}: {
  value: number
  decimals?: number
  prefix?: string
  suffix?: string
  duration?: number
}) {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const count = useMotionValue(0)
  const format = formatter(decimals, prefix, suffix)
  const text = useTransform(count, format)

  useEffect(() => {
    if (reduced || !inView) return
    const controls = animate(count, value, { duration, ease: [0.16, 1, 0.3, 1] })
    return () => controls.stop()
  }, [count, duration, inView, reduced, value])

  if (reduced) {
    return (
      <span ref={ref} className="tabular">
        {format(value)}
      </span>
    )
  }

  return (
    <span ref={ref} className="tabular">
      <motion.span>{text}</motion.span>
    </span>
  )
}
