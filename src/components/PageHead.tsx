import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'

export function PageHead({
  eyebrow,
  title,
  standfirst,
  children,
}: {
  eyebrow: string
  title: string
  standfirst?: string
  children?: ReactNode
}) {
  const reduced = useReducedMotion()
  const rise = (delay: number) => ({
    initial: reduced ? false : { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.55, delay, ease: [0.22, 0.65, 0.3, 1] as const },
  })

  return (
    <div className="border-b border-rule pb-8">
      <motion.div {...rise(0)} className="eyebrow">
        {eyebrow}
      </motion.div>
      <motion.h1
        {...rise(0.06)}
        className="mt-3 max-w-[20ch] text-[clamp(30px,4.4vw,50px)] font-bold leading-[1.06] tracking-[-0.025em]"
      >
        {title}
      </motion.h1>
      {standfirst && (
        <motion.p {...rise(0.12)} className="prose-editorial mt-4">
          {standfirst}
        </motion.p>
      )}
      {children && (
        <motion.div {...rise(0.18)} className="mt-5">
          {children}
        </motion.div>
      )}
    </div>
  )
}
