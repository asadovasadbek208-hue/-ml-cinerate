import multer from 'multer';
import path from 'path';
import fs from 'fs';

const ensureDir = (dir) => { if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true }); };

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folder = file.fieldname === 'bg' ? 'bg' : file.fieldname === 'avatar' ? 'avatars' : req.uploadFolder || 'misc';
    const dir = `uploads/${folder}`;
    ensureDir(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const ok = /jpeg|jpg|png|webp|gif/.test(path.extname(file.originalname).toLowerCase());
  ok ? cb(null, true) : cb(new Error('Faqat rasm fayllari'));
};

export const upload = multer({ storage, fileFilter, limits: { fileSize: 8 * 1024 * 1024 } });
export const uploadFields = multer({ storage, fileFilter, limits: { fileSize: 8 * 1024 * 1024 } })
  .fields([{ name: 'avatar', maxCount: 1 }, { name: 'bg', maxCount: 1 }]);
