import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const toggleWishlist = async (req, res) => {
  try {
    const { movieId } = req.params;
    const existing = await prisma.wishlist.findUnique({
      where: { userId_movieId: { userId: req.user.id, movieId } },
    });
    if (existing) {
      await prisma.wishlist.delete({ where: { userId_movieId: { userId: req.user.id, movieId } } });
      res.json({ wishlisted: false });
    } else {
      await prisma.wishlist.create({ data: { userId: req.user.id, movieId } });
      res.json({ wishlisted: true });
    }
  } catch (err) { res.status(500).json({ error: 'Server xatosi' }); }
};

export const getMyWishlist = async (req, res) => {
  try {
    const items = await prisma.wishlist.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
      include: { movie: { include: { _count: { select: { ratings: true } }, ratings: { select: { average: true } } } } },
    });
    const movies = items.map(i => {
      const validR = i.movie.ratings.filter(r => r.average !== null);
      const avg = validR.length ? validR.reduce((a, b) => a + b.average, 0) / validR.length : null;
      const { ratings, ...rest } = i.movie;
      return { ...rest, globalAverage: avg ? Math.round(avg * 10) / 10 : null };
    });
    res.json(movies);
  } catch (err) { res.status(500).json({ error: 'Server xatosi' }); }
};

export const checkWishlist = async (req, res) => {
  try {
    const { movieId } = req.params;
    const item = await prisma.wishlist.findUnique({
      where: { userId_movieId: { userId: req.user.id, movieId } },
    });
    res.json({ wishlisted: !!item });
  } catch { res.status(500).json({ error: 'Server xatosi' }); }
};
