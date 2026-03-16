import { useState } from 'react'

export default function PricingStrategy() {
  const [form, setForm] = useState({ productName: '', buyPrice: '', niche: '', targetMargin: '60', competitors: '' })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const analyze = async () => {
    setLoading(true)
    setResult(null)
    setError(null)
    try {
      const res = await fetch('/api/pricing-strategy', {
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

  return (
    <div>
      <div className="card">
        <p className="card-title">💰 Stratégie de prix optimale</p>
        <div className="grid-2">
          <div className="input-group">
            <label className="input-label">Nom du produit</label>
            <input className="input" placeholder="ex: Montre GPS sport" value={form.productName} onChange={e => update('productName', e.target.value)} />
          </div>
          <div className="input-group">
            <label className="input-label">Prix d'achat (€)</label>
            <input className="input" type="number" placeholder="ex: 8.50" value={form.buyPrice} onChange={e => update('buyPrice', e.target.value)} />
          </div>
          <div className="input-group">
            <label className="input-label">Niche</label>
            <input className="input" placeholder="ex: sport, beauté, cuisine..." value={form.niche} onChange={e => update('niche', e.target.value)} />
          </div>
          <div className="input-group">
            <label className="input-label">Marge cible (%)</label>
            <input className="input" type="number" placeholder="60" value={form.targetMargin} onChange={e => update('targetMargin', e.target.value)} />
          </div>
        </div>
        <div className="input-group">
          <label className="input-label">Prix concurrents (optionnel)</label>
          <input className="input" placeholder="ex: 24.99€, 29.99€, 34.99€" value={form.competitors} onChange={e => update('competitors', e.target.value)} />
        </div>
        <button className="btn btn-primary" onClick={analyze} disabled={loading || !form.productName || !form.buyPrice}>
          {loading ? '⏳ Analyse...' : '💰 Calculer le prix optimal'}
        </button>
      </div>

      {loading && <div className="loading"><div className="spinner" />Analyse de la stratégie de prix...</div>}
      {error && <div className="error-banner">❌ {error}</div>}

      {result && (
        <div>
          <div className="card">
            <p className="card-title">💰 Prix recommandés</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 16 }}>
              <div style={{ background: 'linear-gradient(135deg, #7c5cfc20, #fc5c7d10)', border: '1px solid #7c5cfc30', borderRadius: 10, padding: 16, textAlign: 'center' }}>
                <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 4 }}>PRIX RECOMMANDÉ</div>
                <div style={{ fontSize: 28, fontWeight: 900, fontFamily: 'Syne', color: '#a084fd' }}>{result.recommendedPrice}€</div>
                <div style={{ fontSize: 12, color: '#2ecc71', marginTop: 4 }}>{result.marginAtRecommended} marge</div>
              </div>
              <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 10, padding: 16, textAlign: 'center' }}>
                <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 4 }}>PRIX PSYCHOLOGIQUE</div>
                <div style={{ fontSize: 24, fontWeight: 800, fontFamily: 'Syne' }}>{result.psychologicalPrice}€</div>
              </div>
              <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 10, padding: 16, textAlign: 'center' }}>
                <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 4 }}>FOURCHETTE</div>
                <div style={{ fontSize: 16, fontWeight: 700 }}>{result.minPrice}€ — {result.maxPrice}€</div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div style={{ background: 'var(--surface2)', borderRadius: 10, padding: 14, textAlign: 'center', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 4 }}>BUNDLE 2X</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: '#2ecc71' }}>{result.bundlePrice2x}€</div>
              </div>
              <div style={{ background: 'var(--surface2)', borderRadius: 10, padding: 14, textAlign: 'center', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 4 }}>BUNDLE 3X</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: '#2ecc71' }}>{result.bundlePrice3x}€</div>
              </div>
            </div>
          </div>
          <div className="card">
            <p className="card-title">📊 Stratégie</p>
            <div className="result-box">{result.priceStrategy}</div>
          </div>
          <div className="card">
            <p className="card-title">💡 Conseils de conversion</p>
            <div className="result-box">{result.pricingTips}</div>
          </div>
          <div className="card">
            <p className="card-title">🧪 Plan de test A/B</p>
            <div className="result-box">{result.testingPlan}</div>
          </div>
          <div className="card">
            <p className="card-title">🎁 Stratégie promotions</p>
            <div className="result-box">{result.discountStrategy}</div>
          </div>
        </div>
      )}
    </div>
  )
}
