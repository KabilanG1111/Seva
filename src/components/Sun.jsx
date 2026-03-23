import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';

export default function Sun() {
    const sunRef = useRef();

    useEffect(() => {
        if (sunRef.current) {
            gsap.to(sunRef.current.scale, {
                x: 1.04, y: 1.04, z: 1.04,
                duration: 2.0,
                yoyo: true,
                repeat: -1,
                ease: "sine.inOut"
            });
        }
    }, []);

    useFrame(() => {
        if (sunRef.current) {
            sunRef.current.rotation.y += 0.002;
            sunRef.current.rotation.x += 0.0005;
        }
    });

    const createSunGlow = (colorHex) => {
        const canvas = document.createElement('canvas');
        canvas.width = 128; canvas.height = 128;
        const ctx = canvas.getContext('2d');
        const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
        grad.addColorStop(0.0, colorHex + 'AA');
        grad.addColorStop(0.4, colorHex + '44');
        grad.addColorStop(1.0, colorHex + '00');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 128, 128);
        return new THREE.CanvasTexture(canvas);
    };

    const innerGlowTex = useMemo(() => createSunGlow('#FFCC44'), []);
    const outerGlowTex = useMemo(() => createSunGlow('#FF8800'), []);

    return (
        <group>
            <mesh ref={sunRef} frustumCulled={false}>
                <sphereGeometry args={[0.22, 64, 64]} />
                <meshStandardMaterial
                    color={new THREE.Color(0xFFFFDD)}
                    emissive={new THREE.Color(0xFF8800)}
                    emissiveIntensity={1.5}
                    roughness={0.85}
                    metalness={0.0}
                />

                {/* Core inner glow sprite MUST scale equally */}
                <sprite scale={[1.4, 1.4, 1]}>
                    <spriteMaterial map={innerGlowTex} transparent blending={THREE.AdditiveBlending} depthWrite={false} />
                </sprite>

                {/* Outer corona sprite MUST scale equally */}
                <sprite scale={[2.8, 2.8, 1]}>
                    <spriteMaterial map={outerGlowTex} transparent opacity={0.3} blending={THREE.AdditiveBlending} depthWrite={false} />
                </sprite>
            </mesh>

            <Html center className="pointer-events-none z-50">
                <div className="text-white font-mono font-bold tracking-[0.3em] text-xs opacity-90 filter drop-shadow-[0_0_12px_rgba(255,170,51,0.8)] whitespace-nowrap mt-16">
                    DHARITRI
                </div>
            </Html>
        </group>
    );
}
