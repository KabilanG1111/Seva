import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, Effects } from '@react-three/drei';
import { UnrealBloomPass } from 'three-stdlib';
import { extend } from '@react-three/fiber';
import gsap from 'gsap';

extend({ UnrealBloomPass });

import StarField from './StarField';
import Sun from './Sun';
import Planet from './Planet';
import AmbientParticles from './AmbientParticles';
import SpaceEvents from './SpaceEvents';

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

export const PLANETS_DATA = [
    {
        id: 'praan',
        color: '#3D0000',
        emissiveColor: '#FF3D3D',
        radius: 0.18,
        orbitRadius: 1.2,
        orbitSpeed: 0.008,
        initialAngle: 0.8,
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
        ringOpacity: 0.05,
        ringTorusProps: [2.5, 0.004, 8, 128],
        orbitTilt: 0.12
    }
];

export default function Scene({ activeModule, setActiveModule }) {
    const [flashData, setFlashData] = useState({ color: '#000', opacity: 0 });
    const [clickedPlanetId, setClickedPlanetId] = useState(null);
    const controlsRef = useRef();

    // Reset Camera logic (reacting to App.jsx activeModule turning null)
    useEffect(() => {
        if (!activeModule && clickedPlanetId) {
            const pData = PLANETS_DATA.find(p => p.id === clickedPlanetId);
            setFlashData({ color: pData?.emissiveColor || '#FFFFFF', opacity: 1 });

            setTimeout(() => {
                setClickedPlanetId(null);
                document.dispatchEvent(new CustomEvent('triggerCameraReset'));
                setFlashData(prev => ({ ...prev, opacity: 0 }));
            }, 300);
        }
    }, [activeModule]);

    return (
        <div className="w-full h-full relative font-sans select-none">
            {/* Premium background vignette */}
            <div className="premium-vignette"></div>

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

            <Canvas
                camera={{ position: [0, 8, 2], fov: 60 }}
                style={{ opacity: activeModule ? 0.05 : 1, transition: 'opacity 1s ease', width: '100%', height: '100%', display: 'block' }}
                gl={{
                    antialias: true,
                    alpha: true,
                    powerPreference: "high-performance",
                    precision: "highp"
                }}
                shadows={false}
            >
                <color attach="background" args={['#050505']} />

                {/* Reduced Glow Fix implementation for Lights! */}
                <pointLight color={0xFFF5E0} intensity={1.2} distance={6.0} position={[0, 0, 0]} />
                <ambientLight color={0x090912} intensity={0.35} />
                <directionalLight color={0x2233AA} intensity={0.15} position={[-5, 3, -5]} />

                <CameraEntryAnimation />
                <CameraController isZoomed={!!activeModule} />

                <StarField />
                <AmbientParticles />
                <SpaceEvents />
                <Sun />

                {PLANETS_DATA.map((data) => (
                    <group key={`orbit-group-${data.id}`} rotation={[0, 0, data.orbitTilt]}>
                        <mesh rotation={[Math.PI / 2, 0, 0]}>
                            <torusGeometry args={data.ringTorusProps} />
                            <meshBasicMaterial color={data.emissiveColor} transparent opacity={activeModule || clickedPlanetId ? 0.02 : data.ringOpacity} />
                        </mesh>

                        <PlanetWrapper
                            data={data}
                            onZoom={() => setActiveModule(data.id)}
                            controlsRef={controlsRef}
                            isDimmed={clickedPlanetId && clickedPlanetId !== data.id}
                            isClicked={clickedPlanetId === data.id}
                            setClickedPlanetId={setClickedPlanetId}
                            setFlashData={setFlashData}
                        />
                    </group>
                ))}

                <Effects disableGamma>
                    {/* Tighter threshold for pure planetary realism! */}
                    <unrealBloomPass threshold={0.65} strength={0.18} radius={0.4} />
                </Effects>

                <OrbitControls
                    ref={controlsRef}
                    enablePan={false}
                    enableZoom={!activeModule}
                    enableRotate={!activeModule}
                    dampingFactor={0.05}
                />

                <CameraResetHandler controlsRef={controlsRef} />
            </Canvas>
        </div>
    );
}

const PlanetWrapper = ({ data, onZoom, controlsRef, isDimmed, isClicked, setClickedPlanetId, setFlashData }) => {
    const { camera } = useThree();

    const handlePlanetClick = (id, pos) => {
        if (isClicked) return;
        setClickedPlanetId(id);

        const tl = gsap.timeline();
        // Smooth zoom via GSAP directly matching prompt phase 2 architecture
        tl.to(camera.position, {
            x: pos.x * 0.3,
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

        setTimeout(() => {
            setFlashData({ color: data.emissiveColor, opacity: 1 });
            setTimeout(() => {
                onZoom(data.id);
                setFlashData(prev => ({ ...prev, opacity: 0 }));
            }, 100);
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
