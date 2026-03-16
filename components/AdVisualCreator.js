import { useState, useRef, useEffect } from 'react'

export default function AdVisualCreator() {
  const [mode, setMode] = useState('text')
  const [form, setForm] = useState({
    productName: '',
    headline: '',
    subtext: '',
    cta: 'Acheter maintenant',
    bgColor: '#7c5cfc',
    bgType: 'gradient',
    textColor: '#ffffff',
    style: 'modern',
  })
  const [uploadedImage, setUploadedImage] = useState(null)
  const [generating, setGenerating] = useState(false)
  const [generatedText, setGeneratedText] = useState(null)
  const canvasRef = useRef(null)
  const [canvasReady, setCanvasReady] = useState(false)

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const generateText = async () => {
    setGenerating(true)
    try {
      const res = await fetch('/api/generate-ad-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productName: form.productName }),
      })
      const data = await res.json()
      if (res.ok) {
        setGeneratedText(data)
        update('headline', data.headline)
        update('subtext', data.subtext)
        update('cta', data.cta)
      }
    } catch (e) {}
    setGenerating(false)
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => setUploadedImage(ev.target.result)
    reader.readAsDataURL(file)
  }

  useEffect(() => {
    if (canvasRef.current) drawCanvas()
  }, [form, uploadedImage])

  const drawCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const W = 1080, H = 1080
    canvas.width = W
    canvas.height = H

    // Background
    if (uploadedImage && form.bgType === 'image') {
      const img = new Image()
      img.onload = () => {
        ctx.drawImage(img, 0, 0, W, H)
        // Dark overlay
        ctx.fillStyle = 'rgba(0,0,0,0.5)'
        ctx.fillRect(0, 0, W, H)
        drawText(ctx, W, H)
      }
      img.src = uploadedImage
    } else {
      // Gradient background
      const grad = ctx.createLinearGradient(0, 0, W, H)
      grad.addColorStop(0, form.bgColor)
      grad.addColorStop(1, form.bgColor + '99')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, W, H)
      drawText(ctx, W, H)
    }
    setCanvasReady(true)
  }

  const drawText = (ctx, W, H) => {
    ctx.textAlign = 'center'

    // Headline
    ctx.fillStyle = form.textColor
    ctx.font = `bold ${W * 0.075}px -apple-system, sans-serif`
    wrapText(ctx, form.headline || form.productName || 'Votre Produit', W / 2, H * 0.38, W * 0.85, W * 0.085)

    // Subtext
    ctx.font = `${W * 0.038}px -apple-system, sans-serif`
    ctx.fillStyle = form.textColor + 'cc'
    wrapText(ctx, form.subtext || 'Découvrez notre produit exclusif', W / 2, H * 0.58, W * 0.8, W * 0.045)

    // CTA Button
    const btnW = W * 0.5, btnH = H * 0.08
    const btnX = (W - btnW) / 2, btnY = H * 0.72
    ctx.fillStyle = '#ffffff'
    ctx.beginPath()
    ctx.roundRect(btnX, btnY, btnW, btnH, 50)
    ctx.fill()
    ctx.fillStyle = form.bgColor
    ctx.font = `bold ${W * 0.042}px -apple-system, sans-serif`
    ctx.fillText(form.cta || 'Acheter maintenant', W / 2, btnY + btnH * 0.65)

    // Badges
    ctx.font = `${W * 0.028}px -apple-system, sans-serif`
    ctx.fillStyle = form.textColor + 'aa'
    ctx.fillText('✓ Livraison gratuite  ✓ Retour 30j  ✓ Paiement sécurisé', W / 2, H * 0.88)
  }

  const wrapText = (ctx, text, x, y, maxWidth, lineHeight) => {
    if (!text) return
    const words = text.split(' ')
    let line = ''
    let currentY = y
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' '
      const metrics = ctx.measureText(testLine)
      if (metrics.width > maxWidth && n > 0) {
        ctx.fillText(line, x, currentY)
        line = words[n] + ' '
        currentY += lineHeight
      } else {
        line = testLine
      }
    }
    ctx.fillText(line, x, currentY)
  }

  const downloadAd = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const link = document.createElement('a')
    link.download = `ad-${form.productName || 'visuel'}-${Date.now()}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  const formats = [
    { label: '1:1 Instagram', w: 1080, h: 1080 },
    { label: '9:16 Stories/TikTok', w: 1080, h: 1920 },
    { label: '16:9 YouTube', w: 1920, h: 1080 },
    { label: '4:5 Facebook', w: 1080, h: 1350 },
  ]

  const bgTypes = [
    { id: 'gradient', label: '🎨 Couleur' },
    { id: 'image', label: '🖼️ Mon image' },
  ]

  const styles = ['Modern', 'Minimal', 'Bold', 'Luxury']

  return (
    <div>
      <div className="card">
        <p className="card-title">🎨 Créateur de visuels publicitaires IA</p>

        <div className="grid-2">
          <div>
            <div className="input-group">
              <label className="input-label">Nom du produit</label>
              <input className="input" placeholder="ex: Montre GPS Sport" value={form.productName} onChange={e => update('productName', e.target.value)} />
            </div>

            <button className="btn btn-secondary" onClick={generateText} disabled={generating || !form.productName} style={{ marginBottom: 16, width: '100%', justifyContent: 'center' }}>
              {generating ? '⏳ Génération...' : '🤖 Générer le texte avec IA'}
            </button>

            <div className="input-group">
              <label className="input-label">Titre accrocheur</label>
              <input className="input" placeholder="ex: La montre qui change tout" value={form.headline} onChange={e => update('headline', e.target.value)} />
            </div>

            <div className="input-group">
              <label className="input-label">Sous-titre</label>
              <input className="input" placeholder="ex: Suivi GPS, waterproof, batterie 7 jours" value={form.subtext} onChange={e => update('subtext', e.target.value)} />
            </div>

            <div className="input-group">
              <label className="input-label">Bouton CTA</label>
              <input className="input" placeholder="Acheter maintenant" value={form.cta} onChange={e => update('cta', e.target.value)} />
            </div>

            <div className="input-group">
              <label className="input-label">Fond</label>
              <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                {bgTypes.map(t => (
                  <button key={t.id} onClick={() => update('bgType', t.id)} style={{ padding: '7px 14px', borderRadius: 20, border: `1px solid ${form.bgType === t.id ? 'var(--accent)' : 'var(--border)'}`, background: form.bgType === t.id ? '#7c5cfc20' : 'var(--surface2)', color: form.bgType === t.id ? '#a084fd' : 'var(--muted)', cursor: 'pointer', fontSize: 13 }}>
                    {t.label}
                  </button>
                ))}
              </div>
              {form.bgType === 'gradient' ? (
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <input type="color" value={form.bgColor} onChange={e => update('bgColor', e.target.value)} style={{ width: 48, height: 40, borderRadius: 8, border: '1px solid var(--border)', cursor: 'pointer', padding: 2 }} />
                  <input className="input" value={form.bgColor} onChange={e => update('bgColor', e.target.value)} style={{ flex: 1 }} />
                </div>
              ) : (
                <label style={{ display: 'block', background: 'var(--surface2)', border: '2px dashed var(--border)', borderRadius: 10, padding: '14px', textAlign: 'center', cursor: 'pointer' }}>
                  <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                  {uploadedImage ? '✅ Image chargée — clique pour changer' : '📁 Charger mon image produit'}
                </label>
              )}
            </div>

            <div className="input-group">
              <label className="input-label">Couleur du texte</label>
              <div style={{ display: 'flex', gap: 8 }}>
                {['#ffffff', '#111111', '#f39c12', '#2ecc71'].map(c => (
                  <div key={c} onClick={() => update('textColor', c)} style={{ width: 32, height: 32, borderRadius: 8, background: c, border: `3px solid ${form.textColor === c ? 'var(--accent)' : 'transparent'}`, cursor: 'pointer' }} />
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="input-label">Aperçu</label>
            <div style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid var(--border)', background: 'var(--surface2)' }}>
              <canvas ref={canvasRef} style={{ width: '100%', height: 'auto', display: 'block' }} />
            </div>
            <div style={{ marginTop: 12, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <button className="btn btn-primary" onClick={downloadAd} style={{ flex: 1, justifyContent: 'center' }}>
                ⬇️ Télécharger PNG
              </button>
              <button className="btn btn-secondary" onClick={drawCanvas} style={{ padding: '11px 16px' }}>
                🔄
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <p className="card-title">📐 Formats disponibles</p>
        <div className="grid-2">
          {formats.map((f, i) => (
            <div key={i} style={{ background: 'var(--surface2)', borderRadius: 10, padding: '12px 16px', border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 14, fontWeight: 500 }}>{f.label}</span>
              <span style={{ fontSize: 12, color: 'var(--muted)' }}>{f.w}×{f.h}</span>
            </div>
          ))}
        </div>
        <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 12 }}>💡 Télécharge en 1080×1080 et recadre selon le format dans ton outil pub.</p>
      </div>
    </div>
  )
}
