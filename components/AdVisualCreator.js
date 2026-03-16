import { useState, useRef, useEffect } from 'react'

const TEMPLATES = [
  { id: 'promo', name: '🔥 Promo Flash', bg: ['#ff4757', '#ff6b81'], textColor: '#fff', layout: 'centered' },
  { id: 'luxury', name: '💎 Luxe', bg: ['#1a1a2e', '#16213e'], textColor: '#d4af37', layout: 'elegant' },
  { id: 'nature', name: '🌿 Nature', bg: ['#11998e', '#38ef7d'], textColor: '#fff', layout: 'minimal' },
  { id: 'bold', name: '⚡ Bold', bg: ['#f7971e', '#ffd200'], textColor: '#111', layout: 'bold' },
  { id: 'minimal', name: '◻️ Minimal', bg: ['#f8f9fa', '#e9ecef'], textColor: '#111', layout: 'minimal' },
  { id: 'neon', name: '🌈 Neon', bg: ['#0f0c29', '#302b63'], textColor: '#00f5ff', layout: 'neon' },
  { id: 'sunset', name: '🌅 Sunset', bg: ['#f953c6', '#b91d73'], textColor: '#fff', layout: 'centered' },
  { id: 'ocean', name: '🌊 Ocean', bg: ['#2193b0', '#6dd5ed'], textColor: '#fff', layout: 'centered' },
]

const SIZES = [
  { id: 'square', name: '1:1 Instagram', w: 1080, h: 1080 },
  { id: 'story', name: '9:16 Stories/TikTok', w: 1080, h: 1920 },
  { id: 'landscape', name: '16:9 YouTube/FB', w: 1920, h: 1080 },
  { id: 'portrait', name: '4:5 Facebook', w: 1080, h: 1350 },
]

export default function AdVisualCreator() {
  const [activeTab, setActiveTab] = useState('visual')
  const [template, setTemplate] = useState(TEMPLATES[0])
  const [size, setSize] = useState(SIZES[0])
  const [form, setForm] = useState({
    productName: '',
    headline: '',
    subtext: '',
    cta: 'Commander maintenant',
    badge: '⚡ OFFRE LIMITÉE',
    showBadge: true,
    showBadges: true,
    customBg: false,
    bgColor1: '#ff4757',
    bgColor2: '#ff6b81',
    textColor: '#ffffff',
    fontSize: 'medium',
  })
  const [uploadedImage, setUploadedImage] = useState(null)
  const [useImageBg, setUseImageBg] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [generatingVideo, setGeneratingVideo] = useState(false)
  const [videoScript, setVideoScript] = useState(null)
  const canvasRef = useRef(null)

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const selectTemplate = (t) => {
    setTemplate(t)
    update('bgColor1', t.bg[0])
    update('bgColor2', t.bg[1])
    update('textColor', t.textColor)
  }

  const generateText = async () => {
    if (!form.productName) return
    setGenerating(true)
    try {
      const res = await fetch('/api/generate-ad-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productName: form.productName }),
      })
      const data = await res.json()
      if (res.ok) {
        update('headline', data.headline || '')
        update('subtext', data.subtext || '')
        update('cta', data.cta || 'Commander maintenant')
      }
    } catch (e) {}
    setGenerating(false)
  }

  const generateVideoScript = async () => {
    if (!form.productName) return
    setGeneratingVideo(true)
    try {
      const res = await fetch('/api/generate-video-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productName: form.productName, headline: form.headline }),
      })
      const data = await res.json()
      if (res.ok) setVideoScript(data)
    } catch (e) {}
    setGeneratingVideo(false)
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => setUploadedImage(ev.target.result)
    reader.readAsDataURL(file)
  }

  useEffect(() => { drawCanvas() }, [form, template, uploadedImage, useImageBg, size])

  const drawCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const W = size.w, H = size.h
    canvas.width = W
    canvas.height = H
    const ctx = canvas.getContext('2d')

    const drawContent = () => {
      const fontSize = form.fontSize === 'large' ? 0.09 : form.fontSize === 'small' ? 0.06 : 0.075
      const isPortrait = H > W
      const centerY = H / 2

      // Badge
      if (form.showBadge && form.badge) {
        const badgeY = isPortrait ? H * 0.12 : H * 0.15
        ctx.fillStyle = '#fff'
        ctx.font = `bold ${W * 0.035}px -apple-system, sans-serif`
        ctx.textAlign = 'center'
        const bw = ctx.measureText(form.badge).width + W * 0.08
        const bh = W * 0.06
        const bx = W / 2 - bw / 2
        const by = badgeY - bh * 0.7
        ctx.beginPath()
        ctx.roundRect(bx, by, bw, bh, bh / 2)
        ctx.fillStyle = 'rgba(255,255,255,0.25)'
        ctx.fill()
        ctx.fillStyle = form.textColor
        ctx.fillText(form.badge, W / 2, badgeY)
      }

      // Headline
      ctx.fillStyle = form.textColor
      ctx.font = `900 ${W * fontSize}px -apple-system, sans-serif`
      ctx.textAlign = 'center'
      const headlineY = isPortrait ? H * 0.42 : H * 0.38
      wrapText(ctx, form.headline || form.productName || 'VOTRE PRODUIT', W / 2, headlineY, W * 0.85, W * fontSize * 1.15)

      // Subtext
      if (form.subtext) {
        ctx.font = `${W * 0.038}px -apple-system, sans-serif`
        ctx.fillStyle = form.textColor + 'cc'
        const subtextY = isPortrait ? H * 0.56 : H * 0.58
        wrapText(ctx, form.subtext, W / 2, subtextY, W * 0.8, W * 0.045)
      }

      // CTA Button
      const btnW = W * 0.55, btnH = H * 0.075
      const btnX = (W - btnW) / 2
      const btnY = isPortrait ? H * 0.68 : H * 0.7
      ctx.fillStyle = 'rgba(255,255,255,0.95)'
      ctx.shadowColor = 'rgba(0,0,0,0.2)'
      ctx.shadowBlur = 20
      ctx.beginPath()
      ctx.roundRect(btnX, btnY, btnW, btnH, btnH / 2)
      ctx.fill()
      ctx.shadowBlur = 0
      ctx.fillStyle = form.bgColor1 || template.bg[0]
      ctx.font = `bold ${W * 0.042}px -apple-system, sans-serif`
      ctx.fillText(form.cta || 'Commander maintenant', W / 2, btnY + btnH * 0.65)

      // Trust badges
      if (form.showBadges) {
        ctx.font = `${W * 0.026}px -apple-system, sans-serif`
        ctx.fillStyle = form.textColor + '99'
        const badgesY = isPortrait ? H * 0.82 : H * 0.88
        ctx.fillText('✓ Livraison gratuite   ✓ Retour 30j   ✓ Paiement sécurisé', W / 2, badgesY)
      }
    }

    if (useImageBg && uploadedImage) {
      const img = new Image()
      img.onload = () => {
        ctx.drawImage(img, 0, 0, W, H)
        ctx.fillStyle = 'rgba(0,0,0,0.55)'
        ctx.fillRect(0, 0, W, H)
        drawContent()
      }
      img.src = uploadedImage
    } else {
      const grad = ctx.createLinearGradient(0, 0, W, H)
      grad.addColorStop(0, form.bgColor1 || template.bg[0])
      grad.addColorStop(1, form.bgColor2 || template.bg[1])
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, W, H)
      drawContent()
    }
  }

  const wrapText = (ctx, text, x, y, maxWidth, lineHeight) => {
    if (!text) return
    const words = String(text).split(' ')
    let line = '', cy = y
    for (let n = 0; n < words.length; n++) {
      const test = line + words[n] + ' '
      if (ctx.measureText(test).width > maxWidth && n > 0) {
        ctx.fillText(line, x, cy)
        line = words[n] + ' '
        cy += lineHeight
      } else line = test
    }
    ctx.fillText(line, x, cy)
  }

  const download = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const a = document.createElement('a')
    a.download = `shopbuilder-ad-${Date.now()}.png`
    a.href = canvas.toDataURL('image/png', 1.0)
    a.click()
  }

  const tabs = [
    { id: 'visual', label: '🎨 Visuel' },
    { id: 'video', label: '🎬 Script Vidéo' },
  ]

  return (
    <div>
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border)' }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)} style={{ flex: 1, padding: '14px', border: 'none', background: activeTab === t.id ? 'var(--surface2)' : 'transparent', color: activeTab === t.id ? 'var(--text)' : 'var(--muted)', fontWeight: 600, fontSize: 14, cursor: 'pointer', borderBottom: activeTab === t.id ? `2px solid var(--accent)` : '2px solid transparent' }}>
              {t.label}
            </button>
          ))}
        </div>

        <div style={{ padding: 20 }}>
          {activeTab === 'visual' && (
            <div>
              {/* Product name + AI */}
              <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
                <input className="input" placeholder="Nom du produit..." value={form.productName} onChange={e => update('productName', e.target.value)} style={{ flex: 1 }} />
                <button className="btn btn-secondary" onClick={generateText} disabled={generating || !form.productName} style={{ padding: '11px 16px', flexShrink: 0 }}>
                  {generating ? '⏳' : '🤖 IA'}
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                <div>
                  {/* Templates */}
                  <div style={{ marginBottom: 16 }}>
                    <label className="input-label">Templates</label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
                      {TEMPLATES.map(t => (
                        <button key={t.id} onClick={() => selectTemplate(t)} style={{ padding: '8px 4px', borderRadius: 8, border: `2px solid ${template.id === t.id ? 'var(--accent)' : 'var(--border)'}`, background: `linear-gradient(135deg, ${t.bg[0]}, ${t.bg[1]})`, cursor: 'pointer', fontSize: 11, color: t.textColor, fontWeight: 600, transition: 'all 0.2s' }}>
                          {t.name.split(' ')[0]}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Format */}
                  <div style={{ marginBottom: 16 }}>
                    <label className="input-label">Format</label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                      {SIZES.map(s => (
                        <button key={s.id} onClick={() => setSize(s)} style={{ padding: '7px', borderRadius: 8, border: `1px solid ${size.id === s.id ? 'var(--accent)' : 'var(--border)'}`, background: size.id === s.id ? '#7c5cfc20' : 'var(--surface2)', color: size.id === s.id ? '#a084fd' : 'var(--muted)', cursor: 'pointer', fontSize: 11, fontWeight: 500 }}>
                          {s.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Text fields */}
                  <div className="input-group">
                    <label className="input-label">Titre</label>
                    <input className="input" placeholder="TITRE ACCROCHEUR" value={form.headline} onChange={e => update('headline', e.target.value)} />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Sous-titre</label>
                    <input className="input" placeholder="Bénéfices du produit..." value={form.subtext} onChange={e => update('subtext', e.target.value)} />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Bouton CTA</label>
                    <input className="input" value={form.cta} onChange={e => update('cta', e.target.value)} />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Badge urgence</label>
                    <input className="input" value={form.badge} onChange={e => update('badge', e.target.value)} />
                  </div>

                  {/* Colors */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 14 }}>
                    <div>
                      <label className="input-label">Couleur 1</label>
                      <input type="color" value={form.bgColor1} onChange={e => update('bgColor1', e.target.value)} style={{ width: '100%', height: 40, borderRadius: 8, border: '1px solid var(--border)', cursor: 'pointer', padding: 2 }} />
                    </div>
                    <div>
                      <label className="input-label">Couleur 2</label>
                      <input type="color" value={form.bgColor2} onChange={e => update('bgColor2', e.target.value)} style={{ width: '100%', height: 40, borderRadius: 8, border: '1px solid var(--border)', cursor: 'pointer', padding: 2 }} />
                    </div>
                    <div>
                      <label className="input-label">Texte</label>
                      <input type="color" value={form.textColor} onChange={e => update('textColor', e.target.value)} style={{ width: '100%', height: 40, borderRadius: 8, border: '1px solid var(--border)', cursor: 'pointer', padding: 2 }} />
                    </div>
                  </div>

                  {/* Image bg */}
                  <div style={{ marginBottom: 14 }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, marginBottom: 8 }}>
                      <input type="checkbox" checked={useImageBg} onChange={e => setUseImageBg(e.target.checked)} style={{ accentColor: 'var(--accent)' }} />
                      Utiliser une image de fond
                    </label>
                    {useImageBg && (
                      <label style={{ display: 'block', background: 'var(--surface2)', border: '2px dashed var(--border)', borderRadius: 8, padding: 12, textAlign: 'center', cursor: 'pointer', fontSize: 13 }}>
                        <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                        {uploadedImage ? '✅ Image chargée' : '📁 Choisir une image'}
                      </label>
                    )}
                  </div>

                  {/* Options */}
                  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 14 }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: 13 }}>
                      <input type="checkbox" checked={form.showBadge} onChange={e => update('showBadge', e.target.checked)} style={{ accentColor: 'var(--accent)' }} />
                      Badge
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: 13 }}>
                      <input type="checkbox" checked={form.showBadges} onChange={e => update('showBadges', e.target.checked)} style={{ accentColor: 'var(--accent)' }} />
                      Trust badges
                    </label>
                  </div>

                  <div className="input-group">
                    <label className="input-label">Taille du texte</label>
                    <select className="input" value={form.fontSize} onChange={e => update('fontSize', e.target.value)}>
                      <option value="small">Petit</option>
                      <option value="medium">Moyen</option>
                      <option value="large">Grand</option>
                    </select>
                  </div>
                </div>

                {/* Canvas preview */}
                <div>
                  <label className="input-label">Aperçu</label>
                  <div style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid var(--border)', background: '#000', marginBottom: 10 }}>
                    <canvas ref={canvasRef} style={{ width: '100%', height: 'auto', display: 'block' }} />
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn btn-primary" onClick={download} style={{ flex: 1, justifyContent: 'center' }}>⬇️ Télécharger PNG</button>
                    <button className="btn btn-secondary" onClick={drawCanvas} style={{ padding: '11px 14px' }}>🔄</button>
                  </div>
                  <p style={{ fontSize: 11, color: 'var(--muted)', marginTop: 8, textAlign: 'center' }}>
                    {size.w}×{size.h}px · Prêt pour {size.name}
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'video' && (
            <div>
              <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
                <input className="input" placeholder="Nom du produit..." value={form.productName} onChange={e => update('productName', e.target.value)} style={{ flex: 1 }} />
                <button className="btn btn-primary" onClick={generateVideoScript} disabled={generatingVideo || !form.productName} style={{ flexShrink: 0 }}>
                  {generatingVideo ? '⏳ Génération...' : '🎬 Générer le script'}
                </button>
              </div>

              {generatingVideo && <div className="loading"><div className="spinner" />Génération du script vidéo...</div>}

              {videoScript && (
                <div>
                  <div className="card" style={{ background: 'var(--surface2)' }}>
                    <p className="card-title">🎬 Script vidéo — {videoScript.duration}</p>
                    <div style={{ marginBottom: 16 }}>
                      <label className="input-label">Hook (0-3 secondes)</label>
                      <div className="result-box" style={{ marginTop: 0, background: 'var(--surface)' }}>{videoScript.hook}</div>
                    </div>
                    <div style={{ marginBottom: 16 }}>
                      <label className="input-label">Développement (3-20 secondes)</label>
                      <div className="result-box" style={{ marginTop: 0, background: 'var(--surface)' }}>{videoScript.body}</div>
                    </div>
                    <div style={{ marginBottom: 16 }}>
                      <label className="input-label">Call to Action (20-30 secondes)</label>
                      <div className="result-box" style={{ marginTop: 0, background: 'var(--surface)' }}>{videoScript.cta}</div>
                    </div>
                  </div>

                  <div className="card">
                    <p className="card-title">🎥 Storyboard scène par scène</p>
                    {videoScript.scenes?.map((scene, i) => (
                      <div key={i} style={{ display: 'flex', gap: 12, padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                        <div style={{ width: 40, height: 40, background: 'var(--accent)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 16, flexShrink: 0 }}>{i + 1}</div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{scene.time} — {scene.action}</div>
                          <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 4 }}>{scene.visual}</div>
                          {scene.text && <div style={{ fontSize: 12, color: '#a084fd', fontStyle: 'italic' }}>Texte à l'écran: "{scene.text}"</div>}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="card">
                    <p className="card-title">🎵 Musique & Son</p>
                    <div className="result-box">{videoScript.music}</div>
                  </div>

                  <div className="card">
                    <p className="card-title">💡 Conseils de tournage</p>
                    <div className="result-box">{videoScript.tips}</div>
                  </div>
                </div>
              )}

              {!videoScript && !generatingVideo && (
                <div style={{ textAlign: 'center', padding: 40, color: 'var(--muted)' }}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>🎬</div>
                  <p>Entre ton produit et génère un script vidéo complet avec storyboard, musique et conseils de tournage.</p>
                  <p style={{ fontSize: 13, marginTop: 8 }}>Compatible TikTok, Instagram Reels, YouTube Shorts</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
