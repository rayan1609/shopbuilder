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
  "brandDescription": "Description de marque 2-3 phrases, ton de marque",
  "aboutPage": "Page À propos complète 200 mots, histoire de la marque, mission, valeurs",
  "shippingPolicy": "Politique de livraison professionnelle complète",
  "returnPolicy": "Politique de retour 14 jours claire et rassurante",
  "welcomeEmail": "Email de bienvenue chaleureux et engageant 150 mots",
  "abandonedCartEmail": "Email relance panier abandonné persuasif 100 mots",
  "colors": ["#hex1", "#hex2", "#hex3"],
  "fontSuggestion": "Police Google Fonts suggérée",
  "seoTitle": "Titre SEO homepage",
  "seoDescription": "Meta description homepage 155 chars"
}`

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 2000,
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    const data = await response.json()
    const text = data.content[0].text
    const clean = text.replace(/```json|```/g, '').trim()
    const shop = JSON.parse(clean)

    return res.status(200).json(shop)
  } catch (e) {
    return res.status(500).json({ error: 'Erreur génération shop: ' + e.message })
  }
}
