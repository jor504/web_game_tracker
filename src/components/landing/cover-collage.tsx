'use client'

import { useSyncExternalStore } from 'react'

type Cover = {
  title: string
  platform: string
  rating: number
  status: 'Jugando' | 'Terminado' | 'Pendiente' | 'Abandonado'
  hue: number
  pattern: 'grid' | 'orbs' | 'lines' | 'glow' | 'triangle'
}

const COVERS: Cover[] = [
  { title: 'Elden Veil', platform: 'PS5', rating: 9.6, status: 'Jugando', hue: 24, pattern: 'orbs' },
  { title: 'Hollow Tide', platform: 'PC', rating: 9.2, status: 'Terminado', hue: 200, pattern: 'glow' },
  { title: 'Cyber Drift', platform: 'PC', rating: 8.8, status: 'Jugando', hue: 320, pattern: 'grid' },
  { title: 'Stellar Outpost', platform: 'Switch', rating: 8.4, status: 'Pendiente', hue: 38, pattern: 'lines' },
  { title: 'Phantom Loop', platform: 'Xbox', rating: 9.0, status: 'Terminado', hue: 12, pattern: 'triangle' },
  { title: 'Wraithborn', platform: 'PS5', rating: 9.4, status: 'Pendiente', hue: 248, pattern: 'orbs' },
]

const STATUS_TONE: Record<Cover['status'], { fg: string; bg: string }> = {
  Jugando:    { fg: '#3a2818', bg: '#e89262' },
  Terminado:  { fg: '#28331a', bg: '#a4b27a' },
  Pendiente:  { fg: '#2a2419', bg: '#dcccae' },
  Abandonado: { fg: '#fff1f2', bg: '#b53b4a' },
}

export function CoverCollage() {
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  )

  return (
    <div className="relative w-full max-w-full sm:max-w-[440px] mx-auto aspect-[5/6] overflow-hidden">
      <div className="relative h-full">
        <div className={`relative h-full grid grid-cols-3 grid-rows-4 gap-1.5 sm:gap-3 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}>
          <div className="col-span-2 row-span-2 row-start-1 col-start-1 relative rounded-xl overflow-hidden border border-[var(--line-strong)] shadow-card lift">
            <CoverArt cover={COVERS[0]} featured />
          </div>

          <div className="col-span-1 row-span-1 col-start-3 row-start-1 relative rounded-lg overflow-hidden border border-[var(--line)] shadow-soft lift" style={{ animationDelay: '0.1s' }}>
            <CoverArt cover={COVERS[1]} />
          </div>

          <div className="col-span-1 row-span-1 col-start-3 row-start-2 relative rounded-lg overflow-hidden border border-[var(--line)] shadow-soft lift" style={{ animationDelay: '0.15s' }}>
            <CoverArt cover={COVERS[2]} />
          </div>

          <div className="col-span-1 row-span-2 row-start-3 col-start-1 relative rounded-lg overflow-hidden border border-[var(--line)] shadow-soft lift" style={{ animationDelay: '0.2s' }}>
            <CoverArt cover={COVERS[3]} />
          </div>
          <div className="col-span-1 row-span-2 row-start-3 col-start-2 relative rounded-lg overflow-hidden border border-[var(--line)] shadow-soft lift" style={{ animationDelay: '0.25s' }}>
            <CoverArt cover={COVERS[4]} />
          </div>
          <div className="col-span-1 row-span-2 row-start-3 col-start-3 relative rounded-lg overflow-hidden border border-[var(--line)] shadow-soft lift" style={{ animationDelay: '0.3s' }}>
            <CoverArt cover={COVERS[5]} />
          </div>
        </div>

        {/* Floating "added" badge — sticker style */}
        <div className="hidden sm:flex absolute -left-6 top-1/3 bg-[var(--surface)] rounded-lg border border-[var(--line)] px-3.5 py-2.5 shadow-elevated anim-fade-up items-center gap-3" style={{ animationDelay: '0.6s' }}>
          <div className="w-8 h-8 rounded-md grid place-items-center" style={{ background: 'var(--accent)' }}>
            <svg className="w-3.5 h-3.5 text-[var(--bg-base)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6 9 17l-5-5"/>
            </svg>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-[0.15em] text-subtle leading-none">Añadido</div>
            <div className="font-display text-sm font-semibold text-fg leading-tight mt-0.5">Hollow Tide</div>
          </div>
        </div>
      </div>

      {/* Floating stats — paper note style */}
      <div className="hidden sm:flex absolute -right-2 bottom-8 bg-[var(--surface)] rounded-lg border border-[var(--line)] px-4 py-3 shadow-elevated anim-fade-up items-center gap-4" style={{ animationDelay: '0.8s' }}>
        <div>
          <div className="text-[10px] uppercase tracking-[0.15em] text-subtle">Tu colección</div>
          <div className="font-display figure-num text-2xl font-semibold text-fg leading-none mt-0.5">128</div>
        </div>
        <div className="h-8 w-px bg-[var(--line)]" />
        <div>
          <div className="text-[10px] uppercase tracking-[0.15em] text-subtle">Este año</div>
          <div className="font-display figure-num text-2xl font-semibold text-[var(--accent)] leading-none mt-0.5">+24</div>
        </div>
      </div>
    </div>
  )
}

function CoverArt({ cover, featured }: { cover: Cover; featured?: boolean }) {
  const tone = STATUS_TONE[cover.status]
  return (
    <>
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at 30% 20%, hsl(${cover.hue} 50% 50% / 0.85), transparent 55%),
                       radial-gradient(circle at 80% 80%, hsl(${(cover.hue + 40) % 360} 55% 35% / 0.85), transparent 55%),
                       linear-gradient(135deg, hsl(${cover.hue} 30% 16%) 0%, hsl(${(cover.hue + 20) % 360} 25% 8%) 100%)`,
        }}
      />
      <svg className="absolute inset-0 w-full h-full mix-blend-overlay opacity-50" viewBox="0 0 100 140" preserveAspectRatio="xMidYMid slice">
        {cover.pattern === 'grid' && (
          <defs>
            <pattern id={`g-${cover.hue}`} width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.4" opacity="0.4" />
            </pattern>
          </defs>
        )}
        {cover.pattern === 'grid' && <rect width="100" height="140" fill={`url(#g-${cover.hue})`} />}
        {cover.pattern === 'orbs' && (
          <>
            <circle cx="20" cy="40" r="14" fill="white" opacity="0.15" />
            <circle cx="70" cy="100" r="20" fill="white" opacity="0.10" />
            <circle cx="50" cy="20" r="6" fill="white" opacity="0.25" />
          </>
        )}
        {cover.pattern === 'lines' && (
          <>
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <line key={i} x1="0" y1={20 + i * 20} x2="100" y2={10 + i * 20} stroke="white" strokeWidth="0.5" opacity="0.2" />
            ))}
          </>
        )}
        {cover.pattern === 'glow' && (
          <>
            <circle cx="50" cy="70" r="30" fill="white" opacity="0.18" />
            <circle cx="50" cy="70" r="20" fill="white" opacity="0.22" />
          </>
        )}
        {cover.pattern === 'triangle' && (
          <polygon points="50,20 80,80 20,80" fill="none" stroke="white" strokeWidth="0.6" opacity="0.35" />
        )}
      </svg>

      <div className="absolute top-2 right-2">
        <span
          className="text-[9px] font-semibold uppercase tracking-[0.12em] px-1.5 py-0.5 rounded"
          style={{ background: tone.bg, color: tone.fg }}
        >
          {cover.status}
        </span>
      </div>

      <div className="absolute inset-x-0 bottom-0 p-2.5 sm:p-3 flex items-end justify-between gap-2">
        <div className="min-w-0">
          <div className="text-[10px] uppercase tracking-[0.15em] text-white/70 truncate">{cover.platform}</div>
          <div className={`font-display font-semibold text-white leading-tight truncate ${featured ? 'text-base sm:text-lg' : 'text-[11px]'}`}>
            {cover.title}
          </div>
        </div>
        <div className="flex items-center gap-0.5 text-[10px] font-bold text-white shrink-0">
          <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
          {cover.rating.toFixed(1)}
        </div>
      </div>
    </>
  )
}