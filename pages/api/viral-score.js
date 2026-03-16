export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { productName } = req.body

  const prompt = `Tu es un expert en dropshipping, marketing viral et tendances e-commerce.

Analyse le potentiel viral de ce produit pour le dropshipping: "${productName}"

Réponds UNIQUEMENT en JSON:
{
  "productName": "${productName}",
  "overallScore": 8,
  "trendScore": 8,
  "tiktokScore": 9,
  "marginScore": 7,
  "competitionScore": 6,
  "easeScore": 8,
  "audienceScore": 9,
  "analysis": "Analyse détaillée du potentiel viral (150 mots): tendances actuelles, pourquoi ce produit fonctionne ou non",
  "strategy": "Stratégie recommandée pour vendre ce produit (100 mots): plateforme, angle marketing, cible",
  "warnings": "Points de vigilance et risques (80 mots)",
  "estimatedBuyPrice": "5-10€",
  "estimatedSellPrice": "29.99€",
  "estimatedMargin": "65-70%"
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
    const result = JSON.parse(data.choices[0].message.content)
    return res.status(200).json(result)
  } catch (e) {
    return res.status(500).json({ error: 'Erreur analyse viralité: ' + e.message })
  }
}
