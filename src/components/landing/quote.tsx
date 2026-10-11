export function LandingQuote() {
  return (
    <section className="relative py-20 sm:py-28 border-t border-[var(--line)] paper-edge">
      <div className="max-w-3xl mx-auto px-5 sm:px-8 text-center stagger">
        <svg
          className="mx-auto w-10 h-10 text-[var(--accent)] mb-8"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden
        >
          <path d="M7 7c-1.7 1.3-3 3.4-3 5.5C4 15 5.5 17 8 17c2 0 3-1.4 3-3.3 0-1.8-1.3-3.2-3-3.2-.3 0-.6 0-.9.1.2-1.2 1.2-2.7 2.6-3.7L7 7zm10 0c-1.7 1.3-3 3.4-3 5.5 0 2.5 1.5 4.5 4 4.5 2 0 3-1.4 3-3.3 0-1.8-1.3-3.2-3-3.2-.3 0-.6 0-.9.1.2-1.2 1.2-2.7 2.6-3.7L17 7z" />
        </svg>
        <blockquote className="font-display text-3xl sm:text-4xl lg:text-5xl font-medium tracking-[-0.02em] text-fg leading-[1.15]">
          Cada juego terminado es una línea que se cierra. Cada pendiente, una promesa que vuelve cuando quieras.
        </blockquote>
        <div className="mt-8 flex items-center justify-center gap-3 text-sm text-muted">
          <span className="w-8 h-px bg-[var(--line-strong)]" />
          <span className="italic">GameBacklog</span>
          <span className="w-8 h-px bg-[var(--line-strong)]" />
        </div>
      </div>
    </section>
  )
}