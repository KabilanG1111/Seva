import React, { useState, useEffect } from 'react';

const API_BASE = 'http://localhost:5000/api/kisan';

export default function KisanDashboard({ onBack }) {
    const [scanPos, setScanPos] = useState(0);
    const [weatherData, setWeatherData] = useState(null);
    const [marketData, setMarketData] = useState(null);
    const [satelliteData, setSatelliteData] = useState(null);
    const [diseaseData, setDiseaseData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Simple purely visual scanning animation
    useEffect(() => {
        const scanInt = setInterval(() => {
            setScanPos(prev => (prev >= 100 ? 0 : prev + 1));
        }, 30);
        return () => clearInterval(scanInt);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const [weatherRes, marketRes, satelliteRes, diseaseRes] = await Promise.all([
                    fetch(`${API_BASE}/weather`),
                    fetch(`${API_BASE}/market`),
                    fetch(`${API_BASE}/satellite`),
                    fetch(`${API_BASE}/disease`)
                ]);

                const weatherJson = await weatherRes.json();
                const marketJson = await marketRes.json();
                const satelliteJson = await satelliteRes.json();
                const diseaseJson = await diseaseRes.json();

                if (weatherRes.ok) setWeatherData(weatherJson);
                if (marketRes.ok) setMarketData(marketJson);
                if (satelliteRes.ok) setSatelliteData(satelliteJson);
                if (diseaseRes.ok) setDiseaseData(diseaseJson);
            } catch (err) {
                console.error('[KISAN] Fetch error:', err);
                setError('Failed to load data. Please refresh.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 5000); // Refresh every 5 seconds
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="kisan-dashboard">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;700;900&family=Share+Tech+Mono&display=swap');

                .kisan-dashboard {
                    position: fixed;
                    inset: 0;
                    background-color: #010603; /* very dark green-black */
                    color: #fff;
                    font-family: 'Share Tech Mono', monospace;
                    display: flex;
                    flex-direction: column;
                    z-index: 9999;
                    animation: kisanFadeIn 0.6s ease-out forwards;
                    box-sizing: border-box;
                    padding: 32px 48px;
                    overflow-y: auto;
                    overflow-x: hidden;
                    user-select: none;
                }
                .kisan-dashboard::-webkit-scrollbar { width: 8px; }
                .kisan-dashboard::-webkit-scrollbar-track { background: #010603; }
                .kisan-dashboard::-webkit-scrollbar-thumb { background: #004411; border-radius: 8px; }
                .kisan-dashboard::-webkit-scrollbar-thumb:hover { background: #00aa44; }
                .kisan-dashboard * { box-sizing: border-box; }

                @keyframes kisanFadeIn {
                    from { opacity: 0; transform: scale(1.04); filter: brightness(0.5); }
                    to { opacity: 1; transform: scale(1); filter: brightness(1); }
                }

                .kisan-dashboard::before {
                    content: "";
                    position: absolute;
                    inset: 0;
                    background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.5) 2px, rgba(0,0,0,0.5) 4px);
                    opacity: 0.15;
                    pointer-events: none;
                    z-index: 999;
                }
                
                .kisan-dashboard::after {
                    content: "";
                    position: absolute;
                    inset: 0;
                    background: radial-gradient(circle at center, transparent 40%, rgba(0, 51, 0, 0.45) 100%);
                    pointer-events: none;
                    z-index: 998;
                }

                .kd-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding-bottom: 24px;
                    border-bottom: 1px solid #003300;
                    position: relative;
                    z-index: 10;
                    margin-bottom: 32px;
                }

                .orbitron { font-family: 'Orbitron', sans-serif; }
                .text-green { color: #22ff88; }
                .text-cyan { color: #00e0ff; }
                .text-darkgreen { color: #00aa44; }
                .text-gray { color: #777; }
                .text-warn { color: #ffaa00; }

                .kd-back-btn {
                    background: transparent;
                    border: 1px solid #004411;
                    color: #888;
                    font-family: inherit;
                    padding: 8px 24px;
                    font-size: 12px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    transition: all 0.2s;
                    letter-spacing: 2px;
                }
                .kd-back-btn:hover {
                    background: rgba(34, 255, 136, 0.1);
                    border-color: #22ff88;
                    color: #fff;
                }

                .kd-main-grid {
                    display: grid;
                    grid-template-columns: 60% 35%;
                    justify-content: space-between;
                    flex: 1;
                    position: relative;
                    z-index: 10;
                }

                /* Section Titles */
                .kd-section-title {
                    color: #00aa44;
                    font-size: 11px;
                    letter-spacing: 3px;
                    margin-bottom: 24px;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }
                .kd-section-title::before {
                    content: "";
                    width: 24px;
                    height: 1px;
                    background: #00aa44;
                }

                /* Panels */
                .kd-panel {
                    border: 1px solid #003300;
                    background: rgba(0, 15, 5, 0.6);
                    padding: 24px;
                    position: relative;
                    overflow: hidden;
                    box-shadow: inset 0 0 40px rgba(0,30,10,0.5);
                    transition: border-color 0.3s, box-shadow 0.3s;
                }
                .kd-panel:hover {
                    box-shadow: inset 0 0 50px rgba(34,255,136,0.1), 0 0 15px rgba(34,255,136,0.05);
                    border-color: #005522;
                }

                /* Scan Specifics */
                .kd-scan-area {
                    height: 320px;
                    background: repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(34,255,136,0.05) 40px, rgba(34,255,136,0.05) 41px),
                                repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(34,255,136,0.05) 40px, rgba(34,255,136,0.05) 41px);
                    position: relative;
                    border: 1px solid #002200;
                    margin-bottom: 12px;
                    overflow: hidden;
                }
                .kd-scan-line {
                    position: absolute;
                    top: 0; bottom: 0;
                    width: 2px;
                    background: #22ff88;
                    box-shadow: 0 0 15px #22ff88, 0 0 30px #22ff88;
                    z-index: 5;
                }
                .kd-scan-beam {
                    position: absolute;
                    top: 0; bottom: 0;
                    width: 200px;
                    background: linear-gradient(90deg, transparent, rgba(34,255,136,0.15));
                    z-index: 4;
                    transform: translateX(-100%);
                }
                .kd-zone-marker {
                    position: absolute;
                    border: 1px solid currentColor;
                    background: rgba(0,0,0,0.6);
                    padding: 6px 12px;
                    font-size: 10px;
                    letter-spacing: 2px;
                    z-index: 6;
                    backdrop-filter: blur(4px);
                }

                /* Metrics */
                .kd-metrics-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr 1fr;
                    gap: 24px;
                }
                .kd-metric-box {
                    border: 1px solid #003300;
                    padding: 24px;
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                    background: linear-gradient(180deg, rgba(0,20,5,0) 0%, rgba(0,30,10,0.4) 100%);
                }
                .kd-metric-val {
                    font-size: 48px;
                    font-weight: 700;
                    color: #22ff88;
                    text-shadow: 0 0 20px rgba(34,255,136,0.3);
                }

                /* Audio Wave */
                .kd-wave {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    height: 32px;
                }
                .kd-wave-bar {
                    width: 4px;
                    background: #22ff88;
                    border-radius: 2px;
                    animation: soundWave 1.2s infinite ease-in-out;
                }
                .kd-wave-bar:nth-child(2) { animation-delay: 0.2s; }
                .kd-wave-bar:nth-child(3) { animation-delay: 0.4s; }
                .kd-wave-bar:nth-child(4) { animation-delay: 0.1s; }
                .kd-wave-bar:nth-child(5) { animation-delay: 0.5s; }
                .kd-wave-bar:nth-child(6) { animation-delay: 0.3s; }
                @keyframes soundWave {
                    0%, 100% { height: 6px; }
                    50% { height: 28px; }
                }

                /* Utils */
                .dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; }
                .dot.green { background: #22ff88; box-shadow: 0 0 10px #22ff88; }
                .dot.blink { animation: blink 1.5s infinite; }
                @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
            `}</style>

            <div className="kd-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
                    <button className="kd-back-btn" onClick={onBack}>
                        <span>←</span> DHARITRI
                    </button>
                    <span className="text-darkgreen" style={{ letterSpacing: '4px', fontSize: '12px' }}>MISSION / KISAN NADI / v1.0</span>
                </div>
                <div className="orbitron" style={{ fontSize: '24px', fontWeight: 900, letterSpacing: '32px', marginLeft: '48px', color: '#fff' }}>
                    K I S A N
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
                    <div style={{ border: '1px solid #004411', padding: '6px 16px', fontSize: '11px', color: '#22ff88', letterSpacing: '2px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div className="dot green blink"></div> LIVE
                    </div>
                    <div className="text-gray" style={{ fontSize: '14px', display: 'flex', alignItems: 'center', gap: '10px', letterSpacing: '2px' }}>
                        5G <div className="dot green" style={{ boxShadow: 'none' }}></div>
                    </div>
                </div>
            </div>

            <div className="kd-main-grid">
                {/* LEFT COL */}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div className="kd-section-title">LIVE SCAN VISUALIZATION</div>

                    <div className="kd-panel" style={{ padding: '24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontSize: '11px', color: '#00aa44', letterSpacing: '2px' }}>
                            <span>5G DRONE SCAN — LIVE</span>
                            <span>ALTITUDE: 120M / SPEED: 14M/S</span>
                        </div>

                        <div className="kd-scan-area">
                            <div className="kd-scan-line" style={{ left: `${scanPos}%` }}>
                                <div className="kd-scan-beam"></div>
                            </div>

                            {/* Dummy topography map visualization vectors */}
                            <svg style={{ position: 'absolute', top: 0, left: 0 }} width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                                <path d="M 50 200 Q 200 80 400 220 T 800 150" stroke="rgba(34,255,136,0.3)" strokeWidth="2" fill="none" />
                                <path d="M -50 250 Q 250 150 450 300 T 900 250" stroke="rgba(0,224,255,0.15)" strokeWidth="1" fill="none" />
                                <path d="M 100 50 Q 300 200 500 100 T 900 80" stroke="rgba(34,255,136,0.1)" strokeWidth="1" fill="none" />
                            </svg>

                            <div className="kd-zone-marker text-green" style={{ top: '60px', left: '15%', borderColor: '#22ff88' }}>
                                ZONE A: HEALTHY MAIN CROP
                            </div>
                            <div className="kd-zone-marker text-warn" style={{ top: '200px', left: '55%', borderColor: '#ffaa00', color: '#ffaa00' }}>
                                ZONE D: RISK DETECTED
                            </div>
                        </div>
                    </div>

                    <div className="kd-section-title" style={{ marginTop: '48px' }}>CORE METRICS</div>
                    <div className="kd-metrics-grid">
                        <div className="kd-metric-box">
                            <span className="text-gray" style={{ fontSize: '11px', letterSpacing: '2px' }}>SOIL MOISTURE</span>
                            <span className="orbitron kd-metric-val">{satelliteData?.soilMoisture ?? 0}<span style={{ fontSize: '24px', color: '#00aa44' }}>%</span></span>
                            <div style={{ height: '3px', background: '#003300', marginTop: 'auto' }}>
                                <div style={{ width: `${satelliteData?.soilMoisture ?? 0}%`, height: '100%', background: '#22ff88' }}></div>
                            </div>
                        </div>
                        <div className="kd-metric-box">
                            <span className="text-gray" style={{ fontSize: '11px', letterSpacing: '2px' }}>DISEASE PROBABILITY</span>
                            <span className="orbitron kd-metric-val" style={{ color: '#ffaa00', textShadow: '0 0 15px rgba(255,170,0,0.4)' }}>{diseaseData?.diseaseProbability ?? 0}<span style={{ fontSize: '24px', color: '#aa6600' }}>%</span></span>
                            <div style={{ height: '3px', background: '#003300', marginTop: 'auto' }}>
                                <div style={{ width: `${diseaseData?.diseaseProbability ?? 0}%`, height: '100%', background: '#ffaa00' }}></div>
                            </div>
                        </div>
                        <div className="kd-metric-box">
                            <span className="text-gray" style={{ fontSize: '11px', letterSpacing: '2px' }}>FIELD TEMPERATURE</span>
                            <span className="orbitron kd-metric-val" style={{ color: '#00e0ff', textShadow: '0 0 15px rgba(0,224,255,0.4)' }}>{weatherData?.temperature ?? 0}<span style={{ fontSize: '24px', color: '#0088aa' }}>°C</span></span>
                            <div style={{ height: '3px', background: '#003300', marginTop: 'auto' }}>
                                <div style={{ width: `${Math.min(weatherData?.temperature ?? 0, 50) * 2}%`, height: '100%', background: '#00e0ff' }}></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT COL */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

                    {/* Alert Panel */}
                    <div>
                        <div className="kd-section-title" style={{ color: '#22ff88' }}>AI DETECTION ALERTS</div>
                        <div className="kd-panel" style={{ borderColor: '#22ff88', boxShadow: 'inset 0 0 30px rgba(34,255,136,0.1)' }}>
                            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', marginBottom: '24px' }}>
                                <div className="dot green blink" style={{ marginTop: '6px' }}></div>
                                <div>
                                    <div className="text-green uppercase" style={{ fontSize: '13px', letterSpacing: '1px', marginBottom: '8px', lineHeight: 1.5 }}>
                                        Pre-symptomatic detection:<br />Early-stage leaf blight detected.
                                    </div>
                                    <div className="text-gray" style={{ fontSize: '11px', letterSpacing: '2px' }}>ZONE D · CONFIDENCE: 89%</div>
                                </div>
                            </div>
                            <div style={{ background: 'rgba(34,255,136,0.05)', border: '1px solid #005522', padding: '16px', fontSize: '12px', color: '#fff', letterSpacing: '1px', lineHeight: 1.6 }}>
                                <span className="text-gray uppercase">Action Required: </span>
                                Apply Propiconazole fungicide immediately to halt cellular spread.
                                <div className="text-green orbitron uppercase" style={{ marginTop: '12px', fontSize: '16px', letterSpacing: '2px' }}>DOSAGE: 1.5 ML / LITER</div>
                            </div>
                        </div>
                    </div>

                    {/* AI Assistant */}
                    <div>
                        <div className="kd-section-title">NATIVE AI FIELD ASSISTANT</div>
                        <div className="kd-panel" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '32px 24px' }}>
                            <div>
                                <div className="text-darkgreen" style={{ fontSize: '11px', letterSpacing: '2px', marginBottom: '12px' }}>LISTENING IN LOCAL LANGUAGE</div>
                                <div className="orbitron" style={{ fontSize: '20px', letterSpacing: '2px' }}>मराठी (MARATHI)</div>
                            </div>
                            <div className="kd-wave">
                                <div className="kd-wave-bar"></div>
                                <div className="kd-wave-bar"></div>
                                <div className="kd-wave-bar"></div>
                                <div className="kd-wave-bar"></div>
                                <div className="kd-wave-bar"></div>
                                <div className="kd-wave-bar"></div>
                            </div>
                        </div>
                    </div>

                    {/* Market Intel */}
                    <div style={{ marginTop: 'auto' }}>
                        <div className="kd-section-title">MANDI INTEL</div>
                        <div className="kd-panel">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                                <div>
                                    <div className="text-gray uppercase" style={{ fontSize: '11px', letterSpacing: '2px', marginBottom: '8px' }}>CURRENT PRICE — SOYBEAN</div>
                                    <div className="orbitron text-green" style={{ fontSize: '40px' }}>₹{marketData?.bestPrice ?? '—'}<span style={{ fontSize: '18px', color: '#00aa44' }}>/Q</span></div>
                                </div>
                                <div style={{ padding: '6px 12px', border: '1px solid #005522', color: '#00aa44', fontSize: '11px', letterSpacing: '1px' }}>
                                    +{marketData?.weeklyChange ?? 0}% THIS WEEK
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'linear-gradient(90deg, #003300, transparent)', borderLeft: '4px solid #00e0ff', padding: '16px 20px' }}>
                                <div className="text-cyan orbitron" style={{ fontSize: '16px', letterSpacing: '2px' }}>{marketData?.recommendation || 'ANALYZING'}</div>
                                <div className="text-gray uppercase" style={{ fontSize: '10px', letterSpacing: '1px' }}>Peak: ₹{marketData?.projectedPeak ?? '—'}</div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
