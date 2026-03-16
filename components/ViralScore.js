import { useState } from 'react'

export default function ViralScore() {
  const [productName, setProductName] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const analyze = async () => {
    setLoading(true)
    setResult(null)
    setError(null)
    try {
      const res = await fetch('/api/viral-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productName }),
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

  const getColor = (score) => {
    if (score >= 8) return '#2ecc71'
    if (score >= 6) return '#f39c12'
    return '#e74c3c'
  }

  const getVerdict = (score) => {
    if (score >= 8) return { label: '🔥 Produit viral', color: '#2ecc71' }
    if (score >= 6) return { label: '⚡ Potentiel correct', color: '#f39c12' }
    return { label: '❌ Risqué', color: '#e74c3c' }
  }

  return (
    <div>
      <div className="card">
        <p className="card-title">🔥 Score de viralité produit</p>
        <div className="input-group">
          <label className="input-label">Nom du produit à analyser</label>
          <input
            className="input"
            placeholder="ex: Lampe LED USB rechargeable, Montre GPS sport..."
            value={productName}
            onChange={e => setProductName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && analyze()}
          />
        </div>
        <button className="btn btn-primary" onClick={analyze} disabled={loading || !productName}>
          {loading ? '⏳ Analyse en cours...' : '🔥 Analyser le potentiel viral'}
        </button>
      </div>

      {loading && <div className="loading"><div className="spinner" />L'IA analyse le potentiel viral de ce produit...</div>}
      {error && <div className="error-banner">❌ {error}</div>}

      {result && (
        <div className="card">
          <div className="score-header">
            <div>
              <h2 style={{ fontFamily: 'Syne', fontSize: 20, fontWeight: 800, marginBottom: 8 }}>{result.productName}</h2>
              {(() => {
                const verdict = getVerdict(result.overallScore)
                return <span style={{ color: verdict.color, fontWeight: 700, fontSize: 15 }}>{verdict.label}</span>
              })()}
            </div>
            <div className="big-score" style={{ color: getColor(result.overallScore) }}>
              {result.overallScore}<span style={{ fontSize: 24, opacity: 0.5 }}>/10</span>
            </div>
          </div>

          <div className="scores-grid">
            {[
              { label: 'Tendance actuelle', score: result.trendScore, icon: '📈' },
              { label: 'Potentiel TikTok', score: result.tiktokScore, icon: '🎵' },
              { label: 'Marge dropshipping', score: result.marginScore, icon: '💰' },
              { label: 'Concurrence', score: result.competitionScore, icon: '🕵️' },
              { label: 'Facilité de vente', score: result.easeScore, icon: '⚡' },
              { label: 'Audience cible', score: result.audienceScore, icon: '🎯' },
            ].map((s, i) => (
              <div key={i} className="score-item">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <span style={{ fontSize: 13, color: 'var(--muted)' }}>{s.icon} {s.label}</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: getColor(s.score) }}>{s.score}/10</span>
                </div>
                <div className="score-bar">
                  <div className="score-fill" style={{ width: `${s.score * 10}%`, background: getColor(s.score) }} />
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 20 }}>
            <label className="input-label">Analyse détaillée</label>
            <div className="result-box">{result.analysis}</div>
          </div>

          <div style={{ marginTop: 16 }}>
            <label className="input-label">💡 Stratégie recommandée</label>
            <div className="result-box">{result.strategy}</div>
          </div>

          <div style={{ marginTop: 16 }}>
            <label className="input-label">⚠️ Points de vigilance</label>
            <div className="result-box">{result.warnings}</div>
          </div>

          <div style={{ marginTop: 16, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <div className="info-chip">📦 Prix achat estimé : {result.estimatedBuyPrice}</div>
            <div className="info-chip">💰 Prix vente suggéré : {result.estimatedSellPrice}</div>
            <div className="info-chip">📊 Marge estimée : {result.estimatedMargin}</div>
          </div>
        </div>
      )}

      <style jsx>{`
        .score-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; }
        .big-score { font-family: 'Syne', sans-serif; font-size: 56px; font-weight: 900; line-height: 1; }
        .scores-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .score-item { background: var(--surface2); border-radius: 10px; padding: 14px; }
        .score-bar { height: 6px; background: var(--border); border-radius: 3px; overflow: hidden; }
        .score-fill { height: 100%; border-radius: 3px; transition: width 0.5s; }
        .info-chip { background: var(--surface2); border: 1px solid var(--border); border-radius: 20px; padding: 6px 14px; font-size: 13px; font-weight: 500; }
      `}</style>
    </div>
  )
}
