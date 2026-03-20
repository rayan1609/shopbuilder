import { useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'

export default function Login() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const submit = async () => {
    setLoading(true)
    setError(false)
    const res = await fetch('/api/auth-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })
    if (res.ok) {
      router.push('/')
    } else {
      setError(true)
      setLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>ShopBuilder — Connexion</title>
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800;900&display=swap" rel="stylesheet" />
      </Head>
      <div style={{ minHeight: '100vh', background: '#06060f', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Outfit, sans-serif', position: 'relative', overflow: 'hidden' }}>
        {/* Orbs */}
        <div style={{ position: 'fixed', top: '-20vh', left: '-10vw', width: '60vw', height: '60vw', background: 'radial-gradient(circle, rgba(109,40,217,0.12) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
        <div style={{ position: 'fixed', bottom: '-10vh', right: '-5vw', width: '40vw', height: '40vw', background: 'radial-gradient(circle, rgba(236,72,153,0.08) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />

        {/* Grid */}
        <div style={{ position: 'fixed', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)', backgroundSize: '40px 40px', pointerEvents: 'none' }} />

        <div style={{ width: '100%', maxWidth: 400, padding: '0 20px', position: 'relative', zIndex: 1 }}>
          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <div style={{ width: 60, height: 60, background: 'linear-gradient(135deg, #8b5cf6, #ec4899)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, margin: '0 auto 16px', boxShadow: '0 0 40px rgba(139,92,246,0.4)' }}>◈</div>
            <h1 style={{ color: '#f1f0ff', fontSize: 26, fontWeight: 800, marginBottom: 6, letterSpacing: '-0.5px' }}>ShopBuilder</h1>
            <p style={{ color: '#4a4968', fontSize: 14 }}>Entre ton mot de passe pour accéder</p>
          </div>

          {/* Card */}
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: '32px 28px', backdropFilter: 'blur(20px)' }}>
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#8b8aaa', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>Mot de passe</label>
              <input
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && submit()}
                style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: `1px solid ${error ? 'rgba(244,63,94,0.5)' : 'rgba(255,255,255,0.07)'}`, borderRadius: 10, padding: '12px 16px', color: '#f1f0ff', fontFamily: 'Outfit, sans-serif', fontSize: 15, outline: 'none', transition: 'all 0.2s', letterSpacing: 2 }}
              />
              {error && <p style={{ color: '#f43f5e', fontSize: 12, marginTop: 8 }}>❌ Mot de passe incorrect</p>}
            </div>

            <button
              onClick={submit}
              disabled={loading || !password}
              style={{ width: '100%', background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)', color: 'white', border: 'none', borderRadius: 10, padding: '13px', fontSize: 15, fontWeight: 700, cursor: loading || !password ? 'not-allowed' : 'pointer', opacity: loading || !password ? 0.5 : 1, fontFamily: 'Outfit, sans-serif', boxShadow: '0 4px 20px rgba(139,92,246,0.35)', transition: 'all 0.2s', letterSpacing: 0.3 }}
            >
              {loading ? '⏳ Connexion...' : '🔓 Accéder à ShopBuilder'}
            </button>
          </div>

          <p style={{ textAlign: 'center', color: '#4a4968', fontSize: 12, marginTop: 20 }}>
            🔒 Accès privé — Usage personnel uniquement
          </p>
        </div>
      </div>
    </>
  )
}
