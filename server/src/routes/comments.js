import { Router } from 'express';
import { getMovieComments, addComment, deleteComment, toggleLike } from '../controllers/commentController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/movie/:movieId', getMovieComments);
router.post('/', authenticate, addComment);
router.delete('/:id', authenticate, deleteComment);
router.post('/:id/like', authenticate, toggleLike);

export default router;
