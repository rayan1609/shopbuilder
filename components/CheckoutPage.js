import { useState } from 'react'

export default function CheckoutPage() {
  const [form, setForm] = useState({
    productName: '',
    price: '',
    brandName: '',
    primaryColor: '#7c5cfc',
    guarantee: '30 jours',
  })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const generate = async () => {
    setLoading(true)
    setResult(null)
    setError(null)
    try {
      const res = await fetch('/api/generate-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setResult(data)
    } catch (e) {
      setError(String(e.message))
    } finally {
      setLoading(false)
    }
  }

  const download = () => {
    if (!result) return
    const blob = new Blob([result.html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `checkout-${form.productName || 'page'}.html`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      <div className="card">
        <p className="card-title">💳 Générateur de page de paiement</p>
        <p style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 16 }}>Génère une landing page checkout optimisée pour maximiser les conversions.</p>

        <div className="grid-2">
          <div className="input-group">
            <label className="input-label">Nom du produit</label>
            <input className="input" placeholder="ex: Montre GPS Sport" value={form.productName} onChange={e => update('productName', e.target.value)} />
          </div>
          <div className="input-group">
            <label className="input-label">Prix (€)</label>
            <input className="input" placeholder="ex: 29.99" value={form.price} onChange={e => update('price', e.target.value)} />
          </div>
          <div className="input-group">
            <label className="input-label">Nom de la marque</label>
            <input className="input" placeholder="ex: TechWear" value={form.brandName} onChange={e => update('brandName', e.target.value)} />
          </div>
          <div className="input-group">
            <label className="input-label">Garantie</label>
            <select className="input" value={form.guarantee} onChange={e => update('guarantee', e.target.value)}>
              <option value="14 jours">14 jours</option>
              <option value="30 jours">30 jours</option>
              <option value="60 jours">60 jours</option>
              <option value="1 an">1 an</option>
            </select>
          </div>
          <div className="input-group">
            <label className="input-label">Couleur principale</label>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <input type="color" value={form.primaryColor} onChange={e => update('primaryColor', e.target.value)} style={{ width: 48, height: 40, borderRadius: 8, border: '1px solid var(--border)', cursor: 'pointer', padding: 2 }} />
              <input className="input" value={form.primaryColor} onChange={e => update('primaryColor', e.target.value)} style={{ flex: 1 }} />
            </div>
          </div>
        </div>

        <button className="btn btn-primary" onClick={generate} disabled={loading || !form.productName}>
          {loading ? '⏳ Génération...' : '💳 Générer la page checkout'}
        </button>
      </div>

      {loading && <div className="loading"><div className="spinner" />Génération de ta page checkout optimisée...</div>}
      {error && <div className="error-banner">❌ {error}</div>}

      {result && (
        <div className="card">
          <p className="card-title">✅ Page checkout générée</p>
          <p style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 16 }}>Ta page checkout inclut : timer de compte à rebours, trust badges, formulaire optimisé, résumé commande et garanties.</p>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-primary" onClick={download}>⬇️ Télécharger HTML</button>
            <button className="btn btn-secondary" onClick={() => {
              const win = window.open()
              win.document.write(result.html)
            }}>👁 Prévisualiser</button>
          </div>
          <div className="success-banner">✅ Page prête ! Héberge-la sur ton domaine ou utilise-la comme landing page.</div>
        </div>
      )}
    </div>
  )
}
