import { useState } from 'react'

type Theme = 'light' | 'dark' | 'system'

const read = (): Theme => {
  try {
    const stored = localStorage.getItem('csa-theme')
    if (stored === 'light' || stored === 'dark') return stored
  } catch {
    /* storage unavailable — fall through to system */
  }
  return 'system'
}

const apply = (theme: Theme) => {
  const root = document.documentElement
  if (theme === 'system') root.removeAttribute('data-theme')
  else root.setAttribute('data-theme', theme)
}

export function ThemeToggle() {
  // index.html applies the stored theme before first paint; this just mirrors it.
  const [theme, setTheme] = useState<Theme>(read)

  const choose = (next: Theme) => {
    setTheme(next)
    apply(next)
    try {
      if (next === 'system') localStorage.removeItem('csa-theme')
      else localStorage.setItem('csa-theme', next)
    } catch {
      /* storage unavailable — the choice still applies for this page view */
    }
  }

  const options: { value: Theme; label: string; glyph: string }[] = [
    { value: 'light', label: 'Light', glyph: '☀' },
    { value: 'system', label: 'System', glyph: '◐' },
    { value: 'dark', label: 'Dark', glyph: '☾' },
  ]

  return (
    <div
      role="radiogroup"
      aria-label="Colour theme"
      className="flex items-center gap-0.5 rounded-full border border-rule bg-surface p-0.5"
    >
      {options.map((option) => (
        <button
          key={option.value}
          role="radio"
          aria-checked={theme === option.value}
          aria-label={option.label}
          title={option.label}
          onClick={() => choose(option.value)}
          className={`grid h-6 w-6 place-items-center rounded-full text-[11px] transition-colors ${
            theme === option.value
              ? 'bg-accent text-on-accent'
              : 'text-muted hover:text-ink'
          }`}
        >
          {option.glyph}
        </button>
      ))}
    </div>
  )
}
