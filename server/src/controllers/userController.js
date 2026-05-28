import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getProfile = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await prisma.user.findUnique({
      where: { username },
      select: {
        id: true, username: true, avatar: true, bgImage: true,
        bio: true, sticker: true, createdAt: true,
        _count: { select: { ratings: true, posts: true } },
      },
    });
    if (!user) return res.status(404).json({ error: 'Foydalanuvchi topilmadi' });
    res.json(user);
  } catch { res.status(500).json({ error: 'Server xatosi' }); }
};

export const getUserRatings = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) return res.status(404).json({ error: 'Topilmadi' });
    const ratings = await prisma.rating.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      include: { movie: { select: { id: true, title: true, poster: true, type: true, year: true } } },
    });
    res.json(ratings);
  } catch { res.status(500).json({ error: 'Server xatosi' }); }
};

export const updateProfile = async (req, res) => {
  try {
    const { bio, sticker, username } = req.body;
    const data = {};
    if (bio !== undefined) data.bio = bio;
    if (sticker !== undefined) data.sticker = sticker;
    if (username && username !== req.user.username) {
      const exists = await prisma.user.findUnique({ where: { username } });
      if (exists) return res.status(400).json({ error: 'Bu username band' });
      data.username = username;
    }
    if (req.files?.avatar?.[0]) data.avatar = `/uploads/avatars/${req.files.avatar[0].filename}`;
    if (req.files?.bg?.[0]) data.bgImage = `/uploads/bg/${req.files.bg[0].filename}`;

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data,
      select: { id: true, username: true, email: true, avatar: true, bgImage: true, bio: true, sticker: true },
    });
    res.json(user);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Server xatosi' });
  }
};
