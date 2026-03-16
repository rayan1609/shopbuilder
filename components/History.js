import { useState, useEffect } from 'react'

export default function History() {
  const [history, setHistory] = useState([])

  useEffect(() => {
    const saved = localStorage.getItem('shopbuilder_history')
    if (saved) setHistory(JSON.parse(saved))
  }, [])

  const clear = () => {
    localStorage.removeItem('shopbuilder_history')
    setHistory([])
  }

  if (history.length === 0) {
    return (
      <div className="card">
        <p className="card-title">Historique</p>
        <div className="empty">
          <span>📋</span>
          <p>Aucune fiche générée pour l'instant.</p>
          <p style={{ fontSize: 12, marginTop: 4 }}>Tes fiches produits apparaîtront ici automatiquement.</p>
        </div>
        <style jsx>{`
          .empty { text-align: center; padding: 40px; color: var(--muted); }
          .empty span { font-size: 40px; display: block; margin-bottom: 12px; }
        `}</style>
      </div>
    )
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <span style={{ color: 'var(--muted)', fontSize: 14 }}>{history.length} fiche(s) sauvegardée(s)</span>
        <button className="btn btn-secondary" onClick={clear} style={{ padding: '8px 14px', fontSize: 13 }}>🗑 Effacer tout</button>
      </div>
      {history.map((item, i) => (
        <div key={i} className="card history-card">
          <div className="history-header">
            <div>
              <h3 className="history-title">{item.title}</h3>
              <span className="history-date">{item.date}</span>
            </div>
            <span className="history-price">{item.price}</span>
          </div>
          <p className="history-desc">{item.description?.substring(0, 120)}...</p>
          <div style={{ marginTop: 8 }}>
            {item.tags?.slice(0, 3).map((t, j) => <span key={j} className="tag">{t}</span>)}
          </div>
        </div>
      ))}

      <style jsx>{`
        .history-card { cursor: pointer; transition: border 0.2s; }
        .history-card:hover { border-color: #7c5cfc40; }
        .history-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px; }
        .history-title { font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 700; }
        .history-date { font-size: 12px; color: var(--muted); margin-top: 2px; display: block; }
        .history-price { font-size: 16px; font-weight: 700; color: #2ecc71; }
        .history-desc { font-size: 13px; color: var(--muted); line-height: 1.5; }
      `}</style>
    </div>
  )
}
