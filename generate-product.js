export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { url } = req.body
  if (!url) return res.status(400).json({ error: 'URL manquante' })

  try {
    const prompt = `Tu es un expert en dropshipping et copywriting e-commerce.
    
Analyse ce produit depuis son URL et génère une fiche produit complète optimisée pour la conversion.
URL: ${url}

Réponds UNIQUEMENT en JSON valide avec cette structure exacte:
{
  "title": "Titre accrocheur et SEO (max 80 chars)",
  "price": "Prix de vente suggéré en euros (ex: 29.99€)",
  "description": "Description HTML-free de 150-200 mots, orientée bénéfices client, ton engageant",
  "bullets": "5 points clés séparés par des sauts de ligne, commençant par ✓",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "adScript": "Script vidéo TikTok/Reels de 30 secondes: accroche + problème + solution + CTA",
  "metaDescription": "Meta description SEO de 155 chars max"
}`

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1500,
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    const data = await response.json()
    const text = data.content[0].text
    const clean = text.replace(/```json|```/g, '').trim()
    const product = JSON.parse(clean)

    return res.status(200).json(product)
  } catch (e) {
    return res.status(500).json({ error: 'Erreur lors de la génération: ' + e.message })
  }
}
