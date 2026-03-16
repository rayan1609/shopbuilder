export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { productName, brandName, emailType, tone } = req.body

  const typeMap = {
    welcome: 'email de bienvenue pour un nouveau client',
    abandoned_cart: 'email de relance panier abandonné',
    upsell: 'email upsell post-achat pour proposer un produit complémentaire',
    winback: 'email de réactivation pour un client inactif',
    launch: 'email de lancement de nouveau produit',
    promo: 'email promotionnel avec une offre limitée',
  }

  const toneMap = {
    friendly: 'amical, chaleureux et proche du client',
    professional: 'professionnel et sobre',
    urgent: 'urgent avec sentiment de rareté et scarcité',
    luxury: 'luxueux, premium et exclusif',
  }

  const prompt = `Tu es un expert en email marketing e-commerce et copywriting.

Génère un ${typeMap[emailType]} pour:
- Produit: ${productName}
- Marque: ${brandName || 'notre boutique'}
- Ton: ${toneMap[tone]}

Réponds UNIQUEMENT en JSON valide:
{
  "subject": "Objet de l'email accrocheur (max 60 chars)",
  "preheader": "Texte de prévisualisation (max 90 chars)",
  "body": "Corps complet de l'email en français, bien structuré avec salutation, contenu principal, CTA clair et signature"
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
        max_tokens: 1500,
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' }
      }),
    })

    const data = await response.json()
    if (!response.ok) throw new Error(JSON.stringify(data))
    const text = data.choices[0].message.content
    const email = JSON.parse(text)

    return res.status(200).json(email)
  } catch (e) {
    return res.status(500).json({ error: 'Erreur génération email: ' + e.message })
  }
}
