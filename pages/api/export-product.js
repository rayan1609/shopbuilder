export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { product } = req.body

  const bullets = Array.isArray(product.bullets)
    ? product.bullets
    : String(product.bullets || '').split('\n').filter(b => b.trim())

  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<style>
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #333; max-width: 800px; margin: 0 auto; padding: 40px; }
  .header { background: linear-gradient(135deg, #7c5cfc, #fc5c7d); color: white; padding: 32px; border-radius: 12px; margin-bottom: 32px; }
  .header h1 { font-size: 28px; font-weight: 800; margin-bottom: 8px; }
  .header .price { font-size: 36px; font-weight: 900; }
  .section { margin-bottom: 28px; }
  .section h2 { font-size: 16px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #888; margin-bottom: 12px; border-bottom: 2px solid #f0f0f0; padding-bottom: 8px; }
  .section p { font-size: 15px; line-height: 1.7; color: #444; }
  .bullet { display: flex; gap: 10px; margin-bottom: 8px; font-size: 15px; }
  .bullet-icon { color: #2ecc71; font-weight: 800; font-size: 18px; }
  .tags { display: flex; flex-wrap: wrap; gap: 8px; }
  .tag { background: #7c5cfc20; color: #7c5cfc; padding: 4px 12px; border-radius: 20px; font-size: 13px; font-weight: 600; border: 1px solid #7c5cfc30; }
  .ad-script { background: #f8f8f8; border-left: 4px solid #7c5cfc; padding: 16px 20px; border-radius: 0 8px 8px 0; font-size: 14px; line-height: 1.8; color: #444; white-space: pre-wrap; }
  .footer { margin-top: 40px; text-align: center; color: #aaa; font-size: 12px; border-top: 1px solid #eee; padding-top: 20px; }
</style>
</head>
<body>
  <div class="header">
    <h1>${product.title || 'Fiche produit'}</h1>
    <div class="price">${product.price || ''}</div>
  </div>

  <div class="section">
    <h2>Description</h2>
    <p>${product.description || ''}</p>
  </div>

  <div class="section">
    <h2>Points clés</h2>
    ${bullets.map(b => `<div class="bullet"><span class="bullet-icon">✓</span><span>${String(b).replace('✓', '').trim()}</span></div>`).join('')}
  </div>

  <div class="section">
    <h2>Tags SEO</h2>
    <div class="tags">
      ${(Array.isArray(product.tags) ? product.tags : []).map(t => `<span class="tag">${t}</span>`).join('')}
    </div>
  </div>

  <div class="section">
    <h2>Script publicitaire TikTok/Reels</h2>
    <div class="ad-script">${product.adScript || ''}</div>
  </div>

  ${product.metaDescription ? `
  <div class="section">
    <h2>Meta Description SEO</h2>
    <p>${product.metaDescription}</p>
  </div>` : ''}

  <div class="footer">
    Généré par ShopBuilder — ${new Date().toLocaleDateString('fr-FR')}
  </div>
</body>
</html>`

  res.setHeader('Content-Type', 'text/html; charset=utf-8')
  res.setHeader('Content-Disposition', `attachment; filename="fiche-produit.html"`)
  res.send(html)
}
