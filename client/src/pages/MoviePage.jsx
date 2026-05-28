import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios.js';
import { useAuth } from '../context/AuthContext.jsx';
import RatingForm from '../components/rating/RatingForm.jsx';
import CommentSection from '../components/comment/CommentSection.jsx';
import { getCriteria } from '../api/criteria.js';

const TYPE_LABELS = { MOVIE: '🎬 Kino', SERIES: '📺 Serial', ANIME: '🌸 Anime', DRAMA: '🎭 Drama' };
const scoreColor = v => v >= 8 ? '#4fff9f' : v >= 6 ? '#b44fff' : v >= 4 ? '#ffd700' : '#ff4f6a';

export default function MoviePage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [movie, setMovie] = useState(null);
  const [myRating, setMyRating] = useState(null);
  const [showRateForm, setShowRateForm] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);
  const [showRatingPanel, setShowRatingPanel] = useState(false);
  const [loading, setLoading] = useState(true);
  const ratingRef = useRef();

  const fetchMovie = async () => {
    try {
      const res = await api.get(`/movies/${id}`);
      setMovie(res.data);
    } catch (e) {
      console.error('Movie fetch error:', e);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyRating = async () => {
    if (!user) return;
    try { const res = await api.get(`/ratings/movie/${id}/mine`); setMyRating(res.data); }
    catch {}
  };

  useEffect(() => { fetchMovie(); }, [id]);
  useEffect(() => { fetchMyRating(); }, [id, user]);

  const getTrailerId = (url) => {
    if (!url) return null;
    const match = url.match(/(?:v=|youtu\.be\/)([^&\s]+)/);
    return match ? match[1] : null;
  };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '80px' }}><div className="spinner" /></div>;
  if (!movie) return <div style={{ textAlign: 'center', padding: '80px', color: 'var(--text2)' }}>Kino topilmadi</div>;

  const criteria = getCriteria(movie.type);

  return (
    <div>
      {/* Hero */}
      <div style={{ position: 'relative', height: '480px', overflow: 'hidden' }}>
        {movie.poster && (
          <img src={movie.poster} alt="" style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%',
            objectFit: 'cover', objectPosition: 'center top',
            animation: 'heroZoom 8s ease-in-out infinite alternate',
          }} />
        )}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.3) 50%, var(--bg) 100%)',
        }} />
        <div className="container" style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'flex-end', paddingBottom: '32px' }}>
          <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
            <div style={{ width: '150px', height: '225px', flexShrink: 0, borderRadius: '10px', overflow: 'hidden', background: 'var(--bg3)', border: '2px solid var(--border2)', boxShadow: '0 20px 60px rgba(0,0,0,0.6)' }}>
              {movie.poster
                ? <img src={movie.poster} alt={movie.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '48px' }}>🎬</div>
              }
            </div>
            <div style={{ paddingBottom: '4px', flex: 1, minWidth: '220px' }}>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap' }}>
                <span className={`badge badge-${movie.type.toLowerCase()}`}>{TYPE_LABELS[movie.type]}</span>
                {movie.year && <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>{movie.year}</span>}
                {movie.genres?.slice(0, 3).map(g => <span key={g} className="tag" style={{ fontSize: '11px', padding: '2px 8px' }}>{g}</span>)}
              </div>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 5vw, 52px)', letterSpacing: '2px', lineHeight: 1.1, textShadow: '0 2px 20px rgba(0,0,0,0.8)', color: '#fff' }}>{movie.title}</h1>
              {movie.originalTitle && <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', marginTop: '4px' }}>{movie.originalTitle}</p>}
              <div style={{ display: 'flex', gap: '16px', marginTop: '14px', alignItems: 'center', flexWrap: 'wrap' }}>
                {movie.globalAverage && (
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                    <span className="score-display" style={{ fontSize: '52px' }}>{movie.globalAverage}</span>
                    <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px' }}>/10 · {movie._count.ratings} baho</span>
                  </div>
                )}
                <div style={{ display: 'flex', gap: '8px' }}>
                  {movie.trailer && <button onClick={() => setShowTrailer(true)} className="btn btn-primary btn-sm">▶ Trailer</button>}
                  {user && <button onClick={() => setShowRatingPanel(true)} className="btn btn-outline-accent btn-sm">⭐ Baholash</button>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trailer modal */}
      {showTrailer && (
        <div className="modal-overlay" onClick={() => setShowTrailer(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div style={{ padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)' }}>
              <span style={{ fontWeight: 600, fontSize: '15px' }}>🎬 {movie.title} — Trailer</span>
              <button onClick={() => setShowTrailer(false)} style={{ background: 'none', border: 'none', color: 'var(--text2)', fontSize: '20px', cursor: 'pointer' }}>✕</button>
            </div>
            <div style={{ aspectRatio: '16/9' }}>
              <iframe src={`https://www.youtube.com/embed/${getTrailerId(movie.trailer)}?autoplay=1`}
                style={{ width: '100%', height: '100%', border: 'none' }} allowFullScreen allow="autoplay" />
            </div>
          </div>
        </div>
      )}

      {/* Rating modal */}
      {showRatingPanel && (
        <div className="modal-overlay" onClick={() => setShowRatingPanel(false)}>
          <div onClick={e => e.stopPropagation()} style={{
            width: '100%', maxWidth: '480px',
            background: 'var(--bg2)', border: '1px solid var(--border2)',
            borderRadius: 'var(--radius)', padding: '24px',
            maxHeight: '90vh', overflowY: 'auto',
            boxShadow: '0 20px 80px rgba(0,0,0,0.5), 0 0 60px var(--accent-glow)',
            animation: 'fadeInUp 0.3s ease',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--accent3)' }}>⭐ {movie.title}</h2>
              <button onClick={() => setShowRatingPanel(false)} style={{ background: 'none', border: 'none', color: 'var(--text2)', fontSize: '20px', cursor: 'pointer' }}>✕</button>
            </div>
            {myRating && !showRateForm ? (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--accent3)' }}>Mening bahom</h3>
                  <span className="score-display" style={{ fontSize: '38px' }}>{myRating.average}</span>
                </div>
                {myRating.review && <p style={{ color: 'var(--text2)', fontSize: '13px', marginBottom: '12px', fontStyle: 'italic' }}>"{myRating.review}"</p>}
                <button className="btn btn-ghost btn-sm" style={{ width: '100%', justifyContent: 'center' }} onClick={() => setShowRateForm(true)}>✏️ Tahrirlash</button>
              </div>
            ) : (
              <RatingForm movieId={id} movieType={movie.type} existing={myRating}
                onSaved={() => { setShowRateForm(false); setShowRatingPanel(false); fetchMovie(); fetchMyRating(); }} />
            )}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="movie-page-grid" style={{ paddingTop: '28px', paddingBottom: '60px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr)', gap: '20px' }}>
          {/* Left */}
          <div>
            {movie.description && (
              <div style={{ marginBottom: '28px' }}>
                <h2 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '10px' }}>Tavsif</h2>
                <p style={{ color: 'var(--text2)', lineHeight: 1.7, fontSize: '15px' }}>{movie.description}</p>
              </div>
            )}

            {/* Criteria averages */}
            {criteria.some(c => movie.criteriaAverages?.[c.key]) && (
              <div style={{ marginBottom: '28px' }}>
                <h2 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '14px' }}>
                  Mezonlar bo'yicha o'rtacha
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {criteria.map(c => {
                    const val = movie.criteriaAverages?.[c.key];
                    if (!val) return null;
                    return (
                      <div key={c.key}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                          <span style={{ fontSize: '12px', color: 'var(--text2)' }}>{c.emoji} {c.label}</span>
                          <span style={{ fontSize: '12px', fontWeight: 700, color: scoreColor(val) }}>{val}/9</span>
                        </div>
                        <div className="progress-bar">
                          <div className="progress-fill" style={{ width: `${(val / 9) * 100}%`, background: `linear-gradient(90deg, ${scoreColor(val)}99, ${scoreColor(val)})` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Comments */}
            <div className="card" style={{ padding: '24px' }}>
              <CommentSection movieId={id} />
            </div>
          </div>

          {/* Right */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Rating card */}
            <div className="card" style={{ padding: '20px' }}>
              {user ? (
                myRating ? (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <h3 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--accent3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Mening bahom</h3>
                      <span className="score-display" style={{ fontSize: '36px' }}>{myRating.average}</span>
                    </div>
                    {myRating.review && <p style={{ color: 'var(--text2)', fontSize: '13px', marginBottom: '12px', fontStyle: 'italic' }}>"{myRating.review}"</p>}
                    <button className="btn btn-ghost btn-sm" style={{ width: '100%', justifyContent: 'center' }}
                      onClick={() => { setShowRateForm(true); setShowRatingPanel(true); }}>✏️ Tahrirlash</button>
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '8px 0' }}>
                    <div className="float" style={{ fontSize: '36px', display: 'block', marginBottom: '10px' }}>⭐</div>
                    <p style={{ color: 'var(--text2)', marginBottom: '14px', fontSize: '14px' }}>Bu kinoni baholadingizmi?</p>
                    <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}
                      onClick={() => setShowRatingPanel(true)}>⭐ Baholash</button>
                  </div>
                )
              ) : (
                <div style={{ textAlign: 'center', padding: '8px 0' }}>
                  <div className="float" style={{ fontSize: '36px', display: 'block', marginBottom: '10px' }}>⭐</div>
                  <p style={{ color: 'var(--text2)', marginBottom: '14px', fontSize: '14px' }}>Baholash uchun kiring</p>
                  <Link to="/login" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', display: 'flex' }}>Kirish</Link>
                </div>
              )}
            </div>

            {/* Movie details */}
            <div className="card" style={{ padding: '18px' }}>
              <h3 style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>Ma'lumotlar</h3>
              {[['Janr', movie.genres?.join(', ')], ['Rejissyor', movie.director], ['Studiya', movie.studio], ['Epizodlar', movie.episodes], ['Status', movie.status]].filter(([,v]) => v).map(([l, v]) => (
                <div key={l} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', gap: '10px' }}>
                  <span style={{ fontSize: '12px', color: 'var(--text3)', flexShrink: 0 }}>{l}</span>
                  <span style={{ fontSize: '12px', textAlign: 'right', color: 'var(--text2)' }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}