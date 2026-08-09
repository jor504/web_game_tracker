import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import './globals.css'
import { createClient } from '@/utils/supabase/server'
import { logout } from '@/app/login/actions'
import { ThemeProvider } from '@/components/theme-provider'
import { ThemeToggle } from '@/components/theme-toggle'

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
    // suppressHydrationWarning es vital en el <html> al usar next-themes
    <html lang="es" suppressHydrationWarning>
      {/* Añadimos transiciones suaves y fondos que reaccionan al dark mode */}
      <body className={`${inter.className} bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen flex flex-col antialiased transition-colors duration-300`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header user={user} />
          <main className="max-w-5xl mx-auto px-4 py-8 w-full flex-1">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  )
}

function Header({ user }: { user: any }) {
  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10 shadow-sm transition-colors duration-300">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="font-bold text-xl tracking-tight text-blue-600 dark:text-blue-400">
          GameBacklog
        </Link>
        
        <nav className="flex gap-4 items-center">
          <ThemeToggle />
          
          {user ? (
            <>
              <Link href="/add" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                + Agregar Juego
              </Link>
              <form action={logout}>
                <button type="submit" className="text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors">
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