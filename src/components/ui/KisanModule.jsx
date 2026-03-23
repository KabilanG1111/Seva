import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useKisanData } from '../../hooks/useLiveData';

export default function KisanModule({ setActiveModule }) {
    const { moisture, price, diseaseProb, temp } = useKisanData();
    return (
        <div className="flex flex-col h-full bg-bg-deep relative pointer-events-auto">
            {/* Top Gradient Overlay */}
            <div className="absolute top-0 left-0 w-full h-[120px] pointer-events-none" style={{ background: 'linear-gradient(rgba(0,204,102,0.08), transparent)' }} />

            {/* HEADER */}
            <div className="flex justify-between items-center px-4 pt-6 pb-2 z-10">
                <button
                    onClick={() => setActiveModule(null)}
                    className="text-[9px] font-mono text-kisan-primary/50 tracking-[2px] uppercase hover:text-kisan-primary transition-colors"
                >
                    &larr; DHARITRI
                </button>
                <div className="text-[12px] font-mono font-bold text-kisan-primary tracking-[4px]">KISAN NADI</div>
                <div className="flex items-center gap-2">
                    <motion.div
                        className="w-1.5 h-1.5 rounded-full bg-kisan-primary"
                        animate={{ opacity: [1, 0, 1] }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    />
                    <div className="text-[9px] font-mono text-kisan-primary tracking-[1px]">SCANNING</div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto pb-24 px-4 flex flex-col gap-6 z-10 pt-4">

                {/* FIELD INTELLIGENCE VISUALIZER */}
                <div className="w-full h-[100px] border-[0.5px] border-kisan-primary/20 bg-[#031A0A] rounded-lg relative overflow-hidden" style={{
                    backgroundImage: 'linear-gradient(rgba(0,204,102,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(0,204,102,0.08) 1px, transparent 1px)',
                    backgroundSize: '16px 16px'
                }}>
                    {/* Zones */}
                    <div className="absolute top-2 left-2 w-24 h-16 bg-kisan-primary/10 border-[0.5px] border-kisan-primary/40 flex items-center justify-center">
                        <span className="text-[8px] font-mono text-kisan-primary tracking-[1px]">HEALTHY</span>
                    </div>
                    <div className="absolute top-8 right-12 w-20 h-10 bg-praan-primary/10 border-[0.5px] border-praan-primary/50 flex items-center justify-center">
                        <span className="text-[8px] font-mono text-praan-primary tracking-[1px]">RISK</span>
                    </div>

                    {/* Horizontal Scan Line */}
                    <div className="w-full h-[1px] bg-kisan-primary/30 absolute left-0 shadow-[0_0_8px_#00CC66] scan-line">
                        {/* Moving Scan Dot */}
                        <motion.div
                            className="w-1 h-1 bg-kisan-primary rounded-full absolute top-[-1.5px] shadow-[0_0_10px_#00CC66]"
                            animate={{ left: ['0%', '100%', '0%'] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        />
                    </div>

                    <div className="absolute bottom-1 right-2 text-[7px] text-kisan-primary/30 font-mono">5G DRONE SCAN LIVE</div>
                </div>

                {/* INTELLIGENCE GRID */}
                <div className="flex justify-between items-center border-[0.5px] border-kisan-primary/20 bg-[#0A0D1A] rounded-lg p-3">
                    <div className="flex flex-col items-center">
                        <div className="text-[8px] font-mono text-kisan-primary/50 tracking-[1px]">SOIL MOISTURE</div>
                        <div className="text-[16px] font-mono font-bold text-kisan-primary">{moisture}%</div>
                    </div>
                    <div className="w-[1px] h-8 bg-white/5" />
                    <div className="flex flex-col items-center">
                        <div className="text-[8px] font-mono text-nyay-primary/50 tracking-[1px]">DISEASE PROB</div>
                        <div className="text-[16px] font-mono font-bold text-nyay-primary">{diseaseProb}%</div>
                    </div>
                    <div className="w-[1px] h-8 bg-white/5" />
                    <div className="flex flex-col items-center">
                        <div className="text-[8px] font-mono text-[#00AAFF]/50 tracking-[1px]">FIELD TEMP</div>
                        <div className="text-[16px] font-mono font-bold text-[#00AAFF]">{temp}°C</div>
                    </div>
                </div>

                {/* ALERT CARD */}
                <div className="bg-[#0D1A08] border-[0.5px] border-kisan-primary/30 rounded-r-lg relative overflow-hidden pl-4 pr-3 py-3">
                    <div className="absolute top-0 left-0 bottom-0 w-[2px] bg-kisan-primary" />
                    <div className="text-[8px] font-mono text-kisan-primary tracking-[2px] mb-1">⚠ PRE-SYMPTOMATIC DETECTION</div>
                    <div className="text-[10px] font-sans text-kisan-primary/80 leading-relaxed mb-2">
                        Spectral imaging indicates early-stage leaf blight in Sector 4. Immediate intervention recommended to prevent 15% yield loss.
                    </div>
                    <div className="h-[0.5px] w-full bg-kisan-primary/10 mb-2" />
                    <div className="text-[9px] font-mono text-kisan-primary">ACTION: APPLY FUNGICIDE (DOSAGE 0.2L/Acre)</div>
                </div>

                {/* VOICE STRIP */}
                <div className="flex items-center gap-3 p-3 border-[0.5px] border-kisan-primary/20 bg-[#0A0D1A] rounded-lg">
                    <div className="w-6 h-6 rounded-full bg-kisan-primary/10 flex items-center justify-center shadow-[0_0_8px_rgba(0,204,102,0.2)]">
                        <div className="text-[10px] text-kisan-primary">◉</div>
                    </div>
                    {/* Marquee effect */}
                    <div className="flex-1 overflow-hidden relative h-3">
                        <motion.div
                            className="absolute whitespace-nowrap text-[9px] font-mono text-kisan-primary tracking-[2px]"
                            animate={{ x: ['100%', '-100%'] }}
                            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                        >
                            SPEAKING IN MARATHI... पिकांवर लवकर उपचार करा...
                        </motion.div>
                    </div>
                    {/* Audio Waveforms */}
                    <div className="flex items-center gap-[2px] h-4">
                        {[0.4, 0.6, 0.8, 0.5, 0.7].map((dur, i) => (
                            <motion.div
                                key={i}
                                className="w-1 bg-kisan-primary"
                                animate={{ height: ['4px', '16px', '6px', '12px', '4px'] }}
                                transition={{ duration: dur, repeat: Infinity, ease: 'easeInOut' }}
                            />
                        ))}
                    </div>
                </div>

                {/* MANDI INTELLIGENCE BAR */}
                <div className="w-full h-[36px] bg-[#031A0A] rounded-lg border-[0.5px] border-white/5 flex items-center justify-between px-3">
                    <div className="text-[9px] font-mono text-white/40 tracking-[2px]">MANDI INTEL</div>
                    <div className="text-[14px] font-mono font-bold text-white">₹{price.toLocaleString()}/Q</div>
                    <div className="text-[9px] font-mono text-kisan-primary tracking-[1px]">↑ HOLD 12 DAYS</div>
                </div>

            </div>
        </div>
    );
}
