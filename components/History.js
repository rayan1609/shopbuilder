import { useState, useEffect } from 'react'

export default function History() {
  const [history, setHistory] = useState([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    try {
      const saved = localStorage.getItem('shopbuilder_history')
      if (saved) setHistory(JSON.parse(saved))
    } catch (e) {}
  }, [])

  const clear = () => {
    localStorage.removeItem('shopbuilder_history')
    setHistory([])
  }

  if (!mounted) return null

  if (history.length === 0) {
    return (
      <div className="card">
        <p className="card-title">Historique</p>
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--muted)' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📋</div>
          <p>Aucune fiche générée pour l'instant.</p>
          <p style={{ fontSize: 12, marginTop: 4 }}>Tes fiches produits apparaîtront ici automatiquement.</p>
        </div>
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
        <di
