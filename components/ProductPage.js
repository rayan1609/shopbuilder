import { useState } from 'react'

export default function ProductPage({ product, onClose }) {
  const [selectedBundle, setSelectedBundle] = useState(1)
  const [addedToCart, setAddedToCart] = useState(false)

  if (!product) return null

  const price = parseFloat(String(product.price || '29.99').replace(/[^0-9.]/g, '')) || 29.99

  const bullets = Array.isArray(product.bullets)
    ? product.bullets
    : String(product.bullets || '').split('\n').filter(b => b.trim())

  const bundles = [
    { qty: 1, label: '1 unité', price: price },
    { qty: 2, label: '2 unités', price: +(price * 2 * 0.9).toFixed(2), badge: '-10%' },
    { qty: 3, label: '3 unités', price: +(price * 3 * 0.8).toFixed(2), badge: '-20%' },
  ]

  const reviews = [
    { name: 'Marie L.', stars: 5, text: 'Produit incroyable ! Livraison rapide et qualité au rendez-vous.', date: 'il y a 2 jours' },
    { name: 'Thomas B.', stars: 5, text: 'Exactement ce que je cherchais. Très satisfait !', date: 'il y a 5 jours' },
    { name: 'Sophie M.', stars: 4, text: 'Bon produit, conforme à la description.', date: 'il y a 1 semaine' },
    { name: 'Lucas R.', stars: 5, text: 'Parfait ! Super rapport qualité/prix.', date: 'il y a 2 semaines' },
  ]

  const faqs = [
    { q: 'Quel est le délai de livraison ?', a: 'Livraison sous 7 à 14 jours ouvrés.' },
    { q: 'Puis-je retourner le produit ?', a: 'Oui, 30 jours pour retourner. Remboursement complet garanti.' },
    { q: 'Le paiement est-il sécurisé ?', a: 'Oui, toutes les transactions sont cryptées SSL.' },
    { q: 'Livraison internationale ?', a: 'Oui, nous livrons dans toute l\'Europe.' },
  ]

  return (
    <div style={{position:'fixed',inset:0,background:'#000c',zIndex:1000,overflowY:'auto',padding:'20px'}}>
      <div style={{background:'#fff',color:'#111',maxWidth:900,margin:'0 auto',borderRadius:16,overflow:'hidden',paddingBottom:40}}>
        
        <div style={{background:'#f8f8f8',padding:'12px 20px',display:'flex',alignItems:'center',justifyContent:'space-between',borderBottom:'1px solid #eee'}}>
          <button onClick={onClose} style={{background:'#111',color:'#fff',border:'none',padding:'8px 16px',borderRadius:8,cursor:'pointer',fontWeight:600}}>✕ Fermer</button>
          <span style={{fontSize:12,color:'#888',background:'#eee',padding:'4px 10px',borderRadius:20}}>👁 Prévisualisation page produit</span>
        </div>

        <div style={{background:'#fff3cd',color:'#856404',padding:'10px 20px',fontSize:14,textAlign:'center',borderBottom:'1px solid #ffc107'}}>
          🔥 <strong>23 personnes</strong> regardent ce produit · Stock limité : <strong>14 restants</strong>
        </div>

        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:32,padding:32}}>
          <div>
            <div style={{background:'#f5f5f5',borderRadius:12,height:280,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',color:'#aaa',fontSize:40,marginBottom:12}}>
              🖼<p style={{fontSize:14,marginTop:8}}>Image produit</p>
            </div>
          </div>

          <div>
            <div style={{fontSize:14,marginBottom:10,color:'#555'}}>⭐⭐⭐⭐⭐ <span>4.8/5</span> <span style={{color:'#888',fontSize:13}}>(127 avis)</span></div>
            <h1 style={{fontSize:22,fontWeight:800,marginBottom:10,lineHeight:1.3}}>{product.title}</h1>
            <p style={{fontSize:14,color:'#666',lineHeight:1.6,marginBottom:20}}>{String(product.description||'').substring(0,150)}...</p>

            <p style={{fontSize:11,fontWeight:700,color:'#888',letterSpacing:1,marginBottom:10}}>CHOISISSEZ VOTRE OFFRE</p>
            {bundles.map((b,i) => (
              <div key={i} onClick={() => setSelectedBundle(b.qty)} style={{display:'flex',alignItems:'center',gap:12,padding:'12px 16px',border:`2px solid ${selectedBundle===b.qty?'#7c5cfc':'#eee'}`,borderRadius:10,marginBottom:8,cursor:'pointer',background:selectedBundle===b.qty?'#7c5cfc08':'#fff'}}>
                <div style={{width:18,height:18,borderRadius:'50%',border:`2px solid ${selectedBundle===b.qty?'#7c5cfc':'#ddd'}`,background:selectedBundle===b.qty?'#7c5cfc':'transparent',boxShadow:selectedBundle===b.qty?'inset 0 0 0 3px #fff':''}} />
                <div style={{flex:1}}>
                  <span style={{fontWeight:600,fontSize:14,display:'block'}}>{b.label}</span>
                  {b.badge && <span style={{fontSize:12,color:'#2ecc71'}}>Offre spéciale {b.badge}</span>}
                </div>
                <div style={{textAlign:'right'}}>
                  <span style={{fontWeight:800,fontSize:16,display:'block'}}>{b.price.toFixed(2)}€</span>
                  {b.badge && <span style={{background:'#ff4757',color:'white',fontSize:11,fontWeight:700,padding:'2px 6px',borderRadius:4}}>{b.badge}</span>}
                </div>
              </div>
            ))}

            <button onClick={() => setAddedToCart(true)} style={{width:'100%',background:'linear-gradient(135deg,#7c5cfc,#9b7aff)',color:'white',border:'none',padding:16,borderRadius:12,fontSize:16,fontWeight:700,cursor:'pointer',marginBottom:10}}>
              {addedToCart ? '✅ Ajouté au panier !' : `🛒 Ajouter au panier — ${bundles[selectedBundle-1].price.toFixed(2)}€`}
            </button>
            <button style={{width:'100%',background:'#111',color:'white',border:'none',padding:14,borderRadius:12,fontSize:15,fontWeight:700,cursor:'pointer',marginBottom:16}}>⚡ Acheter maintenant</button>

            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
              {['🚚 Livraison gratuite','🔄 Retour 30 jours','🔒 Paiement sécurisé','✅ Satisfait ou remboursé'].map((g,i) => (
                <div key={i} style={{background:'#f8f8f8',padding:'8px 12px',borderRadius:8,fontSize:13,textAlign:'center',color:'#444'}}>{g}</div>
              ))}
            </div>
          </div>
        </div>

        <div style={{padding:'32px',borderTop:'1px solid #eee'}}>
          <h2 style={{fontSize:20,fontWeight:800,marginBottom:20}}>Pourquoi choisir ce produit ?</h2>
          {bullets.map((b,i) => (
            <div key={i} style={{display:'flex',gap:12,marginBottom:12,fontSize:15,color:'#333'}}>
              <span style={{color:'#2ecc71',fontWeight:800,fontSize:18,flexShrink:0}}>✓</span>
              <span>{String(b).replace('✓','').trim()}</span>
            </div>
          ))}
        </div>

        <div style={{padding:'32px',borderTop:'1px solid #eee'}}>
          <h2 style={{fontSize:20,fontWeight:800,marginBottom:20}}>⭐ Avis clients</h2>
          {reviews.map((r,i) => (
            <div key={i} style={{background:'#f8f8f8',borderRadius:10,padding:16,marginBottom:12}}>
              <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:8}}>
                <div style={{width:36,height:36,background:'#7c5cfc',color:'white',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700}}>{r.name[0]}</div>
                <div>
                  <div style={{fontWeight:600,fontSize:14}}>{r.name}</div>
                  <div style={{fontSize:12}}>{'⭐'.repeat(r.stars)}</div>
                </div>
                <span style={{marginLeft:'auto',fontSize:12,color:'#888'}}>{r.date}</span>
              </div>
              <p style={{fontSize:14,color:'#555',lineHeight:1.6}}>{r.text}</p>
            </div>
          ))}
        </div>

        <div style={{padding:'32px',borderTop:'1px solid #eee'}}>
          <h2 style={{fontSize:20,fontWeight:800,marginBottom:20}}>❓ Questions fréquentes</h2>
          {faqs.map((f,i) => <FAQItem key={i} q={f.q} a={f.a} />)}
        </div>
      </div>
    </div>
  )
}

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{border:'1px solid #eee',borderRadius:10,overflow:'hidden',marginBottom:8}}>
      <button onClick={() => setOpen(!open)} style={{width:'100%',padding:'14px 16px',background:open?'#f8f8f8':'#fff',border:'none',cursor:'pointer',display:'flex',justifyContent:'space-between',alignItems:'center',fontWeight:600,fontSize:14,color:'#111',textAlign:'left'}}>
        {q}<span style={{fontSize:18,color:'#888'}}>{open?'−':'+'}</span>
      </button>
      {open && <div style={{padding:'12px 16px',fontSize:14,color:'#555',lineHeight:1.6,borderTop:'1px solid #eee',background:'#fafafa'}}>{a}</div>}
    </div>
  )
}
