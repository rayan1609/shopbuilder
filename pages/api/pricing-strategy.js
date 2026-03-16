export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  const { productName, buyPrice, niche, targetMargin, competitors } = req.body

  const prompt = `Tu es un expert en stratégie de prix pour le dropshipping e-commerce.

Produit: ${productName}
Prix d'achat: ${buyPrice}€
Niche: ${niche || 'générale'}
Marge cible: ${targetMargin || '60'}%
Concurrents: ${competitors || 'non spécifiés'}

Génère une stratégie de prix complète en JSON:
{
  "recommendedPrice": "29.99",
  "minPrice": "24.99",
  "maxPrice": "39.99",
  "psychologicalPrice": "27.97",
  "bundlePrice2x": "49.99",
  "bundlePrice3x": "67.99",
  "marginAtRecommended": "65%",
  "priceStrategy": "Explication de la stratégie de prix recommandée (100 mots)",
  "pricingTips": "5 conseils pour maximiser les conversions avec ce prix",
  "testingPlan": "Plan de test A/B pour optimiser le prix sur 2 semaines",
  "discountStrategy": "Stratégie de promotions et réductions recommandée"
}`

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${process.env.GROQ_API_KEY}` },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        max_tokens: 1500,
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
