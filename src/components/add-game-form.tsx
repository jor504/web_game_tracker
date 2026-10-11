'use client'

/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useRef, useState, useTransition } from 'react'
import { createPortal } from 'react-dom'
import { searchGamesInRAWG } from '@/app/actions/rawg'
import { addGame } from '@/app/actions/game'
import { FormField, Select, TextInput, PrimaryButton } from '@/components/ui/form'
import { FormSection } from '@/components/ui/form-shell'

type CatalogItem = { id: string; name: string }
type Props = {
  platforms: CatalogItem[] | null
  formats: CatalogItem[] | null
  statuses: CatalogItem[] | null
}

type RawgResult = {
  rawg_id: number | string
  title: string
  cover_url: string | null
  released?: string | null
}

export function AddGameForm({ platforms, formats, statuses }: Props) {
  const [title, setTitle] = useState('')
  const [coverUrl, setCoverUrl] = useState('')
  const [pending, startTransition] = useTransition()

  return (
    <form
      action={(fd) => startTransition(() => addGame(fd))}
      className="grid lg:grid-cols-[1.55fr_1fr] gap-6 items-start"
    >
      <div className="flex flex-col gap-6">
        <FormSection
          number="I."
          title="Identidad"
          description="Empieza por el título. Si está en su base de datos, autocompletamos los datos."
        >
          <FormField label="Título del juego" required>
            <TitleCombobox
              value={title}
              onChange={setTitle}
              onCover={setCoverUrl}
            />
          </FormField>
        </FormSection>

        <FormSection
          number="II."
          title="Detalles"
          description="Clasifícalo para encontrarlo después."
        >
          <div className="grid sm:grid-cols-2 gap-5">
            <FormField label="Plataforma" required>
              <Select name="platform_id" required defaultValue="">
                <option value="">Selecciona…</option>
                {platforms?.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </Select>
            </FormField>
            <FormField label="Formato" required>
              <Select name="format_id" required defaultValue="">
                <option value="">Selecciona…</option>
                {formats?.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
              </Select>
            </FormField>
            <FormField label="Estado actual" required>
              <Select name="status_id" required defaultValue="">
                <option value="">Selecciona…</option>
                {statuses?.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </Select>
            </FormField>
            <FormField label="Calificación" hint="Opcional · 1 a 10">
              <TextInput
                type="number"
                name="rating"
                min="1"
                max="10"
                placeholder="—"
              />
            </FormField>
          </div>
        </FormSection>

        <FormSection
          number="III."
          title="Portada"
          description="URL de una imagen vertical. Se autocompleta si elegiste arriba."
        >
          <FormField label="URL de portada">
            <input
              type="url"
              name="cover_url"
              value={coverUrl}
              onChange={(e) => setCoverUrl(e.target.value)}
              placeholder="https://…"
              className="w-full px-4 py-2.5 rounded-lg bg-[var(--bg-base)] border border-[var(--line-strong)] text-fg placeholder:text-subtle focus:outline-none focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent-soft)] transition-all"
            />
          </FormField>
        </FormSection>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
          <p className="text-xs text-subtle italic">
            Se guardará en tu backlog y aparecerá arriba.
          </p>
          <PrimaryButton pending={pending}>
            Guardar en el backlog
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M13 5l7 7-7 7"/>
            </svg>
          </PrimaryButton>
        </div>
      </div>

      <aside className="lg:sticky lg:top-24">
        <div className="bg-[var(--surface)] border border-[var(--line)] rounded-2xl overflow-hidden">
          <header className="px-6 py-4 border-b border-[var(--line)] bg-[var(--bg-paper)]">
            <p className="text-[10px] uppercase tracking-[0.18em] text-subtle font-semibold">Vista previa</p>
            <p className="text-xs text-muted mt-1">Así se verá en tu colección.</p>
          </header>
          <div className="p-6">
            <div className="aspect-[3/4] rounded-xl overflow-hidden border border-[var(--line-strong)] shadow-card bg-[var(--bg-paper)] relative">
              {coverUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={coverUrl} alt={title || 'Vista previa'} className="w-full h-full object-cover" />
              ) : (
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
              )}
              <div className="absolute bottom-0 inset-x-0 px-3 pt-12 pb-3 bg-gradient-to-t from-black/85 via-black/40 to-transparent">
                <div className="text-[9px] uppercase tracking-[0.18em] text-white/70">
                  Sin portada
                </div>
                <div className="font-display text-base font-semibold text-white leading-tight line-clamp-2 mt-0.5">
                  {title || 'Tu juego'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </form>
  )
}

/* ----------------------------------------------------------------------
   TitleCombobox
   - Debounced RAWG search
   - Dropdown is portaled to <body> with position: fixed (immune to ancestor clipping)
   - Out-of-order / stale responses ignored via generation counter
   - Selecting a result commits it once; we set a `justSelectedRef` so the next
     effect tick for the same value short-circuits and does NOT re-search.
   - Outside-click and Escape close the dropdown.
   - Keyboard navigation: ArrowDown/Up + Enter + Escape.
   ---------------------------------------------------------------------- */

function TitleCombobox({
  value,
  onChange,
  onCover,
}: {
  value: string
  onChange: (v: string) => void
  onCover: (url: string) => void
}) {
  const [open, setOpen] = useState(false)
  const [results, setResults] = useState<RawgResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [highlight, setHighlight] = useState(-1)
  const [mounted, setMounted] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)

  // Stale-response guard
  const generationRef = useRef(0)
  // When the user picks a result, set this so the title-change effect
  // skips the next search even though the title value differs from before.
  const justSelectedRef = useRef(false)

  const [pos, setPos] = useState<{ top: number; left: number; width: number } | null>(null)

  useEffect(() => { setMounted(true) }, [])

  // Recompute dropdown position when opening or on scroll/resize
  useEffect(() => {
    if (!open) return
    const update = () => {
      const r = inputRef.current?.getBoundingClientRect()
      if (r) setPos({ top: r.bottom + 8, left: r.left, width: r.width })
    }
    update()
    window.addEventListener('scroll', update, true)
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update, true)
      window.removeEventListener('resize', update)
    }
  }, [open])

  // Debounced search
  useEffect(() => {
    // If we just selected an item, skip the search triggered by the
    // controlled `value` change. The effect still runs (deps changed),
    // but we don't fetch again.
    if (justSelectedRef.current) {
      justSelectedRef.current = false
      return
    }
    if (value.length < 3) {
      setResults([])
      setIsSearching(false)
      setOpen(false)
      return
    }
    const gen = ++generationRef.current
    setIsSearching(true)
    const t = setTimeout(async () => {
      try {
        const games = await searchGamesInRAWG(value)
        // Discard stale responses
        if (gen !== generationRef.current) return
        setResults(games)
        setIsSearching(false)
        setOpen(games.length > 0)
        setHighlight(-1)
      } catch {
        if (gen !== generationRef.current) return
        setResults([])
        setIsSearching(false)
        setOpen(false)
      }
    }, 400)
    return () => {
      clearTimeout(t)
      // Mark this generation as superseded so its result is ignored
      generationRef.current += 1
    }
  }, [value])

  // Close on outside click
  useEffect(() => {
    if (!open) return
    const onDocClick = (e: MouseEvent) => {
      const t = e.target as Node
      if (wrapRef.current?.contains(t)) return
      if (listRef.current?.contains(t)) return
      setOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [open])

  const select = (g: RawgResult) => {
    justSelectedRef.current = true
    onChange(g.title)
    if (g.cover_url) onCover(g.cover_url)
    setOpen(false)
    setHighlight(-1)
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open && (e.key === 'ArrowDown' || e.key === 'Enter')) {
      if (results.length) setOpen(true)
      return
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlight((h) => Math.min(h + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlight((h) => Math.max(h - 1, 0))
    } else if (e.key === 'Enter') {
      if (highlight >= 0 && results[highlight]) {
        e.preventDefault()
        select(results[highlight])
      }
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  return (
    <div ref={wrapRef} className="relative">
      <input
        ref={inputRef}
        type="text"
        name="title"
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => { if (results.length > 0 && value.length >= 3) setOpen(true) }}
        onKeyDown={onKeyDown}
        placeholder="Ej: The Legend of Zelda…"
        autoComplete="off"
        role="combobox"
        aria-expanded={open}
        aria-controls="rawg-listbox"
        aria-autocomplete="list"
        className="w-full px-4 py-2.5 pr-10 rounded-lg bg-[var(--bg-base)] border border-[var(--line-strong)] text-fg placeholder:text-subtle focus:outline-none focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent-soft)] transition-all"
      />
      {isSearching && (
        <span className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-xs text-[var(--accent)] font-medium">
          <svg className="w-3 h-3 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M21 12a9 9 0 1 1-9-9" />
          </svg>
        </span>
      )}

      {mounted && open && pos && results.length > 0 && createPortal(
        <ul
          ref={listRef}
          id="rawg-listbox"
          role="listbox"
          style={{ position: 'fixed', top: pos.top, left: pos.left, width: pos.width }}
          className="z-[100] bg-[var(--surface)] border border-[var(--line-strong)] rounded-xl shadow-elevated overflow-hidden max-h-80 overflow-y-auto"
        >
          {results.map((game, i) => (
            <li
              key={game.rawg_id}
              role="option"
              aria-selected={highlight === i}
              onMouseDown={(e) => { e.preventDefault(); select(game) }}
              onMouseEnter={() => setHighlight(i)}
              className={`flex items-center gap-3 p-2.5 cursor-pointer transition-colors border-b border-[var(--line)] last:border-0 ${
                highlight === i ? 'bg-[var(--surface-hover)]' : 'hover:bg-[var(--surface-hover)]'
              }`}
            >
              {game.cover_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={game.cover_url} alt={game.title} className="w-8 h-10 object-cover rounded shadow-sm shrink-0" />
              ) : (
                <div className="w-8 h-10 cover-fallback rounded shrink-0" />
              )}
              <div className="flex flex-col min-w-0 flex-1">
                <span className="text-sm font-semibold text-fg truncate">{game.title}</span>
                <span className="text-xs text-muted">
                  {game.released ? game.released.split('-')[0] : '—'}
                </span>
              </div>
              <svg className="w-4 h-4 text-subtle ml-auto shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 18 6-6-6-6"/>
              </svg>
            </li>
          ))}
        </ul>,
        document.body
      )}
    </div>
  )
}