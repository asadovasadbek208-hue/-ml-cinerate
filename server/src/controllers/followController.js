import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const toggleFollow = async (req, res) => {
  try {
    const { username } = req.params;
    const target = await prisma.user.findUnique({ where: { username } });
    if (!target) return res.status(404).json({ error: 'Foydalanuvchi topilmadi' });
    if (target.id === req.user.id) return res.status(400).json({ error: "O'zingizni follow qila olmaysiz" });

    const existing = await prisma.follow.findUnique({
      where: { followerId_followingId: { followerId: req.user.id, followingId: target.id } },
    });
    if (existing) {
      await prisma.follow.delete({ where: { followerId_followingId: { followerId: req.user.id, followingId: target.id } } });
      res.json({ following: false });
    } else {
      await prisma.follow.create({ data: { followerId: req.user.id, followingId: target.id } });
      res.json({ following: true });
    }
  } catch { res.status(500).json({ error: 'Server xatosi' }); }
};

export const checkFollow = async (req, res) => {
  try {
    const { username } = req.params;
    const target = await prisma.user.findUnique({ where: { username } });
    if (!target) return res.json({ following: false });
    const f = await prisma.follow.findUnique({
      where: { followerId_followingId: { followerId: req.user.id, followingId: target.id } },
    });
    res.json({ following: !!f });
  } catch { res.status(500).json({ error: 'Server xatosi' }); }
};

export const getFollowers = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) return res.status(404).json({ error: 'Topilmadi' });
    const followers = await prisma.follow.findMany({
      where: { followingId: user.id },
      include: { follower: { select: { id: true, username: true, avatar: true } } },
    });
    res.json(followers.map(f => f.follower));
  } catch { res.status(500).json({ error: 'Server xatosi' }); }
};

export const getFollowing = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) return res.status(404).json({ error: 'Topilmadi' });
    const following = await prisma.follow.findMany({
      where: { followerId: user.id },
      include: { following: { select: { id: true, username: true, avatar: true } } },
    });
    res.json(following.map(f => f.following));
  } catch { res.status(500).json({ error: 'Server xatosi' }); }
};
