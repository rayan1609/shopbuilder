import Head from 'next/head'
import { useState } from 'react'
import ProductGenerator from '../components/ProductGenerator'
import ShopCreator from '../components/ShopCreator'
import TrendFinder from '../components/TrendFinder'
import SpyTool from '../components/SpyTool'

export default function Home() {
  const [activeTab, setActiveTab] = useState('generator')

  const tabs = [
    { id: 'generator', label: 'Générateur de fiche', icon: '⚡' },
    { id: 'shop', label: 'Créer un shop', icon: '🏪' },
    { id: 'trends', label: 'Produits viraux', icon: '🔥' },
    { id: 'spy', label: 'Spy concurrents', icon: '🕵️' },
  ]

  return (
    <>
      <Head>
        <title>ShopBuilder — Ton outil dropshipping IA</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet" />
      </Head>

      <div className="app">
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="logo">
            <span className="logo-icon">◈</span>
            <span className="logo-text">ShopBuilder</span>
          </div>

          <nav className="nav">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="nav-icon">{tab.icon}</span>
                <span className="nav-label">{tab.label}</span>
                {activeTab === tab.id && <span className="nav-indicator" />}
              </button>
            ))}
          </nav>

          <div className="sidebar-footer">
            <div className="status-dot" />
            <span>IA connectée</span>
          </div>
        </aside>

        {/* Main content */}
        <main className="main">
          <div className="main-header">
            <h1 className="page-title">
              {tabs.find(t => t.id === activeTab)?.icon}{' '}
              {tabs.find(t => t.id === activeTab)?.label}
            </h1>
            <div className="badge">Powered by Claude AI</div>
          </div>

          <div className="content">
            {activeTab === 'generator' && <ProductGenerator />}
            {activeTab === 'shop' && <ShopCreator />}
            {activeTab === 'trends' && <TrendFinder />}
            {activeTab === 'spy' && <SpyTool />}
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
        }

        body {
          background: var(--bg);
          color: var(--text);
          font-family: 'DM Sans', sans-serif;
          min-height: 100vh;
          overflow-x: hidden;
        }

        .app {
          display: flex;
          min-height: 100vh;
        }

        /* Sidebar */
        .sidebar {
          width: 240px;
          background: var(--surface);
          border-right: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          padding: 24px 16px;
          position: fixed;
          height: 100vh;
          top: 0; left: 0;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 12px 28px;
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: 18px;
          letter-spacing: -0.5px;
        }

        .logo-icon {
          font-size: 22px;
          background: linear-gradient(135deg, var(--accent), var(--accent2));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .nav { display: flex; flex-direction: column; gap: 4px; flex: 1; }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 11px 14px;
          border-radius: 10px;
          border: none;
          background: transparent;
          color: var(--muted);
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.2s;
          position: relative;
          text-align: left;
          width: 100%;
        }

        .nav-item:hover { background: var(--surface2); color: var(--text); }

        .nav-item.active {
          background: linear-gradient(135deg, #7c5cfc15, #fc5c7d10);
          color: var(--text);
          border: 1px solid #7c5cfc30;
        }

        .nav-indicator {
          width: 4px; height: 4px;
          background: var(--accent);
          border-radius: 50%;
          margin-left: auto;
        }

        .sidebar-footer {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px;
          font-size: 12px;
          color: var(--muted);
        }

        .status-dot {
          width: 7px; height: 7px;
          background: var(--success);
          border-radius: 50%;
          box-shadow: 0 0 6px var(--success);
        }

        /* Main */
        .main {
          margin-left: 240px;
          flex: 1;
          padding: 32px 40px;
          min-height: 100vh;
        }

        .main-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 32px;
        }

        .page-title {
          font-family: 'Syne', sans-serif;
          font-size: 26px;
          font-weight: 800;
          letter-spacing: -0.5px;
        }

        .badge {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          padding: 6px 12px;
          border-radius: 20px;
          background: linear-gradient(135deg, #7c5cfc20, #fc5c7d15);
          border: 1px solid #7c5cfc40;
          color: #a084fd;
        }

        .content { max-width: 900px; }

        /* Shared components */
        .card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 24px;
          margin-bottom: 16px;
        }

        .card-title {
          font-family: 'Syne', sans-serif;
          font-size: 15px;
          font-weight: 700;
          margin-bottom: 16px;
          color: var(--muted);
          text-transform: uppercase;
          letter-spacing: 1px;
          font-size: 11px;
        }

        .input-group { margin-bottom: 16px; }

        .input-label {
          display: block;
          font-size: 13px;
          font-weight: 500;
          color: var(--muted);
          margin-bottom: 8px;
        }

        .input {
          width: 100%;
          background: var(--surface2);
          border: 1px solid var(--border);
          border-radius: 10px;
          padding: 12px 16px;
          color: var(--text);
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          transition: border 0.2s;
          outline: none;
        }

        .input:focus { border-color: var(--accent); }
        .input::placeholder { color: var(--muted); }

        textarea.input { resize: vertical; min-height: 100px; }

        .btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          border-radius: 10px;
          border: none;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 600;
          transition: all 0.2s;
        }

        .btn-primary {
          background: linear-gradient(135deg, var(--accent), #9b7aff);
          color: white;
        }

        .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 8px 24px #7c5cfc40; }
        .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

        .btn-secondary {
          background: var(--surface2);
          color: var(--text);
          border: 1px solid var(--border);
        }

        .result-box {
          background: var(--surface2);
          border: 1px solid var(--border);
          border-radius: 10px;
          padding: 20px;
          margin-top: 20px;
          white-space: pre-wrap;
          font-size: 14px;
          line-height: 1.7;
          color: var(--text);
        }

        .loading {
          display: flex;
          align-items: center;
          gap: 10px;
          color: var(--muted);
          font-size: 14px;
          padding: 20px 0;
        }

        .spinner {
          width: 18px; height: 18px;
          border: 2px solid var(--border);
          border-top-color: var(--accent);
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        .success-banner {
          background: #2ecc7115;
          border: 1px solid #2ecc7130;
          border-radius: 10px;
          padding: 14px 18px;
          color: var(--success);
          font-size: 14px;
          margin-top: 16px;
        }

        .error-banner {
          background: #e74c3c15;
          border: 1px solid #e74c3c30;
          border-radius: 10px;
          padding: 14px 18px;
          color: #e74c3c;
          font-size: 14px;
          margin-top: 16px;
        }

        .grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .tag {
          display: inline-flex;
          align-items: center;
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          background: #7c5cfc20;
          color: #a084fd;
          border: 1px solid #7c5cfc30;
          margin: 3px;
        }
      `}</style>
    </>
  )
}
