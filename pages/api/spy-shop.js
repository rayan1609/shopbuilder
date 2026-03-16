export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { url } = req.body
  if (!url) return res.status(400).json({ error: 'URL manquante' })

  try {
    const pageRes = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; ShopBuilder/1.0)' }
    })
    const html = await pageRes.text()

    const titleMatch = html.match(/<title>(.*?)<\/title>/i)
    const shopTitle = titleMatch ? titleMatch[1] : url
    const isShopify = html.includes('cdn.shopify.com') || html.includes('Shopify.theme')

    const prompt = `Tu es un expert en analyse de shops e-commerce.

Analyse ce shop concurrent et fournis un rapport détaillé.
URL: ${url}
Titre du shop: ${shopTitle}
Plateforme détectée: ${isShopify ? 'Shopify' : 'Inconnue'}

Génère un rapport d'analyse en JSON:
{
  "platform": "Shopify / WooCommerce / autre",
  "theme": "Nom du thème estimé",
  "productCount": "Estimation du nombre de produits",
  "priceRange": "Fourchette de prix estimée",
  "bestSellers": "Analyse des produits phares visibles",
  "marketingStrategy": "Stratégie marketing utilisée",
  "strengths": "3-4 points forts du shop",
  "opportunities": "3-4 opportunités pour se différencier",
  "apps": ["App 1", "App 2", "App 3"],
  "trafficEstimate": "Estimation trafic mensuel",
  "recommendations": "3 recommandations concrètes"
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
    const analysis = JSON.parse(text)

    return res.status(200).json(analysis)
  } catch (e) {
    return res.status(500).json({ error: 'Erreur analyse shop: ' + e.message })
  }
}
