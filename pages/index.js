import Head from 'next/head'
import { useState } from 'react'
import ProductGenerator from '../components/ProductGenerator'
import ShopCreator from '../components/ShopCreator'
import TrendFinder from '../components/TrendFinder'
import SpyTool from '../components/SpyTool'
import MarginCalculator from '../components/MarginCalculator'
import EmailGenerator from '../components/EmailGenerator'
import History from '../components/History'
import Dashboard from '../components/Dashboard'
import ThemeGenerator from '../components/ThemeGenerator'
import LegalGenerator from '../components/LegalGenerator'
import ViralScore from '../components/ViralScore'
import AdAnalyzer from '../components/AdAnalyzer'
import MultiShop from '../components/MultiShop'
import Chatbot from '../components/Chatbot'

const menu = [
  { id: 'dashboard', label: 'Dashboard', icon: '📈' },
  { id: 'chat', label: 'Conseiller IA', icon: '🤖' },
  { type: 'separator', label: 'Produits' },
  { id: 'generator', label: 'Générateur', icon: '⚡' },
  { id: 'viral', label: 'Score viral', icon: '🔥' },
  { id: 'trends', label: 'Tendances', icon: '📊' },
  { id: 'spy', label: 'Spy', icon: '🕵️' },
  { type: 'separator', label: 'Boutique' },
  { id: 'theme', label: 'Thème Shopify', icon: '🎨' },
  { id: 'shop', label: 'Créer un shop', icon: '🏪' },
  { id: 'shops', label: 'Mes shops', icon: '🗂️' },
  { type: 'separator', label: 'Marketing' },
  { id: 'ads', label: 'Pubs & UGC', icon: '🎯' },
  { id: 'email', label: 'Emails', icon: '📧' },
  { type: 'separator', label: 'Outils' },
  { id: 'margin', label: 'Marge', icon: '💰' },
  { id: 'legal', label: 'Documents légaux', icon: '⚖️' },
  { id: 'history', label: 'Historique', icon: '📋' },
]

export default function Home() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [menuOpen, setMenuOpen] = useState(false)

  const activeItem = menu.find(t => t.id === activeTab)

  return (
    <>
      <Head>
        <title>ShopBuilder — Ton outil dropshipping IA</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet" />
      </Head>

      <div className="app">
        <header className="mobile-header">
          <div className="logo">
            <span className="logo-icon">◈</span>
            <span className="logo-text">ShopBuilder</span>
          </div>
          <button className="menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? '✕' : '☰'}
          </button>
        </header>

        <aside className={`sidebar ${menuOpen ? 'open' : ''}`}>
          <div className="logo desktop-only">
            <span className="logo-icon">◈</span>
            <span className="logo-text">ShopBuilder</span>
          </div>
          <nav className="nav">
            {menu.map((item, i) => {
              if (item.type === 'separator') return (
                <div key={i} className="nav-separator">{item.label}</div>
              )
              return (
                <button
                  key={item.id}
                  className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
                  onClick={() => { setActiveTab(item.id); setMenuOpen(false) }}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-label">{item.label}</span>
                  {activeTab === item.id && <span className="nav-indicator" />}
                </button>
              )
            })}
          </nav>
          <div className="sidebar-footer">
            <div className="status-dot" />
            <span>IA connectée</span>
          </div>
        </aside>

        {menuOpen && <div className="overlay" onClick={() => setMenuOpen(false)} />}

        <main className="main">
          <div className="main-header">
            <h1 className="page-title">
              {activeItem?.icon} {activeItem?.label}
            </h1>
            <div className="badge">Powered by AI</div>
          </div>
          <div className="content">
            {activeTab === 'dashboard' && <Dashboard />}
            {activeTab === 'chat' && <Chatbot />}
            {activeTab === 'generator' && <ProductGenerator />}
            {activeTab === 'viral' && <ViralScore />}
            {activeTab === 'ads' && <AdAnalyzer />}
            {activeTab === 'theme' && <ThemeGenerator />}
            {activeTab === 'shop' && <ShopCreator />}
            {activeTab === 'shops' && <MultiShop />}
            {activeTab === 'trends' && <TrendFinder />}
            {activeTab === 'spy' && <SpyTool />}
            {activeTab === 'margin' && <MarginCalculator />}
            {activeTab === 'email' && <EmailGenerator />}
            {activeTab === 'legal' && <LegalGenerator />}
            {activeTab === 'history' && <History />}
          </div>
        </main>
      </div>

      <style jsx global>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        :root {
          --bg: #0a0a0f;
          --surface: #111118;
          --surface2: #1a1a24;
          --border: #ffffff0f;
          --accent: #7c5cfc;
          --accent2: #fc5c7d;
          --text: #f0f0ff;
          --muted: #888899;
          --success: #2ecc71;
          --radius: 14px;
          --sidebar-width: 220px;
        }
        body { background: var(--bg); color: var(--text); font-family: 'DM Sans', sans-serif; min-height: 100vh; }
        .app { display: flex; min-height: 100vh; }
        .mobile-header { display: none; position: fixed; top: 0; left: 0; right: 0; height: 56px; background: var(--surface); border-bottom: 1px solid var(--border); padding: 0 16px; align-items: center; justify-content: space-between; z-index: 100; }
        .menu-btn { background: var(--surface2); border: 1px solid var(--border); color: var(--text); width: 36px; height: 36px; border-radius: 8px; cursor: pointer; font-size: 16px; }
        .sidebar { width: var(--sidebar-width); background: var(--surface); border-right: 1px solid var(--border); display: flex; flex-direction: column; padding: 24px 12px; position: fixed; height: 100vh; top: 0; left: 0; z-index: 99; transition: transform 0.3s; overflow-y: auto; }
        .overlay { display: none; position: fixed; inset: 0; background: #00000080; z-index: 98; }
        .logo { display: flex; align-items: center; gap: 10px; padding: 8px 12px 20px; font-family: 'Syne', sans-serif; font-weight: 800; font-size: 18px; }
        .logo-icon { font-size: 22px; background: linear-gradient(135deg, var(--accent), var(--accent2)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .nav { display: flex; flex-direction: column; gap: 2px; flex: 1; }
        .nav-separator { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: var(--muted); padding: 12px 12px 4px; opacity: 0.6; }
        .nav-item { display: flex; align-items: center; gap: 10px; padding: 9px 12px; border-radius: 8px; border: none; background: transparent; color: var(--muted); cursor: pointer; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500; transition: all 0.2s; position: relative; text-align: left; width: 100%; }
        .nav-item:hover { background: var(--surface2); color: var(--text); }
        .nav-item.active { background: linear-gradient(135deg, #7c5cfc15, #fc5c7d10); color: var(--text); border: 1px solid #7c5cfc30; }
        .nav-indicator { width: 4px; height: 4px; background: var(--accent); border-radius: 50%; margin-left: auto; }
        .sidebar-footer { display: flex; align-items: center; gap: 8px; padding: 12px; font-size: 12px; color: var(--muted); border-top: 1px solid var(--border); margin-top: 8px; }
        .status-dot { width: 7px; height: 7px; background: var(--success); border-radius: 50%; box-shadow: 0 0 6px var(--success); }
        .main { margin-left: var(--sidebar-width); flex: 1; padding: 32px; min-height: 100vh; }
        .main-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 28px; }
        .page-title { font-family: 'Syne', sans-serif; font-size: 24px; font-weight: 800; letter-spacing: -0.5px; }
        .badge { font-size: 11px; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase; padding: 6px 12px; border-radius: 20px; background: linear-gradient(135deg, #7c5cfc20, #fc5c7d15); border: 1px solid #7c5cfc40; color: #a084fd; }
        .content { max-width: 860px; }
        .card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 20px; margin-bottom: 16px; }
        .card-title { font-family: 'Syne', sans-serif; font-size: 11px; font-weight: 700; margin-bottom: 16px; color: var(--muted); text-transform: uppercase; letter-spacing: 1px; }
        .input-group { margin-bottom: 14px; }
        .input-label { display: block; font-size: 13px; font-weight: 500; color: var(--muted); margin-bottom: 7px; }
        .input { width: 100%; background: var(--surface2); border: 1px solid var(--border); border-radius: 10px; padding: 11px 14px; color: var(--text); font-family: 'DM Sans', sans-serif; font-size: 14px; transition: border 0.2s; outline: none; }
        .input:focus { border-color: var(--accent); }
        .input::placeholder { color: var(--muted); }
        textarea.input { resize: vertical; min-height: 90px; }
        .btn { display: inline-flex; align-items: center; gap: 8px; padding: 11px 22px; border-radius: 10px; border: none; cursor: pointer; font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 600; transition: all 0.2s; }
        .btn-primary { background: linear-gradient(135deg, var(--accent), #9b7aff); color: white; }
        .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 8px 24px #7c5cfc40; }
        .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
        .btn-secondary { background: var(--surface2); color: var(--text); border: 1px solid var(--border); }
        .result-box { background: var(--surface2); border: 1px solid var(--border); border-radius: 10px; padding: 16px; margin-top: 16px; white-space: pre-wrap; font-size: 14px; line-height: 1.7; }
        .loading { display: flex; align-items: center; gap: 10px; color: var(--muted); font-size: 14px; padding: 16px 0; }
        .spinner { width: 18px; height: 18px; border: 2px solid var(--border); border-top-color: var(--accent); border-radius: 50%; animation: spin 0.8s linear infinite; flex-shrink: 0; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .success-banner { background: #2ecc7115; border: 1px solid #2ecc7130; border-radius: 10px; padding: 12px 16px; color: var(--success); font-size: 14px; margin-top: 14px; }
        .error-banner { background: #e74c3c15; border: 1px solid #e74c3c30; border-radius: 10px; padding: 12px 16px; color: #e74c3c; font-size: 14px; margin-top: 14px; }
        .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .tag { display: inline-flex; align-items: center; padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 600; background: #7c5cfc20; color: #a084fd; border: 1px solid #7c5cfc30; margin: 3px; }
        @media (max-width: 768px) {
          .mobile-header { display: flex; }
          .desktop-only { display: none; }
          .sidebar { transform: translateX(-100%); top: 56px; height: calc(100vh - 56px); padding-top: 16px; }
          .sidebar.open { transform: translateX(0); }
          .overlay { display: block; }
          .main { margin-left: 0; padding: 76px 16px 24px; }
          .grid-2 { grid-template-columns: 1fr; }
          .page-title { font-size: 20px; }
          .btn { width: 100%; justify-content: center; }
          .main-header { flex-wrap: wrap; gap: 8px; }
        }
      `}</style>
    </>
  )
}
