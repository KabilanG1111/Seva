import express from 'express';
import { fetchWeather } from '../services/weatherService.js';
import { fetchMandiPrices } from '../services/mandiService.js';
import { fetchNasaPowerData } from '../services/nasaService.js';
import { fetchDiseaseAdvisory } from '../services/diseaseService.js';
import cache from '../utils/cache.js';

const router = express.Router();

// GET /api/kisan/weather
router.get('/weather', async (req, res) => {
    try {
        const data = await fetchWeather();
        res.json(data);
    } catch (error) {
        console.error('[KISAN][weather] Error:', error);
        if (error.statusCode === 503) {
            res.status(503).json({
                error: error.error,
                source: error.source,
                retryAfter: error.retryAfter
            });
        } else {
            res.status(500).json({
                error: 'Internal server error',
                source: 'Weather Service'
            });
        }
    }
});

// GET /api/kisan/mandi and /api/kisan/market (alias)
router.get(['/mandi', '/market'], async (req, res) => {
    try {
        const data = await fetchMandiPrices();
        res.json(data);
    } catch (error) {
        console.error('[KISAN][mandi] Error:', error);
        if (error.statusCode === 503) {
            res.status(503).json({
                error: error.error,
                source: error.source,
                retryAfter: error.retryAfter
            });
        } else {
            res.status(500).json({
                error: 'Internal server error',
                source: 'Mandi Service'
            });
        }
    }
});

// GET /api/kisan/satellite
router.get('/satellite', async (req, res) => {
    try {
        const data = await fetchNasaPowerData();
        res.json(data);
    } catch (error) {
        console.error('[KISAN][satellite] Error:', error);
        if (error.statusCode === 503) {
            res.status(503).json({
                error: error.error,
                source: error.source,
                retryAfter: error.retryAfter
            });
        } else {
            res.status(500).json({
                error: 'Internal server error',
                source: 'NASA POWER Service'
            });
        }
    }
});

// GET /api/kisan/disease
router.get('/disease', async (req, res) => {
    try {
        // Fetch NASA data for algorithmic fallback
        const nasaData = await fetchNasaPowerData();
        const data = await fetchDiseaseAdvisory(nasaData);
        res.json(data);
    } catch (error) {
        console.error('[KISAN][disease] Error:', error);
        if (error.statusCode === 503) {
            res.status(503).json({
                error: error.error,
                source: error.source,
                retryAfter: error.retryAfter
            });
        } else {
            res.status(500).json({
                error: 'Internal server error',
                source: 'Disease Advisory Service'
            });
        }
    }
});

// GET /api/kisan/score - Aggregated field score
router.get('/score', async (req, res) => {
    try {
        const weatherData = await fetchWeather();
        const mandiData = await fetchMandiPrices();
        const nasaData = await fetchNasaPowerData();
        const diseaseData = await fetchDiseaseAdvisory(nasaData);

        const scoreData = {
            fieldScore: nasaData.cropHealthScore,
            soilMoisture: {
                value: nasaData.soilMoisture,
                unit: '%',
                trend: '+4',
                status: nasaData.soilMoisture > 60 ? 'OPTIMAL' : nasaData.soilMoisture > 40 ? 'ADEQUATE' : 'LOW'
            },
            diseaseProbability: {
                value: diseaseData.diseaseProbability,
                unit: '%',
                trend: '+9%',
                status: diseaseData.threatLevel
            },
            fieldTemperature: {
                value: Math.round(weatherData.temperature),
                unit: '°C',
                trend: '+2°C',
                status: weatherData.temperature > 35 ? 'HOT' : weatherData.temperature > 25 ? 'NORMAL' : 'COOL'
            },
            altitude: '120M',
            droneSpeed: '14M/S',
            scanZones: 2,
            recommendation: mandiData.recommendation,
            lastUpdated: new Date().toISOString()
        };

        res.json(scoreData);
    } catch (error) {
        console.error('[KISAN][score] Error:', error);
        res.status(500).json({
            error: 'Internal server error',
            source: 'Score Aggregation Service'
        });
    }
});

// GET /api/kisan/health - Health check
router.get('/health', async (req, res) => {
    try {
        const cacheStats = cache.getStats();
        
        // Quick connectivity checks (don't fail if they timeout)
        let openweatherStatus = 'UP';
        let nasaStatus = 'UP';
        let dataGovStatus = 'UP';

        try {
            await Promise.race([
                fetchWeather(),
                new Promise((_, reject) => setTimeout(() => reject('timeout'), 2000))
            ]);
        } catch (e) {
            openweatherStatus = 'CHECKING';
        }

        try {
            await Promise.race([
                fetchNasaPowerData(),
                new Promise((_, reject) => setTimeout(() => reject('timeout'), 2000))
            ]);
        } catch (e) {
            nasaStatus = 'CHECKING';
        }

        try {
            await Promise.race([
                fetchMandiPrices(),
                new Promise((_, reject) => setTimeout(() => reject('timeout'), 2000))
            ]);
        } catch (e) {
            dataGovStatus = 'CHECKING';
        }

        res.json({
            status: 'OK',
            services: {
                openweather: openweatherStatus,
                nasa_power: nasaStatus,
                data_gov: dataGovStatus
            },
            cacheStats: {
                keys: cacheStats.keys,
                hits: cacheStats.hits,
                misses: cacheStats.misses
            },
            uptime: process.uptime(),
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('[KISAN][health] Error:', error);
        res.status(500).json({
            status: 'ERROR',
            error: error.message
        });
    }
});

export default router;
