import { useState, useEffect } from 'react'

export default function Dashboard() {
  const [stats, setStats] = useState({ fiches: 0, pushes: 0, themes: 0, emails: 0 })
  const [recentItems, setRecentItems] = useState([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    try {
      const history = JSON.parse(localStorage.getItem('shopbuilder_history') || '[]')
      setStats({
        fiches: history.length,
        pushes: parseInt(localStorage.getItem('shopbuilder_pushes') || '0'),
        themes: parseInt(localStorage.getItem('shopbuilder_themes') || '0'),
        emails: parseInt(localStorage.getItem('shopbuilder_emails') || '0'),
      })
      setRecentItems(history.slice(0, 5))
    } catch (e) {}
  }, [])

  if (!mounted) return null

  const stats_data = [
    { label: 'Fiches générées', value: stats.fiches, icon: '⚡', color: '#8b5cf6', glow: 'rgba(139,92,246,0.3)' },
    { label: 'Produits Shopify', value: stats.pushes, icon: '🏪', color: '#10b981', glow: 'rgba(16,185,129,0.3)' },
    { label: 'Thèmes créés', value: stats.themes, icon: '🎨', color: '#3b82f6', glow: 'rgba(59,130,246,0.3)' },
    { label: 'Emails créés', value: stats.emails, icon: '📧', color: '#f59e0b', glow: 'rgba(245,158,11,0.3)' },
  ]

  const actions = [
    { icon: '⚡', label: 'Générer fiche', desc: 'Fiche produit IA', color: '#8b5cf6' },
    { icon: '🔥', label: 'Score viral', desc: 'Analyser potentiel', color: '#ef4444' },
    { icon: '🎨', label: 'Créer thème', desc: 'Thème Shopify', color: '#3b82f6' },
    { icon: '🎬', label: 'Créer pub', desc: 'Visuel ou vidéo', color: '#f59e0b' },
    { icon: '🤖', label: 'Conseiller', desc: 'Pose tes questions', color: '#10b981' },
    { icon: '🔍', label: 'Concurrents', desc: 'Trouver les shops', color: '#ec4899' },
  ]

  return (
    <div>
      {/* Hero */}
      <div style={{ marginBottom: 32, animation: 'slideUp 0.4s ease' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 8 }}>
          <div style={{ width: 48, height: 48, background: 'linear-gradient(135deg, #8b5cf6, #ec4899)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, boxShadow: '0 0 30px rgba(139,92,246,0.4)' }}>◈</div>
          <div>
            <h1 style={{ fontFamily: 'Outfit', fontSize: 24, fontWeight: 800, letterSpacing: '-0.5px', lineHeight: 1.2 }}>Bienvenue sur ShopBuilder</h1>
            <p style={{ color: 'var(--c-text3)', fontSize: 13, marginTop: 2 }}>Ton outil dropshipping IA — Que veux-tu faire ?</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 28 }}>
        {stats_data.map((s, i) => (
          <div key={i} className="card" style={{ padding: 18, margin: 0, animation: `slideUp ${0.1 * i + 0.2}s ease` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div style={{ width: 38, height: 38, background: `${s.color}15`, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, border: `1px solid ${s.color}25` }}>
                {s.icon}
              </div>
              <span style={{ fontSize: 11, color: 'var(--c-text3)', fontWeight: 500 }}>Total</span>
            </div>
            <div style={{ fontFamily: 'Outfit', fontSize: 34, fontWeight: 900, color: s.color, lineHeight: 1, marginBottom: 4, textShadow: `0 0 20px ${s.glow}` }}>
              {s.value}
            </div>
            <div style={{ fontSize: 11.5, color: 'var(--c-text3)', fontWeight: 500 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <h2 style={{ fontSize: 13, fontWeight: 700, color: 'var(--c-text2)', textTransform: 'uppercase', letterSpacing: 1 }}>Actions rapides</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
          {actions.map((a, i) => (
            <div key={i} className="card" style={{ padding: 16, margin: 0, cursor: 'pointer', animation: `slideUp ${0.1 * i + 0.3}s ease`, transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = a.color + '30'; e.currentTarget.style.transform = 'translateY(-2px)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = ''; e.currentTarget.style.transform = '' }}
            >
              <div style={{ width: 36, height: 36, background: `${a.color}12`, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, marginBottom: 10, border: `1px solid ${a.color}20` }}>
                {a.icon}
              </div>
              <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 3 }}>{a.label}</div>
              <div style={{ fontSize: 11.5, color: 'var(--c-text3)' }}>{a.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent */}
      {recentItems.length > 0 && (
        <div>
          <h2 style={{ fontSize: 13, fontWeight: 700, color: 'var(--c-text2)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 14 }}>Fiches récentes</h2>
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            {recentItems.map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '13px 18px', borderBottom: i < recentItems.length - 1 ? '1px solid var(--c-border)' : 'none', transition: 'background 0.15s', cursor: 'default' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <div style={{ width: 34, height: 34, background: 'rgba(139,92,246,0.1)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, border: '1px solid rgba(139,92,246,0.15)', flexShrink: 0 }}>⚡</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title || 'Produit sans titre'}</div>
                  <div style={{ fontSize: 11, color: 'var(--c-text3)', marginTop: 1 }}>{item.date || 'Récemment'}</div>
                </div>
                <div style={{ fontWeight: 800, fontSize: 14, color: '#10b981', flexShrink: 0 }}>{item.price || '—'}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {recentItems.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: '52px 24px' }}>
          <div style={{ fontSize: 52, marginBottom: 16 }}>🚀</div>
          <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 8 }}>Prêt à lancer ?</div>
          <div style={{ color: 'var(--c-text3)', fontSize: 14, maxWidth: 380, margin: '0 auto', lineHeight: 1.6 }}>
            Commence par générer ta première fiche produit ou explore les tendances du moment.
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 768px) {
          div[style*="repeat(4"] { grid-template-columns: 1fr 1fr !important; }
          div[style*="repeat(3"] { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </div>
  )
}
