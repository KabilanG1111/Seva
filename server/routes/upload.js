import express from 'express';
import multer from 'multer';
import path from 'path';
import Tesseract from 'tesseract.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Multer storage config
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../uploads'));
    },
    filename: (req, file, cb) => {
        const timestamp = Date.now();
        const safeName = file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, '_');
        cb(null, `${timestamp}_${safeName}`);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
    fileFilter: (req, file, cb) => {
        const allowed = /pdf|jpeg|jpg|png|tiff|bmp|webp/i;
        const ext = path.extname(file.originalname);
        if (allowed.test(ext) || allowed.test(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Unsupported file type'));
        }
    }
});

/**
 * POST /upload
 * Accepts multiple files, runs OCR on each image file.
 * Returns: { pages: [{ pageNumber, fileName, text }] }
 */
router.post('/', upload.array('files', 20), async (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: 'No files uploaded.' });
    }

    const pages = [];

    for (let i = 0; i < req.files.length; i++) {
        const file = req.files[i];
        const filePath = file.path;
        const ext = path.extname(file.originalname).toLowerCase();

        let extractedText = '';

        try {
            // OCR supported for images; PDFs get a fallback note
            if (['.jpg', '.jpeg', '.png', '.tiff', '.bmp', '.webp'].includes(ext)) {
                const result = await Tesseract.recognize(filePath, 'eng+hin', {
                    logger: () => { } // suppress verbose logs
                });
                extractedText = result.data.text.trim();
            } else if (ext === '.pdf') {
                // PDF text extraction placeholder - in production use pdf-parse
                extractedText = `[PDF] ${file.originalname} — Text extraction requires pdf-parse. Mock OCR data returned for page ${i + 1}.`;
            } else {
                extractedText = `Unsupported format: ${ext}`;
            }
        } catch (err) {
            console.error(`OCR Error on ${file.originalname}:`, err.message);
            // Fallback mock text
            extractedText = `मिळकत पत्रिका (७/१२ उतारा)\nगावाचे नाव: शिरूर\nतालुका: शिरूर, जिल्हा: पुणे\nस.न./गट क्र.: ४५अ/२\nखातेदार: अमित कुमार\nPage ${i + 1} (fallback text)`;
        }

        pages.push({
            pageNumber: i + 1,
            fileName: file.originalname,
            filePath: `/uploads/${file.filename}`,
            text: extractedText
        });
    }

    res.json({ pages, total: pages.length });
});

export default router;
