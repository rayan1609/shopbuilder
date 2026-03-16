import { useState } from 'react'

export default function ShopCreator() {
  const [form, setForm] = useState({
    niche: '',
    brandName: '',
    targetAudience: '',
    priceRange: 'mid',
    language: 'fr',
  })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [creating, setCreating] = useState(false)
  const [created, setCreated] = useState(false)

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const generate = async () => {
    setLoading(true)
    setResult(null)
    setError(null)
    try {
      const res = await fetch('/api/generate-shop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setResult(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const createShop = async () => {
    setCreating(true)
    try {
      const res = await fetch('/api/create-shop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shopData: result }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setCreated(true)
    } catch (e) {
      setError(e.message)
    } finally {
      setCreating(false)
    }
  }

  return (
    <div>
      <div className="card">
        <p className="card-title">Paramètres du shop</p>
        <div className="grid-2">
          <div className="input-group">
            <label className="input-label">Niche / Produit principal</label>
            <input className="input" placeholder="ex: accessoires chien, gadgets cuisine..." value={form.niche} onChange={e => update('niche', e.target.value)} />
          </div>
          <div className="input-group">
            <label className="input-label">Nom de marque souhaité (optionnel)</label>
            <input className="input" placeholder="ex: PawLux, KitchenFlow..." value={form.brandName} onChange={e => update('brandName', e.target.value)} />
          </div>
          <div className="input-group">
            <label className="input-label">Audience cible</label>
            <input className="input" placeholder="ex: femmes 25-35 ans, sportifs..." value={form.targetAudience} onChange={e => update('targetAudience', e.target.value)} />
          </div>
          <div className="input-group">
            <label className="input-label">Gamme de prix</label>
            <select className="input" value={form.priceRange} onChange={e => update('priceRange', e.target.value)}>
              <option value="low">Entrée de gamme (−30€)</option>
              <option value="mid">Milieu de gamme (30−80€)</option>
              <option value="high">Premium (80€+)</option>
            </select>
          </div>
          <div className="input-group">
            <label className="input-label">Langue du shop</label>
            <select className="input" value={form.language} onChange={e => update('language', e.target.value)}>
              <option value="fr">Français</option>
              <option value="en">Anglais</option>
              <option value="es">Espagnol</option>
              <option value="de">Allemand</option>
            </select>
          </div>
        </div>
        <button className="btn btn-primary" onClick={generate} disabled={loading || !form.niche}>
          {loading ? '⏳ Génération...' : '🏪 Générer le shop complet'}
        </button>
      </div>

      {loading && (
        <div className="loading">
          <div className="spinner" />
          L'IA crée ton shop complet (nom, pages, emails, politique...)
        </div>
      )}

      {error && <div className="error-banner">❌ {error}</div>}

      {result && (
        <div className="card">
          <p className="card-title">Shop généré</p>

          <div className="grid-2" style={{ marginBottom: 16 }}>
            <div>
              <label className="input-label">Nom de la marque</label>
              <div className="result-field highlight">{result.brandName}</div>
            </div>
            <div>
              <label className="input-label">Slogan</label>
              <div className="result-field">{result.slogan}</div>
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label className="input-label">Description de la marque</label>
            <div className="result-box">{result.brandDescription}</div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label className="input-label">Page "À propos"</label>
            <div className="result-box">{result.aboutPage}</div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label className="input-label">Politique de livraison</label>
            <div className="result-box">{result.shippingPolicy}</div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label className="input-label">Email de bienvenue</label>
            <div className="result-box">{result.welcomeEmail}</div>
          </div>

          <div style={{ marginBottom: 20 }}>
            <label className="input-label">Palette couleurs suggérée</label>
            <div style={{ display: 'flex', gap: 8 }}>
              {result.colors?.map((c, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 6, background: c, border: '1px solid #ffffff20' }} />
                  <span style={{ fontSize: 12, color: 'var(--muted)' }}>{c}</span>
                </div>
              ))}
            </div>
          </div>

          <button className="btn btn-primary" onClick={createShop} disabled={creating || created}>
            {creating ? '⏳ Création sur Shopify...' : created ? '✅ Shop créé !' : '🚀 Créer sur Shopify'}
          </button>

          {created && <div className="success-banner">✅ Ton shop a été configuré sur Shopify !</div>}
        </div>
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
        .result-field.highlight {
          border-color: var(--accent);
          color: #a084fd;
          font-weight: 700;
          font-size: 16px;
          font-family: 'Syne', sans-serif;
        }
      `}</style>
    </div>
  )
}
