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
        <p className="card-title">🎯 Analyseur de pubs & Générateur UGC</p>
        <div className="grid-2">
          <div className="input-group">
            <label className="input-label">Produit / Niche</label>
            <input className="input" placeholder="ex: Lampe LED rechargeable" value={form.productName} onChange={e => update('productName', e.target.value)} />
          </div>
          <div className="input-group">
            <label className="input-label">Plateforme cible</label>
            <select className="input" value={form.platform} onChange={e => update('platform', e.target.value)}>
              <option value="tiktok">TikTok</option>
              <option value="instagram">Instagram Reels</option>
              <option value="facebook">Facebook Ads</option>
              <option value="youtube">YouTube Shorts</option>
            </select>
          </div>
        </div>
        <div className="input-group">
          <label className="input-label">Description de ta pub (optionnel)</label>
          <textarea className="input" placeholder="Décris ta pub ou colle le texte de ton annonce..." value={form.adDescription} onChange={e => update('adDescription', e.target.value)} rows={3} />
        </div>
        <button className="btn btn-primary" onClick={analyze} disabled={loading || !form.productName}>
          {loading ? '⏳ Analyse...' : '🎯 Analyser et générer'}
        </button>
      </div>

      {loading && <div className="loading"><div className="spinner" />Analyse et génération de contenus publicitaires...</div>}
      {error && <div className="error-banner">❌ {error}</div>}

      {result && (
        <div>
          <div className="card">
            <p className="card-title">📊 Analyse de la stratégie</p>
            <div className="result-box">{result.analysis}</div>
          </div>
          <div className="card">
            <p className="card-title">🎬 Script UGC #1 — Angle problème/solution</p>
            <div className="result-box">{result.script1}</div>
          </div>
          <div className="card">
            <p className="card-title">🎬 Script UGC #2 — Angle témoignage</p>
            <div className="result-box">{result.script2}</div>
          </div>
          <div className="card">
            <p className="card-title">🎬 Script UGC #3 — Angle démonstration</p>
            <div className="result-box">{result.script3}</div>
          </div>
          <div className="card">
            <p className="card-title">💡 Hooks accrocheurs (5 idées)</p>
            <div className="result-box">{result.hooks}</div>
          </div>
          <div className="card">
            <p className="card-title">🎵 Sons/Musiques tendance suggérés</p>
            <div className="result-box">{result.music}</div>
          </div>
        </div>
      )}
    </div>
  )
}
