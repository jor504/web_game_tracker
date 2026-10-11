'use client'

import { useTheme } from 'next-themes'
import { useSyncExternalStore } from 'react'

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  )

  if (!mounted) {
    return <div className="w-9 h-9 rounded-full bg-[var(--surface)] border border-[var(--line)]" />
  }

  const isDark = resolvedTheme === 'dark'

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={isDark ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
      title={isDark ? 'Tema claro' : 'Tema oscuro'}
      className="relative w-9 h-9 grid place-items-center rounded-full border border-[var(--line)] bg-[var(--surface)] hover:bg-[var(--surface-hover)] hover:border-[var(--line-strong)] transition-colors"
    >
      <svg
        viewBox="0 0 24 24"
        className={`absolute w-4 h-4 transition-all duration-500 ${isDark ? 'opacity-0 -rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100 text-[var(--accent)]'}`}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 3v2M12 19v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M3 12h2M19 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
      </svg>
      <svg
        viewBox="0 0 24 24"
        className={`absolute w-4 h-4 transition-all duration-500 ${isDark ? 'opacity-100 rotate-0 scale-100 text-[var(--accent)]' : 'opacity-0 rotate-90 scale-50'}`}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 14a8 8 0 1 1-9-11 6 6 0 0 0 9 11Z" />
      </svg>
    </button>
  )
}