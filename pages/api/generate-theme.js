const fs = require('fs')
const path = require('path')
const os = require('os')

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { product, brandName, primaryColor = '#7c5cfc', secondaryColor = '#fc5c7d' } = req.body

  try {
    const prompt = `Tu es un expert en thèmes Shopify et conversion e-commerce.

Génère le contenu marketing pour un thème Shopify pour ce produit:
- Produit: ${product.title}
- Description: ${product.description}
- Prix: ${product.price}

Réponds UNIQUEMENT en JSON:
{
  "heroTitle": "Titre accrocheur homepage",
  "heroSubtitle": "Sous-titre persuasif",
  "heroCTA": "Texte bouton CTA",
  "feature1Title": "Avantage 1", "feature1Text": "Description courte", "feature1Icon": "emoji",
  "feature2Title": "Avantage 2", "feature2Text": "Description courte", "feature2Icon": "emoji",
  "feature3Title": "Avantage 3", "feature3Text": "Description courte", "feature3Icon": "emoji",
  "feature4Title": "Avantage 4", "feature4Text": "Description courte", "feature4Icon": "emoji",
  "testimonial1Name": "Nom", "testimonial1Text": "Avis client",
  "testimonial2Name": "Nom", "testimonial2Text": "Avis client",
  "testimonial3Name": "Nom", "testimonial3Text": "Avis client",
  "faq1Q": "Question 1", "faq1A": "Réponse 1",
  "faq2Q": "Question 2", "faq2A": "Réponse 2",
  "faq3Q": "Question 3", "faq3A": "Réponse 3",
  "urgencyText": "Texte urgence stock limité",
  "guaranteeText": "Texte garantie satisfaction",
  "footerTagline": "Slogan footer",
  "imageKeyword": "mot clé en anglais pour trouver une photo du produit (ex: watch, teddy bear, lamp)"
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
    const imgKeyword = encodeURIComponent(c.imageKeyword || product.title || 'product')
    const heroImg = `https://picsum.photos/seed/${imgKeyword}1/1200/500`
const productImg1 = `https://picsum.photos/seed/${imgKeyword}1/800/800`
const productImg2 = `https://picsum.photos/seed/${imgKeyword}2/800/800`
const productImg3 = `https://picsum.photos/seed/${imgKeyword}3/800/800`
    const themeLiquid = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{{ page_title }} - {{ shop.name }}</title>
{{ content_for_header }}
<style>
:root{--primary:${primaryColor};--secondary:${secondaryColor}}
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#333}
.container{max-width:1100px;margin:0 auto;padding:0 20px}
.site-header{background:white;border-bottom:1px solid #eee;padding:16px 0;position:sticky;top:0;z-index:100}
.header-inner{display:flex;align-items:center;justify-content:space-between}
.logo{font-size:22px;font-weight:800;color:var(--primary);text-decoration:none}
.nav-links{display:flex;gap:24px;list-style:none}
.nav-links a{text-decoration:none;color:#333;font-weight:500}
.cart-btn{background:var(--primary);color:white;border:none;padding:10px 20px;border-radius:8px;cursor:pointer;font-weight:600}
.site-footer{background:#111;color:white;padding:40px 0 24px;margin-top:60px;text-align:center}
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
<p style="color:#aaa;margin-bottom:16px">${c.footerTagline}</p>
<p style="color:#666;font-size:13px">© ${new Date().getFullYear()} ${brand}. Tous droits réservés.</p>
</div>
</footer>
</body>
</html>`

    const indexLiquid = `<style>
.hero{position:relative;padding:80px 0;text-align:center;overflow:hidden}
.hero-bg{position:absolute;inset:0;background-image:url('${productImg1}');background-size:cover;background-position:center;filter:brightness(0.3)}
.hero-content{position:relative;z-index:1}
.hero h1{font-size:48px;font-weight:900;margin-bottom:20px;color:white}
.hero p{font-size:20px;color:rgba(255,255,255,0.85);max-width:600px;margin:0 auto 32px;line-height:1.6}
.hero-cta{display:inline-block;background:${primaryColor};color:white;padding:18px 40px;border-radius:12px;font-size:18px;font-weight:700;text-decoration:none}
.urgency-bar{background:#111;color:white;text-align:center;padding:12px;font-size:14px;font-weight:600}
.features{padding:80px 0}
.features h2{text-align:center;font-size:36px;font-weight:800;margin-bottom:48px}
.features-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:24px}
.feature-card{text-align:center;padding:32px 20px;border-radius:12px;border:1px solid #eee}
.feature-icon{font-size:40px;margin-bottom:16px}
.feature-card h3{font-size:18px;font-weight:700;margin-bottom:10px}
.feature-card p{font-size:14px;color:#777;line-height:1.6}
.product-showcase{padding:80px 0;background:#f8f8f8}
.product-showcase h2{text-align:center;font-size:36px;font-weight:800;margin-bottom:48px}
.showcase-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:24px}
.showcase-img{border-radius:16px;overflow:hidden;aspect-ratio:1}
.showcase-img img{width:100%;height:100%;object-fit:cover;transition:transform 0.3s}
.showcase-img:hover img{transform:scale(1.05)}
.testimonials{padding:80px 0}
.testimonials h2{text-align:center;font-size:36px;font-weight:800;margin-bottom:48px}
.testimonials-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:24px}
.testimonial{background:#f8f8f8;border-radius:12px;padding:28px}
.testimonial-text{font-size:15px;line-height:1.7;margin-bottom:16px;font-style:italic}
.testimonial-name{font-weight:700;font-size:14px;color:#777}
.faq{padding:80px 0;background:#f8f8f8}
.faq h2{text-align:center;font-size:36px;font-weight:800;margin-bottom:48px}
.faq-item{background:white;border-radius:12px;margin-bottom:12px;padding:20px 24px}
.faq-q{font-weight:600;font-size:16px;margin-bottom:8px}
.faq-a{font-size:15px;color:#777;line-height:1.6}
.guarantee{background:linear-gradient(135deg,${primaryColor},${secondaryColor});color:white;padding:60px 0;text-align:center}
.guarantee h2{font-size:36px;font-weight:800;margin-bottom:16px}
.guarantee-badges{display:flex;justify-content:center;gap:32px;flex-wrap:wrap;margin-top:24px}
.guarantee-badge .icon{font-size:32px;margin-bottom:8px}
.guarantee-badge span{font-size:13px;font-weight:600;opacity:.9;display:block}
@media(max-width:768px){.hero h1{font-size:32px}.features-grid{grid-template-columns:1fr 1fr}.testimonials-grid{grid-template-columns:1fr}.showcase-grid{grid-template-columns:1fr 1fr}}
</style>
<div class="urgency-bar">🔥 ${c.urgencyText} · Livraison offerte aujourd'hui</div>
<section class="hero">
<div class="hero-bg"></div>
<div class="container hero-content">
<h1>${c.heroTitle}</h1>
<p>${c.heroSubtitle}</p>
<a href="/collections/all" class="hero-cta">${c.heroCTA} →</a>
</div>
</section>
<section class="features"><div class="container">
<h2>Pourquoi nous choisir ?</h2>
<div class="features-grid">
<div class="feature-card"><div class="feature-icon">${c.feature1Icon}</div><h3>${c.feature1Title}</h3><p>${c.feature1Text}</p></div>
<div class="feature-card"><div class="feature-icon">${c.feature2Icon}</div><h3>${c.feature2Title}</h3><p>${c.feature2Text}</p></div>
<div class="feature-card"><div class="feature-icon">${c.feature3Icon}</div><h3>${c.feature3Title}</h3><p>${c.feature3Text}</p></div>
<div class="feature-card"><div class="feature-icon">${c.feature4Icon}</div><h3>${c.feature4Title}</h3><p>${c.feature4Text}</p></div>
</div></div></section>
<section class="product-showcase"><div class="container">
<h2>Découvrez notre produit</h2>
<div class="showcase-grid">
<div class="showcase-img"><img src="${productImg1}" alt="${product.title}" loading="lazy"></div>
<div class="showcase-img"><img src="${productImg2}" alt="${product.title}" loading="lazy"></div>
<div class="showcase-img"><img src="${productImg3}" alt="${product.title}" loading="lazy"></div>
</div>
</div></section>
<section class="testimonials"><div class="container">
<h2>⭐ Ce que disent nos clients</h2>
<div class="testimonials-grid">
<div class="testimonial"><div style="font-size:18px;margin-bottom:12px">⭐⭐⭐⭐⭐</div><p class="testimonial-text">"${c.testimonial1Text}"</p><div class="testimonial-name">— ${c.testimonial1Name}</div></div>
<div class="testimonial"><div style="font-size:18px;margin-bottom:12px">⭐⭐⭐⭐⭐</div><p class="testimonial-text">"${c.testimonial2Text}"</p><div class="testimonial-name">— ${c.testimonial2Name}</div></div>
<div class="testimonial"><div style="font-size:18px;margin-bottom:12px">⭐⭐⭐⭐⭐</div><p class="testimonial-text">"${c.testimonial3Text}"</p><div class="testimonial-name">— ${c.testimonial3Name}</div></div>
</div></div></section>
<section class="faq"><div class="container">
<h2>❓ Questions fréquentes</h2>
<div class="faq-item"><div class="faq-q">${c.faq1Q}</div><div class="faq-a">${c.faq1A}</div></div>
<div class="faq-item"><div class="faq-q">${c.faq2Q}</div><div class="faq-a">${c.faq2A}</div></div>
<div class="faq-item"><div class="faq-q">${c.faq3Q}</div><div class="faq-a">${c.faq3A}</div></div>
</div></section>
<section class="guarantee"><div class="container">
<h2>Notre garantie</h2>
<p>${c.guaranteeText}</p>
<div class="guarantee-badges">
<div class="guarantee-badge"><div class="icon">🚚</div><span>Livraison gratuite</span></div>
<div class="guarantee-badge"><div class="icon">🔄</div><span>Retour 30 jours</span></div>
<div class="guarantee-badge"><div class="icon">🔒</div><span>Paiement sécurisé</span></div>
<div class="guarantee-badge"><div class="icon">⭐</div><span>Satisfait ou remboursé</span></div>
</div></div></section>`

    const productLiquid = `<style>
.product-page{padding:60px 0}
.product-grid{display:grid;grid-template-columns:1fr 1fr;gap:60px}
.main-image{background:#f5f5f5;border-radius:12px;min-height:400px;display:flex;align-items:center;justify-content:center;overflow:hidden}
.main-image img{max-width:100%;object-fit:contain}
.product-thumbs{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:12px}
.product-thumb{border-radius:8px;overflow:hidden;aspect-ratio:1;cursor:pointer;border:2px solid transparent}
.product-thumb img{width:100%;height:100%;object-fit:cover}
.product-thumb:hover{border-color:${primaryColor}}
.product-info h1{font-size:30px;font-weight:800;margin-bottom:12px}
.rating{margin-bottom:20px;color:#777;font-size:15px}
.price{font-size:38px;font-weight:900;color:${primaryColor};margin-bottom:20px}
.urgency{background:#fff3cd;border:1px solid #ffc107;border-radius:8px;padding:12px 16px;font-size:14px;font-weight:600;color:#856404;margin-bottom:20px}
.bundles{margin-bottom:20px}
.bundles-title{font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#777;margin-bottom:10px}
.bundle{display:flex;align-items:center;gap:12px;padding:12px 16px;border:2px solid #eee;border-radius:10px;margin-bottom:8px;cursor:pointer;transition:all 0.2s}
.bundle:first-of-type{border-color:${primaryColor};background:${primaryColor}08}
.bundle-radio{width:18px;height:18px;border-radius:50%;border:2px solid #ddd;flex-shrink:0}
.bundle:first-of-type .bundle-radio{border-color:${primaryColor};background:${primaryColor};box-shadow:inset 0 0 0 3px white}
.bundle-name{font-weight:600;font-size:14px;flex:1}
.bundle-save{font-size:12px;color:#2ecc71;font-weight:600;display:block}
.bundle-price{font-weight:800;font-size:16px}
.badge{background:#ff4757;color:white;font-size:11px;font-weight:700;padding:2px 6px;border-radius:4px;margin-left:6px}
.add-cart{width:100%;background:${primaryColor};color:white;border:none;padding:16px;border-radius:12px;font-size:18px;font-weight:700;cursor:pointer;margin-bottom:10px}
.buy-now{width:100%;background:#111;color:white;border:none;padding:14px;border-radius:12px;font-size:16px;font-weight:700;cursor:pointer;margin-bottom:20px}
.badges{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:24px}
.badge-item{background:#f8f8f8;padding:8px 12px;border-radius:8px;font-size:13px;font-weight:600;text-align:center}
.reviews-section{padding:60px 0;background:#f8f8f8}
.reviews-section h2{font-size:28px;font-weight:800;margin-bottom:32px}
.reviews-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}
.review{background:white;border-radius:12px;padding:20px}
.review-header{display:flex;align-items:center;gap:10px;margin-bottom:10px}
.avatar{width:38px;height:38px;background:${primaryColor};color:white;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:16px}
.reviewer-name{font-weight:600;font-size:14px}
.review-date{margin-left:auto;font-size:12px;color:#777}
.review-text{font-size:14px;color:#555;line-height:1.6}
@media(max-width:768px){.product-grid{grid-template-columns:1fr}.reviews-grid{grid-template-columns:1fr}}
</style>
<section class="product-page"><div class="container">
<div class="product-grid">
<div>
<div class="main-image">
{% if product.featured_image %}
{{ product.featured_image | img_tag: product.title }}
{% else %}
<img src="${productImg1}" alt="${product.title}" style="max-width:100%;object-fit:cover">
{% endif %}
</div>
<div class="product-thumbs">
{% for image in product.images limit:3 %}
<div class="product-thumb"><img src="{{ image.src }}" alt="{{ product.title }}"></div>
{% else %}
<div class="product-thumb"><img src="${productImg1}" alt="${product.title}"></div>
<div class="product-thumb"><img src="${productImg2}" alt="${product.title}"></div>
<div class="product-thumb"><img src="${productImg3}" alt="${product.title}"></div>
{% endfor %}
</div>
</div>
<div class="product-info">
<div class="rating">⭐⭐⭐⭐⭐ 4.8/5 · 127 avis vérifiés</div>
<h1>{{ product.title }}</h1>
<div class="price">{{ product.price | money }}</div>
<div class="urgency">🔥 ${c.urgencyText}</div>
<div class="bundles">
<div class="bundles-title">Choisissez votre offre</div>
<div class="bundle" onclick="selectBundle(this)"><div class="bundle-radio"></div><div class="bundle-name">1 unité</div><div class="bundle-price">{{ product.price | money }}</div></div>
<div class="bundle" onclick="selectBundle(this)"><div class="bundle-radio"></div><div><div class="bundle-name">2 unités</div><span class="bundle-save">Économisez 10%</span></div><div class="bundle-price">{{ product.price | times: 1.8 | money }}<span class="badge">-10%</span></div></div>
<div class="bundle" onclick="selectBundle(this)"><div class="bundle-radio"></div><div><div class="bundle-name">3 unités</div><span class="bundle-save">Économisez 20%</span></div><div class="bundle-price">{{ product.price | times: 2.4 | money }}<span class="badge">-20%</span></div></div>
</div>
<form action="/cart/add" method="post">
<input type="hidden" name="id" value="{{ product.selected_or_first_available_variant.id }}">
<button type="submit" class="add-cart">🛒 Ajouter au panier</button>
</form>
<button class="buy-now" onclick="window.location='/checkout'">⚡ Acheter maintenant</button>
<div class="badges">
<div class="badge-item">🚚 Livraison gratuite</div>
<div class="badge-item">🔄 Retour 30 jours</div>
<div class="badge-item">🔒 Paiement sécurisé</div>
<div class="badge-item">✅ Satisfait ou remboursé</div>
</div>
<div>{{ product.description }}</div>
</div></div>
</div></section>
<section class="reviews-section"><div class="container">
<h2>⭐ Avis clients</h2>
<div class="reviews-grid">
<div class="review"><div class="review-header"><div class="avatar">${c.testimonial1Name[0]}</div><div><div class="reviewer-name">${c.testimonial1Name}</div><div style="font-size:12px">⭐⭐⭐⭐⭐</div></div><div class="review-date">il y a 2 jours</div></div><p class="review-text">${c.testimonial1Text}</p></div>
<div class="review"><div class="review-header"><div class="avatar">${c.testimonial2Name[0]}</div><div><div class="reviewer-name">${c.testimonial2Name}</div><div style="font-size:12px">⭐⭐⭐⭐⭐</div></div><div class="review-date">il y a 5 jours</div></div><p class="review-text">${c.testimonial2Text}</p></div>
<div class="review"><div class="review-header"><div class="avatar">${c.testimonial3Name[0]}</div><div><div class="reviewer-name">${c.testimonial3Name}</div><div style="font-size:12px">⭐⭐⭐⭐⭐</div></div><div class="review-date">il y a 1 semaine</div></div><p class="review-text">${c.testimonial3Text}</p></div>
</div></div></section>
<script>
function selectBundle(el){document.querySelectorAll('.bundle').forEach(b=>{b.style.borderColor='#eee';b.style.background='white';b.querySelector('.bundle-radio').style.background='transparent';b.querySelector('.bundle-radio').style.borderColor='#ddd'});el.style.borderColor='${primaryColor}';el.style.background='${primaryColor}08';el.querySelector('.bundle-radio').style.background='${primaryColor}';el.querySelector('.bundle-radio').style.borderColor='${primaryColor}';el.querySelector('.bundle-radio').style.boxShadow='inset 0 0 0 3px white'}
</script>`

   const collectionLiquid = `<style>.collection-page{padding:60px 0}.collection-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:24px;margin-top:32px}.product-card{border-radius:12px;overflow:hidden;border:1px solid #eee;transition:all 0.2s}.product-card:hover{box-shadow:0 8px 30px rgba(0,0,0,0.1);transform:translateY(-2px)}.product-card-img{background:#f5f5f5;height:240px;display:flex;align-items:center;justify-content:center;overflow:hidden}.product-card-img img{max-width:100%;max-height:100%;object-fit:contain}.product-card-info{padding:16px}.product-card-title{font-size:15px;font-weight:600;margin-bottom:8px;color:#111}.product-card-price{font-size:18px;font-weight:800;color:${primaryColor};margin-bottom:12px}.product-card-btn{display:block;width:100%;background:${primaryColor};color:white;border:none;padding:10px;border-radius:8px;font-weight:600;text-align:center;text-decoration:none;cursor:pointer}@media(max-width:768px){.collection-grid{grid-template-columns:1fr 1fr}}</style>
<section class="collection-page"><div class="container">
<h1 style="font-size:32px;font-weight:800;margin-bottom:8px">{{ collection.title }}</h1>
<p style="color:#777;margin-bottom:32px">{{ collection.description }}</p>
<div class="collection-grid">
{% for product in collection.products %}
<div class="product-card">
<div class="product-card-img">{{ product.featured_image | img_tag: product.title }}</div>
<div class="product-card-info">
<div class="product-card-title">{{ product.title }}</div>
<div class="product-card-price">{{ product.price | money }}</div>
<a href="{{ product.url }}" class="product-card-btn">Voir le produit</a>
</div></div>
{% endfor %}
</div></div></section>`

const pageLiquid = `<section style="padding:60px 0"><div class="container">
<h1 style="font-size:32px;font-weight:800;margin-bottom:24px">{{ page.title }}</h1>
<div style="font-size:16px;line-height:1.7;color:#555">{{ page.content }}</div>
</div></section>`

const cartLiquid = `<section style="padding:60px 0"><div class="container">
<h1 style="font-size:32px;font-weight:800;margin-bottom:32px">🛒 Mon panier</h1>
{% if cart.item_count == 0 %}
<p style="color:#777;font-size:16px">Ton panier est vide. <a href="/collections/all" style="color:${primaryColor}">Continuer les achats</a></p>
{% else %}
{% for item in cart.items %}
<div style="display:flex;gap:16px;padding:16px 0;border-bottom:1px solid #eee">
<div style="width:80px;height:80px;background:#f5f5f5;border-radius:8px;overflow:hidden">{{ item.image | img_tag: item.title }}</div>
<div style="flex:1">
<div style="font-weight:600">{{ item.title }}</div>
<div style="color:#777;font-size:14px">Qté: {{ item.quantity }}</div>
<div style="font-weight:800;color:${primaryColor}">{{ item.line_price | money }}</div>
</div></div>
{% endfor %}
<div style="margin-top:24px;text-align:right">
<div style="font-size:20px;font-weight:800;margin-bottom:16px">Total: {{ cart.total_price | money }}</div>
<a href="/checkout" style="display:inline-block;background:${primaryColor};color:white;padding:16px 32px;border-radius:12px;font-size:18px;font-weight:700;text-decoration:none">⚡ Commander maintenant</a>
</div>
{% endif %}
</div></section>`

const notFoundLiquid = `<section style="padding:120px 0;text-align:center"><div class="container">
<h1 style="font-size:80px;font-weight:900;color:${primaryColor}">404</h1>
<p style="font-size:24px;margin-bottom:32px;color:#777">Page introuvable</p>
<a href="/" style="display:inline-block;background:${primaryColor};color:white;padding:14px 32px;border-radius:12px;font-weight:700;text-decoration:none">Retour à l'accueil</a>
</div></section>`

    function crc32(buf) {
      const table = new Uint32Array(256)
      for (let i = 0; i < 256; i++) {
        let c = i
        for (let j = 0; j < 8; j++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1
        table[i] = c
      }
      let crc = 0xFFFFFFFF
      for (let i = 0; i < buf.length; i++) crc = table[(crc ^ buf[i]) & 0xFF] ^ (crc >>> 8)
      return (crc ^ 0xFFFFFFFF) >>> 0
    }

    function writeUint16LE(val) {
      const buf = Buffer.alloc(2)
      buf.writeUInt16LE(val)
      return buf
    }

    function writeUint32LE(val) {
      const buf = Buffer.alloc(4)
      buf.writeUInt32LE(val >>> 0)
      return buf
    }

    const fileEntries = [
      { name: 'layout/theme.liquid', content: themeLiquid },
      { name: 'templates/index.liquid', content: indexLiquid },
      { name: 'templates/product.liquid', content: productLiquid },
      { name: 'templates/collection.liquid', content: collectionLiquid },
      { name: 'templates/page.liquid', content: pageLiquid },
      { name: 'templates/cart.liquid', content: cartLiquid },
      { name: 'templates/404.liquid', content: notFoundLiquid },
      { name: 'config/settings_schema.json', content: JSON.stringify([{"name":"theme_info","theme_name":brand,"theme_version":"1.0.0"}]) },
      { name: 'config/settings_data.json', content: JSON.stringify({"current":{}}) },
      { name: 'locales/fr.default.json', content: JSON.stringify({"general":{"language":"Français"}}) },
    ]

    const localHeaders = []
    let offset = 0
    const parts = []

    for (const entry of fileEntries) {
      const nameBuffer = Buffer.from(entry.name, 'utf8')
      const dataBuffer = Buffer.from(entry.content, 'utf8')
      const crc = crc32(dataBuffer)
      const now = new Date()
      const dosTime = (now.getHours() << 11) | (now.getMinutes() << 5) | (now.getSeconds() >> 1)
      const dosDate = ((now.getFullYear() - 1980) << 9) | ((now.getMonth() + 1) << 5) | now.getDate()
      const localHeader = Buffer.concat([
        Buffer.from([0x50, 0x4B, 0x03, 0x04]),
        writeUint16LE(20), writeUint16LE(0), writeUint16LE(0),
        writeUint16LE(dosTime), writeUint16LE(dosDate),
        writeUint32LE(crc), writeUint32LE(dataBuffer.length), writeUint32LE(dataBuffer.length),
        writeUint16LE(nameBuffer.length), writeUint16LE(0),
        nameBuffer,
      ])
      localHeaders.push({ nameBuffer, crc, size: dataBuffer.length, dosTime, dosDate, offset })
      offset += localHeader.length + dataBuffer.length
      parts.push(localHeader, dataBuffer)
    }

    const centralStart = offset
    for (const h of localHeaders) {
      const centralHeader = Buffer.concat([
        Buffer.from([0x50, 0x4B, 0x01, 0x02]),
        writeUint16LE(20), writeUint16LE(20), writeUint16LE(0), writeUint16LE(0),
        writeUint16LE(h.dosTime), writeUint16LE(h.dosDate),
        writeUint32LE(h.crc), writeUint32LE(h.size), writeUint32LE(h.size),
        writeUint16LE(h.nameBuffer.length), writeUint16LE(0), writeUint16LE(0),
        writeUint16LE(0), writeUint16LE(0), writeUint32LE(0), writeUint32LE(h.offset),
        h.nameBuffer,
      ])
      parts.push(centralHeader)
      offset += centralHeader.length
    }

    const centralSize = offset - centralStart
    const endRecord = Buffer.concat([
      Buffer.from([0x50, 0x4B, 0x05, 0x06]),
      writeUint16LE(0), writeUint16LE(0),
      writeUint16LE(fileEntries.length), writeUint16LE(fileEntries.length),
      writeUint32LE(centralSize), writeUint32LE(centralStart),
      writeUint16LE(0),
    ])
    parts.push(endRecord)

    const zipBuffer = Buffer.concat(parts)
    res.setHeader('Content-Type', 'application/zip')
    res.setHeader('Content-Disposition', `attachment; filename="shopify-theme-${brand.replace(/\s+/g, '-')}.zip"`)
    res.send(zipBuffer)

  } catch (e) {
    return res.status(500).json({ error: 'Erreur: ' + e.message })
  }
}
