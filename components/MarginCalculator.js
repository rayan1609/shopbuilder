import { useState } from 'react'

export default function MarginCalculator() {
  const [form, setForm] = useState({
    buyPrice: '',
    sellPrice: '',
    shippingCost: '',
    adCost: '',
    transactionFee: '2',
  })
  const [result, setResult] = useState(null)

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const calculate = () => {
    const buy = parseFloat(form.buyPrice) || 0
    const sell = parseFloat(form.sellPrice) || 0
    const shipping = parseFloat(form.shippingCost) || 0
    const ads = parseFloat(form.adCost) || 0
    const fee = (parseFloat(form.transactionFee) || 0) / 100

    const totalCost = buy + shipping + ads + (sell * fee)
    const profit = sell - totalCost
    const margin = sell > 0 ? (profit / sell) * 100 : 0
    const roi = totalCost > 0 ? (profit / totalCost) * 100 : 0
    const breakeven = ads > 0 ? sell / ads : 0

    setResult({ profit, margin, roi, totalCost, breakeven })
  }

  return (
    <div>
      <div className="card">
        <p className="card-title">Calculateur de marge</p>
        <div className="grid-2">
          <div className="input-group">
            <label className="input-label">Prix d'achat (€)</label>
            <input className="input" type="number" placeholder="ex: 8.50" value={form.buyPrice} onChange={e => update('buyPrice', e.target.value)} />
          </div>
          <div className="input-group">
            <label className="input-label">Prix de vente (€)</label>
            <input className="input" type="number" placeholder="ex: 29.99" value={form.sellPrice} onChange={e => update('sellPrice', e.target.value)} />
          </div>
          <div className="input-group">
            <label className="input-label">Frais de livraison (€)</label>
            <input className="input" type="number" placeholder="ex: 3.00" value={form.shippingCost} onChange={e => update('shippingCost', e.target.value)} />
          </div>
          <div className="input-group">
            <label className="input-label">Budget pub par vente (€)</label>
            <input className="input" type="number" placeholder="ex: 5.00" value={form.adCost} onChange={e => update('adCost', e.target.value)} />
          </div>
          <div className="input-group">
            <label className="input-label">Frais transaction Shopify (%)</label>
            <input className="input" type="number" placeholder="ex: 2" value={form.transactionFee} onChange={e => update('transactionFee', e.target.value)} />
          </div>
        </div>
        <button className="btn btn-primary" onClick={calculate}>📊 Calculer</button>
      </div>

      {result && (
        <div className="card">
          <p className="card-title">Résultats</p>
          <div className="grid-2">
            <div className={`stat-card ${result.profit > 0 ? 'green' : 'red'}`}>
              <span className="stat-label">Profit net</span>
              <span className="stat-value">{result.profit.toFixed(2)}€</span>
            </div>
            <div className={`stat-card ${result.margin > 20 ? 'green' : result.margin > 0 ? 'orange' : 'red'}`}>
              <span className="stat-label">Marge nette</span>
              <span className="stat-value">{result.margin.toFixed(1)}%</span>
            </div>
            <div className="stat-card blue">
              <span className="stat-label">ROI</span>
              <span className="stat-value">{result.roi.toFixed(0)}%</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Coût total</span>
              <span className="stat-value">{result.totalCost.toFixed(2)}€</span>
            </div>
          </div>

          <div className="advice" style={{ marginTop: 16 }}>
            {result.margin > 30 ? '✅ Excellente marge ! Produit viable.' :
             result.margin > 15 ? '⚠️ Marge correcte, surveille tes pubs.' :
             result.margin > 0 ? '🔴 Marge trop faible, revois ton prix.' :
             '❌ Tu perds de l\'argent sur ce produit.'}
          </div>
        </div>
      )}

      <style jsx>{`
        .stat-card {
          background: var(--surface2);
          border: 1px solid var(--border);
          border-radius: 10px;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .stat-card.green { border-color: #2ecc7130; background: #2ecc7108; }
        .stat-card.red { border-color: #e74c3c30; background: #e74c3c08; }
        .stat-card.orange { border-color: #f39c1230; background: #f39c1208; }
        .stat-card.blue { border-color: #7c5cfc30; background: #7c5cfc08; }
        .stat-label { font-size: 12px; color: var(--muted); }
        .stat-value { font-size: 24px; font-weight: 800; font-family: 'Syne', sans-serif; }
        .stat-card.green .stat-value { color: #2ecc71; }
        .stat-card.red .stat-value { color: #e74c3c; }
        .stat-card.orange .stat-value { color: #f39c12; }
        .stat-card.blue .stat-value { color: #a084fd; }
        .advice {
          background: var(--surface2);
          border-radius: 10px;
          padding: 14px 16px;
          font-size: 14px;
          border: 1px solid var(--border);
        }
      `}</style>
    </div>
  )
}
