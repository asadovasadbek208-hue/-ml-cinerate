import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getConversations = async (req, res) => {
  try {
    const messages = await prisma.message.findMany({
      where: { OR: [{ senderId: req.user.id }, { receiverId: req.user.id }] },
      orderBy: { createdAt: 'desc' },
      include: {
        sender: { select: { id: true, username: true, avatar: true } },
        receiver: { select: { id: true, username: true, avatar: true } },
      },
    });
    // Group by conversation partner
    const convMap = new Map();
    messages.forEach(m => {
      const partner = m.senderId === req.user.id ? m.receiver : m.sender;
      if (!convMap.has(partner.id)) {
        convMap.set(partner.id, { partner, lastMessage: m, unread: 0 });
      }
      if (!m.read && m.receiverId === req.user.id) {
        convMap.get(partner.id).unread++;
      }
    });
    res.json(Array.from(convMap.values()));
  } catch { res.status(500).json({ error: 'Server xatosi' }); }
};

export const getMessages = async (req, res) => {
  try {
    const { username } = req.params;
    const partner = await prisma.user.findUnique({ where: { username } });
    if (!partner) return res.status(404).json({ error: 'Topilmadi' });

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: req.user.id, receiverId: partner.id },
          { senderId: partner.id, receiverId: req.user.id },
        ],
      },
      orderBy: { createdAt: 'asc' },
      include: {
        sender: { select: { id: true, username: true, avatar: true } },
      },
    });

    // Mark as read
    await prisma.message.updateMany({
      where: { senderId: partner.id, receiverId: req.user.id, read: false },
      data: { read: true },
    });

    res.json({ messages, partner });
  } catch { res.status(500).json({ error: 'Server xatosi' }); }
};

export const sendMessage = async (req, res) => {
  try {
    const { username } = req.params;
    const { content } = req.body;
    if (!content?.trim()) return res.status(400).json({ error: "Xabar matni kiritilmagan" });

    const partner = await prisma.user.findUnique({ where: { username } });
    if (!partner) return res.status(404).json({ error: 'Topilmadi' });

    const message = await prisma.message.create({
      data: { senderId: req.user.id, receiverId: partner.id, content: content.trim() },
      include: { sender: { select: { id: true, username: true, avatar: true } } },
    });
    res.status(201).json(message);
  } catch { res.status(500).json({ error: 'Server xatosi' }); }
};
