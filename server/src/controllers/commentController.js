import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getMovieComments = async (req, res) => {
  try {
    const { movieId } = req.params;
    const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [comments, total] = await Promise.all([
      prisma.comment.findMany({
        where: { movieId },
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { id: true, username: true, avatar: true } },
          _count: { select: { likes: true } },
        },
      }),
      prisma.comment.count({ where: { movieId } }),
    ]);

    res.json({ comments, total, page: parseInt(page) });
  } catch (err) {
    res.status(500).json({ error: 'Server xatosi' });
  }
};

export const addComment = async (req, res) => {
  try {
    const { content, movieId, postId } = req.body;
    if (!content?.trim()) return res.status(400).json({ error: 'Izoh matni kiritilmagan' });
    if (!movieId && !postId) return res.status(400).json({ error: 'movieId yoki postId kerak' });

    const comment = await prisma.comment.create({
      data: { content: content.trim(), userId: req.user.id, movieId, postId },
      include: {
        user: { select: { id: true, username: true, avatar: true } },
        _count: { select: { likes: true } },
      },
    });

    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ error: 'Server xatosi' });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const comment = await prisma.comment.findUnique({ where: { id } });
    if (!comment) return res.status(404).json({ error: 'Izoh topilmadi' });
    if (comment.userId !== req.user.id) return res.status(403).json({ error: 'Ruxsat yo\'q' });

    await prisma.comment.delete({ where: { id } });
    res.json({ message: 'Izoh ochirildi' });
  } catch (err) {
    res.status(500).json({ error: 'Server xatosi' });
  }
};

export const toggleLike = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await prisma.like.findUnique({
      where: { userId_commentId: { userId: req.user.id, commentId: id } },
    });

    if (existing) {
      await prisma.like.delete({ where: { userId_commentId: { userId: req.user.id, commentId: id } } });
      res.json({ liked: false });
    } else {
      await prisma.like.create({ data: { userId: req.user.id, commentId: id } });
      res.json({ liked: true });
    }
  } catch (err) {
    res.status(500).json({ error: 'Server xatosi' });
  }
};
