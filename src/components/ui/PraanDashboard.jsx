import React, { useState, useEffect } from 'react';
import DonorPulseAvailability from './DonorPulseAvailability';

function DoctorDashboard({ onBack }) {
    const [donors, setDonors] = useState([]);
    const [filterBg, setFilterBg] = useState('ALL');
    const [filterRadius, setFilterRadius] = useState(10);
    const [emergency, setEmergency] = useState(null);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [reqState, setReqState] = useState('idle');
    const [confirmedDonors, setConfirmedDonors] = useState([]);
    const [priorityAlerts, setPriorityAlerts] = useState({});

    const [formBg, setFormBg] = useState('O+');
    const [formUnits, setFormUnits] = useState(1);
    const [formUrgency, setFormUrgency] = useState('Critical');

    useEffect(() => {
        const generateDonor = () => ({
            id: Math.random().toString(36).substr(2, 6),
            name: `DONOR-${Math.floor(Math.random()*9000)+1000}`,
            bloodGroup: ['A+','A-','B+','B-','O+','O-','AB+','AB-'][Math.floor(Math.random()*8)],
            distance: (Math.random() * 9.5 + 0.5).toFixed(1),
            status: ['Available', 'Available', 'Available', 'Offline', 'Busy'][Math.floor(Math.random()*5)]
        });

        setDonors(Array.from({ length: 25 }, generateDonor));

        const interval = setInterval(() => {
            setDonors(prev => {
                let newDonors = [...prev];
                if(Math.random() > 0.3) newDonors.push(generateDonor());
                if(Math.random() > 0.5) newDonors.shift();
                return newDonors.map(d => ({
                    ...d,
                    distance: (Math.max(0.1, parseFloat(d.distance) + (Math.random()*0.4 - 0.2))).toFixed(1)
                })).sort((a,b) => parseFloat(a.distance) - parseFloat(b.distance));
            });
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        let timer;
        if (emergency) {
            timer = setInterval(() => {
                setElapsedTime(Math.floor((Date.now() - emergency.startTime) / 1000));
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [emergency]);

    const handleCreateEmergency = () => {
        setEmergency({
            id: `REQ-${Math.floor(Math.random()*90000)+10000}`,
            bloodGroup: formBg,
            units: formUnits,
            urgency: formUrgency,
            startTime: Date.now(),
            status: 'ACTIVE'
        });
        setElapsedTime(0);
        setReqState('idle');
        setConfirmedDonors([]);
        setPriorityAlerts({});
    };

    const handleSendRequest = () => {
        setReqState('pending');
        setEmergency(prev => ({ ...prev, status: 'MATCHING' }));
        setTimeout(() => {
            setEmergency(prev => ({ ...prev, status: 'CONFIRMED' }));
            const matched = filteredDonors.filter(d => d.bloodGroup === emergency.bloodGroup && d.status === 'Available');
            const toConfirm = matched.slice(0, emergency.units);
            setConfirmedDonors(toConfirm.map(d => ({...d, eta: Math.ceil(parseFloat(d.distance) * 3)})));
        }, 4500);
    };

    const togglePriorityAlert = (id) => {
        setPriorityAlerts(prev => ({ ...prev, [id]: true }));
        setTimeout(() => setPriorityAlerts(prev => ({ ...prev, [id]: false })), 2000);
    };

    const filteredDonors = donors.filter(d => {
        if (filterBg !== 'ALL' && d.bloodGroup !== filterBg) return false;
        if (parseFloat(d.distance) > filterRadius) return false;
        return true;
    }).sort((a,b) => parseFloat(a.distance) - parseFloat(b.distance));

    const formatTime = (secs) => {
        const m = Math.floor(secs / 60).toString().padStart(2, '0');
        const s = (secs % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    return (
        <div className="praan-dashboard doctor-dashboard">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;700;900&family=Share+Tech+Mono&display=swap');
                
                .doctor-dashboard {
                    padding: 0 !important;
                    display: flex !important;
                    flex-direction: column !important;
                    overflow: hidden !important;
                }
                .doc-hdr {
                    padding: 24px 48px;
                    border-bottom: 1px solid #1a0000;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    background: #030000;
                    z-index: 10;
                }
                .doc-main {
                    display: flex;
                    flex: 1;
                    overflow: hidden;
                    z-index: 10;
                }
                .doc-left {
                    width: 40%;
                    border-right: 1px solid #1a0000;
                    display: flex;
                    flex-direction: column;
                    background: rgba(10,0,0,0.4);
                }
                .doc-right {
                    width: 60%;
                    display: flex;
                    flex-direction: column;
                    background: rgba(5,0,0,0.6);
                    overflow-y: auto;
                }
                
                .doc-sec-hdr {
                    padding: 24px 32px;
                    border-bottom: 1px solid #1a0000;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .doc-sec-title {
                    color: #441111;
                    font-size: 12px;
                    letter-spacing: 4px;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }
                .doc-sec-title::before { content: ""; width: 24px; height: 1px; background: #ff3333; }
                
                .filters { display: flex; gap: 16px; padding: 16px 32px; border-bottom: 1px solid #1a0000; }
                .doc-select { background: transparent; border: 1px solid #330000; color: #ff3333; font-family: inherit; padding: 4px 8px; outline: none; }
                
                .donor-list { flex: 1; overflow-y: auto; padding: 0; margin: 0; list-style: none; }
                .donor-list::-webkit-scrollbar { width: 4px; }
                .donor-list::-webkit-scrollbar-thumb { background: #330000; }
                .donor-card {
                    padding: 16px 32px;
                    border-bottom: 1px solid #1a0000;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    transition: all 0.3s;
                }
                .donor-card:hover { background: rgba(255,0,0,0.05); }
                .donor-card.glow { background: rgba(255,51,51,0.15); box-shadow: inset 0 0 20px rgba(255,51,51,0.5); }
                
                .ctrl-panel { padding: 32px; }
                .ctrl-box { border: 1px solid #1a0000; margin-bottom: 24px; }
                .ctrl-box-hdr { padding: 16px 24px; border-bottom: 1px solid #1a0000; background: rgba(20,0,0,0.5); font-size: 11px; letter-spacing: 3px; color: #663333; }
                .ctrl-box-body { padding: 24px; }
                
                .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 24px; }
                .form-group { display: flex; flex-direction: column; gap: 8px; }
                .form-label { color: #663333; font-size: 10px; letter-spacing: 2px; }
                .form-input { background: rgba(20,0,0,0.3); border: 1px solid #330000; color: #fff; padding: 12px; font-family: inherit; width: 100%; outline: none; transition: 0.3s; }
                .form-input:focus { border-color: #ff3333; box-shadow: 0 0 10px rgba(255,51,51,0.2); }
                
                .btn-red { background: rgba(255,51,51,0.1); border: 1px solid #ff3333; color: #ff3333; padding: 16px; width: 100%; cursor: pointer; font-family: inherit; font-size: 14px; letter-spacing: 4px; transition: 0.3s; text-transform: uppercase; }
                .btn-red:hover:not(:disabled) { background: #ff3333; color: #000; box-shadow: 0 0 20px rgba(255,51,51,0.6); }
                .btn-red:disabled { opacity: 0.5; cursor: not-allowed; border-color: #440000; color: #880000; background: transparent; }
                
                .btn-outline { background: transparent; border: 1px solid #440000; color: #aaa; padding: 8px 16px; cursor: pointer; font-family: inherit; font-size: 10px; letter-spacing: 2px; transition: 0.3s; }
                .btn-outline:hover { border-color: #ff3333; color: #ff3333; }
                
                .req-status-ACTIVE { color: #ff8800; border-color: #ff8800; }
                .req-status-MATCHING { color: #0088ff; border-color: #0088ff; animation: pulseGlow 1.5s infinite; }
                .req-status-CONFIRMED { color: #00cc55; border-color: #00cc55; }
                
                .conf-card { background: rgba(0,255,85,0.05); border: 1px solid #004411; padding: 16px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
            `}</style>

            <div className="doc-hdr">
                <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
                    <button className="pd-back-btn" onClick={onBack}>
                        <span>←</span> ROLE SELECT
                    </button>
                    <span className="text-dark" style={{ letterSpacing: '4px', fontSize: '12px' }}>PRAAN / CONTROL CENTER</span>
                </div>
                <div className="orbitron" style={{ fontSize: '24px', fontWeight: 900, letterSpacing: '24px', marginLeft: '48px', color: '#ff3333' }}>
                    D O C T O R
                </div>
                <div style={{ border: '1px solid #330000', padding: '6px 16px', fontSize: '11px', color: '#ff3333', letterSpacing: '2px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div className="dot red blink"></div> EMERGENCY PROT
                </div>
            </div>

            <div className="doc-main">
                {/* LEFT PANEL */}
                <div className="doc-left">
                    <div className="doc-sec-hdr">
                        <div className="doc-sec-title">MATCHING DONORS — LIVE</div>
                        <div style={{ fontSize: '10px', color: '#663333', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div className="dot green blink" style={{width: 6, height: 6}}></div> TRACKING ACTIVE
                        </div>
                    </div>
                    <div className="filters">
                        <select className="doc-select" value={filterBg} onChange={e => setFilterBg(e.target.value)}>
                            <option value="ALL">BLOOD: ALL</option>
                            <option value="A+">A+</option><option value="A-">A-</option>
                            <option value="B+">B+</option><option value="B-">B-</option>
                            <option value="O+">O+</option><option value="O-">O-</option>
                            <option value="AB+">AB+</option><option value="AB-">AB-</option>
                        </select>
                        <select className="doc-select" value={filterRadius} onChange={e => setFilterRadius(Number(e.target.value))}>
                            <option value={5}>RAD: 5KM</option>
                            <option value={10}>RAD: 10KM</option>
                            <option value={20}>RAD: 20KM</option>
                        </select>
                    </div>
                    <ul className="donor-list">
                        {filteredDonors.map(d => (
                            <li key={d.id} className="donor-card">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                    <div className={`dot ${d.status === 'Available' ? 'green blink' : d.status === 'Busy' ? 'red' : 'orange'}`}></div>
                                    <div>
                                        <div className="orbitron" style={{ fontSize: '14px', letterSpacing: '1px' }}>{d.name}</div>
                                        <div className="text-dark" style={{ fontSize: '10px', letterSpacing: '2px', marginTop: '4px' }}>{d.status.toUpperCase()}</div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
                                    <div className="orbitron text-red" style={{ fontSize: '18px' }}>{d.bloodGroup}</div>
                                    <div className="orbitron" style={{ fontSize: '14px', color: '#aaa', width: '60px', textAlign: 'right' }}>{d.distance}km</div>
                                </div>
                            </li>
                        ))}
                        {filteredDonors.length === 0 && (
                            <div style={{ padding: '32px', textAlign: 'center', color: '#663333', letterSpacing: '2px' }}>NO DONORS MATCHING CRITERIA</div>
                        )}
                    </ul>
                </div>

                {/* RIGHT PANEL */}
                <div className="doc-right">
                    <div className="ctrl-panel">
                        {/* SECTION 1: CREATE */}
                        <div className="ctrl-box">
                            <div className="ctrl-box-hdr">01 // CREATE REQUEST</div>
                            <div className="ctrl-box-body">
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label className="form-label">BLOOD GROUP</label>
                                        <select className="form-input" value={formBg} onChange={e=>setFormBg(e.target.value)}>
                                            <option>A+</option><option>A-</option><option>B+</option><option>B-</option>
                                            <option>O+</option><option>O-</option><option>AB+</option><option>AB-</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">UNITS REQUIRED</label>
                                        <input type="number" min="1" max="10" className="form-input" value={formUnits} onChange={e=>setFormUnits(Number(e.target.value))} />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">URGENCY LEVEL</label>
                                        <select className="form-input" value={formUrgency} onChange={e=>setFormUrgency(e.target.value)}>
                                            <option>Normal</option><option>Critical</option><option>Life-Threatening</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">LOCATION</label>
                                        <input type="text" className="form-input" value="AUTO GPS (HOSPITAL)" disabled style={{color: '#666'}} />
                                    </div>
                                </div>
                                <button className="btn-red" onClick={handleCreateEmergency}>
                                    🚨 CREATE EMERGENCY
                                </button>
                            </div>
                        </div>

                        {/* SECTION 2 & 3: TRACKING & ACTIONS */}
                        {emergency && (
                            <>
                                <div className="ctrl-box">
                                    <div className="ctrl-box-hdr" style={{display: 'flex', justifyContent: 'space-between'}}>
                                        <span>02 // ACTIVE REQUEST TRACKING</span>
                                        <span className={`req-status-${emergency.status}`} style={{border: '1px solid', padding: '2px 8px', fontSize: '9px'}}>{emergency.status}</span>
                                    </div>
                                    <div className="ctrl-box-body" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <div className="text-dark" style={{ fontSize: '10px', letterSpacing: '2px' }}>REQUEST ID</div>
                                            <div className="orbitron" style={{ fontSize: '20px', letterSpacing: '2px', color: '#fff' }}>{emergency.id}</div>
                                            <div className="text-red" style={{ fontSize: '12px', letterSpacing: '2px', marginTop: '8px' }}>{emergency.bloodGroup} · {emergency.units} UNITS</div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div className="text-dark" style={{ fontSize: '10px', letterSpacing: '2px' }}>TIME ELAPSED</div>
                                            <div className="orbitron" style={{ fontSize: '32px', color: '#ff3333', textShadow: '0 0 10px rgba(255,51,51,0.5)' }}>{formatTime(elapsedTime)}</div>
                                        </div>
                                    </div>
                                </div>

                                {emergency.status !== 'CONFIRMED' && (
                                    <div className="ctrl-box">
                                        <div className="ctrl-box-hdr">03 // REQUEST ACTION SYSTEM</div>
                                        <div className="ctrl-box-body">
                                            <div style={{ marginBottom: '24px', fontSize: '12px', color: '#aaa', letterSpacing: '1px' }}>
                                                {filteredDonors.filter(d => d.bloodGroup === emergency.bloodGroup && d.status === 'Available').length} MATCHING DONORS FOUND IN RADIUS.
                                            </div>
                                            <div style={{ display: 'flex', gap: '16px' }}>
                                                <button 
                                                    className="btn-red" 
                                                    style={{ flex: 2 }} 
                                                    onClick={handleSendRequest}
                                                    disabled={reqState !== 'idle'}
                                                >
                                                    {reqState === 'idle' ? 'SEND REQUEST TO MATCHES' : 'TRANSMITTING...'}
                                                </button>
                                                <button 
                                                    className="btn-outline" 
                                                    style={{ flex: 1, borderColor: '#ff8800', color: '#ff8800' }}
                                                    onClick={() => togglePriorityAlert('all')}
                                                >
                                                    PRIORITY ALERT
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* SECTION 4: CONFIRMED */}
                                {emergency.status === 'CONFIRMED' && (
                                    <div className="ctrl-box" style={{ borderColor: '#004411' }}>
                                        <div className="ctrl-box-hdr" style={{ background: 'rgba(0,255,85,0.05)', color: '#00cc55' }}>
                                            04 // CONFIRMED RESPONSES ({confirmedDonors.length}/{emergency.units})
                                        </div>
                                        <div className="ctrl-box-body">
                                            {confirmedDonors.length === 0 ? (
                                                <div className="text-dark">AWAITING RESPONSES...</div>
                                            ) : (
                                                confirmedDonors.map(d => (
                                                    <div key={d.id} className="conf-card">
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                                            <div className="dot green blink"></div>
                                                            <div>
                                                                <div className="orbitron" style={{ fontSize: '16px', color: '#fff', letterSpacing: '1px' }}>{d.name}</div>
                                                                <div className="text-green" style={{ fontSize: '10px', letterSpacing: '2px', marginTop: '4px' }}>CONFIRMED EN ROUTE</div>
                                                            </div>
                                                        </div>
                                                        <div style={{ textAlign: 'right' }}>
                                                            <div className="orbitron" style={{ fontSize: '18px', color: '#00cc55' }}>ETA {d.eta} MIN</div>
                                                            <div className="text-dark" style={{ fontSize: '10px', letterSpacing: '2px', marginTop: '4px' }}>{d.distance}km AWAY</div>
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>

        </div>
    );
}

function DonorDashboard({ onBack }) {
    const initialEmergencies = [
        { id: 1, type: 'BLOOD O- · URGENT', title: 'AIIMS Trauma Centre', distance: '2.1 km', time: 'NOW', statusMsg: '3 DONORS MATCHING', urgency: 'red' },
        { id: 2, type: 'ORGAN HEART · CRITICAL', title: 'Fortis Escorts', distance: '5.8 km', time: 'NOW', statusMsg: 'VIABILITY 03:41', urgency: 'red' },
        { id: 3, type: 'BLOOD A+ · MODERATE', title: 'Apollo Hospital', distance: '8.3 km', time: '2 MIN AGO', statusMsg: 'MATCHED', urgency: 'orange' }
    ];
    const [emergencies, setEmergencies] = useState(initialEmergencies);
    const [selectedHospitalId, setSelectedHospitalId] = useState(null);
    const [responseStatus, setResponseStatus] = useState('idle');

    const [donors, setDonors] = useState(2854);
    const [timer, setTimer] = useState(34 * 60);
    const [activePulseDonors, setActivePulseDonors] = useState({});

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

    const handleDonorPulseStatusChange = (donorData) => {
        setActivePulseDonors(prev => ({
            ...prev,
            [donorData.id]: donorData
        }));
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
                    overflow-y: auto;
                    overflow-x: hidden;
                    user-select: none;
                }
                .praan-dashboard::-webkit-scrollbar { width: 8px; }
                .praan-dashboard::-webkit-scrollbar-track { background: #030000; }
                .praan-dashboard::-webkit-scrollbar-thumb { background: #330000; border-radius: 8px; }
                .praan-dashboard::-webkit-scrollbar-thumb:hover { background: #ff3333; }
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

                /* Feed Rows & Interactive Cards */
                .hospital-card {
                    padding: 24px;
                    border: 1px solid #1a0000;
                    margin-bottom: 16px;
                    transition: all 0.3s ease;
                    cursor: pointer;
                    background: transparent;
                }
                .hospital-card.selected {
                    box-shadow: 0 0 15px rgba(255,51,51,0.4), inset 0 0 10px rgba(255,51,51,0.1);
                    border: 1px solid #ff3333;
                    transform: scale(1.02);
                }
                .hospital-card.dimmed {
                    opacity: 0.4;
                    transform: scale(0.98);
                }
                .hospital-card.confirmed-state {
                    border: 1px solid #00ff88;
                    box-shadow: 0 0 15px rgba(0,255,136,0.3), inset 0 0 10px rgba(0,255,136,0.05);
                }

                .pd-feed-row {
                    display: flex;
                    justify-content: space-between;
                }
                
                /* Action Panel */
                .expanded-action-panel {
                    margin-top: 16px;
                    padding-top: 16px;
                    border-top: 1px dashed rgba(255,51,51,0.3);
                    animation: slideDown 0.3s ease-out forwards;
                    overflow: hidden;
                }
                .expanded-action-panel.confirmed-border {
                    border-top: 1px dashed rgba(0,255,136,0.3);
                }
                @keyframes slideDown {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .action-cta-btn {
                    width: 100%;
                    padding: 16px;
                    margin-top: 16px;
                    background: #0a0000;
                    border: 1px solid #330000;
                    color: #fff;
                    font-family: inherit;
                    font-size: 14px;
                    letter-spacing: 3px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }
                .action-cta-btn:hover:not(:disabled) {
                    background: #002211;
                    border-color: #00ff88;
                    color: #00ff88;
                    box-shadow: 0 0 15px rgba(0,255,136,0.4);
                    transform: scale(1.05);
                }
                .action-cta-btn.responding {
                    background: rgba(255,136,0,0.1);
                    border-color: #ff8800;
                    color: #ff8800;
                    cursor: wait;
                    animation: pulseGlowMsg 1s infinite alternate;
                }
                .action-cta-btn.confirmed {
                    background: rgba(0,255,136,0.1);
                    border-color: #00ff88;
                    color: #00ff88;
                    cursor: default;
                }

                @keyframes pulseGlowMsg {
                    from { box-shadow: 0 0 5px rgba(255,136,0,0.2); }
                    to { box-shadow: 0 0 15px rgba(255,136,0,0.6); }
                }

                .connection-line-container {
                    width: 100%;
                    height: 2px;
                    background: rgba(0,255,136,0.1);
                    margin: 16px 0;
                    position: relative;
                    overflow: hidden;
                }
                .connection-line-glow {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 30%;
                    height: 100%;
                    background: #00ff88;
                    box-shadow: 0 0 10px #00ff88;
                    animation: slideRight 1.5s infinite linear;
                }
                @keyframes slideRight {
                    from { transform: translateX(-100%); }
                    to { transform: translateX(400%); }
                }
                
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
                @keyframes blinkDot { 0%, 49%, 100% { opacity: 1; } 50%, 99% { opacity: 0.3; } }

                /* Blood Drop Visual Timer */
                .blood-drop-container {
                    position: relative;
                    width: 200px;
                    height: 250px;
                    margin: 0 auto 32px auto;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .blood-drop-glow {
                    position: absolute;
                    inset: 0px;
                    border-radius: 50%;
                    background: radial-gradient(circle, rgba(255,51,51,0.15) 0%, transparent 60%);
                    z-index: 1;
                    pointer-events: none;
                }
                .blood-drop-svg {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    z-index: 2;
                    overflow: visible;
                }
                .blood-drop-text {
                    position: absolute;
                    z-index: 3;
                    text-align: center;
                    top: 60%;
                    transform: translateY(-50%);
                    pointer-events: none;
                }
                .blood-drop-text .lbl {
                    font-size: 10px;
                    color: rgba(255, 255, 255, 0.6);
                    letter-spacing: 2px;
                    margin-bottom: 4px;
                }
                .blood-drop-text .val {
                    font-size: 32px;
                    font-weight: 700;
                    color: #fff;
                    text-shadow: 0 0 10px rgba(0,0,0,0.8);
                }

                .wave-back { animation: waveAnim 3s linear infinite; }
                .wave-front { animation: waveAnim 4s linear infinite reverse; }
                @keyframes waveAnim {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-100px); }
                }

                .falling-drop { animation: dropletFall 1s ease-in infinite; }
                @keyframes dropletFall {
                    0% { transform: translateY(0); opacity: 1; }
                    70% { opacity: 1; }
                    95% { transform: translateY(140px); opacity: 0; }
                    100% { transform: translateY(140px); opacity: 0; }
                }

                .liquid-wave-group { transition: transform 1s linear; }

                .normal-pulse { animation: bloodPulse 2s ease-in-out infinite; }
                .critical-pulse { 
                    animation: bloodPulseCritical 0.8s ease-in-out infinite; 
                    background: radial-gradient(circle, rgba(255,0,0,0.3) 0%, transparent 70%); 
                }
                
                @keyframes bloodPulse {
                    0%, 100% { transform: scale(0.9); opacity: 0.5; }
                    50% { transform: scale(1.1); opacity: 1; }
                }
                @keyframes bloodPulseCritical {
                    0%, 100% { transform: scale(1); opacity: 0.8; box-shadow: 0 0 20px rgba(255,0,0,0.2); }
                    50% { transform: scale(1.15); opacity: 1; box-shadow: 0 0 40px rgba(255,0,0,0.5); }
                }

                .critical-shake { animation: shakeCritical 0.5s cubic-bezier(.36,.07,.19,.97) infinite; }
                @keyframes shakeCritical {
                    0%, 100% { transform: translate3d(0, 0, 0); }
                    10%, 90% { transform: translate3d(-1px, 0, 0); }
                    20%, 80% { transform: translate3d(2px, 0, 0); }
                    30%, 50%, 70% { transform: translate3d(-2px, 0, 0); }
                    40%, 60% { transform: translate3d(2px, 0, 0); }
                }
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

                        {emergencies.map((emerg) => {
                            const isSelected = selectedHospitalId === emerg.id;
                            const isDimmed = selectedHospitalId !== null && !isSelected;
                            
                            return (
                                <div 
                                    key={emerg.id} 
                                    className={`hospital-card ${isSelected ? 'selected' : ''} ${isDimmed ? 'dimmed' : ''} ${isSelected && responseStatus === 'confirmed' ? 'confirmed-state' : ''}`}
                                    onClick={() => {
                                        if (!isSelected) {
                                            setSelectedHospitalId(emerg.id);
                                            setResponseStatus('idle');
                                        }
                                    }}
                                >
                                    <div className="pd-feed-row">
                                        <div style={{ display: 'flex', gap: '20px' }}>
                                            <div className={`dot ${isSelected && responseStatus === 'confirmed' ? 'green blink' : emerg.urgency}`} style={{ marginTop: '6px' }}></div>
                                            <div>
                                                <div className="text-dark" style={{ fontSize: '11px', letterSpacing: '2px', marginBottom: '8px', color: isSelected && responseStatus === 'confirmed' ? '#00cc55' : '' }}>
                                                    {emerg.type}
                                                </div>
                                                <div className="orbitron" style={{ fontSize: '16px', letterSpacing: '1px', color: isSelected && responseStatus === 'confirmed' ? '#fff' : '' }}>
                                                    {emerg.title} · {emerg.distance}
                                                </div>
                                            </div>
                                        </div>
                                        <div style={{ textAlign: 'right', fontSize: '11px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            <div className="text-dark" style={{ letterSpacing: '1px' }}>{emerg.time}</div>
                                            <div className={`font-bold ${isSelected && responseStatus === 'confirmed' ? 'text-green' : (emerg.urgency === 'red' ? 'text-red' : 'text-orange')}`} style={{ letterSpacing: '1px' }}>
                                                {emerg.statusMsg}
                                            </div>
                                        </div>
                                    </div>

                                    {isSelected && (
                                        <div className={`expanded-action-panel ${responseStatus === 'confirmed' ? 'confirmed-border' : ''}`}>
                                            {responseStatus === 'confirmed' ? (
                                                <div style={{ padding: '8px 0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <div className="text-green" style={{ fontSize: '12px', letterSpacing: '2px' }}>SUCCESS: ASSIGNED TO EMERGENCY</div>
                                                        <div className="orbitron text-green" style={{ fontSize: '16px' }}>ETA: 8 MIN</div>
                                                    </div>
                                                    
                                                    <div className="connection-line-container">
                                                        <div className="connection-line-glow"></div>
                                                    </div>
                                                    
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px' }}>
                                                        <span className="text-gray" style={{ letterSpacing: '2px' }}>MATCHING DONORS: 3/5 SECURED</span>
                                                        <span className="text-green" style={{ letterSpacing: '2px' }}>AWAITING OTHERS</span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <>
                                                    <div style={{ fontSize: '11px', color: '#aaa', letterSpacing: '1px', marginBottom: '16px', lineHeight: '1.6' }}>
                                                        CRITICAL NEED: {emerg.type.split('·')[0].trim()} REQUIRED IMMEDIATELY AT {emerg.title.toUpperCase()}. MULTIPLE DONORS NEEDED TO FULFILL REQUIREMENT.
                                                    </div>
                                                    <button 
                                                        className={`action-cta-btn ${responseStatus === 'responding' ? 'responding' : ''} ${responseStatus === 'confirmed' ? 'confirmed' : ''}`}
                                                        disabled={responseStatus !== 'idle'}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setResponseStatus('responding');
                                                            setTimeout(() => {
                                                                setResponseStatus('confirmed');
                                                            }, 1500);
                                                        }}
                                                    >
                                                        {responseStatus === 'idle' && 'I AM AVAILABLE NOW'}
                                                        {responseStatus === 'responding' && 'RESPONDING...'}
                                                        {responseStatus === 'confirmed' && 'CONFIRMED'}
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    <div className="pd-col">
                        <div className="pd-section-title">HEART VIABILITY WINDOW</div>
                        
                        {(() => {
                            const maxTime = 34 * 60;
                            const fillPercent = Math.max(0, Math.min(100, 100 - (timer / maxTime) * 100));
                            const isCritical = timer < 600;
                            return (
                                <div className={`blood-drop-container ${isCritical ? 'critical-shake' : ''}`}>
                                    <div className={`blood-drop-glow ${isCritical ? 'critical-pulse' : 'normal-pulse'}`}></div>
                                    <svg viewBox="0 0 100 150" className="blood-drop-svg">
                                        <defs>
                                            <clipPath id="dropClip">
                                                <path d="M 50,10 C 50,10 10,70 10,100 C 10,122.09 27.91,140 50,140 C 72.09,140 90,122.09 90,100 C 90,70 50,10 50,10 Z" />
                                            </clipPath>
                                            <linearGradient id="liquidColor" x1="0%" y1="0%" x2="0%" y2="100%">
                                                <stop offset="0%" stopColor="#ff4444" />
                                                <stop offset="100%" stopColor="#aa0000" />
                                            </linearGradient>
                                            <filter id="bloodGlow">
                                                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                                                <feMerge>
                                                    <feMergeNode in="coloredBlur"/>
                                                    <feMergeNode in="SourceGraphic"/>
                                                </feMerge>
                                            </filter>
                                        </defs>

                                        <path d="M 50,10 C 50,10 10,70 10,100 C 10,122.09 27.91,140 50,140 C 72.09,140 90,122.09 90,100 C 90,70 50,10 50,10 Z" 
                                              fill="rgba(30, 0, 0, 0.4)" 
                                              stroke={isCritical ? "#ff3333" : "#551111"} 
                                              strokeWidth="2" />

                                        <g clipPath="url(#dropClip)">
                                            <g className="liquid-wave-group" 
                                               style={{ transform: `translateY(${140 - (fillPercent * 1.3)}px)` }}>
                                                <path className="wave-back"
                                                      fill="rgba(150, 0, 0, 0.4)"
                                                      d="M -100,0 Q -50,-8 0,0 T 100,0 T 200,0 T 300,0 L 300,150 L -100,150 Z" />
                                                
                                                <path className="wave-front"
                                                      fill="url(#liquidColor)"
                                                      d="M -100,0 Q -50,8 0,0 T 100,0 T 200,0 T 300,0 L 300,150 L -100,150 Z" />
                                            </g>
                                        </g>
                                        
                                        <circle className="falling-drop" cx="50" cy="-5" r="2.5" fill="#ff4444" filter="url(#bloodGlow)"/>
                                    </svg>
                                    
                                    <div className="blood-drop-text">
                                        <div className="lbl">TIME LEFT</div>
                                        <div className={`val orbitron ${isCritical ? 'text-red' : ''}`}>{formatTime(timer)}</div>
                                    </div>
                                </div>
                            );
                        })()}

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

                {/* DONOR PULSE SECTION */}
                <div style={{ marginTop: '32px', borderTop: '1px solid #1a0000', paddingTop: '32px' }}>
                    <div className="pd-section-title">DONOR WILLINGNESS PULSE</div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                        <DonorPulseAvailability 
                            donorId="donor-1" 
                            donorName="ARJUN SHARMA" 
                            bloodType="O+" 
                            onStatusChange={handleDonorPulseStatusChange} 
                        />
                        <DonorPulseAvailability 
                            donorId="donor-2" 
                            donorName="PRIYA KAPOOR" 
                            bloodType="A+" 
                            onStatusChange={handleDonorPulseStatusChange} 
                        />
                        <DonorPulseAvailability 
                            donorId="donor-3" 
                            donorName="RAVI PATEL" 
                            bloodType="B+" 
                            onStatusChange={handleDonorPulseStatusChange} 
                        />
                    </div>

                    {Object.keys(activePulseDonors).length > 0 && (
                        <div style={{ border: '1px solid #002211', padding: '20px', background: 'rgba(0, 255, 85, 0.03)', borderRadius: '2px', marginBottom: '24px' }}>
                            <div className="text-green" style={{ fontSize: '11px', letterSpacing: '2px', marginBottom: '16px' }}>ACTIVE PULSE DONORS ({Object.keys(activePulseDonors).length})</div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {Object.values(activePulseDonors).filter(d => d.status === 'ACTIVE').map((donor) => (
                                    <div key={donor.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'rgba(0, 255, 85, 0.05)',  border: '1px solid rgba(0, 255, 85, 0.2)', borderRadius: '2px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00ff00', animation: 'blinkDot 1s infinite' }}></div>
                                            <div>
                                                <div style={{ fontSize: '12px', color: '#fff', letterSpacing: '1px' }}>{donor.name}</div>
                                                <div style={{ fontSize: '9px', color: '#00cc55', letterSpacing: '1px', marginTop: '2px' }}>{donor.bloodGroup}</div>
                                            </div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontSize: '9px', color: '#00ff00', letterSpacing: '1px' }}>LAST SEEN: {donor.lastSeen ? new Date(donor.lastSeen).toLocaleTimeString() : '—'}</div>
                                            <div style={{ fontSize: '9px', color: '#aaa', letterSpacing: '1px', marginTop: '2px' }}>DISTANCE: {donor.distance ? (donor.distance / 1000).toFixed(2) : '—'} km</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
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
                    <div className="pd-nav-ico" onClick={onBack}>
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

export default function PraanDashboard({ onBack }) {
    const [role, setRole] = useState(() => localStorage.getItem('userRole') || null);

    const handleSetRole = (newRole) => {
        if (newRole) {
            localStorage.setItem('userRole', newRole);
        } else {
            localStorage.removeItem('userRole');
        }
        setRole(newRole);
    };

    // Default CSS styles shared across all modes
    const baseCss = `
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
            overflow-y: auto;
            overflow-x: hidden;
            user-select: none;
        }
        .praan-dashboard::-webkit-scrollbar { width: 8px; }
        .praan-dashboard::-webkit-scrollbar-track { background: #030000; }
        .praan-dashboard::-webkit-scrollbar-thumb { background: #330000; border-radius: 8px; }
        .praan-dashboard::-webkit-scrollbar-thumb:hover { background: #ff3333; }
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
    `;

    if (role === 'doctor') {
        return <DoctorDashboard onBack={() => handleSetRole(null)} />;
    }

    if (role === 'donor') {
        return <DonorDashboard onBack={() => handleSetRole(null)} />;
    }

    return (
        <div className="praan-dashboard" style={{ alignItems: 'center', justifyContent: 'center' }}>
            <style>{baseCss}</style>
            
            <div className="orbitron" style={{ fontSize: '48px', fontWeight: 900, letterSpacing: '16px', marginBottom: '64px', color: '#ff3333', position: 'relative', zIndex: 10 }}>
                P R A A N
            </div>
            
            <div style={{ color: '#441111', fontSize: '14px', letterSpacing: '4px', marginBottom: '48px', display: 'flex', alignItems: 'center', gap: '16px', position: 'relative', zIndex: 10 }}>
                <div style={{ width: '48px', height: '1px', background: '#441111' }}></div>
                SELECT YOUR ROLE
                <div style={{ width: '48px', height: '1px', background: '#441111' }}></div>
            </div>
            
            <div style={{ display: 'flex', gap: '32px', position: 'relative', zIndex: 10 }}>
                <button 
                    onClick={() => handleSetRole('donor')}
                    style={{
                        background: 'transparent', border: '1px solid #ff3333', padding: '32px 48px',
                        color: '#fff', fontFamily: '"Share Tech Mono", monospace', fontSize: '20px',
                        cursor: 'pointer', letterSpacing: '4px', transition: 'all 0.3s'
                    }}
                    onMouseOver={e => e.currentTarget.style.background = 'rgba(255,51,51,0.1)'}
                    onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                >
                    DONOR / PATIENT
                </button>
                <button 
                    onClick={() => handleSetRole('doctor')}
                    style={{
                        background: 'transparent', border: '1px solid #441111', padding: '32px 48px',
                        color: '#fff', fontFamily: '"Share Tech Mono", monospace', fontSize: '20px',
                        cursor: 'pointer', letterSpacing: '4px', transition: 'all 0.3s'
                    }}
                    onMouseOver={e => e.currentTarget.style.borderColor = '#ff3333'}
                    onMouseOut={e => e.currentTarget.style.borderColor = '#441111'}
                >
                    MEDICAL DOCTOR
                </button>
            </div>
            
            <button className="pd-back-btn" onClick={onBack} style={{ marginTop: '80px', padding: '16px 32px', position: 'relative', zIndex: 10 }}>
                <span>←</span> BACK TO MAIN MENU
            </button>
        </div>
    );
}

<div style={{
  position: "fixed",
  right: 0,
  top: 0,
  width: "300px",
  height: "100vh",
  background: "red",
  zIndex: 9999
}}>
  TEST PANEL
</div>