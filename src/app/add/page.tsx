import { createClient } from '@/utils/supabase/server'
import { addGame } from '@/app/actions/game'

export default async function AddGamePage() {
  const supabase = await createClient()

  // Hacemos fetch de los catálogos en paralelo para mayor velocidad
  const [
    { data: statuses },
    { data: formats },
    { data: platforms }
  ] = await Promise.all([
    supabase.from('status').select('id, name').order('name'),
    supabase.from('game_format').select('id, name').order('name'),
    supabase.from('platform').select('id, name').order('name')
  ])

  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Agregar Juego</h1>
      
      {/* Vinculamos el formulario directamente al Server Action */}
      <form action={addGame} className="flex flex-col gap-4">
        
        <div className="flex flex-col gap-1">
          <label htmlFor="title" className="font-medium">Título del Juego</label>
          <input type="text" id="title" name="title" required className="border p-2 rounded" />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="platform_id" className="font-medium">Plataforma</label>
          <select id="platform_id" name="platform_id" required className="border p-2 rounded bg-white">
            <option value="">Selecciona una consola/PC...</option>
            {platforms?.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="format_id" className="font-medium">Formato</label>
          <select id="format_id" name="format_id" required className="border p-2 rounded bg-white">
            <option value="">Físico o Digital...</option>
            {formats?.map((f) => (
              <option key={f.id} value={f.id}>{f.name}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="status_id" className="font-medium">Estado actual</label>
          <select id="status_id" name="status_id" required className="border p-2 rounded bg-white">
            <option value="">Selecciona un estado...</option>
            {statuses?.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>

        <button type="submit" className="mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 font-medium">
          Guardar en el Backlog
        </button>
        
      </form>
    </main>
  )
}