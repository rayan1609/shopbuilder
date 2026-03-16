export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { url } = req.body
  if (!url) return res.status(400).json({ error: 'URL manquante' })

  try {
    // Fetch the shop page
    const pageRes = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; ShopBuilder/1.0)' }
    })
    const html = await pageRes.text()

    // Extract basic info from HTML
    const titleMatch = html.match(/<title>(.*?)<\/title>/i)
    const shopTitle = titleMatch ? titleMatch[1] : url

    // Detect Shopify
    const isShopify = html.includes('cdn.shopify.com') || html.includes('Shopify.theme')
    const themeMatch = html.match(/"name":"([^"]+)"/i)

    const prompt = `Tu es un expert en analyse de shops e-commerce.

Analyse ce shop concurrent et fournis un rapport détaillé.
URL: ${url}
Titre du shop: ${shopTitle}
Plateforme détectée: ${isShopify ? 'Shopify' : 'Inconnue'}
Extrait HTML (500 premiers chars): ${html.substring(0, 500)}

Génère un rapport d'analyse en JSON:
{
  "platform": "Shopify / WooCommerce / autre",
  "theme": "Nom du thème estimé",
  "productCount": "Estimation du nombre de produits",
  "priceRange": "Fourchette de prix estimée",
  "bestSellers": "Analyse des produits phares visibles (3-5 produits)",
  "marketingStrategy": "Stratégie marketing utilisée (urgence, social proof, etc.)",
  "strengths": "3-4 points forts du shop",
  "opportunities": "3-4 opportunités pour se différencier",
  "apps": ["App Shopify 1", "App Shopify 2", "App Shopify 3"],
  "trafficEstimate": "Estimation trafic mensuel",
  "recommendations": "3 recommandations concrètes pour faire mieux"
}`

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5-20251001',
        max_tokens: 1500,
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    const data = await response.json()
    const text = data.content[0].text
    const clean = text.replace(/```json|```/g, '').trim()
    const analysis = JSON.parse(clean)

    return res.status(200).json(analysis)
  } catch (e) {
    return res.status(500).json({ error: 'Erreur analyse shop: ' + e.message })
  }
}
