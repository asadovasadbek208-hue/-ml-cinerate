import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios.js';
import { useAuth } from '../context/AuthContext.jsx';
import { searchTMDB, getTMDBMovie, IMG_BASE, getTMDBType } from '../api/tmdb.js';

export default function AddMoviePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [selected, setSelected] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  if (!user) return (
    <div style={{ textAlign: 'center', padding: '80px', color: 'var(--text2)' }}>
      Kino qo'shish uchun <a href="/login" style={{ color: 'var(--accent)' }}>kirish</a> kerak.
    </div>
  );

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setSearching(true);
    setResults([]);
    setSelected(null);
    try {
      const data = await searchTMDB(query);
      setResults(data.slice(0, 8));
    } catch {
      setError('TMDB qidiruvda xatolik');
    }
    setSearching(false);
  };

  const handleSelect = async (item) => {
    setSearching(true);
    try {
      const type = item.media_type;
      const detail = await getTMDBMovie(item.id, type);
      const genres = detail.genres?.map(g => g.name) || [];

      setSelected({
        tmdbId: detail.id,
        title: detail.title || detail.name,
        originalTitle: detail.original_title || detail.original_name,
        description: detail.overview,
        poster: detail.poster_path ? `${IMG_BASE}${detail.poster_path}` : null,
        posterPath: detail.poster_path,
        year: (detail.release_date || detail.first_air_date || '').slice(0, 4),
        type: getTMDBType(type, detail.genres),
        genres,
        director: detail.credits?.crew?.find(c => c.job === 'Director')?.name || '',
        studio: detail.production_companies?.[0]?.name || '',
        episodes: detail.number_of_episodes || null,
        status: detail.status || '',
        trailer: detail.videos?.results?.find(v => v.type === 'Trailer')?.key
          ? `https://youtube.com/watch?v=${detail.videos.results.find(v => v.type === 'Trailer').key}`
          : '',
      });
    } catch {
      setError('Kino ma\'lumotlarini olishda xatolik');
    }
    setSearching(false);
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      const res = await api.post('/movies', {
        ...selected,
        genres: selected.genres.join(', '),
        poster: selected.poster,
      });
      navigate(`/movie/${res.data.id}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Xatolik yuz berdi');
    }
    setSaving(false);
  };

  const TYPE_LABELS = { MOVIE: 'Kino', SERIES: 'Serial', ANIME: 'Anime', DRAMA: 'Drama' };

  return (
    <div className="container" style={{ paddingTop: '32px', paddingBottom: '60px', maxWidth: '700px' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '40px', letterSpacing: '2px', marginBottom: '28px' }}>
        KINO QO'SHISH
      </h1>

      {/* Search */}
      <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
        <input
          className="form-input"
          placeholder="Kino, serial yoki anime nomini kiriting..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          style={{ flex: 1 }}
        />
        <button type="submit" className="btn btn-primary" disabled={searching}>
          {searching ? '...' : 'Qidirish'}
        </button>
      </form>

      {/* Search results */}
      {results.length > 0 && !selected && (
        <div className="card" style={{ marginBottom: '24px' }}>
          {results.map(item => (
            <div
              key={item.id}
              onClick={() => handleSelect(item)}
              style={{
                display: 'flex', gap: '12px', padding: '12px',
                cursor: 'pointer', borderBottom: '1px solid var(--border)',
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--bg3)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <div style={{ width: '40px', height: '60px', flexShrink: 0, borderRadius: '4px', overflow: 'hidden', background: 'var(--bg3)' }}>
                {item.poster_path
                  ? <img src={`${IMG_BASE}${item.poster_path}`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>🎬</div>
                }
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: '14px' }}>{item.title || item.name}</div>
                <div style={{ fontSize: '12px', color: 'var(--text2)', marginTop: '2px' }}>
                  {item.media_type === 'movie' ? '🎬 Kino' : '📺 Serial'} · {(item.release_date || item.first_air_date || '').slice(0, 4)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Selected movie preview */}
      {selected && (
        <div className="card fade-in" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
            {selected.poster && (
              <img src={selected.poster} alt="" style={{ width: '100px', borderRadius: '8px', objectFit: 'cover' }} />
            )}
            <div>
              <h2 style={{ fontSize: '22px', fontWeight: 700 }}>{selected.title}</h2>
              {selected.originalTitle && <p style={{ color: 'var(--text2)', fontSize: '13px' }}>{selected.originalTitle}</p>}
              <div style={{ display: 'flex', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
                <span className={`badge badge-${selected.type.toLowerCase()}`}>{TYPE_LABELS[selected.type]}</span>
                {selected.year && <span style={{ fontSize: '13px', color: 'var(--text2)' }}>{selected.year}</span>}
                {selected.genres.map(g => <span key={g} style={{ fontSize: '12px', color: 'var(--text2)', background: 'var(--bg3)', padding: '2px 8px', borderRadius: '20px' }}>{g}</span>)}
              </div>
              {selected.description && (
                <p style={{ color: 'var(--text2)', fontSize: '13px', marginTop: '10px', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {selected.description}
                </p>
              )}
            </div>
          </div>

          {error && <p style={{ color: 'var(--red)', fontSize: '13px', marginBottom: '12px' }}>{error}</p>}

          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn btn-primary" onClick={handleSave} disabled={saving} style={{ flex: 1, justifyContent: 'center' }}>
              {saving ? 'Saqlanmoqda...' : "✅ Saytga qo'shish"}
            </button>
            <button className="btn btn-ghost" onClick={() => { setSelected(null); }} style={{ justifyContent: 'center' }}>
              Boshqa qidirish
            </button>
          </div>
        </div>
      )}

      {!selected && results.length === 0 && !searching && (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text2)' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>🔍</div>
          <p>Kino nomini yozing va qidiring</p>
        </div>
      )}
    </div>
  );
}
