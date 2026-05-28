import { Router } from 'express';
import { getMovies, getMovie, createMovie, updateMovie } from '../controllers/movieController.js';
import { toggleWishlist, checkWishlist } from '../controllers/wishlistController.js';
import { authenticate, optionalAuth } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = Router();

router.get('/', optionalAuth, getMovies);
router.get('/:id', optionalAuth, getMovie);
router.post('/', authenticate, (req, res, next) => { req.uploadFolder = 'posters'; next(); }, upload.single('poster'), createMovie);
router.put('/:id', authenticate, (req, res, next) => { req.uploadFolder = 'posters'; next(); }, upload.single('poster'), updateMovie);
router.post('/:movieId/wishlist', authenticate, toggleWishlist);
router.get('/:movieId/wishlist/check', authenticate, checkWishlist);

export default router;
