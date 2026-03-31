import React, { useState, useEffect, useRef } from 'react';

// ── SPEECH API HELPERS ───────────────────────────────────────────────
const LANG_CODES = {
    English: 'en-US', Tamil: 'ta-IN', Hindi: 'hi-IN',
    Telugu: 'te-IN', Malayalam: 'ml-IN', Kannada: 'kn-IN'
};

function speak(text, langCode) {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = langCode;
    utt.rate = 0.95;
    window.speechSynthesis.speak(utt);
}

// ── MOCK DATA ────────────────────────────────────────────────────────
const getMockContent = (pageNum) => ({
    original: `मिळकत पत्रिका (७/१२ उतारा)\nगावाचे नाव: शिरूर\nतालुका: शिरूर, जिल्हा: पुणे\nस.न./गट क्र.: ४५अ/२\nखातेदार: अमित कुमार (Page ${pageNum})`,
    translations: {
        English: ['Property Record (7/12 Extract)', 'Village: Shirur', 'Taluka: Shirur, Dist: Pune', 'Survey/Gat No: 45A/2', `Owner: Amit Kumar (Page ${pageNum})`],
        Hindi: ['संपत्ति रिकॉर्ड (7/12)', 'गांव: शिरूर', 'तालुका: शिरूर, जिला: पुणे', 'सर्वे नंबर: 45A/2', `मालिक: अमित कुमार (Page ${pageNum})`],
        Tamil: ['சொத்து ரெக்கார்ட் (7/12)', 'கிராமம்: ஷிரூர்', 'தாலுகா: ஷிரூர், மாவட்டம்: புனே', 'சர்வே எண்: 45A/2', `உரிமையாளர்: அமித் குமார் (Page ${pageNum})`],
        Telugu: ['ఆస్తి రికార్డు (7/12)', 'గ్రామం: శిరూర్', 'తాలూకా: శిరూర్, జిల్లా: పూణే', 'సర్వే నం: 45A/2', `యజమాని: అమిత్ కుమార్ (Page ${pageNum})`],
        Malayalam: ['വസ്തു രേഖ (7/12)', 'ഗ്രാമം: ഷിരൂർ', 'താലൂക്ക്: ഷിരൂർ, ജില്ല: പൂനെ', 'സർവേ നമ്പർ: 45A/2', `ഉടമ: അമിത് കുമാർ (Page ${pageNum})`],
        Kannada: ['ಆಸ್ತಿ ದಾಖಲೆ (7/12)', 'ಗ್ರಾಮ: ಶಿರೂರು', 'ತಾಲೂಕು: ಶಿರೂರು, ಜಿಲ್ಲೆ: ಪುಣೆ', 'ಸರ್ವೆ ಸಂಖ್ಯೆ: 45A/2', `ಮಾಲೀಕ: ಅಮಿತ್ ಕುಮಾರ್ (Page ${pageNum})`]
    },
    entities: { owner: 'Amit Kumar', area: '2.5 Hectares', survey: '45A/2', status: 'Class-I Occupant', location: 'Shirur, Pune' },
    summary: `Page ${pageNum}: Certified agricultural land record (7/12). Owner has clear Class-I occupant rights. No encumbrances detected.`
});

const MOCK_CHAT_ANSWER = (question) => {
    const q = question.toLowerCase();
    if (q.includes('owner')) return 'The registered owner is Amit Kumar (Class-I Occupant).';
    if (q.includes('area') || q.includes('size')) return 'Total land area: 2.5 Hectares (approx. 6.17 acres).';
    if (q.includes('loan') || q.includes('encumbr')) return 'No encumbrances found. Eligible for institutional crop loans.';
    if (q.includes('location') || q.includes('village')) return 'Location: Shirur, Shirur Taluka, Pune District, Maharashtra.';
    if (q.includes('explain') || q.includes('key')) return 'This 7/12 document certifies agricultural land ownership. Key entities: Owner — Amit Kumar, Survey 45A/2, Area 2.5 Hectares, Shirur, Pune. Status: Class-I Occupant. No litigations or bank encumbrances detected.';
    return 'Based on document data: the land parcel is clear of any encumbrances. The registered owner holds full occupancy rights.';
};

const LANGUAGES = ['English', 'Tamil', 'Hindi', 'Telugu', 'Malayalam', 'Kannada'];

// ── COMPONENT ────────────────────────────────────────────────────────
export default function NyayDashboard({ onBack }) {
    const [validity, setValidity] = useState(0);
    const [files, setFiles] = useState([]);
    const [currentPage, setCurrentPage] = useState(-1);
    const [isScanning, setIsScanning] = useState(false);
    const [scanStatus, setScanStatus] = useState('');
    const [language, setLanguage] = useState('English');
    const [processedPages, setProcessedPages] = useState([]);
    const [chatQuery, setChatQuery] = useState('');
    const [chatHistory, setChatHistory] = useState([
        { role: 'user', text: 'Does this document allow me to apply for crop loan?' },
        { role: 'ai', text: 'Yes. As a Class-I occupant with no existing encumbrances on Gat 45A/2, you are fully eligible to apply for institutional crop loans.' }
    ]);
    const [pageTurnAnim, setPageTurnAnim] = useState(false);

    // ── Voice state ──
    const [voiceLang, setVoiceLang] = useState('English');
    const [isListening, setIsListening] = useState(false);
    const [voiceTranscript, setVoiceTranscript] = useState('');
    const [voiceResponse, setVoiceResponse] = useState('');
    const [voiceStatus, setVoiceStatus] = useState('CLICK MIC TO SPEAK');
    const [speechSupported, setSpeechSupported] = useState(
        !!(window.SpeechRecognition || window.webkitSpeechRecognition)
    );
    const recognitionRef = useRef(null);
    const voiceLangRef = useRef('English'); // always reflects latest voiceLang in callbacks

    const fileInputRef = useRef(null);
    const chatEndRef = useRef(null);
    const translationScrollRef = useRef(null);
    const chatScrollRef = useRef(null);

    // ── Validity count-up ──
    useEffect(() => {
        let v = 0;
        const t = setInterval(() => { if (v < 78) setValidity(++v); else clearInterval(t); }, 20);
        return () => clearInterval(t);
    }, []);

    // ── Auto-scroll chat ──
    useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [chatHistory]);

    // ── Auto-scroll translation ──
    useEffect(() => {
        if (translationScrollRef.current) {
            translationScrollRef.current.scrollTop = translationScrollRef.current.scrollHeight;
        }
    }, [processedPages.length]);

    // ── Scan status cycling ──
    useEffect(() => {
        if (!isScanning) return;
        const statuses = ['Scanning Page...', 'Extracting Text...', 'Processing Entities...'];
        let idx = 0;
        setScanStatus(statuses[0]);
        const t = setInterval(() => { idx = (idx + 1) % statuses.length; setScanStatus(statuses[idx]); }, 800);
        return () => clearInterval(t);
    }, [isScanning, currentPage]);

    // ── Sequential scan engine ──
    useEffect(() => {
        if (!isScanning || currentPage < 0 || currentPage >= files.length) return;
        const timer = setTimeout(() => {
            const content = getMockContent(currentPage + 1);
            setProcessedPages(prev => [...prev, { pageNumber: currentPage + 1, fileName: files[currentPage].name, ...content }]);
            if (currentPage + 1 < files.length) {
                setCurrentPage(p => p + 1);
                setPageTurnAnim(true);
                setTimeout(() => setPageTurnAnim(false), 600);
            } else {
                setIsScanning(false);
                setScanStatus('Scan Complete');
            }
        }, 3000);
        return () => clearTimeout(timer);
    }, [isScanning, currentPage, files.length]);

    // ── Upload handler ──
    const handleUpload = (e) => {
        if (!e.target.files?.length) return;
        const newFiles = Array.from(e.target.files);
        setFiles(prev => {
            const combined = [...prev, ...newFiles];
            if (!isScanning) {
                setCurrentPage(prev.length);
                setIsScanning(true);
                setPageTurnAnim(true);
                setTimeout(() => setPageTurnAnim(false), 600);
            }
            return combined;
        });
    };

    // ── Chat handler ──
    const handleChatSubmit = (overrideText) => {
        const q = (overrideText || chatQuery).trim();
        if (!q) return;
        setChatQuery('');
        setChatHistory(prev => [...prev, { role: 'user', text: q }]);
        setTimeout(() => {
            const answer = MOCK_CHAT_ANSWER(q);
            setChatHistory(prev => [...prev, { role: 'ai', text: answer }]);
        }, 900);
    };

    const runAction = (act) => {
        if (act === 'upload') fileInputRef.current?.click();
        else if (act === 'translate' && processedPages.length > 0) setLanguage(LANGUAGES[(LANGUAGES.indexOf(language) + 1) % LANGUAGES.length]);
        else if (act === 'explain') handleChatSubmit('Please explain the key logical points of this document.');
    };

    // ── Voice Assistant ──
    // Keep voiceLangRef in sync so event callbacks always use the latest lang
    useEffect(() => { voiceLangRef.current = voiceLang; }, [voiceLang]);

    const stopRecognition = () => {
        try { recognitionRef.current?.stop(); } catch (_) { }
        recognitionRef.current = null;
        setIsListening(false);
    };

    const toggleListening = () => {
        if (isListening) {
            stopRecognition();
            setVoiceStatus('CLICK MIC TO SPEAK');
            return;
        }

        const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRec) { setSpeechSupported(false); return; }

        window.speechSynthesis?.cancel();
        setVoiceTranscript('');
        setVoiceResponse('');

        const rec = new SpeechRec();
        rec.continuous = false;        // single utterance — prevents infinite loop
        rec.interimResults = false;    // only fire onresult with final text
        rec.lang = LANG_CODES[voiceLangRef.current] || 'en-US';

        rec.onstart = () => {
            setIsListening(true);
            setVoiceStatus('LISTENING...');
        };

        rec.onresult = (event) => {
            const transcript = event.results[0]?.[0]?.transcript?.trim();
            if (!transcript) return;
            const lang = voiceLangRef.current;
            setVoiceTranscript(transcript);
            setVoiceStatus('PROCESSING...');
            const answer = MOCK_CHAT_ANSWER(transcript);
            setVoiceResponse(answer);
            setVoiceStatus('RESPONSE READY');
            // Append to chat so transcript is persistent
            setChatHistory(prev => [
                ...prev,
                { role: 'user', text: `🎤 ${transcript}` },
                { role: 'ai', text: answer }
            ]);
            // Speak the answer in the selected language
            speak(answer, LANG_CODES[lang] || 'en-US');
        };

        rec.onerror = (event) => {
            const err = event.error;
            if (err === 'no-speech') {
                setVoiceStatus('NO SPEECH DETECTED — TRY AGAIN');
            } else if (err === 'not-allowed' || err === 'service-not-allowed') {
                setVoiceStatus('MICROPHONE PERMISSION DENIED');
                setSpeechSupported(false);
            } else if (err === 'network') {
                setVoiceStatus('NETWORK ERROR — CHECK CONNECTION');
            } else {
                setVoiceStatus(`ERROR: ${err.toUpperCase()}`);
            }
            // Always clean up gracefully — never leave in broken state
            setIsListening(false);
            recognitionRef.current = null;
        };

        rec.onend = () => {
            // onend fires after both success and no-speech; reset listening flag
            setIsListening(false);
            // If status is still LISTENING (i.e., no result and no error), show prompt
            setVoiceStatus(s => s === 'LISTENING...' ? 'NO SPEECH DETECTED — TRY AGAIN' : s);
            recognitionRef.current = null;
        };

        try {
            recognitionRef.current = rec;
            rec.start();
        } catch (e) {
            console.warn('[Voice] Start error:', e.message);
            setVoiceStatus('COULD NOT START — REFRESH AND TRY AGAIN');
            recognitionRef.current = null;
        }
    };

    // Cleanup recognition on unmount
    useEffect(() => () => { recognitionRef.current?.stop(); window.speechSynthesis?.cancel(); }, []);

    const isCurrentPage = files.length > 0 && currentPage >= 0 && currentPage < files.length;
    let uiStatus = 'LIVE';
    if (files.length > 0) {
        uiStatus = isScanning ? `SCANNING PAGE ${currentPage + 1} / ${files.length}` : `COMPLETED (${files.length} PAGES)`;
    }

    return (
        <div className="nyay-dashboard">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;700;900&family=Share+Tech+Mono&display=swap');

                /* ── ROOT ── */
                .nyay-dashboard {
                    position: fixed; inset: 0;
                    background-color: #020202; color: #fff;
                    font-family: 'Share Tech Mono', monospace;
                    display: flex; flex-direction: column;
                    z-index: 9999; padding: 28px 40px;
                    /* allow outer scroll only when grid expands > viewport */
                    overflow-y: auto; overflow-x: hidden;
                    animation: nyayFadeIn 0.8s ease-out forwards;
                    background-image:
                        radial-gradient(circle at 15% 50%, rgba(255,255,255,0.03), transparent 25%),
                        radial-gradient(circle at 85% 30%, rgba(255,255,255,0.03), transparent 25%);
                }
                .nyay-dashboard *, .nyay-dashboard *::before, .nyay-dashboard *::after { box-sizing: border-box; }

                @keyframes nyayFadeIn {
                    from { opacity: 0; transform: scale(1.01); }
                    to   { opacity: 1; transform: scale(1); }
                }

                /* ── SCROLLBAR UTILITY ── */
                .nd-scroll {
                    overflow-y: auto;
                    padding-right: 8px;
                }
                .nd-scroll::-webkit-scrollbar { width: 4px; }
                .nd-scroll::-webkit-scrollbar-track { background: rgba(0,0,0,0.4); border-radius: 4px; }
                .nd-scroll::-webkit-scrollbar-thumb { background: #444; border-radius: 4px; }
                .nd-scroll::-webkit-scrollbar-thumb:hover { background: #888; }

                /* ── HEADER ── */
                .nd-header {
                    display: flex; justify-content: space-between; align-items: center;
                    padding-bottom: 20px; border-bottom: 1px solid #222;
                    margin-bottom: 20px; flex-shrink: 0; position: relative; z-index: 10;
                }
                .nd-back-btn {
                    background: transparent; border: 1px solid #444; color: #aaa;
                    font-family: inherit; padding: 8px 24px; font-size: 13px;
                    cursor: pointer; letter-spacing: 3px; transition: .2s;
                }
                .nd-back-btn:hover { border-color: #fff; color: #fff; background: rgba(255,255,255,0.06); }

                /* ── 3-COLUMN GRID ── */
                .nd-main-grid {
                    display: grid;
                    grid-template-columns: 38% 35% 22%;
                    gap: 20px; 
                    flex: 1;
                    /* let grid take natural height — outer .nyay-dashboard scrolls if needed */
                    min-height: 0;
                    position: relative; z-index: 10;
                }
                @media (max-width: 1100px) {
                    .nd-main-grid { grid-template-columns: 1fr; }
                }
                .nd-col { display: flex; flex-direction: column; gap: 16px; }

                /* ── PANEL ── */
                .nd-panel {
                    border: 1px solid #1a1a1a;
                    background: linear-gradient(145deg, rgba(24,24,24,0.8) 0%, rgba(10,10,10,0.9) 100%);
                    padding: 22px; display: flex; flex-direction: column;
                    box-shadow: inset 0 0 30px rgba(255,255,255,0.012), 0 10px 40px rgba(0,0,0,0.8);
                    transition: border-color .3s;
                }
                .nd-panel:hover { border-color: #333; }

                .nd-title {
                    color: #e0e0e0; font-size: 13px; font-weight: bold;
                    letter-spacing: 4px; text-transform: uppercase;
                    margin-bottom: 16px; display: flex; align-items: center; gap: 12px; flex-shrink: 0;
                }
                .nd-title::after { content: ""; flex: 1; height: 1px; background: #1a1a1a; }
                .nd-title::before { content: ""; width: 24px; height: 2px; background: #888; flex-shrink: 0; }

                /* ── SCAN BOX ── */
                .nd-doc-scan {
                    perspective: 1200px; height: 360px;
                    background: radial-gradient(circle, rgba(20,20,20,0.9), rgba(5,5,5,1));
                    border: 1px solid #333; position: relative; overflow: hidden;
                    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
                }
                .nd-doc-scan.scanning { border-color: #666; animation: borderPulse 2s infinite alternate; }
                @keyframes borderPulse { from { box-shadow: 0 0 10px rgba(255,255,255,0.05); } to { box-shadow: 0 0 25px rgba(255,255,255,0.15); } }

                .scan-noise {
                    position: absolute; inset: 0; z-index: 2; opacity: 0.14; pointer-events: none;
                    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
                    animation: flicker 0.12s infinite;
                }
                @keyframes flicker { 0%{opacity:0.1;} 100%{opacity:0.18;} }

                .doc-stack-container { position: relative; width: 82%; height: 82%; transform-style: preserve-3d; }
                .doc-page { position: absolute; width: 100%; height: 100%; background: rgba(15,15,15,0.96); border: 1px solid #555; padding: 24px; transform-origin: left center; box-shadow: 0 0 30px rgba(0,0,0,0.8); transition: all 0.5s ease; }
                .doc-page.front { transform: translateZ(0); z-index: 10; border-color: #999; }
                .doc-page.back-1 { transform: translateZ(-18px) translateX(7px) translateY(7px); z-index: 9; opacity: 0.6; filter: blur(1px); border-color: #444; }
                .doc-page.back-2 { transform: translateZ(-36px) translateX(14px) translateY(14px); z-index: 8; opacity: 0.35; filter: blur(3px); border-color: #222; }
                .doc-page.turning { animation: pageTurn 0.6s ease forwards; }
                @keyframes pageTurn { 0%{transform: translateZ(0);} 50%{transform: rotateY(-25deg) translateX(-20%) translateZ(30px); opacity:0;} 100%{transform: translateZ(0); opacity:1;} }

                .nd-scan-beam {
                    position: absolute; left:-5%; right:-5%; top: 0; height: 14vh;
                    background: linear-gradient(to bottom, transparent, rgba(255,255,255,0.18) 90%, rgba(255,255,255,0.8));
                    border-bottom: 2px solid #fff; box-shadow: 0 5px 25px rgba(255,255,255,0.35);
                    animation: beamDown 3s ease-in-out infinite; z-index: 15;
                }
                @keyframes beamDown { 0%{top:-8%; opacity:0;} 8%{opacity:1;} 92%{opacity:1;} 100%{top:108%; opacity:0;} }

                .scan-overlay {
                    position: absolute; top: 14px; right: 14px;
                    background: rgba(0,0,0,0.85); border: 1px solid #555; padding: 7px 14px;
                    color: #fff; font-size: 12px; z-index: 20; letter-spacing: 2px;
                    display: flex; align-items: center; gap: 8px;
                }

                .sync-hl {
                    background: rgba(255,255,255,0.18); padding: 1px 5px;
                    border: 1px solid rgba(255,255,255,0.35);
                    animation: hlPulse 1.5s infinite alternate;
                }
                @keyframes hlPulse { from{opacity:.75;} to{opacity:1; box-shadow:0 0 10px rgba(255,255,255,0.45);} }

                .hval {
                    background: rgba(255,255,255,0.08); padding: 1px 6px;
                    border: 1px solid rgba(255,255,255,0.2);
                }

                /* ── LANGUAGE PILLS ── */
                .lang-pill {
                    padding: 5px 12px; border: 1px solid #444; color: #777;
                    font-size: 11px; cursor: pointer; transition: .2s; letter-spacing: 1px; flex-shrink: 0;
                }
                .lang-pill.on { border-color: #fff; color: #fff; background: rgba(255,255,255,0.1); }
                .lang-pill:hover:not(.on) { border-color: #888; color: #ddd; }

                /* ── BUTTONS ── */
                .nd-btn {
                    background: transparent; border: 1px solid #333; color: #ccc;
                    padding: 15px 20px; font-family: inherit; cursor: pointer; width: 100%;
                    text-align: left; display: flex; justify-content: space-between; align-items: center;
                    letter-spacing: 2px; font-size: 13px; transition: .2s; position: relative; overflow: hidden;
                }
                .nd-btn::after {
                    content: ''; position: absolute; top: 0; left: -100%; width: 40%; height: 100%;
                    background: linear-gradient(to right, transparent, rgba(255,255,255,0.08), transparent);
                    transform: skewX(-15deg); transition: 0.35s;
                }
                .nd-btn:hover::after { left: 160%; }
                .nd-btn:hover { border-color: #fff; color: #fff; }
                .nd-btn:active { transform: scale(0.99); }

                /* ── TRANSLATION PANEL ── */
                .trans-pane { flex: 1; padding: 20px; }
                .trans-pane-orig { border-right: 1px solid #1a1a1a; background: rgba(0,0,0,0.25); }
                .log-entry { display: flex; border-bottom: 1px solid #1a1a1a; min-height: fit-content; }

                /* ── AI INTERP ── */
                .interp-card {
                    background: rgba(255,255,255,0.04); border: 1px solid #333;
                    border-left: 3px solid #fff; padding: 16px; margin-top: 16px;
                }
                .entity-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; font-size: 13px; line-height: 1.7; }
                .ekey { color: #777; font-size: 11px; letter-spacing: 1px; }
                .eval { background: rgba(255,255,255,0.07); padding: 2px 8px; border: 1px solid #2a2a2a; }

                /* ── VALIDITY ── */
                .validity-wrap { text-align: center; padding: 16px 0; }
                .validity-bar { width: 72%; height: 3px; background: #111; margin: 16px auto 0; position: relative; border-radius: 2px; overflow: hidden; }
                .validity-fill { position: absolute; top: 0; left: 0; bottom: 0; background: #fff; box-shadow: 0 0 10px #fff; transition: width .08s; }

                /* ── CHAT ── */
                .chat-area { display: flex; flex-direction: column; gap: 14px; }
                .chat-msg { font-size: 13px; line-height: 1.7; max-width: 94%; }
                .chat-user { align-self: flex-end; background: rgba(255,255,255,0.06); border: 1px solid #444; padding: 10px 14px; }
                .chat-ai { align-self: flex-start; color: #bbb; padding: 4px 0; }
                .chat-ai-lbl { font-size: 10px; letter-spacing: 2px; color: #fff; margin-bottom: 6px; }

                .chat-pill {
                    border: 1px dashed #333; padding: 5px 12px; font-size: 11px; color: #666;
                    cursor: pointer; white-space: nowrap; transition: .2s; flex-shrink: 0; border-radius: 2px;
                }
                .chat-pill:hover { border-color: #fff; color: #fff; background: rgba(255,255,255,0.04); }

                /* ── VOICE PANEL ── */
                .nd-mic-wrap { display: flex; flex-direction: column; align-items: center; gap: 16px; padding: 16px 0; }
                .nd-mic {
                    width: 64px; height: 64px; border-radius: 50%; border: 1px solid #555;
                    display: flex; align-items: center; justify-content: center;
                    cursor: pointer; font-size: 22px; transition: .3s; position: relative;
                }
                .nd-mic:hover { border-color: #fff; background: rgba(255,255,255,0.08); }
                .nd-mic.active { border-color: #fff; background: rgba(255,255,255,0.1); box-shadow: 0 0 20px rgba(255,255,255,0.25); }
                .nd-mic.active::before {
                    content: ''; position: absolute; inset: -10px; border-radius: 50%;
                    border: 1px solid rgba(255,255,255,0.35); animation: micRing 1.4s infinite;
                }
                @keyframes micRing { 0%{transform:scale(0.9);opacity:1;} 100%{transform:scale(1.5);opacity:0;} }

                .voice-transcript { font-size: 12px; color: #aaa; text-align: center; padding: 0 12px; min-height: 18px; }
                .voice-response { font-size: 12px; color: #e0e0e0; text-align: center; padding: 12px; border: 1px solid #1a1a1a; background: rgba(255,255,255,0.02); min-height: 36px; line-height: 1.6; }
                .voice-lang-row { display: flex; flex-wrap: wrap; gap: 6px; justify-content: center; }

                .dot { width: 8px; height: 8px; border-radius: 50%; background: #fff; display: inline-block; box-shadow: 0 0 8px rgba(255,255,255,0.8); }
                .blink { animation: blink 1.5s infinite; }
                @keyframes blink { 0%,100%{opacity:1;} 50%{opacity:0.2;} }

                .orbitron { font-family: 'Orbitron', sans-serif; }
                .text-gray { color: #aaa; }
                .text-silver { color: #c0c0c0; }
            `}</style>

            <input type="file" multiple accept=".pdf,image/*" ref={fileInputRef} style={{ display: 'none' }} onChange={handleUpload} />

            {/* HEADER */}
            <div className="nd-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
                    <button className="nd-back-btn" onClick={onBack}>← DHARITRI</button>
                    <span className="text-gray" style={{ fontSize: 12, letterSpacing: 4 }}>MISSION / NYAYPATRA / AI DOC INTELLIGENCE</span>
                </div>
                <div className="orbitron" style={{ fontSize: 24, fontWeight: 900, letterSpacing: 28, color: '#fff', textShadow: '0 0 18px rgba(255,255,255,0.3)' }}>N Y A Y</div>
                <div style={{ border: '1px solid #333', padding: '7px 18px', fontSize: 11, display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,0.03)' }}>
                    <div className="dot blink"></div> SECURE
                </div>
            </div>

            {/* 3-COLUMN GRID */}
            <div className="nd-main-grid">

                {/* ── COL 1: SCAN + ACTIONS ── */}
                <div className="nd-col">
                    {/* Scan panel — fixed height, no scroll */}
                    <div className="nd-panel" style={{ padding: 0, overflow: 'hidden', flexShrink: 0 }}>
                        <div style={{ padding: '18px 22px 0' }}>
                            <div className="nd-title">DOCUMENT SCAN — {uiStatus}</div>
                        </div>
                        <div className={`nd-doc-scan ${isScanning ? 'scanning' : ''}`}>
                            {isScanning && <div className="scan-noise"></div>}
                            {isScanning && (
                                <div className="scan-overlay orbitron">
                                    <div className="dot blink" style={{ width: 6, height: 6 }}></div> {scanStatus}
                                </div>
                            )}
                            <div className="doc-stack-container">
                                {files.length > 1 && currentPage > 1 && <div className="doc-page back-2"></div>}
                                {files.length > 0 && currentPage > 0 && <div className="doc-page back-1"></div>}
                                <div className={`doc-page front ${pageTurnAnim ? 'turning' : ''}`}>
                                    {isScanning && <div className="nd-scan-beam"></div>}
                                    <div style={{ fontSize: 13, fontWeight: 'bold', color: '#bbb', marginBottom: 14, borderBottom: '1px solid #2a2a2a', paddingBottom: 10, letterSpacing: 2 }}>
                                        {isCurrentPage ? files[currentPage].name.toUpperCase() : files.length > 0 ? 'ALL PAGES SCANNED' : 'MAHARASHTRA LAND REVENUE — FORM 7/12'}
                                    </div>
                                    <div style={{ lineHeight: 2.1, fontSize: 14, color: '#bbb', opacity: isScanning ? 1 : 0.6 }}>
                                        {isCurrentPage ? (
                                            <>
                                                VILLAGE: <span className={isScanning ? 'sync-hl' : 'hval'}>SHIRUR</span><br />
                                                TALUKA: <span className="hval">SHIRUR</span><br />
                                                DISTRICT: <span className="hval">PUNE</span><br />
                                                SURVEY NO: <span className="hval">45A/2</span><br />
                                                AREA: <span className="hval">2.5 HECTARES</span><br />
                                                OWNER: <span className={isScanning ? 'sync-hl' : 'hval'}>AMIT KUMAR</span>
                                            </>
                                        ) : (
                                            <span style={{ color: '#555', fontSize: 13 }}>
                                                {files.length > 0 ? 'SCAN COMPLETE — READY FOR ANALYSIS' : 'SYSTEM IDLE — UPLOAD TO BEGIN'}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* System actions */}
                    <div className="nd-panel" style={{ flexShrink: 0 }}>
                        <div className="nd-title">SYSTEM ACTIONS</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            <button className="nd-btn" onClick={() => runAction('upload')}>UPLOAD DOCUMENT <span>↑</span></button>
                            <button className="nd-btn" onClick={() => runAction('translate')}>TRANSLATE BATCH <span>⇄</span></button>
                            <button className="nd-btn" onClick={() => runAction('explain')}>EXPLAIN LOGIC <span>⚡</span></button>
                            <button className="nd-btn">EXPORT REPORT <span>↓</span></button>
                        </div>
                    </div>
                </div>

                {/* ── COL 2: TRANSLATION + AI INTERPRETATION ── */}
                <div className="nd-col">
                    {/* Translation panel — INDEPENDENTLY SCROLLABLE */}
                    <div className="nd-panel" style={{ padding: 0, flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
                        <div style={{ padding: '18px 22px 0', flexShrink: 0 }}>
                            <div className="nd-title" style={{ marginBottom: 10 }}>
                                <span style={{ flexShrink: 0 }}>TRANSLATED LOG</span>
                                <span style={{ flex: 1 }}></span>
                                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                                    {LANGUAGES.map(l => (
                                        <div key={l} className={`lang-pill ${language === l ? 'on' : ''}`} onClick={() => setLanguage(l)}>
                                            {l.slice(0, 3).toUpperCase()}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        {/* SCROLL CONTAINER: max-height ensures it scrolls */}
                        <div ref={translationScrollRef} className="nd-scroll" style={{ flex: 1, maxHeight: '55vh' }}>
                            {processedPages.length === 0 ? (
                                <div className="log-entry">
                                    <div className="trans-pane trans-pane-orig">
                                        <div className="text-gray orbitron" style={{ fontSize: 10, letterSpacing: 2, marginBottom: 12 }}>ORIGINAL (MARATHI)</div>
                                        <div style={{ fontSize: 12, color: '#444' }}>Awaiting upload...</div>
                                    </div>
                                    <div className="trans-pane">
                                        <div className="text-gray orbitron" style={{ fontSize: 10, letterSpacing: 2, marginBottom: 12 }}>TRANSLATED ({language.toUpperCase()})</div>
                                        <div style={{ fontSize: 12, color: '#444' }}>Awaiting upload...</div>
                                    </div>
                                </div>
                            ) : (
                                processedPages.map((pg, i) => (
                                    <div className="log-entry" key={`log-${i}`}>
                                        <div className="trans-pane trans-pane-orig">
                                            <div className="text-gray orbitron" style={{ fontSize: 10, letterSpacing: 2, marginBottom: 10 }}>ORIGINAL — PAGE {pg.pageNumber}</div>
                                            <div style={{ fontSize: 12, color: '#888', lineHeight: 1.9, whiteSpace: 'pre-line' }}>
                                                {pg.original.split('\n').map((ln, j) => (
                                                    <span key={j}>
                                                        {(ln.includes('अमित') || ln.includes('शिरूर')) && isScanning && currentPage + 1 === pg.pageNumber
                                                            ? <span className="sync-hl">{ln}</span> : ln}
                                                        <br />
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="trans-pane">
                                            <div className="orbitron" style={{ fontSize: 10, letterSpacing: 2, marginBottom: 10, display: 'flex', justifyContent: 'space-between', color: '#d0d0d0' }}>
                                                {language.toUpperCase()}
                                                {isScanning && currentPage + 1 === pg.pageNumber && <div className="dot blink" style={{ width: 5, height: 5 }}></div>}
                                            </div>
                                            <div style={{ fontSize: 13, color: '#ccc', lineHeight: 2 }}>
                                                {(pg.translations[language] || []).map((line, j) => (
                                                    <div key={j} style={{ opacity: 0, animation: `reveal .4s ${j * 0.12}s forwards` }}>
                                                        {(line.includes('Shirur') || line.includes('Amit')) && isScanning && currentPage + 1 === pg.pageNumber
                                                            ? <span className="sync-hl">{line}</span> : line}<br />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* AI Interpretation panel — INDEPENDENTLY SCROLLABLE */}
                    <div className="nd-panel" style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
                        <div className="nd-title">AI INTERPRETATION</div>
                        <div className="nd-scroll" style={{ flex: 1, maxHeight: '35vh' }}>
                            {processedPages.length === 0 ? (
                                <div className="text-gray" style={{ fontSize: 12, textAlign: 'center', marginTop: 20 }}>AWAITING DATA STREAM...</div>
                            ) : (
                                processedPages.map((pg, i) => (
                                    <div key={`interp-${i}`} style={{ marginBottom: i < processedPages.length - 1 ? 28 : 0, paddingBottom: i < processedPages.length - 1 ? 28 : 0, borderBottom: i < processedPages.length - 1 ? '1px dashed #1a1a1a' : 'none' }}>
                                        <div className="orbitron" style={{ fontSize: 14, marginBottom: 14 }}>ANALYSIS <span style={{ color: '#666', fontSize: 11 }}>// PAGE {pg.pageNumber}</span></div>
                                        <div className="entity-grid">
                                            <div><div className="ekey">OWNER</div><div className="eval">{pg.entities.owner}</div></div>
                                            <div><div className="ekey">AREA</div><div className="eval">{pg.entities.area}</div></div>
                                            <div><div className="ekey">SURVEY</div><div className="eval">{pg.entities.survey}</div></div>
                                            <div><div className="ekey">STATUS</div><div className="eval" style={{ color: '#4ade80', borderColor: '#1a3a1a' }}>{pg.entities.status}</div></div>
                                        </div>
                                        <div className="interp-card">
                                            <div className="ekey" style={{ marginBottom: 8 }}>EXECUTIVE SUMMARY</div>
                                            <div style={{ fontSize: 13, lineHeight: 1.7 }}>{pg.summary}</div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* ── COL 3: VALIDITY + CHAT + VOICE ── */}
                <div className="nd-col">
                    {/* Validity */}
                    <div className="nd-panel" style={{ flexShrink: 0 }}>
                        <div className="nd-title">DOCUMENT VALIDITY</div>
                        <div className="validity-wrap">
                            <div className="orbitron" style={{ fontSize: 60, fontWeight: 900, textShadow: '0 0 30px rgba(255,255,255,0.5)', lineHeight: 1 }}>
                                {validity}<span style={{ fontSize: 22, color: '#555' }}>%</span>
                            </div>
                            <div className="validity-bar">
                                <div className="validity-fill" style={{ width: `${validity}%` }}></div>
                            </div>
                        </div>
                    </div>

                    {/* Chat — INDEPENDENTLY SCROLLABLE with fixed height */}
                    <div className="nd-panel" style={{ flexShrink: 0, display: 'flex', flexDirection: 'column' }}>
                        <div className="nd-title">AI CHAT ASSISTANT</div>
                        {/* Fixed scroll area: ~300px */}
                        <div ref={chatScrollRef} className="nd-scroll chat-area" style={{ height: 300, flexShrink: 0 }}>
                            {chatHistory.map((m, i) => (
                                <div key={i} className={`chat-msg ${m.role === 'user' ? 'chat-user' : 'chat-ai'}`} style={{ alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                                    {m.role === 'ai' && <div className="chat-ai-lbl orbitron">NYAYPATRA AI</div>}
                                    {m.text}
                                </div>
                            ))}
                            <div ref={chatEndRef} />
                        </div>
                        {/* Suggestion pills */}
                        <div className="nd-scroll" style={{ display: 'flex', gap: 8, overflowX: 'auto', overflowY: 'hidden', padding: '12px 0 8px', flexShrink: 0, borderTop: '1px dashed #1a1a1a' }}>
                            {['Who is owner?', 'Any encumbrances?', 'Land area?'].map((q, i) => (
                                <span key={i} className="chat-pill" onClick={() => handleChatSubmit(q)}>{q}</span>
                            ))}
                        </div>
                        {/* Input row */}
                        <div style={{ display: 'flex', gap: 10, borderTop: '1px solid #222', paddingTop: 12, flexShrink: 0 }}>
                            <input
                                style={{ flex: 1, background: 'transparent', border: 'none', color: '#fff', fontFamily: 'inherit', fontSize: 12, outline: 'none', letterSpacing: 1 }}
                                placeholder="TYPE QUERY..."
                                value={chatQuery}
                                onChange={e => setChatQuery(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleChatSubmit()}
                            />
                            <span style={{ color: '#666', cursor: 'pointer', fontSize: 18 }} onClick={() => handleChatSubmit()}>↵</span>
                        </div>
                    </div>

                    {/* Voice Assistant — INDEPENDENTLY SCROLLABLE */}
                    <div className="nd-panel" style={{ display: 'flex', flexDirection: 'column' }}>
                        <div className="nd-title">VOICE ASSISTANT</div>
                        <div className="nd-scroll" style={{ maxHeight: '50vh' }}>
                            <div className="nd-mic-wrap">
                                {!speechSupported ? (
                                    <div style={{ color: '#666', fontSize: 11, textAlign: 'center' }}>Browser does not support Speech Recognition.</div>
                                ) : (
                                    <>
                                        {/* Voice language selector */}
                                        <div className="voice-lang-row">
                                            {LANGUAGES.map(l => (
                                                <div key={l} className={`lang-pill ${voiceLang === l ? 'on' : ''}`} style={{ fontSize: 10, padding: '3px 8px' }}
                                                    onClick={() => {
                                                        setVoiceLang(l);
                                                        if (isListening) stopRecognition();
                                                        setVoiceStatus('CLICK MIC TO SPEAK');
                                                    }}>
                                                    {l.slice(0, 3).toUpperCase()}
                                                </div>
                                            ))}
                                        </div>

                                        {/* Mic button */}
                                        <div className={`nd-mic ${isListening ? 'active' : ''}`} onClick={toggleListening}>
                                            {isListening ? '🔴' : '🎤'}
                                        </div>

                                        {/* Status message — driven by voiceStatus state */}
                                        <div style={{
                                            fontSize: 11, letterSpacing: 2, textAlign: 'center',
                                            color: isListening ? '#fff' : voiceStatus.includes('NO SPEECH') || voiceStatus.includes('ERROR') || voiceStatus.includes('DENIED') ? '#ff8888' : '#666',
                                            minHeight: 18
                                        }}>
                                            {isListening && <span style={{ marginRight: 6 }}>●</span>}{voiceStatus}
                                        </div>

                                        {/* Live transcript */}
                                        {voiceTranscript && (
                                            <div className="voice-transcript">
                                                <span className="text-gray">YOU: </span>"{voiceTranscript}"
                                            </div>
                                        )}

                                        {/* AI spoken response */}
                                        {voiceResponse && (
                                            <div className="voice-response">
                                                <div className="orbitron" style={{ fontSize: 9, color: '#888', marginBottom: 6, letterSpacing: 2 }}>AI RESPONSE</div>
                                                {voiceResponse}
                                            </div>
                                        )}

                                        <div style={{ fontSize: 10, color: '#333', textAlign: 'center', letterSpacing: 1 }}>
                                            LANG: {voiceLang} ({LANG_CODES[voiceLang]})
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            <style>{`
                @keyframes reveal { to { opacity: 1; } }
            `}</style>
        </div>
    );
}