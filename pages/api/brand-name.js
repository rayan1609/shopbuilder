export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  const { niche, style, targetAudience } = req.body

  const prompt = `Tu es un expert en branding et création de noms de marques e-commerce.

Niche: ${niche}
Style souhaité: ${style || 'moderne et mémorable'}
Audience cible: ${targetAudience || 'grand public'}

Génère des noms de marques en JSON:
{
  "names": [
    {
      "name": "NomDemarque",
      "domain": "nomDemarque.com",
      "meaning": "Signification et concept derrière le nom",
      "style": "Moderne/Luxe/Fun/Minimal",
      "score": 9,
      "tagline": "Slogan suggéré"
    }
  ],
  "namingTips": "3 conseils pour choisir le meilleur nom pour cette niche"
}`

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${process.env.GROQ_API_KEY}` },
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
    return res.status(500).json({ error: 'Erreur: ' + e.message })
  }
}
