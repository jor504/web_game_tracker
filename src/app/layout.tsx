import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import './globals.css'
import { createClient } from '@/utils/supabase/server'
import { logout } from '@/app/login/actions'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Game Backlog',
  description: 'Gestor personal de videojuegos',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <html lang="es">
      <body className={`${inter.className} bg-slate-50 text-slate-900 min-h-screen flex flex-col antialiased`}>
        <Header user={user} />
        <main className="max-w-5xl mx-auto px-4 py-8 w-full flex-1">
          {children}
        </main>
      </body>
    </html>
  )
}

// -- Subcomponente de Navegación --
function Header({ user }: { user: any }) {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="font-bold text-xl tracking-tight text-blue-600">
          GameBacklog
        </Link>
        
        <nav className="flex gap-4 items-center">
          {user ? (
            <>
              <Link href="/add" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">
                + Agregar Juego
              </Link>
              <form action={logout}>
                <button type="submit" className="text-sm font-medium text-slate-500 hover:text-red-600 transition-colors">
                  Cerrar Sesión
                </button>
              </form>
            </>
          ) : (
            <Link href="/login" className="text-sm font-medium bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
              Iniciar Sesión
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}