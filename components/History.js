import { useState, useEffect } from 'react'

export default function History() {
  const [history, setHistory] = useState([])
  const [mounted, setMounted] = useState(false)

  const loadHistory = () => {
    try {
      const saved = localStorage.getItem('shopbuilder_history')
      if (saved) setHistory(JSON.parse(saved))
    } catch (e) {}
  }

  useEffect(() => {
    setMounted(true)
    loadHistory()
  }, [])

  const clear = () => {
    localStorage.removeItem('shopbuilder_history')
    setHistory([])
  }

  if (!mounted) return null

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <span style={{ color: 'var(--muted)', fontSize: 14 }}>{history.length} fiche(s) sauvegardée(s)</span>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-secondary" onClick={loadHistory} style={{ padding: '8px 14px', fontSize: 13 }}>🔄 Rafraîchir</button>
          {history.length > 0 && <button className="btn btn-secondary" onClick={clear} style={{ padding: '8px 14px', fontSize: 13 }}>🗑 Effacer</button>}
        </div>
      </div>

      {history.length === 0 ? (
        <div className="card">
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--muted)' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📋</div>
            <p>Aucune fiche générée pour l'instant.</p>
            <p style={{ fontSize: 12, marginTop: 4 }}>Génère une fiche produit puis clique Rafraîchir.</p>
          </div>
        </div>
      ) : (
        history.map((item, i) => (
          <div key={i} className="card" style={{ cursor: 'pointer' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
              <div>
                <h3 style={{ fontFamily: 'Syne', fontSize: 15, fontWeight: 700 }}>{item.title}</h3>
                <span style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2, display: 'block' }}>{item.date}</span>
              </div>
              <span style={{ fontSize: 16, fontWeight: 700, color: '#2ecc71' }}>{item.price}</span>
            </div>
            <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.5 }}>{item.description?.substring(0, 120)}...</p>
            <div style={{ marginTop: 8 }}>
              {item.tags?.slice(0, 3).map((t, j) => <span key={j} className="tag">{t}</span>)}
            </div>
          </div>
        ))
      )}
    </div>
  )
}
