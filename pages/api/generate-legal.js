export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { brandName, email, address, country, productType, deliveryDays, returnDays } = req.body

  const prompt = `Tu es un expert juridique en e-commerce français.

Génère tous les documents légaux pour cette boutique dropshipping:
- Nom: ${brandName}
- Email: ${email || 'contact@' + brandName.toLowerCase().replace(/\s/g, '') + '.com'}
- Adresse: ${address || 'France'}
- Pays: ${country}
- Produits: ${productType || 'produits divers'}
- Délai livraison: ${deliveryDays} jours
- Délai retour: ${returnDays} jours

Génère des documents professionnels et conformes au droit français et au RGPD.

Réponds UNIQUEMENT en JSON:
{
  "cgv": "Conditions Générales de Vente complètes (800 mots minimum)",
  "privacy": "Politique de confidentialité RGPD complète (600 mots minimum)",
  "mentions": "Mentions légales complètes (400 mots minimum)",
  "shipping": "Politique de livraison détaillée (300 mots minimum)",
  "returns": "Politique de retours et remboursements (300 mots minimum)"
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
        max_tokens: 4000,
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' }
      }),
    })

    const data = await response.json()
    if (!response.ok) throw new Error(JSON.stringify(data))
    const result = JSON.parse(data.choices[0].message.content)
    return res.status(200).json(result)
  } catch (e) {
    return res.status(500).json({ error: 'Erreur génération légal: ' + e.message })
  }
}
