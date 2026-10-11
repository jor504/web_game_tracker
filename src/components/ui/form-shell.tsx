import Link from 'next/link'

export function FormShell({
  eyebrow,
  title,
  subtitle,
  backHref = '/',
  backLabel = 'Volver al backlog',
  children,
}: {
  eyebrow?: string
  title: string
  subtitle?: string
  backHref?: string
  backLabel?: string
  children: React.ReactNode
}) {
  return (
    <div className="max-w-5xl mx-auto px-5 sm:px-8 py-10 sm:py-16">
      <div className="mb-10 stagger">
        <Link
          href={backHref}
          className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-fg transition-colors mb-6"
        >
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6"/>
          </svg>
          {backLabel}
        </Link>
        {eyebrow && (
          <p className="text-[11px] uppercase tracking-[0.22em] text-[var(--accent)] font-semibold mb-3">{eyebrow}</p>
        )}
        <h1 className="font-display text-5xl sm:text-6xl font-medium tracking-[-0.03em] text-fg leading-[1.0]">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-4 text-muted text-lg max-w-2xl leading-relaxed">{subtitle}</p>
        )}
      </div>
      <div className="stagger">{children}</div>
    </div>
  )
}

export function FormSection({
  number,
  title,
  description,
  children,
}: {
  number: string
  title: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <section className="bg-[var(--surface)] border border-[var(--line)] rounded-2xl overflow-hidden">
      <header className="flex items-start gap-4 px-6 sm:px-8 py-5 border-b border-[var(--line)] bg-[var(--bg-paper)]">
        <span className="font-display italic text-2xl text-subtle leading-none mt-0.5">{number}</span>
        <div className="flex-1">
          <h2 className="font-display text-lg sm:text-xl font-semibold text-fg leading-tight">{title}</h2>
          {description && <p className="text-sm text-muted mt-1 leading-relaxed">{description}</p>}
        </div>
      </header>
      <div className="p-6 sm:p-8">
        {children}
      </div>
    </section>
  )
}