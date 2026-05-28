import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); setMenuOpen(false); setMobileOpen(false); };
  const isActive = (p) => location.pathname === p;

  const NavLink = ({ to, children, onClick }) => (
    <Link to={to} onClick={onClick} style={{
      color: isActive(to) ? 'var(--accent3)' : 'var(--text2)',
      fontSize: '14px', fontWeight: 500, padding: '7px 14px',
      borderRadius: '50px', transition: 'all 0.2s',
      background: isActive(to) ? 'rgba(180,79,255,0.12)' : 'transparent',
      border: `1px solid ${isActive(to) ? 'rgba(180,79,255,0.25)' : 'transparent'}`,
      whiteSpace: 'nowrap',
    }}>
      {children}
    </Link>
  );

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        height: '64px', background: 'var(--navbar-bg)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border)',
        boxShadow: '0 2px 20px var(--shadow)',
      }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '100%', gap: '12px' }}>

          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '2px', flexShrink: 0 }}>
            <span style={{
              fontFamily: 'var(--font-display)', fontSize: '22px', letterSpacing: '3px',
              background: 'linear-gradient(135deg, var(--accent3), var(--pink))',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>ML</span>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '22px', letterSpacing: '2px', color: 'var(--text)', margin: '0 2px' }}>CINE</span>
            <span style={{
              fontFamily: 'var(--font-display)', fontSize: '22px', letterSpacing: '2px',
              background: 'linear-gradient(135deg, var(--accent), var(--pink))',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>RATE</span>
          </Link>

          {/* Desktop nav */}
          <div className="hide-mobile" style={{ display: 'flex', gap: '2px', alignItems: 'center' }}>
            <NavLink to="/">Katalog</NavLink>
            <NavLink to="/posts">Postlar</NavLink>
            {user && <NavLink to="/wishlist">Wishlist</NavLink>}
          </div>

          {/* Right */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {/* Theme toggle */}
            <button onClick={toggle} style={{
              background: 'var(--bg3)', border: '1px solid var(--border)',
              borderRadius: '50px', padding: '6px 10px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '6px',
              fontSize: '14px', color: 'var(--text2)', transition: 'all 0.2s',
            }}>
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>

            {user ? (
              <>
                <Link to="/add-movie" className="btn btn-outline-accent btn-sm hide-mobile">+ Kino</Link>
                <Link to="/chat" style={{
                  width: '34px', height: '34px', borderRadius: '50%',
                  background: 'var(--bg3)', border: '1px solid var(--border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '15px', transition: 'all 0.2s', flexShrink: 0,
                }}>💬</Link>

                {/* Avatar */}
                <div style={{ position: 'relative' }}>
                  <button onClick={() => setMenuOpen(!menuOpen)} style={{
                    width: '34px', height: '34px', borderRadius: '50%',
                    border: '2px solid var(--border2)', background: 'var(--bg3)',
                    overflow: 'hidden', cursor: 'pointer', padding: 0,
                    transition: 'border-color 0.2s', flexShrink: 0,
                  }}>
                    {user.avatar
                      ? <img src={user.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <span style={{ color: 'var(--accent3)', fontWeight: 700, fontSize: '13px' }}>
                          {user.sticker || user.username[0].toUpperCase()}
                        </span>
                    }
                  </button>
                  {menuOpen && (
                    <div className="glass" style={{
                      position: 'absolute', top: '42px', right: 0,
                      borderRadius: 'var(--radius)', padding: '8px', minWidth: '190px', zIndex: 200,
                      boxShadow: '0 20px 60px var(--shadow), 0 0 30px var(--accent-glow)',
                      animation: 'fadeInUp 0.2s ease',
                    }}>
                      <div style={{ padding: '8px 12px 10px', borderBottom: '1px solid var(--border)' }}>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--accent3)' }}>
                          {user.sticker && <span style={{ marginRight: '6px' }}>{user.sticker}</span>}
                          {user.username}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text3)', marginTop: '2px' }}>{user.email}</div>
                      </div>
                      {[
                        { to: `/profile/${user.username}`, icon: '👤', label: 'Profilim' },
                        { to: '/wishlist', icon: '❤️', label: 'Wishlist' },
                        { to: '/add-movie', icon: '🎬', label: "Kino qo'shish" },
                      ].map(item => (
                        <Link key={item.to} to={item.to} onClick={() => setMenuOpen(false)} style={{
                          display: 'flex', alignItems: 'center', gap: '10px',
                          padding: '9px 12px', color: 'var(--text2)', fontSize: '13px',
                          borderRadius: '8px', transition: 'all 0.15s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(180,79,255,0.1)'; e.currentTarget.style.color = 'var(--text)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = ''; e.currentTarget.style.color = ''; }}>
                          {item.icon} {item.label}
                        </Link>
                      ))}
                      <div style={{ borderTop: '1px solid var(--border)', marginTop: '4px', paddingTop: '4px' }}>
                        <button onClick={handleLogout} style={{
                          display: 'flex', alignItems: 'center', gap: '10px', width: '100%',
                          padding: '9px 12px', color: 'var(--red)', fontSize: '13px',
                          background: 'none', border: 'none', borderRadius: '8px', cursor: 'pointer', transition: 'background 0.15s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,79,106,0.1)'}
                        onMouseLeave={e => e.currentTarget.style.background = ''}>
                          🚪 Chiqish
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-ghost btn-sm hide-mobile">Kirish</Link>
                <Link to="/register" className="btn btn-primary btn-sm">Ro'yxat</Link>
              </>
            )}

            {/* Mobile hamburger */}
            <button className="hide-desktop" onClick={() => setMobileOpen(!mobileOpen)} style={{
              display: 'none', width: '34px', height: '34px', borderRadius: '8px',
              background: 'var(--bg3)', border: '1px solid var(--border)',
              alignItems: 'center', justifyContent: 'center', fontSize: '18px', cursor: 'pointer',
            }}
            // show on mobile via inline media query workaround
            ref={el => { if (el) { el.style.display = window.innerWidth <= 768 ? 'flex' : 'none'; } }}>
              {mobileOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="mobile-menu">
          {[
            { to: '/', label: '🎬 Katalog' },
            { to: '/posts', label: '📝 Postlar' },
            ...(user ? [
              { to: '/wishlist', label: '❤️ Wishlist' },
              { to: '/chat', label: '💬 Chat' },
              { to: `/profile/${user?.username}`, label: '👤 Profilim' },
              { to: '/add-movie', label: '+ Kino qo\'shish' },
            ] : [
              { to: '/login', label: '🔐 Kirish' },
              { to: '/register', label: '✨ Ro\'yxat' },
            ]),
          ].map(item => (
            <Link key={item.to} to={item.to} onClick={() => setMobileOpen(false)} style={{
              padding: '14px 20px', fontSize: '16px', fontWeight: 600,
              color: 'var(--text)', borderRadius: 'var(--radius)',
              transition: 'background 0.15s',
              background: isActive(item.to) ? 'rgba(180,79,255,0.15)' : 'transparent',
            }}>
              {item.label}
            </Link>
          ))}
          {user && (
            <button onClick={handleLogout} style={{
              padding: '14px 20px', fontSize: '16px', fontWeight: 600,
              color: 'var(--red)', borderRadius: 'var(--radius)', background: 'none',
              border: 'none', cursor: 'pointer', textAlign: 'left',
            }}>
              🚪 Chiqish
            </button>
          )}
        </div>
      )}
    </>
  );
}
