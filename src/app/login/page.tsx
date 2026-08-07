import { login, signup } from './actions'

export default async function LoginPage({
  searchParams,
}: {
  // Tipado estricto para Next.js 15+ donde searchParams es una Promesa
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  // Resolvemos los parámetros de la URL
  const params = await searchParams;
  const message = params?.message as string;

  return (
    <main className="flex min-h-screen items-center justify-center p-4 bg-slate-50">
      <form className="flex w-full max-w-md flex-col gap-5 border p-8 rounded-xl shadow-sm bg-white">
        
        <div className="text-center mb-2">
          <h1 className="text-2xl font-bold text-slate-800">Acceso al Backlog</h1>
          <p className="text-sm text-slate-500">Ingresa para gestionar tus juegos</p>
        </div>
        
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-slate-700" htmlFor="email">Email</label>
          <input 
            className="border border-slate-300 p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
            id="email" 
            name="email" 
            type="email" 
            required 
          />
        </div>
        
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-slate-700" htmlFor="password">Contraseña</label>
          <input 
            className="border border-slate-300 p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
            id="password" 
            name="password" 
            type="password" 
            required 
          />
        </div>

        {/* Nota: Usamos formAction en los botones para invocar distintas Server Actions desde un mismo formulario */}
        <div className="flex gap-3 mt-4">
          <button 
            formAction={login} 
            className="bg-blue-600 text-white font-medium p-2.5 rounded-lg flex-1 hover:bg-blue-700 transition-colors"
          >
            Iniciar Sesión
          </button>
          <button 
            formAction={signup} 
            className="bg-slate-100 text-slate-800 font-medium p-2.5 rounded-lg flex-1 hover:bg-slate-200 transition-colors border border-slate-200"
          >
            Registrarse
          </button>
        </div>

        {/* Renderizado condicional del mensaje de error que viene por URL */}
        {message && (
          <div className="mt-2 p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg text-center text-sm font-medium">
            {message}
          </div>
        )}
        
      </form>
    </main>
  )
}