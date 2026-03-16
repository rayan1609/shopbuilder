export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { product } = req.body
  const shop = process.env.SHOPIFY_SHOP
  const token = process.env.SHOPIFY_ACCESS_TOKEN

  if (!shop || !token) {
    return res.status(500).json({ error: 'Shopify non configuré.' })
  }

  try {
    const bullets = Array.isArray(product.bullets)
      ? product.bullets
      : String(product.bullets || '').split('\n').filter(b => b.trim())

    const bulletsHtml = bullets.map(b => 
      `<li>${String(b).replace('✓', '').trim()}</li>`
    ).join('')

    const bodyHtml = `
      <p>${product.description}</p>
      <ul>${bulletsHtml}</ul>
    `

    const price = parseFloat(
      String(product.price || '29.99').replace(/[^0-9.]/g, '')
    ) || 29.99

    const shopifyProduct = {
      product: {
        title: product.title,
        body_html: bodyHtml,
        tags: Array.isArray(product.tags) ? product.tags.join(', ') : product.tags,
        variants: [{
          price: price.toFixed(2),
          inventory_management: 'shopify',
          fulfillment_service: 'manual',
          inventory_quantity: 100,
        }],
        status: 'active',
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

    return res.status(200).json({ success: true, productId: data.product.id, productUrl: `https://${shop}/products/${data.product.handle}` })
  } catch (e) {
    return res.status(500).json({ error: 'Erreur Shopify: ' + e.message })
  }
}
