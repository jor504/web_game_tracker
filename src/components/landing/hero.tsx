import Link from 'next/link'
import { CoverCollage } from './cover-collage'

export function LandingHero() {
  return (
    <section className="relative pt-10 sm:pt-16 pb-16 sm:pb-24">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-16 items-center">
          <div className="stagger flex flex-col gap-7">
            <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.22em] text-subtle">
              <span className="w-6 h-px bg-[var(--line-strong)]" />
              <span>Edición n° 01 — para jugadores</span>
            </div>

            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-medium tracking-[-0.025em] leading-[1.02] text-fg">
              Una colección,
              <br />
              <span className="italic text-[var(--accent)]">con calma.</span>
            </h1>

            <p className="text-lg text-muted leading-relaxed max-w-xl">
              Un lugar tranquilo para llevar el registro de los juegos que quieres jugar, los que estás jugando y los que ya terminaste. Sin hojas de cálculo. Sin prisa.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/login"
                className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-full font-semibold text-[var(--bg-base)] bg-[var(--accent)] hover:bg-[var(--accent-strong)] transition-colors"
              >
                Empezar gratis
                <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M13 5l7 7-7 7"/>
                </svg>
              </Link>
              <a
                href="#features"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full font-semibold text-fg hover:text-[var(--accent)] transition-colors"
              >
                Leer más
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 5v14M5 12l7 7 7-7"/>
                </svg>
              </a>
            </div>

            <dl className="grid grid-cols-3 gap-6 pt-6 max-w-md border-t border-[var(--line)] mt-2 pt-6">
              <Stat n="∞" label="Sin límite" sub="de títulos" />
              <Stat n="1" label="Espacio" sub="solo tuyo" />
              <Stat n="0" label="Anuncios" sub="nunca" />
            </dl>
          </div>

          <div className="relative anim-fade-up" style={{ animationDelay: '0.2s' }}>
            <CoverCollage />
          </div>
        </div>
      </div>
    </section>
  )
}

function Stat({ n, label, sub }: { n: string; label: string; sub: string }) {
  return (
    <div>
      <dd className="font-display figure-num text-3xl font-semibold text-fg leading-none">{n}</dd>
      <dt className="text-[10px] uppercase tracking-[0.18em] text-[var(--accent)] font-semibold mt-2">{label}</dt>
      <p className="text-[11px] text-subtle mt-0.5 leading-tight">{sub}</p>
    </div>
  )
}