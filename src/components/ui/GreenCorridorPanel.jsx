import React, { useState, useEffect } from "react";

function GreenCorridorPanel() {
  const [collapsed, setCollapsed] = useState(false);
  const [activeSignals, setActiveSignals] = useState(0);
  const [timeLeft, setTimeLeft] = useState(219); // 3:39

  useEffect(() => {
    if (activeSignals < 5) {
      const interval = setInterval(() => {
        setActiveSignals(prev => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [activeSignals]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const mins = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${hrs}:${mins}:${secs}`;
  };

  const statusLogs = [
    { text: "Green corridor activated", time: "00:01" },
    { text: "Route optimized via AI", time: "00:02" },
    { text: "Ambulance dispatched", time: "00:03" },
    { text: "In transit to AIIMS", time: "00:05" }
  ];

  const signalNodes = [0, 1, 2, 3, 4];

  return (
    <div
      style={{
        position: "fixed",
        right: 0,
        top: 0,
        width: collapsed ? "70px" : "320px",
        height: "100vh",
        background: "#0a0000",
        borderLeft: "3px solid #ff3333",
        boxShadow: `inset -10px 0 30px rgba(255, 51, 51, 0.1), 0 0 20px rgba(255, 51, 51, 0.3)`,
        zIndex: 99999,
        color: "white",
        display: "flex",
        flexDirection: "column",
        transition: "width 0.3s ease",
        overflow: "hidden",
        fontFamily: "'Share Tech Mono', monospace",
        padding: 0
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Share+Tech+Mono&display=swap');
        
        @keyframes signalGlow {
          0%, 100% { background: #00ff00; box-shadow: 0 0 10px #00ff00; }
          50% { background: #00cc00; box-shadow: 0 0 20px #00ff00; }
        }
        
        @keyframes timerPulse {
          0%, 100% { box-shadow: 0 0 15px rgba(255, 51, 51, 0.6), inset 0 0 20px rgba(255, 51, 51, 0.2); }
          50% { box-shadow: 0 0 30px rgba(255, 51, 51, 1), inset 0 0 20px rgba(255, 51, 51, 0.4); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>

      {/* HEADER */}
      <div
        style={{
          padding: collapsed ? "12px 8px" : "20px",
          borderBottom: "1px solid #330000",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        {!collapsed && (
          <div>
            <div
              style={{
                fontSize: "16px",
                fontWeight: "700",
                color: "#ff3333",
                letterSpacing: "3px",
                fontFamily: "'Orbitron', sans-serif"
              }}
            >
              GREEN
            </div>
            <div
              style={{
                fontSize: "13px",
                fontWeight: "700",
                color: "#ff3333",
                letterSpacing: "3px",
                fontFamily: "'Orbitron', sans-serif"
              }}
            >
              CORRIDOR
            </div>
            <div
              style={{
                fontSize: "9px",
                color: "#666",
                letterSpacing: "2px",
                marginTop: "4px"
              }}
            >
              AI TRANSPORT
            </div>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{
            background: "transparent",
            border: "1px solid #ff3333",
            color: "#ff3333",
            width: "32px",
            height: "32px",
            cursor: "pointer",
            fontSize: "16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.2s",
            marginLeft: collapsed ? "-4px" : "0"
          }}
          onMouseEnter={(e) => {
            e.target.style.background = "rgba(255, 51, 51, 0.2)";
            e.target.style.boxShadow = "0 0 10px rgba(255, 51, 51, 0.5)";
          }}
          onMouseLeave={(e) => {
            e.target.style.background = "transparent";
            e.target.style.boxShadow = "none";
          }}
        >
          {collapsed ? "→" : "←"}
        </button>
      </div>

      {/* ROUTE VISUALIZATION */}
      {!collapsed && (
        <div style={{ padding: "20px", borderBottom: "1px solid #330000" }}>
          <div
            style={{
              fontSize: "9px",
              color: "#666",
              letterSpacing: "2px",
              marginBottom: "12px"
            }}
          >
            ROUTE SEQUENCE
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
            <span style={{ fontSize: "10px", color: "#aaa" }}>FORTIS</span>
            {signalNodes.map((node) => (
              <div
                key={node}
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: node < activeSignals ? "#00ff00" : "#333",
                  boxShadow: node < activeSignals ? "0 0 10px #00ff00" : "none",
                  animation: node < activeSignals ? "signalGlow 1.5s infinite" : "none",
                  flex: 1
                }}
              />
            ))}
            <span style={{ fontSize: "10px", color: "#aaa" }}>AIIMS</span>
          </div>
          <div style={{ fontSize: "8px", color: "#555", textAlign: "center" }}>
            {activeSignals}/5 SIGNALS ACTIVE
          </div>
        </div>
      )}

      {/* TIMER / VIABILITY */}
      <div
        style={{
          padding: collapsed ? "16px 8px" : "20px",
          borderBottom: "1px solid #330000",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "8px"
        }}
      >
        {!collapsed && (
          <div
            style={{
              fontSize: "8px",
              color: "#666",
              letterSpacing: "2px"
            }}
          >
            VIABILITY TIME LEFT
          </div>
        )}
        <div
          style={{
            width: collapsed ? "50px" : "100%",
            aspectRatio: "1",
            borderRadius: "50%",
            border: "2px solid #ff3333",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: collapsed ? "14px" : "20px",
            color: "#ff3333",
            fontWeight: "700",
            letterSpacing: "2px",
            fontFamily: "'Orbitron', sans-serif",
            animation: "timerPulse 2s infinite",
            boxShadow: "0 0 15px rgba(255, 51, 51, 0.6), inset 0 0 20px rgba(255, 51, 51, 0.2)"
          }}
        >
          {collapsed ? "⏱" : formatTime(timeLeft)}
        </div>
      </div>

      {/* STATUS LOG */}
      {!collapsed && (
        <div style={{ padding: "20px", borderBottom: "1px solid #330000", flex: 1, overflowY: "auto" }}>
          <div
            style={{
              fontSize: "9px",
              color: "#666",
              letterSpacing: "2px",
              marginBottom: "12px"
            }}
          >
            STATUS LOG
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {statusLogs.map((log, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  gap: "8px",
                  fontSize: "9px",
                  color: "#aaa",
                  animation: `fadeIn 0.5s ease forwards`,
                  animationDelay: `${idx * 0.2}s`,
                  opacity: 0
                }}
              >
                <div
                  style={{
                    width: "4px",
                    height: "4px",
                    borderRadius: "50%",
                    background: "#00ff00",
                    marginTop: "3px",
                    flexShrink: 0
                  }}
                />
                <div>
                  <div>{log.text}</div>
                  <div style={{ color: "#555", marginTop: "2px" }}>{log.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* METRICS */}
      {!collapsed && (
        <div style={{ padding: "20px", borderBottom: "1px solid #330000" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <div style={{ fontSize: "8px", color: "#666", letterSpacing: "1px" }}>DISTANCE</div>
              <div
                style={{
                  fontSize: "18px",
                  fontWeight: "700",
                  color: "#ff3333",
                  fontFamily: "'Orbitron', sans-serif"
                }}
              >
                2.1 km
              </div>
            </div>
            <div>
              <div style={{ fontSize: "8px", color: "#666", letterSpacing: "1px" }}>ETA</div>
              <div
                style={{
                  fontSize: "18px",
                  fontWeight: "700",
                  color: "#00ff00",
                  fontFamily: "'Orbitron', sans-serif"
                }}
              >
                18 min
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER / STATUS */}
      {!collapsed && (
        <div style={{ padding: "16px 20px", borderTop: "1px solid #330000" }}>
          <div
            style={{
              fontSize: "8px",
              color: "#666",
              letterSpacing: "2px",
              marginBottom: "8px"
            }}
          >
            AMBULANCE ID
          </div>
          <div
            style={{
              fontSize: "12px",
              fontWeight: "700",
              color: "#fff",
              fontFamily: "'Orbitron', sans-serif",
              letterSpacing: "1px",
              marginBottom: "12px"
            }}
          >
            AMB-0847
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "9px"
            }}
          >
            <div
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: "#00ff00",
                animation: "signalGlow 1.5s infinite"
              }}
            />
            <span style={{ color: "#00ff00" }}>IN TRANSIT</span>
          </div>
        </div>
      )}

      {/* COLLAPSED MODE ICONS */}
      {collapsed && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "16px",
            padding: "12px 8px",
            flex: 1
          }}
        >
          <div
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: "#ff3333",
              boxShadow: "0 0 10px rgba(255, 51, 51, 0.6)"
            }}
          />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "4px",
              alignItems: "center"
            }}
          >
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                style={{
                  width: "4px",
                  height: "4px",
                  borderRadius: "50%",
                  background: i < activeSignals ? "#00ff00" : "#333",
                  boxShadow: i < activeSignals ? "0 0 6px #00ff00" : "none"
                }}
              />
            ))}
          </div>
          <div
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: "#00ff00",
              animation: "signalGlow 1.5s infinite"
            }}
          />
        </div>
      )}
    </div>
  );
}

export default GreenCorridorPanel;