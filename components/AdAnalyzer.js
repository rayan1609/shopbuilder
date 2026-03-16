import { useState } from 'react'

export default function AdAnalyzer() {
  const [form, setForm] = useState({ productName: '', adDescription: '', platform: 'tiktok' })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const analyze = async () => {
    setLoading(true)
    setResult(null)
    setError(null)
    try {
      const res = await fetch('/api/analyze-ad', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Erreur inconnue')
      setResult(data)
    } catch (e) {
      setError(String(e.message))
    } finally {
      setLoading(false)
    }
  }

  const platforms = [
    { value: 'tiktok', label: '🎵 TikTok' },
    { value: 'instagram', label: '📸 Instagram' },
    { value: 'facebook', label: '📘 Facebook' },
    { value: 'youtube', label: '▶️ YouTube' },
  ]

  return (
    <div>
      <div className="card">
        <p className="card-title">🎯 Analyseur de pubs et Générateur UGC</p>
        <div className="input-group">
          <label className="input-label">Produit / Niche</label>
          <input className="input" placeholder="ex: Lampe LED rechargeable" value={form.productName} onChange={e => update('productName', e.target.value)} />
        </div>
        <div className="input-group">
          <label className="input-label">Plateforme cible</label>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {platforms.map(p => (
              <button
                key={p.value}
                onClick={() => update('platform', p.value)}
                style={{
                  padding: '8px 16px',
                  borderRadius: 20,
                  border: `1px solid ${form.platform === p.value ? 'var(--accent)' : 'var(--border)'}`,
                  background: form.platform === p.value ? '#7c5cfc20' : 'var(--surface2)',
                  color: form.platform === p.value ? '#a084fd' : 'var(--muted)',
                  cursor: 'pointer',
                  fontSize: 13,
                  fontWeight: 500,
                }}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
        <div className="input-group">
          <label className="input-label">Description de ta pub (optionnel)</label>
          <textarea className="input" placeholder="Décris ta pub ou colle le texte..." value={form.adDescription} onChange={e => update('adDescription', e.target.value)} rows={3} />
        </div>
        <button className="btn btn-primary" onClick={analyze} disabled={loading || !form.productName}>
          {loading ? '⏳ Analyse...' : '🎯 Analyser et générer'}
        </button>
      </div>

      {loading && <div className="loading"><div className="spinner" />Génération des scripts UGC...</div>}
      {error && <div className="error-banner">❌ {error}</div>}

      {result && (
        <div>
          {[
            { key: 'analysis', title: '📊 Analyse stratégique' },
            { key: 'script1', title: '🎬 Script UGC — Problème/Solution' },
            { key: 'script2', title: '🎬 Script UGC — Témoignage' },
            { key: 'script3', title: '🎬 Script UGC — Démonstration' },
            { key: 'hooks', title: '💡 Hooks accrocheurs' },
            { key: 'music', title: '🎵 Sons tendance suggérés' },
          ].map(item => (
            result[item.key] ? (
              <div key={item.key} className="card">
                <p className="card-title">{item.title}</p>
                <div className="result-box">{String(result[item.key])}</div>
              </div>
            ) : null
          ))}
        </div>
      )}
    </div>
  )
}
