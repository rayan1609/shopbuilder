export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { productName, adDescription, platform } = req.body

  const prompt = `Tu es un expert en publicité ${platform}, UGC et marketing viral pour le dropshipping.

Produit: ${productName}
Plateforme: ${platform}
${adDescription ? `Description pub existante: ${adDescription}` : ''}

Génère une analyse complète et des scripts UGC en JSON:
{
  "analysis": "Analyse de la stratégie publicitaire optimale pour ce produit sur ${platform} (150 mots): angles qui fonctionnent, format idéal, budget suggéré, KPIs à surveiller",
  "script1": "Script UGC complet angle problème/solution (15-30 secondes): [0-3s HOOK], [3-10s PROBLÈME], [10-20s SOLUTION/PRODUIT], [20-25s PREUVE], [25-30s CTA]",
  "script2": "Script UGC complet angle témoignage (15-30 secondes): comme si un client satisfait parlait naturellement du produit",
  "script3": "Script UGC complet angle démonstration (15-30 secondes): show dont tell, démonstration visuelle du produit",
  "hooks": "5 hooks accrocheurs pour les 3 premières secondes (une par ligne), ultra-engageants pour ${platform}",
  "music": "5 suggestions de type de musique/son tendance sur ${platform} adaptés à ce produit avec explications"
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
    return res.status(500).json({ error: 'Erreur analyse pub: ' + e.message })
  }
}
