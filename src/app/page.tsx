import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { SearchInput } from '@/components/search-input'
import { DropdownFilters } from '@/components/dropdown-filters'

type GameResult = {
  id: string
  title: string
  cover_url: string | null
  rating: number | null
  status: { name: string } | null
  platform: { name: string } | null
  game_format: { name: string } | null
  created_at: string
}

type CatalogItem = {
  id: string
  name: string
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/landing')

  const resolvedParams = await searchParams

  const isListView = resolvedParams.view === 'list'
  const searchQuery = typeof resolvedParams.q === 'string' ? resolvedParams.q : ''
  const platformFilter = typeof resolvedParams.platform === 'string' ? resolvedParams.platform : ''
  const formatFilter = typeof resolvedParams.format === 'string' ? resolvedParams.format : ''
  const statusFilter = typeof resolvedParams.status === 'string' ? resolvedParams.status : ''

  let query = supabase
    .from('game')
    .select(`
      id,
      title,
      cover_url,
      rating,
      created_at,
      status ( name ),
      platform ( name ),
      game_format ( name )
    `)

  if (searchQuery) query = query.ilike('title', `%${searchQuery}%`)
  if (platformFilter) query = query.eq('platform_id', platformFilter)
  if (formatFilter) query = query.eq('format_id', formatFilter)
  if (statusFilter) query = query.eq('status_id', statusFilter)

  const [
    { data: gamesData, error: gamesError },
    { data: platformsData },
    { data: formatsData },
    { data: statusesData }
  ] = await Promise.all([
    query.order('created_at', { ascending: false }),
    supabase.from('platform').select('id, name').order('name'),
    supabase.from('game_format').select('id, name').order('name'),
    supabase.from('status').select('id, name').order('name')
  ])

  if (gamesError) {
    return (
      <div className="max-w-md mx-auto mt-12 p-5 rounded-2xl border border-[var(--accent)]/40 bg-[var(--accent-soft)] text-[var(--accent)]">
        Hubo un error de conexión al cargar tu backlog.
      </div>
    )
  }

  const games = gamesData as unknown as GameResult[]

  const isFiltering = !!searchQuery || !!platformFilter || !!formatFilter || !!statusFilter
  const stats = computeStats(games, statusesData ?? [])

  return (
    <div className="max-w-6xl mx-auto px-5 sm:px-8 py-10 sm:py-14 space-y-10 sm:space-y-14">
      {/* Header editorial */}
      <header className="stagger">
        <div className="flex items-end justify-between gap-6 flex-wrap">
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-[var(--accent)] font-semibold mb-3">
              Tu colección
            </p>
            <h1 className="font-display text-5xl sm:text-6xl font-medium tracking-[-0.03em] text-fg leading-[1.0]">
              Backlog
            </h1>
            <p className="mt-3 text-muted text-base max-w-md">
              {games.length === 0
                ? 'Aún no hay nada aquí. Empieza por añadir tu primer juego.'
                : `${games.length} ${games.length === 1 ? 'título' : 'títulos'}${isFiltering ? ' filtrados' : ' en colección'}.`}
            </p>
          </div>
          <Link
            href="/add"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-[var(--bg-base)] bg-[var(--accent)] hover:bg-[var(--accent-strong)] transition-colors text-sm"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M5 12h14"/>
            </svg>
            Añadir juego
          </Link>
        </div>
      </header>

      <Stats stats={stats} />

      {/* Toolbar */}
      <div className="bg-[var(--surface)] border border-[var(--line)] rounded-2xl p-3 sm:p-4 flex flex-col lg:flex-row gap-3 lg:items-center">
        <div className="flex-1 min-w-0">
          <SearchInput />
        </div>
        <div className="flex flex-col sm:flex-row gap-2 lg:flex-1">
          <DropdownFilters
            platforms={(platformsData || []) as CatalogItem[]}
            formats={(formatsData || []) as CatalogItem[]}
            statuses={(statusesData || []) as CatalogItem[]}
          />
        </div>
        <ViewSwitcher currentView={isListView ? 'list' : 'grid'} params={resolvedParams} />
      </div>

      {/* Results */}
      {games.length === 0 ? (
        <EmptyState isFiltering={isFiltering} />
      ) : isListView ? (
        <ul className="flex flex-col gap-2 stagger">
          {games.map((game) => (
            <GameListItem key={game.id} game={game} />
          ))}
        </ul>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 stagger">
          {games.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      )}
    </div>
  )
}

function computeStats(games: GameResult[], statuses: CatalogItem[]) {
  const counts: Record<string, number> = {}
  for (const s of statuses) counts[s.name] = 0
  let rated = 0
  let ratingSum = 0
  for (const g of games) {
    const name = g.status?.name
    if (name && counts[name] !== undefined) counts[name] += 1
    if (typeof g.rating === 'number') {
      rated += 1
      ratingSum += g.rating
    }
  }
  return {
    counts,
    rated,
    avgRating: rated > 0 ? ratingSum / rated : null,
  }
}

function Stats({ stats }: { stats: ReturnType<typeof computeStats> }) {
  const playing = stats.counts['Jugando'] ?? 0
  const pending = stats.counts['Pendiente'] ?? stats.counts['Por jugar'] ?? 0
  const done = stats.counts['Completado'] ?? stats.counts['Terminado'] ?? 0
  const paused = stats.counts['Pausado'] ?? 0
  const total = playing + pending + done + paused

  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-px bg-[var(--line)] border border-[var(--line)] rounded-2xl overflow-hidden">
      <StatCell n={total} label="Total" />
      <StatCell n={playing} label="Jugando" />
      <StatCell n={pending} label="Pendiente" />
      <StatCell n={done} label="Completado" />
      <StatCell n={stats.avgRating ? stats.avgRating.toFixed(1) : '—'} label="Promedio" small />
    </div>
  )
}

function StatCell({ n, label, small }: { n: number | string; label: string; small?: boolean }) {
  return (
    <div className="bg-[var(--bg-base)] p-5 sm:p-6">
      <div className={`font-display figure-num text-fg leading-none ${small ? 'text-3xl sm:text-4xl' : 'text-4xl sm:text-5xl'}`}>
        {n}
      </div>
      <div className="mt-3 text-[10px] uppercase tracking-[0.18em] text-subtle font-semibold">{label}</div>
    </div>
  )
}

function ViewSwitcher({
  currentView,
  params,
}: {
  currentView: 'list' | 'grid'
  params: Record<string, string | string[] | undefined>
}) {
  return (
    <div className="flex gap-1 p-1 rounded-full bg-[var(--bg-paper)] border border-[var(--line)] self-start lg:self-auto">
      <Link
        href={{ pathname: '/', query: { ...params, view: 'grid' } }}
        scroll={false}
        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full transition-colors ${
          currentView === 'grid' ? 'bg-[var(--bg-base)] text-fg shadow-soft' : 'text-muted hover:text-fg'
        }`}
      >
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7" rx="0.5"/>
          <rect x="14" y="3" width="7" height="7" rx="0.5"/>
          <rect x="3" y="14" width="7" height="7" rx="0.5"/>
          <rect x="14" y="14" width="7" height="7" rx="0.5"/>
        </svg>
        Cuadrícula
      </Link>
      <Link
        href={{ pathname: '/', query: { ...params, view: 'list' } }}
        scroll={false}
        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full transition-colors ${
          currentView === 'list' ? 'bg-[var(--bg-base)] text-fg shadow-soft' : 'text-muted hover:text-fg'
        }`}
      >
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <line x1="3" y1="6" x2="21" y2="6"/>
          <line x1="3" y1="12" x2="21" y2="12"/>
          <line x1="3" y1="18" x2="21" y2="18"/>
        </svg>
        Lista
      </Link>
    </div>
  )
}

function EmptyState({ isFiltering }: { isFiltering: boolean }) {
  return (
    <div className="text-center py-24 bg-[var(--bg-paper)] border border-[var(--line)] rounded-2xl stagger">
      <div className="mx-auto w-16 h-16 rounded-2xl border border-[var(--line)] grid place-items-center mb-6">
        <svg className="w-7 h-7 text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z"/>
        </svg>
      </div>
      {isFiltering ? (
        <>
          <h3 className="font-display text-2xl font-semibold text-fg">Sin coincidencias</h3>
          <p className="text-muted mt-2 max-w-sm mx-auto text-sm">
            No se encontraron juegos con esos filtros. Ajusta los criterios para ver más resultados.
          </p>
        </>
      ) : (
        <>
          <h3 className="font-display text-2xl font-semibold text-fg">Tu backlog está vacío</h3>
          <p className="text-muted mt-2 max-w-sm mx-auto text-sm">
            Empieza agregando tu primer juego. La búsqueda con autocompletado hace todo más rápido.
          </p>
          <Link
            href="/add"
            className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-[var(--bg-base)] bg-[var(--accent)] hover:bg-[var(--accent-strong)] transition-colors text-sm"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M5 12h14"/>
            </svg>
            Añadir tu primer juego
          </Link>
        </>
      )}
    </div>
  )
}

function GameListItem({ game }: { game: GameResult }) {
  return (
    <li className="bg-[var(--surface)] border border-[var(--line)] rounded-xl p-3 flex items-center gap-4 lift group">
      <div className="w-12 h-16 rounded-md overflow-hidden border border-[var(--line)] shrink-0">
        {game.cover_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={game.cover_url} alt={game.title} className="w-full h-full object-cover" />
        ) : (
          <div className="cover-fallback w-full h-full" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h2 className="font-display text-lg font-semibold text-fg truncate group-hover:text-[var(--accent)] transition-colors" title={game.title}>
          {game.title}
        </h2>
        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted">
          <span className="text-fg">{game.platform?.name || '—'}</span>
          <span className="opacity-40">·</span>
          <span>{game.game_format?.name || '—'}</span>
          {game.status?.name && (
            <>
              <span className="opacity-40">·</span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: statusDotColor(game.status.name) }} />
                {game.status.name}
              </span>
            </>
          )}
        </div>
      </div>
      <div className="flex items-center gap-3 sm:gap-6 pr-1 shrink-0">
        {game.rating !== null && game.rating !== undefined ? (
          <span className="hidden sm:flex items-baseline gap-0.5 text-fg">
            <span className="font-display figure-num text-lg font-semibold">{game.rating}</span>
            <span className="text-[10px] text-subtle">/10</span>
          </span>
        ) : null}
        <Link
          href={`/edit/${game.id}`}
          className="text-xs font-semibold text-muted hover:text-[var(--accent)] px-3 py-1.5 rounded-full hover:bg-[var(--surface-hover)] transition-colors flex items-center gap-1"
        >
          Editar
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M13 5l7 7-7 7"/>
          </svg>
        </Link>
      </div>
    </li>
  )
}

function GameCard({ game }: { game: GameResult }) {
  return (
    <article className="group relative bg-[var(--surface)] border border-[var(--line)] rounded-xl overflow-hidden lift">
      <div className="relative aspect-[3/4] overflow-hidden bg-[var(--bg-paper)]">
        {game.cover_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={game.cover_url}
            alt={game.title}
            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700"
          />
        ) : (
          <div className="cover-fallback w-full h-full grid place-items-center">
            <span className="font-display italic text-muted">Sin portada</span>
          </div>
        )}
        {game.rating !== null && game.rating !== undefined ? (
          <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-[var(--bg-base)]/90 backdrop-blur-sm">
            <span className="font-display figure-num text-xs font-semibold text-fg">{game.rating}/10</span>
          </div>
        ) : null}
        {game.status?.name ? (
          <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[var(--bg-base)]/90 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: statusDotColor(game.status.name) }} />
            <span className="text-[10px] font-medium text-fg">{game.status.name}</span>
          </div>
        ) : null}
      </div>
      <div className="p-3.5 flex flex-col gap-1">
        <h2 className="font-display text-lg font-semibold text-fg leading-tight line-clamp-1 group-hover:text-[var(--accent)] transition-colors" title={game.title}>
          {game.title}
        </h2>
        <div className="text-xs text-muted flex items-center gap-1.5">
          <span className="text-muted">{game.platform?.name || '—'}</span>
          <span className="opacity-40">·</span>
          <span>{game.game_format?.name || '—'}</span>
        </div>
      </div>
      <Link
        href={`/edit/${game.id}`}
        className="absolute inset-0 z-10"
        aria-label={`Editar ${game.title}`}
      />
    </article>
  )
}

function statusDotColor(name: string): string {
  const n = name.toLowerCase()
  if (n.includes('jugando') || n.includes('playing')) return 'var(--color-sky-500)'
  if (n.includes('completado') || n.includes('terminado') || n.includes('finished')) return 'var(--color-leaf-500)'
  if (n.includes('abandonado') || n.includes('dropped')) return 'var(--color-rose-500)'
  if (n.includes('pausa')) return 'var(--color-flame-500)'
  if (n.includes('casual')) return 'var(--color-moss-500)'
  return 'var(--fg-muted, #8c8273)'
}