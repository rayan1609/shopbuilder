import { useState, useEffect } from 'react'

export default function Dashboard() {
  const [stats, setStats] = useState({
    fichesGenerees: 0,
    produitsPushes: 0,
    traductionsFaites: 0,
    emailsGeneres: 0,
  })

  useEffect(() => {
    try {
      const history = JSON.parse(localStorage.getItem('shopbuilder_history') || '[]')
      const pushes = JSON.parse(localStorage.getItem('shopbuilder_pushes') || '0')
      const traductions = JSON.parse(localStorage.getItem('shopbuilder_traductions') || '0')
      const emails = JSON.parse(localStorage.getItem('shopbuilder_emails') || '0')
      setStats({
        fichesGenerees: history.length,
        produitsPushes: pushes,
        traductionsFaites: traductions,
        emailsGeneres: emails,
      })
    } catch (e) {}
  }, [])

  const cards = [
    { label: 'Fiches générées', value: stats.fichesGenerees, icon: '⚡', color: '#7c5cfc' },
    { label: 'Produits sur Shopify', value: stats.produitsPushes, icon: '🏪', color: '#2ecc71' },
    { label: 'Traductions faites', value: stats.traductionsFaites, icon: '🌍', color: '#3498db' },
    { label: 'Emails générés', value: stats.emailsGeneres, icon: '📧', color: '#e67e22' },
  ]

  return (
    <div>
      <div className="grid-2" style={{ marginBottom: 24 }}>
        {cards.map((c, i) => (
          <div key={i} className="card" style={{ borderColor: c.color + '30' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <p style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>{c.label}</p>
                <p style={{ fontSize: 36, fontWeight: 800, fontFamily: 'Syne', color: c.color }}>{c.value}</p>
              </div>
              <span style={{ fontSize: 28 }}>{c.icon}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <p className="card-title">🚀 Prochaines étapes suggérées</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[
            { icon: '🔥', text: 'Trouve un produit viral dans les tendances', action: 'Tendances' },
            { icon: '⚡', text: 'Génère une fiche produit optimisée', action: 'Générateur' },
            { icon: '📧', text: 'Crée tes emails marketing', action: 'Emails' },
            { icon: '🕵️', text: 'Spy tes concurrents', action: 'Spy' },
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: 'var(--surface2)', borderRadius: 10, border: '1px solid var(--border)' }}>
              <span style={{ fontSize: 20 }}>{item.icon}</span>
              <span style={{ flex: 1, fontSize: 14, color: 'var(--text)' }}>{item.text}</span>
              <span style={{ fontSize: 12, color: '#a084fd', fontWeight: 600 }}>{item.action} →</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
