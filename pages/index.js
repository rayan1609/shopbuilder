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
import CompetitorFinder from '../components/CompetitorFinder'
import PricingStrategy from '../components/PricingStrategy'
import LaunchChecklist from '../components/LaunchChecklist'
import BrandName from '../components/BrandName'
import ImageImporter from '../components/ImageImporter'
import AdVisualCreator from '../components/AdVisualCreator'
import TrendAlerts from '../components/TrendAlerts'
import CheckoutPage from '../components/CheckoutPage'

const menu = [
  {
    section: null,
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: '📈' },
      { id: 'chat', label: 'Conseiller IA', icon: '🤖' },
    ]
  },
  {
    section: 'Produits',
    items: [
      { id: 'generator', label: 'Générateur', icon: '⚡' },
      { id: 'images', label: 'Import photos', icon: '🖼️' },
      { id: 'viral', label: 'Score viral', icon: '🔥' },
      { id: 'trends', label: 'Tendances', icon: '📊' },
      { id: 'alerts', label: 'Alertes', icon: '🔔' },
      { id: 'pricing', label: 'Stratégie prix', icon: '💰' },
    ]
  },
  {
    section: 'Boutique',
    items: [
      { id: 'theme', label: 'Thème Shopify', icon: '🎨' },
      { id: 'shop', label: 'Créer un shop', icon: '🏪' },
      { id: 'shops', label: 'Mes shops', icon: '🗂️' },
      { id: 'brand', label: 'Nom de marque', icon: '✨' },
      { id: 'launch', label: 'Checklist', icon: '🚀' },
    ]
  },
  {
    section: 'Concurrence',
    items: [
      { id: 'spy', label: 'Spy shops', icon: '🕵️' },
      { id: 'competitors', label: 'Concurrents', icon: '🔍' },
    ]
  },
  {
    section: 'Marketing',
    items: [
      { id: 'ads', label: 'Pubs & UGC', icon: '🎯' },
      { id: 'advisual', label: 'Créateur visuels', icon: '🎨' },
      { id: 'email', label: 'Emails', icon: '📧' },
      { id: 'checkout', label: 'Page paiement', icon: '💳' },
    ]
  },
  {
    section: 'Outils',
    items: [
      { id: 'margin', label: 'Calculateur marge', icon: '📊' },
      { id: 'legal', label: 'Documents légaux', icon: '⚖️' },
      { id: 'history', label: 'Historique', icon: '📋' },
    ]
  },
]

const allItems = menu.flatMap(g => g.items)

const components = {
  dashboard: Dashboard, chat: Chatbot, generator: ProductGenerator,
  images: ImageImporter, viral: ViralScore, trends: TrendFinder,
  alerts: TrendAlerts, pricing: PricingStrategy, theme: ThemeGenerator,
  shop: ShopCreator, shops: MultiShop, brand: BrandName,
  launch: LaunchChecklist, spy: SpyTool, competitors: CompetitorFinder,
  ads: AdAnalyzer, advisual: AdVisualCreator, email: EmailGenerator,
  checkout: CheckoutPage, margin: MarginCalculator, legal: LegalGenerator,
  history: History,
}

export default function Home() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [menuOpen, setMenuOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)

  const activeItem = allItems.find(t => t.id === activeTab)
  const ActiveComponent = components[activeTab]

  return (
    <>
      <Head>
        <title>ShopBuilder</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#7c5cfc" />
        <link href="https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet" />
      </Head>

      <div className="layout">
        {/* Mobile overlay */}
        {menuOpen && <div className="overlay" onClick={() => setMenuOpen(false)} />}

        {/* Sidebar */}
        <aside className={`sidebar ${collapsed ? 'collapsed' : ''} ${menuOpen ? 'open' : ''}`}>
          {/* Logo */}
          <div className="sidebar-logo">
            <div className="logo-mark">◈</div>
            {!collapsed && <span className="logo-text">ShopBuilder</span>}
            <button className="collapse-btn desktop-only" onClick={() => setCollapsed(!collapsed)}>
              {collapsed ? '›' : '‹'}
            </button>
          </div>

          {/* Nav */}
          <nav className="sidebar-nav">
            {menu.map((group, gi) => (
              <div key={gi} className="nav-group">
                {group.section && !collapsed && (
                  <div className="nav-section">{group.section}</div>
                )}
                {group.items.map(item => (
                  <button
                    key={item.id}
                    className={`nav-btn ${activeTab === item.id ? 'active' : ''}`}
                    onClick={() => { setActiveTab(item.id); setMenuOpen(false) }}
                    title={collapsed ? item.label : ''}
                  >
                    <span className="nav-icon">{item.icon}</span>
                    {!collapsed && <span className="nav-label">{item.label}</span>}
                    {activeTab === item.id && !collapsed && <span className="nav-dot" />}
                  </button>
                ))}
              </div>
            ))}
          </nav>

          {/* Status */}
          <div className="sidebar-status">
            <div className="status-indicator" />
            {!collapsed && <span>IA connectée</span>}
          </div>
        </aside>

        {/* Main */}
        <div className="main-wrapper">
          {/* Topbar */}
          <header className="topbar">
            <div className="topbar-left">
              <button className="mobile-menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
                {menuOpen ? '✕' : '☰'}
              </button>
              <div className="breadcrumb">
                <span className="breadcrumb-root">ShopBuilder</span>
                <span className="breadcrumb-sep">›</span>
                <span className="breadcrumb-current">{activeItem?.icon} {activeItem?.label}</span>
              </div>
            </div>
            <div className="topbar-right">
              <div className="topbar-badge">AI Powered</div>
            </div>
          </header>

          {/* Content */}
          <main className="main-content">
            <div className="content-inner">
              {ActiveComponent && <ActiveComponent />}
            </div>
          </main>
        </div>
      </div>

      <style jsx global>{`
        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

        :root {
          --bg: #09090f;
          --surface: #0f0f1a;
          --surface2: #161625;
          --surface3: #1c1c2e;
          --border: rgba(255,255,255,0.06);
          --border2: rgba(255,255,255,0.1);
          --accent: #7c5cfc;
          --accent2: #fc5c7d;
          --accent-glow: rgba(124,92,252,0.15);
          --text: #f0f0ff;
          --text2: #a0a0b8;
          --text3: #606078;
          --success: #22c55e;
          --warning: #f59e0b;
          --danger: #ef4444;
          --sidebar-w: 240px;
          --sidebar-collapsed: 64px;
          --topbar-h: 56px;
          --radius: 12px;
          --radius-sm: 8px;
          --radius-lg: 16px;
        }

        body {
          background: var(--bg);
          color: var(--text);
          font-family: 'Inter', -apple-system, sans-serif;
          font-size: 14px;
          line-height: 1.5;
          min-height: 100vh;
          -webkit-font-smoothing: antialiased;
        }

        /* Layout */
        .layout { display: flex; min-height: 100vh; }

        /* Overlay */
        .overlay {
          display: none;
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.7);
          z-index: 98;
          backdrop-filter: blur(4px);
        }

        /* Sidebar */
        .sidebar {
          width: var(--sidebar-w);
          background: var(--surface);
          border-right: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          position: fixed;
          height: 100vh;
          top: 0; left: 0;
          z-index: 99;
          transition: width 0.25s cubic-bezier(0.4,0,0.2,1), transform 0.25s;
          overflow: hidden;
        }

        .sidebar.collapsed { width: var(--sidebar-collapsed); }

        .sidebar-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 18px 16px;
          border-bottom: 1px solid var(--border);
          min-height: 64px;
          flex-shrink: 0;
        }

        .logo-mark {
          width: 32px; height: 32px;
          background: linear-gradient(135deg, var(--accent), var(--accent2));
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          font-size: 16px;
          flex-shrink: 0;
          box-shadow: 0 0 20px rgba(124,92,252,0.3);
        }

        .logo-text {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: 17px;
          background: linear-gradient(135deg, var(--text), var(--text2));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          white-space: nowrap;
        }

        .collapse-btn {
          margin-left: auto;
          background: var(--surface2);
          border: 1px solid var(--border);
          color: var(--text3);
          width: 24px; height: 24px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.2s;
          flex-shrink: 0;
        }

        .collapse-btn:hover { color: var(--text); border-color: var(--border2); }

        .sidebar-nav {
          flex: 1;
          overflow-y: auto;
          overflow-x: hidden;
          padding: 8px 8px;
          scrollbar-width: none;
        }

        .sidebar-nav::-webkit-scrollbar { display: none; }

        .nav-group { margin-bottom: 4px; }

        .nav-section {
          font-size: 10px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1.2px;
          color: var(--text3);
          padding: 12px 10px 4px;
          white-space: nowrap;
        }

        .nav-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
          padding: 8px 10px;
          border-radius: var(--radius-sm);
          border: none;
          background: transparent;
          color: var(--text2);
          cursor: pointer;
          font-family: 'Inter', sans-serif;
          font-size: 13px;
          font-weight: 500;
          transition: all 0.15s;
          position: relative;
          text-align: left;
          white-space: nowrap;
        }

        .nav-btn:hover {
          background: var(--surface2);
          color: var(--text);
        }

        .nav-btn.active {
          background: var(--accent-glow);
          color: var(--text);
          border: 1px solid rgba(124,92,252,0.2);
        }

        .nav-icon { font-size: 15px; flex-shrink: 0; width: 20px; text-align: center; }
        .nav-label { flex: 1; }
        .nav-dot { width: 5px; height: 5px; background: var(--accent); border-radius: 50%; flex-shrink: 0; }

        .sidebar-status {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 14px 16px;
          border-top: 1px solid var(--border);
          font-size: 12px;
          color: var(--text3);
          flex-shrink: 0;
          white-space: nowrap;
        }

        .status-indicator {
          width: 7px; height: 7px;
          background: var(--success);
          border-radius: 50%;
          box-shadow: 0 0 8px var(--success);
          flex-shrink: 0;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        /* Main wrapper */
        .main-wrapper {
          flex: 1;
          margin-left: var(--sidebar-w);
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          transition: margin-left 0.25s;
        }

        /* Topbar */
        .topbar {
          height: var(--topbar-h);
          background: var(--surface);
          border-bottom: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 24px;
          position: sticky;
          top: 0;
          z-index: 50;
          backdrop-filter: blur(12px);
        }

        .topbar-left { display: flex; align-items: center; gap: 12px; }

        .mobile-menu-btn {
          display: none;
          background: var(--surface2);
          border: 1px solid var(--border);
          color: var(--text);
          width: 34px; height: 34px;
          border-radius: var(--radius-sm);
          cursor: pointer;
          font-size: 15px;
          align-items: center; justify-content: center;
        }

        .breadcrumb { display: flex; align-items: center; gap: 8px; font-size: 13px; }
        .breadcrumb-root { color: var(--text3); }
        .breadcrumb-sep { color: var(--text3); }
        .breadcrumb-current { color: var(--text); font-weight: 600; }

        .topbar-right { display: flex; align-items: center; gap: 10px; }

        .topbar-badge {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.5px;
          padding: 5px 12px;
          border-radius: 20px;
          background: var(--accent-glow);
          border: 1px solid rgba(124,92,252,0.3);
          color: #a084fd;
        }

        /* Main content */
        .main-content {
          flex: 1;
          padding: 28px 28px;
          overflow-y: auto;
        }

        .content-inner { max-width: 900px; }

        /* Cards */
        .card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: 20px;
          margin-bottom: 16px;
          transition: border-color 0.2s;
        }

        .card:hover { border-color: var(--border2); }

        .card-title {
          font-family: 'Syne', sans-serif;
          font-size: 11px;
          font-weight: 700;
          margin-bottom: 16px;
          color: var(--text3);
          text-transform: uppercase;
          letter-spacing: 1.2px;
        }

        /* Inputs */
        .input-group { margin-bottom: 14px; }

        .input-label {
          display: block;
          font-size: 12px;
          font-weight: 500;
          color: var(--text2);
          margin-bottom: 6px;
          letter-spacing: 0.3px;
        }

        .input {
          width: 100%;
          background: var(--surface2);
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          padding: 10px 14px;
          color: var(--text);
          font-family: 'Inter', sans-serif;
          font-size: 13px;
          transition: border-color 0.2s, box-shadow 0.2s;
          outline: none;
        }

        .input:focus {
          border-color: rgba(124,92,252,0.5);
          box-shadow: 0 0 0 3px rgba(124,92,252,0.1);
        }

        .input::placeholder { color: var(--text3); }
        textarea.input { resize: vertical; min-height: 88px; }

        select.input {
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23888' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 12px center;
          padding-right: 32px;
        }

        /* Buttons */
        .btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          padding: 10px 20px;
          border-radius: var(--radius-sm);
          border: none;
          cursor: pointer;
          font-family: 'Inter', sans-serif;
          font-size: 13px;
          font-weight: 600;
          transition: all 0.2s;
          white-space: nowrap;
        }

        .btn-primary {
          background: linear-gradient(135deg, var(--accent), #9b7aff);
          color: white;
          box-shadow: 0 2px 12px rgba(124,92,252,0.25);
        }

        .btn-primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 20px rgba(124,92,252,0.4);
        }

        .btn-primary:active { transform: translateY(0); }
        .btn-primary:disabled { opacity: 0.45; cursor: not-allowed; transform: none; box-shadow: none; }

        .btn-secondary {
          background: var(--surface2);
          color: var(--text2);
          border: 1px solid var(--border);
        }

        .btn-secondary:hover {
          background: var(--surface3);
          color: var(--text);
          border-color: var(--border2);
        }

        /* Misc */
        .result-box {
          background: var(--surface2);
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          padding: 14px;
          white-space: pre-wrap;
          font-size: 13px;
          line-height: 1.7;
          color: var(--text2);
        }

        .loading {
          display: flex;
          align-items: center;
          gap: 10px;
          color: var(--text3);
          font-size: 13px;
          padding: 14px 0;
        }

        .spinner {
          width: 16px; height: 16px;
          border: 2px solid var(--border);
          border-top-color: var(--accent);
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          flex-shrink: 0;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        .success-banner {
          background: rgba(34,197,94,0.08);
          border: 1px solid rgba(34,197,94,0.2);
          border-radius: var(--radius-sm);
          padding: 11px 14px;
          color: var(--success);
          font-size: 13px;
          margin-top: 12px;
        }

        .error-banner {
          background: rgba(239,68,68,0.08);
          border: 1px solid rgba(239,68,68,0.2);
          border-radius: var(--radius-sm);
          padding: 11px 14px;
          color: var(--danger);
          font-size: 13px;
          margin-top: 12px;
        }

        .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }

        .tag {
          display: inline-flex;
          align-items: center;
          padding: 3px 10px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 600;
          background: rgba(124,92,252,0.12);
          color: #a084fd;
          border: 1px solid rgba(124,92,252,0.2);
          margin: 2px;
        }

        /* Mobile */
        @media (max-width: 768px) {
          .mobile-menu-btn { display: flex; }
          .desktop-only { display: none !important; }
          .overlay { display: block; }

          .sidebar {
            transform: translateX(-100%);
            width: var(--sidebar-w) !important;
          }

          .sidebar.open { transform: translateX(0); }

          .main-wrapper { margin-left: 0; }

          .topbar { padding: 0 16px; }

          .main-content { padding: 16px; }

          .grid-2 { grid-template-columns: 1fr; }

          .btn { width: 100%; }
        }

        /* Collapsed sidebar adjustments */
        .sidebar.collapsed + .main-wrapper {
          margin-left: var(--sidebar-collapsed);
        }

        /* Scrollbar */
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 2px; }
      `}</style>
    </>
  )
}
