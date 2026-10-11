import { login, signup } from './actions'
import Link from 'next/link'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  const message = params?.message as string

  return (
    <div className="min-h-[calc(100vh-4rem)] flex">
      {/* Editorial side */}
      <aside className="hidden lg:flex flex-col justify-between w-[42%] paper-edge border-r border-[var(--line)] px-12 py-14">
        <Link href="/landing" className="group inline-flex items-center gap-2 self-start">
          <svg className="w-3.5 h-3.5 text-muted group-hover:text-fg transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6"/>
          </svg>
          <span className="text-xs uppercase tracking-[0.18em] text-muted group-hover:text-fg transition-colors">Volver al inicio</span>
        </Link>

        <div className="stagger">
          <p className="text-[11px] uppercase tracking-[0.22em] text-[var(--accent)] font-semibold mb-6">
            Capítulo 01
          </p>
          <h2 className="font-display text-4xl xl:text-5xl font-medium tracking-[-0.025em] leading-[1.05] text-fg">
            Una colección,
            <br />
            <span className="italic text-muted">con calma.</span>
          </h2>
          <p className="mt-5 text-muted max-w-md leading-relaxed">
            Entra para gestionar tu backlog: búsquedas con autocompletado, calificaciones, filtros y vistas que se adaptan a ti. Sin prisa.
          </p>

          <ul className="mt-12 space-y-4 max-w-sm">
            {[
              { n: 'I.', t: 'Búsqueda con autocompletado', b: 'Encuentra cualquier título al instante.' },
              { n: 'II.', t: 'Estados y calificaciones', b: 'Pendiente, jugando, terminado, en pausa.' },
              { n: 'III.', t: 'Privado por defecto', b: 'Tus datos solo son tuyos.' },
            ].map((f) => (
              <li key={f.t} className="flex items-baseline gap-4 border-t border-[var(--line)] pt-4">
                <span className="font-display italic text-subtle">{f.n}</span>
                <div>
                  <div className="font-display text-base font-semibold text-fg leading-tight">{f.t}</div>
                  <div className="text-sm text-muted mt-0.5">{f.b}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-[10px] uppercase tracking-[0.22em] text-subtle">© {new Date().getFullYear()} GameBacklog</p>
      </aside>

      {/* Form side */}
      <section className="flex flex-col justify-center w-full lg:w-[58%] px-5 sm:px-10 lg:px-16 py-14">
        <div className="mx-auto w-full max-w-md">
          <div className="lg:hidden mb-8">
            <Link href="/landing" className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-fg transition-colors">
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m15 18-6-6 6-6"/>
              </svg>
              Volver
            </Link>
          </div>

          <div className="stagger">
            <p className="text-[11px] uppercase tracking-[0.22em] text-[var(--accent)] font-semibold mb-3">
              Entrar
            </p>
            <h1 className="font-display text-4xl sm:text-5xl font-medium tracking-[-0.025em] text-fg leading-[1.05]">
              Bienvenido
              <br />
              <span className="italic text-muted">de vuelta.</span>
            </h1>
            <p className="mt-3 text-muted">
              Ingresa o crea una cuenta para continuar.
            </p>

            <form className="mt-9 flex flex-col gap-5">
              <Field
                label="Email"
                id="email"
                type="email"
                placeholder="tu@email.com"
                required
                autoComplete="email"
              />

              <Field
                label="Contraseña"
                id="password"
                type="password"
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />

              {message && (
                <div
                  role="alert"
                  className="flex items-start gap-2.5 p-3.5 bg-[var(--accent-soft)] border border-[var(--accent)]/30 rounded-lg text-sm text-[var(--accent)] anim-fade-up"
                >
                  <svg className="w-4 h-4 mt-0.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M12 8v4M12 16h.01"/>
                  </svg>
                  <span>{message}</span>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 mt-2">
                <button
                  formAction={login}
                  className="group relative flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full font-semibold text-[var(--bg-base)] bg-[var(--accent)] hover:bg-[var(--accent-strong)] transition-colors"
                >
                  Iniciar sesión
                  <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M13 5l7 7-7 7"/>
                  </svg>
                </button>
                <button
                  formAction={signup}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full font-semibold text-fg bg-transparent border border-[var(--line-strong)] hover:bg-[var(--surface-hover)] transition-colors"
                >
                  Crear cuenta
                </button>
              </div>

              <p className="text-xs text-subtle text-center mt-3">
                Al continuar aceptas que guardaremos tu email y backlog en tu cuenta personal.
              </p>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}

function Field({
  label,
  id,
  type,
  placeholder,
  required,
  autoComplete,
}: {
  label: string
  id: string
  type: string
  placeholder?: string
  required?: boolean
  autoComplete?: string
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-[11px] font-semibold uppercase tracking-[0.18em] text-subtle">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        required={required}
        autoComplete={autoComplete}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-lg bg-transparent border border-[var(--line-strong)] text-fg placeholder:text-subtle focus:outline-none focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent-soft)] transition-all"
      />
    </div>
  )
}