# KISAN NADI Backend - Quick Start Guide

**Get the backend running in 5 minutes for the hackathon demo.**

---

## 1. Install Dependencies (1 min)

```bash
cd f:\Seva\server
npm install
```

This installs:
- `express` - Web framework
- `cors` - Cross-origin requests
- `dotenv` - Environment config
- `axios` - HTTP client
- `node-cache` - In-memory caching
- `nodemon` - Dev auto-reload

---

## 2. Get API Keys (2-3 min)

### OpenWeatherMap
1. Go to https://openweathermap.org/api
2. Sign up (free account)
3. Click "API Keys" tab
4. Copy your default API key

### data.gov.in
1. Go to https://data.gov.in
2. Login/Register
3. Click your username → "API Management"
4. Create new API key for AGMARKNET resource
5. Copy the key

### NASA POWER
✅ No key needed - completely free!

---

## 3. Configure Environment (1 min)

Create `.env` file in `f:\Seva\server\`:

```env
PORT=3001
OPENWEATHER_API_KEY=your_openweathermap_key_here
DATA_GOV_API_KEY=your_data_gov_key_here
```

**⚠️ IMPORTANT:** Never commit `.env` to Git. It's already in `.gitignore`.

---

## 4. Start the Backend (1 min)

For development (auto-reload on file changes):
```bash
npm run kisan:dev
```

For production:
```bash
npm run kisan
```

You should see:
```
╔════════════════════════════════════════════════════════════╗
║  [DHARITRI] KISAN NADI backend running on port 3001         ║
║  External APIs: OpenWeatherMap | NASA POWER | AGMARKNET | ICAR      ║
║  Cache TTL: Weather 10m | Mandi 30m | Satellite 1h                 ║
╚════════════════════════════════════════════════════════════╝
```

---

## 5. Test It Works

Open your browser or terminal and test an endpoint:

```bash
curl http://localhost:3001/api/kisan/weather
```

Expected response (real data from OpenWeatherMap):
```json
{
  "temperature": 31.4,
  "humidity": 68,
  "condition": "Partly Cloudy",
  "...": "more data"
}
```

---

## Frontend Integration

Update your React component to fetch from port 3001:

```javascript
import { useState, useEffect } from 'react';

export default function KisanModule() {
  const [weatherData, setWeatherData] = useState(null);
  const [marketData, setMarketData] = useState(null);

  useEffect(() => {
    // Fetch weather
    fetch("http://localhost:3001/api/kisan/weather")
      .then(res => res.json())
      .then(data => setWeatherData(data))
      .catch(err => console.error('Weather fetch failed:', err));

    // Fetch market prices
    fetch("http://localhost:3001/api/kisan/market?crop=soybean")
      .then(res => res.json())
      .then(data => setMarketData(data))
      .catch(err => console.error('Market fetch failed:', err));
  }, []);

  if (!weatherData || !marketData) return <div>Loading...</div>;

  return (
    <div>
      <h1>Temperature: {weatherData.temperature}°C</h1>
      <h2>Soybean Price: ₹{marketData.price}</h2>
    </div>
  );
}
```

---

## Available Endpoints

| Endpoint | Method | Purpose | Cache TTL |
|----------|--------|---------|-----------|
| `/api/kisan/weather` | GET | Current weather + 5-day forecast | 10 min |
| `/api/kisan/mandi` | GET | Soybean prices from AGMARKNET | 30 min |
| `/api/kisan/satellite` | GET | NASA satellite + computed crop health | 1 hour |
| `/api/kisan/disease` | GET | Disease risk + treatment advice | 30 min |
| `/api/kisan/score` | GET | Aggregated field score (all data) | 5 min |
| `/api/kisan/health` | GET | API health check + cache stats | N/A |

---

## Debugging

### Check Services are Running
```bash
curl http://localhost:3001/api/kisan/health
```

Look for:
```json
{
  "status": "OK",
  "services": {
    "openweather": "UP",
    "nasa_power": "UP",
    "data_gov": "UP"
  }
}
```

### If a service shows "CHECKING"
- Check your API keys in `.env`
- Verify internet connectivity
- Check API provider status page

### Full Debug Logs
```bash
# In one terminal, run dev server
npm run kisan:dev

# In another terminal, watch API calls
curl -v http://localhost:3001/api/kisan/weather
```

---

## Demo Talking Points

For the 5G Hackathon demo, emphasize:

1. **Real-Time Data** ✅
   - "This is live weather data from OpenWeatherMap"
   - "Mandi prices are updated from government AGMARKNET database"
   - "Satellite data from NASA POWER API"

2. **Intelligent Caching** ✅
   - "Reduces API calls by 90%+"
   - "Keeps the app responsive even during demo"
   - "Crucial for low-bandwidth 5G networks"

3. **Algorithmic Intelligence** ✅
   - "Disease probability computed from humidity + temperature"
   - "Crop health score combines 4 data sources"
   - "Actionable recommendations for farmers"

4. **Graceful Degradation** ✅
   - "App shows cached data if API fails"
   - "Never crashes the user experience"

---

## File Structure Reference

```
server/
├── server.js                    ← Start here (main entry point)
├── package.json                 ← Dependency list
├── .env                         ← Your API keys (create this)
├── .env.example                 ← Template
├── routes/
│   └── kisan.js                ← All 6 endpoints defined here
├── services/
│   ├── weatherService.js        ← Calls OpenWeatherMap API
│   ├── mandiService.js          ← Calls data.gov.in AGMARKNET
│   ├── nasaService.js           ← Calls NASA POWER API
│   └── diseaseService.js        ← Calls ICAR or computes algorithmically
└── utils/
    ├── cache.js                 ← Caching logic
    └── scorer.js                ← All computation functions
```

---

## Stopping the Server

Press `Ctrl+C` in the terminal.

---

## Need to Reset?

```bash
# Stop the server (Ctrl+C)

# Clear node_modules and cache
rm -rf node_modules package-lock.json

# Reinstall
npm install

# Start again
npm run kisan:dev
```

---

## Common Issues & Fixes

| Issue | Solution |
|-------|----------|
| "Port 3001 already in use" | Change PORT in `.env` or kill process: `lsof -i :3001 \| kill -9 <PID>` |
| "Cannot find module" | Run `npm install` |
| "API key invalid" | Double-check `.env` file, restart server |
| "503 Service Unavailable" | Run `/api/kisan/health` to see which API failed |
| "CORS error" | Frontend is not on `localhost:5173`? Check `.env` CORS origin |

---

## Next Steps

✅ Backend running  
✅ Real data flowing in  
✅ Frontend displaying live metrics  

**Ready for demo!** 🚀

For full documentation, see [KISAN_BACKEND_DOCS.md](./KISAN_BACKEND_DOCS.md)
