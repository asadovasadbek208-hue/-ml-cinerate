import { useState, useEffect } from 'react';
import api from '../api/axios.js';
import MovieCard from '../components/movie/MovieCard.jsx';

const TYPES = [
  { value: '', label: '✨ Hammasi' },
  { value: 'MOVIE', label: '🎬 Kinolar' },
  { value: 'SERIES', label: '📺 Seriallar' },
  { value: 'ANIME', label: '🌸 Animlar' },
  { value: 'DRAMA', label: '🎭 Dramalar' },
];

const SORTS = [
  { value: 'createdAt', label: 'Yangi' },
  { value: 'title', label: 'Nom' },
];

export default function HomePage() {
  const [movies, setMovies] = useState([]);
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const [sort, setSort] = useState('createdAt');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchMovies = async (resetPage = false) => {
    setLoading(true);
    const p = resetPage ? 1 : page;
    if (resetPage) setPage(1);
    try {
      const params = new URLSearchParams({ page: p, limit: 24, sort, order: 'desc' });
      if (search) params.set('search', search);
      if (type) params.set('type', type);
      const res = await api.get(`/movies?${params}`);
      setMovies(res.data.movies);
      setTotalPages(res.data.pages);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { fetchMovies(); }, [type, sort, page]);

  const handleSearch = (e) => { e.preventDefault(); fetchMovies(true); };

  return (
    <div style={{ position: 'relative', zIndex: 1 }}>
      {/* Hero */}
      <div style={{
        padding: '60px 0 48px',
        textAlign: 'center',
        background: 'linear-gradient(180deg, rgba(180,79,255,0.08) 0%, transparent 100%)',
        borderBottom: '1px solid rgba(109,31,138,0.2)',
        marginBottom: '40px',
      }}>
        <div className="container">
          <div className="float" style={{ display: 'inline-block', fontSize: '48px', marginBottom: '16px' }}>🎬</div>
          <h1 className="glow-text" style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(48px, 8vw, 88px)',
            letterSpacing: '6px', lineHeight: 1,
            background: 'linear-gradient(135deg, #fff 0%, var(--accent3) 50%, var(--pink) 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>
            CINE<span style={{
              background: 'linear-gradient(135deg, var(--accent), var(--pink))',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>RATE</span>
          </h1>
          <p style={{ color: 'var(--text2)', marginTop: '16px', fontSize: '16px', letterSpacing: '0.05em' }}>
            Sevimli kinolaringizni toping, baholang va ulashing
          </p>

          {/* Search */}
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px', maxWidth: '560px', margin: '28px auto 0' }}>
            <input
              className="form-input"
              placeholder="🔍  Kino, serial yoki anime qidiring..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ flex: 1, fontSize: '15px', padding: '13px 18px', borderRadius: '50px' }}
            />
            <button type="submit" className="btn btn-primary" style={{ borderRadius: '50px', padding: '13px 24px' }}>
              Qidirish
            </button>
          </form>
        </div>
      </div>

      <div className="container" style={{ paddingBottom: '60px' }}>
        {/* Filters */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '28px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {TYPES.map(t => (
              <button key={t.value} onClick={() => { setType(t.value); setPage(1); }} className="btn btn-sm"
                style={{
                  background: type === t.value ? 'linear-gradient(135deg, var(--accent2), var(--accent))' : 'rgba(26,0,32,0.8)',
                  color: type === t.value ? '#fff' : 'var(--text2)',
                  border: `1px solid ${type === t.value ? 'var(--accent)' : 'var(--border)'}`,
                  boxShadow: type === t.value ? '0 0 20px var(--accent-glow)' : 'none',
                }}>{t.label}</button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '6px' }}>
            {SORTS.map(s => (
              <button key={s.value} onClick={() => setSort(s.value)} className="btn btn-sm"
                style={{
                  background: sort === s.value ? 'rgba(180,79,255,0.15)' : 'transparent',
                  color: sort === s.value ? 'var(--accent3)' : 'var(--text3)',
                  border: `1px solid ${sort === s.value ? 'var(--border2)' : 'transparent'}`,
                }}>{s.label}</button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '16px' }}>
            {Array(12).fill(0).map((_, i) => (
              <div key={i}>
                <div className="skeleton" style={{ aspectRatio: '2/3', borderRadius: 'var(--radius)' }} />
                <div className="skeleton" style={{ height: '14px', marginTop: '10px', borderRadius: '4px', width: '80%' }} />
                <div className="skeleton" style={{ height: '11px', marginTop: '6px', borderRadius: '4px', width: '50%' }} />
              </div>
            ))}
          </div>
        ) : movies.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text2)' }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>🔍</div>
            <p style={{ fontSize: '18px' }}>Hech narsa topilmadi</p>
            <p style={{ fontSize: '14px', marginTop: '8px', color: 'var(--text3)' }}>Boshqa kalit so'z bilan qidiring</p>
          </div>
        ) : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '16px' }}>
              {movies.map((m, i) => (
                <div key={m.id} className="fade-in-up" style={{ animationDelay: `${i * 0.04}s` }}>
                  <MovieCard movie={m} />
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '40px', flexWrap: 'wrap' }}>
                <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1} className="btn btn-ghost btn-sm">← Oldingi</button>
                {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => i + 1).map(p => (
                  <button key={p} onClick={() => setPage(p)} className="btn btn-sm"
                    style={{
                      background: p === page ? 'linear-gradient(135deg, var(--accent2), var(--accent))' : 'transparent',
                      color: p === page ? '#fff' : 'var(--text2)',
                      border: `1px solid ${p === page ? 'var(--accent)' : 'var(--border)'}`,
                      boxShadow: p === page ? '0 0 15px var(--accent-glow)' : 'none',
                      minWidth: '36px',
                    }}>{p}</button>
                ))}
                <button onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page === totalPages} className="btn btn-ghost btn-sm">Keyingi →</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
