import { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import api from '../api/axios.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function ChatPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [conversations, setConversations] = useState([]);
  const [activeUser, setActiveUser] = useState(searchParams.get('user') || null);
  const [messages, setMessages] = useState([]);
  const [partner, setPartner] = useState(null);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [searchUser, setSearchUser] = useState('');
  const messagesEndRef = useRef(null);
  const isMobile = window.innerWidth <= 768;

  // Mobile da: agar activeUser bo'lsa chat ko'rsin, bo'lmasa list ko'rsin
  const [mobileView, setMobileView] = useState(activeUser ? 'chat' : 'list');

  useEffect(() => { if (user) fetchConversations(); }, [user]);
  useEffect(() => {
    if (activeUser) {
      fetchMessages(activeUser);
      setMobileView('chat');
    }
  }, [activeUser]);
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);
  useEffect(() => {
    if (!activeUser) return;
    const interval = setInterval(() => fetchMessages(activeUser), 3000);
    return () => clearInterval(interval);
  }, [activeUser]);

  const fetchConversations = async () => {
    try { const res = await api.get('/messages'); setConversations(res.data); } catch {}
  };
  const fetchMessages = async (username) => {
    try {
      const res = await api.get(`/messages/${username}`);
      setMessages(res.data.messages);
      setPartner(res.data.partner);
    } catch {}
  };
  const handleSend = async () => {
    if (!text.trim() || !activeUser) return;
    setSending(true);
    try {
      const res = await api.post(`/messages/${activeUser}`, { content: text });
      setMessages(m => [...m, res.data]);
      setText('');
      fetchConversations();
    } catch {}
    setSending(false);
  };
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const Avatar = ({ u, size = 40 }) => (
    <div className="avatar" style={{ width: size, height: size, fontSize: size * 0.38, flexShrink: 0 }}>
      {u?.avatar
        ? <img src={u.avatar} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
        : u?.sticker || u?.username?.[0]?.toUpperCase()}
    </div>
  );

  if (!user) return (
    <div style={{ textAlign: 'center', padding: '80px', color: 'var(--text2)' }}>
      Chat uchun <Link to="/login" style={{ color: 'var(--accent)' }}>kirish</Link> kerak.
    </div>
  );

  // ===== CONVERSATION LIST =====
  const ConvList = () => (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', letterSpacing: '2px',
          background: 'linear-gradient(135deg, var(--accent3), var(--cyan))',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          flex: 1 }}>CHAT</h2>
      </div>

      {/* Search */}
      <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)' }}>
        <input className="form-input" placeholder="👤 Username kiriting..."
          value={searchUser} onChange={e => setSearchUser(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter' && searchUser.trim()) {
              setActiveUser(searchUser.trim());
              setSearchUser('');
            }
          }}
          style={{ fontSize: '13px', padding: '9px 14px', borderRadius: '50px', width: '100%' }}
        />
      </div>

      {/* Conversations */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {conversations.length === 0 ? (
          <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text3)' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>💬</div>
            <p style={{ fontSize: '14px' }}>Hali xabar yo'q</p>
            <p style={{ fontSize: '12px', marginTop: '6px' }}>Username kiriting va boshlang</p>
          </div>
        ) : conversations.map(conv => (
          <div key={conv.partner.id}
            onClick={() => { setActiveUser(conv.partner.username); setMobileView('chat'); }}
            style={{
              display: 'flex', gap: '12px', padding: '14px 16px',
              cursor: 'pointer', transition: 'background 0.15s',
              background: activeUser === conv.partner.username ? 'rgba(180,79,255,0.08)' : 'transparent',
              borderLeft: `3px solid ${activeUser === conv.partner.username ? 'var(--accent)' : 'transparent'}`,
            }}
            onMouseEnter={e => { if (activeUser !== conv.partner.username) e.currentTarget.style.background = 'rgba(180,79,255,0.04)'; }}
            onMouseLeave={e => { if (activeUser !== conv.partner.username) e.currentTarget.style.background = 'transparent'; }}
          >
            <Avatar u={conv.partner} size={46} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)' }}>
                  {conv.partner.sticker && <span style={{ marginRight: '4px' }}>{conv.partner.sticker}</span>}
                  {conv.partner.username}
                </span>
                {conv.unread > 0 && (
                  <span style={{ background: 'var(--accent)', color: '#fff', borderRadius: '50%', width: '18px', height: '18px', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {conv.unread}
                  </span>
                )}
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text3)', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {conv.lastMessage?.content}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // ===== CHAT VIEW =====
  const ChatView = () => (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--card-bg)', backdropFilter: 'blur(12px)' }}>
        {/* Back button (mobile) */}
        <button onClick={() => setMobileView('list')} style={{
          background: 'none', border: 'none', color: 'var(--accent3)', fontSize: '20px',
          cursor: 'pointer', padding: '4px', display: isMobile ? 'flex' : 'none', alignItems: 'center',
        }}>←</button>
        <Link to={`/profile/${activeUser}`} style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
          <Avatar u={partner} size={38} />
          <div>
            <div style={{ fontWeight: 600, fontSize: '15px', color: 'var(--text)' }}>
              {partner?.sticker && <span style={{ marginRight: '4px' }}>{partner.sticker}</span>}
              {activeUser}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text3)' }}>Profil ko'rish →</div>
          </div>
        </Link>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {messages.length === 0 ? (
          <div style={{ margin: 'auto', textAlign: 'center', color: 'var(--text3)' }}>
            <div className="float" style={{ fontSize: '48px', marginBottom: '12px' }}>💬</div>
            <p style={{ fontSize: '14px' }}>Birinchi xabarni yuboring!</p>
          </div>
        ) : messages.map((m, i) => {
          const isMe = m.senderId === user.id;
          const showAvatar = !isMe && (i === 0 || messages[i-1]?.senderId !== m.senderId);
          return (
            <div key={m.id} style={{ display: 'flex', flexDirection: isMe ? 'row-reverse' : 'row', gap: '6px', alignItems: 'flex-end' }}>
              {!isMe && (
                <div style={{ width: '28px', flexShrink: 0 }}>
                  {showAvatar && <Avatar u={m.sender} size={28} />}
                </div>
              )}
              <div style={{ maxWidth: '72%' }}>
                <div className={`chat-bubble ${isMe ? 'mine' : 'theirs'}`}>{m.content}</div>
                <div style={{ fontSize: '10px', color: 'var(--text3)', marginTop: '2px', textAlign: isMe ? 'right' : 'left' }}>
                  {new Date(m.createdAt).toLocaleTimeString('uz', { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

     {/* Input */}
<div style={{ padding: '10px 12px', borderTop: '1px solid var(--border)', display: 'flex', gap: '8px', alignItems: 'flex-end', background: 'var(--card-bg)' }}>
  <textarea className="form-input" placeholder="Xabar yozing..."
    value={text}
    onChange={e => {
      setText(e.target.value);
      e.target.style.height = 'auto';
      e.target.style.height = Math.min(e.target.scrollHeight, 80) + 'px';
    }}
    onKeyDown={handleKeyDown}
    rows={1}
    style={{ flex: 1, resize: 'none', borderRadius: '22px', padding: '10px 16px', fontSize: '14px', maxHeight: '80px', overflowY: 'auto', height: '40px' }}
  />
  <button className="btn btn-primary" onClick={handleSend}
    disabled={sending || !text.trim()}
    style={{ borderRadius: '50%', width: '42px', height: '42px', padding: 0, justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>
    {sending ? '·' : '➤'}
  </button>
</div>
</div>
);

  // ===== DESKTOP LAYOUT =====
  if (!isMobile) {
    return (
      <div className="container" style={{ paddingTop: '20px', paddingBottom: '20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '0', height: 'calc(100vh - 104px)', borderRadius: 'var(--radius)', overflow: 'hidden', border: '1px solid var(--border)' }}>
          <div className="card" style={{ borderRadius: 0, borderRight: '1px solid var(--border)', overflow: 'hidden' }}>
            <ConvList />
          </div>
          <div className="card" style={{ borderRadius: 0, overflow: 'hidden' }}>
            {activeUser ? <ChatView /> : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', flexDirection: 'column', gap: '12px', color: 'var(--text3)' }}>
                <div className="float" style={{ fontSize: '64px' }}>💬</div>
                <p style={{ fontSize: '16px' }}>Chat tanlang</p>
                <p style={{ fontSize: '13px' }}>Chap tomonda username kiriting</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ===== MOBILE LAYOUT =====
  return (
    <div style={{ height: 'calc(100vh - 64px)', overflow: 'hidden' }}>
      {mobileView === 'list' ? (
        <div className="card" style={{ height: '100%', borderRadius: 0, border: 'none', borderTop: '1px solid var(--border)' }}>
          <ConvList />
        </div>
      ) : (
        <div className="card" style={{ height: '100%', borderRadius: 0, border: 'none', borderTop: '1px solid var(--border)' }}>
          <ChatView />
        </div>
      )}
    </div>
  );
}