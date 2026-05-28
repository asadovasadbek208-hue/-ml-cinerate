import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getMovies = async (req, res) => {
  try {
    const { type, genre, search, sort = 'createdAt', order = 'desc', page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {};
    if (type) where.type = type.toUpperCase();
    if (genre) where.genres = { has: genre };
    if (search) where.title = { contains: search, mode: 'insensitive' };

    const [movies, total] = await Promise.all([
      prisma.movie.findMany({
        where,
        orderBy: { [sort]: order },
        skip,
        take: parseInt(limit),
        include: {
          _count: { select: { ratings: true, comments: true } },
          ratings: { select: { average: true } },
        },
      }),
      prisma.movie.count({ where }),
    ]);

    const moviesWithAvg = movies.map((m) => {
      const validRatings = m.ratings.filter((r) => r.average !== null);
      const avg = validRatings.length
        ? validRatings.reduce((acc, r) => acc + r.average, 0) / validRatings.length
        : null;
      const { ratings, ...rest } = m;
      return { ...rest, globalAverage: avg ? Math.round(avg * 10) / 10 : null };
    });

    res.json({ movies: moviesWithAvg, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server xatosi' });
  }
};
export const getMovie = async (req, res) => {
  try {
    const { id } = req.params;
    const movie = await prisma.movie.findUnique({
      where: { id },
      include: {
        _count: { select: { ratings: true, comments: true } },
        ratings: true,
      },
    });
    if (!movie) return res.status(404).json({ error: 'Kino topilmadi' });

    const validRatings = movie.ratings.filter(r => r.average !== null);
    const globalAverage = validRatings.length
      ? validRatings.reduce((acc, r) => acc + r.average, 0) / validRatings.length
      : null;

    const criteriaKeys = [
      'storyline','acting','direction','soundtrack','pacing','characters','emotional','originality',
      'screenplay','cinematography','editing','production','vfx',
      'writing','rewatchability','animation','artstyle','voiceacting','worldbuilding',
      'chemistry','ost','ending',
    ];
    const criteriaAverages = {};
    criteriaKeys.forEach(key => {
      const vals = movie.ratings.filter(r => r[key] !== null).map(r => r[key]);
      criteriaAverages[key] = vals.length
        ? Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 10) / 10
        : null;
    });

    const { ratings, ...rest } = movie;
    res.json({
      ...rest,
      globalAverage: globalAverage ? Math.round(globalAverage * 10) / 10 : null,
      criteriaAverages,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server xatosi' });
  }
};

export const createMovie = async (req, res) => {
  try {
    const { title, originalTitle, description, year, type, genres, director, studio, episodes, status, trailer } = req.body;
    if (!title || !type) return res.status(400).json({ error: "Sarlavha va tur majburiy" });

    // poster can be a URL from TMDB or uploaded file
    const poster = req.file ? `/uploads/posters/${req.file.filename}` : (req.body.poster || null);
    const movie = await prisma.movie.create({
      data: {
        title, originalTitle, description, poster,
        year: year ? parseInt(year) : null,
        type: type.toUpperCase(),
        genres: genres ? (Array.isArray(genres) ? genres : [genres]) : [],
        director, studio,
        episodes: episodes ? parseInt(episodes) : null,
        status, trailer,
      },
    });
    res.status(201).json(movie);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server xatosi' });
  }
};

export const updateMovie = async (req, res) => {
  try {
    const { id } = req.params;
    const data = { ...req.body };
    if (req.file) data.poster = `/uploads/posters/${req.file.filename}`;
    if (data.year) data.year = parseInt(data.year);
    if (data.episodes) data.episodes = parseInt(data.episodes);
    if (data.type) data.type = data.type.toUpperCase();
    if (data.genres && !Array.isArray(data.genres)) data.genres = [data.genres];

    const movie = await prisma.movie.update({ where: { id }, data });
    res.json(movie);
  } catch (err) {
    res.status(500).json({ error: 'Server xatosi' });
  }
};
