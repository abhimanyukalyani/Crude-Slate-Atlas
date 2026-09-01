import { motion, useScroll, useSpring } from 'framer-motion'
import { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { ThemeToggle } from './ThemeToggle'

const links = [
  { to: '/atlas', label: 'The atlas' },
  { to: '/regions', label: 'Regions' },
  { to: '/refineries', label: 'Refineries' },
  { to: '/methodology', label: 'Methodology' },
]

export function SiteHeader() {
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 180, damping: 30, restDelta: 0.001 })
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-rule bg-plane/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1180px] items-center gap-4 px-6 py-3">
        <Link
          to="/"
          className="flex items-baseline gap-2 no-underline"
          onClick={() => setOpen(false)}
        >
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent">CSA</span>
          <span className="text-[15px] font-semibold tracking-[-0.015em] text-ink">
            Crude Slate Atlas
          </span>
        </Link>

        <nav className="ml-auto hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `rounded-md px-3 py-1.5 text-[13.5px] font-medium no-underline transition-colors ${
                  isActive ? 'bg-accent-wash text-accent' : 'text-ink-2 hover:text-ink'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto md:ml-2">
          <ThemeToggle />
        </div>

        <button
          className="grid h-8 w-8 place-items-center rounded-md border border-rule text-ink-2 md:hidden"
          aria-label="Menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span aria-hidden>{open ? '✕' : '☰'}</span>
        </button>
      </div>

      {open && (
        <nav className="border-t border-rule bg-surface px-6 py-2 md:hidden">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `block rounded-md px-2 py-2.5 text-[14px] font-medium no-underline ${
                  isActive ? 'text-accent' : 'text-ink-2'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      )}

      <motion.div
        className="h-px origin-left bg-accent"
        style={{ scaleX: progress }}
        aria-hidden
      />
    </header>
  )
}
