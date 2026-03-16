import { useState } from 'react'
import dynamic from 'next/dynamic'
const ProductPage = dynamic(() => import('./ProductPage'), { ssr: false })

export default function ProductGenerator() {
  const [url, setUrl] = useState('')
  const [productName, setProductName] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [pushing, setPushing] = useState(false)
  const [pushed, setPushed] = useState(false)
  const [showPage, setShowPage] = useState(false)
  const [translating, setTranslating] = useState(false)
  const [translatedResult, setTranslatedResult] = useState(null)
  const [selectedLang, setSelectedLang] = useState('')

  const generate = async () => {
    if (!url.trim() && !productName.trim()) return
    setLoading(true)
    setResult(null)
    setTranslatedResult(null)
    setError(null)
    try {
      const res = await fetch('/api/generate-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, productName }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Erreur inconnue')
      setResult(data)
      try {
        const history = JSON.parse(localStorage.getItem('shopbuilder_history') || '[]')
        history.unshift({ ...data, date: new Date().toLocaleDateString('fr-FR') })
        localStorage.setItem('shopbuilder_history', JSON.stringify(history.slice(0, 50)))
      } catch (e) {}
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const translate = async (lang) => {
    if (!result) return
    setTranslating(true)
    setSelectedLang(lang)
    try {
      const res = await fetch('/api/translate-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product: result, language: lang }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setTranslatedResult(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setTranslating(false)
    }
  }

  const pushToShopify = async () => {
    if (!result) return
    setPushing(true)
    try {
      const res = await fetch('/api/push-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product: translatedResult || result }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Erreur Shopify')
      setPushed(true)
    } catch (e) {
      setError(e.message)
    } finally {
      setPushing(false)
    }
  }

  const displayResult = translatedResult || result

  const languages = [
    { code: 'en', flag: '🇬🇧', label: 'Anglais' },
    { code: 'es', flag: '🇪🇸', label: 'Espagnol' },
    { code: 'de', flag: '🇩🇪', label: 'Allemand' },
    { code: 'it', flag: '🇮🇹', label: 'Italien' },
    { code: 'pt', flag: '🇵🇹', label: 'Portugais' },
    { code: 'ar', flag: '🇸🇦', label: 'Arabe' },
  ]

  return (
    <div>
      {showPage && <ProductPage product={displayResult} onClose={() => setShowPage(false)} />}

      <div className="card">
        <p className="card-title">Étape 1 — Décris ton produit</p>
        <div className="input-group">
          <label className="input-label">Nom du produit</label>
          <input className="input" type="text" placeholder="ex: Montre connectée sport étanche GPS..." value={productName} onChange={e => setProductName(e.target.value)} />
        </div>
        <div className="input-group">
          <label className="input-label">URL du produit (optionnel)</label>
          <input className="input" type="text" placeholder="https://www.aliexpress.com/item/..." value={url} onChange={e => setUrl(e.target.value)} onKeyDown={e => e.key === 'Enter' && generate()} />
        </div>
        <button className="btn btn-primary" onClick={generate} disabled={loading || (!url && !productName)}>
          {loading ? '⏳ Génération en cours...' : '⚡ Générer la fiche produit'}
        </button>
      </div>

      {loading && <div className="loading"><div className="spinner" />L'IA génère ta fiche produit...</div>}
      {error && <div className="error-banner">❌ {error}</div>}

      {result && (
        <>
          <div className="card">
            <p className="card-title">Résultat généré par l'IA</p>
            <div className="grid-2" style={{ marginBottom: 16 }}>
              <div>
                <label className="input-label">Titre produit</label>
                <div className="result-field">{displayResult.title}</div>
              </div>
              <div>
                <label className="input-label">Prix suggéré</label>
                <div className="result-field">{displayResult.price}</div>
              </div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label className="input-label">Description optimisée</label>
              <div className="result-box">{displayResult.description}</div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label className="input-label">Points clés</label>
              <div className="result-box">{Array.isArray(displayResult.bullets) ? displayResult.bullets.join('\n') : displayResult.bullets}</div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label className="input-label">Tags SEO</label>
              <div>{displayResult.tags?.map((tag, i) => <span key={i} className="tag">{tag}</span>)}</div>
            </div>
            <div style={{ marginBottom: 20 }}>
              <label className="input-label">Script publicitaire TikTok/Reels</label>
              <div className="result-box">{displayResult.adScript}</div>
            </div>

            <div className="translate-section">
              <label className="input-label">🌍 Traduire cette fiche en :</label>
              <div className="lang-buttons">
                <button className={`lang-btn ${!translatedResult ? 'active' : ''}`} onClick={() => setTranslatedResult(null)}>🇫🇷 Français</button>
                {languages.map(lang => (
                  <button key={lang.code} className={`lang-btn ${selectedLang === lang.code && translatedResult ? 'active' : ''}`} onClick={() => translate(lang.code)} disabled={translating}>
                    {translating && selectedLang === lang.code ? '⏳' : lang.flag} {lang.label}
                  </button>
                ))}
              </div>
              {translatedResult && <div className="translation-badge">✅ Traduit en {languages.find(l => l.code === selectedLang)?.label}</div>}
            </div>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 16 }}>
              <button className="btn btn-primary" onClick={() => setShowPage(true)}>👁 Voir la page produit</button>
              <button className="btn btn-secondary" onClick={pushToShopify} disabled={pushing || pushed}>
                {pushing ? '⏳ Envoi...' : pushed ? '✅ Envoyé !' : '🏪 Envoyer sur Shopify'}
              </button>
            </div>
          </div>
          {pushed && <div className="success-banner">✅ Produit ajouté à ton shop Shopify !</div>}
        </>
      )}

      <style jsx>{`
        .result-field { background: var(--surface2); border: 1px solid var(--border); border-radius: 10px; padding: 12px 16px; font-size: 14px; color: var(--text); }
        .translate-section { border-top: 1px solid var(--border); padding-top: 16px; }
        .lang-buttons { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px; }
        .lang-btn { padding: 7px 14px; border-radius: 20px; border: 1px solid var(--border); background: var(--surface2); color: var(--muted); cursor: pointer; font-size: 13px; font-weight: 500; transition: all 0.2s; }
        .lang-btn:hover { border-color: var(--accent); color: var(--text); }
        .lang-btn.active { border-color: var(--accent); background: #7c5cfc20; color: #a084fd; }
        .lang-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .translation-badge { margin-top: 10px; font-size: 13px; color: var(--success); }
      `}</style>
    </div>
  )
}
