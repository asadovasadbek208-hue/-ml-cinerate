import { useState, useEffect } from 'react';
import api from '../../api/axios.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { Link } from 'react-router-dom';

export default function CommentSection({ movieId, postId }) {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);

  const fetchComments = async () => {
    try {
      const url = movieId ? `/comments/movie/${movieId}` : `/posts/${postId}`;
      const res = movieId ? await api.get(url) : await api.get(url);
      setComments(movieId ? res.data.comments : res.data.comments || []);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { fetchComments(); }, [movieId, postId]);

  const handleSubmit = async () => {
    if (!text.trim()) return;
    setPosting(true);
    try {
      await api.post('/comments', { content: text, movieId, postId });
      setText('');
      fetchComments();
    } catch {}
    setPosting(false);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/comments/${id}`);
      setComments(c => c.filter(x => x.id !== id));
    } catch {}
  };

  return (
    <div>
      <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>
        Izohlar {comments.length > 0 && <span style={{ color: 'var(--text2)', fontWeight: 400 }}>({comments.length})</span>}
      </h3>

      {user ? (
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '50%',
            background: 'var(--bg3)', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontWeight: 600, flexShrink: 0, overflow: 'hidden',
          }}>
            {user.avatar ? <img src={user.avatar} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" /> : user.username[0].toUpperCase()}
          </div>
          <div style={{ flex: 1 }}>
            <textarea
              className="form-input"
              placeholder="Izoh yozing..."
              value={text}
              onChange={e => setText(e.target.value)}
              rows={2}
              style={{ width: '100%', resize: 'none' }}
            />
            <button className="btn btn-primary" onClick={handleSubmit} disabled={posting || !text.trim()} style={{ marginTop: '6px', fontSize: '13px', padding: '7px 16px' }}>
              {posting ? '...' : 'Yuborish'}
            </button>
          </div>
        </div>
      ) : (
        <p style={{ color: 'var(--text2)', fontSize: '14px', marginBottom: '20px' }}>
          Izoh yozish uchun <Link to="/login" style={{ color: 'var(--accent)' }}>kirish</Link> kerak.
        </p>
      )}

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}><div className="spinner" /></div>
      ) : comments.length === 0 ? (
        <p style={{ color: 'var(--text2)', fontSize: '14px' }}>Hali izoh yo'q. Birinchi bo'ling!</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {comments.map(c => (
            <div key={c.id} style={{ display: 'flex', gap: '10px' }}>
              <Link to={`/profile/${c.user.username}`} style={{ flexShrink: 0 }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '50%',
                  background: 'var(--bg3)', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontWeight: 600, overflow: 'hidden',
                }}>
                  {c.user.avatar ? <img src={c.user.avatar} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" /> : c.user.username[0].toUpperCase()}
                </div>
              </Link>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Link to={`/profile/${c.user.username}`} style={{ fontSize: '13px', fontWeight: 600, color: 'var(--accent)' }}>{c.user.username}</Link>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span style={{ fontSize: '11px', color: 'var(--text2)' }}>{new Date(c.createdAt).toLocaleDateString('uz')}</span>
                    {user?.id === c.userId && (
                      <button onClick={() => handleDelete(c.id)} style={{ background: 'none', border: 'none', color: 'var(--red)', fontSize: '12px', cursor: 'pointer' }}>o'chirish</button>
                    )}
                  </div>
                </div>
                <p style={{ fontSize: '14px', color: 'var(--text)', marginTop: '4px', lineHeight: 1.5 }}>{c.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
