import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { redirect } from 'next/navigation'

// 1. Tipado estricto para los datos devueltos por el JOIN
type GameResult = {
  id: string
  title: string
  cover_url: string | null
  rating: number | null
  status: { name: string } | null
  platform: { name: string } | null
  game_format: { name: string } | null
}

export default async function HomePage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

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
    console.error('Error al cargar juegos:', error)
    return (
      <div className="p-4 rounded-md bg-red-50 border border-red-200 text-red-600 text-center font-medium">
        Hubo un error de conexión al cargar tu backlog.
      </div>
    )
  }

  // Hacemos el cast seguro gracias a nuestra interfaz
  const games = data as unknown as GameResult[]

  return (
    <div className="space-y-8">
      <PageHeader totalGames={games.length} />
      
      {games.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {games.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      )}
    </div>
  )
}

// -- Subcomponentes Modulares --

function PageHeader({ totalGames }: { totalGames: number }) {
  return (
    <div className="flex items-center justify-between mb-8">
      <h1 className="text-3xl font-extrabold tracking-tight text-slate-800">Mi Backlog</h1>
      <span className="bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full">
        {totalGames} {totalGames === 1 ? 'Título' : 'Títulos'}
      </span>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="text-center py-16 bg-white border border-slate-200 rounded-xl shadow-sm">
      <p className="text-slate-500 mb-4">Aún no tienes juegos en tu backlog.</p>
      <Link href="/add" className="inline-block bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors">
        Agrega tu primer juego
      </Link>
    </div>
  )
}

function GameCard({ game }: { game: GameResult }) {
  return (
    <article className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow">
      
      {/* Portada y Badge */}
      <div className="h-48 bg-slate-100 relative border-b border-slate-100">
        {game.cover_url ? (
          <img src={game.cover_url} alt={game.title} className="w-full h-full object-cover" />
        ) : (
          <div className="flex items-center justify-center w-full h-full text-slate-400 font-medium text-sm">
            Sin Portada
          </div>
        )}
        <div className="absolute top-2 right-2 bg-black/75 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded">
          {game.status?.name || 'Sin estado'}
        </div>
      </div>

      {/* Metadatos */}
      <div className="p-4 flex-1 flex flex-col">
        <h2 className="text-lg font-bold text-slate-800 line-clamp-1" title={game.title}>
          {game.title}
        </h2>
        
        <div className="text-xs text-slate-500 mt-1.5 flex gap-2 items-center font-medium">
          <span className="bg-slate-100 border border-slate-200 px-2 py-0.5 rounded text-slate-700">
            {game.platform?.name || 'N/A'}
          </span>
          <span>•</span>
          <span>{game.game_format?.name || 'N/A'}</span>
        </div>

        {/* Footer de la tarjeta */}
        <div className="mt-auto pt-4 flex items-center justify-between">
          <span className="text-sm font-semibold text-amber-500">
            {game.rating ? `★ ${game.rating}/10` : 'Sin calificar'}
          </span>
          <Link href={`/edit/${game.id}`} className="text-blue-600 hover:text-blue-800 text-sm font-semibold transition-colors">
            Editar
          </Link>
        </div>
      </div>

    </article>
  )
}