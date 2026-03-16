import { useState } from 'react'

export default function ThemeGenerator() {
  const [form, setForm] = useState({
    productName: '',
    productDescription: '',
    productPrice: '',
    brandName: '',
    primaryColor: '#7c5cfc',
    secondaryColor: '#fc5c7d',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [done, setDone] = useState(false)

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const generate = async () => {
    setLoading(true)
    setError(null)
    setDone(false)
    try {
      const product = {
        title: form.productName,
        description: form.productDescription,
        price: form.productPrice || '29.99€',
        bullets: '',
        tags: [],
      }

      const res = await fetch('/api/generate-theme', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product,
          brandName: form.brandName,
          primaryColor: form.primaryColor,
          secondaryColor: form.secondaryColor,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Erreur génération')
      }

      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `shopify-theme-${form.brandName || 'monshop'}.zip`
      a.click()
      URL.revokeObjectURL(url)
      setDone(true)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="card">
        <p className="card-title">🎨 Générateur de thème Shopify</p>

        <div className="info-banner">
          <p>✨ Génère un thème Shopify complet avec homepage, page produit, bundles, avis clients et FAQ — prêt à importer en 1 clic.</p>
        </div>

        <div className="grid-2">
          <div className="input-group">
            <label className="input-label">Nom du produit</label>
            <input className="input" placeholder="ex: Montre connectée GPS Sport" value={form.productName} onChange={e => update('productName', e.target.value)} />
          </div>
          <div className="input-group">
            <label className="input-label">Nom de ta marque</label>
            <input className="input" placeholder="ex: TechWear Store" value={form.brandName} onChange={e => update('brandName', e.target.value)} />
          </div>
          <div className="input-group">
            <label className="input-label">Prix du produit</label>
            <input className="input" placeholder="ex: 29.99€" value={form.productPrice} onChange={e => update('productPrice', e.target.value)} />
          </div>
        </div>

        <div className="input-group">
          <label className="input-label">Description du produit</label>
          <textarea className="input" placeholder="Décris ton produit en quelques phrases..." value={form.productDescription} onChange={e => update('productDescription', e.target.value)} rows={3} />
        </div>

        <div className="grid-2" style={{ marginBottom: 20 }}>
          <div className="input-group">
            <label className="input-label">Couleur principale</label>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <input type="color" value={form.primaryColor} onChange={e => update('primaryColor', e.target.value)} style={{ width: 48, height: 40, borderRadius: 8, border: '1px solid var(--border)', cursor: 'pointer', padding: 2 }} />
              <input className="input" value={form.primaryColor} onChange={e => update('primaryColor', e.target.value)} style={{ flex: 1 }} />
            </div>
          </div>
          <div className="input-group">
            <label className="input-label">Couleur secondaire</label>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <input type="color" value={form.secondaryColor} onChange={e => update('secondaryColor', e.target.value)} style={{ width: 48, height: 40, borderRadius: 8, border: '1px solid var(--border)', cursor: 'pointer', padding: 2 }} />
              <input className="input" value={form.secondaryColor} onChange={e => update('secondaryColor', e.target.value)} style={{ flex: 1 }} />
            </div>
          </div>
        </div>

        <button className="btn btn-primary" onClick={generate} disabled={loading || !form.productName}>
          {loading ? '⏳ Génération du thème...' : '🎨 Générer et télécharger le thème'}
        </button>
      </div>

      {loading && (
        <div className="loading">
          <div className="spinner" />
          L'IA crée ton thème Shopify complet... (30-60 secondes)
        </div>
      )}

      {error && <div className="error-banner">❌ {error}</div>}

      {done && (
        <div className="card success-card">
          <h3>✅ Thème généré et téléchargé !</h3>
          <p>Pour l'importer sur Shopify :</p>
          <ol>
            <li>Va sur ton admin Shopify</li>
            <li>Clique sur <strong>Boutique en ligne → Thèmes</strong></li>
            <li>Clique sur <strong>"Ajouter un thème" → "Télécharger un fichier zip"</strong></li>
            <li>Sélectionne le fichier ZIP téléchargé</li>
            <li>Clique sur <strong>"Publier"</strong></li>
          </ol>
          <p style={{ marginTop: 12, color: 'var(--muted)', fontSize: 13 }}>🎉 Ton shop sera prêt à vendre avec bundles, avis, FAQ et design premium !</p>
        </div>
      )}

      <style jsx>{`
        .info-banner {
          background: linear-gradient(135deg, #7c5cfc15, #fc5c7d10);
          border: 1px solid #7c5cfc30;
          border-radius: 10px;
          padding: 14px 16px;
          margin-bottom: 20px;
          font-size: 14px;
          color: #a084fd;
          line-height: 1.6;
        }
        .success-card {
          border-color: #2ecc7130;
          background: #2ecc7108;
        }
        .success-card h3 {
          color: #2ecc71;
          font-size: 18px;
          font-weight: 700;
          margin-bottom: 12px;
        }
        .success-card p {
          font-size: 14px;
          color: var(--text);
          margin-bottom: 10px;
        }
        .success-card ol {
          padding-left: 20px;
          font-size: 14px;
          color: var(--muted);
          line-height: 1.8;
        }
      `}</style>
    </div>
  )
}
