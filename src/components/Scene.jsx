import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, Effects } from '@react-three/drei';
import { UnrealBloomPass } from 'three-stdlib';
import { extend } from '@react-three/fiber';

extend({ UnrealBloomPass });
import gsap from 'gsap';

import StarField from './StarField';
import Sun from './Sun';
import Planet from './Planet';
import AmbientParticles from './AmbientParticles';

const CameraEntryAnimation = () => {
    const { camera } = useThree();
    useEffect(() => {
        camera.position.set(0, 8, 2);
        camera.lookAt(0, 0, 0);

        gsap.to(camera.position, {
            x: 0,
            y: 2.2,
            z: 6.5,
            duration: 3,
            ease: "power2.inOut",
            delay: 2.5
        });
    }, [camera]);
    return null;
};

const CameraController = ({ isZoomed }) => {
    const { camera } = useThree();
    const mouse = useRef({ x: 0.5, y: 0.5 });
    const device = useRef({ beta: 0, gamma: 0 });

    useEffect(() => {
        const onMouseMove = (e) => {
            mouse.current.x = (e.clientX / window.innerWidth);
            mouse.current.y = (e.clientY / window.innerHeight);
        };
        window.addEventListener('mousemove', onMouseMove);

        const onDeviceOrientation = (e) => {
            if (e.beta && e.gamma) {
                device.current.beta = e.beta;
                device.current.gamma = e.gamma;
            }
        };
        window.addEventListener('deviceorientation', onDeviceOrientation);

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('deviceorientation', onDeviceOrientation);
        };
    }, []);

    useFrame(() => {
        if (!isZoomed) {
            const targetY = -(mouse.current.x - 0.5) * 0.1 + (device.current.gamma * 0.001);
            const targetX = -(mouse.current.y - 0.5) * 0.05 + (device.current.beta * 0.001);

            camera.rotation.y += (targetY - camera.rotation.y) * 0.05;
            camera.rotation.x += (targetX - camera.rotation.x) * 0.05;
        }
    });
    return null;
};

const PLANETS_DATA = [
    {
        id: 'praan',
        color: '#3D0000',
        emissiveColor: '#FF3D3D',
        radius: 0.18,
        orbitRadius: 1.2,
        orbitSpeed: 0.008,
        initialAngle: 0.8,
        labelTitle: '♥ PRAAN',
        labelData: '14 ACTIVE REQUESTS',
        labelData2: 'O+ NEEDED — 0.8KM',
        ringOpacity: 0.08,
        ringTorusProps: [1.2, 0.004, 8, 128],
        orbitTilt: 0.08
    },
    {
        id: 'kisan',
        color: '#003D1A',
        emissiveColor: '#00CC66',
        radius: 0.15,
        orbitRadius: 1.9,
        orbitSpeed: 0.005,
        initialAngle: 2.5,
        labelTitle: '✦ KISAN NADI',
        labelData: '2 FIELDS MONITORED',
        labelData2: 'DISEASE ALERT ACTIVE',
        ringOpacity: 0.06,
        ringTorusProps: [1.9, 0.004, 8, 128],
        orbitTilt: -0.06
    },
    {
        id: 'nyay',
        color: '#3D3000',
        emissiveColor: '#FFCC00',
        radius: 0.13,
        orbitRadius: 2.5,
        orbitSpeed: 0.003,
        initialAngle: 4.2,
        labelTitle: '⊖ NYAYPATRA',
        labelData: '1 DOCUMENT SCANNED',
        labelData2: '3 DANGER CLAUSES',
        ringOpacity: 0.05,
        ringTorusProps: [2.5, 0.004, 8, 128],
        orbitTilt: 0.12
    }
];

export default function Scene() {
    const [selectedWidget, setSelectedWidget] = useState(null);
    const [flashData, setFlashData] = useState({ color: '#000', opacity: 0 });
    const [clickedPlanetId, setClickedPlanetId] = useState(null);
    const controlsRef = useRef();

    useEffect(() => {
        // Add premium vignette programmatically to bypass HTML edits
        const flashEl = document.getElementById('flash-overlay');
        if (!flashEl) return;
    }, []);

    const resetCamera = () => {
        const pData = PLANETS_DATA.find(p => p.id === selectedWidget);
        if (!pData) return;

        // Reverse flash
        setFlashData({ color: pData.emissiveColor, opacity: 1 });

        setTimeout(() => {
            setSelectedWidget(null);
            setClickedPlanetId(null);
            document.dispatchEvent(new CustomEvent('triggerCameraReset'));

            // fade out overlay
            setFlashData(prev => ({ ...prev, opacity: 0 }));
        }, 300);
    };

    return (
        <div className="w-full h-screen relative bg-[#050505] overflow-hidden">
            <div className="premium-vignette"></div>

            {/* Top Left Header */}
            <div className="absolute top-0 left-0 w-full p-8 z-10 pointer-events-none holo-text">
                <h1 className="text-2xl font-mono font-bold tracking-[0.3em] text-white/90">DHARITRI</h1>
            </div>

            <Canvas
                camera={{ position: [0, 8, 2], fov: 60 }}
                style={{ opacity: selectedWidget ? 0.05 : 1, transition: 'opacity 1s ease', width: '100%', height: '100%', display: 'block' }}
                gl={{
                    antialias: true,
                    alpha: true,
                    powerPreference: "high-performance",
                    precision: "highp"
                }}
                shadows={false}
            >
                <color attach="background" args={['#050505']} />

                <pointLight color={0xFFF0CC} intensity={4.0} distance={20} position={[0, 0, 0]} />
                <ambientLight color={0x111122} intensity={0.4} />
                <directionalLight color={0x4444FF} intensity={0.3} position={[-5, 3, -5]} />

                <CameraEntryAnimation />
                <CameraController isZoomed={!!selectedWidget} />
                <StarField />
                <AmbientParticles />
                <Sun />

                {PLANETS_DATA.map((data) => (
                    <group key={data.id} rotation={[0, 0, data.orbitTilt]}>
                        {/* The orbit ring */}
                        <mesh rotation={[Math.PI / 2, 0, 0]}>
                            <torusGeometry args={data.ringTorusProps} />
                            <meshBasicMaterial color={data.emissiveColor} transparent opacity={selectedWidget || clickedPlanetId ? 0.02 : data.ringOpacity} />
                        </mesh>
                        <PlanetWrapper
                            data={data}
                            onZoom={(id) => setSelectedWidget(id)}
                            controlsRef={controlsRef}
                            isDimmed={clickedPlanetId && clickedPlanetId !== data.id}
                            isClicked={clickedPlanetId === data.id}
                            setClickedPlanetId={setClickedPlanetId}
                            setFlashData={setFlashData}
                        />
                    </group>
                ))}

                <Effects disableGamma>
                    <unrealBloomPass threshold={0.15} strength={0.6} radius={0.8} />
                </Effects>

                <OrbitControls
                    ref={controlsRef}
                    enablePan={false}
                    enableZoom={!selectedWidget}
                    enableRotate={!selectedWidget}
                    dampingFactor={0.05}
                />
                <CameraResetHandler controlsRef={controlsRef} />
            </Canvas>

            {/* Home screen bottom UI */}
            <div className={`absolute bottom-8 w-full px-12 z-10 pointer-events-none transition-opacity duration-500 flex justify-between items-end ${selectedWidget || clickedPlanetId ? 'opacity-0' : 'opacity-100'}`}>
                <div>
                    <div className="text-[8px] font-mono tracking-[3px] text-white/40 mb-2 uppercase">Location: Chennai, Tamil Nadu</div>
                    <div className="text-white font-mono tracking-[0.2em] font-medium animate-pulse">CITIZEN.048X</div>
                </div>

                {/* Status Pills */}
                <div className="flex gap-4 relative overflow-hidden pb-1">
                    {/* Radar sweep effect */}
                    <div className="absolute inset-0 w-8 h-full bg-white/15 blur-md -skew-x-12 animate-[sweep_6s_infinite_linear]"></div>

                    <div className="px-4 py-1.5 border border-white/10 rounded-full bg-white/5 backdrop-blur-md text-[10px] text-white/70 font-mono tracking-widest uppercase">Network: Secure</div>
                    <div className="px-4 py-1.5 border border-[#00CC66]/40 rounded-full bg-[#00CC66]/10 backdrop-blur-md text-[10px] text-[#00CC66] font-mono tracking-widest uppercase shadow-[0_0_10px_rgba(0,204,102,0.2)]">Modules: Online</div>
                </div>
            </div>

            {/* Flash transition layer */}
            <div
                id="flash-overlay"
                className="fixed inset-0 z-20 pointer-events-none transition-opacity"
                style={{
                    backgroundColor: flashData.color,
                    opacity: flashData.opacity,
                    transitionDuration: '300ms'
                }}
            />

            {/* Module Screen Interface Overlays */}
            <div
                className={`absolute inset-0 z-30 transition-opacity duration-700 ${selectedWidget ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
            >
                {/* Module specific Blurred Background element */}
                {selectedWidget && (
                    <div className="absolute -top-20 -right-20 w-[400px] h-[400px] rounded-full blur-[80px]" style={{ backgroundColor: PLANETS_DATA.find(p => p.id === selectedWidget).emissiveColor, opacity: 0.04 }}></div>
                )}

                {/* Tech Grid */}
                <div className="absolute inset-0 opacity-[0.03]" style={{
                    backgroundImage: `linear-gradient(${selectedWidget ? PLANETS_DATA.find(p => p.id === selectedWidget).emissiveColor : 'white'} 1px, transparent 1px), linear-gradient(90deg, ${selectedWidget ? PLANETS_DATA.find(p => p.id === selectedWidget).emissiveColor : 'white'} 1px, transparent 1px)`,
                    backgroundSize: '40px 40px'
                }}></div>

                <div className="relative h-full flex flex-col p-12 mt-12 max-w-5xl mx-auto">
                    <button
                        onClick={resetCamera}
                        className="w-fit px-6 py-3 border border-white/20 text-white rounded-full mb-12 font-mono tracking-[0.2em] text-xs hover:bg-white/10 hover:border-white/40 transition-all flex items-center gap-4 bg-black/20 backdrop-blur-md"
                    >
                        <span>←</span> RETURNING TO SYSTEM
                    </button>

                    <h2 className="text-6xl font-mono font-bold text-white mb-8 uppercase tracking-tighter drop-shadow-lg">
                        {selectedWidget && PLANETS_DATA.find(p => p.id === selectedWidget).labelTitle.substring(2)} MODULE
                    </h2>

                    <div className="grid grid-cols-3 gap-6">
                        <div className="bg-black/40 backdrop-blur-xl border border-white/5 p-6 rounded-xl hover:border-white/10 transition-colors">
                            <div className="text-[10px] font-mono tracking-widest text-white/40 mb-2">SYSTEM STATUS</div>
                            <div className="text-2xl font-mono text-white/90">NOMINAL</div>
                        </div>
                        <div className="bg-black/40 backdrop-blur-xl border border-white/5 p-6 rounded-xl hover:border-white/10 transition-colors">
                            <div className="text-[10px] font-mono tracking-widest text-white/40 mb-2">INTEGRITY</div>
                            <div className="text-2xl font-mono text-white/90">100%</div>
                        </div>
                        <div className="bg-black/40 backdrop-blur-xl border border-white/5 p-6 rounded-xl hover:border-white/10 transition-colors">
                            <div className="text-[10px] font-mono tracking-widest text-white/40 mb-2">UPTIME</div>
                            <div className="text-2xl font-mono text-white/90">99.99%</div>
                        </div>
                    </div>

                    <div className="flex-1 border border-white/5 bg-black/40 backdrop-blur-xl rounded-xl mt-6 p-8 relative overflow-hidden">
                        <div className="text-white/70 font-sans text-lg leading-relaxed max-w-2xl relative z-10">
                            Full screen module content goes here. The 3D scene continues running at 5% opacity in the background. The user feels completely absorbed into the {selectedWidget} environment.
                        </div>
                        {/* Decorative element inside panel */}
                        <div className="absolute top-0 right-0 w-64 h-full border-l border-white/5 bg-gradient-to-r from-transparent to-white/[0.02]"></div>
                    </div>
                </div>
            </div>

            {/* CSS Animations */}
            <style>{`
        @keyframes sweep {
           0% { transform: translateX(-100px) skewX(-12deg); }
           100% { transform: translateX(300px) skewX(-12deg); }
        }
      `}</style>
        </div >
    );
}

const PlanetWrapper = ({ data, onZoom, controlsRef, isDimmed, isClicked, setClickedPlanetId, setFlashData }) => {
    const { camera } = useThree();

    const handlePlanetClick = (id, pos) => {
        if (isClicked) return;

        setClickedPlanetId(id);

        const tl = gsap.timeline();
        // Smooth zoom
        tl.to(camera.position, {
            x: pos.x * 0.3, // Gets closer via multiplication
            y: pos.y + 0.5,
            z: pos.z * 0.3 + 1.0,
            duration: 1.2,
            ease: "power3.inOut"
        });

        if (controlsRef.current) {
            gsap.to(controlsRef.current.target, {
                x: pos.x,
                y: pos.y,
                z: pos.z,
                duration: 1.2,
                ease: "power3.inOut"
            });
        }

        // Flash at the exact end of zoom (1.2s mark)
        setTimeout(() => {
            setFlashData({ color: data.emissiveColor, opacity: 1 });
            setTimeout(() => {
                onZoom(data.id);
                // Dim flash out
                setFlashData(prev => ({ ...prev, opacity: 0 }));
            }, 100); // UI appears inside Flash
        }, 1200);
    };

    return (
        <Planet
            {...data}
            onPlanetClick={handlePlanetClick}
            isDimmed={isDimmed}
            isClicked={isClicked}
        />
    );
};

const CameraResetHandler = ({ controlsRef }) => {
    const { camera } = useThree();
    useEffect(() => {
        const handleReset = () => {
            gsap.to(camera.position, {
                x: 0,
                y: 2.2,
                z: 6.5,
                duration: 1.5,
                ease: "power2.inOut"
            });
            if (controlsRef.current) {
                gsap.to(controlsRef.current.target, {
                    x: 0,
                    y: 0,
                    z: 0,
                    duration: 1.5,
                    ease: "power2.inOut"
                });
            }
        };

        document.addEventListener('triggerCameraReset', handleReset);
        return () => document.removeEventListener('triggerCameraReset', handleReset);
    }, [camera, controlsRef]);
    return null;
};
