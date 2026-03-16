export default function handler(req, res) {
  const { shop } = req.query
  if (!shop) return res.status(400).send('Shop manquant')

  const clientId = process.env.SHOPIFY_CLIENT_ID
  const redirectUri = `https://shopbuilder-omega.vercel.app/api/auth/callback`
  const scopes = 'write_products,read_products,write_themes,read_themes,write_content,read_content'

  const authUrl = `https://${shop}/admin/oauth/authorize?client_id=${clientId}&scope=${scopes}&redirect_uri=${redirectUri}`
  
  res.redirect(authUrl)
}
