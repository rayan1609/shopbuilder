export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { productName, price, brandName, primaryColor, guarantee } = req.body

  const prompt = `Génère du contenu pour une page checkout pour:
- Produit: ${productName}
- Prix: ${price}€
- Marque: ${brandName || 'Notre boutique'}
- Garantie: ${guarantee}

Réponds en JSON:
{
  "urgencyText": "Texte urgence court (ex: Offre expire dans)",
  "trustText1": "Badge confiance 1",
  "trustText2": "Badge confiance 2", 
  "trustText3": "Badge confiance 3",
  "guaranteeText": "Texte garantie court",
  "summaryTitle": "Titre résumé commande",
  "thankYouText": "Message remerciement après achat"
}`

  try {
    const aiRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${process.env.GROQ_API_KEY}` },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        max_tokens: 500,
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' }
      }),
    })

    const aiData = await aiRes.json()
    const c = JSON.parse(aiData.choices[0].message.content)
    const brand = brandName || 'Notre boutique'
    const pc = primaryColor || '#7c5cfc'

    const html = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Commande — ${brand}</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#f5f5f5;color:#333}
.header{background:white;border-bottom:1px solid #eee;padding:16px 20px;text-align:center}
.logo{font-size:22px;font-weight:800;color:${pc}}
.secure{font-size:12px;color:#888;margin-top:4px}
.timer-bar{background:#111;color:white;text-align:center;padding:10px;font-size:14px;font-weight:600}
.timer-bar span{color:#f39c12}
.container{max-width:960px;margin:0 auto;padding:24px 16px;display:grid;grid-template-columns:1fr 380px;gap:24px}
.form-section{background:white;border-radius:12px;padding:24px;box-shadow:0 2px 10px rgba(0,0,0,0.05)}
.section-title{font-size:16px;font-weight:700;margin-bottom:16px;padding-bottom:12px;border-bottom:1px solid #eee}
.form-group{margin-bottom:14px}
.form-group label{display:block;font-size:13px;font-weight:600;color:#555;margin-bottom:6px}
.form-group input,.form-group select{width:100%;padding:12px 14px;border:1px solid #ddd;border-radius:8px;font-size:14px;outline:none;transition:border 0.2s}
.form-group input:focus,.form-group select:focus{border-color:${pc}}
.form-row{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.order-summary{position:sticky;top:20px}
.summary-card{background:white;border-radius:12px;padding:24px;box-shadow:0 2px 10px rgba(0,0,0,0.05);margin-bottom:16px}
.product-row{display:flex;gap:12px;align-items:center;padding:12px 0;border-bottom:1px solid #eee}
.product-img{width:56px;height:56px;background:#f0f0f0;border-radius:8px;flex-shrink:0}
.product-name{font-size:14px;font-weight:600;flex:1}
.product-price{font-size:16px;font-weight:800;color:${pc}}
.total-row{display:flex;justify-content:space-between;padding:8px 0;font-size:14px}
.total-row.final{border-top:2px solid #eee;margin-top:8px;padding-top:12px;font-size:18px;font-weight:800}
.submit-btn{width:100%;background:${pc};color:white;border:none;padding:18px;border-radius:12px;font-size:18px;font-weight:700;cursor:pointer;margin-top:16px;transition:all 0.2s}
.submit-btn:hover{opacity:0.9;transform:translateY(-1px)}
.trust-badges{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:16px}
.trust-badge{text-align:center;padding:10px 8px;background:#f8f8f8;border-radius:8px;font-size:12px;font-weight:600}
.trust-badge .icon{font-size:20px;display:block;margin-bottom:4px}
.guarantee-box{background:#f0faf0;border:1px solid #2ecc7130;border-radius:10px;padding:14px;margin-top:16px;font-size:13px;color:#27ae60;text-align:center}
.payment-icons{display:flex;justify-content:center;gap:8px;margin-top:12px;opacity:0.6}
.payment-icon{background:#eee;padding:4px 10px;border-radius:4px;font-size:12px;font-weight:600}
@media(max-width:768px){.container{grid-template-columns:1fr}.order-summary{position:static}.form-row{grid-template-columns:1fr}}
</style>
</head>
<body>
<div class="header">
<div class="logo">${brand}</div>
<div class="secure">🔒 Paiement 100% sécurisé et crypté</div>
</div>
<div class="timer-bar">
⏱️ ${c.urgencyText} : <span id="timer">14:59</span> — Ne fermez pas cette page !
</div>
<div class="container">
<div>
<div class="form-section" style="margin-bottom:16px">
<div class="section-title">📦 Informations de livraison</div>
<div class="form-row">
<div class="form-group"><label>Prénom</label><input type="text" placeholder="Jean"></div>
<div class="form-group"><label>Nom</label><input type="text" placeholder="Dupont"></div>
</div>
<div class="form-group"><label>Email</label><input type="email" placeholder="jean@email.com"></div>
<div class="form-group"><label>Téléphone</label><input type="tel" placeholder="+33 6 00 00 00 00"></div>
<div class="form-group"><label>Adresse</label><input type="text" placeholder="12 rue de la Paix"></div>
<div class="form-row">
<div class="form-group"><label>Ville</label><input type="text" placeholder="Paris"></div>
<div class="form-group"><label>Code postal</label><input type="text" placeholder="75001"></div>
</div>
<div class="form-group"><label>Pays</label>
<select><option>France</option><option>Belgique</option><option>Suisse</option><option>Canada</option></select>
</div>
</div>
<div class="form-section">
<div class="section-title">💳 Informations de paiement</div>
<div class="form-group"><label>Numéro de carte</label><input type="text" placeholder="1234 5678 9012 3456"></div>
<div class="form-row">
<div class="form-group"><label>Date d'expiration</label><input type="text" placeholder="MM/AA"></div>
<div class="form-group"><label>CVV</label><input type="text" placeholder="123"></div>
</div>
<div class="payment-icons">
<div class="payment-icon">VISA</div>
<div class="payment-icon">MC</div>
<div class="payment-icon">AMEX</div>
<div class="payment-icon">PayPal</div>
</div>
</div>
</div>
<div class="order-summary">
<div class="summary-card">
<div class="section-title">${c.summaryTitle}</div>
<div class="product-row">
<div class="product-img"></div>
<div class="product-name">${productName}</div>
<div class="product-price">${price}€</div>
</div>
<div class="total-row"><span>Sous-total</span><span>${price}€</span></div>
<div class="total-row"><span>Livraison</span><span style="color:#2ecc71">GRATUITE</span></div>
<div class="total-row final"><span>Total</span><span style="color:${pc}">${price}€</span></div>
<button class="submit-btn" onclick="alert('Merci pour votre commande ! ${c.thankYouText}')">
🔒 Confirmer ma commande — ${price}€
</button>
<div class="trust-badges">
<div class="trust-badge"><span class="icon">🔒</span>${c.trustText1}</div>
<div class="trust-badge"><span class="icon">🚚</span>${c.trustText2}</div>
<div class="trust-badge"><span class="icon">✅</span>${c.trustText3}</div>
</div>
<div class="guarantee-box">🛡️ ${c.guaranteeText} — Garantie ${guarantee}</div>
</div>
</div>
</div>
<script>
let t = 14*60+59
const el = document.getElementById('timer')
setInterval(() => {
  if(t <= 0) { el.textContent = '00:00'; return }
  t--
  el.textContent = Math.floor(t/60).toString().padStart(2,'0') + ':' + (t%60).toString().padStart(2,'0')
}, 1000)
</script>
</body>
</html>`

    return res.status(200).json({ html })
  } catch (e) {
    return res.status(500).json({ error: e.message })
  }
}
