export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { query, count = 6 } = req.body
  if (!query) return res.status(400).json({ error: 'Query manquante' })

  try {
    // Use Unsplash free API (no key needed for basic access)
    const searchQuery = encodeURIComponent(query)
    
    // Try Unsplash Source API (free, no key needed)
    const images = []
    
    // Generate Unsplash URLs for different sizes
    const keywords = query.split(' ').slice(0, 3).join(',')
    for (let i = 1; i <= count; i++) {
      images.push({
        url: `https://source.unsplash.com/800x800/?${searchQuery}&sig=${i}`,
        thumb: `https://source.unsplash.com/400x400/?${searchQuery}&sig=${i}`,
        source: 'Unsplash'
      })
    }

    return res.status(200).json({ images })
  } catch (e) {
    return res.status(500).json({ error: 'Erreur recherche images: ' + e.message })
  }
}
