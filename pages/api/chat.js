export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { messages } = req.body

  const systemPrompt = `Tu es un expert en dropshipping, e-commerce et marketing digital. Tu conseilles des entrepreneurs qui font du dropshipping avec Shopify.

Tu es direct, pratique et orienté résultats. Tu donnes des conseils concrets et actionnables.

Tes domaines d'expertise:
- Trouver des produits gagnants et viraux
- Stratégies publicitaires TikTok, Meta Ads, Google Ads
- Optimisation des fiches produits et taux de conversion
- Gestion des fournisseurs AliExpress, CJ Dropshipping
- Email marketing et automatisation
- Branding et création de boutiques
- Analyse des tendances et de la concurrence
- Gestion des retours et service client
- Scaling et croissance d'un business dropshipping

Réponds toujours en français, de manière claire et structurée. Utilise des emojis pour rendre tes réponses plus lisibles.`

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        max_tokens: 1000,
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages.slice(-10).map(m => ({ role: m.role, content: String(m.content) }))
        ],
      }),
    })

    const data = await response.json()
    if (!response.ok) throw new Error(JSON.stringify(data))
    const reply = data.choices[0].message.content

    return res.status(200).json({ reply })
  } catch (e) {
    return res.status(500).json({ error: 'Erreur chat: ' + e.message })
  }
}
