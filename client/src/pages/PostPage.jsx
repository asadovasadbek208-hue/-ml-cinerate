import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios.js';
import { useAuth } from '../context/AuthContext.jsx';
import CommentSection from '../components/comment/CommentSection.jsx';

export default function PostPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/posts/${id}`).then(r => { setPost(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, [id]);

  const handleLike = async () => {
    if (!user) return;
    try {
      const res = await api.post(`/posts/${id}/like`);
      setLiked(res.data.liked);
      setPost(p => ({ ...p, _count: { ...p._count, likes: p._count.likes + (res.data.liked ? 1 : -1) } }));
    } catch {}
  };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '80px' }}><div className="spinner" /></div>;
  if (!post) return <div style={{ textAlign: 'center', padding: '80px', color: 'var(--text2)' }}>Post topilmadi</div>;

  return (
    <div className="container" style={{ paddingTop: '40px', paddingBottom: '60px', maxWidth: '800px' }}>
      <div className="card fade-in" style={{ padding: '32px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
          <Link to={`/profile/${post.user.username}`} style={{ fontSize: '14px', color: 'var(--accent)', fontWeight: 600 }}>{post.user.username}</Link>
          <span style={{ fontSize: '12px', color: 'var(--text2)' }}>{new Date(post.createdAt).toLocaleDateString('uz')}</span>
        </div>
        <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '16px' }}>{post.title}</h1>
        <p style={{ color: 'var(--text2)', lineHeight: 1.8, fontSize: '15px' }}>{post.content}</p>
        <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
          <button onClick={handleLike} className="btn btn-ghost" style={{ fontSize: '13px' }}>
            {liked ? '❤️' : '🤍'} {post._count?.likes || 0}
          </button>
        </div>
      </div>

      <div className="card" style={{ padding: '24px' }}>
        <CommentSection postId={id} />
      </div>
    </div>
  );
}
