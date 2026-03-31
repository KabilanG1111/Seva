import { useState, useEffect } from "react";

export default function PraanDoctorDashboard({ onBack }) {
  const [donorCount, setDonorCount] = useState(1247);
  const [matchCount, setMatchCount] = useState(8);
  const [latency, setLatency] = useState(4);
  const [viabilityMins, setViabilityMins] = useState(3);
  const [viabilitySecs, setViabilitySecs] = useState(41);
  const [pulse, setPulse] = useState(true);
  const [d1, setD1] = useState(2.1);
  const [d2, setD2] = useState(3.7);
  const [d3, setD3] = useState(6.4);
  const [d4, setD4] = useState(8.9);
  const [d5, setD5] = useState(11.2);

  useEffect(() => {
    let t1, t2, t3, t4, t5;
    try {
      t1 = setInterval(() => {
        setDonorCount(c => Math.max(1200, c + Math.floor(Math.random() * 20) - 10));
        setLatency(Math.floor(3 + Math.random() * 4));
      }, 2500);
      t2 = setInterval(() => {
        setMatchCount(Math.floor(7 + Math.random() * 3));
      }, 3200);
      t3 = setInterval(() => {
        setPulse(p => !p);
      }, 800);
      t4 = setInterval(() => {
        setViabilitySecs(s => {
          if (s === 0) { setViabilityMins(m => { if (m === 0) { return 3; } return m - 1; }); return 59; }
          return s - 1;
        });
      }, 1000);
      t5 = setInterval(() => {
        setD1(v => Math.max(0.3, v - 0.06 + Math.random() * 0.07));
        setD2(v => Math.max(0.5, v - 0.04 + Math.random() * 0.05));
        setD3(v => Math.max(1.0, v - 0.07 + Math.random() * 0.05));
        setD4(v => Math.max(1.0, v + Math.random() * 0.05 - 0.02));
        setD5(v => Math.max(2.0, v - 0.05 + Math.random() * 0.04));
      }, 1800);
    } catch (e) {
      console.error("PraanDoctorDashboard interval error:", e);
    }
    return () => { clearInterval(t1); clearInterval(t2); clearInterval(t3); clearInterval(t4); clearInterval(t5); };
  }, []);

  const viabilityPct = ((viabilityMins * 60 + viabilitySecs) / (4 * 3600)) * 100;

  const S = {
    root: {
      background: "#000",
      fontFamily: "'Share Tech Mono', 'Courier New', monospace",
      color: "#fff",
      width: "100vw",
      minHeight: "100vh",
      position: "relative",
      overflowX: "hidden",
      backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,229,255,0.018) 2px, rgba(0,229,255,0.018) 4px)",
    },
    vignette: {
      position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
      background: "radial-gradient(ellipse at center, transparent 55%, rgba(0,20,40,0.3) 100%)",
      pointerEvents: "none", zIndex: 10,
    },
    topbar: {
      display: "flex", alignItems: "center", height: 52,
      borderBottom: "1px solid #001e2a", padding: "0 20px", gap: 16,
      background: "linear-gradient(180deg, #00080f 0%, #000 100%)",
    },
    backBtn: {
      border: "1px solid #00e5ff", color: "#fff", background: "transparent",
      fontFamily: "'Share Tech Mono', 'Courier New', monospace",
      fontSize: 11, letterSpacing: 2, padding: "7px 14px", cursor: "pointer",
    },
    breadcrumb: { color: "#0a1e28", fontSize: 11, letterSpacing: 3, flex: 1 },
    brand: {
      fontFamily: "'Orbitron', monospace", fontWeight: 900, fontSize: 20,
      letterSpacing: 12, color: "#00e5ff",
      textShadow: "0 0 20px rgba(0,229,255,0.35)",
    },
    docPill: {
      border: "1px solid #00e5ff", padding: "5px 13px", fontSize: 10,
      letterSpacing: 3, color: "#00e5ff", display: "flex", alignItems: "center", gap: 6,
    },
    liveDot: {
      width: 7, height: 7, borderRadius: "50%",
      background: pulse ? "#00e5ff" : "#001a22", transition: "background 0.3s",
    },
    signal: { fontSize: 12, letterSpacing: 2, color: "#1a4455" },
    signalDot: { display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: "#00e5ff", marginLeft: 5 },
    mainGrid: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", borderBottom: "1px solid #00111a" },
    panel: { padding: "22px 20px", borderRight: "1px solid #00111a" },
    panelLast: { padding: "22px 20px" },
    plbl: { fontSize: 10, letterSpacing: 4, color: "#002233", marginBottom: 14 },
    donorCount: {
      fontFamily: "'Orbitron', monospace", fontSize: 64, fontWeight: 900,
      lineHeight: 1, color: "#00e5ff",
      textShadow: pulse ? "0 0 55px rgba(0,229,255,0.85)" : "0 0 20px rgba(0,229,255,0.3)",
      transition: "text-shadow 0.8s ease",
    },
    sub: { fontSize: 10, letterSpacing: 3, color: "#102030", margin: "8px 0 18px" },
    bloodGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 7 },
    bloodBox: { border: "1px solid #001e2a", padding: "9px 8px", background: "rgba(0,15,22,0.7)" },
    bloodNum: { fontFamily: "'Orbitron', monospace", fontSize: 17, fontWeight: 700, color: "#00e5ff" },
    bloodLbl: { fontSize: 9, letterSpacing: 2, color: "#102030", marginTop: 3 },
    ecgPanel: { marginTop: 14, border: "1px solid #00111a", padding: "10px 8px", background: "rgba(0,6,12,0.9)" },
    matchNum: {
      fontFamily: "'Orbitron', monospace", fontSize: 88, fontWeight: 900,
      lineHeight: 1, color: "#00e5ff",
      textShadow: pulse ? "0 0 80px rgba(0,229,255,1), 0 0 40px rgba(0,229,255,0.6)" : "0 0 20px rgba(0,229,255,0.4)",
      transition: "text-shadow 0.8s ease",
    },
    barRow: { display: "flex", alignItems: "center", gap: 10, marginBottom: 12 },
    barLbl: { fontSize: 10, letterSpacing: 3, color: "#1a3a4a", width: 60 },
    barBg: { flex: 1, height: 3, background: "#00111a" },
    barNum: { fontSize: 12, color: "#2a5566", width: 18, textAlign: "right" },
    sysBox: { marginTop: 16, border: "1px solid #001e2a", padding: "10px 12px", background: "rgba(0,8,14,0.8)" },
    sysRow: { display: "flex", justifyContent: "space-between", marginBottom: 7 },
    sysLbl: { fontSize: 10, letterSpacing: 2, color: "#102030" },
    sysVal: { fontSize: 10, letterSpacing: 2, color: "#00e5ff" },
    avatar: {
      width: 52, height: 52, borderRadius: "50%",
      background: "radial-gradient(circle, #002233 0%, #000d14 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'Orbitron', monospace", fontSize: 14, fontWeight: 700,
      border: "1px solid #00e5ff", flexShrink: 0, color: "#00e5ff",
    },
    profileRow: { display: "flex", alignItems: "center", gap: 14, marginBottom: 18 },
    pname: { fontFamily: "'Orbitron', monospace", fontSize: 13, fontWeight: 700, letterSpacing: 2 },
    psub: { fontSize: 10, letterSpacing: 3, color: "#102030", marginTop: 4 },
    statGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 },
    statVal: { fontFamily: "'Orbitron', monospace", fontSize: 24, fontWeight: 700 },
    statLbl: { fontSize: 9, letterSpacing: 2, color: "#102030", marginTop: 5 },
    orBox: { marginTop: 14, border: "1px solid #001e2a", padding: "10px 12px", background: "rgba(0,8,14,0.7)" },
    orRow: { display: "flex", alignItems: "center", gap: 10, padding: "7px 0", borderBottom: "1px solid #000d14" },
    orRowLast: { display: "flex", alignItems: "center", gap: 10, padding: "7px 0" },
    orTime: { fontFamily: "'Orbitron', monospace", fontSize: 13, width: 50, flexShrink: 0 },
    orProc: { fontSize: 11, color: "#5aa8bb", letterSpacing: 1 },
    orDetail: { fontSize: 9, letterSpacing: 2, color: "#102030", marginTop: 2 },
    feedSection: { display: "grid", gridTemplateColumns: "1fr 1fr", borderBottom: "1px solid #00111a" },
    fpanel: { padding: "20px 20px", borderRight: "1px solid #00111a" },
    fpanelLast: { padding: "20px 20px" },
    donorItem: { display: "flex", alignItems: "flex-start", gap: 10, padding: "12px 0", borderBottom: "1px solid #000d14", cursor: "pointer" },
    donorItemLast: { display: "flex", alignItems: "flex-start", gap: 10, padding: "12px 0", cursor: "pointer" },
    pingWrap: { position: "relative", width: 14, height: 14, flexShrink: 0, marginTop: 3 },
    pingDot: { width: 10, height: 10, borderRadius: "50%", position: "absolute", top: 2, left: 2 },
    pingRing: { width: 10, height: 10, borderRadius: "50%", position: "absolute", top: 2, left: 2, background: "transparent" },
    dName: { fontFamily: "'Orbitron', monospace", fontSize: 12, color: "#7ad4e8", letterSpacing: 1 },
    dArea: { fontSize: 9, letterSpacing: 2, color: "#102030", marginTop: 2 },
    dRight: { textAlign: "right", marginLeft: "auto", flexShrink: 0 },
    dDist: { fontFamily: "'Orbitron', monospace", fontSize: 14, fontWeight: 700 },
    dEta: { fontSize: 9, letterSpacing: 2, color: "#102030", marginTop: 3 },
    viabTime: {
      fontFamily: "'Orbitron', monospace", fontSize: 56, fontWeight: 900,
      color: "#00e5ff", letterSpacing: 4, margin: "10px 0",
      textShadow: "0 0 28px rgba(0,229,255,0.5)",
    },
    viabSub: { fontSize: 10, letterSpacing: 3, color: "#102030" },
    viabBg: { width: "100%", height: 4, background: "#00111a", margin: "12px 0 4px" },
    viabLabels: { display: "flex", justifyContent: "space-between", fontSize: 9, letterSpacing: 2, color: "#0a1e28" },
    notifBox: { marginTop: 12, padding: "12px 14px", background: "rgba(0,10,18,0.7)", position: "relative", overflow: "hidden" },
    notifLbl: { fontSize: 9, letterSpacing: 3, color: "#002233", marginBottom: 6 },
    notifText: { fontSize: 12, color: "#5aa8bb", letterSpacing: 1 },
    notifSub: { fontSize: 9, letterSpacing: 2, color: "#102030", marginTop: 3 },
    actBar: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", borderBottom: "1px solid #00111a" },
    actBtn: { display: "flex", alignItems: "center", gap: 14, padding: "18px 20px", cursor: "pointer", borderRight: "1px solid #00111a" },
    actBtnLast: { display: "flex", alignItems: "center", gap: 14, padding: "18px 20px", cursor: "pointer" },
    actSub: { fontSize: 10, letterSpacing: 3, color: "#102030" },
    actMain: { fontFamily: "'Orbitron', monospace", fontSize: 12, fontWeight: 700, marginTop: 4, letterSpacing: 2, color: "#5aa8bb" },
    actArr: { marginLeft: "auto", fontSize: 18, color: "#0a1e28" },
    statusbar: { display: "flex", alignItems: "center", padding: "11px 20px", justifyContent: "space-between", background: "#000", borderTop: "1px solid #000d14" },
    sname: { fontFamily: "'Orbitron', monospace", fontSize: 12, letterSpacing: 3, color: "#00e5ff" },
    pillsRow: { display: "flex", gap: 7, marginTop: 5 },
    navRow: { display: "flex", gap: 28, alignItems: "center" },
    navItem: { textAlign: "center", cursor: "pointer" },
  };

  const donors = [
    { name: "PRIYA NAIR", type: "O- · BLOOD · WILLING TO DONATE", area: "SAFDARJUNG AREA", dist: d1, setDist: null, color: "#00e5ff", badge: "AVAILABLE", badgeBg: "rgba(0,229,255,0.06)", distId: "d1" },
    { name: "RAHUL VERMA", type: "O+ · BLOOD · WILLING TO DONATE", area: "LAJPAT NAGAR", dist: d2, color: "#00e5ff", badge: "AVAILABLE", badgeBg: "rgba(0,229,255,0.06)" },
    { name: "MEERA KRISHNAN", type: "A+ · BLOOD · IN TRANSIT", area: "DWARKA SECTOR 12", dist: d3, color: "#ffaa00", badge: "IN TRANSIT", badgeBg: "rgba(255,170,0,0.06)" },
    { name: "ARJUN SHARMA", type: "O+ · BLOOD · WILLING TO DONATE", area: "CONNAUGHT PLACE", dist: d4, color: "#00e5ff", badge: "AVAILABLE", badgeBg: "rgba(0,229,255,0.06)" },
    { name: "SUNITA DEVI", type: "B- · ORGAN KIDNEY · CRITICAL MATCH", area: "ROHINI SECTOR 3", dist: d5, color: "#ff4444", badge: "CRITICAL", badgeBg: "rgba(255,68,68,0.06)" },
  ];

  return (
    <>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Orbitron:wght@400;700;900&display=swap" />
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes ecg { from { stroke-dashoffset: 420; } to { stroke-dashoffset: 0; } }
        @keyframes pulse-ring { 0% { transform: scale(1); opacity: 0.7; } 100% { transform: scale(2.4); opacity: 0; } }
      ` }} />

      <div style={S.root}>
        <div style={S.vignette} />

        {/* TOP BAR */}
        <div style={S.topbar}>
          <button style={S.backBtn} onClick={onBack}>← DHARITRI</button>
          <span style={S.breadcrumb}>MISSION / PRAAN / DOCTOR / v2.1</span>
          <div style={S.brand}>P R A A N</div>
          <div style={S.docPill}>
            <span style={S.liveDot} />
            DOCTOR MODE
          </div>
          <div style={S.signal}>5G<span style={S.signalDot} /></div>
        </div>

        {/* 3-COL GRID */}
        <div style={S.mainGrid}>

          {/* COL 1 — DONORS */}
          <div style={S.panel}>
            <div style={S.plbl}>—— LIVE DONORS NEARBY</div>
            <div style={S.donorCount}>{donorCount.toLocaleString()}</div>
            <div style={S.sub}>GPS TRACKED · REAL-TIME · 15KM RADIUS</div>
            <div style={S.bloodGrid}>
              {[["438","O+ DONORS"],["121","O- DONORS"],["312","A+ DONORS"],["89","B- DONORS"]].map(([n,l]) => (
                <div key={l} style={S.bloodBox}>
                  <div style={S.bloodNum}>{n}</div>
                  <div style={S.bloodLbl}>{l}</div>
                </div>
              ))}
            </div>
            <div style={S.ecgPanel}>
              <div style={{ ...S.plbl, marginBottom: 8 }}>—— ECG LIVE · PATIENT 04</div>
              <svg width="100%" height="30" viewBox="0 0 260 30" preserveAspectRatio="none">
                <polyline
                  fill="none" stroke="#00e5ff" strokeWidth="1.4" opacity="0.9"
                  strokeDasharray="420" strokeDashoffset="420"
                  style={{ animation: "ecg 2.6s linear infinite" }}
                  points="0,15 8,15 12,15 14,2 16,29 18,15 22,15 42,15 46,15 48,2 50,29 52,15 56,15 76,15 80,15 82,2 84,29 86,15 90,15 110,15 114,15 116,2 118,29 120,15 124,15 144,15 148,15 150,2 152,29 154,15 158,15 178,15 182,15 184,2 186,29 188,15 192,15 212,15 216,15 218,2 220,29 222,15 260,15"
                />
              </svg>
            </div>
          </div>

          {/* COL 2 — MATCHES */}
          <div style={S.panel}>
            <div style={S.plbl}>—— ACTIVE MATCHES FOUND</div>
            <div style={S.matchNum}>{String(matchCount).padStart(2, "0")}</div>
            <div style={{ ...S.sub, margin: "8px 0 22px" }}>AUTO-MATCHED · NO ACTION NEEDED</div>
            {[
              { label: "BLOOD", val: 6, max: 8, color: "#00e5ff" },
              { label: "ORGAN", val: 2, max: 8, color: "#ffaa00" },
              { label: "PLASMA", val: 0, max: 8, color: "#112233" },
            ].map(r => (
              <div key={r.label} style={S.barRow}>
                <div style={S.barLbl}>{r.label}</div>
                <div style={S.barBg}>
                  <div style={{ height: 3, width: `${(r.val / r.max) * 100}%`, background: r.color, borderRadius: 1 }} />
                </div>
                <div style={S.barNum}>{r.val}</div>
              </div>
            ))}
            <div style={S.sysBox}>
              <div style={{ ...S.plbl, marginBottom: 8 }}>—— SYSTEM STATUS</div>
              <div style={S.sysRow}>
                <span style={S.sysLbl}>GPS SYNC</span>
                <span style={{ ...S.sysVal, opacity: pulse ? 1 : 0.15, transition: "opacity 0.4s" }}>LIVE</span>
              </div>
              <div style={S.sysRow}>
                <span style={S.sysLbl}>NOTTO LINK</span>
                <span style={S.sysVal}>CONNECTED</span>
              </div>
              <div style={{ ...S.sysRow, marginBottom: 0 }}>
                <span style={S.sysLbl}>5G LATENCY</span>
                <span style={{ ...S.sysVal, fontFamily: "'Orbitron', monospace", fontSize: 13 }}>{latency}ms</span>
              </div>
            </div>
          </div>

          {/* COL 3 — PROFILE */}
          <div style={S.panelLast}>
            <div style={S.plbl}>—— YOUR PROFILE</div>
            <div style={S.profileRow}>
              <div style={S.avatar}>AK</div>
              <div>
                <div style={S.pname}>DR. AISHA KAPOOR</div>
                <div style={S.psub}>CARDIO-SURGEON · AIIMS DELHI</div>
              </div>
            </div>
            <div style={S.statGrid}>
              {[
                { val: "7", lbl: "ACTIVE CASES", color: "#00e5ff", border: "#003344", bg: "rgba(0,20,30,0.6)" },
                { val: "2", lbl: "PENDING CONSENT", color: "#ffaa00", border: "#332200", bg: "rgba(20,12,0,0.6)" },
                { val: "03", lbl: "MATCHED TODAY", color: "#00e5ff", border: "#003344", bg: "rgba(0,20,30,0.6)" },
                { val: "1", lbl: "CRITICAL ALERT", color: "#ff4444", border: "#2a0000", bg: "rgba(16,0,0,0.6)" },
              ].map(s => (
                <div key={s.lbl} style={{ border: `1px solid ${s.border}`, padding: "12px 10px", background: s.bg }}>
                  <div style={{ ...S.statVal, color: s.color }}>{s.val}</div>
                  <div style={S.statLbl}>{s.lbl}</div>
                </div>
              ))}
            </div>
            <div style={S.orBox}>
              <div style={{ ...S.plbl, marginBottom: 8 }}>—— OR SCHEDULE TODAY</div>
              <div style={S.orRow}>
                <div style={{ ...S.orTime, color: "#00e5ff" }}>09:30</div>
                <div style={{ flex: 1 }}>
                  <div style={S.orProc}>LIVER TRANSPLANT</div>
                  <div style={S.orDetail}>OT-2 · IN PROGRESS</div>
                </div>
                <div style={{ fontSize: 9, letterSpacing: 2, padding: "2px 7px", border: "1px solid #00e5ff", color: "#00e5ff", flexShrink: 0 }}>LIVE</div>
              </div>
              <div style={S.orRow}>
                <div style={{ ...S.orTime, color: "#ffaa00" }}>13:00</div>
                <div style={{ flex: 1 }}>
                  <div style={S.orProc}>CARDIAC BYPASS</div>
                  <div style={S.orDetail}>OT-5 · RAJAN MEHTA</div>
                </div>
                <div style={{ fontSize: 9, letterSpacing: 2, padding: "2px 7px", border: "1px solid #ffaa00", color: "#ffaa00", flexShrink: 0 }}>PREP</div>
              </div>
              <div style={S.orRowLast}>
                <div style={{ ...S.orTime, color: "#1a3a4a" }}>16:15</div>
                <div style={{ flex: 1 }}>
                  <div style={{ ...S.orProc, color: "#2a5566" }}>KIDNEY HARVEST</div>
                  <div style={S.orDetail}>OT-1 · DONOR 4421</div>
                </div>
                <div style={{ fontSize: 9, letterSpacing: 2, padding: "2px 7px", border: "1px solid #102030", color: "#1a3a4a", flexShrink: 0 }}>SCHED</div>
              </div>
            </div>
          </div>
        </div>

        {/* FEED SECTION */}
        <div style={S.feedSection}>

          {/* LEFT — DONORS LIST */}
          <div style={S.fpanel}>
            <div style={S.plbl}>—— WILLING DONORS · LIVE GPS DISTANCE</div>
            {donors.map((d, i) => (
              <div key={d.name} style={i === donors.length - 1 ? S.donorItemLast : S.donorItem}>
                <div style={S.pingWrap}>
                  <div style={{ ...S.pingDot, background: d.color }} />
                  <div style={{ ...S.pingRing, border: `1px solid ${d.color}`, animation: `pulse-ring 2s ease-out ${i * 0.3}s infinite` }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={S.dName}>{d.name}</div>
                  <div style={{ fontSize: 10, letterSpacing: 2, color: d.color, marginTop: 2 }}>{d.type}</div>
                  <div style={S.dArea}>{d.area}</div>
                </div>
                <div style={S.dRight}>
                  <div style={{ ...S.dDist, color: d.color }}>{d.dist.toFixed(1)} km</div>
                  <div style={S.dEta}>ETA {Math.round(d.dist * 3.5)} MIN</div>
                  <div style={{ fontSize: 9, letterSpacing: 2, padding: "2px 7px", border: `1px solid ${d.color}`, color: d.color, background: d.badgeBg, marginTop: 5, display: "inline-block" }}>{d.badge}</div>
                </div>
              </div>
            ))}
          </div>

          {/* RIGHT — VIABILITY + NOTIFICATIONS */}
          <div style={S.fpanelLast}>
            <div style={S.plbl}>—— ORGAN VIABILITY WINDOW</div>
            <div style={S.viabTime}>
              {String(viabilityMins).padStart(2, "0")}:{String(viabilitySecs).padStart(2, "0")}
            </div>
            <div style={S.viabSub}>HEART · TIME REMAINING</div>
            <div style={S.viabBg}>
              <div style={{ height: 4, width: `${viabilityPct}%`, background: "linear-gradient(90deg, #00e5ff, #ffaa00)", borderRadius: 2 }} />
            </div>
            <div style={S.viabLabels}><span>0h</span><span>4h MAX</span></div>

            {/* Notif 1 — cyan */}
            <div style={{ ...S.notifBox, border: "1px solid #001e2a" }}>
              <div style={{ position: "absolute", left: 0, top: 0, width: 3, height: "100%", background: "#00e5ff" }} />
              <div style={S.notifLbl}>NEW DONOR NOTIFICATION</div>
              <div style={S.notifText}>PRIYA NAIR registered availability</div>
              <div style={S.notifSub}>O- · 2.1 KM · AIIMS COMPATIBLE</div>
              <div style={{ fontSize: 11, color: "#00e5ff", letterSpacing: 3, marginTop: 6, fontWeight: 700, opacity: pulse ? 1 : 0.1, transition: "opacity 0.4s" }}>● DONOR ONLINE NOW</div>
            </div>

            {/* Notif 2 — amber */}
            <div style={{ ...S.notifBox, border: "1px solid #332200" }}>
              <div style={{ position: "absolute", left: 0, top: 0, width: 3, height: "100%", background: "#ffaa00" }} />
              <div style={S.notifLbl}>GREEN CORRIDOR STATUS</div>
              <div style={S.notifText}>FORTIS → AIIMS · ACTIVE</div>
              <div style={{ fontSize: 10, color: "#00e5ff", letterSpacing: 2, marginTop: 4 }}>● ACTIVE</div>
              <div style={{ fontFamily: "'Orbitron', monospace", fontSize: 14, color: "#ffaa00", letterSpacing: 3, fontWeight: 700, marginTop: 6 }}>ETA 18 MIN</div>
            </div>

            {/* Notif 3 — red */}
            <div style={{ ...S.notifBox, border: "1px solid #2a0000" }}>
              <div style={{ position: "absolute", left: 0, top: 0, width: 3, height: "100%", background: "#ff4444" }} />
              <div style={S.notifLbl}>CRITICAL ALERT</div>
              <div style={{ ...S.notifText, color: "#ff6666" }}>HEART VIABILITY CRITICAL</div>
              <div style={S.notifSub}>RAJAN MEHTA · OT-5 · TIME REMAINING</div>
              <div style={{ fontSize: 11, color: "#ff4444", letterSpacing: 3, marginTop: 6, opacity: pulse ? 1 : 0.1, transition: "opacity 0.3s" }}>● URGENT ATTENTION</div>
            </div>
          </div>
        </div>

        {/* ACTION BAR */}
        <div style={S.actBar}>
          <div style={S.actBtn}>
            <div style={{ width: 46, height: 46, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0, border: "1.5px solid #00e5ff", background: "rgba(0,229,255,0.07)", color: "#00e5ff" }}>+</div>
            <div>
              <div style={S.actSub}>CLINICAL REQUEST</div>
              <div style={S.actMain}>REQUEST ORGAN</div>
            </div>
            <div style={S.actArr}>→</div>
          </div>
          <div style={S.actBtn}>
            <div style={{ width: 46, height: 46, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0, border: "1.5px solid #ffaa00", background: "rgba(255,170,0,0.05)", color: "#ffaa00" }}>✓</div>
            <div>
              <div style={S.actSub}>AUTHORISE TRANSFER</div>
              <div style={S.actMain}>APPROVE MATCH</div>
            </div>
            <div style={S.actArr}>→</div>
          </div>
          <div style={S.actBtnLast}>
            <div style={{ width: 46, height: 46, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0, border: "1.5px solid #102030", background: "rgba(0,15,22,0.5)", color: "#1a3a4a" }}>≡</div>
            <div>
              <div style={S.actSub}>CASE NOTES</div>
              <div style={S.actMain}>ADD REPORT</div>
            </div>
            <div style={S.actArr}>→</div>
          </div>
        </div>

        {/* STATUS BAR */}
        <div style={S.statusbar}>
          <div>
            <div style={S.sname}>DR. AISHA KAPOOR</div>
            <div style={S.pillsRow}>
              {[
                { text: "● SURGEON ACTIVE", bc: "#00e5ff", c: "#00e5ff", bg: "rgba(0,229,255,0.07)" },
                { text: "AIIMS DELHI", bc: "#ffaa00", c: "#ffaa00", bg: "rgba(255,170,0,0.05)" },
                { text: "2 / CASES", bc: "#0a1e28", c: "#1a3a4a", bg: "transparent" },
                { text: "5G CONNECTED", bc: "#00e5ff", c: "#00e5ff", bg: "rgba(0,229,255,0.07)" },
              ].map(p => (
                <div key={p.text} style={{ padding: "3px 9px", fontSize: 9, letterSpacing: 2, border: `1px solid ${p.bc}`, color: p.c, background: p.bg }}>{p.text}</div>
              ))}
            </div>
          </div>
          <div style={S.navRow}>
            {[
              { icon: "○", label: "HOME", active: false },
              { icon: "+", label: "DOCTOR", active: true },
              { icon: "≡", label: "KISAN", active: false },
              { icon: "□", label: "NYAY", active: false },
            ].map(n => (
              <div key={n.label} style={S.navItem}>
                <div style={{ fontSize: 15, color: n.active ? "#00e5ff" : "#0a1e28" }}>{n.icon}</div>
                <div style={{ fontSize: 8, letterSpacing: 2, color: n.active ? "#00e5ff" : "#0a1e28", marginTop: 3 }}>{n.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}