export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { product, language } = req.body

  const langMap = {
    en: 'English',
    es: 'Spanish',
    de: 'German',
    it: 'Italian',
    pt: 'Portuguese',
    ar: 'Arabic'
  }

  const prompt = `You are an expert e-commerce copywriter and translator.

Translate this product listing into ${langMap[language]}, keeping the same marketing tone and persuasive style.

Original product data:
- Title: ${product.title}
- Description: ${product.description}
- Bullets: ${product.bullets}
- Tags: ${product.tags?.join(', ')}
- Ad Script: ${product.adScript}
- Meta Description: ${product.metaDescription}

Respond ONLY in valid JSON:
{
  "title": "Translated title",
  "price": "${product.price}",
  "description": "Translated description, same length and style",
  "bullets": "Translated bullet points, same format",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "adScript": "Translated ad script",
  "metaDescription": "Translated meta description"
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
    const translated = JSON.parse(text)

    return res.status(200).json(translated)
  } catch (e) {
    return res.status(500).json({ error: 'Erreur traduction: ' + e.message })
  }
}
