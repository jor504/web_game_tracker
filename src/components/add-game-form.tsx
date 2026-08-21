'use client'

import { useState, useEffect } from 'react'
import { searchGamesInRAWG } from '@/app/actions/rawg'
import { addGame } from '@/app/actions/game'

// Tipados para recibir los catálogos desde el servidor
type CatalogItem = { id: string; name: string }
type Props = {
  platforms: CatalogItem[] | null
  formats: CatalogItem[] | null
  statuses: CatalogItem[] | null
}

export function AddGameForm({ platforms, formats, statuses }: Props) {
  const [title, setTitle] = useState('')
  const [coverUrl, setCoverUrl] = useState('')
  const [results, setResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)

  // Efecto de Debounce: Espera 500ms después de que dejas de escribir para buscar
  useEffect(() => {
    if (title.length < 3) {
      setResults([])
      setShowDropdown(false)
      return
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsSearching(true)
      const games = await searchGamesInRAWG(title)
      setResults(games)
      setShowDropdown(games.length > 0)
      setIsSearching(false)
    }, 500)

    return () => clearTimeout(delayDebounceFn)
  }, [title])

  const handleSelectGame = (game: any) => {
    setTitle(game.title)
    if (game.cover_url) setCoverUrl(game.cover_url)
    setShowDropdown(false)
  }

  return (
    <form 
      action={addGame} 
      className="flex flex-col gap-5 bg-white dark:bg-slate-900 p-6 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm transition-colors"
    >
      
      {/* Buscador RAWG (Reemplaza al input normal de Título) */}
      <div className="flex flex-col gap-1.5 relative">
        <label htmlFor="title" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          Título del Juego
        </label>
        <input 
          type="text" 
          id="title" 
          name="title" 
          required 
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ej: The Legend of Zelda..."
          autoComplete="off"
          className="border border-slate-300 dark:border-slate-700 p-2.5 rounded-lg bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none transition-colors" 
        />
        
        {/* Indicador de carga */}
        {isSearching && (
          <span className="absolute right-3 top-10 text-xs text-blue-500 font-medium animate-pulse">
            Buscando...
          </span>
        )}

        {/* Dropdown de Resultados RAWG */}
        {showDropdown && results.length > 0 && (
          <ul className="absolute z-50 top-[72px] left-0 w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl overflow-hidden">
            {results.map((game) => (
              <li 
                key={game.rawg_id}
                onClick={() => handleSelectGame(game)}
                className="flex items-center gap-3 p-2 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer transition-colors border-b border-slate-100 dark:border-slate-700/50 last:border-0"
              >
                {game.cover_url ? (
                  <img src={game.cover_url} alt={game.title} className="w-8 h-10 object-cover rounded shadow-sm" />
                ) : (
                  <div className="w-8 h-10 bg-slate-200 dark:bg-slate-700 rounded flex-shrink-0" />
                )}
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-100">{game.title}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    Lanzamiento: {game.released ? game.released.split('-')[0] : 'N/A'}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="platform_id" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Plataforma
          </label>
          <select 
            id="platform_id" 
            name="platform_id" 
            required 
            className="border border-slate-300 dark:border-slate-700 p-2.5 rounded-lg bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none transition-colors appearance-none"
          >
            <option value="">Selecciona una consola/PC...</option>
            {platforms?.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="format_id" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Formato
          </label>
          <select 
            id="format_id" 
            name="format_id" 
            required 
            className="border border-slate-300 dark:border-slate-700 p-2.5 rounded-lg bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none transition-colors appearance-none"
          >
            <option value="">Físico o Digital...</option>
            {formats?.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="status_id" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Estado actual
          </label>
          <select 
            id="status_id" 
            name="status_id" 
            required 
            className="border border-slate-300 dark:border-slate-700 p-2.5 rounded-lg bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none transition-colors appearance-none"
          >
            <option value="">Selecciona un estado...</option>
            {statuses?.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="rating" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Calificación (1-10)
          </label>
          <input 
            type="number" 
            id="rating" 
            name="rating" 
            min="1" 
            max="10" 
            className="border border-slate-300 dark:border-slate-700 p-2.5 rounded-lg bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none transition-colors" 
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="cover_url" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          URL de la Portada (Opcional)
        </label>
        <input 
          type="url" 
          id="cover_url" 
          name="cover_url" 
          value={coverUrl}
          onChange={(e) => setCoverUrl(e.target.value)}
          className="border border-slate-300 dark:border-slate-700 p-2.5 rounded-lg bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none transition-colors" 
        />
        {/* Previsualización rápida de la portada */}
        {coverUrl && (
          <div className="mt-2 w-24 h-32 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm relative">
            <img src={coverUrl} alt="Portada seleccionada" className="w-full h-full object-cover" />
          </div>
        )}
      </div>

      <div className="mt-4 border-t border-slate-100 dark:border-slate-800 pt-6">
        <button 
          type="submit" 
          className="w-full bg-blue-600 dark:bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 font-semibold transition-colors"
        >
          Guardar en el Backlog
        </button>
      </div>
      
    </form>
  )
}