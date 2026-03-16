import { useState, useEffect } from 'react'

export default function MultiShop() {
  const [shops, setShops] = useState([])
  const [form, setForm] = useState({ name: '', shop: '', token: '' })
  const [adding, setAdding] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    try {
      const saved = localStorage.getItem('shopbuilder_shops')
      if (saved) setShops(JSON.parse(saved))
      else {
        const defaultShop = [{ id: 1, name: 'Mon shop principal', shop: 'rcr7bc-ac.myshopify.com', token: '***', active: true }]
        setShops(defaultShop)
      }
    } catch (e) {}
  }, [])

  const save = (newShops) => {
    setShops(newShops)
    localStorage.setItem('shopbuilder_shops', JSON.stringify(newShops))
  }

  const addShop = () => {
    if (!form.name || !form.shop || !form.token) return
    const newShop = { id: Date.now(), name: form.name, shop: form.shop, token: form.token, active: false }
    save([...shops, newShop])
    setForm({ name: '', shop: '', token: '' })
    setAdding(false)
  }

  const setActive = (id) => {
    save(shops.map(s => ({ ...s, active: s.id === id })))
  }

  const removeShop = (id) => {
    save(shops.filter(s => s.id !== id))
  }

  if (!mounted) return null

  return (
    <div>
      <div className="card">
        <p className="card-title">🏪 Gestion multi-shops</p>
        <p style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 20 }}>
          Connecte plusieurs boutiques Shopify et switche entre elles en 1 clic.
        </p>

        {shops.map(shop => (
          <div key={shop.id} className={`shop-card ${shop.active ? 'active' : ''}`}>
            <div className="shop-info">
              <div className="shop-dot" style={{ background: shop.active ? '#2ecc71' : 'var(--muted)' }} />
              <div>
                <div className="shop-name">{shop.name}</div>
                <div className="shop-url">{shop.shop}</div>
              </div>
            </div>
            <div className="shop-actions">
              {shop.active ? (
                <span className="active-badge">✅ Actif</span>
              ) : (
                <button className="btn btn-secondary" onClick={() => setActive(shop.id)} style={{ padding: '6px 14px', fontSize: 13 }}>
                  Activer
                </button>
              )}
              <button onClick={() => removeShop(shop.id)} style={{ background: 'none', border: 'none', color: '#e74c3c', cursor: 'pointer', fontSize: 18, padding: '0 4px' }}>🗑</button>
            </div>
          </div>
        ))}

        {adding ? (
          <div className="add-form">
            <div className="grid-2">
              <div className="input-group">
                <label className="input-label">Nom du shop</label>
                <input className="input" placeholder="ex: Shop Bijoux" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div className="input-group">
                <label className="input-label">URL Shopify</label>
                <input className="input" placeholder="monshop.myshopify.com" value={form.shop} onChange={e => setForm(f => ({ ...f, shop: e.target.value }))} />
              </div>
            </div>
            <div className="input-group">
              <label className="input-label">Access Token (shpat_...)</label>
              <input className="input" type="password" placeholder="shpat_xxxxxx" value={form.token} onChange={e => setForm(f => ({ ...f, token: e.target.value }))} />
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-primary" onClick={addShop}>✅ Ajouter</button>
              <button className="btn btn-secondary" onClick={() => setAdding(false)}>Annuler</button>
            </div>
          </div>
        ) : (
          <button className="btn btn-secondary" onClick={() => setAdding(true)} style={{ marginTop: 12, width: '100%', justifyContent: 'center' }}>
            + Ajouter un shop
          </button>
        )}
      </div>

      <div className="card">
        <p className="card-title">💡 Comment obtenir un Access Token</p>
        <ol style={{ paddingLeft: 20, fontSize: 14, color: 'var(--muted)', lineHeight: 2 }}>
          <li>Va sur <strong style={{ color: 'var(--text)' }}>shopbuilder-omega.vercel.app/api/auth/install?shop=TONSHOP.myshopify.com</strong></li>
          <li>Remplace TONSHOP par le nom de ton shop</li>
          <li>Autorise l'application</li>
          <li>Copie le token généré et colle le ici</li>
        </ol>
      </div>

      <style jsx>{`
        .shop-card { display: flex; align-items: center; justify-content: space-between; padding: 14px 16px; background: var(--surface2); border-radius: 10px; border: 1px solid var(--border); margin-bottom: 10px; transition: all 0.2s; }
        .shop-card.active { border-color: #2ecc7130; background: #2ecc7108; }
        .shop-info { display: flex; align-items: center; gap: 12px; }
        .shop-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
        .shop-name { font-weight: 600; font-size: 14px; }
        .shop-url { font-size: 12px; color: var(--muted); }
        .shop-actions { display: flex; align-items: center; gap: 8px; }
        .active-badge { font-size: 13px; color: #2ecc71; font-weight: 600; }
        .add-form { background: var(--surface2); border-radius: 10px; padding: 16px; margin-top: 12px; border: 1px solid var(--border); }
      `}</style>
    </div>
  )
}
