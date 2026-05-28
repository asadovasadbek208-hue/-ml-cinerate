import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const ALL_CRITERIA = [
  'storyline','acting','direction','soundtrack','pacing','characters','emotional','originality',
  'screenplay','cinematography','editing','production','vfx',
  'writing','rewatchability',
  'animation','artstyle','voiceacting','worldbuilding',
  'chemistry','ost','ending',
];

const calcAverage = (data) => {
  const values = ALL_CRITERIA.map(k => data[k]).filter(v => v !== null && v !== undefined);
  if (!values.length) return null;
  const raw = values.reduce((a, b) => a + b, 0) / values.length;
  return Math.round(((raw - 1) / 8 * 9 + 1) * 10) / 10;
};

export const rateMovie = async (req, res) => {
  try {
    const { movieId } = req.params;
    const { review, movieType, ...rest } = req.body;
    const criteriaData = {};
    ALL_CRITERIA.forEach(k => {
      if (rest[k] !== undefined) {
        const v = parseFloat(rest[k]);
        if (v >= 1 && v <= 9) criteriaData[k] = v;
      }
    });
    const average = calcAverage(criteriaData);
    const rating = await prisma.rating.upsert({
      where: { userId_movieId: { userId: req.user.id, movieId } },
      update: { ...criteriaData, average, review, movieType: movieType || 'MOVIE' },
      create: { userId: req.user.id, movieId, ...criteriaData, average, review, movieType: movieType || 'MOVIE' },
      include: { user: { select: { id: true, username: true, avatar: true, sticker: true } } },
    });
    res.json(rating);
  } catch (e) { console.error(e); res.status(500).json({ error: 'Server xatosi' }); }
};

export const getMovieRatings = async (req, res) => {
  try {
    const { movieId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [ratings, total] = await Promise.all([
      prisma.rating.findMany({
        where: { movieId }, skip, take: parseInt(limit), orderBy: { createdAt: 'desc' },
        include: { user: { select: { id: true, username: true, avatar: true, sticker: true } } },
      }),
      prisma.rating.count({ where: { movieId } }),
    ]);
    res.json({ ratings, total, page: parseInt(page) });
  } catch { res.status(500).json({ error: 'Server xatosi' }); }
};

export const getUserRating = async (req, res) => {
  try {
    const { movieId } = req.params;
    const rating = await prisma.rating.findUnique({ where: { userId_movieId: { userId: req.user.id, movieId } } });
    res.json(rating);
  } catch { res.status(500).json({ error: 'Server xatosi' }); }
};

export const deleteRating = async (req, res) => {
  try {
    const { movieId } = req.params;
    await prisma.rating.delete({ where: { userId_movieId: { userId: req.user.id, movieId } } });
    res.json({ message: 'Baho ochirildi' });
  } catch { res.status(500).json({ error: 'Server xatosi' }); }
};
