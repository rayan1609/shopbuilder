import { useState, useEffect } from 'react'

export default function TrendAlerts() {
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(false)
  const [lastCheck, setLastCheck] = useState(null)
  const [mounted, setMounted] = useState(false)
  const [niche, setNiche] = useState('')
  const [autoCheck, setAutoCheck] = useState(false)

  useEffect(() => {
    setMounted(true)
    try {
      const saved = localStorage.getItem('shopbuilder_alerts')
      if (saved) setAlerts(JSON.parse(saved))
      const last = localStorage.getItem('shopbuilder_last_check')
      if (last) setLastCheck(last)
    } catch (e) {}
  }, [])

  const checkTrends = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/find-trends', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ niche }),
      })
      const data = await res.json()
      if (res.ok && data.products) {
        const newAlerts = data.products
          .filter(p => p.viralScore >= 8)
          .map(p => ({
            ...p,
            id: Date.now() + Math.random(),
            date: new Date().toLocaleDateString('fr-FR'),
            time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
            isNew: true
          }))

        const updated = [...newAlerts, ...alerts].slice(0, 20)
        setAlerts(updated)
        try {
          localStorage.setItem('shopbuilder_alerts', JSON.stringify(updated))
          const now = new Date().toLocaleString('fr-FR')
          localStorage.setItem('shopbuilder_last_check', now)
          setLastCheck(now)
        } catch (e) {}
      }
    } catch (e) {}
    setLoading(false)
  }

  const clearAlerts = () => {
    setAlerts([])
    try { localStorage.removeItem('shopbuilder_alerts') } catch (e) {}
  }

  const getScoreColor = (score) => {
    if (score >= 9) return '#ff4757'
    if (score >= 8) return '#f39c12'
    return '#2ecc71'
  }

  if (!mounted) return null

  return (
    <div>
      <div className="card">
        <p className="card-title">🔔 Alertes produits viraux</p>
        <p style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 16 }}>
          Scanne les tendances et reçois des alertes sur les produits à fort potentiel viral (score 8+/10).
        </p>

        <div className="grid-2" style={{ marginBottom: 16 }}>
          <div className="input-group" style={{ margin: 0 }}>
            <label className="input-label">Niche (optionnel)</label>
            <input className="input" placeholder="ex: beauté, cuisine, sport..." value={niche} onChange={e => setNiche(e.target.value)} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <button className="btn btn-primary" onClick={checkTrends} disabled={loading} style={{ flex: 1, justifyContent: 'center' }}>
              {loading ? '⏳ Scan en cours...' : '🔍 Scanner maintenant'}
            </button>
            {lastCheck && (
              <div style={{ fontSize: 12, color: 'var(--muted)', textAlign: 'center' }}>
                Dernier scan : {lastCheck}
              </div>
            )}
          </div>
        </div>

        <div style={{ background: 'var(--surface2)', borderRadius: 10, padding: '12px 16px', border: '1px solid var(--border)', fontSize: 13, color: 'var(--muted)' }}>
          💡 <strong style={{ color: 'var(--text)' }}>Astuce :</strong> Lance un scan chaque matin pour trouver les produits viraux avant tes concurrents. Seuls les produits avec un score de 8+/10 apparaissent ici.
        </div>
      </div>

      {alerts.length > 0 && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontSize: 14, fontWeight: 600 }}>🔥 {alerts.length} alerte(s)</span>
            <button className="btn btn-secondary" onClick={clearAlerts} style={{ padding: '6px 12px', fontSize: 12 }}>🗑 Effacer tout</button>
          </div>

          {alerts.map((alert, i) => (
            <div key={alert.id || i} className="card" style={{ borderColor: alert.isNew ? '#7c5cfc30' : 'var(--border)', position: 'relative' }}>
              {alert.isNew && (
                <span style={{ position: 'absolute', top: 12, right: 12, background: '#7c5cfc', color: 'white', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 10 }}>NOUVEAU</span>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <div>
                  <h3 style={{ fontFamily: 'Syne', fontSize: 16, fontWeight: 700, marginBottom: 4 }}>{alert.name}</h3>
                  <span style={{ fontSize: 12, color: 'var(--muted)' }}>{alert.niche} · {alert.date} à {alert.time}</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 28, fontWeight: 900, fontFamily: 'Syne', color: getScoreColor(alert.viralScore) }}>{alert.viralScore}/10</div>
                  <span style={{ fontSize: 11, color: 'var(--muted)' }}>Score viral</span>
                </div>
              </div>
              <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 10, lineHeight: 1.5 }}>{alert.why}</p>
              <div style={{ display: 'flex', gap: 16 }}>
                <div style={{ fontSize: 13 }}>💰 Achat: <strong>{alert.buyPrice}</strong></div>
                <div style={{ fontSize: 13 }}>🏷️ Vente: <strong style={{ color: '#2ecc71' }}>{alert.sellPrice}</strong></div>
                <div style={{ fontSize: 13 }}>📊 Marge: <strong style={{ color: '#a084fd' }}>{alert.margin}</strong></div>
              </div>
              <div style={{ marginTop: 10 }}>
                {alert.tags?.slice(0, 3).map((t, j) => <span key={j} className="tag">{t}</span>)}
              </div>
            </div>
          ))}
        </div>
      )}

      {alerts.length === 0 && !loading && (
        <div className="card" style={{ textAlign: 'center', padding: 40 }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🔔</div>
          <p style={{ color: 'var(--muted)', fontSize: 14 }}>Aucune alerte pour l'instant.</p>
          <p style={{ color: 'var(--muted)', fontSize: 13, marginTop: 4 }}>Lance un scan pour trouver les produits viraux du moment.</p>
        </div>
      )}
    </div>
  )
}
