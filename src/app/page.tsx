import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { redirect } from 'next/navigation'

type GameResult = {
  id: string
  title: string
  cover_url: string | null
  rating: number | null
  status: { name: string } | null
  platform: { name: string } | null
  game_format: { name: string } | null
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const resolvedParams = await searchParams
  const isListView = resolvedParams.view === 'list'

  const { data, error } = await supabase
    .from('game')
    .select(`
      id,
      title,
      cover_url,
      rating,
      status ( name ),
      platform ( name ),
      game_format ( name )
    `)
    .order('created_at', { ascending: false })

  if (error) {
    return (
      <div className="p-4 rounded-md bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-center font-medium">
        Hubo un error de conexión al cargar tu backlog.
      </div>
    )
  }

  const games = data as unknown as GameResult[]

  return (
    <div className="space-y-8">
      <PageHeader totalGames={games.length} isListView={isListView} />
      
      {games.length === 0 ? (
        <EmptyState />
      ) : (
        isListView ? (
          <div className="flex flex-col gap-3">
            {games.map((game) => (
              <GameListItem key={game.id} game={game} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {games.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        )
      )}
    </div>
  )
}

function PageHeader({ totalGames, isListView }: { totalGames: number, isListView: boolean }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      <div className="flex items-center gap-4">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-800 dark:text-white">Mi Backlog</h1>
        <span className="bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 text-sm font-semibold px-3 py-1 rounded-full">
          {totalGames} {totalGames === 1 ? 'Título' : 'Títulos'}
        </span>
      </div>
      
      <div className="flex bg-slate-200/60 dark:bg-slate-800/80 p-1 rounded-lg border border-slate-200 dark:border-slate-700 self-start sm:self-auto transition-colors">
        <Link 
          href="/?view=grid" 
          className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
            !isListView ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          Cuadrícula
        </Link>
        <Link 
          href="/?view=list" 
          className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
            isListView ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          Lista
        </Link>
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="text-center py-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm transition-colors">
      <p className="text-slate-500 dark:text-slate-400 mb-4">Aún no tienes juegos en tu backlog.</p>
      <Link href="/add" className="inline-block bg-blue-600 dark:bg-blue-500 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors">
        Agrega tu primer juego
      </Link>
    </div>
  )
}

function GameListItem({ game }: { game: GameResult }) {
  return (
    <article className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm flex items-center p-3 hover:shadow-md dark:hover:shadow-slate-800/50 transition-all gap-4 overflow-hidden">
      
      <div className="w-12 h-16 bg-slate-100 dark:bg-slate-800 rounded-md overflow-hidden flex-shrink-0 border border-slate-200 dark:border-slate-700">
        {game.cover_url ? (
          <img src={game.cover_url} alt={game.title} className="w-full h-full object-cover" />
        ) : (
          <div className="flex items-center justify-center w-full h-full text-[10px] font-medium text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-800/50 text-center leading-tight">
            Sin Img
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <h2 className="text-base font-bold text-slate-800 dark:text-slate-100 truncate" title={game.title}>
          {game.title}
        </h2>
        <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex flex-wrap gap-2 items-center font-medium">
          <span className="text-slate-700 dark:text-slate-300">{game.platform?.name || 'N/A'}</span>
          <span className="text-slate-300 dark:text-slate-600">•</span>
          <span>{game.game_format?.name || 'N/A'}</span>
          <span className="text-slate-300 dark:text-slate-600">•</span>
          <span className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-1.5 py-0.5 rounded text-slate-700 dark:text-slate-300">
            {game.status?.name || 'Sin estado'}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4 sm:gap-8 pr-2">
        <span className="text-sm font-semibold text-amber-500 dark:text-amber-400 w-12 text-right hidden sm:block">
          {game.rating ? `★ ${game.rating}` : '-'}
        </span>
        <Link href={`/edit/${game.id}`} className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-semibold transition-colors bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 px-3 py-1.5 rounded-md">
          Editar
        </Link>
      </div>

    </article>
  )
}

function GameCard({ game }: { game: GameResult }) {
  return (
    <article className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden flex flex-col hover:shadow-md dark:hover:shadow-slate-800/50 transition-all">
      <div className="h-48 bg-slate-100 dark:bg-slate-800 relative border-b border-slate-100 dark:border-slate-800">
        {game.cover_url ? (
          <img src={game.cover_url} alt={game.title} className="w-full h-full object-cover" />
        ) : (
          <div className="flex items-center justify-center w-full h-full text-slate-400 dark:text-slate-500 font-medium text-sm">
            Sin Portada
          </div>
        )}
        <div className="absolute top-2 right-2 bg-black/75 dark:bg-black/90 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded">
          {game.status?.name || 'Sin estado'}
        </div>
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 line-clamp-1" title={game.title}>
          {game.title}
        </h2>
        <div className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 flex gap-2 items-center font-medium">
          <span className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2 py-0.5 rounded text-slate-700 dark:text-slate-300">
            {game.platform?.name || 'N/A'}
          </span>
          <span>•</span>
          <span>{game.game_format?.name || 'N/A'}</span>
        </div>
        <div className="mt-auto pt-4 flex items-center justify-between">
          <span className="text-sm font-semibold text-amber-500 dark:text-amber-400">
            {game.rating ? `★ ${game.rating}/10` : 'Sin calificar'}
          </span>
          <Link href={`/edit/${game.id}`} className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-semibold transition-colors">
            Editar
          </Link>
        </div>
      </div>
    </article>
  )
}