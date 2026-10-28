import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

const uploadDir = path.resolve(process.cwd(), process.env.UPLOAD_DIR || 'uploads');

// Ensure upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Storage configuration with UUID names
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    const safeName = `${uuidv4()}${ext}`;
    cb(null, safeName);
  },
});

// Allowed MIME types
const ALLOWED_MIME_TYPES = new Set([
  // Images
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
  // Videos (supported up to 35 MB for banners/sliders)
  'video/mp4',
  'video/webm',
  'video/quicktime',
  // Documents
  'application/pdf',
]);

const fileFilter = (req, file, cb) => {
  if (ALLOWED_MIME_TYPES.has(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        `Unsupported media type: '${file.mimetype}'. Allowed: JPG, PNG, WEBP, GIF, SVG, MP4, WEBM, PDF.`
      ),
      false
    );
  }
};

// Max 35 MB file size
const MAX_SIZE = (parseInt(process.env.MAX_FILE_SIZE_MB, 10) || 35) * 1024 * 1024;

export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: MAX_SIZE,
    files: 10,
  },
});
