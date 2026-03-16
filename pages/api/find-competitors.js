// competitor-finder API
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  const { productName } = req.body

  const prompt = `Tu es un expert en recherche de concurrents e-commerce et dropshipping.

Pour le produit: "${productName}"

Trouve et liste des boutiques Shopify concurrentes réelles qui vendent ce type de produit.

Réponds UNIQUEMENT en JSON:
{
  "competitors": [
    {
      "name": "Nom de la boutique",
      "url": "https://www.exemple.com",
      "description": "Ce qu'ils vendent et leur positionnement",
      "priceRange": "20-50€",
      "strength": "Point fort principal",
      "weakness": "Point faible principal",
      "trafficEstimate": "Faible/Moyen/Élevé"
    }
  ],
  "marketAnalysis": "Analyse du marché en 100 mots: saturation, opportunités, tendances",
  "differentiationTips": "3 conseils pour se différencier de ces concurrents"
}`

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${process.env.GROQ_API_KEY}` },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        max_tokens: 2000,
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' }
      }),
    })
    const data = await response.json()
    if (!response.ok) throw new Error(JSON.stringify(data))
    const result = JSON.parse(data.choices[0].message.content)
    return res.status(200).json(result)
  } catch (e) {
    return res.status(500).json({ error: 'Erreur: ' + e.message })
  }
}
