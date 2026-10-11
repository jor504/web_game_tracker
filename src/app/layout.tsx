import type { Metadata } from 'next'
import { Inter, Cormorant_Garamond } from 'next/font/google'
import Link from 'next/link'
import './globals.css'
import { createClient } from '@/utils/supabase/server'
import { logout } from '@/app/login/actions'
import { ThemeProvider } from '@/components/theme-provider'
import { ThemeToggle } from '@/components/theme-toggle'

const body = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' })
const display = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'GameBacklog — Tu colección, organizada',
  description: 'Lleva el control de los juegos que quieres jugar, estás jugando y terminaste. Tu backlog, con calma.',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <html lang="es" suppressHydrationWarning className={`${body.variable} ${display.variable}`}>
      <body className="font-sans text-fg min-h-screen flex flex-col antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <Header user={user} />
          <main className="relative flex-1 w-full">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}

function Header({ user }: { user: { email?: string | null } | null }) {
  return (
    <header className="sticky top-0 z-40 bg-[var(--bg-base)]/85 backdrop-blur-md border-b border-[var(--line)]">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between gap-6">
        <Link href={user ? '/' : '/landing'} className="group flex items-baseline gap-2">
          <span className="font-display text-2xl font-semibold tracking-[-0.01em] text-fg leading-none">
            Game<span className="italic text-[var(--accent)]">Backlog</span>
          </span>
          <span className="hidden sm:inline text-[10px] uppercase tracking-[0.22em] text-subtle ml-1">n°01</span>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2">
          {user ? (
            <>
              <NavLink href="/" label="Backlog" />
              <NavLink href="/add" label="Añadir" />
              <span className="hidden md:inline text-xs text-subtle px-3 border-l border-[var(--line)] ml-1 max-w-[180px] truncate" title={user.email ?? ''}>
                {user.email}
              </span>
              <ThemeToggle />
              <form action={logout}>
                <button
                  type="submit"
                  className="text-xs font-medium text-muted hover:text-[var(--accent)] transition-colors px-2.5 py-1.5"
                >
                  Salir
                </button>
              </form>
            </>
          ) : (
            <>
              <NavLink href="/landing" label="Inicio" />
              <ThemeToggle />
              <Link
                href="/login"
                className="text-sm font-semibold text-[var(--bg-base)] bg-[var(--accent)] hover:bg-[var(--accent-strong)] transition-colors px-4 py-2 rounded-full"
              >
                Entrar
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}

function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="text-sm font-medium text-muted hover:text-fg transition-colors px-3 py-1.5 rounded-full"
    >
      {label}
    </Link>
  )
}

function Footer() {
  return (
    <footer className="mt-24 border-t border-[var(--line)]">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-subtle">
        <div className="flex items-center gap-2.5">
          <span className="font-display italic text-sm text-muted">GameBacklog</span>
          <span className="opacity-40">·</span>
          <span>Una colección personal, con calma.</span>
        </div>
        <div className="flex items-center gap-3">
          <span>© {new Date().getFullYear()}</span>
          <span className="opacity-40">·</span>
          <span>Hecho para jugadores.</span>
        </div>
      </div>
    </footer>
  )
}