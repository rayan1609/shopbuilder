import { useState } from 'react'

export default function SpyTool() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const spy = async () => {
    setLoading(true)
    setResult(null)
    setError(null)
    try {
      const res = await fetch('/api/spy-shop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
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

  return (
    <div>
      <div className="card">
        <p className="card-title">Analyser un shop concurrent</p>
        <div className="input-group">
          <label className="input-label">URL du shop Shopify concurrent</label>
          <input
            className="input"
            type="text"
            placeholder="https://www.exemple-shop.com"
            value={url}
            onChange={e => setUrl(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && spy()}
          />
        </div>
        <button className="btn btn-primary" onClick={spy} disabled={loading || !url}>
          {loading ? '⏳ Analyse en cours...' : '🕵️ Analyser ce shop'}
        </button>
      </div>

      {loading && (
        <div className="loading">
          <div className="spinner" />
          Analyse du shop concurrent en cours...
        </div>
      )}

      {error && <div className="error-banner">❌ {error}</div>}

      {result && (
        <div className="card">
          <p className="card-title">Rapport d'analyse</p>

          <div className="grid-2" style={{ marginBottom: 20 }}>
            <div className="info-block">
              <span className="info-label">Plateforme détectée</span>
              <span className="info-value">{result.platform}</span>
            </div>
            <div className="info-block">
              <span className="info-label">Thème utilisé</span>
              <span className="info-value">{result.theme}</span>
            </div>
            <div className="info-block">
              <span className="info-label">Nombre de produits</span>
              <span className="info-value">{result.productCount}</span>
            </div>
            <div className="info-block">
              <span className="info-label">Fourchette de prix</span>
              <span className="info-value">{result.priceRange}</span>
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label className="input-label">Produits best-sellers détectés</label>
            <div className="result-box">{result.bestSellers}</div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label className="input-label">Stratégie marketing utilisée</label>
            <div className="result-box">{result.marketingStrategy}</div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label className="input-label">Points forts du shop</label>
            <div className="result-box">{result.strengths}</div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label className="input-label">Opportunités pour te différencier</label>
            <div className="result-box">{result.opportunities}</div>
          </div>

          <div>
            <label className="input-label">Apps Shopify détectées</label>
            <div>
              {result.apps?.map((app, i) => (
                <span key={i} className="tag">{app}</span>
              ))}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .info-block { display: flex; flex-direction: column; gap: 4px; background: var(--surface2); border-radius: 10px; padding: 14px 16px; border: 1px solid var(--border); }
        .info-label { font-size: 11px; color: var(--muted); text-transform: uppercase; letter-spacing: 0.5px; }
        .info-value { font-size: 15px; font-weight: 600; color: var(--text); }
      `}</style>
    </div>
  )
}
