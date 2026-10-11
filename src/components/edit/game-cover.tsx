'use client'

import { useState } from 'react'

type CatalogItem = { id: string; name: string }

type Props = {
  title: string
  rating: number | null
  statusId: string | null
  platformId: string | null
  formatId: string | null
  coverUrl: string | null
  catalogs: {
    statuses: CatalogItem[]
    platforms: CatalogItem[]
    formats: CatalogItem[]
  }
}

export function GameCover({
  title,
  rating,
  statusId,
  platformId,
  formatId,
  coverUrl,
  catalogs,
}: Props) {
  const [coverPreview, setCoverPreview] = useState<string | null>(coverUrl)

  return (
    <div className="bg-[var(--surface)] border border-[var(--line)] rounded-2xl overflow-hidden">
      <header className="px-6 py-4 border-b border-[var(--line)] bg-[var(--bg-paper)]">
        <p className="text-[10px] uppercase tracking-[0.18em] text-subtle font-semibold">Vista previa</p>
        <p className="text-xs text-muted mt-1">Así se ve en tu colección.</p>
      </header>
      <div className="p-6">
        <div className="aspect-[3/4] rounded-xl overflow-hidden border border-[var(--line-strong)] shadow-card bg-[var(--bg-paper)] relative group">
          <PreviewImage
            src={coverPreview}
            onError={() => setCoverPreview(null)}
            title={title}
          />

          {/* Top-left: rating */}
          {rating !== null && rating !== undefined ? (
            <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-[var(--bg-base)]/90 backdrop-blur-sm">
              <span className="font-display figure-num text-xs font-semibold text-fg">{rating}/10</span>
            </div>
          ) : null}

          {/* Bottom: platform + title */}
          <div className="absolute bottom-0 inset-x-0 px-3 pt-12 pb-3 bg-gradient-to-t from-black/85 via-black/40 to-transparent">
            <div className="text-[9px] uppercase tracking-[0.18em] text-white/70">
              {catalogs.platforms.find((p) => p.id === platformId)?.name || '—'}
            </div>
            <div className="font-display text-base font-semibold text-white leading-tight line-clamp-2 mt-0.5">
              {title || 'Tu juego'}
            </div>
          </div>
        </div>

        <dl className="mt-5 space-y-3 text-sm">
          <Row label="Estado" value={catalogs.statuses.find((s) => s.id === statusId)?.name || '—'} />
          <Row label="Plataforma" value={catalogs.platforms.find((p) => p.id === platformId)?.name || '—'} />
          <Row label="Formato" value={catalogs.formats.find((f) => f.id === formatId)?.name || '—'} />
          <Row label="Calificación" value={rating ? `${rating}/10` : '—'} />
        </dl>
      </div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-dashed border-[var(--line)] pb-3 last:border-0 last:pb-0">
      <dt className="text-[10px] uppercase tracking-[0.18em] text-subtle font-semibold">{label}</dt>
      <dd className="text-fg font-medium">{value}</dd>
    </div>
  )
}

function PreviewImage({ src, onError, title }: { src: string | null; onError: () => void; title: string }) {
  const [failed, setFailed] = useState(false)
  const showImage = src && !failed

  if (!showImage) {
    return (
      <div className="cover-fallback w-full h-full grid place-items-center">
        <div className="text-center px-6">
          <svg className="w-10 h-10 text-muted mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2"/>
            <circle cx="8.5" cy="8.5" r="1.5"/>
            <path d="m21 15-5-5L5 21"/>
          </svg>
          <p className="font-display italic text-sm text-muted mt-3">Sin portada</p>
        </div>
      </div>
    )
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={title}
      className="w-full h-full object-cover"
      onError={() => {
        setFailed(true)
        onError()
      }}
    />
  )
}