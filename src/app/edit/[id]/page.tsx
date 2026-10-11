import { createClient } from '@/utils/supabase/server'
import { updateGame, deleteGame } from '@/app/actions/game'
import { redirect } from 'next/navigation'
import { FormShell, FormSection } from '@/components/ui/form-shell'
import { FormField, Select, TextInput, PrimaryButton, DangerButton } from '@/components/ui/form'
import { GameCover } from '@/components/edit/game-cover'

export default async function EditGamePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

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

  if (!game) {
    redirect('/')
  }

  return (
    <FormShell
      title={game.title}
      subtitle="Modifica los datos del juego o elimínalo del backlog cuando quieras."
    >
      <div className="grid lg:grid-cols-[1.55fr_1fr] gap-6 items-start">
        <form action={updateGame} className="flex flex-col gap-6">
          <input type="hidden" name="id" value={game.id} />

          {/* I. Identidad */}
          <FormSection
            number="I."
            title="Identidad"
            description="El nombre con el que lo conoces."
          >
            <FormField label="Título del juego" required>
              <TextInput
                type="text"
                id="title"
                name="title"
                defaultValue={game.title}
                required
              />
            </FormField>
          </FormSection>

          {/* II. Detalles */}
          <FormSection
            number="II."
            title="Detalles"
            description="Clasifícalo para encontrarlo rápidamente."
          >
            <div className="grid sm:grid-cols-2 gap-5">
              <FormField label="Plataforma" required>
                <Select id="platform_id" name="platform_id" defaultValue={game.platform_id} required>
                  {platforms?.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </Select>
              </FormField>
              <FormField label="Formato" required>
                <Select id="format_id" name="format_id" defaultValue={game.format_id} required>
                  {formats?.map((f) => (
                    <option key={f.id} value={f.id}>{f.name}</option>
                  ))}
                </Select>
              </FormField>
              <FormField label="Estado actual" required>
                <Select id="status_id" name="status_id" defaultValue={game.status_id} required>
                  {statuses?.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </Select>
              </FormField>
              <FormField label="Calificación" hint="Opcional · 1 a 10">
                <TextInput
                  type="number"
                  id="rating"
                  name="rating"
                  min="1"
                  max="10"
                  defaultValue={game.rating ?? ''}
                  placeholder="—"
                />
              </FormField>
            </div>
          </FormSection>

          {/* III. Portada */}
          <FormSection
            number="III."
            title="Portada"
            description="Una URL de imagen. Déjala vacía para usar el placeholder."
          >
            <FormField label="URL de la portada">
              <TextInput
                type="url"
                id="cover_url"
                name="cover_url"
                defaultValue={game.cover_url ?? ''}
                placeholder="https://…"
              />
            </FormField>
          </FormSection>

          {/* Action bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
            <p className="text-xs text-subtle italic">
              Los cambios se guardan al pulsar el botón.
            </p>
            <PrimaryButton>
              Guardar cambios
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6 9 17l-5-5"/>
              </svg>
            </PrimaryButton>
          </div>
        </form>

        {/* Sidebar — live preview + danger zone */}
        <aside className="flex flex-col gap-6 lg:sticky lg:top-24">
          <GameCover
            title={game.title}
            rating={game.rating}
            statusId={game.status_id}
            platformId={game.platform_id}
            formatId={game.format_id}
            coverUrl={game.cover_url}
            catalogs={{
              statuses: statuses ?? [],
              platforms: platforms ?? [],
              formats: formats ?? [],
            }}
          />

          <div className="bg-[var(--surface)] border border-dashed border-[var(--line-strong)] rounded-2xl overflow-hidden">
            <header className="px-6 py-4 border-b border-dashed border-[var(--line)]">
              <h3 className="font-display text-base font-semibold text-fg">Eliminar del backlog</h3>
              <p className="text-xs text-muted mt-1">Esta acción no se puede deshacer.</p>
            </header>
            <form action={deleteGame} className="p-6">
              <input type="hidden" name="id" value={game.id} />
              <DangerButton>Eliminar permanentemente</DangerButton>
            </form>
          </div>
        </aside>
      </div>
    </FormShell>
  )
}