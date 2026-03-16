export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { productName, headline } = req.body

  const prompt = `Tu es un expert en création de vidéos virales TikTok, Instagram Reels et YouTube Shorts pour le dropshipping.

Produit: ${productName}
${headline ? `Angle: ${headline}` : ''}

Génère un script vidéo complet et professionnel en JSON:
{
  "duration": "30 secondes",
  "hook": "Script du hook 0-3s ultra accrocheur (première phrase qui arrête le scroll)",
  "body": "Script développement 3-20s: démonstration produit, bénéfices, preuve sociale",
  "cta": "Script CTA 20-30s: urgence + appel à l'action",
  "scenes": [
    {
      "time": "0-3s",
      "action": "Ce que tu fais à l'écran",
      "visual": "Description du plan caméra",
      "text": "Texte overlay à l'écran"
    },
    {
      "time": "3-8s",
      "action": "Action scène 2",
      "visual": "Plan caméra 2",
      "text": "Texte 2"
    },
    {
      "time": "8-15s",
      "action": "Action scène 3",
      "visual": "Plan caméra 3",
      "text": "Texte 3"
    },
    {
      "time": "15-25s",
      "action": "Action scène 4",
      "visual": "Plan caméra 4",
      "text": "Texte 4"
    },
    {
      "time": "25-30s",
      "action": "CTA final",
      "visual": "Plan caméra 5",
      "text": "Texte CTA"
    }
  ],
  "music": "3 suggestions de style musical avec explication de pourquoi ça marche pour ce produit",
  "tips": "5 conseils pro de tournage spécifiques à ce produit pour maximiser les vues et conversions",
  "hashtags": "10 hashtags tendance pour ce produit"
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
    const result = JSON.parse(data.choices[0].message.content)
    return res.status(200).json(result)
  } catch (e) {
    return res.status(500).json({ error: e.message })
  }
}
