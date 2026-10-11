import Link from 'next/link'

export function LandingCTA() {
  return (
    <section className="relative py-20 sm:py-28 border-t border-[var(--line)]">
      <div className="max-w-3xl mx-auto px-5 sm:px-8 text-center stagger">
        <p className="text-[11px] uppercase tracking-[0.22em] text-[var(--accent)] font-semibold mb-5">
          Comienza hoy
        </p>
        <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-medium tracking-[-0.025em] text-fg leading-[1.05]">
          Tu próximo juego
          <br />
          <span className="italic text-muted">te espera.</span>
        </h2>
        <p className="mt-6 text-muted text-lg max-w-xl mx-auto">
          Crea una cuenta en menos de un minuto. Sin tarjeta, sin trampa, sin fecha de caducidad.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-7 py-4 rounded-full font-semibold text-[var(--bg-base)] bg-[var(--accent)] hover:bg-[var(--accent-strong)] transition-colors"
          >
            Crear cuenta
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M13 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}