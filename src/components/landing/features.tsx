const FEATURES = [
  {
    eyebrow: 'I.',
    title: 'Una biblioteca con sentido',
    body: 'Busca cualquier título y deja que se autocomplete. La portada, el año y los datos se rellenan solos.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </svg>
    ),
  },
  {
    eyebrow: 'II.',
    title: 'Estados a tu ritmo',
    body: 'Pendiente, jugando, terminado o en pausa. Cambias de juego, cambias el estado. Sin ceremonia.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="12" cy="12" r="1" fill="currentColor" />
      </svg>
    ),
  },
  {
    eyebrow: 'III.',
    title: 'Tu ranking personal',
    body: 'Califica cada título del 1 al 10. Con el tiempo, el catálogo revela qué juegos significan más para ti.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 18h18M5 14l4-6 4 4 6-9" />
        <circle cx="9" cy="8" r="1" fill="currentColor" />
        <circle cx="13" cy="6" r="1" fill="currentColor" />
        <circle cx="19" cy="-5" r="1" fill="currentColor" transform="translate(0 14)" />
      </svg>
    ),
  },
  {
    eyebrow: 'IV.',
    title: 'Filtros precisos',
    body: 'Por plataforma, formato y estado. Vista cuadrícula o lista, según te acomode mirar hoy.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 6h18M6 12h12M10 18h4" />
      </svg>
    ),
  },
  {
    eyebrow: 'V.',
    title: 'Privado por defecto',
    body: 'Tus datos viven en tu cuenta, solo en tu cuenta. Cero anuncios, cero trackers, cero ruido.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="11" width="16" height="9" rx="1" />
        <path d="M8 11V7a4 4 0 1 1 8 0v4" />
      </svg>
    ),
  },
  {
    eyebrow: 'VI.',
    title: 'Una sola pantalla',
    body: 'Diseñado para vivir ahí. Lectura cómoda, jerarquía clara, nada compite por tu atención.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="14" rx="1" />
        <path d="M3 9h18" />
      </svg>
    ),
  },
]

export function LandingFeatures() {
  return (
    <section id="features" className="relative py-20 sm:py-28 border-t border-[var(--line)]">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="grid lg:grid-cols-[0.4fr_0.6fr] gap-10 lg:gap-16 mb-14 sm:mb-20">
          <div className="stagger">
            <p className="text-[11px] uppercase tracking-[0.22em] text-[var(--accent)] font-semibold mb-4">
              Lo esencial
            </p>
            <h2 className="font-display text-4xl sm:text-5xl font-medium tracking-[-0.025em] text-fg leading-[1.05]">
              Seis cosas que hace,
              <br />
              <span className="italic text-muted">y nada más.</span>
            </h2>
          </div>
          <p className="text-muted text-lg leading-relaxed self-end stagger">
            Diseñado para una sola tarea: que catalogar tus juegos se sienta como pasar una página, no como llenar un formulario.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[var(--line)] border border-[var(--line)] rounded-2xl overflow-hidden">
          {FEATURES.map((f) => (
            <article
              key={f.title}
              className="group relative bg-[var(--bg-base)] p-7 sm:p-8 lift"
            >
              <div className="flex items-center justify-between mb-12">
                <span className="font-display text-2xl text-subtle italic">{f.eyebrow}</span>
                <div className="w-9 h-9 rounded-md grid place-items-center text-muted group-hover:text-[var(--accent)] transition-colors">
                  <span className="w-4 h-4 block">{f.icon}</span>
                </div>
              </div>
              <h3 className="font-display text-xl sm:text-2xl font-semibold text-fg leading-tight mb-3">{f.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{f.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}