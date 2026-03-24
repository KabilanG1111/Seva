import React, { Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
export default function ModuleContainer({ activeModule, setActiveModule }) {

    // Derived configuration
    const config = {
        'praan': null, // Now handled natively as a fullscreen modal in App.jsx
        'kisan': null, // Handled by standalone KisanDashboard
        'nyay': null   // Handled by standalone NyayDashboard
    }[activeModule];

    const variants = {
        hidden: { y: "100%" },
        visible: { y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
    };

    return (
        <AnimatePresence>
            {activeModule && config && (
                <motion.div
                    className="absolute inset-0 z-30 pointer-events-auto bg-[#05070F] lg:bg-transparent flex flex-col overflow-hidden"
                    variants={variants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                >
                    {/* Tablet Layout Max Width Centering Wrapper bounds module */}
                    <div className="relative w-full h-full md:max-w-md md:mx-auto lg:max-w-none lg:mx-0 flex flex-col bg-[#05070F]">
                        {/* Content Payload bounds the scroll */}
                        <div className="relative flex-1 flex flex-col overflow-hidden h-full pb-[64px]">
                            <Suspense fallback={null}>
                                {config.component}
                            </Suspense>
                        </div>

                        {/* BOTTOM NAV (Shared) */}
                        <div className="absolute bottom-0 w-full bg-[#05070F] border-t-[0.5px] border-white/5 flex h-[64px] z-50 pb-[env(safe-area-inset-bottom)]">

                            <button onClick={() => setActiveModule(null)} className="flex-1 flex flex-col items-center justify-center gap-1 opacity-40 hover:opacity-100 transition-opacity min-w-[44px] min-h-[44px]">
                                <div className="text-[18px]">◎</div>
                                <div className="text-[8px] font-mono tracking-[1px]">HOME</div>
                            </button>

                            <button onClick={() => setActiveModule('praan')} className={`flex-1 flex flex-col items-center justify-center gap-1 transition-colors min-w-[44px] min-h-[44px] ${activeModule === 'praan' ? 'text-praan-primary' : 'text-white/20 hover:text-white/60'}`}>
                                <div className="text-[18px]">♥</div>
                                <div className="text-[8px] font-mono tracking-[1px]">PRAAN</div>
                            </button>

                            <button onClick={() => setActiveModule('kisan')} className={`flex-1 flex flex-col items-center justify-center gap-1 transition-colors min-w-[44px] min-h-[44px] ${activeModule === 'kisan' ? 'text-kisan-primary' : 'text-white/20 hover:text-white/60'}`}>
                                <div className="text-[18px]">✦</div>
                                <div className="text-[8px] font-mono tracking-[1px]">KISAN</div>
                            </button>

                            <button onClick={() => setActiveModule('nyay')} className={`flex-1 flex flex-col items-center justify-center gap-1 transition-colors min-w-[44px] min-h-[44px] ${activeModule === 'nyay' ? 'text-nyay-primary' : 'text-white/20 hover:text-white/60'}`}>
                                <div className="text-[18px]">⊖</div>
                                <div className="text-[8px] font-mono tracking-[1px]">NYAY</div>
                            </button>

                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
