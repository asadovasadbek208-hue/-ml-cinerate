import { useState } from 'react';
import api from '../../api/axios.js';
import { getCriteria, calcAverage } from '../../api/criteria.js';

const getColor = (v) => v <= 3 ? '#ff4f6a' : v <= 6 ? '#ffd700' : '#4fff9f';

export default function RatingForm({ movieId, movieType = 'MOVIE', existing, onSaved }) {
  const criteria = getCriteria(movieType);
  const init = {};
  criteria.forEach(c => { init[c.key] = existing?.[c.key] ?? 0; });

  const [scores, setScores] = useState(init);
  const [review, setReview] = useState(existing?.review ?? '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const filled = criteria.filter(c => scores[c.key] > 0);
  const previewAvg = filled.length ? calcAverage(scores, movieType) : null;

  const handleSubmit = async () => {
    if (filled.length === 0) return setError("Kamida bitta mezonni baholang");
    setSaving(true); setError('');
    try {
      const data = { review, movieType };
      criteria.forEach(c => { if (scores[c.key] > 0) data[c.key] = scores[c.key]; });
      await api.post(`/ratings/movie/${movieId}`, data);
      onSaved?.();
    } catch (e) { setError(e.response?.data?.error || 'Xatolik'); }
    setSaving(false);
  };

  const TYPE_INFO = {
    MOVIE: { label: 'Kino', icon: '🎬', source: 'Oscar/BAFTA mezonlari' },
    SERIES: { label: 'Serial', icon: '📺', source: 'Emmy mezonlari' },
    ANIME: { label: 'Anime', icon: '🌸', source: 'MAL/Anime Critics mezonlari' },
    DRAMA: { label: 'Drama', icon: '🎭', source: 'International Drama mezonlari' },
  };
  const info = TYPE_INFO[movieType] || TYPE_INFO.MOVIE;

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
        <div>
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--accent3)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            {info.icon} Baholash
          </h3>
          <p style={{ fontSize: '10px', color: 'var(--text3)', marginTop: '2px' }}>{info.source}</p>
        </div>
        {previewAvg && (
          <div style={{ textAlign: 'center' }}>
            <div className="score-display" style={{ fontSize: '42px', lineHeight: 1 }}>{previewAvg}</div>
            <div style={{ fontSize: '10px', color: 'var(--text3)' }}>/ 10</div>
          </div>
        )}
      </div>

      {/* Progress */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text3)', marginBottom: '4px' }}>
          <span>{filled.length}/{criteria.length} mezon baholandi</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${(filled.length / criteria.length) * 100}%` }} />
        </div>
      </div>

      {/* Criteria */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {criteria.map(({ key, label, emoji, desc }) => (
          <div key={key}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
              <div>
                <span style={{ fontSize: '12px', color: 'var(--text2)', fontWeight: 600 }}>{emoji} {label}</span>
                <span style={{ fontSize: '10px', color: 'var(--text3)', marginLeft: '6px' }}>{desc}</span>
              </div>
              <span style={{
                fontSize: '14px', fontWeight: 700, minWidth: '24px', textAlign: 'right',
                color: scores[key] ? getColor(scores[key]) : 'var(--text3)',
                filter: scores[key] ? `drop-shadow(0 0 5px ${getColor(scores[key])}80)` : 'none',
              }}>
                {scores[key] || '—'}
              </span>
            </div>
            <div style={{ display: 'flex', gap: '3px' }}>
              {[1,2,3,4,5,6,7,8,9].map(n => (
                <button key={n}
                  onClick={() => setScores(p => ({ ...p, [key]: p[key] === n ? 0 : n }))}
                  style={{
                    flex: 1, height: '24px', borderRadius: '4px', border: 'none',
                    background: scores[key] >= n ? getColor(scores[key]) : 'var(--bg3)',
                    color: scores[key] >= n ? '#000' : 'var(--text3)',
                    fontSize: '11px', fontWeight: 700, cursor: 'pointer',
                    transition: 'all 0.12s',
                    opacity: scores[key] >= n ? 1 : 0.6,
                    boxShadow: scores[key] >= n ? `0 0 6px ${getColor(scores[key])}60` : 'none',
                  }}>
                  {n}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Review */}
      <div style={{ marginTop: '14px' }}>
        <textarea className="form-input" placeholder="Qo'shimcha fikr (ixtiyoriy)..."
          value={review} onChange={e => setReview(e.target.value)}
          rows={2} style={{ width: '100%', resize: 'vertical', fontSize: '13px' }} />
      </div>

      {error && <p style={{ color: 'var(--red)', fontSize: '12px', marginTop: '6px' }}>⚠️ {error}</p>}

      <button className="btn btn-primary" onClick={handleSubmit} disabled={saving}
        style={{ marginTop: '12px', width: '100%', justifyContent: 'center', fontSize: '14px' }}>
        {saving ? 'Saqlanmoqda...' : existing ? '✏️ Yangilash' : '⭐ Baholash'}
      </button>
    </div>
  );
}
