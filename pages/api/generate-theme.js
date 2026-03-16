export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { product, brandName, primaryColor = '#7c5cfc', secondaryColor = '#fc5c7d' } = req.body

  try {
    const prompt = `Tu es un expert en thèmes Shopify et conversion e-commerce.

Génère le contenu marketing pour un thème Shopify complet pour ce produit:
- Produit: ${product.title}
- Description: ${product.description}
- Prix: ${product.price}

Réponds UNIQUEMENT en JSON:
{
  "heroTitle": "Titre accrocheur homepage",
  "heroSubtitle": "Sous-titre persuasif",
  "heroCTA": "Texte bouton CTA",
  "feature1Title": "Avantage 1", "feature1Text": "Description", "feature1Icon": "emoji",
  "feature2Title": "Avantage 2", "feature2Text": "Description", "feature2Icon": "emoji",
  "feature3Title": "Avantage 3", "feature3Text": "Description", "feature3Icon": "emoji",
  "feature4Title": "Avantage 4", "feature4Text": "Description", "feature4Icon": "emoji",
  "testimonial1Name": "Nom", "testimonial1Text": "Avis client",
  "testimonial2Name": "Nom", "testimonial2Text": "Avis client",
  "testimonial3Name": "Nom", "testimonial3Text": "Avis client",
  "faq1Q": "Question 1", "faq1A": "Réponse 1",
  "faq2Q": "Question 2", "faq2A": "Réponse 2",
  "faq3Q": "Question 3", "faq3A": "Réponse 3",
  "urgencyText": "Texte urgence",
  "guaranteeText": "Texte garantie",
  "footerTagline": "Slogan footer"
}`

    const aiResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        max_tokens: 2000,
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' }
      }),
    })

    const aiData = await aiResponse.json()
    const c = JSON.parse(aiData.choices[0].message.content)
    const brand = brandName || 'Ma Boutique'
    const price = product.price || '29.99€'

    // Build theme files as strings
    const files = {}

    files['layout/theme.liquid'] = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{{ page_title }} - {{ shop.name }}</title>
{{ content_for_header }}
<style>
:root{--primary:${primaryColor};--secondary:${secondaryColor};--dark:#111;--light:#f8f8f8;--text:#333;--muted:#777;--radius:12px}
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:var(--text)}
.container{max-width:1100px;margin:0 auto;padding:0 20px}
.site-header{background:white;border-bottom:1px solid #eee;padding:16px 0;position:sticky;top:0;z-index:100;box-shadow:0 2px 10px rgba(0,0,0,0.05)}
.header-inner{display:flex;align-items:center;justify-content:space-between}
.logo{font-size:22px;font-weight:800;color:var(--primary);text-decoration:none}
.nav-links{display:flex;gap:24px;list-style:none}
.nav-links a{text-decoration:none;color:var(--text);font-weight:500}
.cart-btn{background:var(--primary);color:white;border:none;padding:10px 20px;border-radius:8px;cursor:pointer;font-weight:600}
.site-footer{background:var(--dark);color:white;padding:40px 0 24px;margin-top:60px}
.footer-bottom{text-align:center;color:#666;font-size:13px;padding-top:20px;border-top:1px solid #333}
@media(max-width:768px){.nav-links{display:none}}
</style>
</head>
<body>
<header class="site-header">
<div class="container">
<div class="header-inner">
<a href="/" class="logo">${brand}</a>
<nav><ul class="nav-links">
<li><a href="/">Accueil</a></li>
<li><a href="/collections/all">Produits</a></li>
<li><a href="/pages/contact">Contact</a></li>
</ul></nav>
<button class="cart-btn">🛒 Panier ({{ cart.item_count }})</button>
</div>
</div>
</header>
<main>{{ content_for_layout }}</main>
<footer class="site-footer">
<div class="container">
<p style="text-align:center;color:#aaa;margin-bottom:20px">${c.footerTagline}</p>
<div class="footer-bottom">© ${new Date().getFullYear()} ${brand}. Tous droits réservés.</div>
</div>
</footer>
</body>
</html>`

    files['templates/index.liquid'] = `<style>
.hero{background:linear-gradient(135deg,${primaryColor}15,${secondaryColor}10);padding:80px 0;text-align:center}
.hero h1{font-size:48px;font-weight:900;margin-bottom:20px;color:#111}
.hero p{font-size:20px;color:#777;max-width:600px;margin:0 auto 32px;line-height:1.6}
.hero-cta{display:inline-block;background:${primaryColor};color:white;padding:18px 40px;border-radius:12px;font-size:18px;font-weight:700;text-decoration:none}
.urgency-bar{background:#111;color:white;text-align:center;padding:12px;font-size:14px;font-weight:600}
.urgency-bar span{color:${secondaryColor}}
.features{padding:80px 0;background:white}
.features h2{text-align:center;font-size:36px;font-weight:800;margin-bottom:48px}
.features-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:24px}
.feature-card{text-align:center;padding:32px 20px;border-radius:12px;border:1px solid #eee}
.feature-icon{font-size:40px;margin-bottom:16px}
.feature-card h3{font-size:18px;font-weight:700;margin-bottom:10px}
.feature-card p{font-size:14px;color:#777;line-height:1.6}
.testimonials{padding:80px 0;background:#f8f8f8}
.testimonials h2{text-align:center;font-size:36px;font-weight:800;margin-bottom:48px}
.testimonials-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:24px}
.testimonial{background:white;border-radius:12px;padding:28px}
.testimonial-text{font-size:15px;line-height:1.7;margin-bottom:16px;font-style:italic}
.testimonial-name{font-weight:700;font-size:14px;color:#777}
.faq{padding:80px 0;background:white}
.faq h2{text-align:center;font-size:36px;font-weight:800;margin-bottom:48px}
.faq-item{background:#f8f8f8;border-radius:12px;margin-bottom:12px;padding:20px 24px}
.faq-q{font-weight:600;font-size:16px;margin-bottom:8px}
.faq-a{font-size:15px;color:#777;line-height:1.6}
.guarantee{background:linear-gradient(135deg,${primaryColor},${secondaryColor});color:white;padding:60px 0;text-align:center}
.guarantee h2{font-size:36px;font-weight:800;margin-bottom:16px}
.guarantee-badges{display:flex;justify-content:center;gap:32px;flex-wrap:wrap;margin-top:24px}
.guarantee-badge{text-align:center}
.guarantee-badge .icon{font-size:32px;margin-bottom:8px}
.guarantee-badge span{font-size:13px;font-weight:600;opacity:.9}
@media(max-width:768px){.hero h1{font-size:32px}.features-grid{grid-template-columns:1fr 1fr}.testimonials-grid{grid-template-columns:1fr}}
</style>

<div class="urgency-bar">🔥 <span>${c.urgencyText}</span> · Livraison offerte aujourd'hui</div>

<section class="hero">
<div class="container">
<h1>${c.heroTitle}</h1>
<p>${c.heroSubtitle}</p>
<a href="/collections/all" class="hero-cta">${c.heroCTA} →</a>
</div>
</section>

<section class="features">
<div class="container">
<h2>Pourquoi nous choisir ?</h2>
<div class="features-grid">
<div class="feature-card"><div class="feature-icon">${c.feature1Icon}</div><h3>${c.feature1Title}</h3><p>${c.feature1Text}</p></div>
<div class="feature-card"><div class="feature-icon">${c.feature2Icon}</div><h3>${c.feature2Title}</h3><p>${c.feature2Text}</p></div>
<div class="feature-card"><div class="feature-icon">${c.feature3Icon}</div><h3>${c.feature3Title}</h3><p>${c.feature3Text}</p></div>
<div class="feature-card"><div class="feature-icon">${c.feature4Icon}</div><h3>${c.feature4Title}</h3><p>${c.feature4Text}</p></div>
</div>
</div>
</section>

<section class="testimonials">
<div class="container">
<h2>⭐ Ce que disent nos clients</h2>
<div class="testimonials-grid">
<div class="testimonial"><div style="font-size:18px;margin-bottom:12px">⭐⭐⭐⭐⭐</div><p class="testimonial-text">"${c.testimonial1Text}"</p><div class="testimonial-name">— ${c.testimonial1Name}</div></div>
<div class="testimonial"><div style="font-size:18px;margin-bottom:12px">⭐⭐⭐⭐⭐</div><p class="testimonial-text">"${c.testimonial2Text}"</p><div class="testimonial-name">— ${c.testimonial2Name}</div></div>
<div class="testimonial"><div style="font-size:18px;margin-bottom:12px">⭐⭐⭐⭐⭐</div><p class="testimonial-text">"${c.testimonial3Text}"</p><div class="testimonial-name">— ${c.testimonial3Name}</div></div>
</div>
</div>
</section>

<section class="faq">
<div class="container">
<h2>❓ Questions fréquentes</h2>
<div class="faq-item"><div class="faq-q">${c.faq1Q}</div><div class="faq-a">${c.faq1A}</div></div>
<div class="faq-item"><div class="faq-q">${c.faq2Q}</div><div class="faq-a">${c.faq2A}</div></div>
<div class="faq-item"><div class="faq-q">${c.faq3Q}</div><div class="faq-a">${c.faq3A}</div></div>
</div>
</section>

<section class="guarantee">
<div class="container">
<h2>Notre garantie</h2>
<p>${c.guaranteeText}</p>
<div class="guarantee-badges">
<div class="guarantee-badge"><div class="icon">🚚</div><span>Livraison gratuite</span></div>
<div class="guarantee-badge"><div class="icon">🔄</div><span>Retour 30 jours</span></div>
<div class="guarantee-badge"><div class="icon">🔒</div><span>Paiement sécurisé</span></div>
<div class="guarantee-badge"><div class="icon">⭐</div><span>Satisfait ou remboursé</span></div>
</div>
</div>
</section>`

    files['templates/product.liquid'] = `<style>
.product-page{padding:60px 0}
.product-grid{display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:start}
.main-image{background:#f5f5f5;border-radius:12px;height:400px;display:flex;align-items:center;justify-content:center;overflow:hidden}
.main-image img{max-width:100%;max-height:100%;object-fit:contain}
.product-info h1{font-size:30px;font-weight:800;margin-bottom:12px;line-height:1.2}
.rating{display:flex;align-items:center;gap:8px;margin-bottom:20px;font-size:15px;color:#777}
.current-price{font-size:38px;font-weight:900;color:${primaryColor};margin-bottom:20px}
.urgency{background:#fff3cd;border:1px solid #ffc107;border-radius:8px;padding:12px 16px;font-size:14px;font-weight:600;color:#856404;margin-bottom:20px}
.bundles{margin-bottom:20px}
.bundles h3{font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#777;margin-bottom:10px}
.bundle{display:flex;align-items:center;gap:12px;padding:12px 16px;border:2px solid #eee;border-radius:10px;margin-bottom:8px;cursor:pointer}
.bundle.selected{border-color:${primaryColor};background:${primaryColor}08}
.bundle-radio{width:18px;height:18px;border-radius:50%;border:2px solid #ddd;flex-shrink:0}
.bundle.selected .bundle-radio{border-color:${primaryColor};background:${primaryColor};box-shadow:inset 0 0 0 3px white}
.bundle-info{flex:1}
.bundle-label{font-weight:600;font-size:14px}
.bundle-save{font-size:12px;color:#2ecc71;font-weight:600}
.bundle-price{font-weight:800;font-size:16px}
.bundle-badge{background:#ff4757;color:white;font-size:11px;font-weight:700;padding:2px 6px;border-radius:4px;margin-left:6px}
.add-to-cart{width:100%;background:${primaryColor};color:white;border:none;padding:16px;border-radius:12px;font-size:18px;font-weight:700;cursor:pointer;margin-bottom:10px}
.buy-now{width:100%;background:#111;color:white;border:none;padding:14px;border-radius:12px;font-size:16px;font-weight:700;cursor:pointer;margin-bottom:20px}
.trust-badges{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:24px}
.trust-badge{background:#f8f8f8;padding:8px 12px;border-radius:8px;font-size:13px;font-weight:600;text-align:center}
.reviews{padding:60px 0;background:#f8f8f8}
.reviews h2{font-size:28px;font-weight:800;margin-bottom:32px}
.reviews-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}
.review{background:white;border-radius:12px;padding:20px}
.review-header{display:flex;align-items:center;gap:10px;margin-bottom:10px}
.review-avatar{width:38px;height:38px;background:${primaryColor};color:white;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700}
.review-name{font-weight:600;font-size:14px}
.review-date{margin-left:auto;font-size:12px;color:#777}
.review-text{font-size:14px;color:#555;line-height:1.6}
@media(max-width:768px){.product-grid{grid-template-columns:1fr;gap:24px}.reviews-grid{grid-template-columns:1fr}}
</style>

<section class="product-page">
<div class="container">
<div class="product-grid">
<div>
<div class="main-image">{{ product.featured_image | img_tag: product.title }}</div>
</div>
<div class="product-info">
<div class="rating">⭐⭐⭐⭐⭐ 4.8/5 (127 avis vérifiés)</div>
<h1>{{ product.title }}</h1>
<div class="current-price">{{ product.price | money }}</div>
<div class="urgency">🔥 ${c.urgencyText}</div>
<div class="bundles">
<h3>Choisissez votre offre</h3>
<div class="bundle selected" onclick="selectBundle(this, 1)">
<div class="bundle-radio"></div>
<div class="bundle-info"><div class="bundle-label">1 unité</div></div>
<div class="bundle-price">{{ product.price | money }}</div>
</div>
<div class="bundle" onclick="selectBundle(this, 2)">
<div class="bundle-radio"></div>
<div class="bundle-info"><div class="bundle-label">2 unités</div><div class="bundle-save">Économisez 10%</div></div>
<div class="bundle-price">{{ product.price | times: 1.8 | money }}<span class="bundle-badge">-10%</span></div>
</div>
<div class="bundle" onclick="selectBundle(this, 3)">
<div class="bundle-radio"></div>
<div class="bundle-info"><div class="bundle-label">3 unités</div><div class="bundle-save">Économisez 20%</div></div>
<div class="bundle-price">{{ product.price | times: 2.4 | money }}<span class="bundle-badge">-20%</span></div>
</div>
</div>
<form action="/cart/add" method="post">
<input type="hidden" name="id" value="{{ product.selected_or_first_available_variant.id }}">
<button type="submit" class="add-to-cart">🛒 Ajouter au panier — {{ product.price | money }}</button>
</form>
<button class="buy-now" onclick="window.location='/checkout'">⚡ Acheter maintenant</button>
<div class="trust-badges">
<div class="trust-badge">🚚 Livraison gratuite</div>
<div class="trust-badge">🔄 Retour 30 jours</div>
<div class="trust-badge">🔒 Paiement sécurisé</div>
<div class="trust-badge">✅ Satisfait ou remboursé</div>
</div>
<div>{{ product.description }}</div>
</div>
</div>
</div>
</section>

<section class="reviews">
<div class="container">
<h2>⭐ Avis clients</h2>
<div class="reviews-grid">
<div class="review"><div class="review-header"><div class="review-avatar">${c.testimonial1Name[0]}</div><div><div class="review-name">${c.testimonial1Name}</div><div style="font-size:12px">⭐⭐⭐⭐⭐</div></div><div class="review-date">il y a 2 jours</div></div><p class="review-text">${c.testimonial1Text}</p></div>
<div class="review"><div class="review-header"><div class="review-avatar">${c.testimonial2Name[0]}</div><div><div class="review-name">${c.testimonial2Name}</div><div style="font-size:12px">⭐⭐⭐⭐⭐</div></div><div class="review-date">il y a 5 jours</div></div><p class="review-text">${c.testimonial2Text}</p></div>
<div class="review"><div class="review-header"><div class="review-avatar">${c.testimonial3Name[0]}</div><div><div class="review-name">${c.testimonial3Name}</div><div style="font-size:12px">⭐⭐⭐⭐⭐</div></div><div class="review-date">il y a 1 semaine</div></div><p class="review-text">${c.testimonial3Text}</p></div>
</div>
</div>
</section>

<script>
function selectBundle(el, qty) {
  document.querySelectorAll('.bundle').forEach(b => b.classList.remove('selected'))
  el.classList.add('selected')
}
</script>`

    files['config/settings_schema.json'] = JSON.stringify([{"name":"theme_info","theme_name":brand,"theme_version":"1.0.0"}])
    files['config/settings_data.json'] = JSON.stringify({"current":{}})
    files['locales/fr.default.json'] = JSON.stringify({"general":{"language":"Français"}})

    // Build ZIP manually using base64
    const boundary = '----ShopifyThemeBoundary'
    
    // Use Node.js built-in to create zip
    const { execSync } = require('child_process')
    const fs = require('fs')
    const path = require('path')
    const os = require('os')
    
    // Create temp directory
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'shopify-theme-'))
    
    // Write files
    for (const [filePath, content] of Object.entries(files)) {
      const fullPath = path.join(tmpDir, filePath)
      fs.mkdirSync(path.dirname(fullPath), { recursive: true })
      fs.writeFileSync(fullPath, content, 'utf8')
    }
    
    // Create zip
    const zipPath = path.join(os.tmpdir(), `theme-${Date.now()}.zip`)
    execSync(`cd "${tmpDir}" && zip -r "${zipPath}" .`)
    
    // Read and send
    const zipBuffer = fs.readFileSync(zipPath)
    
    // Cleanup
    fs.rmSync(tmpDir, { recursive: true })
    fs.unlinkSync(zipPath)
    
    res.setHeader('Content-Type', 'application/zip')
    res.setHeader('Content-Disposition', `attachment; filename="shopify-theme.zip"`)
    res.send(zipBuffer)

  } catch (e) {
    return res.status(500).json({ error: 'Erreur: ' + e.message })
  }
}
