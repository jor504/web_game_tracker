import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { AddGameForm } from '@/components/add-game-form'

export default async function AddGamePage() {
  const supabase = await createClient()

  // El servidor hace todo el trabajo pesado de consultar los catálogos
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
      
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Agregar Juego</h1>
        <Link 
          href="/" 
          className="text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
        >
          Cancelar y Volver
        </Link>
      </div>
      
      {/* Pasamos los datos al componente interactivo */}
      <AddGameForm 
        platforms={platforms} 
        formats={formats} 
        statuses={statuses} 
      />
      
    </main>
  )
}