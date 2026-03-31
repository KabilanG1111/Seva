import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePraanData } from '../../hooks/useLiveData';
import { useAudio } from '../../hooks/useAudioEngine';
import PraanDoctorDashboard from './PraanDoctorDashboard';

// Simple counter hook for static matched numbers
function useCounter(endValue, duration = 2) {
    const [count, setCount] = useState(0);
    useEffect(() => {
        let start = 0;
        const incr = endValue / (duration * 60);
        const timer = setInterval(() => {
            start += incr;
            if (start >= endValue) {
                setCount(endValue);
                clearInterval(timer);
            } else {
                setCount(Math.floor(start));
            }
        }, 1000 / 60);
        return () => clearInterval(timer);
    }, [endValue, duration]);
    return count;
}

export default function PraanModule({ setActiveModule }) {
    const [mode, setMode] = useState("patient");
    const { donorCount, activeRequests, feedItems, formattedTime } = usePraanData();
    const audio = useAudio();
    const matched = useCounter(3, 1);

    useEffect(() => {
        try {
            const hbt = setInterval(() => {
                if (audio?.playHeartbeat) audio.playHeartbeat();
            }, 1200);
            return () => clearInterval(hbt);
        } catch (e) {
            console.error("Interval error:", e);
        }
    }, [audio]);

    if (mode === "doctor") {
        return <PraanDoctorDashboard onBack={() => setMode("patient")} />;
    }

    return (
        <div className="flex flex-col h-full bg-bg-deep relative pointer-events-auto">

            {/* Top Gradient Overlay */}
            <div className="absolute top-0 left-0 w-full h-[120px] pointer-events-none" style={{ background: 'linear-gradient(rgba(255,61,61,0.08), transparent)' }} />

            {/* HEADER */}
            <div className="flex justify-between items-center px-4 pt-6 pb-2 z-10">
                <button
                    onClick={() => setActiveModule(null)}
                    className="text-[9px] font-mono text-praan-primary/50 tracking-[2px] uppercase hover:text-praan-primary"
                >
                    &larr; DHARITRI
                </button>
                <div className="text-[12px] font-mono font-bold text-praan-primary tracking-[4px]">PRAAN</div>
                <div className="flex items-center gap-2">
                    <button 
                        onClick={() => setMode("doctor")} 
                        className="text-[10px] bg-[#1A0505] border border-praan-primary/40 px-2 py-1 rounded text-praan-primary font-mono mr-2 hover:bg-[#3D0000] transition-colors"
                    >
                        Switch to Doctor Mode
                    </button>
                    <div className="w-1.5 h-1.5 rounded-full bg-praan-primary pulse-dot" />
                    <div className="text-[9px] font-mono text-praan-primary tracking-[1px]">LIVE</div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto pb-24 px-4 flex flex-col gap-6 z-10 pt-4">

                {/* HEARTBEAT VISUALIZER */}
                <div className="w-full h-[48px] relative">
                    {/* Faded historical track */}
                    <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 400 50">
                        <path
                            d="M0,25 L150,25 L160,10 L175,45 L190,5 L200,25 L400,25"
                            fill="none" stroke="var(--praan-primary)" strokeWidth="1.5" strokeOpacity="0.2"
                        />
                    </svg>
                    {/* Animated live track */}
                    <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 400 50">
                        <path className="heartbeat-path"
                            d="M0,25 L150,25 L160,10 L175,45 L190,5 L200,25 L400,25"
                            fill="none" stroke="var(--praan-primary)" strokeWidth="1.5"
                        />
                    </svg>
                </div>

                {/* VITAL STATS GRID */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-[#0D0208] border-[0.5px] border-praan-primary/20 rounded-lg">
                        <div className="text-[8px] font-mono text-praan-primary/50 tracking-[2px] uppercase mb-1">LIVE DONORS</div>
                        <div className="text-[20px] font-mono font-bold text-praan-primary">{donorCount.toLocaleString()}</div>
                        <div className="text-[9px] font-sans text-praan-primary/60 tracking-[1px] mt-1">IN 10KM RADIUS</div>
                    </div>
                    <div className="p-3 bg-[#0D0208] border-[0.5px] border-praan-primary/20 rounded-lg">
                        <div className="text-[8px] font-mono text-praan-primary/50 tracking-[2px] uppercase mb-1">ACTIVE REQUESTS</div>
                        <div className="text-[20px] font-mono font-bold text-praan-primary">{activeRequests}</div>
                        <div className="text-[9px] font-sans text-praan-primary/60 tracking-[1px] mt-1">CRITICAL NOW</div>
                    </div>
                    <div className="p-3 bg-[#0D0208] border-[0.5px] border-praan-primary/20 rounded-lg">
                        <div className="text-[8px] font-mono text-praan-primary/50 tracking-[2px] uppercase mb-1">ORGANS MATCHED</div>
                        <div className="text-[20px] font-mono font-bold text-praan-primary">0{matched}</div>
                        <div className="text-[9px] font-sans text-praan-primary/60 tracking-[1px] mt-1">THIS WEEK</div>
                    </div>
                    <div className="p-3 bg-[#0D0208] border-[0.5px] border-praan-primary/20 rounded-lg">
                        <div className="text-[8px] font-mono text-praan-primary/50 tracking-[2px] uppercase mb-1">YOUR BLOOD TYPE</div>
                        <div className="text-[20px] font-mono font-bold text-praan-primary">O+</div>
                        <div className="text-[9px] font-sans text-praan-primary/60 tracking-[1px] mt-1">DONOR: ACTIVE</div>
                    </div>
                </div>

                {/* SOS ACTION ZONE */}
                <div className="flex gap-3">
                    <button className="flex-1 h-[72px] bg-[#1A0505] border border-praan-primary/40 rounded-lg flex flex-col items-center justify-center gap-1 active:bg-[#3D0000] transition-colors relative group overflow-hidden">
                        <div className="text-[22px] text-praan-primary group-active:scale-110 transition-transform">♥</div>
                        <div className="text-[10px] font-mono text-praan-primary tracking-[2px]">NEED BLOOD</div>
                        <div className="text-[8px] font-sans text-praan-primary/50">EMERGENCY REQUEST</div>
                    </button>
                    <button className="flex-1 h-[72px] bg-[#031A0A] border border-kisan-primary/40 rounded-lg flex flex-col items-center justify-center gap-1 active:bg-[#003D1A] transition-colors">
                        <div className="text-[22px] text-kisan-primary">◎</div>
                        <div className="text-[10px] font-mono text-kisan-primary tracking-[2px]">DONATE NOW</div>
                        <div className="text-[8px] font-sans text-kisan-primary/50">I AM AVAILABLE</div>
                    </button>
                </div>

                {/* LIVE FEED */}
                <div>
                    <div className="text-[8px] font-mono text-white/20 tracking-[3px] uppercase mb-4">LIVE FEED — NEARBY</div>
                    <div className="flex flex-col">
                        <AnimatePresence initial={false}>
                            {feedItems.map((item) => (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 20 }}
                                    className="flex items-center gap-3 py-3 border-b border-white/5"
                                >
                                    <div className={`w-1.5 h-1.5 rounded-full ${item.type === 'ORGAN' ? 'bg-nyay-primary' : 'bg-praan-primary'}`} />
                                    <div className="flex-1 text-[11px] font-mono text-white/80">{item.type} {item.group} — {item.location}</div>
                                    <div className="text-[9px] font-sans text-white/30">NOW</div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>

                {/* ORGAN TRANSPORT TRACKER */}
                <div className="p-4 bg-[#0A0D1A] border-[0.5px] border-praan-primary/30 rounded-lg mt-2 relative overflow-hidden">
                    <motion.div
                        className="absolute inset-0 bg-praan-primary/5 pointer-events-none"
                        animate={{ opacity: [0, 0.5, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    />
                    <div className="text-[8px] font-mono text-praan-primary/60 tracking-[2px] uppercase mb-2">HEART VIABILITY WINDOW</div>
                    <div className="text-[28px] font-mono font-bold text-praan-primary">{formattedTime}</div>
                    <div className="w-full h-1 bg-white/10 mt-3 rounded-full overflow-hidden">
                        <div className="h-full bg-praan-primary w-[35%]" />
                    </div>
                </div>

            </div>
        </div>
    );
}
