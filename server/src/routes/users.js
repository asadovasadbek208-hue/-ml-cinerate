import { Router } from 'express';
import { getProfile, getUserRatings, updateProfile } from '../controllers/userController.js';
import { authenticate } from '../middleware/auth.js';
import { uploadFields } from '../middleware/upload.js';
const router = Router();
router.get('/:username', getProfile);
router.get('/:username/ratings', getUserRatings);
router.put('/me/profile', authenticate, uploadFields, updateProfile);
export default router;
