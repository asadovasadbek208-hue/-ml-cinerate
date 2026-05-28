import { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api/axios.js';
import { useAuth } from '../context/AuthContext.jsx';
import { STICKERS } from '../api/criteria.js';

const scoreColor = s => s >= 8 ? '#4fff9f' : s >= 6 ? '#b44fff' : s >= 4 ? '#ffd700' : '#ff4f6a';
const TYPE_LABELS = { MOVIE: '🎬', SERIES: '📺', ANIME: '🌸', DRAMA: '🎭' };

export default function ProfilePage() {
  const { username } = useParams();
  const { user: me, setUser } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('ratings');

  // Edit state
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ bio: '', username: '', sticker: '' });
  const [showStickerPicker, setShowStickerPicker] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [bgFile, setBgFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const avatarRef = useRef();
  const bgRef = useRef();

  const isMe = me?.username === username;

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [pRes, rRes, follRes, folliRes] = await Promise.all([
          api.get(`/users/${username}`),
          api.get(`/users/${username}/ratings`),
          api.get(`/follow/${username}/followers`),
          api.get(`/follow/${username}/following`),
        ]);
        setProfile(pRes.data);
        setRatings(rRes.data);
        setFollowers(follRes.data);
        setFollowing(folliRes.data);
        setEditForm({ bio: pRes.data.bio || '', username: pRes.data.username, sticker: pRes.data.sticker || '' });
        if (me && !isMe) {
          const fRes = await api.get(`/follow/check/${username}`);
          setIsFollowing(fRes.data.following);
        }
      } catch {}
      setLoading(false);
    };
    fetchAll();
  }, [username, me]);

  const handleFollow = async () => {
    try {
      const res = await api.post(`/follow/${username}`);
      setIsFollowing(res.data.following);
      if (res.data.following) setFollowers(f => [...f, { id: me.id, username: me.username, avatar: me.avatar }]);
      else setFollowers(f => f.filter(x => x.id !== me.id));
    } catch {}
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('bio', editForm.bio);
      fd.append('sticker', editForm.sticker);
      if (editForm.username !== profile.username) fd.append('username', editForm.username);
      if (avatarFile) fd.append('avatar', avatarFile);
      if (bgFile) fd.append('bg', bgFile);
      const res = await api.put('/users/me/profile', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setProfile(p => ({ ...p, ...res.data }));
      setEditing(false);
      if (editForm.username !== username) navigate(`/profile/${editForm.username}`);
    } catch (e) {
      alert(e.response?.data?.error || 'Xatolik');
    }
    setSaving(false);
  };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '80px' }}><div className="spinner" /></div>;
  if (!profile) return <div style={{ textAlign: 'center', padding: '80px', color: 'var(--text2)' }}>Foydalanuvchi topilmadi</div>;

  const tabs = [
    { id: 'ratings', label: `🎬 Baholar (${ratings.length})` },
    { id: 'followers', label: `👥 (${followers.length})` },
    { id: 'following', label: `➕ (${following.length})` },
  ];

  return (
    <div className="container" style={{ paddingTop: '32px', paddingBottom: '60px', maxWidth: '900px' }}>
      {/* Background */}
      <div style={{
        height: '180px', borderRadius: 'var(--radius)', overflow: 'hidden', marginBottom: '-60px',
        background: profile.bgImage
          ? `url(${profile.bgImage}) center/cover`
          : 'linear-gradient(135deg, #1e0028, #3a0f52, #160020)',
        position: 'relative', cursor: isMe && editing ? 'pointer' : 'default',
      }} onClick={() => isMe && editing && bgRef.current?.click()}>
        {isMe && editing && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.4)', fontSize: '14px', color: '#fff' }}>
            📷 Fon rasmi o'zgartirish
          </div>
        )}
        <input ref={bgRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => setBgFile(e.target.files[0])} />
      </div>

      {/* Profile card */}
      <div className="card" style={{ padding: '24px', position: 'relative', marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          {/* Avatar */}
          <div style={{ position: 'relative', marginTop: '-48px', flexShrink: 0 }}>
            <div className="avatar pulse-glow" style={{
              width: '88px', height: '88px', fontSize: '36px',
              border: '3px solid var(--bg2)', cursor: isMe && editing ? 'pointer' : 'default',
            }} onClick={() => isMe && editing && avatarRef.current?.click()}>
              {avatarFile
                ? <img src={URL.createObjectURL(avatarFile)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                : profile.avatar
                  ? <img src={profile.avatar} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                  : <span>{profile.sticker || profile.username[0].toUpperCase()}</span>
              }
              {isMe && editing && (
                <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>📷</div>
              )}
            </div>
            <input ref={avatarRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => setAvatarFile(e.target.files[0])} />
          </div>

          {/* Info */}
          <div style={{ flex: 1, minWidth: '180px', paddingTop: '8px' }}>
            {editing ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <input className="form-input" value={editForm.username} onChange={e => setEditForm(p => ({ ...p, username: e.target.value }))}
                  placeholder="Username" style={{ fontSize: '18px', fontWeight: 700 }} />
                <input className="form-input" value={editForm.bio} onChange={e => setEditForm(p => ({ ...p, bio: e.target.value }))}
                  placeholder="Bio yozing..." style={{ fontSize: '13px' }} />
                {/* Sticker picker */}
                <div>
                  <button className="btn btn-ghost btn-sm" onClick={() => setShowStickerPicker(!showStickerPicker)}>
                    {editForm.sticker || '😊'} Sticker tanlash
                  </button>
                  {showStickerPicker && (
                    <div style={{
                      display: 'flex', flexWrap: 'wrap', gap: '6px', padding: '12px',
                      background: 'var(--bg3)', borderRadius: 'var(--radius-sm)', marginTop: '6px',
                    }}>
                      {STICKERS.map(s => (
                        <button key={s} onClick={() => { setEditForm(p => ({ ...p, sticker: s })); setShowStickerPicker(false); }}
                          style={{
                            width: '36px', height: '36px', fontSize: '20px', borderRadius: '8px',
                            background: editForm.sticker === s ? 'var(--accent2)' : 'var(--bg4)',
                            border: `1px solid ${editForm.sticker === s ? 'var(--accent)' : 'var(--border)'}`,
                            cursor: 'pointer', transition: 'all 0.15s',
                          }}>
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button className="btn btn-primary btn-sm" onClick={handleSave} disabled={saving}>{saving ? '...' : 'Saqlash'}</button>
                  <button className="btn btn-ghost btn-sm" onClick={() => setEditing(false)}>Bekor</button>
                </div>
              </div>
            ) : (
              <>
                <h1 style={{
                  fontFamily: 'var(--font-display)', fontSize: '36px', letterSpacing: '2px',
                  background: 'linear-gradient(135deg, var(--text), var(--accent3))',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                }}>
                  {profile.sticker && <span style={{ marginRight: '8px', WebkitTextFillColor: 'initial' }}>{profile.sticker}</span>}
                  {profile.username}
                </h1>
                {profile.bio && <p style={{ color: 'var(--text2)', marginTop: '4px', fontSize: '14px' }}>{profile.bio}</p>}
                <div style={{ display: 'flex', gap: '20px', marginTop: '12px', flexWrap: 'wrap' }}>
                  {[{ n: ratings.length, l: 'Baho' }, { n: followers.length, l: 'Kuzatuvchi' }, { n: following.length, l: 'Kuzatmoqda' }].map(s => (
                    <div key={s.l}>
                      <span style={{ fontFamily: 'var(--font-display)', fontSize: '22px', color: 'var(--accent3)' }}>{s.n}</span>
                      <span style={{ fontSize: '11px', color: 'var(--text3)', marginLeft: '4px', textTransform: 'uppercase' }}>{s.l}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Actions */}
          {!editing && (
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {isMe
                ? <button className="btn btn-ghost btn-sm" onClick={() => setEditing(true)}>✏️ Tahrirlash</button>
                : me && <>
                    <button className="btn btn-sm" onClick={handleFollow}
                      style={isFollowing
                        ? { background: 'transparent', border: '1px solid var(--border2)', color: 'var(--text2)' }
                        : { background: 'linear-gradient(135deg, var(--accent2), var(--accent))', color: '#fff', border: 'none', boxShadow: '0 4px 20px var(--accent-glow)' }}>
                      {isFollowing ? '✓ Kuzatilmoqda' : '+ Kuzatish'}
                    </button>
                    <Link to={`/chat?user=${username}`} className="btn btn-ghost btn-sm">💬 Xabar</Link>
                  </>
              }
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '20px', borderBottom: '1px solid var(--border)' }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            background: 'none', border: 'none', padding: '10px 16px', cursor: 'pointer',
            color: tab === t.id ? 'var(--accent3)' : 'var(--text3)',
            borderBottom: `2px solid ${tab === t.id ? 'var(--accent)' : 'transparent'}`,
            fontSize: '13px', fontWeight: 600, transition: 'all 0.2s',
          }}>{t.label}</button>
        ))}
      </div>

      {tab === 'ratings' && (
        ratings.length === 0
          ? <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text3)' }}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>🎬</div>
              <p>Hali hech narsa baholanmagan</p>
            </div>
          : <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '10px' }}>
              {ratings.map(r => (
                <Link to={`/movie/${r.movie.id}`} key={r.id}>
                  <div className="card card-glow" style={{ display: 'flex', gap: '12px', padding: '12px' }}>
                    <div style={{ width: '44px', height: '66px', flexShrink: 0, borderRadius: '6px', overflow: 'hidden', background: 'var(--bg3)' }}>
                      {r.movie.poster ? <img src={r.movie.poster} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" /> : <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>{TYPE_LABELS[r.movie.type]}</div>}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '10px', color: 'var(--text3)' }}>{TYPE_LABELS[r.movie.type]} {r.movie.year}</div>
                      <div style={{ fontWeight: 600, fontSize: '13px', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.movie.title}</div>
                      {r.review && <div style={{ fontSize: '11px', color: 'var(--text3)', marginTop: '3px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.review}</div>}
                    </div>
                    {r.average && <div style={{ fontFamily: 'var(--font-display)', fontSize: '26px', color: scoreColor(r.average), flexShrink: 0 }}>{r.average}</div>}
                  </div>
                </Link>
              ))}
            </div>
      )}

      {(tab === 'followers' || tab === 'following') && (() => {
        const list = tab === 'followers' ? followers : following;
        return list.length === 0
          ? <p style={{ color: 'var(--text3)', padding: '40px 0', textAlign: 'center' }}>Hali yo'q</p>
          : <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px' }}>
              {list.map(u => (
                <Link to={`/profile/${u.username}`} key={u.id}>
                  <div className="card card-glow" style={{ display: 'flex', gap: '12px', padding: '12px', alignItems: 'center' }}>
                    <div className="avatar" style={{ width: '40px', height: '40px', fontSize: '16px' }}>
                      {u.avatar ? <img src={u.avatar} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" /> : u.sticker || u.username[0].toUpperCase()}
                    </div>
                    <span style={{ fontWeight: 600, fontSize: '13px', color: 'var(--accent3)' }}>@{u.username}</span>
                  </div>
                </Link>
              ))}
            </div>;
      })()}
    </div>
  );
}
