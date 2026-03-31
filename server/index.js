import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

import uploadRoute from './routes/upload.js';
import translateRoute from './routes/translate.js';
import aiRoute from './routes/ai.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5000;

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve uploaded files statically
app.use('/uploads', express.static(uploadsDir));

// Routes
app.use('/upload', uploadRoute);
app.use('/translate', translateRoute);
app.use('/ai', aiRoute);

// Health check
app.get('/', (req, res) => {
    res.json({ status: 'NYAYPATRA BACKEND ONLINE', version: '1.0.0', port: PORT });
});

app.listen(PORT, () => {
    console.log(`[NYAYPATRA SERVER] Running on http://localhost:${PORT}`);
});
