export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  const { shopName, productName, hasLegal, hasProduct, hasBudget, hasTheme } = req.body

  const prompt = `Tu es un expert en lancement de boutiques dropshipping.

Boutique: ${shopName || 'Ma boutique'}
Produit: ${productName || 'non spécifié'}
A les documents légaux: ${hasLegal ? 'Oui' : 'Non'}
A le produit configuré: ${hasProduct ? 'Oui' : 'Non'}
A un budget pub: ${hasBudget ? 'Oui' : 'Non'}
A un thème: ${hasTheme ? 'Oui' : 'Non'}

Génère une checklist de lancement complète en JSON:
{
  "readyToLaunch": true,
  "score": 75,
  "categories": [
    {
      "name": "Légal & Conformité",
      "items": [
        { "task": "CGV publiées", "done": false, "priority": "critique", "tip": "Conseil pour accomplir cette tâche" },
        { "task": "Politique de confidentialité", "done": false, "priority": "critique", "tip": "..." },
        { "task": "Mentions légales", "done": false, "priority": "critique", "tip": "..." }
      ]
    },
    {
      "name": "Boutique & Produit",
      "items": [
        { "task": "Fiche produit optimisée", "done": false, "priority": "haute", "tip": "..." },
        { "task": "Photos produit ajoutées", "done": false, "priority": "haute", "tip": "..." },
        { "task": "Prix configuré", "done": false, "priority": "haute", "tip": "..." },
        { "task": "Thème professionnel", "done": false, "priority": "moyenne", "tip": "..." }
      ]
    },
    {
      "name": "Marketing & Publicité",
      "items": [
        { "task": "Compte TikTok créé", "done": false, "priority": "haute", "tip": "..." },
        { "task": "Compte Meta Ads créé", "done": false, "priority": "haute", "tip": "..." },
        { "task": "Budget pub défini", "done": false, "priority": "haute", "tip": "..." },
        { "task": "Script UGC préparé", "done": false, "priority": "moyenne", "tip": "..." }
      ]
    },
    {
      "name": "Technique",
      "items": [
        { "task": "Domaine personnalisé", "done": false, "priority": "moyenne", "tip": "..." },
        { "task": "Email professionnel", "done": false, "priority": "moyenne", "tip": "..." },
        { "task": "Pixel Meta installé", "done": false, "priority": "haute", "tip": "..." },
        { "task": "Google Analytics", "done": false, "priority": "basse", "tip": "..." }
      ]
    }
  ],
  "launchAdvice": "Conseil personnalisé pour le lancement en 100 mots"
}`

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${process.env.GROQ_API_KEY}` },
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
    return res.status(500).json({ error: 'Erreur: ' + e.message })
  }
}
