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
      if (saved) {
        setShops(JSON.parse(saved))
      }
    } catch (e) {}
  }, [])

  const save = (newShops) => {
    setShops(newShops)
    try { localStorage.setItem('shopbuilder_shops', JSON.stringify(newShops)) } catch(e) {}
  }

  const addShop = () => {
    if (!form.name || !form.shop || !form.token) return
    const newShop = { id: Date.now(), name: form.name, shop: form.shop, token: form.token, active: false }
    save([...shops, newShop])
    setForm({ name: '', shop: '', token: '' })
    setAdding(false)
  }

  const setActive = (id) => save(shops.map(s => ({ ...s, active: s.id === id })))
  const removeShop = (id) => save(shops.filter(s => s.id !== id))

  if (!mounted) return (
    <div className="card">
      <p className="card-title">🗂️ Mes shops</p>
      <div className="loading"><div className="spinner" />Chargement...</div>
    </div>
  )

  return (
    <div>
      <div className="card">
        <p className="card-title">🏪 Gestion multi-shops</p>
        <p style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 20 }}>
          Connecte plusieurs boutiques Shopify et switche entre elles en 1 clic.
        </p>

        {shops.length === 0 && (
          <div style={{ textAlign: 'center', padding: '20px', color: 'var(--muted)', fontSize: 14 }}>
            Aucun shop connecté. Ajoute ton premier shop ci-dessous.
          </div>
        )}

        {shops.map(shop => (
          <div key={shop.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', background: 'var(--surface2)', borderRadius: 10, border: shop.active ? '1px solid #2ecc7130' : '1px solid var(--border)', marginBottom: 10, background: shop.active ? '#2ecc7108' : 'var(--surface2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: shop.active ? '#2ecc71' : 'var(--muted)', flexShrink: 0 }} />
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{shop.name}</div>
                <div style={{ fontSize: 12, color: 'var(--muted)' }}>{shop.shop}</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {shop.active ? (
                <span style={{ fontSize: 13, color: '#2ecc71', fontWeight: 600 }}>✅ Actif</span>
              ) : (
                <button className="btn btn-secondary" onClick={() => setActive(shop.id)} style={{ padding: '6px 14px', fontSize: 13 }}>Activer</button>
              )}
              <button onClick={() => removeShop(shop.id)} style={{ background: 'none', border: 'none', color: '#e74c3c', cursor: 'pointer', fontSize: 18 }}>🗑</button>
            </div>
          </div>
        ))}

        {adding ? (
          <div style={{ background: 'var(--surface2)', borderRadius: 10, padding: 16, marginTop: 12, border: '1px solid var(--border)' }}>
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
          <li>Copie le token et colle le ici</li>
        </ol>
      </div>
    </div>
  )
}
