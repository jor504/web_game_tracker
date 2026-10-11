export function Pricing() {
  return (
    <section id="pricing" className="relative py-20 sm:py-28">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="max-w-2xl mb-12 stagger">
          <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-[-0.03em] text-fg leading-[1.05]">
            Gratis. Para siempre.
          </h2>
          <p className="mt-5 text-muted text-lg leading-relaxed">
            Sin paywalls, sin tiers oscuros. Tu backlog es tuyo.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4 max-w-3xl stagger">
          <div className="glass rounded-2xl p-7 lift relative overflow-hidden">
            <div className="flex items-baseline justify-between mb-1">
              <h3 className="font-display text-xl font-bold text-fg">Backlog</h3>
              <span className="text-xs text-muted">v2</span>
            </div>
            <div className="flex items-end gap-1 mb-6">
              <span className="font-display text-5xl font-bold text-fg">$0</span>
              <span className="text-sm text-muted mb-1.5">siempre</span>
            </div>
            <ul className="space-y-3 text-sm">
              {[
                'Backlog ilimitado',
                'Búsqueda en RAWG',
                'Estados y calificaciones',
                'Filtros por plataforma y formato',
                'Vista cuadrícula y lista',
                'Modo claro y oscuro',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-muted">
                  <svg className="w-4 h-4 text-[var(--accent)] mt-0.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6 9 17l-5-5"/>
                  </svg>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative rounded-2xl p-7 lift overflow-hidden border border-[var(--accent)]/40 bg-gradient-to-br from-[var(--accent)]/8 via-[var(--color-violet-500)]/5 to-transparent">
            <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-[var(--accent)]/30 blur-3xl" />
            <div className="relative">
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[var(--accent)]/20 border border-[var(--accent)]/40 text-[10px] font-bold uppercase tracking-wider text-[var(--accent)] mb-3">
                <span className="w-1 h-1 rounded-full bg-[var(--accent)] anim-pulse-glow" />
                Próximamente
              </div>
              <h3 className="font-display text-xl font-bold text-fg mb-1">Backlog+</h3>
              <p className="text-xs text-muted mb-6">Para los que quieren más.</p>
              <ul className="space-y-3 text-sm">
                {[
                  'Todo lo del plan gratis',
                  'Sincronización entre dispositivos',
                  'Estadísticas y gráficas',
                  'Listas y colecciones',
                  'Importar/exportar bibliotecas',
                  'Soporte prioritario',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-fg">
                    <svg className="w-4 h-4 text-[var(--accent)] mt-0.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6 9 17l-5-5"/>
                    </svg>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}