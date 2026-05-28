import { Router } from 'express';
import { rateMovie, getMovieRatings, getUserRating, deleteRating } from '../controllers/ratingController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/movie/:movieId', getMovieRatings);
router.get('/movie/:movieId/mine', authenticate, getUserRating);
router.post('/movie/:movieId', authenticate, rateMovie);
router.delete('/movie/:movieId', authenticate, deleteRating);

export default router;
