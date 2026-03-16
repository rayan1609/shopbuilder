import { useState } from 'react'

export default function ImageImporter() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [selectedImages, setSelectedImages] = useState([])
  const [pushing, setPushing] = useState(false)
  const [pushed, setPushed] = useState(false)
  const [productTitle, setProductTitle] = useState('')

  const scrape = async () => {
    setLoading(true)
    setResult(null)
    setError(null)
    setSelectedImages([])
    setPushed(false)
    try {
      const res = await fetch('/api/scrape-images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setResult(data)
      if (data.title) setProductTitle(data.title)
    } catch (e) {
      setError(String(e.message))
    } finally {
      setLoading(false)
    }
  }

  const toggleImage = (imgUrl) => {
    setSelectedImages(prev =>
      prev.includes(imgUrl) ? prev.filter(u => u !== imgUrl) : [...prev, imgUrl]
    )
  }

  const pushToShopify = async () => {
    if (selectedImages.length === 0) return
    setPushing(true)
    try {
      const res = await fetch('/api/push-images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ images: selectedImages, productTitle }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setPushed(true)
    } catch (e) {
      setError(String(e.message))
    } finally {
      setPushing(false)
    }
  }

  return (
    <div>
      <div className="card">
        <p className="card-title">🖼️ Import photos AliExpress</p>
        <div className="input-group">
          <label className="input-label">URL du produit AliExpress</label>
          <input
            className="input"
            placeholder="https://www.aliexpress.com/item/..."
            value={url}
            onChange={e => setUrl(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && scrape()}
          />
        </div>
        <button className="btn btn-primary" onClick={scrape} disabled={loading || !url}>
          {loading ? '⏳ Récupération...' : '🖼️ Récupérer les photos'}
        </button>
      </div>

      {loading && <div className="loading"><div className="spinner" />Récupération des images AliExpress...</div>}
      {error && <div className="error-banner">❌ {error}</div>}

      {result && (
        <div className="card">
          {result.title && (
            <div style={{ marginBottom: 16 }}>
              <label className="input-label">Titre du produit détecté</label>
              <input className="input" value={productTitle} onChange={e => setProductTitle(e.target.value)} />
            </div>
          )}

          {result.images?.length > 0 ? (
            <>
              <p className="card-title">{result.images.length} images trouvées — clique pour sélectionner</p>
              <div className="images-grid">
                {result.images.map((img, i) => (
                  <div
                    key={i}
                    className={`image-item ${selectedImages.includes(img) ? 'selected' : ''}`}
                    onClick={() => toggleImage(img)}
                  >
                    <img src={img} alt={`Photo ${i + 1}`} onError={e => e.target.style.display = 'none'} />
                    {selectedImages.includes(img) && <div className="image-check">✓</div>}
                  </div>
                ))}
              </div>

              {selectedImages.length > 0 && (
                <div style={{ marginTop: 16, display: 'flex', gap: 10, alignItems: 'center' }}>
                  <button className="btn btn-primary" onClick={pushToShopify} disabled={pushing || pushed}>
                    {pushing ? '⏳ Envoi...' : pushed ? '✅ Envoyé !' : `🏪 Push ${selectedImages.length} photo(s) sur Shopify`}
                  </button>
                  <button className="btn btn-secondary" onClick={() => setSelectedImages(result.images)}>
                    Tout sélectionner
                  </button>
                </div>
              )}

              {pushed && <div className="success-banner">✅ Photos ajoutées à ton produit Shopify !</div>}
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: 20, color: 'var(--muted)' }}>
              <p style={{ marginBottom: 12 }}>😕 {result.message || 'Aucune image trouvée.'}</p>
              <p style={{ fontSize: 13 }}>AliExpress bloque parfois le scraping automatique. Tu peux copier manuellement les URLs des images ci-dessous :</p>
              <div style={{ marginTop: 12 }}>
                <textarea
                  className="input"
                  placeholder="Colle ici les URLs des images (une par ligne)"
                  rows={4}
                  onChange={e => {
                    const urls = e.target.value.split('\n').filter(u => u.trim().startsWith('http'))
                    setResult(prev => ({ ...prev, images: urls }))
                  }}
                />
              </div>
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        .images-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
        .image-item { position: relative; aspect-ratio: 1; border-radius: 10px; overflow: hidden; cursor: pointer; border: 2px solid var(--border); transition: all 0.2s; }
        .image-item:hover { border-color: var(--accent); }
        .image-item.selected { border-color: var(--accent); box-shadow: 0 0 0 2px var(--accent); }
        .image-item img { width: 100%; height: 100%; object-fit: cover; }
        .image-check { position: absolute; top: 6px; right: 6px; width: 24px; height: 24px; background: var(--accent); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 700; }
        @media (max-width: 768px) { .images-grid { grid-template-columns: repeat(3, 1fr); } }
      `}</style>
    </div>
  )
}
