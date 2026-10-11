import { createClient } from '@/utils/supabase/server'
import { AddGameForm } from '@/components/add-game-form'
import { FormShell } from '@/components/ui/form-shell'

export default async function AddGamePage() {
  const supabase = await createClient()

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
    <FormShell
      title="Añadir al backlog"
      subtitle="Busca el título para autocompletar portada y datos, o ingrésalo manualmente."
    >
      <AddGameForm
        platforms={platforms}
        formats={formats}
        statuses={statuses}
      />
    </FormShell>
  )
}