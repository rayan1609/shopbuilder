export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { niche, brandName, targetAudience, priceRange, language } = req.body

  const langMap = { fr: 'français', en: 'anglais', es: 'espagnol', de: 'allemand' }
  const priceMap = { low: 'entrée de gamme (moins de 30€)', mid: 'milieu de gamme (30-80€)', high: 'premium (80€+)' }

  const prompt = `Tu es un expert en branding e-commerce et copywriting.

Génère un shop complet pour une boutique dropshipping avec ces paramètres:
- Niche: ${niche}
- Nom de marque souhaité: ${brandName || 'à inventer'}
- Audience cible: ${targetAudience || 'grand public'}
- Gamme de prix: ${priceMap[priceRange]}
- Langue: ${langMap[language]}

Réponds UNIQUEMENT en JSON valide:
{
  "brandName": "Nom de marque mémorable et original",
  "slogan": "Slogan court et percutant",
  "brandDescription": "Description de marque 2-3 phrases",
  "aboutPage": "Page À propos complète 200 mots",
  "shippingPolicy": "Politique de livraison professionnelle complète",
  "returnPolicy": "Politique de retour 14 jours claire",
  "welcomeEmail": "Email de bienvenue chaleureux 150 mots",
  "abandonedCartEmail": "Email relance panier abandonné 100 mots",
  "colors": ["#hex1", "#hex2", "#hex3"],
  "fontSuggestion": "Police Google Fonts suggérée",
  "seoTitle": "Titre SEO homepage",
  "seoDescription": "Meta description homepage 155 chars"
}`

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        max_tokens: 2000,
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' }
      }),
    })

    const data = await response.json()
    if (!response.ok) throw new Error(JSON.stringify(data))
    const text = data.choices[0].message.content
    const shop = JSON.parse(text)

    return res.status(200).json(shop)
  } catch (e) {
    return res.status(500).json({ error: 'Erreur génération shop: ' + e.message })
  }
}
