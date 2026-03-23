import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function HomeHUD({ activeModule }) {
    return (
        <AnimatePresence>
            {!activeModule && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0 z-20 pointer-events-none flex flex-col justify-between"
                >
                    {/* TOP BAR */}
                    <div className="flex justify-between items-center px-6 h-[44px]">
                        <div className="font-mono text-sm text-white/20">05:41</div>
                        <div className="font-mono text-[10px] text-white/40 tracking-[4px]">DHARITRI</div>
                        <div className="font-mono text-[10px] text-[#00FF88]">5G ▓▓▓</div>
                    </div>

                    {/* BOTTOM PANEL */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="absolute bottom-0 w-full h-[160px] pointer-events-auto"
                        style={{
                            background: 'linear-gradient(transparent, #05070F 30%)',
                            padding: '0 20px 32px'
                        }}
                    >
                        <div className="flex flex-col h-full justify-end gap-5">
                            {/* User Greeting */}
                            <div>
                                <div className="text-xs text-white/30 tracking-[3px] font-mono mb-1">MISSION CONTROL — ACTIVE</div>
                                <div className="text-[18px] font-mono font-bold text-white">ARJUN SHARMA</div>
                            </div>

                            {/* Status Pills */}
                            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                                <div className="shrink-0 rounded-[2px] border-[0.5px] py-[3px] px-[8px] bg-praan-glow border-praan-border text-praan-primary font-mono text-[10px] tracking-wide whitespace-nowrap">♥ DONOR ACTIVE</div>
                                <div className="shrink-0 rounded-[2px] border-[0.5px] py-[3px] px-[8px] bg-kisan-glow border-kisan-border text-kisan-primary font-mono text-[10px] tracking-wide whitespace-nowrap">✦ 2 FIELDS</div>
                                <div className="shrink-0 rounded-[2px] border-[0.5px] py-[3px] px-[8px] bg-nyay-glow border-nyay-border text-nyay-primary font-mono text-[10px] tracking-wide whitespace-nowrap">⊖ 1 CASE ACTIVE</div>
                                <div className="shrink-0 rounded-[2px] border-[0.5px] py-[3px] px-[8px] bg-[#00AAFF11] border-[#00AAFF33] text-[#00AAFF] font-mono text-[10px] tracking-wide whitespace-nowrap">◉ 5G CONNECTED</div>
                            </div>

                            {/* Tap Hint */}
                            <motion.div
                                className="text-[8px] text-white/20 tracking-[3px] font-mono text-center uppercase"
                                animate={{ opacity: [0.2, 0.6, 0.2] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            >
                                TAP A PLANET TO ENTER
                            </motion.div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
