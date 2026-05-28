import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try { await login(email, password); navigate('/'); }
    catch (err) { setError(err.response?.data?.error || 'Kirish muvaffaqiyatsiz'); }
    setLoading(false);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 64px)', padding: '24px' }}>
      <div style={{ width: '100%', maxWidth: '420px' }} className="fade-in-up">
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div className="float" style={{ fontSize: '48px', display: 'block', marginBottom: '12px' }}>🎬</div>
          <h1 style={{
            fontFamily: 'var(--font-display)', fontSize: '42px', letterSpacing: '4px',
            background: 'linear-gradient(135deg, var(--accent3), var(--pink))',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>KIRISH</h1>
          <p style={{ color: 'var(--text3)', marginTop: '8px' }}>CineRate'ga xush kelibsiz</p>
        </div>

        <div className="card" style={{ padding: '36px', boxShadow: '0 0 60px rgba(180,79,255,0.15)' }}>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input className="form-input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="email@example.com" required />
            </div>
            <div className="form-group">
              <label className="form-label">Parol</label>
              <input className="form-input" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
            </div>
            {error && (
              <div style={{ background: 'rgba(255,79,106,0.1)', border: '1px solid rgba(255,79,106,0.3)', borderRadius: '8px', padding: '10px 14px', marginBottom: '16px', fontSize: '13px', color: 'var(--red)' }}>
                ⚠️ {error}
              </div>
            )}
            <button type="submit" className="btn btn-primary" disabled={loading}
              style={{ width: '100%', justifyContent: 'center', padding: '13px', fontSize: '15px', borderRadius: '50px' }}>
              {loading ? <><div className="spinner" style={{ width: '18px', height: '18px', borderWidth: '2px' }} /> Kirilmoqda...</> : '✨ Kirish'}
            </button>
          </form>

          <div className="divider" />
          <p style={{ textAlign: 'center', color: 'var(--text3)', fontSize: '14px' }}>
            Hisob yo'qmi? <Link to="/register" style={{ color: 'var(--accent3)', fontWeight: 600 }}>Ro'yxatdan o'tish →</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
