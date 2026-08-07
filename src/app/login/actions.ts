'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) redirect('/login?message=Credenciales incorrectas')

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  //const { error } = await supabase.auth.signUp({ email, password })
  //if (error) redirect('/login?message=Error al crear la cuenta')

  const { error } = await supabase.auth.signUp({ email, password })
  if (error) {
    // 1. Imprime el error detallado en tu terminal
    console.error('Error detallado de Supabase:', error.message, error.status, error.code);
    
    // 2. Manda el error real a la pantalla para que lo leas
    redirect(`/login?message=${encodeURIComponent(error.message)}`);
  }
  revalidatePath('/', 'layout')
  redirect('/')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}