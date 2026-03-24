import React, { useState } from 'react';
import Scene from './components/Scene';
import Onboarding from './components/ui/Onboarding';
import HomeHUD from './components/ui/HomeHUD';
import ModuleContainer from './components/ui/ModuleContainer';
import PraanDashboard from './components/ui/PraanDashboard';

function App() {
    const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
    const [activeModule, setActiveModule] = useState(null);

    return (
        <div className="w-full h-screen font-sans bg-bg-void overflow-hidden text-white flex justify-center">
            {/* Max screen wrapper for Desktop Center Constraints */}
            <div className="w-full h-full max-w-[1200px] flex flex-col lg:flex-row relative">

                {/* 3D SCENE AREA */}
                <div className={`relative h-full transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${activeModule ? 'w-full lg:w-[40%]' : 'w-full lg:w-full'}`}>
                    <Scene activeModule={activeModule} setActiveModule={setActiveModule} />
                    {hasCompletedOnboarding && (
                        <HomeHUD activeModule={activeModule} />
                    )}
                </div>

                {/* MODULE CONTAINER VIEWPORT */}
                <div className={`h-full transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] lg:relative absolute inset-0 z-30 pointer-events-none lg:w-[60%] lg:pointer-events-auto ${activeModule ? 'block' : 'hidden lg:hidden'}`}>
                    <ModuleContainer activeModule={activeModule} setActiveModule={setActiveModule} />
                </div>
            </div>

            {/* Absolute Universal Splash Overlays */}
            {!hasCompletedOnboarding && (
                <Onboarding onComplete={() => setHasCompletedOnboarding(true)} />
            )}

            {activeModule === 'praan' && (
                <PraanDashboard onBack={() => setActiveModule(null)} />
            )}
        </div>
    );
}

export default App;
