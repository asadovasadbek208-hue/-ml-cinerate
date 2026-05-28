import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try { await register(form.username, form.email, form.password); navigate('/'); }
    catch (err) { setError(err.response?.data?.error || "Ro'yxatdan o'tish muvaffaqiyatsiz"); }
    setLoading(false);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 64px)', padding: '24px' }}>
      <div style={{ width: '100%', maxWidth: '420px' }} className="fade-in-up">
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div className="float" style={{ fontSize: '48px', display: 'block', marginBottom: '12px' }}>🌟</div>
          <h1 style={{
            fontFamily: 'var(--font-display)', fontSize: '42px', letterSpacing: '4px',
            background: 'linear-gradient(135deg, var(--accent3), var(--pink))',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>RO'YXAT</h1>
          <p style={{ color: 'var(--text3)', marginTop: '8px' }}>Yangi hisob yarating</p>
        </div>

        <div className="card" style={{ padding: '36px', boxShadow: '0 0 60px rgba(180,79,255,0.15)' }}>
          <form onSubmit={handleSubmit}>
            {[
              { name: 'username', label: 'Foydalanuvchi nomi', type: 'text', placeholder: 'username', icon: '👤' },
              { name: 'email', label: 'Email', type: 'email', placeholder: 'email@example.com', icon: '📧' },
              { name: 'password', label: 'Parol', type: 'password', placeholder: '••••••••', icon: '🔒' },
            ].map(f => (
              <div className="form-group" key={f.name}>
                <label className="form-label">{f.icon} {f.label}</label>
                <input className="form-input" type={f.type} value={form[f.name]}
                  onChange={e => setForm(p => ({ ...p, [f.name]: e.target.value }))}
                  placeholder={f.placeholder} required />
              </div>
            ))}
            {error && (
              <div style={{ background: 'rgba(255,79,106,0.1)', border: '1px solid rgba(255,79,106,0.3)', borderRadius: '8px', padding: '10px 14px', marginBottom: '16px', fontSize: '13px', color: 'var(--red)' }}>
                ⚠️ {error}
              </div>
            )}
            <button type="submit" className="btn btn-primary" disabled={loading}
              style={{ width: '100%', justifyContent: 'center', padding: '13px', fontSize: '15px', borderRadius: '50px' }}>
              {loading ? 'Yaratilmoqda...' : '🚀 Hisob yaratish'}
            </button>
          </form>

          <div className="divider" />
          <p style={{ textAlign: 'center', color: 'var(--text3)', fontSize: '14px' }}>
            Hisobingiz bormi? <Link to="/login" style={{ color: 'var(--accent3)', fontWeight: 600 }}>Kirish →</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
