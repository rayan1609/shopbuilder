export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { images, productTitle } = req.body
  const shop = process.env.SHOPIFY_SHOP
  const token = process.env.SHOPIFY_ACCESS_TOKEN

  if (!shop || !token) {
    return res.status(500).json({ error: 'Shopify non configuré.' })
  }

  try {
    // First find the product by title
    const searchRes = await fetch(`https://${shop}/admin/api/2024-01/products.json?title=${encodeURIComponent(productTitle)}&limit=1`, {
      headers: { 'X-Shopify-Access-Token': token }
    })
    const searchData = await searchRes.json()
    
    let productId = null
    if (searchData.products && searchData.products.length > 0) {
      productId = searchData.products[0].id
    } else {
      // Get latest product
      const latestRes = await fetch(`https://${shop}/admin/api/2024-01/products.json?limit=1&order=created_at+desc`, {
        headers: { 'X-Shopify-Access-Token': token }
      })
      const latestData = await latestRes.json()
      if (latestData.products && latestData.products.length > 0) {
        productId = latestData.products[0].id
      }
    }

    if (!productId) {
      return res.status(404).json({ error: 'Produit non trouvé sur Shopify. Push d\'abord le produit.' })
    }

    // Add images to product
    const results = []
    for (const imgUrl of images.slice(0, 8)) {
      try {
        const imgRes = await fetch(`https://${shop}/admin/api/2024-01/products/${productId}/images.json`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Access-Token': token
          },
          body: JSON.stringify({ image: { src: imgUrl } })
        })
        const imgData = await imgRes.json()
        results.push({ success: imgRes.ok, id: imgData.image?.id })
      } catch (e) {
        results.push({ success: false, error: e.message })
      }
    }

    const successCount = results.filter(r => r.success).length
    return res.status(200).json({ success: true, added: successCount, total: images.length })
  } catch (e) {
    return res.status(500).json({ error: 'Erreur Shopify: ' + e.message })
  }
}
