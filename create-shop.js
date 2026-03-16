export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { shopData } = req.body
  const shop = process.env.SHOPIFY_SHOP
  const token = process.env.SHOPIFY_ACCESS_TOKEN

  if (!shop || !token) {
    return res.status(500).json({ error: 'Shopify non configuré.' })
  }

  try {
    const results = []

    // Create About page
    const aboutRes = await fetch(`https://${shop}/admin/api/2024-01/pages.json`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': token },
      body: JSON.stringify({
        page: {
          title: 'À propos',
          body_html: `<h1>${shopData.brandName}</h1><p>${shopData.aboutPage}</p>`,
          published: true,
        }
      }),
    })
    results.push({ page: 'about', status: aboutRes.status })

    // Create Shipping policy page
    const shippingRes = await fetch(`https://${shop}/admin/api/2024-01/pages.json`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': token },
      body: JSON.stringify({
        page: {
          title: 'Politique de livraison',
          body_html: `<p>${shopData.shippingPolicy}</p>`,
          published: true,
        }
      }),
    })
    results.push({ page: 'shipping', status: shippingRes.status })

    // Create Return policy page
    const returnRes = await fetch(`https://${shop}/admin/api/2024-01/pages.json`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': token },
      body: JSON.stringify({
        page: {
          title: 'Politique de retour',
          body_html: `<p>${shopData.returnPolicy}</p>`,
          published: true,
        }
      }),
    })
    results.push({ page: 'returns', status: returnRes.status })

    return res.status(200).json({ success: true, results })
  } catch (e) {
    return res.status(500).json({ error: 'Erreur création shop: ' + e.message })
  }
}
