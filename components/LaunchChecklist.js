import { useState } from 'react'

export default function LaunchChecklist() {
  const [form, setForm] = useState({ shopName: '', productName: '', hasLegal: false, hasProduct: false, hasBudget: false, hasTheme: false })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [checkedItems, setCheckedItems] = useState({})

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const generate = async () => {
    setLoading(true)
    setResult(null)
    setError(null)
    try {
      const res = await fetch('/api/launch-checklist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setResult(data)
      setCheckedItems({})
    } catch (e) {
      setError(String(e.message))
    } finally {
      setLoading(false)
    }
  }

  const toggleItem = (catIdx, itemIdx) => {
    const key = `${catIdx}-${itemIdx}`
    setCheckedItems(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const priorityColor = (p) => {
    if (p === 'critique') return '#e74c3c'
    if (p === 'haute') return '#f39c12'
    if (p === 'moyenne') return '#3498db'
    return '#888'
  }

  const totalItems = result?.categories?.reduce((acc, cat) => acc + cat.items.length, 0) || 0
  const checkedCount = Object.values(checkedItems).filter(Boolean).length
  const progress = totalItems > 0 ? Math.round((checkedCount / totalItems) * 100) : 0

  return (
    <div>
      <div className="card">
        <p className="card-title">🚀 Checklist de lancement</p>
        <div className="grid-2">
          <div className="input-group">
            <label className="input-label">Nom de ta boutique</label>
            <input className="input" placeholder="ex: TechWear Store" value={form.shopName} onChange={e => update('shopName', e.target.value)} />
          </div>
          <div className="input-group">
            <label className="input-label">Produit principal</label>
            <input className="input" placeholder="ex: Montre GPS sport" value={form.productName} onChange={e => update('productName', e.target.value)} />
          </div>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
          {[
            { key: 'hasLegal', label: '⚖️ Documents légaux faits' },
            { key: 'hasProduct', label: '📦 Produit configuré' },
            { key: 'hasBudget', label: '💰 Budget pub disponible' },
            { key: 'hasTheme', label: '🎨 Thème installé' },
          ].map(item => (
            <label key={item.key} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 14, color: 'var(--text)' }}>
              <input type="checkbox" checked={form[item.key]} onChange={e => update(item.key, e.target.checked)} style={{ width: 16, height: 16, accentColor: 'var(--accent)' }} />
              {item.label}
            </label>
          ))}
        </div>
        <button className="btn btn-primary" onClick={generate} disabled={loading || !form.shopName}>
          {loading ? '⏳ Génération...' : '🚀 Générer ma checklist'}
        </button>
      </div>

      {loading && <div className="loading"><div className="spinner" />Génération de ta checklist personnalisée...</div>}
      {error && <div className="error-banner">❌ {error}</div>}

      {result && (
        <div>
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 28, fontWeight: 900, fontFamily: 'Syne', color: result.score >= 70 ? '#2ecc71' : result.score >= 40 ? '#f39c12' : '#e74c3c' }}>{result.score}%</div>
                <div style={{ fontSize: 13, color: 'var(--muted)' }}>Score de préparation</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: progress >= 80 ? '#2ecc71' : 'var(--text)' }}>{checkedCount}/{totalItems} tâches</div>
                <div style={{ fontSize: 13, color: 'var(--muted)' }}>complétées par toi</div>
              </div>
            </div>
            <div style={{ height: 8, background: 'var(--surface2)', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${progress}%`, background: 'linear-gradient(135deg, var(--accent), var(--accent2))', borderRadius: 4, transition: 'width 0.3s' }} />
            </div>
          </div>

          {result.categories?.map((cat, catIdx) => (
            <div key={catIdx} className="card">
              <p className="card-title">{cat.name}</p>
              {cat.items?.map((item, itemIdx) => {
                const key = `${catIdx}-${itemIdx}`
                const checked = checkedItems[key] || false
                return (
                  <div key={itemIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                    <input type="checkbox" checked={checked} onChange={() => toggleItem(catIdx, itemIdx)} style={{ marginTop: 2, width: 16, height: 16, accentColor: 'var(--accent)', flexShrink: 0, cursor: 'pointer' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <span style={{ fontSize: 14, fontWeight: 600, textDecoration: checked ? 'line-through' : 'none', color: checked ? 'var(--muted)' : 'var(--text)' }}>{String(item.task || '')}</span>
                        <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 10, background: priorityColor(item.priority) + '20', color: priorityColor(item.priority), textTransform: 'uppercase' }}>{String(item.priority || '')}</span>
                      </div>
                      {item.tip && <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.5 }}>💡 {String(item.tip)}</div>}
                    </div>
                  </div>
                )
              })}
            </div>
          ))}

          {result.launchAdvice && (
            <div className="card">
              <p className="card-title">🎯 Conseil de lancement personnalisé</p>
              <div className="result-box">{result.launchAdvice}</div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
