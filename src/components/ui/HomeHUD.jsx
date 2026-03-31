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
                    >
                        <div className="home-bottom">
                            <div className="mission-label">○ MISSION CONTROL · ACTIVE</div>
                            <div className="user-name">ARJUN SHARMA</div>
                            <div className="status-pills">
                                <span className="pill" style={{ color: '#FF3D3D', borderColor: '#FF3D3D44', background: '#FF3D3D11' }}>○ DONOR ACTIVE</span>
                                <span className="pill" style={{ color: '#00CC66', borderColor: '#00CC6644', background: '#00CC6611' }}>2 / FIELDS</span>
                                <span className="pill" style={{ color: '#FFCC00', borderColor: '#FFCC0044', background: '#FFCC0011' }}>1 CASE ACTIVE</span>
                                <span className="pill" style={{ color: '#00AAFF', borderColor: '#00AAFF44', background: '#00AAFF11' }}>5G CONNECTED</span>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
