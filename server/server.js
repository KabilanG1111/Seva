import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import kisanRouter from './routes/kisan.js';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ 
    origin: ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/api/kisan', kisanRouter);

// Health check root endpoint
app.get('/', (req, res) => {
    res.json({
        status: 'KISAN NADI BACKEND ONLINE',
        version: '1.0.0',
        port: PORT,
        endpoints: [
            'GET /api/kisan/weather',
            'GET /api/kisan/mandi',
            'GET /api/kisan/satellite',
            'GET /api/kisan/disease',
            'GET /api/kisan/score',
            'GET /api/kisan/health'
        ]
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: 'Endpoint not found',
        path: req.path,
        method: req.method
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('[KISAN] Server Error:', err);
    res.status(500).json({
        error: 'Internal server error',
        message: err.message
    });
});

// Start server with proper error handling
const server = app.listen(PORT, '0.0.0.0', () => {
    console.log('\n╔════════════════════════════════════════════════════════════╗');
    console.log(`║  [DHARITRI] KISAN NADI backend running on port ${PORT}              ║`);
    console.log('║  External APIs: OpenWeatherMap | NASA POWER | AGMARKNET | ICAR      ║');
    console.log('║  Cache TTL: Weather 10m | Mandi 30m | Satellite 1h                 ║');
    console.log('║  CORS enabled for: http://localhost:5173                            ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');
}).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`\n❌ Port ${PORT} is already in use.\nTrying alternative ports...`);
        // Try next port
        const altPort = PORT + 1;
        app.listen(altPort, '0.0.0.0', () => {
            console.log(`✅ Server running on alternative port ${altPort}\n`);
        });
    } else {
        console.error('Server startup error:', err);
    }
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n[DHARITRI] Shutting down gracefully...');
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\n[DHARITRI] Shutting down gracefully...');
    process.exit(0);
});
