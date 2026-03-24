import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, Effects } from '@react-three/drei';
import { UnrealBloomPass } from 'three-stdlib';
import { extend } from '@react-three/fiber';
import { Color, AdditiveBlending } from 'three';
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
        camera.position.set(0, 1.6, 4.8);
        camera.lookAt(0, -0.2, 0);
        camera.updateProjectionMatrix();
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
        radius: 0.28,
        orbitRadius: 1.20,
        orbitSpeed: 0.008,
        initialAngle: 0.8,
        orbitTiltX: Math.PI * 0.07,
        orbitTiltZ: 0.08,
        orbitColor: '#CC8833'
    },
    {
        id: 'kisan',
        color: '#003D1A',
        emissiveColor: '#00CC66',
        radius: 0.24,
        orbitRadius: 1.95,
        orbitSpeed: 0.005,
        initialAngle: 2.5,
        orbitTiltX: Math.PI * 0.055,
        orbitTiltZ: -0.05,
        orbitColor: '#BBAA44'
    },
    {
        id: 'nyay',
        color: '#3D3000',
        emissiveColor: '#FFCC00',
        radius: 0.20,
        orbitRadius: 2.75,
        orbitSpeed: 0.003,
        initialAngle: 4.2,
        orbitTiltX: Math.PI * 0.065,
        orbitTiltZ: 0.10,
        orbitColor: '#DDAA33'
    }
];

const OrbitLine = ({ radius, color, tiltX, tiltZ }) => {
    const pts = useMemo(() => {
        const arr = new Float32Array(257 * 3);
        for (let i = 0; i <= 256; i++) {
            const a = (i / 256) * Math.PI * 2;
            arr[i * 3] = Math.cos(a) * radius;
            arr[i * 3 + 1] = 0;
            arr[i * 3 + 2] = Math.sin(a) * radius;
        }
        return arr;
    }, [radius]);
    return (
        <line rotation={[tiltX, 0, tiltZ]}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" count={257} array={pts} itemSize={3} />
            </bufferGeometry>
            <lineBasicMaterial color={new Color(color)} transparent opacity={0.22} blending={AdditiveBlending} depthWrite={false} />
        </line>
    );
};

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
                camera={{ position: [0, 1.6, 4.8], fov: 75 }}
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

                {/* Global Lighting Target Match */}
                <ambientLight color={0x060612} intensity={0.55} />
                <directionalLight color={0x112255} intensity={0.18} position={[-8, 3, -6]} />

                <CameraEntryAnimation />
                <CameraController isZoomed={!!activeModule} />

                <StarField />
                <AmbientParticles />
                <SpaceEvents />
                <Sun />

                {PLANETS_DATA.map((data) => (
                    <group key={`orbit-group-${data.id}`}>
                        <OrbitLine radius={data.orbitRadius} color={data.orbitColor} tiltX={data.orbitTiltX} tiltZ={data.orbitTiltZ} />

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
            // Re-bind exact original position
            gsap.to(camera.position, {
                x: 0,
                y: 1.6,
                z: 4.8,
                duration: 1.5,
                ease: "power2.inOut"
            });
            if (controlsRef.current) {
                gsap.to(controlsRef.current.target, {
                    x: 0,
                    y: -0.2,
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
