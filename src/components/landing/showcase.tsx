import { BacklogPreview } from './backlog-preview'

export function Showcase() {
  return (
    <section id="showcase" className="relative py-20 sm:py-28">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="max-w-2xl mb-12 stagger">
          <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-[-0.03em] text-fg leading-[1.05]">
            Vista de un vistazo.
          </h2>
          <p className="mt-5 text-muted text-lg leading-relaxed">
            Tu backlog entero, una pantalla. Filtros instantáneos, ratings visibles, portadas en grande.
          </p>
        </div>

        <div className="relative max-w-full overflow-hidden">
          <div className="absolute -inset-x-6 -top-6 -bottom-6 bg-gradient-to-br from-[var(--color-neon-400)]/8 via-transparent to-[var(--color-violet-500)]/10 blur-3xl pointer-events-none" />
          <div className="relative">
            <BacklogPreview />
          </div>
        </div>
      </div>
    </section>
  )
}