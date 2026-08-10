import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const UPLOADS_DIR = path.join(__dirname, '..', '..', 'uploads');

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}${path.extname(file.originalname)}`);
  },
});

function pdfOnly(req, file, cb) {
  if (file.mimetype !== 'application/pdf') {
    return cb(new Error('Solo se permiten archivos PDF.'));
  }
  return cb(null, true);
}

export const uploadPdf = multer({
  storage,
  fileFilter: pdfOnly,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB, igual que el límite indicado en la UI
});
