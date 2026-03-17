import { useState, useEffect } from 'react'

export default function Dashboard() {
  const [stats, setStats] = useState({ fiches: 0, pushes: 0, traductions: 0, emails: 0 })
  const [mounted, setMounted] = useState(false)
  const [recentItems, setRecentItems] = useState([])

  useEffect(() => {
    setMounted(true)
    try {
      const history = JSON.parse(localStorage.getItem('shopbuilder_history') || '[]')
      setStats({
        fiches: history.length,
        pushes: parseInt(localStorage.getItem('shopbuilder_pushes') || '0'),
        traductions: parseInt(localStorage.getItem('shopbuilder_traductions') || '0'),
        emails: parseInt(localStorage.getItem('shopbuilder_emails') || '0'),
      })
      setRecentItems(history.slice(0, 4))
    } catch (e) {}
  }, [])

  const statCards = [
    { label: 'Fiches générées', value: stats.fiches, icon: '⚡', color: '#7c5cfc', bg: 'rgba(124,92,252,0.1)' },
    { label: 'Produits Shopify', value: stats.pushes, icon: '🏪', color: '#22c55e', bg: 'rgba(34,197,94,0.1)' },
    { label: 'Traductions', value: stats.traductions, icon: '🌍', color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' },
    { label: 'Emails créés', value: stats.emails, icon: '📧', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
  ]

  const quickActions = [
    { id: 'generator', icon: '⚡', label: 'Générer une fiche', desc: 'Crée une fiche produit optimisée', color: '#7c5cfc' },
    { id: 'viral', icon: '🔥', label: 'Score viral', desc: 'Analyse le potentiel d\'un produit', color: '#ef4444' },
    { id: 'theme', icon: '🎨', label: 'Créer un thème', desc: 'Génère un thème Shopify complet', color: '#8b5cf6' },
    { id: 'advisual', icon: '🎬', label: 'Créer une pub', desc: 'Visuel ou script vidéo IA', color: '#f59e0b' },
    { id: 'chat', icon: '🤖', label: 'Conseiller IA', desc: 'Pose tes questions dropshipping', color: '#22c55e' },
    { id: 'legal', icon: '⚖️', label: 'Documents légaux', desc: 'CGV, mentions légales auto', color: '#6366f1' },
  ]

  if (!mounted) return null

  return (
    <div>
      {/* Welcome */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: 'Syne', fontSize: 26, fontWeight: 800, marginBottom: 6 }}>
          Bienvenue sur ShopBuilder 👋
        </h1>
        <p style={{ color: 'var(--text2)', fontSize: 14 }}>
          Ton outil dropshipping IA tout-en-un. Que veux-tu faire aujourd'hui ?
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 28 }}>
        {statCards.map((s, i) => (
          <div key={i} className="card" style={{ padding: 18, margin: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <p style={{ fontSize: 11, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>{s.label}</p>
                <p style={{ fontFamily: 'Syne', fontSize: 32, fontWeight: 900, color: s.color, lineHeight: 1 }}>{s.value}</p>
              </div>
              <div style={{ width: 40, height: 40, background: s.bg, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
                {s.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontFamily: 'Syne', fontSize: 15, fontWeight: 700, marginBottom: 14, color: 'var(--text2)' }}>
          Actions rapides
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {quickActions.map((a, i) => (
            <div key={i} className="card" style={{ padding: 16, margin: 0, cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = a.color + '40'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                <div style={{ width: 34, height: 34, background: a.color + '15', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>{a.icon}</div>
                <span style={{ fontWeight: 600, fontSize: 13 }}>{a.label}</span>
              </div>
              <p style={{ fontSize: 12, color: 'var(--text3)', lineHeight: 1.5 }}>{a.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent */}
      {recentItems.length > 0 && (
        <div>
          <h2 style={{ fontFamily: 'Syne', fontSize: 15, fontWeight: 700, marginBottom: 14, color: 'var(--text2)' }}>
            Fiches récentes
          </h2>
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            {recentItems.map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', borderBottom: i < recentItems.length - 1 ? '1px solid var(--border)' : 'none' }}>
                <div style={{ width: 36, height: 36, background: 'var(--accent-glow)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>⚡</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontWeight: 600, fontSize: 13, marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title || 'Produit sans titre'}</p>
                  <p style={{ fontSize: 11, color: 'var(--text3)' }}>{item.date}</p>
                </div>
                <span style={{ fontWeight: 700, fontSize: 14, color: '#22c55e', flexShrink: 0 }}>{item.price || ''}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {recentItems.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: '48px 24px' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🚀</div>
          <h3 style={{ fontFamily: 'Syne', fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Prêt à lancer ton shop ?</h3>
          <p style={{ color: 'var(--text2)', fontSize: 14, maxWidth: 400, margin: '0 auto' }}>
            Commence par générer ta première fiche produit ou explore les tendances du moment.
          </p>
        </div>
      )}

      <style jsx>{`
        @media (max-width: 768px) {
          .stats-grid { grid-template-columns: 1fr 1fr !important; }
          .actions-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </div>
  )
}
