import { useState } from 'react'

export default function TrendFinder() {
  const [niche, setNiche] = useState('')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState([])
  const [error, setError] = useState(null)

  const find = async () => {
    setLoading(true)
    setResults([])
    setError(null)
    try {
      const res = await fetch('/api/find-trends', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ niche }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setResults(data.products)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="card">
        <p className="card-title">Recherche de produits viraux</p>
        <div className="input-group">
          <label className="input-label">Niche (optionnel — laisse vide pour toutes les tendances)</label>
          <input
            className="input"
            placeholder="ex: beauté, cuisine, animaux, sport..."
            value={niche}
            onChange={e => setNiche(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && find()}
          />
        </div>
        <button className="btn btn-primary" onClick={find} disabled={loading}>
          {loading ? '⏳ Recherche en cours...' : '🔥 Trouver les produits viraux'}
        </button>
      </div>

      {loading && (
        <div className="loading">
          <div className="spinner" />
          Analyse des tendances TikTok, Meta Ads et AliExpress...
        </div>
      )}

      {error && <div className="error-banner">❌ {error}</div>}

      {results.length > 0 && (
        <div>
          {results.map((p, i) => (
            <div key={i} className="card product-card">
              <div className="product-header">
                <div>
                  <h3 className="product-name">{p.name}</h3>
                  <p className="product-niche">{p.niche}</p>
                </div>
                <div className="product-score">
                  <span className="score-label">Score viral</span>
                  <span className="score-value">{p.viralScore}/10</span>
                </div>
              </div>

              <p className="product-why">{p.why}</p>

              <div className="product-stats">
                <div className="stat">
                  <span className="stat-label">Prix achat</span>
                  <span className="stat-value">{p.buyPrice}</span>
                </div>
                <div className="stat">
                  <span className="stat-label">Prix vente suggéré</span>
                  <span className="stat-value green">{p.sellPrice}</span>
                </div>
                <div className="stat">
                  <span className="stat-label">Marge estimée</span>
                  <span className="stat-value accent">{p.margin}</span>
                </div>
              </div>

              <div style={{ marginTop: 12 }}>
                {p.tags?.map((t, j) => <span key={j} className="tag">{t}</span>)}
              </div>
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        .product-card { transition: border 0.2s; }
        .product-card:hover { border-color: #7c5cfc40; }
        .product-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px; }
        .product-name { font-family: 'Syne', sans-serif; font-size: 16px; font-weight: 700; }
        .product-niche { font-size: 12px; color: var(--muted); margin-top: 2px; }
        .product-score { text-align: right; }
        .score-label { display: block; font-size: 11px; color: var(--muted); }
        .score-value { font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 800; background: linear-gradient(135deg, var(--accent), var(--accent2)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .product-why { font-size: 13px; color: var(--muted); line-height: 1.6; margin-bottom: 14px; }
        .product-stats { display: flex; gap: 20px; }
        .stat { display: flex; flex-direction: column; gap: 2px; }
        .stat-label { font-size: 11px; color: var(--muted); }
        .stat-value { font-size: 15px; font-weight: 600; }
        .stat-value.green { color: #2ecc71; }
        .stat-value.accent { color: #a084fd; }
      `}</style>
    </div>
  )
}
