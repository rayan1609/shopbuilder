import { useState } from 'react'

export default function ImageImporter() {
  const [mode, setMode] = useState('url')
  const [urlInput, setUrlInput] = useState('')
  const [images, setImages] = useState([])
  const [selectedImages, setSelectedImages] = useState([])
  const [pushing, setPushing] = useState(false)
  const [pushed, setPushed] = useState(false)
  const [error, setError] = useState(null)
  const [productTitle, setProductTitle] = useState('')

  const addUrls = () => {
    const urls = urlInput.split('\n').filter(u => u.trim().startsWith('http'))
    setImages(prev => [...prev, ...urls.filter(u => !prev.includes(u))])
    setUrlInput('')
  }

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files)
    files.forEach(file => {
      const reader = new FileReader()
      reader.onload = (ev) => {
        setImages(prev => [...prev, ev.target.result])
      }
      reader.readAsDataURL(file)
    })
  }

  const toggleImage = (img) => {
    setSelectedImages(prev =>
      prev.includes(img) ? prev.filter(u => u !== img) : [...prev, img]
    )
  }

  const pushToShopify = async () => {
    if (selectedImages.length === 0) return
    setPushing(true)
    setError(null)
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
        <p className="card-title">🖼️ Importer des photos produit</p>

        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          {[
            { id: 'url', label: '🔗 Coller des URLs' },
            { id: 'upload', label: '📁 Uploader depuis mon Mac' },
          ].map(m => (
            <button key={m.id} onClick={() => setMode(m.id)} style={{ padding: '8px 16px', borderRadius: 20, border: `1px solid ${mode === m.id ? 'var(--accent)' : 'var(--border)'}`, background: mode === m.id ? '#7c5cfc20' : 'var(--surface2)', color: mode === m.id ? '#a084fd' : 'var(--muted)', cursor: 'pointer', fontSize: 13, fontWeight: 500 }}>
              {m.label}
            </button>
          ))}
        </div>

        {mode === 'url' && (
          <div>
            <div className="input-group">
              <label className="input-label">Colle les URLs des images (une par ligne)</label>
              <textarea
                className="input"
                placeholder="https://ae01.alicdn.com/kf/image1.jpg&#10;https://ae01.alicdn.com/kf/image2.jpg&#10;..."
                rows={5}
                value={urlInput}
                onChange={e => setUrlInput(e.target.value)}
              />
              <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 6 }}>
                💡 Sur AliExpress : clic droit sur une image → "Copier l'adresse de l'image"
              </p>
            </div>
            <button className="btn btn-primary" onClick={addUrls} disabled={!urlInput.trim()}>
              ➕ Ajouter ces images
            </button>
          </div>
        )}

        {mode === 'upload' && (
          <div>
            <label style={{ display: 'block', background: 'var(--surface2)', border: '2px dashed var(--border)', borderRadius: 12, padding: 32, textAlign: 'center', cursor: 'pointer', transition: 'border 0.2s' }}>
              <input type="file" multiple accept="image/*" onChange={handleFileUpload} style={{ display: 'none' }} />
              <div style={{ fontSize: 40, marginBottom: 12 }}>📁</div>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>Clique ou glisse tes images ici</div>
              <div style={{ fontSize: 12, color: 'var(--muted)' }}>JPG, PNG, WEBP — plusieurs fichiers acceptés</div>
            </label>
          </div>
        )}
      </div>

      {images.length > 0 && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <p className="card-title" style={{ margin: 0 }}>{images.length} image(s) — clique pour sélectionner</p>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-secondary" onClick={() => setSelectedImages([...images])} style={{ padding: '6px 12px', fontSize: 12 }}>Tout sélectionner</button>
              <button className="btn btn-secondary" onClick={() => { setImages([]); setSelectedImages([]) }} style={{ padding: '6px 12px', fontSize: 12, color: '#e74c3c' }}>🗑 Effacer</button>
            </div>
          </div>

          <div className="images-grid">
            {images.map((img, i) => (
              <div key={i} className={`image-item ${selectedImages.includes(img) ? 'selected' : ''}`} onClick={() => toggleImage(img)}>
                <img src={img} alt={`Photo ${i + 1}`} onError={e => e.target.style.display = 'none'} />
                {selectedImages.includes(img) && <div className="image-check">✓</div>}
              </div>
            ))}
          </div>

          {selectedImages.length > 0 && (
            <div style={{ marginTop: 16 }}>
              <div className="input-group">
                <label className="input-label">Nom du produit Shopify (pour trouver le bon produit)</label>
                <input className="input" placeholder="ex: Teddyy, Montre GPS..." value={productTitle} onChange={e => setProductTitle(e.target.value)} />
              </div>
              <button className="btn btn-primary" onClick={pushToShopify} disabled={pushing || pushed}>
                {pushing ? '⏳ Envoi...' : pushed ? '✅ Envoyé !' : `🏪 Push ${selectedImages.length} photo(s) sur Shopify`}
              </button>
            </div>
          )}

          {error && <div className="error-banner" style={{ marginTop: 12 }}>❌ {error}</div>}
          {pushed && <div className="success-banner">✅ Photos ajoutées à ton produit Shopify !</div>}
        </div>
      )}

      <style jsx>{`
        .images-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
        .image-item { position: relative; aspect-ratio: 1; border-radius: 10px; overflow: hidden; cursor: pointer; border: 2px solid var(--border); transition: all 0.2s; background: var(--surface2); }
        .image-item:hover { border-color: var(--accent); }
        .image-item.selected { border-color: var(--accent); box-shadow: 0 0 0 2px var(--accent); }
        .image-item img { width: 100%; height: 100%; object-fit: cover; }
        .image-check { position: absolute; top: 6px; right: 6px; width: 24px; height: 24px; background: var(--accent); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 700; }
        @media (max-width: 768px) { .images-grid { grid-template-columns: repeat(3, 1fr); } }
      `}</style>
    </div>
  )
}
