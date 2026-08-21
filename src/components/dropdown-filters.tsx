'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'

type CatalogItem = {
  id: string
  name: string
}

interface Props {
  platforms: CatalogItem[]
  formats: CatalogItem[]
  statuses: CatalogItem[]
}

export function DropdownFilters({ platforms, formats, statuses }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const currentPlatform = searchParams.get('platform') || ''
  const currentFormat = searchParams.get('format') || ''
  const currentStatus = searchParams.get('status') || ''

  // Función genérica para actualizar la URL
  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
      
      {/* Filtro de Plataforma */}
      <select
        value={currentPlatform}
        onChange={(e) => handleFilterChange('platform', e.target.value)}
        className="border border-slate-300 dark:border-slate-700 p-2 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none transition-colors text-sm appearance-none shadow-sm cursor-pointer"
      >
        <option value="">Todas las plataformas</option>
        {platforms.map((p) => (
          <option key={p.id} value={p.id}>{p.name}</option>
        ))}
      </select>

      {/* Filtro de Formato */}
      <select
        value={currentFormat}
        onChange={(e) => handleFilterChange('format', e.target.value)}
        className="border border-slate-300 dark:border-slate-700 p-2 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none transition-colors text-sm appearance-none shadow-sm cursor-pointer"
      >
        <option value="">Todos los formatos</option>
        {formats.map((f) => (
          <option key={f.id} value={f.id}>{f.name}</option>
        ))}
      </select>

      {/* Filtro de Estado */}
      <select
        value={currentStatus}
        onChange={(e) => handleFilterChange('status', e.target.value)}
        className="border border-slate-300 dark:border-slate-700 p-2 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none transition-colors text-sm appearance-none shadow-sm cursor-pointer"
      >
        <option value="">Todos los estados</option>
        {statuses.map((s) => (
          <option key={s.id} value={s.id}>{s.name}</option>
        ))}
      </select>

    </div>
  )
}