import { useState } from 'react'

export default function EmailGenerator() {
  const [form, setForm] = useState({
    productName: '',
    brandName: '',
    emailType: 'welcome',
    tone: 'friendly',
  })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [copied, setCopied] = useState(false)

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const generate = async () => {
    setLoading(true)
    setResult(null)
    setError(null)
    try {
      const res = await fetch('/api/generate-email', {
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
    navigator.clipboard.writeText(result.body)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const emailTypes = [
    { value: 'welcome', label: 'Bienvenue' },
    { value: 'abandoned_cart', label: 'Panier abandonné' },
    { value: 'upsell', label: 'Upsell post-achat' },
    { value: 'winback', label: 'Réactivation client' },
    { value: 'launch', label: 'Lancement produit' },
    { value: 'promo', label: 'Promotion / Soldes' },
  ]

  return (
    <div>
      <div className="card">
        <p className="card-title">Générateur d'emails marketing</p>
        <div className="grid-2">
          <div className="input-group">
            <label className="input-label">Nom du produit</label>
            <input className="input" placeholder="ex: Montre connectée GPS" value={form.productName} onChange={e => update('productName', e.target.value)} />
          </div>
          <div className="input-group">
            <label className="input-label">Nom de la marque</label>
            <input className="input" placeholder="ex: TechWear" value={form.brandName} onChange={e => update('brandName', e.target.value)} />
          </div>
          <div className="input-group">
            <label className="input-label">Type d'email</label>
            <select className="input" value={form.emailType} onChange={e => update('emailType', e.target.value)}>
              {emailTypes.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
          <div className="input-group">
            <label className="input-label">Ton</label>
            <select className="input" value={form.tone} onChange={e => update('tone', e.target.value)}>
              <option value="friendly">Amical et chaleureux</option>
              <option value="professional">Professionnel</option>
              <option value="urgent">Urgent / Scarcité</option>
              <option value="luxury">Luxe / Premium</option>
            </select>
          </div>
        </div>
        <button className="btn btn-primary" onClick={generate} disabled={loading || !form.productName}>
          {loading ? '⏳ Génération...' : '📧 Générer l\'email'}
        </button>
      </div>

      {loading && <div className="loading"><div className="spinner" />Génération de l'email en cours...</div>}
      {error && <div className="error-banner">❌ {error}</div>}

      {result && (
        <div className="card">
          <p className="card-title">Email généré</p>
          <div style={{ marginBottom: 12 }}>
            <label className="input-label">Objet</label>
            <div className="subject-box">{result.subject}</div>
          </div>
          <div style={{ marginBottom: 16 }}>
            <label className="input-label">Corps de l'email</label>
            <div className="result-box">{result.body}</div>
          </div>
          <button className="btn btn-secondary" onClick={copy}>
            {copied ? '✅ Copié !' : '📋 Copier l\'email'}
          </button>
        </div>
      )}

      <style jsx>{`
        .subject-box {
          background: var(--surface2);
          border: 1px solid var(--accent);
          border-radius: 10px;
          padding: 12px 16px;
          font-size: 14px;
          font-weight: 600;
          color: #a084fd;
        }
      `}</style>
    </div>
  )
}
