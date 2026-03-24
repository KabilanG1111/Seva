import React, { useState, useEffect } from 'react';

export default function PraanDashboard({ onBack }) {
    const [donors, setDonors] = useState(2854);
    const [timer, setTimer] = useState(34 * 60);

    useEffect(() => {
        const dInterval = setInterval(() => {
            setDonors(prev => prev + (Math.floor(Math.random() * 5) - 2));
        }, 2000);

        const tInterval = setInterval(() => {
            setTimer(prev => (prev > 0 ? prev - 1 : 0));
        }, 1000);

        return () => {
            clearInterval(dInterval);
            clearInterval(tInterval);
        };
    }, []);

    const formatTime = (secs) => {
        const m = Math.floor(secs / 60).toString().padStart(2, '0');
        const s = (secs % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    return (
        <div className="praan-dashboard">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;700;900&family=Share+Tech+Mono&display=swap');

                .praan-dashboard {
                    position: fixed;
                    inset: 0;
                    background-color: #030000;
                    color: #fff;
                    font-family: 'Share Tech Mono', monospace;
                    display: flex;
                    flex-direction: column;
                    z-index: 9999;
                    animation: praanFadeIn 0.6s ease-out forwards;
                    box-sizing: border-box;
                    padding: 32px 48px;
                    overflow: hidden;
                    user-select: none;
                }
                .praan-dashboard * { box-sizing: border-box; }

                @keyframes praanFadeIn {
                    from { opacity: 0; transform: scale(1.04); }
                    to { opacity: 1; transform: scale(1); }
                }

                .praan-dashboard::before {
                    content: "";
                    position: absolute;
                    inset: 0;
                    background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.6) 2px, rgba(0,0,0,0.6) 4px);
                    opacity: 0.15;
                    pointer-events: none;
                    z-index: 999;
                }

                .praan-dashboard::after {
                    content: "";
                    position: absolute;
                    inset: 0;
                    background: radial-gradient(circle at center, transparent 30%, rgba(180, 0, 0, 0.25) 100%);
                    pointer-events: none;
                    z-index: 998;
                }

                /* Layout */
                .pd-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding-bottom: 24px;
                    border-bottom: 1px solid #1a0000;
                    position: relative;
                    z-index: 10;
                }
                
                .pd-main {
                    display: flex;
                    flex-direction: column;
                    flex: 1;
                    position: relative;
                    z-index: 10;
                }
                
                .pd-grid-3 {
                    display: grid;
                    grid-template-columns: 1fr 1fr 1fr;
                    border-bottom: 1px solid #1a0000;
                    flex: 1;
                }
                
                .pd-col {
                    padding: 32px;
                    border-right: 1px solid #1a0000;
                    display: flex;
                    flex-direction: column;
                }
                .pd-col:first-child { padding-left: 0; }
                .pd-col:last-child { border-right: none; padding-right: 0; }
                
                .pd-grid-2 {
                    display: grid;
                    grid-template-columns: 65% 35%;
                    border-bottom: 1px solid #1a0000;
                    flex: 1.2;
                }

                .pd-actions {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    border-bottom: 1px solid #1a0000;
                }
                
                .pd-footer {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-end;
                    padding-top: 24px;
                    position: relative;
                    z-index: 10;
                }

                /* Text & Elements */
                .orbitron { font-family: 'Orbitron', sans-serif; }
                .text-dark { color: #551111; }
                .text-gray { color: #888; }
                .text-red { color: #ff3333; }
                .text-orange { color: #ff8800; }
                .text-green { color: #00cc55; }
                
                .pd-section-title {
                    color: #441111;
                    font-size: 11px;
                    letter-spacing: 3px;
                    margin-bottom: 32px;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }
                .pd-section-title::before {
                    content: "";
                    width: 24px;
                    height: 1px;
                    background: #441111;
                }

                /* Header Specifics */
                .pd-back-btn {
                    background: transparent;
                    border: 1px solid #440000;
                    color: #aaa;
                    font-family: 'Share Tech Mono', monospace;
                    padding: 8px 20px;
                    font-size: 12px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    transition: all 0.2s;
                    letter-spacing: 2px;
                }
                .pd-back-btn:hover {
                    background: rgba(255,0,0,0.1);
                    border-color: #ff3333;
                    color: #fff;
                }
                
                /* Grid 1 Specifics */
                .pd-huge-num {
                    font-size: 72px;
                    font-weight: 700;
                    margin-bottom: 12px;
                    line-height: 1;
                    letter-spacing: 2px;
                }
                .pd-pulse-red {
                    color: #ff3333;
                    text-shadow: 0 0 20px rgba(255,51,51,0.6);
                    animation: pulseGlow 2s infinite;
                }
                @keyframes pulseGlow {
                    0%, 100% { text-shadow: 0 0 10px rgba(255,51,51,0.4); }
                    50% { text-shadow: 0 0 30px rgba(255,51,51,0.8); }
                }
                .pd-subtitle {
                    font-size: 11px;
                    color: #663333;
                    letter-spacing: 2px;
                    margin-bottom: 32px;
                }
                
                .pd-blood-boxes {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 12px;
                    margin-top: auto;
                }
                .pd-blood-box {
                    border: 1px solid #1a0000;
                    padding: 16px 0;
                    text-align: center;
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }
                .pd-blood-box .val { color: #ff3333; font-size: 20px; }
                .pd-blood-box .lbl { color: #551111; font-size: 10px; letter-spacing: 1px; }

                /* Bars */
                .pd-bars { margin-top: auto; }
                .pd-bar-row {
                    display: flex;
                    align-items: center;
                    gap: 24px;
                    margin-bottom: 16px;
                    font-size: 10px;
                    letter-spacing: 2px;
                }
                .pd-bar-lbl { width: 50px; color: #551111; }
                .pd-bar-track {
                    flex: 1;
                    height: 2px;
                    background: #1a0000;
                    position: relative;
                }
                .pd-bar-fill {
                    position: absolute;
                    left: 0; top: 0; bottom: 0;
                }
                .pd-bar-val { width: 16px; text-align: right; color: #551111; }

                /* Profile */
                .pd-profile-hdr {
                    display: flex;
                    align-items: center;
                    gap: 20px;
                }
                .pd-avatar {
                    width: 64px;
                    height: 64px;
                    border-radius: 50%;
                    border: 1px solid #440000;
                    background: radial-gradient(circle at top left, #330000, #110000);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #ff3333;
                    font-size: 20px;
                }
                .pd-prof-stats {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 16px;
                    margin-top: auto;
                }
                .pd-pbox {
                    border: 1px solid #1a0000;
                    padding: 24px;
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }
                .pd-pbox.green {
                    border-color: #002211;
                    background: rgba(0, 255, 85, 0.02);
                }

                /* Feed Rows */
                .pd-feed-row {
                    display: flex;
                    justify-content: space-between;
                    padding: 24px 0;
                    border-bottom: 1px solid #1a0000;
                }
                .pd-feed-row:last-child { border-bottom: none; padding-bottom: 0; }
                .pd-feed-row:first-child { padding-top: 0; }
                
                /* Action Buttons */
                .pd-action-btn {
                    display: flex;
                    align-items: center;
                    gap: 24px;
                    padding: 32px;
                    background: transparent;
                    border: none;
                    text-align: left;
                    color: #fff;
                    font-family: inherit;
                    cursor: pointer;
                    transition: all 0.2s;
                    border-right: 1px solid #1a0000;
                }
                .pd-action-btn:last-child { border-right: none; }
                .pd-action-btn:hover { background: rgba(255,0,0,0.05); }

                /* Timer & Corridor */
                .pd-corridor-box {
                    border: 1px solid #002211;
                    padding: 20px;
                    background: rgba(0, 255, 85, 0.02);
                    margin-top: 32px;
                    display: grid;
                    grid-template-columns: 1fr auto;
                    gap: 12px;
                }
                
                /* Bottom Icons */
                .pd-bottom-nav {
                    display: flex;
                    gap: 48px;
                    align-items: flex-end;
                }
                .pd-nav-ico {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 10px;
                    color: #441111;
                    font-size: 10px;
                    letter-spacing: 2px;
                    cursor: pointer;
                    transition: 0.2s;
                }
                .pd-nav-ico:hover { color: #ff3333; }
                .pd-nav-ico.active { color: #ff3333; }

                /* Utils */
                .dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; }
                .dot.red { background: #ff3333; box-shadow: 0 0 10px #ff3333; }
                .dot.orange { background: #ff8800; }
                .dot.green { background: #00cc55; }
                .dot.blink { animation: blink 1s infinite; }
                @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
            `}</style>

            <div className="pd-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
                    <button className="pd-back-btn" onClick={onBack}>
                        <span>←</span> DHARITRI
                    </button>
                    <span className="text-dark" style={{ letterSpacing: '4px', fontSize: '12px' }}>MISSION / PRAAN / v2.1</span>
                </div>
                <div className="orbitron" style={{ fontSize: '24px', fontWeight: 900, letterSpacing: '24px', marginLeft: '48px' }}>
                    P R A A N
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                    <div style={{ border: '1px solid #330000', padding: '6px 16px', fontSize: '11px', color: '#ff3333', letterSpacing: '2px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div className="dot red blink"></div> LIVE
                    </div>
                    <div className="text-gray" style={{ fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px', letterSpacing: '2px' }}>
                        5G <div className="dot green"></div>
                    </div>
                </div>
            </div>

            <div className="pd-main">
                <div className="pd-grid-3">
                    <div className="pd-col">
                        <div className="pd-section-title">LIVE DONORS NEARBY</div>
                        <div className="orbitron pd-huge-num">{donors.toLocaleString()}</div>
                        <div className="pd-subtitle">IN 10KM RADIUS · REAL-TIME</div>

                        <div className="pd-blood-boxes">
                            <div className="pd-blood-box"><span className="val">312</span><span className="lbl orbitron">O+</span></div>
                            <div className="pd-blood-box"><span className="val" style={{ color: '#551111' }}>88</span><span className="lbl orbitron">O-</span></div>
                            <div className="pd-blood-box"><span className="val">201</span><span className="lbl orbitron">A+</span></div>
                            <div className="pd-blood-box"><span className="val" style={{ color: '#551111' }}>56</span><span className="lbl orbitron">B-</span></div>
                        </div>
                    </div>

                    <div className="pd-col">
                        <div className="pd-section-title">ACTIVE REQUESTS</div>
                        <div className="orbitron pd-huge-num pd-pulse-red">12</div>
                        <div className="pd-subtitle">CRITICAL · AWAITING MATCH</div>

                        <div className="pd-bars">
                            <div className="pd-bar-row">
                                <div className="pd-bar-lbl">BLOOD</div>
                                <div className="pd-bar-track"><div className="pd-bar-fill" style={{ width: '75%', background: '#ff3333' }}></div></div>
                                <div className="pd-bar-val text-red">9</div>
                            </div>
                            <div className="pd-bar-row">
                                <div className="pd-bar-lbl">ORGAN</div>
                                <div className="pd-bar-track"><div className="pd-bar-fill" style={{ width: '25%', background: '#ff8800' }}></div></div>
                                <div className="pd-bar-val text-orange">3</div>
                            </div>
                            <div className="pd-bar-row">
                                <div className="pd-bar-lbl">PLASMA</div>
                                <div className="pd-bar-track"></div>
                                <div className="pd-bar-val">0</div>
                            </div>
                        </div>
                    </div>

                    <div className="pd-col">
                        <div className="pd-section-title">YOUR PROFILE</div>
                        <div className="pd-profile-hdr">
                            <div className="pd-avatar orbitron">AS</div>
                            <div>
                                <div className="orbitron" style={{ fontSize: '20px', letterSpacing: '2px', marginBottom: '8px' }}>ARJUN<br />SHARMA</div>
                                <div className="text-dark" style={{ fontSize: '11px', letterSpacing: '2px' }}>DONOR · ACTIVE</div>
                            </div>
                        </div>

                        <div className="pd-prof-stats">
                            <div className="pd-pbox">
                                <div className="orbitron text-red" style={{ fontSize: '28px', marginBottom: '4px' }}>O+</div>
                                <div className="text-dark" style={{ fontSize: '10px', lineHeight: 1.4, letterSpacing: '1px' }}>BLOOD<br />TYPE</div>
                            </div>
                            <div className="pd-pbox green">
                                <div className="orbitron text-green" style={{ fontSize: '28px', marginBottom: '4px' }}>03</div>
                                <div className="text-green" style={{ fontSize: '10px', lineHeight: 1.4, letterSpacing: '1px', opacity: 0.5 }}>MATCHED<br />THIS<br />WEEK</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pd-grid-2">
                    <div className="pd-col">
                        <div className="pd-section-title">LIVE FEED — NEARBY EMERGENCIES</div>

                        <div className="pd-feed-row">
                            <div style={{ display: 'flex', gap: '20px' }}>
                                <div className="dot red" style={{ marginTop: '6px' }}></div>
                                <div>
                                    <div className="text-dark" style={{ fontSize: '11px', letterSpacing: '2px', marginBottom: '8px' }}>BLOOD O- · URGENT</div>
                                    <div className="orbitron" style={{ fontSize: '16px', letterSpacing: '1px' }}>AIIMS Trauma Centre · 2.1 km</div>
                                </div>
                            </div>
                            <div style={{ textAlign: 'right', fontSize: '11px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <div className="text-dark" style={{ letterSpacing: '1px' }}>NOW</div>
                                <div className="text-red font-bold" style={{ letterSpacing: '1px' }}>3 DONORS MATCHING</div>
                            </div>
                        </div>

                        <div className="pd-feed-row">
                            <div style={{ display: 'flex', gap: '20px' }}>
                                <div className="dot red" style={{ marginTop: '6px' }}></div>
                                <div>
                                    <div className="text-dark" style={{ fontSize: '11px', letterSpacing: '2px', marginBottom: '8px' }}>ORGAN HEART · CRITICAL</div>
                                    <div className="orbitron" style={{ fontSize: '16px', letterSpacing: '1px' }}>Fortis Escorts · 5.8 km</div>
                                </div>
                            </div>
                            <div style={{ textAlign: 'right', fontSize: '11px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <div className="text-dark" style={{ letterSpacing: '1px' }}>NOW</div>
                                <div className="text-orange font-bold" style={{ letterSpacing: '1px' }}>VIABILITY 03:41</div>
                            </div>
                        </div>

                        <div className="pd-feed-row">
                            <div style={{ display: 'flex', gap: '20px' }}>
                                <div className="dot orange" style={{ marginTop: '6px' }}></div>
                                <div>
                                    <div className="text-dark" style={{ fontSize: '11px', letterSpacing: '2px', marginBottom: '8px' }}>BLOOD A+ · MODERATE</div>
                                    <div className="orbitron" style={{ fontSize: '16px', letterSpacing: '1px' }}>Apollo Hospital · 8.3 km</div>
                                </div>
                            </div>
                            <div style={{ textAlign: 'right', fontSize: '11px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <div className="text-dark" style={{ letterSpacing: '1px' }}>2 MIN AGO</div>
                                <div className="text-dark" style={{ letterSpacing: '1px' }}>MATCHED</div>
                            </div>
                        </div>
                    </div>

                    <div className="pd-col">
                        <div className="pd-section-title">HEART VIABILITY WINDOW</div>
                        <div className={`orbitron text-red ${timer < 600 ? 'blink' : ''}`} style={{ fontSize: '80px', fontWeight: 700, lineHeight: 1, textShadow: '0 0 20px rgba(255,51,51,0.4)', marginBottom: '16px' }}>
                            {formatTime(timer)}
                        </div>
                        <div className="text-dark" style={{ fontSize: '11px', letterSpacing: '3px', marginBottom: '32px' }}>TIME REMAINING</div>

                        <div>
                            <div style={{ height: '4px', background: '#1a0000', position: 'relative', marginBottom: '12px' }}>
                                <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${(((34 * 60) - timer) / (4 * 60 * 60)) * 100}%`, background: 'linear-gradient(90deg, #ff3333, #ff8800)' }}></div>
                                <div style={{ position: 'absolute', left: '14%', top: '-3px', bottom: '-3px', width: '2px', background: '#fff' }}></div>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#441111', letterSpacing: '1px' }}>
                                <span>0h</span>
                                <span>4h MAX</span>
                            </div>
                        </div>

                        <div className="pd-corridor-box">
                            <div>
                                <div className="text-dark" style={{ fontSize: '11px', letterSpacing: '2px', marginBottom: '12px' }}>GREEN CORRIDOR</div>
                                <div className="orbitron" style={{ fontSize: '14px', letterSpacing: '2px', color: '#666' }}>FORTIS → AIIMS</div>
                            </div>
                            <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'flex-end' }}>
                                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', color: '#441111', fontSize: '11px', letterSpacing: '1px' }}>
                                    ACTIVE <div className="dot green"></div>
                                </div>
                                <div className="text-orange" style={{ fontSize: '11px', letterSpacing: '2px' }}>ETA 18 MIN</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pd-actions">
                    <button className="pd-action-btn">
                        <div style={{ width: '48px', height: '48px', borderRadius: '50%', border: '1px solid #ff3333', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center', color: '#ff3333', fontSize: '24px' }}>+</div>
                        <div style={{ flex: 1 }}>
                            <div className="text-dark" style={{ fontSize: '11px', letterSpacing: '2px', marginBottom: '8px' }}>SUBMIT EMERGENCY</div>
                            <div className="orbitron text-red" style={{ fontSize: '18px', letterSpacing: '2px' }}>NEED BLOOD / ORGAN</div>
                        </div>
                        <div className="text-red" style={{ fontSize: '18px' }}>→</div>
                    </button>
                    <button className="pd-action-btn">
                        <div style={{ width: '48px', height: '48px', borderRadius: '50%', border: '1px solid #00cc55', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center', color: '#00cc55', fontSize: '20px' }}>◉</div>
                        <div style={{ flex: 1 }}>
                            <div className="text-dark" style={{ fontSize: '11px', letterSpacing: '2px', marginBottom: '8px' }}>REGISTER AVAILABILITY</div>
                            <div className="orbitron" style={{ fontSize: '18px', letterSpacing: '2px' }}>I AM AVAILABLE NOW</div>
                        </div>
                        <div className="text-green" style={{ fontSize: '18px' }}>→</div>
                    </button>
                </div>
            </div>

            <div className="pd-footer">
                <div>
                    <div className="orbitron" style={{ fontSize: '16px', letterSpacing: '3px', marginBottom: '16px' }}>ARJUN SHARMA</div>
                    <div style={{ display: 'flex', gap: '16px' }}>
                        <div style={{ border: '1px solid #330000', color: '#ff3333', padding: '6px 16px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '8px', letterSpacing: '1px' }}>
                            <div className="dot red"></div> DONOR ACTIVE
                        </div>
                        <div style={{ border: '1px solid #1a0000', color: '#663333', padding: '6px 16px', fontSize: '11px', letterSpacing: '1px' }}>
                            2 / FIELDS
                        </div>
                        <div style={{ border: '1px solid #004411', color: '#00cc55', padding: '6px 16px', fontSize: '11px', letterSpacing: '1px' }}>
                            5G CONNECTED
                        </div>
                    </div>
                </div>

                <div className="pd-bottom-nav">
                    <div className="pd-nav-ico">
                        <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: '1px solid currentColor' }}></div>
                        HOME
                    </div>
                    <div className="pd-nav-ico active">
                        <div style={{ width: '20px', height: '20px', background: 'currentColor', borderRadius: '0 50% 50% 50%', transform: 'rotate(45deg)' }}></div>
                        PRAAN
                    </div>
                    <div className="pd-nav-ico">
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', justifyContent: 'center', height: '20px' }}>
                            <div style={{ width: '20px', height: '2px', background: 'currentColor' }}></div>
                            <div style={{ width: '20px', height: '2px', background: 'currentColor' }}></div>
                            <div style={{ width: '20px', height: '2px', background: 'currentColor' }}></div>
                        </div>
                        KISAN
                    </div>
                    <div className="pd-nav-ico">
                        <div style={{ width: '18px', height: '18px', border: '1px solid currentColor' }}></div>
                        NYAY
                    </div>
                </div>
            </div>
        </div>
    );
}
