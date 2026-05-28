import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function PostsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', content: '' });
  const [posting, setPosting] = useState(false);

  const fetchPosts = async () => {
    try {
      const res = await api.get('/posts');
      setPosts(res.data.posts);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { fetchPosts(); }, []);

  const handleCreate = async () => {
    if (!form.title || !form.content) return;
    setPosting(true);
    try {
      const res = await api.post('/posts', form);
      setShowForm(false);
      setForm({ title: '', content: '' });
      navigate(`/posts/${res.data.id}`);
    } catch {}
    setPosting(false);
  };

  return (
    <div className="container" style={{ paddingTop: '32px', paddingBottom: '60px', maxWidth: '800px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '40px', letterSpacing: '2px' }}>POSTLAR</h1>
        {user && (
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Bekor' : '+ Post yozish'}
          </button>
        )}
      </div>

      {showForm && (
        <div className="card fade-in" style={{ padding: '24px', marginBottom: '24px' }}>
          <div className="form-group">
            <label className="form-label">Sarlavha</label>
            <input className="form-input" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="Post sarlavhasi..." />
          </div>
          <div className="form-group">
            <label className="form-label">Matn</label>
            <textarea className="form-input" value={form.content} onChange={e => setForm(p => ({ ...p, content: e.target.value }))} placeholder="Fikringizni yozing..." rows={5} style={{ resize: 'vertical', width: '100%' }} />
          </div>
          <button className="btn btn-primary" onClick={handleCreate} disabled={posting || !form.title || !form.content}>
            {posting ? 'Yuborilmoqda...' : 'Nashr etish'}
          </button>
        </div>
      )}

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}><div className="spinner" /></div>
      ) : posts.length === 0 ? (
        <p style={{ color: 'var(--text2)' }}>Hali post yo'q</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {posts.map(p => (
            <Link to={`/posts/${p.id}`} key={p.id}>
              <div className="card" style={{ padding: '20px', transition: 'border-color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <Link to={`/profile/${p.user.username}`} onClick={e => e.stopPropagation()} style={{ fontSize: '13px', color: 'var(--accent)', fontWeight: 600 }}>{p.user.username}</Link>
                  <span style={{ fontSize: '12px', color: 'var(--text2)' }}>{new Date(p.createdAt).toLocaleDateString('uz')}</span>
                </div>
                <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>{p.title}</h2>
                <p style={{ color: 'var(--text2)', fontSize: '14px', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{p.content}</p>
                <div style={{ display: 'flex', gap: '16px', marginTop: '12px' }}>
                  <span style={{ fontSize: '12px', color: 'var(--text2)' }}>💬 {p._count.comments}</span>
                  <span style={{ fontSize: '12px', color: 'var(--text2)' }}>❤️ {p._count.likes}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
