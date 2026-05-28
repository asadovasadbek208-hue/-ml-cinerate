import { Router } from 'express';
import { toggleFollow, checkFollow, getFollowers, getFollowing } from '../controllers/followController.js';
import { authenticate } from '../middleware/auth.js';
const router = Router();
router.post('/:username', authenticate, toggleFollow);
router.get('/check/:username', authenticate, checkFollow);
router.get('/:username/followers', getFollowers);
router.get('/:username/following', getFollowing);
export default router;
