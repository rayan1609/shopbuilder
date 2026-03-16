export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  const { productName } = req.body

  const prompt = `Tu es un expert en copywriting publicitaire pour les réseaux sociaux.

Génère un visuel publicitaire accrocheur pour ce produit: "${productName}"

Réponds UNIQUEMENT en JSON:
{
  "headline": "Titre accrocheur max 6 mots en MAJUSCULES",
  "subtext": "Sous-titre bénéfices max 10 mots",
  "cta": "Texte bouton 2-3 mots",
  "urgency": "Texte urgence court (ex: Stock limité!)"
}`

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${process.env.GROQ_API_KEY}` },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        max_tokens: 300,
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
