import JSZip from 'jszip'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { product, brandName, primaryColor = '#7c5cfc', secondaryColor = '#fc5c7d' } = req.body

  try {
    // Generate theme content with AI
    const prompt = `Tu es un expert en thèmes Shopify et conversion e-commerce.

Génère le contenu marketing pour un thème Shopify complet pour ce produit:
- Produit: ${product.title}
- Description: ${product.description}
- Prix: ${product.price}
- Points clés: ${Array.isArray(product.bullets) ? product.bullets.join(', ') : product.bullets}

Réponds UNIQUEMENT en JSON:
{
  "heroTitle": "Titre accrocheur pour la homepage",
  "heroSubtitle": "Sous-titre persuasif",
  "heroCTA": "Texte du bouton CTA",
  "feature1Title": "Titre avantage 1",
  "feature1Text": "Description avantage 1",
  "feature1Icon": "emoji",
  "feature2Title": "Titre avantage 2", 
  "feature2Text": "Description avantage 2",
  "feature2Icon": "emoji",
  "feature3Title": "Titre avantage 3",
  "feature3Text": "Description avantage 3",
  "feature3Icon": "emoji",
  "feature4Title": "Titre avantage 4",
  "feature4Text": "Description avantage 4",
  "feature4Icon": "emoji",
  "testimonial1Name": "Nom client 1",
  "testimonial1Text": "Avis client 1 (2-3 phrases)",
  "testimonial2Name": "Nom client 2",
  "testimonial2Text": "Avis client 2 (2-3 phrases)",
  "testimonial3Name": "Nom client 3",
  "testimonial3Text": "Avis client 3 (2-3 phrases)",
  "faq1Q": "Question FAQ 1",
  "faq1A": "Réponse FAQ 1",
  "faq2Q": "Question FAQ 2",
  "faq2A": "Réponse FAQ 2",
  "faq3Q": "Question FAQ 3",
  "faq3A": "Réponse FAQ 3",
  "urgencyText": "Texte d'urgence (ex: Plus que 12 en stock)",
  "guaranteeText": "Texte de garantie",
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
    const content = JSON.parse(aiData.choices[0].message.content)
    const price = parseFloat(String(product.price || '29.99').replace(/[^0-9.]/g, '')) || 29.99
    const brand = brandName || 'Ma Boutique'

    // Generate theme files
    const zip = new JSZip()

    // layout/theme.liquid
    zip.file('layout/theme.liquid', `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{ page_title }} - {{ shop.name }}</title>
  {{ content_for_header }}
  <style>
    :root {
      --primary: ${primaryColor};
      --secondary: ${secondaryColor};
      --dark: #111;
      --light: #f8f8f8;
      --text: #333;
      --muted: #777;
      --radius: 12px;
    }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: var(--text); }
    .container { max-width: 1100px; margin: 0 auto; padding: 0 20px; }
    
    /* Header */
    .site-header { background: white; border-bottom: 1px solid #eee; padding: 16px 0; position: sticky; top: 0; z-index: 100; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
    .header-inner { display: flex; align-items: center; justify-content: space-between; }
    .logo { font-size: 22px; font-weight: 800; color: var(--primary); text-decoration: none; }
    .nav-links { display: flex; gap: 24px; list-style: none; }
    .nav-links a { text-decoration: none; color: var(--text); font-weight: 500; font-size: 15px; }
    .cart-btn { background: var(--primary); color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 14px; }
    
    /* Footer */
    .site-footer { background: var(--dark); color: white; padding: 48px 0 24px; margin-top: 80px; }
    .footer-inner { display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 40px; margin-bottom: 40px; }
    .footer-brand h3 { font-size: 20px; font-weight: 800; color: var(--primary); margin-bottom: 12px; }
    .footer-brand p { color: #aaa; font-size: 14px; line-height: 1.6; }
    .footer-links h4 { font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 16px; color: #aaa; }
    .footer-links ul { list-style: none; }
    .footer-links li { margin-bottom: 8px; }
    .footer-links a { color: #ccc; text-decoration: none; font-size: 14px; }
    .footer-bottom { border-top: 1px solid #333; padding-top: 24px; text-align: center; color: #666; font-size: 13px; }
    
    @media (max-width: 768px) {
      .nav-links { display: none; }
      .footer-inner { grid-template-columns: 1fr; }
    }
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
      <div class="footer-inner">
        <div class="footer-brand">
          <h3>${brand}</h3>
          <p>${content.footerTagline}</p>
        </div>
        <div class="footer-links">
          <h4>Navigation</h4>
          <ul>
            <li><a href="/">Accueil</a></li>
            <li><a href="/collections/all">Nos produits</a></li>
            <li><a href="/pages/contact">Contact</a></li>
          </ul>
        </div>
        <div class="footer-links">
          <h4>Informations</h4>
          <ul>
            <li><a href="/pages/livraison">Livraison</a></li>
            <li><a href="/pages/retours">Retours</a></li>
            <li><a href="/policies/privacy-policy">Confidentialité</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <p>© ${new Date().getFullYear()} ${brand}. Tous droits réservés.</p>
      </div>
    </div>
  </footer>
</body>
</html>`)

    // templates/index.liquid (Homepage)
    zip.file('templates/index.liquid', `<style>
  .hero { background: linear-gradient(135deg, ${primaryColor}15, ${secondaryColor}10); padding: 80px 0; text-align: center; }
  .hero h1 { font-size: 52px; font-weight: 900; line-height: 1.1; margin-bottom: 20px; color: var(--dark); }
  .hero h1 span { color: var(--primary); }
  .hero p { font-size: 20px; color: var(--muted); max-width: 600px; margin: 0 auto 32px; line-height: 1.6; }
  .hero-cta { display: inline-block; background: var(--primary); color: white; padding: 18px 40px; border-radius: var(--radius); font-size: 18px; font-weight: 700; text-decoration: none; transition: transform 0.2s; }
  .hero-cta:hover { transform: translateY(-2px); box-shadow: 0 8px 30px ${primaryColor}40; }
  .hero-badges { display: flex; justify-content: center; gap: 24px; margin-top: 32px; flex-wrap: wrap; }
  .hero-badge { display: flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 600; color: var(--muted); }
  
  .urgency-bar { background: var(--dark); color: white; text-align: center; padding: 12px; font-size: 14px; font-weight: 600; }
  .urgency-bar span { color: ${secondaryColor}; }
  
  .features { padding: 80px 0; background: white; }
  .features h2 { text-align: center; font-size: 36px; font-weight: 800; margin-bottom: 48px; }
  .features-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }
  .feature-card { text-align: center; padding: 32px 20px; border-radius: var(--radius); border: 1px solid #eee; transition: all 0.2s; }
  .feature-card:hover { border-color: var(--primary); box-shadow: 0 8px 30px ${primaryColor}15; }
  .feature-icon { font-size: 40px; margin-bottom: 16px; }
  .feature-card h3 { font-size: 18px; font-weight: 700; margin-bottom: 10px; }
  .feature-card p { font-size: 14px; color: var(--muted); line-height: 1.6; }
  
  .product-spotlight { padding: 80px 0; background: var(--light); }
  .product-spotlight h2 { text-align: center; font-size: 36px; font-weight: 800; margin-bottom: 48px; }
  .product-card { background: white; border-radius: var(--radius); overflow: hidden; max-width: 500px; margin: 0 auto; box-shadow: 0 10px 40px rgba(0,0,0,0.1); }
  .product-img { background: #f0f0f0; height: 300px; display: flex; align-items: center; justify-content: center; font-size: 60px; }
  .product-info { padding: 32px; }
  .product-price { font-size: 32px; font-weight: 900; color: var(--primary); margin-bottom: 16px; }
  .product-desc { font-size: 15px; color: var(--muted); line-height: 1.6; margin-bottom: 24px; }
  .buy-btn { display: block; width: 100%; background: var(--primary); color: white; padding: 16px; border-radius: var(--radius); font-size: 18px; font-weight: 700; text-align: center; text-decoration: none; border: none; cursor: pointer; }
  
  .testimonials { padding: 80px 0; background: white; }
  .testimonials h2 { text-align: center; font-size: 36px; font-weight: 800; margin-bottom: 48px; }
  .testimonials-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
  .testimonial { background: var(--light); border-radius: var(--radius); padding: 28px; }
  .testimonial-stars { font-size: 18px; margin-bottom: 12px; }
  .testimonial-text { font-size: 15px; color: var(--text); line-height: 1.7; margin-bottom: 16px; font-style: italic; }
  .testimonial-name { font-weight: 700; font-size: 14px; color: var(--muted); }
  
  .faq { padding: 80px 0; background: var(--light); }
  .faq h2 { text-align: center; font-size: 36px; font-weight: 800; margin-bottom: 48px; }
  .faq-item { background: white; border-radius: var(--radius); margin-bottom: 12px; overflow: hidden; }
  .faq-q { padding: 20px 24px; font-weight: 600; font-size: 16px; cursor: pointer; display: flex; justify-content: space-between; }
  .faq-a { padding: 0 24px 20px; font-size: 15px; color: var(--muted); line-height: 1.6; }
  
  .guarantee { background: linear-gradient(135deg, ${primaryColor}, ${secondaryColor}); color: white; padding: 60px 0; text-align: center; }
  .guarantee h2 { font-size: 36px; font-weight: 800; margin-bottom: 16px; }
  .guarantee p { font-size: 18px; opacity: 0.9; max-width: 600px; margin: 0 auto 32px; }
  .guarantee-badges { display: flex; justify-content: center; gap: 32px; flex-wrap: wrap; }
  .guarantee-badge { text-align: center; }
  .guarantee-badge .icon { font-size: 32px; margin-bottom: 8px; }
  .guarantee-badge span { font-size: 13px; font-weight: 600; opacity: 0.9; }
  
  @media (max-width: 768px) {
    .hero h1 { font-size: 32px; }
    .features-grid { grid-template-columns: 1fr 1fr; }
    .testimonials-grid { grid-template-columns: 1fr; }
  }
</style>

<div class="urgency-bar">
  🔥 <span>${content.urgencyText}</span> · Livraison offerte aujourd'hui
</div>

<section class="hero">
  <div class="container">
    <h1>${content.heroTitle}</h1>
    <p>${content.heroSubtitle}</p>
    <a href="/collections/all" class="hero-cta">${content.heroCTA} →</a>
    <div class="hero-badges">
      <div class="hero-badge">✅ Livraison gratuite</div>
      <div class="hero-badge">🔄 Retour 30 jours</div>
      <div class="hero-badge">🔒 Paiement sécurisé</div>
      <div class="hero-badge">⭐ 4.8/5 (500+ avis)</div>
    </div>
  </div>
</section>

<section class="features">
  <div class="container">
    <h2>Pourquoi nous choisir ?</h2>
    <div class="features-grid">
      <div class="feature-card">
        <div class="feature-icon">${content.feature1Icon}</div>
        <h3>${content.feature1Title}</h3>
        <p>${content.feature1Text}</p>
      </div>
      <div class="feature-card">
        <div class="feature-icon">${content.feature2Icon}</div>
        <h3>${content.feature2Title}</h3>
        <p>${content.feature2Text}</p>
      </div>
      <div class="feature-card">
        <div class="feature-icon">${content.feature3Icon}</div>
        <h3>${content.feature3Title}</h3>
        <p>${content.feature3Text}</p>
      </div>
      <div class="feature-card">
        <div class="feature-icon">${content.feature4Icon}</div>
        <h3>${content.feature4Title}</h3>
        <p>${content.feature4Text}</p>
      </div>
    </div>
  </div>
</section>

<section class="product-spotlight">
  <div class="container">
    <h2>Notre produit phare</h2>
    <div class="product-card">
      <div class="product-img">🛍️</div>
      <div class="product-info">
        <div class="product-price">${product.price}</div>
        <p class="product-desc">${String(product.description || '').substring(0, 200)}...</p>
        <a href="/collections/all" class="buy-btn">🛒 Commander maintenant</a>
      </div>
    </div>
  </div>
</section>

<section class="testimonials">
  <div class="container">
    <h2>⭐ Ce que disent nos clients</h2>
    <div class="testimonials-grid">
      <div class="testimonial">
        <div class="testimonial-stars">⭐⭐⭐⭐⭐</div>
        <p class="testimonial-text">"${content.testimonial1Text}"</p>
        <div class="testimonial-name">— ${content.testimonial1Name}</div>
      </div>
      <div class="testimonial">
        <div class="testimonial-stars">⭐⭐⭐⭐⭐</div>
        <p class="testimonial-text">"${content.testimonial2Text}"</p>
        <div class="testimonial-name">— ${content.testimonial2Name}</div>
      </div>
      <div class="testimonial">
        <div class="testimonial-stars">⭐⭐⭐⭐⭐</div>
        <p class="testimonial-text">"${content.testimonial3Text}"</p>
        <div class="testimonial-name">— ${content.testimonial3Name}</div>
      </div>
    </div>
  </div>
</section>

<section class="faq">
  <div class="container">
    <h2>❓ Questions fréquentes</h2>
    <div class="faq-item">
      <div class="faq-q">${content.faq1Q} <span>+</span></div>
      <div class="faq-a">${content.faq1A}</div>
    </div>
    <div class="faq-item">
      <div class="faq-q">${content.faq2Q} <span>+</span></div>
      <div class="faq-a">${content.faq2A}</div>
    </div>
    <div class="faq-item">
      <div class="faq-q">${content.faq3Q} <span>+</span></div>
      <div class="faq-a">${content.faq3A}</div>
    </div>
  </div>
</section>

<section class="guarantee">
  <div class="container">
    <h2>Notre garantie</h2>
    <p>${content.guaranteeText}</p>
    <div class="guarantee-badges">
      <div class="guarantee-badge"><div class="icon">🚚</div><span>Livraison gratuite</span></div>
      <div class="guarantee-badge"><div class="icon">🔄</div><span>Retour 30 jours</span></div>
      <div class="guarantee-badge"><div class="icon">🔒</div><span>Paiement sécurisé</span></div>
      <div class="guarantee-badge"><div class="icon">⭐</div><span>Satisfait ou remboursé</span></div>
    </div>
  </div>
</section>`)

    // templates/product.liquid
    zip.file('templates/product.liquid', `<style>
  .product-page { padding: 60px 0; }
  .product-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: start; }
  .product-images { position: sticky; top: 100px; }
  .main-image { background: #f5f5f5; border-radius: var(--radius); height: 450px; display: flex; align-items: center; justify-content: center; font-size: 80px; margin-bottom: 12px; }
  .product-info h1 { font-size: 32px; font-weight: 800; margin-bottom: 12px; line-height: 1.2; }
  .rating { display: flex; align-items: center; gap: 8px; margin-bottom: 20px; font-size: 15px; color: var(--muted); }
  .price-section { margin-bottom: 24px; }
  .current-price { font-size: 40px; font-weight: 900; color: var(--primary); }
  .urgency { background: #fff3cd; border: 1px solid #ffc107; border-radius: 8px; padding: 12px 16px; font-size: 14px; font-weight: 600; color: #856404; margin-bottom: 24px; }
  
  .bundles { margin-bottom: 24px; }
  .bundles h3 { font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: var(--muted); margin-bottom: 12px; }
  .bundle { display: flex; align-items: center; gap: 12px; padding: 14px 16px; border: 2px solid #eee; border-radius: 10px; margin-bottom: 8px; cursor: pointer; transition: all 0.2s; }
  .bundle:first-of-type, .bundle.active { border-color: var(--primary); background: ${primaryColor}08; }
  .bundle-radio { width: 20px; height: 20px; border-radius: 50%; border: 2px solid #ddd; flex-shrink: 0; }
  .bundle.active .bundle-radio, .bundle:first-of-type .bundle-radio { border-color: var(--primary); background: var(--primary); box-shadow: inset 0 0 0 3px white; }
  .bundle-info { flex: 1; }
  .bundle-label { font-weight: 600; font-size: 14px; }
  .bundle-save { font-size: 12px; color: #2ecc71; font-weight: 600; }
  .bundle-price { font-weight: 800; font-size: 16px; }
  .bundle-badge { background: #ff4757; color: white; font-size: 11px; font-weight: 700; padding: 2px 7px; border-radius: 4px; margin-left: 6px; }
  
  .add-to-cart { width: 100%; background: var(--primary); color: white; border: none; padding: 18px; border-radius: var(--radius); font-size: 18px; font-weight: 700; cursor: pointer; margin-bottom: 12px; transition: all 0.2s; }
  .add-to-cart:hover { transform: translateY(-2px); box-shadow: 0 8px 30px ${primaryColor}40; }
  .buy-now { width: 100%; background: var(--dark); color: white; border: none; padding: 16px; border-radius: var(--radius); font-size: 16px; font-weight: 700; cursor: pointer; margin-bottom: 20px; }
  
  .trust-badges { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 28px; }
  .trust-badge { background: var(--light); padding: 10px 14px; border-radius: 8px; font-size: 13px; font-weight: 600; text-align: center; color: var(--text); }
  
  .product-description { border-top: 1px solid #eee; padding-top: 28px; }
  .product-description h3 { font-size: 18px; font-weight: 700; margin-bottom: 16px; }
  .product-description p { font-size: 15px; color: var(--muted); line-height: 1.7; margin-bottom: 16px; }
  .bullets { list-style: none; }
  .bullets li { display: flex; align-items: flex-start; gap: 10px; font-size: 15px; margin-bottom: 10px; color: var(--text); }
  .bullets li::before { content: "✓"; color: #2ecc71; font-weight: 800; font-size: 18px; flex-shrink: 0; }
  
  .reviews-section { padding: 60px 0; background: var(--light); }
  .reviews-section h2 { font-size: 28px; font-weight: 800; margin-bottom: 32px; }
  .reviews-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .review { background: white; border-radius: var(--radius); padding: 20px; }
  .review-header { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
  .review-avatar { width: 40px; height: 40px; background: var(--primary); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; flex-shrink: 0; }
  .review-name { font-weight: 600; font-size: 14px; }
  .review-stars { font-size: 12px; }
  .review-date { margin-left: auto; font-size: 12px; color: var(--muted); }
  .review-text { font-size: 14px; color: var(--muted); line-height: 1.6; }
  
  @media (max-width: 768px) {
    .product-grid { grid-template-columns: 1fr; gap: 32px; }
    .reviews-grid { grid-template-columns: 1fr; }
    .product-images { position: static; }
  }
</style>

<section class="product-page">
  <div class="container">
    <div class="product-grid">
      <div class="product-images">
        <div class="main-image">{{ product.featured_image | img_tag: product.title }}</div>
      </div>
      
      <div class="product-info">
        <div class="rating">⭐⭐⭐⭐⭐ <span>4.8/5</span> <span>(127 avis vérifiés)</span></div>
        <h1>{{ product.title }}</h1>
        
        <div class="price-section">
          <div class="current-price">{{ product.price | money }}</div>
        </div>
        
        <div class="urgency">🔥 ${content.urgencyText}</div>
        
        <div class="bundles">
          <h3>Choisissez votre offre</h3>
          <div class="bundle active">
            <div class="bundle-radio"></div>
            <div class="bundle-info">
              <div class="bundle-label">1 unité</div>
            </div>
            <div class="bundle-price">{{ product.price | money }}</div>
          </div>
          <div class="bundle">
            <div class="bundle-radio"></div>
            <div class="bundle-info">
              <div class="bundle-label">2 unités</div>
              <div class="bundle-save">Économisez 10%</div>
            </div>
            <div class="bundle-price">{{ product.price | times: 2 | times: 0.9 | money }}<span class="bundle-badge">-10%</span></div>
          </div>
          <div class="bundle">
            <div class="bundle-radio"></div>
            <div class="bundle-info">
              <div class="bundle-label">3 unités</div>
              <div class="bundle-save">Économisez 20%</div>
            </div>
            <div class="bundle-price">{{ product.price | times: 3 | times: 0.8 | money }}<span class="bundle-badge">-20%</span></div>
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
        
        <div class="product-description">
          <h3>Description</h3>
          {{ product.description }}
        </div>
      </div>
    </div>
  </div>
</section>

<section class="reviews-section">
  <div class="container">
    <h2>⭐ Avis clients</h2>
    <div class="reviews-grid">
      <div class="review">
        <div class="review-header">
          <div class="review-avatar">${content.testimonial1Name[0]}</div>
          <div><div class="review-name">${content.testimonial1Name}</div><div class="review-stars">⭐⭐⭐⭐⭐</div></div>
          <div class="review-date">il y a 2 jours</div>
        </div>
        <p class="review-text">${content.testimonial1Text}</p>
      </div>
      <div class="review">
        <div class="review-header">
          <div class="review-avatar">${content.testimonial2Name[0]}</div>
          <div><div class="review-name">${content.testimonial2Name}</div><div class="review-stars">⭐⭐⭐⭐⭐</div></div>
          <div class="review-date">il y a 5 jours</div>
        </div>
        <p class="review-text">${content.testimonial2Text}</p>
      </div>
      <div class="review">
        <div class="review-header">
          <div class="review-avatar">${content.testimonial3Name[0]}</div>
          <div><div class="review-name">${content.testimonial3Name}</div><div class="review-stars">⭐⭐⭐⭐⭐</div></div>
          <div class="review-date">il y a 1 semaine</div>
        </div>
        <p class="review-text">${content.testimonial3Text}</p>
      </div>
    </div>
  </div>
</section>

<script>
document.querySelectorAll('.bundle').forEach(b => {
  b.addEventListener('click', function() {
    document.querySelectorAll('.bundle').forEach(x => x.classList.remove('active'))
    this.classList.add('active')
  })
})
</script>`)

    // config/settings_schema.json
    zip.file('config/settings_schema.json', JSON.stringify([
      { name: "theme_info", theme_name: brand, theme_version: "1.0.0" }
    ], null, 2))

    // config/settings_data.json
    zip.file('config/settings_data.json', JSON.stringify({ current: {} }, null, 2))

    // Generate zip
    const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' })
    
    res.setHeader('Content-Type', 'application/zip')
    res.setHeader('Content-Disposition', `attachment; filename="shopify-theme-${Date.now()}.zip"`)
    res.send(zipBuffer)

  } catch (e) {
    return res.status(500).json({ error: 'Erreur génération thème: ' + e.message })
  }
}
