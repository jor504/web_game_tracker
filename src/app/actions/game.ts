'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function addGame(formData: FormData) {
  const supabase = await createClient()

  // 1. Validar que exista una sesión activa (Requerido por nuestra política RLS)
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    throw new Error('Debes iniciar sesión para agregar juegos al backlog.')
  }

  const id = formData.get('id') as string

  // 2. Extraer los datos del formulario web
  const newGame = {
    title: formData.get('title') as string,
    status_id: formData.get('status_id') as string,
    format_id: formData.get('format_id') as string,
    platform_id: formData.get('platform_id') as string,
    cover_url: (formData.get('cover_url') as string) || null,
    // Si hay un rating, lo convertimos a número. Si no, va nulo.
    rating: formData.get('rating') ? parseInt(formData.get('rating') as string) : null,
    user_id: user.id // El RLS exige que este ID coincida con el usuario logueado
  }

  // 3. Insertar en Supabase
  const { error } = await supabase.from('game').insert(newGame)

  if (error) {
    console.error('Error insertando juego:', error.message)
    throw new Error('No se pudo guardar el juego en la base de datos.')
  }

  // 4. Limpiar la caché de la página principal y redirigir
  revalidatePath('/')
  redirect('/')
}

export async function updateGame(formData: FormData) {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) throw new Error('Debes iniciar sesión.')

  const id = formData.get('id') as string

  const updatedGame = {
    title: formData.get('title') as string,
    status_id: formData.get('status_id') as string,
    format_id: formData.get('format_id') as string,
    platform_id: formData.get('platform_id') as string,
    cover_url: (formData.get('cover_url') as string) || null,
    rating: formData.get('rating') ? parseInt(formData.get('rating') as string) : null,
    // No enviamos el user_id de nuevo, el RLS se encarga de proteger el registro
  }

  const { error } = await supabase
    .from('game')
    .update(updatedGame)
    .eq('id', id)
    .eq('user_id', user.id) // Capa extra de seguridad a nivel de código

  if (error) {
    console.error('Error actualizando juego:', error.message)
    throw new Error('No se pudo actualizar el juego.')
  }

  revalidatePath('/')
  redirect('/')
}

export async function deleteGame(formData: FormData) {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) throw new Error('Debes iniciar sesión.')

  const id = formData.get('id') as string

  const { error } = await supabase
    .from('game')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    console.error('Error eliminando juego:', error.message)
    throw new Error('No se pudo eliminar el juego.')
  }

  revalidatePath('/')
  redirect('/')
}