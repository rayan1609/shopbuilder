import { useState } from 'react'

export default function ProductGenerator() {
  const [url, setUrl] = useState('')
  const [productName, setProductName] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [pushing, setPushing] = useState(false)
  const [pushed, setPushed] = useState(false)

  const generate = async () => {
    if (!url.trim() && !productName.trim()) return
    setLoading(true)
    setResult(null)
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
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const pushToShopify = async () => {
    if (!result) return
    setPushing(true)
    try {
      const res = await fetch('/api/push-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product: result }),
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

  return (
    <div>
      <div className="card">
        <p className="card-title">Étape 1 — Décris ton produit</p>
        <div className="input-group">
          <label className="input-label">Nom du produit</label>
          <input
            className="input"
            type="text"
            placeholder="ex: Montre connectée sport étanche GPS..."
            value={productName}
            onChange={e => setProductName(e.target.value)}
          />
        </div>
        <div className="input-group">
          <label className="input-label">URL du produit (optionnel)</label>
          <input
            className="input"
            type="text"
            placeholder="https://www.aliexpress.com/item/..."
            value={url}
            onChange={e => setUrl(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && generate()}
          />
        </div>
        <button className="btn btn-primary" onClick={generate} disabled={loading || (!url && !productName)}>
          {loading ? '⏳ Génération en cours...' : '⚡ Générer la fiche produit'}
        </button>
      </div>

      {loading && (
        <div className="loading">
          <div className="spinner" />
          L'IA génère ta fiche produit...
        </div>
      )}

      {error && <div className="error-banner">❌ {error}</div>}

      {result && (
        <>
          <div className="card">
            <p className="card-title">Résultat généré par l'IA</p>
            <div className="grid-2" style={{ marginBottom: 16 }}>
              <div>
                <label className="input-label">Titre produit</label>
                <div className="result-field">{result.title}</div>
              </div>
              <div>
                <label className="input-label">Prix suggéré</label>
                <div className="result-field">{result.price}</div>
              </div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label className="input-label">Description optimisée</label>
              <div className="result-box">{result.description}</div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label className="input-label">Points clés</label>
              <div className="result-box">{result.bullets}</div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label className="input-label">Tags SEO</label>
              <div>
                {result.tags?.map((tag, i) => (
                  <span key={i} className="tag">{tag}</span>
                ))}
              </div>
            </div>
            <div style={{ marginBottom: 20 }}>
              <label className="input-label">Script publicitaire TikTok/Reels</label>
              <div className="result-box">{result.adScript}</div>
            </div>
            <button className="btn btn-primary" onClick={pushToShopify} disabled={pushing || pushed}>
              {pushing ? '⏳ Envoi vers Shopify...' : pushed ? '✅ Envoyé !' : '🏪 Envoyer vers Shopify'}
            </button>
          </div>
          {pushed && <div className="success-banner">✅ Produit ajouté à ton shop Shopify !</div>}
        </>
      )}

      <style jsx>{`
        .result-field {
          background: var(--surface2);
          border: 1px solid var(--border);
          border-radius: 10px;
          padding: 12px 16px;
          font-size: 14px;
          color: var(--text);
        }
      `}</style>
    </div>
  )
}
