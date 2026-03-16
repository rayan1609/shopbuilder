import { useState, useRef, useEffect } from 'react'

export default function Chatbot() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "👋 Salut ! Je suis ton conseiller dropshipping IA. Je peux t'aider sur :\n\n• Trouver des produits gagnants\n• Stratégies marketing TikTok/Meta\n• Optimiser tes conversions\n• Gérer tes fournisseurs\n• Analyser ta concurrence\n• Tout ce qui concerne ton business e-commerce\n\nPose-moi n'importe quelle question !"
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = async () => {
    if (!input.trim() || loading) return
    const userMsg = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMsg }])
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, { role: 'user', content: userMsg }]
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }])
    } catch (e) {
      setMessages(prev => [...prev, { role: 'assistant', content: '❌ Erreur: ' + String(e.message) }])
    } finally {
      setLoading(false)
    }
  }

  const suggestions = [
    'Quel produit dropshipping est viral en ce moment ?',
    'Comment créer une pub TikTok qui convertit ?',
    'Comment trouver un bon fournisseur AliExpress ?',
    'Quelle marge viser pour le dropshipping ?',
  ]

  return (
    <div>
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="chat-header">
          <div className="chat-avatar">🤖</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15 }}>Conseiller Dropshipping IA</div>
            <div style={{ fontSize: 12, color: '#2ecc71' }}>● En ligne</div>
          </div>
        </div>

        <div className="chat-messages">
          {messages.map((msg, i) => (
            <div key={i} className={`message ${msg.role}`}>
              {msg.role === 'assistant' && <div className="msg-avatar">🤖</div>}
              <div className="msg-bubble">
                {msg.content.split('\n').map((line, j) => (
                  <span key={j}>{line}{j < msg.content.split('\n').length - 1 && <br />}</span>
                ))}
              </div>
              {msg.role === 'user' && <div className="msg-avatar user-avatar">👤</div>}
            </div>
          ))}
          {loading && (
            <div className="message assistant">
              <div className="msg-avatar">🤖</div>
              <div className="msg-bubble typing">
                <span></span><span></span><span></span>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {messages.length === 1 && (
          <div className="suggestions">
            {suggestions.map((s, i) => (
              <button key={i} className="suggestion-btn" onClick={() => { setInput(s) }}>
                {s}
              </button>
            ))}
          </div>
        )}

        <div className="chat-input">
          <input
            className="input"
            placeholder="Pose ta question..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
            style={{ flex: 1, margin: 0 }}
          />
          <button className="btn btn-primary" onClick={send} disabled={loading || !input.trim()} style={{ padding: '11px 20px', flexShrink: 0 }}>
            {loading ? '⏳' : '➤'}
          </button>
        </div>
      </div>

      <style jsx>{`
        .chat-header { display: flex; align-items: center; gap: 12px; padding: 16px 20px; border-bottom: 1px solid var(--border); background: var(--surface2); }
        .chat-avatar { width: 40px; height: 40px; background: linear-gradient(135deg, var(--accent), var(--accent2)); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 20px; }
        .chat-messages { height: 450px; overflow-y: auto; padding: 20px; display: flex; flex-direction: column; gap: 16px; }
        .message { display: flex; align-items: flex-end; gap: 10px; }
        .message.user { flex-direction: row-reverse; }
        .msg-avatar { width: 32px; height: 32px; border-radius: 50%; background: var(--surface2); display: flex; align-items: center; justify-content: center; font-size: 16px; flex-shrink: 0; }
        .user-avatar { background: linear-gradient(135deg, var(--accent), var(--accent2)); }
        .msg-bubble { max-width: 75%; padding: 12px 16px; border-radius: 16px; font-size: 14px; line-height: 1.6; }
        .message.assistant .msg-bubble { background: var(--surface2); border: 1px solid var(--border); border-bottom-left-radius: 4px; color: var(--text); }
        .message.user .msg-bubble { background: linear-gradient(135deg, var(--accent), #9b7aff); color: white; border-bottom-right-radius: 4px; }
        .typing { display: flex; gap: 4px; align-items: center; padding: 14px 18px; }
        .typing span { width: 8px; height: 8px; background: var(--muted); border-radius: 50%; animation: bounce 1s infinite; }
        .typing span:nth-child(2) { animation-delay: 0.2s; }
        .typing span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes bounce { 0%,60%,100% { transform: translateY(0); } 30% { transform: translateY(-8px); } }
        .suggestions { display: flex; flex-wrap: wrap; gap: 8px; padding: 12px 20px; border-top: 1px solid var(--border); }
        .suggestion-btn { padding: 7px 14px; border-radius: 20px; border: 1px solid var(--border); background: var(--surface2); color: var(--muted); cursor: pointer; font-size: 12px; transition: all 0.2s; text-align: left; }
        .suggestion-btn:hover { border-color: var(--accent); color: var(--text); }
        .chat-input { display: flex; gap: 10px; padding: 16px; border-top: 1px solid var(--border); }
      `}</style>
    </div>
  )
}
