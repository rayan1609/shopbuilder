export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { niche } = req.body

  const prompt = `Tu es un expert en dropshipping, tendances TikTok et produits viraux.

Génère une liste de 6 produits dropshipping actuellement viraux ${niche ? `dans la niche: ${niche}` : 'toutes niches confondues'}.

Réponds UNIQUEMENT en JSON valide:
{
  "products": [
    {
      "name": "Nom du produit",
      "niche": "Catégorie",
      "viralScore": 8,
      "why": "Pourquoi ce produit est viral en ce moment (2-3 phrases)",
      "buyPrice": "3-8€",
      "sellPrice": "24.99€",
      "margin": "~70%",
      "tags": ["tag1", "tag2", "tag3"],
      "targetAudience": "Audience cible principale",
      "bestPlatform": "TikTok / Instagram / Facebook"
    }
  ]
}`

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama3-70b-8192',
        max_tokens: 2000,
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' }
      }),
    })

    const data = await response.json()
    
    if (!response.ok) {
      return res.status(500).json({ error: 'Erreur API: ' + JSON.stringify(data) })
    }
    
    const text = data.choices[0].message.content
    const result = JSON.parse(text)

    return res.status(200).json(result)
  } catch (e) {
    return res.status(500).json({ error: 'Erreur recherche tendances: ' + e.message })
  }
}
