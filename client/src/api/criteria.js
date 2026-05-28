// Official rating criteria by content type

export const CRITERIA = {
  MOVIE: [
    { key: 'storyline', label: 'Syujet', emoji: '📖', desc: 'Hikoya va narrativ' },
    { key: 'screenplay', label: 'Ssenariy', emoji: '✍️', desc: 'Dialog va yozuv sifati' },
    { key: 'acting', label: 'Aktyorlik', emoji: '🎭', desc: 'Ijro va his-tuyg\'ular' },
    { key: 'direction', label: 'Rejissura', emoji: '🎬', desc: 'Rejissyor mahorati' },
    { key: 'cinematography', label: 'Operatorlik', emoji: '📷', desc: 'Vizual kompozitsiya' },
    { key: 'editing', label: 'Montaj', emoji: '✂️', desc: 'Sahnalar kesimi' },
    { key: 'soundtrack', label: 'Musiqa', emoji: '🎵', desc: 'Soundtrack va score' },
    { key: 'production', label: 'Prodakshn', emoji: '🏛️', desc: 'Dekor va kostüm' },
    { key: 'vfx', label: 'Vizual effekt', emoji: '✨', desc: 'VFX va CGI' },
    { key: 'emotional', label: 'Emotsiya', emoji: '❤️', desc: 'His-tuyg\'u ta\'siri' },
  ],
  SERIES: [
    { key: 'storyline', label: 'Syujet', emoji: '📖', desc: 'Asosiy va qo\'shimcha syujet' },
    { key: 'writing', label: 'Yozuv', emoji: '✍️', desc: 'Skript va dialog' },
    { key: 'acting', label: 'Aktyorlik', emoji: '🎭', desc: 'Ansambl ijrosi' },
    { key: 'direction', label: 'Rejissura', emoji: '🎬', desc: 'Epizodlar boshqaruvi' },
    { key: 'cinematography', label: 'Operatorlik', emoji: '📷', desc: 'Vizual uslub' },
    { key: 'pacing', label: 'Temp', emoji: '⏱️', desc: 'Sezon rivojlanishi' },
    { key: 'characters', label: 'Personajlar', emoji: '👥', desc: 'Xarakter o\'sishi' },
    { key: 'soundtrack', label: 'Musiqa', emoji: '🎵', desc: 'OST va atmosfera' },
    { key: 'production', label: 'Prodakshn', emoji: '🏛️', desc: 'Byudjet va sifat' },
    { key: 'rewatchability', label: 'Qayta ko\'rish', emoji: '🔄', desc: 'Qayta ko\'rish istagi' },
  ],
  ANIME: [
    { key: 'storyline', label: 'Syujet', emoji: '📖', desc: 'Hikoya va world-building' },
    { key: 'animation', label: 'Animatsiya', emoji: '🎨', desc: 'Animatsiya sifati' },
    { key: 'artstyle', label: 'Art uslub', emoji: '🖼️', desc: 'Vizual dizayn' },
    { key: 'characters', label: 'Personajlar', emoji: '👥', desc: 'Xarakter rivojlanishi' },
    { key: 'voiceacting', label: 'Ovoz ijrosi', emoji: '🎙️', desc: 'Seiyuu mahorati' },
    { key: 'soundtrack', label: 'Musiqa', emoji: '🎵', desc: 'OP/ED va OST' },
    { key: 'pacing', label: 'Temp', emoji: '⏱️', desc: 'Hikoya tempi' },
    { key: 'originality', label: 'Originallik', emoji: '💡', desc: 'Yangilik va ijod' },
    { key: 'worldbuilding', label: 'Dunyo qurilishi', emoji: '🌍', desc: 'Universum chuqurligi' },
    { key: 'emotional', label: 'Emotsiya', emoji: '❤️', desc: 'His-tuyg\'u ta\'siri' },
  ],
  DRAMA: [
    { key: 'storyline', label: 'Syujet', emoji: '📖', desc: 'Drama asosi' },
    { key: 'acting', label: 'Aktyorlik', emoji: '🎭', desc: 'Ijro mahorati' },
    { key: 'chemistry', label: 'Kimyo', emoji: '💞', desc: 'Aktyorlar o\'rtasidagi kimyo' },
    { key: 'direction', label: 'Rejissura', emoji: '🎬', desc: 'Sahna boshqaruvi' },
    { key: 'ost', label: 'OST', emoji: '🎵', desc: 'Original soundtrack' },
    { key: 'emotional', label: 'Emotsiya', emoji: '❤️', desc: 'His-tuyg\'u chuqurligi' },
    { key: 'pacing', label: 'Temp', emoji: '⏱️', desc: 'Rivojlanish tezligi' },
    { key: 'characters', label: 'Personajlar', emoji: '👥', desc: 'Xarakter o\'sishi' },
    { key: 'cinematography', label: 'Operatorlik', emoji: '📷', desc: 'Vizual uslub' },
    { key: 'ending', label: 'Yakunlanish', emoji: '🎯', desc: 'Finale va xulosa' },
  ],
};

export const getCriteria = (type) => CRITERIA[type] || CRITERIA.MOVIE;

export const calcAverage = (scores, type) => {
  const criteria = getCriteria(type);
  const values = criteria.map(c => scores[c.key]).filter(v => v > 0);
  if (!values.length) return null;
  const raw = values.reduce((a, b) => a + b, 0) / values.length;
  return Math.round(((raw - 1) / 8 * 9 + 1) * 10) / 10;
};

export const STICKERS = [
  '🎬', '🍿', '⭐', '🏆', '🎭', '🎪', '🎨', '🎯',
  '🌟', '💫', '🔥', '❤️', '💜', '🎵', '🎮', '🌸',
  '🦋', '👑', '🌙', '⚡', '🎃', '🤖', '🦊', '🐉', 
  '👽', '🤘', '🤝🏻', '🤝🏿', '🫱🏻‍🫲🏿',
];

export const TYPE_LABELS = {
  MOVIE: 'Kino',
  SERIES: 'Serial',
  ANIME: 'Anime',
  DRAMA: 'Drama',
};

export const ALL_GENRES = [
  'Action', 'Adventure', 'Animation', 'Comedy', 'Crime',
  'Documentary', 'Drama', 'Fantasy', 'Horror', 'Mystery',
  'Romance', 'Sci-Fi', 'Thriller', 'Western', 'Musical',
  'Biography', 'History', 'Sport', 'War', 'Family',
  'Superhero', 'Psychological', 'Slice of Life', 'Isekai',
  'Mecha', 'Shounen', 'Shoujo', 'Seinen', 'Josei',
];
