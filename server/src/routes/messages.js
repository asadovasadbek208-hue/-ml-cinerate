import { Router } from 'express';
import { getConversations, getMessages, sendMessage } from '../controllers/messageController.js';
import { authenticate } from '../middleware/auth.js';
const router = Router();
router.get('/', authenticate, getConversations);
router.get('/:username', authenticate, getMessages);
router.post('/:username', authenticate, sendMessage);
export default router;
