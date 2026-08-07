import { createClient } from '@/utils/supabase/server'
import { updateGame, deleteGame } from '@/app/actions/game'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function EditGamePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  // Ejecutamos las consultas en paralelo
  const [
    { data: statuses },
    { data: formats },
    { data: platforms },
    { data: game }
  ] = await Promise.all([
    supabase.from('status').select('id, name').order('name'),
    supabase.from('game_format').select('id, name').order('name'),
    supabase.from('platform').select('id, name').order('name'),
    supabase.from('game').select('*').eq('id', id).single()
  ])

  // Si el juego no existe o el RLS bloquea, redirigimos
  if (!game) {
    redirect('/')
  }

  return (
    <main className="max-w-2xl mx-auto p-6">
      
      {/* Cabecera */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-slate-800">Editar Juego</h1>
        <Link 
          href="/" 
          className="text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors"
        >
          Cancelar y Volver
        </Link>
      </div>
      
      {/* Contenedor principal de ambos formularios */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        
        {/* =========================================
            FORMULARIO 1: ACTUALIZACIÓN (UPDATE)
        ========================================= */}
        <form action={updateGame} className="flex flex-col gap-5 p-6">
          
          {/* Identificador oculto */}
          <input type="hidden" name="id" defaultValue={game.id} />

          <div className="flex flex-col gap-1.5">
            <label htmlFor="title" className="text-sm font-semibold text-slate-700">
              Título del Juego
            </label>
            <input 
              type="text" 
              id="title" 
              name="title" 
              defaultValue={game.title} 
              required 
              className="border border-slate-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="platform_id" className="text-sm font-semibold text-slate-700">
                Plataforma
              </label>
              <select 
                id="platform_id" 
                name="platform_id" 
                defaultValue={game.platform_id} 
                required 
                className="border border-slate-300 p-2.5 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none"
              >
                {platforms?.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="format_id" className="text-sm font-semibold text-slate-700">
                Formato
              </label>
              <select 
                id="format_id" 
                name="format_id" 
                defaultValue={game.format_id} 
                required 
                className="border border-slate-300 p-2.5 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none"
              >
                {formats?.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="status_id" className="text-sm font-semibold text-slate-700">
                Estado actual
              </label>
              <select 
                id="status_id" 
                name="status_id" 
                defaultValue={game.status_id} 
                required 
                className="border border-slate-300 p-2.5 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none"
              >
                {statuses?.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="rating" className="text-sm font-semibold text-slate-700">
                Calificación (1-10)
              </label>
              <input 
                type="number" 
                id="rating" 
                name="rating" 
                min="1" 
                max="10" 
                defaultValue={game.rating || ''} 
                className="border border-slate-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="cover_url" className="text-sm font-semibold text-slate-700">
              URL de la Portada (Opcional)
            </label>
            <input 
              type="url" 
              id="cover_url" 
              name="cover_url" 
              defaultValue={game.cover_url || ''} 
              className="border border-slate-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
            />
          </div>

          <div className="mt-4 border-t border-slate-100 pt-6">
            <button 
              type="submit" 
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 font-semibold transition-colors"
            >
              Guardar Cambios
            </button>
          </div>
        </form>

        {/* =========================================
            FORMULARIO 2: ELIMINACIÓN (DELETE)
        ========================================= */}
        <form 
          action={deleteGame} 
          className="px-6 pb-6 pt-2 bg-slate-50 border-t border-slate-200 flex justify-end"
        >
          {/* Identificador oculto para el borrado */}
          <input type="hidden" name="id" defaultValue={game.id} />
          <button 
            type="submit" 
            className="text-sm text-red-600 hover:text-red-800 font-medium px-4 py-2 hover:bg-red-50 rounded-md transition-colors"
          >
            Eliminar este juego permanentemente
          </button>
        </form>
        
      </div>
    </main>
  )
}