import { Router } from 'express';
import { getPosts, getPost, createPost, deletePost, toggleLike } from '../controllers/postController.js';
import { authenticate } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = Router();

router.get('/', getPosts);
router.get('/:id', getPost);
router.post('/', authenticate, (req, res, next) => { req.uploadFolder = 'posts'; next(); }, upload.single('image'), createPost);
router.delete('/:id', authenticate, deletePost);
router.post('/:id/like', authenticate, toggleLike);

export default router;
