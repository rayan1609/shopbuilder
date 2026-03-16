import { useState } from 'react'

export default function BrandName() {
  const [form, setForm] = useState({ niche: '', style: 'moderne', targetAudience: '' })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [copied, setCopied] = useState('')

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const generate = async () => {
    setLoading(true)
    setResult(null)
    setError(null)
    try {
      const res = await fetch('/api/brand-name', {
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

  const copy = (text) => {
    navigator.clipboard.writeText(text)
    setCopied(text)
    setTimeout(() => setCopied(''), 2000)
  }

  const styles = ['Moderne', 'Luxe', 'Fun', 'Minimal', 'Puissant', 'Nature', 'Tech']

  return (
    <div>
      <div className="card">
        <p className="card-title">✨ Générateur de nom de marque</p>
        <div className="grid-2">
          <div className="input-group">
            <label className="input-label">Niche / Secteur</label>
            <input className="input" placeholder="ex: accessoires sport, beauté, cuisine..." value={form.niche} onChange={e => update('niche', e.target.value)} />
          </div>
          <div className="input-group">
            <label className="input-label">Audience cible</label>
            <input className="input" placeholder="ex: femmes 25-35, sportifs, parents..." value={form.targetAudience} onChange={e => update('targetAudience', e.target.value)} />
          </div>
        </div>
        <div className="input-group">
          <label className="input-label">Style souhaité</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {styles.map(s => (
              <button key={s} onClick={() => update('style', s.toLowerCase())} style={{ padding: '7px 14px', borderRadius: 20, border: `1px solid ${form.style === s.toLowerCase() ? 'var(--accent)' : 'var(--border)'}`, background: form.style === s.toLowerCase() ? '#7c5cfc20' : 'var(--surface2)', color: form.style === s.toLowerCase() ? '#a084fd' : 'var(--muted)', cursor: 'pointer', fontSize: 13, fontWeight: 500 }}>
                {s}
              </button>
            ))}
          </div>
        </div>
        <button className="btn btn-primary" onClick={generate} disabled={loading || !form.niche}>
          {loading ? '⏳ Génération...' : '✨ Générer des noms de marque'}
        </button>
      </div>

      {loading && <div className="loading"><div className="spinner" />Création de noms de marques uniques...</div>}
      {error && <div className="error-banner">❌ {error}</div>}

      {result && (
        <div>
          {result.names?.map((n, i) => (
            <div key={i} className="card" style={{ borderColor: i === 0 ? '#7c5cfc30' : 'var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div>
                  <h3 style={{ fontFamily: 'Syne', fontSize: 22, fontWeight: 900, marginBottom: 4, color: i === 0 ? '#a084fd' : 'var(--text)' }}>{n.name}</h3>
                  <div style={{ fontSize: 13, color: 'var(--muted)', fontStyle: 'italic' }}>"{n.tagline}"</div>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <span style={{ background: '#7c5cfc20', color: '#a084fd', padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 700 }}>{n.style}</span>
                  <span style={{ fontSize: 20, fontWeight: 900, fontFamily: 'Syne', color: '#2ecc71' }}>{n.score}/10</span>
                </div>
              </div>
              <p style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 12, lineHeight: 1.5 }}>{n.meaning}</p>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 14px', fontSize: 13, flex: 1 }}>
                  🌐 {n.domain}
                </div>
                <button className="btn btn-secondary" onClick={() => copy(n.name)} style={{ padding: '8px 14px', fontSize: 13 }}>
                  {copied === n.name ? '✅' : '📋'} Copier
                </button>
              </div>
            </div>
          ))}
          {result.namingTips && (
            <div className="card">
              <p className="card-title">💡 Conseils pour choisir</p>
              <div className="result-box">{result.namingTips}</div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
