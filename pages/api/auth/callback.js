export default async function handler(req, res) {
  const { code, shop } = req.query

  try {
    const response = await fetch(`https://${shop}/admin/oauth/access_token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: process.env.SHOPIFY_CLIENT_ID,
        client_secret: process.env.SHOPIFY_CLIENT_SECRET,
        code,
      }),
    })

    const data = await response.json()
    const accessToken = data.access_token

    res.send(`
      <h1>✅ Connexion réussie !</h1>
      <p>Ton Access Token Shopify :</p>
      <code style="background:#f0f0f0;padding:10px;display:block;margin:10px 0">${accessToken}</code>
      <p>Copie ce token et ajoute le dans Vercel comme variable : <strong>SHOPIFY_ACCESS_TOKEN</strong></p>
    `)
  } catch (e) {
    res.status(500).send('Erreur: ' + e.message)
  }
}
