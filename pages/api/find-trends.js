export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { niche } = req.body

  const prompt = `Tu es un expert en dropshipping, tendances TikTok et produits viraux.

Génère une liste de 6 produits dropshipping actuellement viraux ${niche ? `dans la niche: ${niche}` : 'toutes niches confondues'}.

Base-toi sur les tendances actuelles TikTok Shop, Meta Ads, AliExpress trending.

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
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5-20251001',
        max_tokens: 2000,
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    const data = await response.json()
    const text = data.content[0].text
    const clean = text.replace(/```json|```/g, '').trim()
    const result = JSON.parse(clean)

    return res.status(200).json(result)
  } catch (e) {
    return res.status(500).json({ error: 'Erreur recherche tendances: ' + e.message })
  }
}
