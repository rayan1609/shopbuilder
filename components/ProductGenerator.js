import { useState } from 'react'

export default function ProductPage({ product, onClose }) {
  const [selectedBundle, setSelectedBundle] = useState(1)
  const [addedToCart, setAddedToCart] = useState(false)

  if (!product) return null

  const basePrice = parseFloat(product.price?.replace('€', '').replace(',', '.')) || 29.99

  const getBullets = () => {
    if (!product.bullets) return []
    if (Array.isArray(product.bullets)) return product.bullets
    return product.bullets.split('\n').filter(b => b.trim())
  }

  const bundles = [
    { qty: 1, label: '1 unité', price: basePrice, badge: null },
    { qty: 2, label: '2 unités', price: basePrice * 2 * 0.9, badge: '-10%', savings: (basePrice * 2 * 0.1).toFixed(2) },
    { qty: 3, label: '3 unités', price: basePrice * 3 * 0.8, badge: '-20%', savings: (basePrice * 3 * 0.2).toFixed(2) },
  ]

  const reviews = [
    { name: 'Marie L.', stars: 5, text: 'Produit incroyable, je recommande vivement ! Livraison rapide et qualité au rendez-vous.', date: 'il y a 2 jours' },
    { name: 'Thomas B.', stars: 5, text: 'Exactement ce que je cherchais. Très satisfait de mon achat, je reviendrai !', date: 'il y a 5 jours' },
    { name: 'Sophie M.', stars: 4, text: 'Bon produit, conforme à la description. Livraison un peu longue mais ça valait l\'attente.', date: 'il y a 1 semaine' },
    { name: 'Lucas R.', stars: 5, text: 'Parfait ! Je l\'ai offert en cadeau et la personne était ravie. Super rapport qualité/prix.', date: 'il y a 2 semaines' },
  ]

  const faqs = [
    { q: 'Quel est le délai de livraison ?', a: 'Livraison sous 7 à 14 jours ouvrés. Vous recevrez un email de suivi dès l\'expédition.' },
    { q: 'Puis-je retourner le produit ?', a: 'Oui, vous avez 30 jours pour retourner votre commande. Remboursement complet garanti.' },
    { q: 'Le paiement est-il sécurisé ?', a: 'Absolument. Toutes les transactions sont cryptées SSL et sécurisées par Shopify Payments.' },
    { q: 'Est-ce que vous livrez à l\'international ?', a: 'Oui, nous livrons dans toute l\'Europe et dans de nombreux pays du monde.' },
  ]

  const selectedBundleData = bundles[selectedBundle - 1]

  return (
    <div className="product-page-overlay">
      <div className="product-page">
        <div className="pp-header">
          <button className="pp-close" onClick={onClose}>✕ Fermer</button>
          <span className="pp-preview-badge">👁 Prévisualisation page produit</span>
        </div>

        <div className="urgency-bar">
          🔥 <strong>23 personnes</strong> regardent ce produit · Stock limité : <strong>14 restants</strong>
        </div>

        <div className="pp-main">
          <div className="pp-image-section">
            <div className="pp-image-placeholder">
              <span>🖼</span>
              <p>Image produit</p>
            </div>
            <div className="pp-thumbnails">
              {[1,2,3,4].map(i => <div key={i} className="pp-thumb" />)}
            </div>
          </div>

          <div className="pp-info">
            <div className="pp-reviews-summary">
              ⭐⭐⭐⭐⭐ <span>4.8/5</span> <span className="pp-review-count">(127 avis)</span>
            </div>
            <h1 className="pp-title">{product.title}</h1>
            <p className="pp-subtitle">{product.description?.substring(0, 150)}...</p>

            <div className="pp-bundles">
              <p className="pp-section-label">CHOISISSEZ VOTRE OFFRE</p>
              {bundles.map((b, i) => (
                <div key={i} className={`pp-bundle ${selectedBundle === b.qty ? 'selected' : ''}`} onClick={() => setSelectedBundle(b.qty)}>
                  <div className="pp-bundle-radio">
                    <div className={`pp-radio ${selectedBundle === b.qty ? 'checked' : ''}`} />
                  </div>
                  <div className="pp-bundle-info">
                    <span className="pp-bundle-label">{b.label}</span>
                    {b.savings && <span className="pp-bundle-savings">Économisez {b.savings}€</span>}
                  </div>
                  <div className="pp-bundle-price">
                    <span className="pp-bundle-total">{b.price.toFixed(2)}€</span>
                    {b.badge && <span className="pp-bundle-badge">{b.badge}</span>}
                  </div>
                </div>
              ))}
            </div>

            <button className="pp-cta" onClick={() => setAddedToCart(true)}>
              {addedToCart ? '✅ Ajouté au panier !' : `🛒 Ajouter au panier — ${selectedBundleData.price.toFixed(2)}€`}
            </button>
            <button className="pp-buy-now">⚡ Acheter maintenant</button>

            <div className="pp-guarantees">
              <div className="pp-guarantee">🚚 Livraison gratuite</div>
              <div className="pp-guarantee">🔄 Retour 30 jours</div>
              <div className="pp-guarantee">🔒 Paiement sécurisé</div>
              <div className="pp-guarantee">✅ Satisfait ou remboursé</div>
            </div>
          </div>
        </div>

        <div className="pp-section">
          <h2 className="pp-section-title">Pourquoi choisir ce produit ?</h2>
          <div className="pp-benefits">
            {getBullets().map((bullet, i) => (
              <div key={i} className="pp-benefit">
                <span className="pp-benefit-icon">✓</span>
                <span>{bullet.replace('✓', '').trim()}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="pp-section">
          <h2 className="pp-section-title">⭐ Avis clients (127)</h2>
          <div className="pp-reviews">
            {reviews.map((r, i) => (
              <div key={i} className="pp-review">
                <div className="pp-review-header">
                  <div className="pp-reviewer-avatar">{r.name[0]}</div>
                  <div>
                    <div className="pp-reviewer-name">{r.name}</div>
                    <div className="pp-reviewer-stars">{'⭐'.repeat(r.stars)}</div>
                  </div>
                  <span className="pp-review-date">{r.date}</span>
                </div>
                <p className="pp-review-text">{r.text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="pp-section">
          <h2 className="pp-section-title">❓ Questions fréquentes</h2>
          <div className="pp-faqs">
            {faqs.map((faq, i) => <FAQItem key={i} q={faq.q} a={faq.a} />)}
          </div>
        </div>
      </div>

      <style jsx>{`
        .product-page-overlay { position: fixed; inset: 0; background: #000000cc; z-index: 1000; overflow-y: auto; padding: 20px; }
        .product-page { background: #fff; color: #111; max-width: 1000px; margin: 0 auto; border-radius: 16px; overflow: hidden; padding-bottom: 40px; }
        .pp-header { background: #f8f8f8; padding: 12px 20px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #eee; }
        .pp-close { background: #111; color: #fff; border: none; padding: 8px 16px; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 13px; }
        .pp-preview-badge { font-size: 12px; color: #888; background: #eee; padding: 4px 10px; border-radius: 20px; }
        .urgency-bar { background: #fff3cd; color: #856404; padding: 10px 20px; font-size: 14px; text-align: center; border-bottom: 1px solid #ffc107; }
        .pp-main { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; padding: 32px; }
        .pp-image-placeholder { background: #f5f5f5; border-radius: 12px; height: 320px; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #aaa; font-size: 40px; margin-bottom: 12px; }
        .pp-image-placeholder p { font-size: 14px; margin-top: 8px; }
        .pp-thumbnails { display: flex; gap: 8px; }
        .pp-thumb { width: 60px; height: 60px; background: #f0f0f0; border-radius: 8px; border: 2px solid #eee; }
        .pp-reviews-summary { font-size: 14px; margin-bottom: 10px; color: #555; }
        .pp-review-count { color: #888; font-size: 13px; }
        .pp-title { font-size: 24px; font-weight: 800; line-height: 1.3; margin-bottom: 10px; color: #111; }
        .pp-subtitle { font-size: 14px; color: #666; line-height: 1.6; margin-bottom: 20px; }
        .pp-section-label { font-size: 11px; font-weight: 700; color: #888; letter-spacing: 1px; margin-bottom: 10px; }
        .pp-bundles { margin-bottom: 20px; }
        .pp-bundle { display: flex; align-items: center; gap: 12px; padding: 12px 16px; border: 2px solid #eee; border-radius: 10px; margin-bottom: 8px; cursor: pointer; transition: all 0.2s; }
        .pp-bundle.selected { border-color: #7c5cfc; background: #7c5cfc08; }
        .pp-radio { width: 18px; height: 18px; border-radius: 50%; border: 2px solid #ddd; transition: all 0.2s; }
        .pp-radio.checked { border-color: #7c5cfc; background: #7c5cfc; box-shadow: inset 0 0 0 3px #fff; }
        .pp-bundle-info { flex: 1; }
        .pp-bundle-label { font-weight: 600; font-size: 14px; display: block; }
        .pp-bundle-savings { font-size: 12px; color: #2ecc71; }
        .pp-bundle-price { text-align: right; }
        .pp-bundle-total { font-weight: 800; font-size: 16px; display: block; }
        .pp-bundle-badge { background: #ff4757; color: white; font-size: 11px; font-weight: 700; padding: 2px 6px; border-radius: 4px; }
        .pp-cta { width: 100%; background: linear-gradient(135deg, #7c5cfc, #9b7aff); color: white; border: none; padding: 16px; border-radius: 12px; font-size: 16px; font-weight: 700; cursor: pointer; margin-bottom: 10px; transition: all 0.2s; }
        .pp-cta:hover { transform: translateY(-1px); box-shadow: 0 8px 24px #7c5cfc40; }
        .pp-buy-now { width: 100%; background: #111; color: white; border: none; padding: 14px; border-radius: 12px; font-size: 15px; font-weight: 700; cursor: pointer; margin-bottom: 16px; }
        .pp-guarantees { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
        .pp-guarantee { background: #f8f8f8; padding: 8px 12px; border-radius: 8px; font-size: 13px; font-weight: 500; text-align: center; color: #444; }
        .pp-section { padding: 32px; border-top: 1px solid #eee; }
        .pp-section-title { font-size: 20px; font-weight: 800; margin-bottom: 20px; color: #111; }
        .pp-benefits { display: flex; flex-direction: column; gap: 12px; }
        .pp-benefit { display: flex; align-items: flex-start; gap: 12px; font-size: 15px; color: #333; }
        .pp-benefit-icon { color: #2ecc71; font-weight: 800; font-size: 18px; flex-shrink: 0; }
        .pp-reviews { display: flex; flex-direction: column; gap: 16px; }
        .pp-review { background: #f8f8f8; border-radius: 10px; padding: 16px; }
        .pp-review-header { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
        .pp-reviewer-avatar { width: 36px; height: 36px; background: #7c5cfc; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; flex-shrink: 0; }
        .pp-reviewer-name { font-weight: 600; font-size: 14px; }
        .pp-reviewer-stars { font-size: 12px; }
        .pp-review-date { margin-left: auto; font-size: 12px; color: #888; }
        .pp-review-text { font-size: 14px; color: #555; line-height: 1.6; }
        .pp-faqs { display: flex; flex-direction: column; gap: 8px; }
        @media (max-width: 768px) {
          .product-page-overlay { padding: 0; }
          .product-page { border-radius: 0; min-height: 100vh; }
          .pp-main { grid-template-columns: 1fr; padding: 16px; gap: 20px; }
          .pp-section { padding: 20px 16px; }
        }
      `}</style>
    </div>
  )
}

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ border: '1px solid #eee', borderRadius: 10, overflow: 'hidden', marginBottom: 8 }}>
      <button onClick={() => setOpen(!open)} style={{ width: '100%', padding: '14px 16px', background: open ? '#f8f8f8' : '#fff', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 600, fontSize: 14, color: '#111', textAlign: 'left' }}>
        {q}
        <span style={{ fontSize: 18, color: '#888' }}>{open ? '−' : '+'}</span>
      </button>
      {open && (
        <div style={{ padding: '12px 16px', fontSize: 14, color: '#555', lineHeight: 1.6, borderTop: '1px solid #eee', background: '#fafafa' }}>
          {a}
        </div>
      )}
    </div>
  )
}
