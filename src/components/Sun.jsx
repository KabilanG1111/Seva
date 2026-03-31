import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { Color, CanvasTexture, AdditiveBlending, BackSide } from 'three';

export default function Sun() {
    const sunRef = useRef();
    const sunLightRef = useRef();
    const heatSphereRef = useRef();
    const sparksGeoRef = useRef();

    const sparkCount = 40;
    const { sparkPos, sparkVel } = useMemo(() => {
        const pos = new Float32Array(sparkCount * 3);
        const vel = [];
        for (let i = 0; i < sparkCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const r = 0.22 + Math.random() * 0.05;
            pos[i * 3] = Math.cos(angle) * r;
            pos[i * 3 + 1] = (Math.random() - 0.5) * 0.3;
            pos[i * 3 + 2] = Math.sin(angle) * r;
            vel.push({
                vx: (Math.random() - 0.5) * 0.003,
                vy: (Math.random() - 0.5) * 0.003,
                vz: (Math.random() - 0.5) * 0.003,
                life: Math.random(),
                maxLife: 0.5 + Math.random() * 0.5,
            });
        }
        return { sparkPos: pos, sparkVel: vel };
    }, []);

    useFrame(() => {
        const time = Date.now();
        if (sunRef.current) {
            sunRef.current.rotation.y += 0.002;
            sunRef.current.rotation.x += 0.0005;

            const pulse = Math.sin(time * 0.0008) * 0.06 + 1.0;
            sunRef.current.scale.set(pulse, pulse, pulse);
        }

        if (sunLightRef.current) {
            sunLightRef.current.intensity = 4.0 + Math.sin(time * 0.001) * 0.5;
        }

        if (heatSphereRef.current) {
            heatSphereRef.current.scale.set(
                1 + Math.sin(time * 0.002) * 0.04,
                1 + Math.sin(time * 0.0025) * 0.04,
                1 + Math.sin(time * 0.0015) * 0.04
            );
        }

        if (sparksGeoRef.current) {
            const sPos = sparksGeoRef.current.attributes.position;
            for (let i = 0; i < sparkCount; i++) {
                const v = sparkVel[i];
                v.life += 0.016;

                if (v.life > v.maxLife) {
                    const a = Math.random() * Math.PI * 2;
                    const r = 0.30;
                    sPos.setXYZ(i, Math.cos(a) * r, (Math.random() - 0.5) * 0.2, Math.sin(a) * r);
                    v.vx = (Math.cos(a) + (Math.random() - 0.5) * 0.5) * 0.004;
                    v.vy = (Math.random() - 0.5) * 0.004;
                    v.vz = (Math.sin(a) + (Math.random() - 0.5) * 0.5) * 0.004;
                    v.life = 0;
                    v.maxLife = 0.4 + Math.random() * 0.6;
                } else {
                    sPos.setXYZ(i, sPos.getX(i) + v.vx, sPos.getY(i) + v.vy, sPos.getZ(i) + v.vz);
                }
            }
            sPos.needsUpdate = true;
        }
    });

    const SUN_LAYERS = useMemo(() => [
        [0.70, '#FFFACC', 0.95],
        [1.10, '#FFDD66', 0.70],
        [1.60, '#FFAA33', 0.40],
        [2.20, '#FF7700', 0.18],
        [3.20, '#FF4400', 0.06],
    ], []);

    const sunGlowTextures = useMemo(() => {
        return SUN_LAYERS.map(([size, color, opacity]) => {
            const c = document.createElement('canvas');
            c.width = 256; c.height = 256;
            const ctx = c.getContext('2d');
            const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
            g.addColorStop(0.0, color + 'FF');
            g.addColorStop(0.35, color + 'CC');
            g.addColorStop(0.65, color + '55');
            g.addColorStop(1.0, color + '00');
            ctx.fillStyle = g;
            ctx.fillRect(0, 0, 256, 256);
            return new CanvasTexture(c);
        });
    }, [SUN_LAYERS]);

    return (
        <group>
            <pointLight ref={sunLightRef} color="#FFF8E0" intensity={4.0} distance={18} position={[0, 0, 0]} />

            <mesh ref={sunRef} frustumCulled={false}>
                <sphereGeometry args={[0.30, 64, 64]} />
                <meshBasicMaterial color={0xFFFFEE} />

                {SUN_LAYERS.map((layer, i) => (
                    <sprite key={`sun-glow-${i}`} scale={[layer[0], layer[0], 1]}>
                        <spriteMaterial map={sunGlowTextures[i]} transparent blending={AdditiveBlending} depthWrite={false} opacity={layer[2]} />
                    </sprite>
                ))}
            </mesh>

            <mesh ref={heatSphereRef}>
                <sphereGeometry args={[0.35, 32, 32]} />
                <meshBasicMaterial color={new Color(0xFF8800)} transparent opacity={0.04} side={BackSide} />
            </mesh>

            <points>
                <bufferGeometry ref={sparksGeoRef}>
                    <bufferAttribute attach="attributes-position" count={sparkCount} array={sparkPos} itemSize={3} />
                </bufferGeometry>
                <pointsMaterial color={new Color(0xFFAA33)} size={0.015} transparent opacity={0.9} blending={AdditiveBlending} depthWrite={false} />
            </points>

            <Html center className="pointer-events-none z-50">
                <div className="text-white font-mono font-bold tracking-[0.3em] text-xs opacity-90 filter drop-shadow-[0_0_12px_rgba(255,170,51,0.8)] whitespace-nowrap mt-16">
                    DHARITRI
                </div>
            </Html>
        </group>
    );
}
