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

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) params.set(key, value)
    else params.delete(key)
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 w-full">
      <FilterSelect label="Plataforma" value={currentPlatform} onChange={(v) => handleFilterChange('platform', v)} options={platforms} />
      <FilterSelect label="Formato" value={currentFormat} onChange={(v) => handleFilterChange('format', v)} options={formats} />
      <FilterSelect label="Estado" value={currentStatus} onChange={(v) => handleFilterChange('status', v)} options={statuses} />
    </div>
  )
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  options: CatalogItem[]
}) {
  return (
    <div className="relative">
      <label className="sr-only">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none bg-transparent border border-[var(--line)] pl-3.5 pr-9 py-2.5 rounded-lg text-fg focus:outline-none focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent-soft)] transition-all text-sm cursor-pointer"
      >
        <option value="">{label}</option>
        {options.map((o) => (
          <option key={o.id} value={o.id}>{o.name}</option>
        ))}
      </select>
      <svg
        className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-subtle pointer-events-none"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m6 9 6 6 6-6"/>
      </svg>
    </div>
  )
}