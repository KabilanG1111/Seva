import React, { useState, useEffect } from 'react';

export default function NyayDashboard({ onBack }) {
    const [noiseOffset, setNoiseOffset] = useState(0);
    const [validity, setValidity] = useState(0);

    // Number count-up animation for validity
    useEffect(() => {
        let current = 0;
        const interval = setInterval(() => {
            if (current < 78) {
                current += 1;
                setValidity(current);
            } else {
                clearInterval(interval);
            }
        }, 20);
        return () => clearInterval(interval);
    }, []);

    // Subtle grain animation
    useEffect(() => {
        const int = setInterval(() => {
            setNoiseOffset(Math.random() * 100);
        }, 50);
        return () => clearInterval(int);
    }, []);

    return (
        <div className="nyay-dashboard">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;700;900&family=Share+Tech+Mono&display=swap');

                .nyay-dashboard {
                    position: fixed;
                    inset: 0;
                    background-color: #020202;
                    color: #fff;
                    font-family: 'Share Tech Mono', monospace;
                    display: flex;
                    flex-direction: column;
                    z-index: 9999;
                    animation: nyayFadeIn 0.8s ease-out forwards;
                    box-sizing: border-box;
                    padding: 32px 48px;
                    overflow-y: auto;
                    overflow-x: hidden;
                    user-select: none;
                }
                .nyay-dashboard::-webkit-scrollbar { width: 6px; }
                .nyay-dashboard::-webkit-scrollbar-track { background: #000; }
                .nyay-dashboard::-webkit-scrollbar-thumb { background: #333; border-radius: 4px; }
                .nyay-dashboard::-webkit-scrollbar-thumb:hover { background: #666; }
                .nyay-dashboard * { box-sizing: border-box; }

                @keyframes nyayFadeIn {
                    from { opacity: 0; transform: scale(1.02); filter: contrast(1.2); }
                    to { opacity: 1; transform: scale(1); filter: contrast(1); }
                }

                .nyay-dashboard::before {
                    content: "";
                    position: absolute;
                    inset: 0;
                    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
                    opacity: 0.04;
                    pointer-events: none;
                    z-index: 999;
                }
                
                .nyay-dashboard::after {
                    content: "";
                    position: absolute;
                    inset: 0;
                    background: radial-gradient(circle at center, rgba(255,255,255,0.04) 0%, transparent 70%);
                    pointer-events: none;
                    z-index: 998;
                }

                .nd-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding-bottom: 24px;
                    border-bottom: 1px solid #1a1a1a;
                    position: relative;
                    z-index: 10;
                    margin-bottom: 32px;
                }

                .orbitron { font-family: 'Orbitron', sans-serif; }
                .text-white { color: #ffffff; }
                .text-silver { color: #c0c0c0; }
                .text-gray { color: #666666; }

                .nd-back-btn {
                    background: transparent;
                    border: 1px solid #333;
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
                .nd-back-btn:hover {
                    background: rgba(255, 255, 255, 0.05);
                    border-color: #fff;
                    color: #fff;
                }

                /* Panels */
                .nd-panel {
                    border: 1px solid #1a1a1a;
                    background: linear-gradient(135deg, rgba(20, 20, 20, 0.7) 0%, rgba(5, 5, 5, 0.8) 100%);
                    padding: 32px;
                    position: relative;
                    overflow: hidden;
                    box-shadow: inset 0 0 30px rgba(255,255,255,0.02), 0 10px 40px rgba(0,0,0,0.8);
                    backdrop-filter: blur(8px);
                    transition: all 0.3s ease;
                }
                .nd-panel:hover {
                    border-color: #333;
                    box-shadow: inset 0 0 40px rgba(255,255,255,0.05), 0 15px 50px rgba(0,0,0,0.9);
                }

                .nd-section-title {
                    color: #c0c0c0;
                    font-size: 11px;
                    letter-spacing: 4px;
                    margin-bottom: 24px;
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    text-transform: uppercase;
                }
                .nd-section-title::before {
                    content: "";
                    width: 24px;
                    height: 1px;
                    background: #666;
                }

                /* Layout */
                .nd-main-grid {
                    display: grid;
                    grid-template-columns: 28% 47% 20%;
                    justify-content: space-between;
                    flex: 1;
                    position: relative;
                    z-index: 10;
                }

                /* Holographic Scan */
                .nd-doc-scan {
                    perspective: 1000px;
                    height: 380px;
                    background: rgba(0,0,0,0.8);
                    border: 1px solid #222;
                    position: relative;
                    overflow: hidden;
                    box-shadow: inset 0 0 60px rgba(0,0,0,0.9);
                }
                .nd-doc-paper {
                    transform: rotateX(15deg) scale(0.9);
                    transform-origin: bottom center;
                    background: rgba(255,255,255,0.02);
                    height: 100%; width: 100%;
                    border: 1px solid #444;
                    padding: 24px;
                    position: relative;
                }
                .nd-vertical-scan {
                    position: absolute;
                    left: 0; right: 0; top: 0;
                    height: 2px;
                    background: #fff;
                    box-shadow: 0 0 20px #fff, 0 0 40px #fff;
                    animation: scanVertical 3s linear infinite;
                    z-index: 10;
                }
                @keyframes scanVertical {
                    0% { top: -10%; opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { top: 110%; opacity: 0; }
                }
                .nd-hl-box {
                    border: 1px solid rgba(255,255,255,0.6);
                    background: rgba(255,255,255,0.1);
                    position: absolute;
                    animation: pulseGlow 2s infinite alternate;
                }

                /* Typing & Text */
                .typing-text {
                    display: inline-block;
                    overflow: hidden;
                    white-space: nowrap;
                    border-right: 2px solid #fff;
                    animation: typing 3s steps(40, end), blink-caret .75s step-end infinite;
                    width: 0;
                    animation-fill-mode: forwards;
                }
                @keyframes typing {
                    from { width: 0 }
                    to { width: 100% }
                }
                @keyframes blink-caret {
                    from, to { border-color: transparent }
                    50% { border-color: #fff; }
                }
                
                .nd-type-line {
                    opacity: 0;
                    animation: fadeInLine 0.5s forwards;
                }
                .nd-type-line:nth-child(1) { animation-delay: 0.5s; }
                .nd-type-line:nth-child(2) { animation-delay: 1.5s; }
                .nd-type-line:nth-child(3) { animation-delay: 2.5s; }
                @keyframes fadeInLine { to { opacity: 1; } }

                /* Mic Animation */
                .nd-mic {
                    width: 64px; height: 64px;
                    border-radius: 50%;
                    border: 1px solid #555;
                    display: flex; align-items: center; justify-content: center;
                    font-size: 24px;
                    position: relative;
                    cursor: pointer;
                    margin: 0 auto;
                    transition: 0.3s;
                }
                .nd-mic:hover {
                    background: #fff;
                    color: #000;
                    box-shadow: 0 0 30px rgba(255,255,255,0.5);
                }
                .nd-mic::before {
                    content: ''; position: absolute; inset: -10px;
                    border-radius: 50%; border: 1px solid rgba(255,255,255,0.3);
                    animation: pulseRing 2s infinite ease-out;
                }
                @keyframes pulseRing {
                    0% { transform: scale(0.8); opacity: 1; }
                    100% { transform: scale(1.5); opacity: 0; }
                }

                /* Utils */
                .nd-btn {
                    border: 1px solid #333;
                    background: rgba(0,0,0,0.5);
                    color: #c0c0c0;
                    padding: 18px 24px;
                    font-family: inherit;
                    cursor: pointer;
                    width: 100%;
                    text-align: left;
                    display: flex;
                    justify-content: space-between;
                    letter-spacing: 2px;
                    font-size: 11px;
                    transition: all 0.2s ease;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.4);
                }
                .nd-btn:hover {
                    border-color: #c0c0c0;
                    color: #fff;
                    transform: scale(1.02);
                    box-shadow: inset 0 0 15px rgba(255,255,255,0.1), 0 8px 25px rgba(0,0,0,0.6);
                }

                .dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; }
                .dot.white { background: #fff; box-shadow: 0 0 10px rgba(255,255,255,0.8); }
                .dot.blink { animation: blink 2s infinite; }
                @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
            `}</style>

            <div className="nd-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
                    <button className="nd-back-btn" onClick={onBack}>
                        <span>←</span> DHARITRI
                    </button>
                    <span className="text-gray" style={{ letterSpacing: '4px', fontSize: '12px' }}>MISSION / NYAYPATRA / AI DOC INTELLIGENCE</span>
                </div>
                <div className="orbitron" style={{ fontSize: '24px', fontWeight: 900, letterSpacing: '32px', marginLeft: '48px', color: '#fff' }}>
                    N Y A Y
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
                    <div style={{ border: '1px solid #333', padding: '6px 16px', fontSize: '11px', color: '#fff', letterSpacing: '2px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div className="dot white blink"></div> SECURE
                    </div>
                </div>
            </div>

            <div className="nd-main-grid">

                {/* COL 1: DOC SCAN + BUTTONS */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

                    <div>
                        <div className="nd-section-title">DOCUMENT SCAN — LIVE</div>
                        <div className="nd-doc-scan">
                            <div className="nd-vertical-scan"></div>
                            <div className="nd-doc-paper">
                                <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '16px', color: '#888' }}>
                                    MAHARASHTRA LAND REVENUE FORM 7/12
                                </div>
                                <div className="nd-hl-box" style={{ top: '60px', left: '20px', width: '200px', height: '30px' }}></div>
                                <div style={{ marginTop: '40px', lineHeight: 1.8, opacity: 0.4 }}>
                                    VILLAGE: SHIRUR<br />
                                    TALUKA: SHIRUR<br />
                                    DISTRICT: PUNE<br />
                                    SURVEY NO: 45A/2<br />
                                    AREA: 2.5 HECTARES<br />
                                    OWNER: AMIT KUMAR
                                </div>
                                <div className="nd-hl-box" style={{ top: '160px', left: '20px', width: '240px', height: '24px' }}></div>
                            </div>
                        </div>
                    </div>

                    <div style={{ marginTop: 'auto' }}>
                        <div className="nd-section-title">SYSTEM ACTIONS</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <button className="nd-btn">UPLOAD DOCUMENT <span className="text-gray">↑</span></button>
                            <button className="nd-btn">TRANSLATE BATCH <span className="text-gray">⇄</span></button>
                            <button className="nd-btn">EXPLAIN LOGIC <span className="text-gray">⚡</span></button>
                            <button className="nd-btn">DOWNLOAD REPORT <span className="text-gray">↓</span></button>
                        </div>
                    </div>

                </div>

                {/* COL 2: SPLIT TRANSLATION & AI EXPLANATION */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

                    <div style={{ flex: 1.2, display: 'flex', flexDirection: 'column' }}>
                        <div className="nd-section-title">TRANSLATION ENGINE (NMT)</div>
                        <div className="nd-panel" style={{ flex: 1, padding: '0', display: 'flex' }}>
                            {/* Original */}
                            <div style={{ flex: 1, borderRight: '1px solid #222', padding: '24px' }}>
                                <div className="text-gray orbitron" style={{ fontSize: '10px', letterSpacing: '2px', marginBottom: '16px' }}>ORIGINAL (MARATHI)</div>
                                <div style={{ fontSize: '12px', color: '#888', lineHeight: 1.8 }}>
                                    मिळकत पत्रिका (७/१२ उतारा)<br /><br />
                                    गावाचे नाव: शिरूर<br />
                                    तालुका: शिरूर, जिल्हा: पुणे<br />
                                    स.न./गट क्र.: ४५अ/२<br /><br />
                                    <span style={{ color: '#fff', background: 'rgba(255,255,255,0.1)', padding: '2px 4px' }}>खातेदार: अमित कुमार</span>
                                </div>
                            </div>
                            {/* Translated */}
                            <div style={{ flex: 1, padding: '24px' }}>
                                <div className="text-white orbitron" style={{ fontSize: '10px', letterSpacing: '2px', marginBottom: '16px' }}>TRANSLATED (ENGLISH)</div>
                                <div style={{ fontSize: '12px', color: '#c0c0c0', lineHeight: 1.8 }}>
                                    <div className="nd-type-line">Property Record (7/12 Extract)<br /><br /></div>
                                    <div className="nd-type-line">Village: Shirur<br /></div>
                                    <div className="nd-type-line">Taluka: Shirur, Dist: Pune<br />Survey/Gat No: 45A/2<br /><br /></div>
                                    <div className="nd-type-line text-white">Owner: Amit Kumar</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <div className="nd-section-title">AI INTERPRETATION</div>
                        <div className="nd-panel" style={{ flex: 1 }}>
                            <div className="orbitron text-white" style={{ fontSize: '18px', letterSpacing: '2px', marginBottom: '16px' }}>
                                AGRICULTURAL LAND DEED
                            </div>
                            <div className="text-gray" style={{ fontSize: '12px', lineHeight: 1.8, marginBottom: '16px' }}>
                                <span className="text-silver">INVOLVED PARTIES:</span> Amit Kumar (Owner), Govt of Maharashtra (Issuer)<br />
                                <span className="text-silver">NATURE OF HOLDING:</span> Class 1 (Occupant Class I - Transferable)
                            </div>
                            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid #333', padding: '16px' }}>
                                <div className="text-gray uppercase" style={{ fontSize: '9px', letterSpacing: '2px', marginBottom: '8px' }}>SUMMARY</div>
                                <div className="orbitron text-white" style={{ fontSize: '11px', letterSpacing: '1px', lineHeight: 1.6 }}>
                                    This document certifies ownership of 2.5 hectares of agricultural land. The title is clear with no encumbrances or outstanding loans attached to the primary Gat number.
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                {/* COL 3: CHAT, VOICE, VALIDITY */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

                    <div>
                        <div className="nd-section-title">DOCUMENT VALIDITY</div>
                        <div className="nd-panel" style={{ textAlign: 'center', padding: '24px 0' }}>
                            <div className="orbitron" style={{ fontSize: '64px', fontWeight: 700, color: '#fff', textShadow: '0 0 30px rgba(255,255,255,0.4)', lineHeight: 1 }}>
                                {validity}<span style={{ fontSize: '24px', color: '#555' }}>%</span>
                            </div>
                            <div style={{ width: '60%', margin: '24px auto 0', height: '2px', background: '#222', position: 'relative' }}>
                                <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${validity}%`, background: '#fff', boxShadow: '0 0 10px #fff' }}></div>
                            </div>
                        </div>
                    </div>

                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <div className="nd-section-title">AI CHAT ASSISTANT</div>
                        <div className="nd-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '24px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div style={{ alignSelf: 'flex-end', background: 'rgba(255,255,255,0.05)', padding: '12px 16px', fontSize: '11px', border: '1px solid #444', borderRadius: '4px', letterSpacing: '1px' }}>
                                    Does this document allow me to apply for crop loan?
                                </div>
                                <div style={{ alignSelf: 'flex-start', background: 'transparent', padding: '12px 0', fontSize: '11px', color: '#c0c0c0', lineHeight: 1.6, letterSpacing: '1px' }}>
                                    <div className="orbitron text-white" style={{ marginBottom: '8px' }}>NYAYPATRA AI:</div>
                                    <div className="nd-type-line">Yes. As a Class-I occupant with no existing encumbrances on Gat 45A/2, you are fully eligible to apply for institutional crop loans.</div>
                                </div>
                            </div>

                            <div style={{ borderTop: '1px solid #333', paddingTop: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <input type="text" placeholder="Type your query..." style={{ flex: 1, background: 'transparent', border: 'none', color: '#fff', fontFamily: 'inherit', fontSize: '11px', outline: 'none', letterSpacing: '1px' }} />
                                <div className="text-gray" style={{ fontSize: '16px', cursor: 'pointer' }}>↵</div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className="nd-section-title">VOICE ASSISTANT</div>
                        <div className="nd-panel" style={{ padding: '32px 0', display: 'flex', justifyContent: 'center' }}>
                            <div className="nd-mic">
                                🎤
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
}
