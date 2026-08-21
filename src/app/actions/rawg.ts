'use server'

export async function searchGamesInRAWG(query: string) {
  if (!query || query.length < 3) return []

  const apiKey = process.env.RAWG_API_KEY
  
  try {
    // page_size=5 asegura que solo traigamos los 5 resultados más relevantes para la UI
    const res = await fetch(
      `https://api.rawg.io/api/games?key=${apiKey}&search=${encodeURIComponent(query)}&page_size=5`
    )

    if (!res.ok) throw new Error('Error de conexión con RAWG')

    const data = await res.json()

    // Mapeamos la respuesta para adaptarla a la estructura de nuestro backlog
    return data.results.map((game: any) => ({
      rawg_id: game.id,
      title: game.name,
      cover_url: game.background_image,
      released: game.released,
    }))
    
  } catch (error) {
    console.error('Error buscando en RAWG:', error)
    return []
  }
}