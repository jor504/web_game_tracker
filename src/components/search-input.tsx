'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'

export function SearchInput() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [text, setText] = useState(searchParams.get('q') || '')

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      // 1. Leemos el parámetro exacto que está en la URL en este momento
      const currentQuery = searchParams.get('q') || ''
      
      // 2. SOLO actualizamos la URL si el texto escrito es diferente al actual
      // Esto rompe el bucle infinito del router de Next.js
      if (text !== currentQuery) {
        const params = new URLSearchParams(searchParams.toString())
        
        if (text) {
          params.set('q', text)
        } else {
          params.delete('q')
        }
        
        router.push(`${pathname}?${params.toString()}`)
      }
    }, 300)

    return () => clearTimeout(delayDebounceFn)
  }, [text, searchParams, pathname, router])

  return (
    <div className="relative w-full sm:w-72">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Buscar juego..."
        className="w-full border border-slate-300 dark:border-slate-700 p-2 pl-4 pr-8 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none transition-colors text-sm shadow-sm"
      />
      {text && (
        <button
          onClick={() => setText('')}
          className="absolute right-3 top-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-bold"
          title="Limpiar búsqueda"
        >
          ✕
        </button>
      )}
    </div>
  )
}