import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios.js';
import { useAuth } from '../context/AuthContext.jsx';
import MovieCard from '../components/movie/MovieCard.jsx';
import { ALL_GENRES } from '../api/criteria.js';

const TYPES = [
  { value: '', label: '✨ Hammasi' },
  { value: 'MOVIE', label: '🎬 Kino' },
  { value: 'SERIES', label: '📺 Serial' },
  { value: 'ANIME', label: '🌸 Anime' },
  { value: 'DRAMA', label: '🎭 Drama' },
];

export default function WishlistPage() {
  const { user } = useAuth();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('');
  const [genreFilter, setGenreFilter] = useState('');
  const [search, setSearch] = useState('');

  const fetchWishlist = async () => {
    try { const res = await api.get('/wishlist'); setMovies(res.data); }
    catch {} setLoading(false);
  };

  useEffect(() => { if (user) fetchWishlist(); else setLoading(false); }, [user]);

  const filtered = movies.filter(m => {
    if (typeFilter && m.type !== typeFilter) return false;
    if (genreFilter && !m.genres?.some(g => g.toLowerCase().includes(genreFilter.toLowerCase()))) return false;
    if (search && !m.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  // Get all genres from wishlist movies
  const availableGenres = [...new Set(movies.flatMap(m => m.genres || []))].sort();

  if (!user) return (
    <div style={{ textAlign: 'center', padding: '80px', color: 'var(--text2)' }}>
      <div className="float" style={{ fontSize: '64px', display: 'block', marginBottom: '12px' }}>🔖</div>
      <p>Wishlistni ko'rish uchun <Link to="/login" style={{ color: 'var(--accent)' }}>kirish</Link> kerak.</p>
    </div>
  );

  return (
    <div className="container" style={{ paddingTop: '32px', paddingBottom: '60px' }}>
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{
          fontFamily: 'var(--font-display)', fontSize: '52px', letterSpacing: '3px',
          background: 'linear-gradient(135deg, var(--accent3), var(--pink))',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
        }}>❤️ WISHLIST</h1>
        <p style={{ color: 'var(--text3)', marginTop: '4px' }}>{movies.length} ta kino saqlangan</p>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {/* Search */}
        <input className="form-input" placeholder="🔍 Qidirish..." value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ flex: '1', minWidth: '160px', borderRadius: '50px', padding: '9px 16px', fontSize: '13px' }} />

        {/* Type filter */}
        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
          {TYPES.map(t => (
            <button key={t.value} onClick={() => setTypeFilter(t.value)} className="btn btn-sm"
              style={{
                background: typeFilter === t.value ? 'var(--accent)' : 'transparent',
                color: typeFilter === t.value ? '#fff' : 'var(--text2)',
                border: `1px solid ${typeFilter === t.value ? 'var(--accent)' : 'var(--border)'}`,
              }}>{t.label}</button>
          ))}
        </div>
      </div>

      {/* Genre filter */}
      {availableGenres.length > 0 && (
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '24px' }}>
          <span className={`tag ${!genreFilter ? 'active' : ''}`} onClick={() => setGenreFilter('')}>Barchasi</span>
          {availableGenres.map(g => (
            <span key={g} className={`tag ${genreFilter === g ? 'active' : ''}`} onClick={() => setGenreFilter(genreFilter === g ? '' : g)}>{g}</span>
          ))}
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}><div className="spinner" /></div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text2)' }}>
          <div className="float" style={{ fontSize: '64px', marginBottom: '16px' }}>🎬</div>
          {movies.length === 0
            ? <><p style={{ fontSize: '18px' }}>Wishlist bo'sh</p><p style={{ fontSize: '14px', marginTop: '8px', color: 'var(--text3)' }}>Kino kartochkasidagi ❤️ tugmasini bosing</p><Link to="/" className="btn btn-primary" style={{ marginTop: '20px', display: 'inline-flex' }}>Kinolarni ko'rish</Link></>
            : <p>Filtr bo'yicha hech narsa topilmadi</p>
          }
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(155px, 1fr))', gap: '14px' }}>
          {filtered.map((m, i) => (
            <div key={m.id} className="fade-in-up" style={{ animationDelay: `${i * 0.04}s` }}>
              <MovieCard movie={m} inWishlist={true} onWishlistToggle={fetchWishlist} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
