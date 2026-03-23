import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Splash = () => {
    const letters = "DHARITRI".split('');
    return (
        <motion.div
            className="absolute inset-0 bg-black z-50 flex flex-col items-center justify-center font-mono pointer-events-auto"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 1 } }}
        >
            <div className="flex">
                {letters.map((L, i) => (
                    <motion.span
                        key={i}
                        className="text-hero text-white"
                        // prompt required: Each letter staggers 80ms
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.08, duration: 0.5 }}
                    >
                        {L}
                    </motion.span>
                ))}
            </div>
            <motion.div
                className="mt-4 text-white/40 text-xl font-sans"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
            >
                धरित्री
            </motion.div>
        </motion.div>
    );
};

const RoleSelection = ({ onNext }) => {
    const [selected, setSelected] = useState([]);

    const toggleRole = (role) => {
        setSelected(prev => prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role]);
    };

    const roles = [
        { id: 'kisan', icon: '✦', title: 'FARMER / KISAN', desc: 'Agriculture & Field Intelligence', color: 'kisan', border: 'border-kisan-border', text: 'text-kisan-primary', bg: 'bg-[#031A0A]' },
        { id: 'patient', icon: '♥', title: 'PATIENT / DONOR', desc: 'Blood & Organ Emergency Network', color: 'praan', border: 'border-praan-border', text: 'text-praan-primary', bg: 'bg-[#0D0208]' },
        { id: 'citizen', icon: '⊖', title: 'CITIZEN / COMMON MAN', desc: 'Legal Rights & Document Intelligence', color: 'nyay', border: 'border-nyay-border', text: 'text-nyay-primary', bg: 'bg-[#0D0D00]' }
    ];

    return (
        <motion.div
            className="absolute inset-0 z-40 bg-black/70 flex flex-col items-center justify-center p-6 text-center pointer-events-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
        >
            <div className="mb-12">
                <div className="text-xl text-white font-mono mb-2">नमस्ते।</div>
                <div className="text-xs text-white/40 tracking-[3px] font-mono">TELL US WHO YOU ARE</div>
            </div>

            <div className="w-full max-w-sm flex flex-col gap-4">
                {roles.map((r, i) => {
                    const isActive = selected.includes(r.id);
                    return (
                        <motion.button
                            key={r.id}
                            onClick={() => toggleRole(r.id)}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.15 + 0.3 }}
                            className={`flex items-center gap-4 p-5 text-left rounded-md transition-all ${r.bg} ${isActive ? `border opacity-100 ${r.border.replace('33', '')}` : 'border opacity-50 border-white/10'}`}
                            style={{ borderWidth: isActive ? '1px' : '0.5px' }}
                        >
                            <div className={`text-2xl ${r.text}`}>{r.icon}</div>
                            <div>
                                <div className="text-base font-mono text-white mb-1">{r.title}</div>
                                <div className="text-sm text-white/40 font-sans normal-case tracking-normal">{r.desc}</div>
                            </div>
                        </motion.button>
                    );
                })}

                <AnimatePresence>
                    {selected.length > 0 && (
                        <motion.button
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: '52px' }}
                            exit={{ opacity: 0, height: 0 }}
                            onClick={() => onNext(selected)}
                            className="mt-6 w-full bg-white/10 border border-white/20 text-white font-mono text-sm tracking-[3px] uppercase rounded-md hover:bg-white/20 transition-all"
                        >
                            CONTINUE &rarr;
                        </motion.button>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

const QuickSetup = ({ onComplete }) => {
    return (
        <motion.div
            className="absolute inset-0 z-40 bg-black/70 flex flex-col items-center justify-center p-6 pointer-events-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
        >
            <div className="w-full max-w-sm flex flex-col gap-6">
                <div className="text-center mb-4">
                    <div className="text-xl font-mono text-white mb-2">QUICK SETUP</div>
                    <div className="text-xs font-mono text-white/40 tracking-[3px]">CALIBRATING YOUR EXPERIENCE</div>
                </div>

                <div className="flex flex-col gap-4">
                    <input className="w-full bg-[#0A0D1A] border-[0.5px] border-white/20 rounded-md p-4 text-white font-mono placeholder-white/20 focus:outline-none focus:border-white/50 transition-colors" placeholder="ENTER SURNAME" />

                    <div className="relative">
                        <input className="w-full bg-[#0A0D1A] border-[0.5px] border-white/20 rounded-md p-4 text-white font-mono placeholder-white/20 focus:outline-none focus:border-white/50 transition-colors" placeholder="LOCATION" defaultValue="TAMIL NADU, INDIA" />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] text-[#00CC66] border border-[#00CC66]/30 px-2 py-0.5 rounded-sm bg-[#00CC66]/10">AUTO</div>
                    </div>

                    <select className="w-full bg-[#0A0D1A] border-[0.5px] border-white/20 rounded-md p-4 text-white font-mono focus:outline-none focus:border-white/50 appearance-none">
                        <option value="" disabled selected className="text-white/20">BLOOD TYPE (PRAAN)</option>
                        <option value="o+">O POSITIVE</option>
                        <option value="o-">O NEGATIVE</option>
                        <option value="a+">A POSITIVE</option>
                    </select>

                    <select className="w-full bg-[#0A0D1A] border-[0.5px] border-white/20 rounded-md p-4 text-white font-mono focus:outline-none focus:border-white/50 appearance-none">
                        <option value="en">ENGLISH</option>
                        <option value="ta">TAMIL</option>
                        <option value="hi">HINDI</option>
                    </select>
                </div>

                <button
                    onClick={onComplete}
                    className="mt-4 w-full h-[52px] bg-transparent border-[0.5px] border-white/40 text-white font-mono text-base tracking-[3px] rounded-md hover:border-white hover:bg-white/5 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)] transition-all"
                >
                    INITIALISE DHARITRI &rarr;
                </button>
            </div>
        </motion.div>
    );
};

export default function Onboarding({ onComplete }) {
    const [step, setStep] = useState(0);

    useEffect(() => {
        if (step === 0) {
            const timer = setTimeout(() => setStep(1), 2500);
            return () => clearTimeout(timer);
        }
    }, [step]);

    return (
        <AnimatePresence mode="wait">
            {step === 0 && <Splash key="splash" />}
            {step === 1 && <RoleSelection key="roles" onNext={() => setStep(2)} />}
            {step === 2 && <QuickSetup key="setup" onComplete={onComplete} />}
        </AnimatePresence>
    );
}
