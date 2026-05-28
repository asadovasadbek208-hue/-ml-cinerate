import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getPosts = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { id: true, username: true, avatar: true } },
          _count: { select: { comments: true, likes: true } },
        },
      }),
      prisma.post.count(),
    ]);

    res.json({ posts, total, page: parseInt(page) });
  } catch (err) {
    res.status(500).json({ error: 'Server xatosi' });
  }
};

export const getPost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, username: true, avatar: true } },
        _count: { select: { comments: true, likes: true } },
        comments: {
          orderBy: { createdAt: 'desc' },
          include: {
            user: { select: { id: true, username: true, avatar: true } },
            _count: { select: { likes: true } },
          },
        },
      },
    });
    if (!post) return res.status(404).json({ error: 'Post topilmadi' });
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: 'Server xatosi' });
  }
};

export const createPost = async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) return res.status(400).json({ error: "Sarlavha va matn majburiy" });

    const image = req.file ? `/uploads/posts/${req.file.filename}` : null;
    const post = await prisma.post.create({
      data: { title, content, image, userId: req.user.id },
      include: { user: { select: { id: true, username: true, avatar: true } } },
    });
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ error: 'Server xatosi' });
  }
};

export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await prisma.post.findUnique({ where: { id } });
    if (!post) return res.status(404).json({ error: 'Post topilmadi' });
    if (post.userId !== req.user.id) return res.status(403).json({ error: 'Ruxsat yo\'q' });

    await prisma.post.delete({ where: { id } });
    res.json({ message: 'Post ochirildi' });
  } catch (err) {
    res.status(500).json({ error: 'Server xatosi' });
  }
};

export const toggleLike = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await prisma.like.findUnique({
      where: { userId_postId: { userId: req.user.id, postId: id } },
    });

    if (existing) {
      await prisma.like.delete({ where: { userId_postId: { userId: req.user.id, postId: id } } });
      res.json({ liked: false });
    } else {
      await prisma.like.create({ data: { userId: req.user.id, postId: id } });
      res.json({ liked: true });
    }
  } catch (err) {
    res.status(500).json({ error: 'Server xatosi' });
  }
};
