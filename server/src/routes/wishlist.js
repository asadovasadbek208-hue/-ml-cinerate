import { Router } from 'express';
import { toggleWishlist, getMyWishlist, checkWishlist } from '../controllers/wishlistController.js';
import { authenticate } from '../middleware/auth.js';
const router = Router();
router.get('/', authenticate, getMyWishlist);
router.get('/check/:movieId', authenticate, checkWishlist);
router.post('/:movieId', authenticate, toggleWishlist);
export default router;
