import { useState } from 'react'

export default function LegalGenerator() {
  const [form, setForm] = useState({
    brandName: '',
    email: '',
    address: '',
    country: 'France',
    productType: '',
    deliveryDays: '7-14',
    returnDays: '30',
  })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [activeDoc, setActiveDoc] = useState('cgv')
  const [copied, setCopied] = useState(false)

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const generate = async () => {
    setLoading(true)
    setResult(null)
    setError(null)
    try {
      const res = await fetch('/api/generate-legal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setResult(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const copy = () => {
    navigator.clipboard.writeText(result[activeDoc])
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const docs = [
    { id: 'cgv', label: 'CGV' },
    { id: 'privacy', label: 'Confidentialité' },
    { id: 'mentions', label: 'Mentions légales' },
    { id: 'shipping', label: 'Livraison' },
    { id: 'returns', label: 'Retours' },
  ]

  return (
    <div>
      <div className="card">
        <p className="card-title">⚖️ Générateur de documents légaux</p>
        <div className="grid-2">
          <div className="input-group">
            <label className="input-label">Nom de la marque</label>
            <input className="input" placeholder="ex: TechWear Store" value={form.brandName} onChange={e => update('brandName', e.target.value)} />
          </div>
          <div className="input-group">
            <label className="input-label">Email de contact</label>
            <input className="input" type="email" placeholder="contact@monshop.com" value={form.email} onChange={e => update('email', e.target.value)} />
          </div>
          <div className="input-group">
            <label className="input-label">Adresse</label>
            <input className="input" placeholder="ex: 12 rue de Paris, 75001 Paris" value={form.address} onChange={e => update('address', e.target.value)} />
          </div>
          <div className="input-group">
            <label className="input-label">Type de produits</label>
            <input className="input" placeholder="ex: accessoires mode, gadgets..." value={form.productType} onChange={e => update('productType', e.target.value)} />
          </div>
          <div className="input-group">
            <label className="input-label">Délai de livraison</label>
            <select className="input" value={form.deliveryDays} onChange={e => update('deliveryDays', e.target.value)}>
              <option value="3-5">3-5 jours</option>
              <option value="5-10">5-10 jours</option>
              <option value="7-14">7-14 jours</option>
              <option value="10-20">10-20 jours</option>
            </select>
          </div>
          <div className="input-group">
            <label className="input-label">Délai de retour</label>
            <select className="input" value={form.returnDays} onChange={e => update('returnDays', e.target.value)}>
              <option value="14">14 jours</option>
              <option value="30">30 jours</option>
              <option value="60">60 jours</option>
            </select>
          </div>
        </div>
        <button className="btn btn-primary" onClick={generate} disabled={loading || !form.brandName}>
          {loading ? '⏳ Génération...' : '⚖️ Générer tous les documents'}
        </button>
      </div>

      {loading && <div className="loading"><div className="spinner" />Génération de vos documents légaux...</div>}
      {error && <div className="error-banner">❌ {error}</div>}

      {result && (
        <div className="card">
          <div className="doc-tabs">
            {docs.map(d => (
              <button key={d.id} className={`doc-tab ${activeDoc === d.id ? 'active' : ''}`} onClick={() => setActiveDoc(d.id)}>
                {d.label}
              </button>
            ))}
          </div>
          <div className="result-box" style={{ marginTop: 16, maxHeight: 400, overflowY: 'auto' }}>
            {result[activeDoc]}
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
            <button className="btn btn-primary" onClick={copy}>
              {copied ? '✅ Copié !' : '📋 Copier'}
            </button>
            <span style={{ fontSize: 13, color: 'var(--muted)', alignSelf: 'center' }}>
              À coller dans Shopify → Boutique en ligne → Pages
            </span>
          </div>
        </div>
      )}

      <style jsx>{`
        .doc-tabs { display: flex; gap: 8px; flex-wrap: wrap; }
        .doc-tab { padding: 8px 16px; border-radius: 20px; border: 1px solid var(--border); background: var(--surface2); color: var(--muted); cursor: pointer; font-size: 13px; font-weight: 500; transition: all 0.2s; }
        .doc-tab:hover { border-color: var(--accent); color: var(--text); }
        .doc-tab.active { border-color: var(--accent); background: #7c5cfc20; color: #a084fd; }
      `}</style>
    </div>
  )
}
