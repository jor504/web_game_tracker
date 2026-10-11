type Card = {
  title: string
  platform: string
  rating: number
  status: 'Jugando' | 'Terminado' | 'Pendiente'
  hue: number
}

const CARDS: Card[] = [
  { title: 'Elden Veil',          platform: 'PS5',   rating: 9.6, status: 'Jugando',   hue: 280 },
  { title: 'Hollow Tide',         platform: 'PC',    rating: 9.2, status: 'Terminado', hue: 195 },
  { title: 'Cyber Drift',         platform: 'PC',    rating: 8.8, status: 'Jugando',   hue: 320 },
  { title: 'Stellar Outpost',     platform: 'Switch', rating: 8.4, status: 'Pendiente', hue: 30  },
  { title: 'Phantom Loop',        platform: 'Xbox',  rating: 9.0, status: 'Terminado', hue: 0   },
  { title: 'Wraithborn',          platform: 'PS5',   rating: 9.4, status: 'Pendiente', hue: 220 },
]

const STATUS: Record<Card['status'], { fg: string; bg: string }> = {
  Jugando:    { fg: '#ecfeff', bg: 'rgba(34, 211, 238, 0.85)' },
  Terminado:  { fg: '#022c22', bg: 'rgba(74, 222, 128, 0.9)' },
  Pendiente:  { fg: '#1c1917', bg: 'rgba(251, 191, 36, 0.85)' },
}

export function BacklogPreview() {
  return (
    <div className="glass-strong rounded-3xl p-5 sm:p-7 shadow-[var(--shadow-elevated)] overflow-hidden relative scanlines max-w-full">
      {/* Window chrome */}
      <div className="flex items-center gap-3 pb-5 mb-5 border-b border-[var(--line)]">
        <div className="flex gap-1.5">
          <span className="w-3 h-3 rounded-full bg-[var(--color-rose-500)]" />
          <span className="w-3 h-3 rounded-full bg-[var(--color-flame-400)]" />
          <span className="w-3 h-3 rounded-full bg-[var(--color-leaf-500)]" />
        </div>
        <div className="flex-1 flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-lg bg-[var(--surface)] border border-[var(--line)] text-xs text-subtle min-w-0 max-w-md">
          <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
          <span className="font-mono truncate">gamebacklog.app/mi-backlog</span>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-xs text-muted">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-leaf-400)] anim-pulse-glow" />
          <span>Sincronizado</span>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <h3 className="font-display text-2xl font-bold text-fg">Mi backlog</h3>
          <p className="text-xs text-muted mt-0.5">128 títulos · 12 jugando</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--surface)] border border-[var(--line)] text-xs text-muted">
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7"/>
              <path d="m20 20-3.5-3.5"/>
            </svg>
            <span>Buscar…</span>
          </div>
          <div className="flex gap-1 p-0.5 rounded-lg bg-[var(--surface)] border border-[var(--line)]">
            <span className="px-2 py-1 text-[11px] rounded-md bg-[var(--bg-base)] text-fg shadow-sm">Cuadrícula</span>
            <span className="px-2 py-1 text-[11px] rounded-md text-subtle">Lista</span>
          </div>
        </div>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-4 gap-2 sm:gap-3 mb-5">
        <Stat n="12" l="Bien"     tone="cyan"   />
        <Stat n="48" l="Pendiente" tone="violet" />
        <Stat n="61" l="Terminado" tone="leaf"   />
        <Stat n="7"  l="En pausa"  tone="rose"   />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-full">
        {CARDS.map((c) => (
          <article key={c.title} className="relative rounded-xl overflow-hidden border border-[var(--line)] group lift">
            <div
              className="relative aspect-[3/4]"
              style={{
                background: `radial-gradient(circle at 30% 20%, hsl(${c.hue} 90% 60% / 0.7), transparent 55%),
                             radial-gradient(circle at 80% 80%, hsl(${(c.hue + 60) % 360} 80% 50% / 0.7), transparent 55%),
                             linear-gradient(135deg, hsl(${c.hue} 50% 14%) 0%, hsl(${(c.hue + 30) % 360} 60% 8%) 100%)`,
              }}
            >
              <span
                className="absolute top-2 right-2 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded backdrop-blur"
                style={{ background: STATUS[c.status].bg, color: STATUS[c.status].fg }}
              >
                {c.status}
              </span>
              <div className="absolute inset-x-0 bottom-0 p-2.5">
                <div className="text-[9px] uppercase tracking-wider text-white/70">{c.platform}</div>
                <div className="font-display font-bold text-white text-sm leading-tight">{c.title}</div>
              </div>
              <div className="absolute top-2 left-2 flex items-center gap-0.5 text-[10px] font-bold text-white">
                <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                {c.rating.toFixed(1)}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}

function Stat({ n, l, tone }: { n: string; l: string; tone: 'cyan' | 'violet' | 'leaf' | 'rose' }) {
  const tones: Record<typeof tone, string> = {
    cyan:   'text-[var(--accent)] bg-[var(--accent)]/10 border-[var(--accent)]/20',
    violet: 'text-[var(--color-violet-400)] bg-[var(--color-violet-500)]/10 border-[var(--color-violet-500)]/20',
    leaf:   'text-[var(--color-leaf-400)] bg-[var(--color-leaf-500)]/10 border-[var(--color-leaf-500)]/20',
    rose:   'text-[var(--color-rose-400)] bg-[var(--color-rose-500)]/10 border-[var(--color-rose-500)]/20',
  }
  return (
    <div className={`rounded-xl border ${tones[tone]} p-2.5 sm:p-3`}>
      <div className="font-display text-xl sm:text-2xl font-bold">{n}</div>
      <div className="text-[10px] uppercase tracking-wider opacity-80 mt-0.5">{l}</div>
    </div>
  )
}