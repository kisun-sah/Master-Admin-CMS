import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

const privateUploadDir = path.resolve(process.cwd(), 'private_uploads', 'resumes');

// Ensure private upload directory exists
if (!fs.existsSync(privateUploadDir)) {
  fs.mkdirSync(privateUploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, privateUploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    const safeName = `cv_${uuidv4()}${ext}`;
    cb(null, safeName);
  },
});

const ALLOWED_RESUME_MIMES = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/octet-stream', // Some browsers send octet-stream for docx
]);

const ALLOWED_RESUME_EXTENSIONS = new Set(['.pdf', '.doc', '.docx']);

const resumeFileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ALLOWED_RESUME_EXTENSIONS.has(ext) && (ALLOWED_RESUME_MIMES.has(file.mimetype) || file.mimetype.includes('pdf') || file.mimetype.includes('word'))) {
    cb(null, true);
  } else {
    cb(
      new Error(
        `Invalid file type: '${file.originalname}'. Only PDF, DOC, and DOCX documents are accepted.`
      ),
      false
    );
  }
};

const MAX_RESUME_SIZE = (parseInt(process.env.MAX_FILE_SIZE_MB, 10) || 35) * 1024 * 1024;

export const uploadResume = multer({
  storage,
  fileFilter: resumeFileFilter,
  limits: {
    fileSize: MAX_RESUME_SIZE,
    files: 1,
  },
});

export function cleanupFile(filePath) {
  try {
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (err) {
    console.warn(`[Cleanup Warning] Could not delete file: ${filePath}`, err.message);
  }
}

export { privateUploadDir };
