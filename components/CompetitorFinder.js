// CompetitorFinder.js
import { useState } from 'react'

export function CompetitorFinder() {
  const [productName, setProductName] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const find = async () => {
    setLoading(true)
    setResult(null)
    setError(null)
    try {
      const res = await fetch('/api/find-competitors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productName }),
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
        <p className="card-title">🔍 Trouver mes concurrents</p>
        <div className="input-group">
          <label className="input-label">Produit ou niche</label>
          <input className="input" placeholder="ex: Montre GPS sport, accessoires chien..." value={productName} onChange={e => setProductName(e.target.value)} onKeyDown={e => e.key === 'Enter' && find()} />
        </div>
        <button className="btn btn-primary" onClick={find} disabled={loading || !productName}>
          {loading ? '⏳ Recherche...' : '🔍 Trouver les concurrents'}
        </button>
      </div>

      {loading && <div className="loading"><div className="spinner" />Recherche des shops concurrents...</div>}
      {error && <div className="error-banner">❌ {error}</div>}

      {result && (
        <div>
          {result.competitors?.map((c, i) => (
            <div key={i} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div>
                  <h3 style={{ fontFamily: 'Syne', fontSize: 16, fontWeight: 700, marginBottom: 4 }}>{c.name}</h3>
                  <a href={c.url} target="_blank" rel="noreferrer" style={{ color: 'var(--accent)', fontSize: 13 }}>{c.url}</a>
                </div>
                <span style={{ background: '#7c5cfc20', color: '#a084fd', padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>{c.trafficEstimate}</span>
              </div>
              <p style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 10 }}>{c.description}</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                <div style={{ background: 'var(--surface2)', borderRadius: 8, padding: '8px 12px' }}>
                  <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 2 }}>Prix</div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{c.priceRange}</div>
                </div>
                <div style={{ background: '#2ecc7108', border: '1px solid #2ecc7120', borderRadius: 8, padding: '8px 12px' }}>
                  <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 2 }}>✅ Force</div>
                  <div style={{ fontSize: 13, color: '#2ecc71' }}>{c.strength}</div>
                </div>
                <div style={{ background: '#e74c3c08', border: '1px solid #e74c3c20', borderRadius: 8, padding: '8px 12px' }}>
                  <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 2 }}>⚠️ Faiblesse</div>
                  <div style={{ fontSize: 13, color: '#e74c3c' }}>{c.weakness}</div>
                </div>
              </div>
            </div>
          ))}
          {result.marketAnalysis && (
            <div className="card">
              <p className="card-title">📊 Analyse du marché</p>
              <div className="result-box">{result.marketAnalysis}</div>
            </div>
          )}
          {result.differentiationTips && (
            <div className="card">
              <p className="card-title">💡 Comment se différencier</p>
              <div className="result-box">{result.differentiationTips}</div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
