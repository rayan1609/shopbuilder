export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { product } = req.body
  const shop = process.env.SHOPIFY_SHOP
  const token = process.env.SHOPIFY_ACCESS_TOKEN

  if (!shop || !token) {
    return res.status(500).json({ error: 'Shopify non configuré. Vérifie tes variables d\'environnement.' })
  }

  try {
    const shopifyProduct = {
      product: {
        title: product.title,
        body_html: `<p>${product.description}</p><ul>${product.bullets?.split('\n').map(b => `<li>${b}</li>`).join('')}</ul>`,
        tags: product.tags?.join(', '),
        variants: [{
          price: product.price?.replace('€', '').replace(',', '.') || '29.99',
          inventory_management: 'shopify',
          fulfillment_service: 'manual',
        }],
        status: 'draft',
      }
    }

    const response = await fetch(`https://${shop}/admin/api/2024-01/products.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': token,
      },
      body: JSON.stringify(shopifyProduct),
    })

    const data = await response.json()
    if (!response.ok) throw new Error(JSON.stringify(data.errors))

    return res.status(200).json({ success: true, productId: data.product.id })
  } catch (e) {
    return res.status(500).json({ error: 'Erreur Shopify: ' + e.message })
  }
}
