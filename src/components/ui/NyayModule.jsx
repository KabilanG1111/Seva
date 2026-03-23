import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAudio } from '../../hooks/useAudioEngine';

const clauses = [
    { id: 1, type: 'DANGER', text: 'Section 4(b) permits unilateral land possession transfer without 30-day notice.', desc: 'High risk of immediate displacement.' },
    { id: 2, type: 'REVIEW', text: 'Interest rate floats at prime + 4% without established cap.', desc: 'Financial liability risk.' },
    { id: 3, type: 'SAFE', text: 'Arbitration requires neutral third party based in local jurisdiction.', desc: 'Standard fair practice.' }
];

export default function NyayModule({ setActiveModule }) {
    const audio = useAudio();

    useEffect(() => {
        audio.playScan();
    }, [audio]);
    return (
        <div className="flex flex-col h-full bg-bg-deep relative pointer-events-auto">
            {/* Top Gradient Overlay */}
            <div className="absolute top-0 left-0 w-full h-[120px] pointer-events-none" style={{ background: 'linear-gradient(rgba(255,204,0,0.08), transparent)' }} />

            {/* HEADER */}
            <div className="flex justify-between items-center px-4 pt-6 pb-2 z-10">
                <button
                    onClick={() => setActiveModule(null)}
                    className="text-[9px] font-mono text-nyay-primary/50 tracking-[2px] uppercase hover:text-nyay-primary transition-colors"
                >
                    &larr; DHARITRI
                </button>
                <div className="text-[12px] font-mono font-bold text-nyay-primary tracking-[4px]">NYAYPATRA</div>
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-nyay-primary" />
                    <div className="text-[9px] font-mono text-nyay-primary tracking-[1px]">READY</div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto pb-24 px-4 flex flex-col gap-5 z-10 pt-4">

                {/* DOCUMENT SCANNER */}
                <div className="w-full h-[120px] border-[0.5px] border-nyay-primary/20 bg-[#0D0D00] relative overflow-hidden flex flex-col items-center justify-center p-4">
                    {/* Corners */}
                    <div className="absolute top-0 left-0 w-4 h-4 border-t-[1px] border-l-[1px] border-nyay-primary opacity-60" />
                    <div className="absolute top-0 right-0 w-4 h-4 border-t-[1px] border-r-[1px] border-nyay-primary opacity-60" />
                    <div className="absolute bottom-0 left-0 w-4 h-4 border-b-[1px] border-l-[1px] border-nyay-primary opacity-60" />
                    <div className="absolute bottom-0 right-0 w-4 h-4 border-b-[1px] border-r-[1px] border-nyay-primary opacity-60" />

                    {/* Simulated Text Lines */}
                    <div className="w-full flex-1 flex flex-col justify-center gap-[6px]">
                        <div className="w-[85%] h-1 bg-nyay-primary/20 rounded-full" />
                        <div className="w-[90%] h-1 bg-nyay-primary/20 rounded-full" />
                        <div className="w-[70%] h-1 bg-praan-primary/40 rounded-full shadow-[0_0_5px_#FF3D3D]" />
                        <div className="w-[95%] h-1 bg-nyay-primary/20 rounded-full" />
                        <div className="w-[60%] h-1 bg-kisan-primary/30 rounded-full" />
                        <div className="w-[80%] h-1 bg-nyay-primary/20 rounded-full" />
                    </div>

                    {/* Scan Sweep */}
                    <motion.div
                        className="w-full h-[2px] bg-nyay-primary/50 absolute top-0 shadow-[0_0_10px_#FFCC00]"
                        animate={{ top: ['0%', '100%', '0%'] }}
                        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                    />

                    <div className="absolute bottom-2 right-2 text-[9px] font-mono text-nyay-primary">ANALYSIS COMPLETE</div>
                </div>

                {/* LEGEND ROW */}
                <div className="flex justify-between items-center px-2">
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-praan-primary" />
                        <div className="text-[8px] font-mono tracking-[1px] text-white/50">DANGER</div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-nyay-primary" />
                        <div className="text-[8px] font-mono tracking-[1px] text-white/50">REVIEW</div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-kisan-primary" />
                        <div className="text-[8px] font-mono tracking-[1px] text-white/50">SAFE</div>
                    </div>
                </div>

                {/* CLAUSES GRID */}
                <motion.div
                    className="flex flex-col gap-3"
                    initial="hidden"
                    animate="visible"
                    variants={{
                        visible: { transition: { staggerChildren: 0.15 } }
                    }}
                >
                    {clauses.map(clause => {
                        const isDanger = clause.type === 'DANGER';
                        const isSafe = clause.type === 'SAFE';
                        const colorCode = isDanger ? 'praan' : isSafe ? 'kisan' : 'nyay';
                        const hex = isDanger ? '#FF3D3D' : isSafe ? '#00CC66' : '#FFCC00';

                        return (
                            <motion.div
                                key={clause.id}
                                variants={{
                                    hidden: { x: 50, opacity: 0 },
                                    visible: { x: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
                                }}
                                className={`flex gap-3 p-3 rounded-md border-[0.5px] items-start`}
                                style={{
                                    backgroundColor: `${hex}0A`,
                                    borderColor: `${hex}33`
                                }}
                            >
                                <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: hex }} />
                                <div className="flex flex-col gap-1">
                                    <div className="text-[8px] font-mono tracking-[1.5px]" style={{ color: hex }}>CLAUSE 0{clause.id} — {clause.type}</div>
                                    <div className="text-[10px] font-sans text-white/80 leading-snug">{clause.text}</div>
                                    <div className="text-[8px] font-sans mt-0.5" style={{ color: `${hex}aa` }}>{clause.desc}</div>
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>

                {/* AI SPEAK BAR */}
                <div className="flex items-center gap-3 p-3 mt-2 border-[0.5px] border-nyay-primary/20 bg-[#0D0D00] rounded-lg">
                    <div className="text-[14px] text-nyay-primary">◉</div>
                    {/* Marquee effect */}
                    <div className="flex-1 overflow-hidden relative h-3">
                        <motion.div
                            className="absolute whitespace-nowrap text-[9px] font-mono text-nyay-primary tracking-[2px]"
                            animate={{ x: ['100%', '-100%'] }}
                            transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
                        >
                            READING SUMMARY ALOUD... இந்த ஆவணம் ஆபத்தானது...
                        </motion.div>
                    </div>
                    {/* Language Pill */}
                    <div className="px-2 py-0.5 border border-nyay-primary/40 rounded bg-nyay-primary/10 text-[8px] font-mono text-nyay-primary flex items-center gap-1 cursor-pointer">
                        TAMIL <span>▼</span>
                    </div>
                </div>

            </div>
        </div>
    );
}
