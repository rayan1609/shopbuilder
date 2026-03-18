import Head from 'next/head'
import { useState, useEffect, useRef } from 'react'
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
  { section: null, items: [
    { id: 'dashboard', label: 'Dashboard', icon: '▲', emoji: '📈' },
    { id: 'chat', label: 'Conseiller IA', icon: '◈', emoji: '🤖' },
  ]},
  { section: 'Produits', items: [
    { id: 'generator', label: 'Générateur', icon: '⚡', emoji: '⚡' },
    { id: 'images', label: 'Import photos', icon: '◻', emoji: '🖼️' },
    { id: 'viral', label: 'Score viral', icon: '◉', emoji: '🔥' },
    { id: 'trends', label: 'Tendances', icon: '↑', emoji: '📊' },
    { id: 'alerts', label: 'Alertes', icon: '◎', emoji: '🔔' },
    { id: 'pricing', label: 'Stratégie prix', icon: '$', emoji: '💰' },
  ]},
  { section: 'Boutique', items: [
    { id: 'theme', label: 'Thème Shopify', icon: '◧', emoji: '🎨' },
    { id: 'shop', label: 'Créer un shop', icon: '⬡', emoji: '🏪' },
    { id: 'shops', label: 'Mes shops', icon: '▣', emoji: '🗂️' },
    { id: 'brand', label: 'Nom de marque', icon: '✦', emoji: '✨' },
    { id: 'launch', label: 'Checklist', icon: '✓', emoji: '🚀' },
  ]},
  { section: 'Concurrence', items: [
    { id: 'spy', label: 'Spy shops', icon: '◐', emoji: '🕵️' },
    { id: 'competitors', label: 'Concurrents', icon: '⊕', emoji: '🔍' },
  ]},
  { section: 'Marketing', items: [
    { id: 'ads', label: 'Pubs & UGC', icon: '▶', emoji: '🎯' },
    { id: 'advisual', label: 'Créateur visuels', icon: '◈', emoji: '🎨' },
    { id: 'email', label: 'Emails', icon: '◻', emoji: '📧' },
    { id: 'checkout', label: 'Page paiement', icon: '◉', emoji: '💳' },
  ]},
  { section: 'Outils', items: [
    { id: 'margin', label: 'Calculateur', icon: '%', emoji: '📊' },
    { id: 'legal', label: 'Documents légaux', icon: '§', emoji: '⚖️' },
    { id: 'history', label: 'Historique', icon: '↺', emoji: '📋' },
  ]},
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

function Orb({ style }) {
  return <div className="orb" style={style} />
}

export default function Home() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [menuOpen, setMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [transitioning, setTransitioning] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  const navigate = (id) => {
    if (id === activeTab) return
    setTransitioning(true)
    setTimeout(() => {
      setActiveTab(id)
      setMenuOpen(false)
      setTransitioning(false)
    }, 150)
  }

  const activeItem = allItems.find(t => t.id === activeTab)
  const ActiveComponent = components[activeTab]

  if (!mounted) return null

  return (
    <>
      <Head>
        <title>ShopBuilder — Dropshipping IA</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#6d28d9" />
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet" />
      </Head>

      <div className={`app ${menuOpen ? 'menu-open' : ''}`}>
        {/* Ambient orbs */}
        <Orb style={{ top: '-20vh', left: '-10vw', width: '60vw', height: '60vw', background: 'radial-gradient(circle, rgba(109,40,217,0.15) 0%, transparent 70%)' }} />
        <Orb style={{ bottom: '-10vh', right: '-5vw', width: '40vw', height: '40vw', background: 'radial-gradient(circle, rgba(236,72,153,0.1) 0%, transparent 70%)' }} />

        {/* Overlay mobile */}
        {menuOpen && <div className="overlay" onClick={() => setMenuOpen(false)} />}

        {/* SIDEBAR */}
        <aside className={`sidebar ${menuOpen ? 'open' : ''}`}>
          <div className="sidebar-inner">
            {/* Logo */}
            <div className="logo-area">
              <div className="logo-gem">
                <span>◈</span>
              </div>
              <div className="logo-info">
                <span className="logo-name">ShopBuilder</span>
                <span className="logo-sub">Dropshipping IA</span>
              </div>
            </div>

            {/* Nav */}
            <nav className="nav">
              {menu.map((group, gi) => (
                <div key={gi} className="nav-group">
                  {group.section && (
                    <div className="nav-section-label">{group.section}</div>
                  )}
                  {group.items.map(item => (
                    <button
                      key={item.id}
                      className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
                      onClick={() => navigate(item.id)}
                    >
                      <span className="nav-item-icon">{item.emoji}</span>
                      <span className="nav-item-label">{item.label}</span>
                      {activeTab === item.id && <span className="nav-item-active-dot" />}
                    </button>
                  ))}
                </div>
              ))}
            </nav>

            {/* Footer */}
            <div className="sidebar-footer">
              <div className="ai-badge">
                <div className="ai-pulse" />
                <span>IA active</span>
              </div>
            </div>
          </div>
        </aside>

        {/* MAIN */}
        <div className="main">
          {/* Header */}
          <header className="header">
            <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
              <span /><span /><span />
            </button>
            <div className="header-title">
              <span className="header-emoji">{activeItem?.emoji}</span>
              <span className="header-text">{activeItem?.label}</span>
            </div>
            <div className="header-right">
              <div className="header-pill">
                <span className="header-pill-dot" />
                AI Powered
              </div>
            </div>
          </header>

          {/* Content */}
          <main className={`content ${transitioning ? 'fade-out' : 'fade-in'}`}>
            {ActiveComponent && <ActiveComponent />}
          </main>
        </div>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap');

        *, *::before, *::after {
          margin: 0; padding: 0; box-sizing: border-box;
        }

        :root {
          --c-bg: #06060f;
          --c-surface: rgba(255,255,255,0.03);
          --c-surface-hover: rgba(255,255,255,0.06);
          --c-border: rgba(255,255,255,0.07);
          --c-border-active: rgba(139,92,246,0.4);
          --c-text: #f1f0ff;
          --c-text2: #8b8aaa;
          --c-text3: #4a4968;
          --c-accent: #8b5cf6;
          --c-accent2: #ec4899;
          --c-accent3: #06b6d4;
          --c-success: #10b981;
          --c-danger: #f43f5e;
          --c-warning: #f59e0b;
          --sidebar-w: 248px;
          --header-h: 60px;
          --r: 14px;
          --r-sm: 9px;
          --r-lg: 20px;
        }

        html, body {
          background: var(--c-bg);
          color: var(--c-text);
          font-family: 'Outfit', sans-serif;
          font-size: 14px;
          line-height: 1.55;
          min-height: 100vh;
          -webkit-font-smoothing: antialiased;
          overflow-x: hidden;
        }

        /* Background grid */
        body::before {
          content: '';
          position: fixed;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px);
          background-size: 40px 40px;
          pointer-events: none;
          z-index: 0;
        }

        .orb {
          position: fixed;
          border-radius: 50%;
          pointer-events: none;
          z-index: 0;
          filter: blur(60px);
        }

        /* App */
        .app {
          display: flex;
          min-height: 100vh;
          position: relative;
          z-index: 1;
        }

        .overlay {
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.6);
          backdrop-filter: blur(8px);
          z-index: 98;
        }

        /* SIDEBAR */
        .sidebar {
          width: var(--sidebar-w);
          position: fixed;
          top: 0; left: 0; bottom: 0;
          z-index: 99;
          transition: transform 0.3s cubic-bezier(0.4,0,0.2,1);
        }

        .sidebar-inner {
          width: 100%;
          height: 100%;
          background: rgba(10,9,20,0.85);
          backdrop-filter: blur(24px);
          border-right: 1px solid var(--c-border);
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        /* Logo */
        .logo-area {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 20px 18px;
          border-bottom: 1px solid var(--c-border);
          flex-shrink: 0;
        }

        .logo-gem {
          width: 38px; height: 38px;
          background: linear-gradient(135deg, #8b5cf6, #ec4899);
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          font-size: 18px;
          flex-shrink: 0;
          box-shadow: 0 0 24px rgba(139,92,246,0.4), inset 0 1px 0 rgba(255,255,255,0.2);
          animation: gem-glow 3s ease-in-out infinite;
        }

        @keyframes gem-glow {
          0%, 100% { box-shadow: 0 0 24px rgba(139,92,246,0.4), inset 0 1px 0 rgba(255,255,255,0.2); }
          50% { box-shadow: 0 0 40px rgba(139,92,246,0.6), inset 0 1px 0 rgba(255,255,255,0.3); }
        }

        .logo-name {
          display: block;
          font-weight: 800;
          font-size: 16px;
          letter-spacing: -0.3px;
          color: var(--c-text);
        }

        .logo-sub {
          display: block;
          font-size: 11px;
          color: var(--c-text3);
          font-weight: 400;
        }

        /* Nav */
        .nav {
          flex: 1;
          overflow-y: auto;
          padding: 10px 10px;
          scrollbar-width: none;
        }

        .nav::-webkit-scrollbar { display: none; }

        .nav-group { margin-bottom: 6px; }

        .nav-section-label {
          font-size: 9.5px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1.8px;
          color: var(--c-text3);
          padding: 10px 10px 5px;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
          padding: 8.5px 10px;
          border-radius: var(--r-sm);
          border: 1px solid transparent;
          background: transparent;
          color: var(--c-text2);
          cursor: pointer;
          font-family: 'Outfit', sans-serif;
          font-size: 13.5px;
          font-weight: 500;
          transition: all 0.18s ease;
          text-align: left;
          position: relative;
          overflow: hidden;
        }

        .nav-item::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(139,92,246,0.08), rgba(236,72,153,0.04));
          opacity: 0;
          transition: opacity 0.18s;
        }

        .nav-item:hover {
          color: var(--c-text);
          border-color: var(--c-border);
          background: var(--c-surface-hover);
          transform: translateX(2px);
        }

        .nav-item:hover::before { opacity: 1; }

        .nav-item.active {
          color: #c4b5fd;
          border-color: rgba(139,92,246,0.25);
          background: rgba(139,92,246,0.08);
        }

        .nav-item.active::before { opacity: 1; }

        .nav-item-icon {
          font-size: 15px;
          width: 22px;
          text-align: center;
          flex-shrink: 0;
        }

        .nav-item-label { flex: 1; }

        .nav-item-active-dot {
          width: 5px; height: 5px;
          background: var(--c-accent);
          border-radius: 50%;
          box-shadow: 0 0 8px var(--c-accent);
          flex-shrink: 0;
        }

        /* Sidebar footer */
        .sidebar-footer {
          padding: 14px 16px;
          border-top: 1px solid var(--c-border);
          flex-shrink: 0;
        }

        .ai-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          color: var(--c-text3);
        }

        .ai-pulse {
          width: 8px; height: 8px;
          background: var(--c-success);
          border-radius: 50%;
          animation: ai-ping 2s ease-in-out infinite;
          box-shadow: 0 0 0 0 rgba(16,185,129,0.4);
        }

        @keyframes ai-ping {
          0%, 100% { box-shadow: 0 0 0 0 rgba(16,185,129,0.4); }
          50% { box-shadow: 0 0 0 6px rgba(16,185,129,0); }
        }

        /* MAIN */
        .main {
          flex: 1;
          margin-left: var(--sidebar-w);
          display: flex;
          flex-direction: column;
          min-height: 100vh;
        }

        /* Header */
        .header {
          height: var(--header-h);
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 0 28px;
          position: sticky;
          top: 0;
          z-index: 50;
          background: rgba(6,6,15,0.8);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--c-border);
        }

        .hamburger {
          display: none;
          flex-direction: column;
          gap: 5px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
        }

        .hamburger span {
          display: block;
          width: 20px; height: 2px;
          background: var(--c-text2);
          border-radius: 2px;
          transition: all 0.2s;
        }

        .header-title {
          display: flex;
          align-items: center;
          gap: 10px;
          flex: 1;
        }

        .header-emoji { font-size: 18px; }

        .header-text {
          font-size: 17px;
          font-weight: 700;
          color: var(--c-text);
          letter-spacing: -0.3px;
        }

        .header-right { display: flex; align-items: center; gap: 10px; }

        .header-pill {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 5px 12px;
          border-radius: 20px;
          background: rgba(139,92,246,0.1);
          border: 1px solid rgba(139,92,246,0.2);
          font-size: 11.5px;
          font-weight: 600;
          color: #c4b5fd;
          letter-spacing: 0.3px;
        }

        .header-pill-dot {
          width: 6px; height: 6px;
          background: var(--c-accent);
          border-radius: 50%;
          box-shadow: 0 0 6px var(--c-accent);
          animation: ai-ping 2s ease-in-out infinite;
        }

        /* Content */
        .content {
          flex: 1;
          padding: 28px;
          max-width: 920px;
        }

        .fade-in {
          animation: fade-in 0.2s ease forwards;
        }

        .fade-out {
          animation: fade-out 0.15s ease forwards;
        }

        @keyframes fade-in {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes fade-out {
          from { opacity: 1; }
          to { opacity: 0; }
        }

        /* ─── SHARED COMPONENTS ─── */

        .card {
          background: rgba(255,255,255,0.03);
          border: 1px solid var(--c-border);
          border-radius: var(--r-lg);
          padding: 22px;
          margin-bottom: 16px;
          backdrop-filter: blur(8px);
          transition: border-color 0.2s, box-shadow 0.2s;
          position: relative;
          overflow: hidden;
        }

        .card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(139,92,246,0.3), transparent);
          opacity: 0;
          transition: opacity 0.3s;
        }

        .card:hover { border-color: rgba(139,92,246,0.15); }
        .card:hover::before { opacity: 1; }

        .card-title {
          font-size: 10.5px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          color: var(--c-text3);
          margin-bottom: 18px;
        }

        .input-group { margin-bottom: 14px; }

        .input-label {
          display: block;
          font-size: 12px;
          font-weight: 600;
          color: var(--c-text2);
          margin-bottom: 7px;
          letter-spacing: 0.2px;
        }

        .input {
          width: 100%;
          background: rgba(255,255,255,0.04);
          border: 1px solid var(--c-border);
          border-radius: var(--r-sm);
          padding: 11px 14px;
          color: var(--c-text);
          font-family: 'Outfit', sans-serif;
          font-size: 14px;
          font-weight: 400;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
          outline: none;
        }

        .input:focus {
          border-color: rgba(139,92,246,0.5);
          background: rgba(139,92,246,0.05);
          box-shadow: 0 0 0 3px rgba(139,92,246,0.08), inset 0 0 0 1px rgba(139,92,246,0.1);
        }

        .input::placeholder { color: var(--c-text3); }
        textarea.input { resize: vertical; min-height: 90px; }

        select.input {
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath fill='%236b6b8a' d='M5 6L0 0h10z'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 14px center;
          padding-right: 36px;
          cursor: pointer;
        }

        /* BUTTONS — premium */
        .btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 11px 22px;
          border-radius: var(--r-sm);
          border: none;
          cursor: pointer;
          font-family: 'Outfit', sans-serif;
          font-size: 14px;
          font-weight: 600;
          transition: all 0.2s cubic-bezier(0.4,0,0.2,1);
          position: relative;
          overflow: hidden;
          letter-spacing: 0.1px;
        }

        .btn::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 50%);
          opacity: 0;
          transition: opacity 0.2s;
        }

        .btn:hover::after { opacity: 1; }

        .btn-primary {
          background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 50%, #6d28d9 100%);
          color: white;
          box-shadow: 0 2px 0 rgba(0,0,0,0.3), 0 4px 16px rgba(139,92,246,0.3), inset 0 1px 0 rgba(255,255,255,0.15);
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 0 rgba(0,0,0,0.3), 0 8px 24px rgba(139,92,246,0.45), inset 0 1px 0 rgba(255,255,255,0.2);
        }

        .btn-primary:active {
          transform: translateY(0px);
          box-shadow: 0 1px 0 rgba(0,0,0,0.3), 0 2px 8px rgba(139,92,246,0.3);
        }

        .btn-primary:disabled {
          opacity: 0.4;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .btn-secondary {
          background: rgba(255,255,255,0.05);
          color: var(--c-text2);
          border: 1px solid var(--c-border);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.05);
        }

        .btn-secondary:hover {
          background: rgba(255,255,255,0.08);
          color: var(--c-text);
          border-color: rgba(255,255,255,0.12);
          transform: translateY(-1px);
        }

        /* Result box */
        .result-box {
          background: rgba(255,255,255,0.03);
          border: 1px solid var(--c-border);
          border-radius: var(--r-sm);
          padding: 16px;
          white-space: pre-wrap;
          font-size: 13.5px;
          line-height: 1.75;
          color: var(--c-text2);
          font-family: 'Outfit', sans-serif;
        }

        /* Loading */
        .loading {
          display: flex;
          align-items: center;
          gap: 10px;
          color: var(--c-text3);
          font-size: 13px;
          padding: 14px 0;
        }

        .spinner {
          width: 18px; height: 18px;
          border: 2px solid rgba(139,92,246,0.2);
          border-top-color: var(--c-accent);
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          flex-shrink: 0;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        /* Banners */
        .success-banner {
          background: rgba(16,185,129,0.08);
          border: 1px solid rgba(16,185,129,0.2);
          border-radius: var(--r-sm);
          padding: 12px 16px;
          color: var(--c-success);
          font-size: 13px;
          margin-top: 12px;
          display: flex; align-items: center; gap: 8px;
        }

        .error-banner {
          background: rgba(244,63,94,0.08);
          border: 1px solid rgba(244,63,94,0.2);
          border-radius: var(--r-sm);
          padding: 12px 16px;
          color: var(--c-danger);
          font-size: 13px;
          margin-top: 12px;
        }

        /* Grid */
        .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }

        /* Tags */
        .tag {
          display: inline-flex;
          align-items: center;
          padding: 4px 11px;
          border-radius: 20px;
          font-size: 11.5px;
          font-weight: 600;
          background: rgba(139,92,246,0.1);
          color: #c4b5fd;
          border: 1px solid rgba(139,92,246,0.18);
          margin: 2px;
          letter-spacing: 0.2px;
        }

        /* Scrollbar */
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }

        /* Mobile */
        @media (max-width: 768px) {
          .sidebar { transform: translateX(-100%); }
          .sidebar.open { transform: translateX(0); }
          .hamburger { display: flex; }
          .main { margin-left: 0; }
          .header { padding: 0 16px; }
          .content { padding: 16px; }
          .grid-2 { grid-template-columns: 1fr; }
          .btn { width: 100%; }
        }
      `}</style>
    </>
  )
}
