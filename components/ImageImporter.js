import { useState } from 'react'

export default function ImageImporter() {
  const [mode, setMode] = useState('upload')
  const [urlInput, setUrlInput] = useState('')
  const [images, setImages] = useState([])
  const [selectedImages, setSelectedImages] = useState([])
  const [pushing, setPushing] = useState(false)
  const [pushed, setPushed] = useState(false)
  const [error, setError] = useState(null)
  const [productTitle, setProductTitle] = useState('')

  const addUrls = () => {
    const raw = urlInput.trim().replace(/\s+/g, '\n')
    const urls = raw.split('\n').map(u => u.trim()).filter(u => u.startsWith('http'))
    if (urls.length === 0) return
    setImages(prev => {
      const newUrls = urls.filter(u => !prev.includes(u))
      return [...prev, ...newUrls]
    })
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

  const selectAll = () => setSelectedImages([...images])
  const clearAll = () => { setImages([]); setSelectedImages([]) }

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
            { id: 'upload', label: '📁 Depuis mon Mac' },
            { id: 'url', label: '🔗 URLs images' },
          ].map(m => (
            <button key={m.id} onClick={() => setMode(m.id)} style={{
              padding: '8px 16px', borderRadius: 20,
              border: `1px solid ${mode === m.id ? 'var(--accent)' : 'var(--border)'}`,
              background: mode === m.id ? '#7c5cfc20' : 'var(--surface2)',
              color: mode === m.id ? '#a084fd' : 'var(--muted)',
              cursor: 'pointer', fontSize: 13, fontWeight: 500
            }}>
              {m.label}
            </button>
          ))}
        </div>

        {mode === 'upload' && (
          <label style={{
            display: 'block', background: 'var(--surface2)',
            border: '2px dashed var(--border)', borderRadius: 12,
            padding: 32, textAlign: 'center', cursor: 'pointer'
          }}>
            <input type="file" multiple accept="image/*" onChange={handleFileUpload} style={{ display: 'none' }} />
            <div style={{ fontSize: 40, marginBottom: 12 }}>📁</div>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>Clique pour sélectionner tes images</div>
            <div style={{ fontSize: 12, color: 'var(--muted)' }}>JPG, PNG, WEBP — plusieurs fichiers acceptés (Cmd+clic)</div>
          </label>
        )}

        {mode === 'url' && (
          <div>
            <div className="input-group">
              <label className="input-label">URLs des images (une par ligne)</label>
              <textarea
                className="input"
                placeholder={"https://ae01.alicdn.com/kf/image1.jpg\nhttps://ae01.alicdn.com/kf/image2.jpg"}
                rows={5}
                value={urlInput}
                onChange={e => setUrlInput(e.target.value)}
              />
              <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 6 }}>
                💡 Sur AliExpress : clic droit sur image → "Copier l'adresse de l'image"
              </p>
            </div>
            <button className="btn btn-primary" onClick={addUrls} disabled={!urlInput.trim()}>
              ➕ Ajouter {urlInput.trim().split(/\s+/).filter(u => u.startsWith('http')).length || ''} image(s)
            </button>
          </div>
        )}
      </div>

      {images.length > 0 && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <p className="card-title" style={{ margin: 0 }}>
              {images.length} image(s) — {selectedImages.length} sélectionnée(s)
            </p>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-secondary" onClick={selectAll} style={{ padding: '6px 12px', fontSize: 12 }}>Tout sélectionner</button>
              <button className="btn btn-secondary" onClick={clearAll} style={{ padding: '6px 12px', fontSize: 12, color: '#e74c3c' }}>🗑 Effacer</button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 16 }}>
            {images.map((img, i) => (
              <div
                key={i}
                onClick={() => toggleImage(img)}
                style={{
                  position: 'relative', aspectRatio: '1',
                  borderRadius: 10, overflow: 'hidden', cursor: 'pointer',
                  border: `2px solid ${selectedImages.includes(img) ? 'var(--accent)' : 'var(--border)'}`,
                  background: 'var(--surface2)',
                  boxShadow: selectedImages.includes(img) ? '0 0 0 2px var(--accent)' : 'none'
                }}
              >
                <img src={img} alt={`Photo ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.target.style.display = 'none' }} />
                {selectedImages.includes(img) && (
                  <div style={{
                    position: 'absolute', top: 6, right: 6, width: 24, height: 24,
                    background: 'var(--accent)', color: 'white', borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 14, fontWeight: 700
                  }}>✓</div>
                )}
              </div>
            ))}
          </div>

          {selectedImages.length > 0 && (
            <div>
              <div className="input-group">
                <label className="input-label">Nom du produit Shopify cible</label>
                <input className="input" placeholder="ex: Teddyy, Montre GPS..." value={productTitle} onChange={e => setProductTitle(e.target.value)} />
              </div>
              <button className="btn btn-primary" onClick={pushToShopify} disabled={pushing || pushed}>
                {pushing ? '⏳ Envoi en cours...' : pushed ? '✅ Photos envoyées !' : `🏪 Push ${selectedImages.length} photo(s) sur Shopify`}
              </button>
            </div>
          )}

          {error && <div className="error-banner" style={{ marginTop: 12 }}>❌ {error}</div>}
          {pushed && <div className="success-banner">✅ Photos ajoutées à ton produit Shopify !</div>}
        </div>
      )}
    </div>
  )
}
