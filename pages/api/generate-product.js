export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { url, productName } = req.body
  if (!url && !productName) return res.status(400).json({ error: 'Produit manquant' })

  try {
    const prompt = `Tu es un expert en dropshipping et copywriting e-commerce.

Génère une fiche produit complète optimisée pour la conversion pour ce produit:
Nom du produit: ${productName || 'produit depuis ' + url}
URL de référence: ${url || 'non fournie'}

Réponds UNIQUEMENT en JSON valide:
{
  "title": "Titre accrocheur et SEO (max 80 chars)",
  "price": "Prix de vente suggéré en euros (ex: 29.99€)",
  "description": "Description de 150-200 mots orientée bénéfices client",
  "bullets": "5 points clés séparés par des sauts de ligne commençant par ✓",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "adScript": "Script vidéo TikTok/Reels de 30 secondes: accroche + problème + solution + CTA",
  "metaDescription": "Meta description SEO de 155 chars max"
}`

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        max_tokens: 1500,
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' }
      }),
    })

    const data = await response.json()
    if (!response.ok) throw new Error(JSON.stringify(data))
    const text = data.choices[0].message.content
    const product = JSON.parse(text)

    return res.status(200).json(product)
  } catch (e) {
    return res.status(500).json({ error: 'Erreur génération: ' + e.message })
  }
}
