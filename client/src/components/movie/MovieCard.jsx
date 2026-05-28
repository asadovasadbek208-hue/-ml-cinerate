import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import api from '../../api/axios.js';
import { useState } from 'react';

const TYPE_LABELS = { MOVIE: 'Kino', SERIES: 'Serial', ANIME: 'Anime', DRAMA: 'Drama' };
const TYPE_BADGE = { MOVIE: 'badge-movie', SERIES: 'badge-series', ANIME: 'badge-anime', DRAMA: 'badge-drama' };

const scoreColor = (s) => {
  if (!s) return 'var(--text2)';
  if (s >= 8) return '#4fff9f';
  if (s >= 6) return '#b44fff';
  if (s >= 4) return '#ffd700';
  return '#ff4f6a';
};

export default function MovieCard({ movie, onWishlistToggle, inWishlist }) {
  const { user } = useAuth();
  const [wishlisted, setWishlisted] = useState(inWishlist || false);
  const [heartAnim, setHeartAnim] = useState(false);

  const handleWishlist = async (e) => {
    e.preventDefault(); e.stopPropagation();
    if (!user) return;
    try {
      await api.post(`/movies/${movie.id}/wishlist`);
      setWishlisted(w => !w);
      setHeartAnim(true);
      setTimeout(() => setHeartAnim(false), 300);
      onWishlistToggle?.();
    } catch {}
  };

  return (
    <Link to={`/movie/${movie.id}`} style={{ display: 'block' }}>
      <div className="card card-glow" style={{ transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)', cursor: 'pointer' }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px) scale(1.02)'; }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0) scale(1)'; }}
      >
        {/* Poster */}
        <div style={{ aspectRatio: '2/3', position: 'relative', overflow: 'hidden', background: 'var(--bg3)' }}>
          {movie.poster
            ? <img src={movie.poster} alt={movie.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s' }}
                onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
                onMouseLeave={e => e.target.style.transform = 'scale(1)'}
              />
            : <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '48px' }}>🎬</div>
          }

          {/* Overlay gradient */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '60%', background: 'linear-gradient(transparent, rgba(0,0,0,0.8))' }} />

          {/* Score badge */}
          {movie.globalAverage && (
            <div style={{
              position: 'absolute', top: '8px', left: '8px',
              background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)',
              border: `1px solid ${scoreColor(movie.globalAverage)}`,
              borderRadius: '8px', padding: '3px 8px',
              fontFamily: 'var(--font-display)', fontSize: '18px',
              color: scoreColor(movie.globalAverage),
              boxShadow: `0 0 12px ${scoreColor(movie.globalAverage)}40`,
            }}>
              {movie.globalAverage}
            </div>
          )}

          {/* Wishlist btn */}
          {user && (
            <button onClick={handleWishlist} className={heartAnim ? 'heart-pop' : ''} style={{
              position: 'absolute', top: '8px', right: '8px',
              width: '30px', height: '30px', borderRadius: '8px',
              background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)',
              border: wishlisted ? '1px solid var(--pink)' : '1px solid var(--border)',
              fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', transition: 'all 0.2s',
              boxShadow: wishlisted ? '0 0 12px rgba(255,79,163,0.4)' : 'none',
            }}>
              {wishlisted ? '❤️' : '🤍'}
            </button>
          )}

          {/* Type badge bottom */}
          <div style={{ position: 'absolute', bottom: '8px', left: '8px' }}>
            <span className={`badge ${TYPE_BADGE[movie.type]}`}>{TYPE_LABELS[movie.type]}</span>
          </div>
        </div>

        {/* Info */}
        <div style={{ padding: '12px' }}>
          <h3 style={{ fontSize: '13px', fontWeight: 600, lineHeight: 1.3, color: 'var(--text)', marginBottom: '4px',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {movie.title}
          </h3>
          <p style={{ fontSize: '11px', color: 'var(--text3)' }}>
            {movie.year} {movie._count?.ratings > 0 && `· ${movie._count.ratings} baho`}
          </p>
        </div>
      </div>
    </Link>
  );
}
