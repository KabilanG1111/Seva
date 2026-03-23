import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Color, CanvasTexture, AdditiveBlending } from 'three';

export default function AmbientParticles() {
    const particlesRef = useRef();

    const particleCount = 120;
    const colors = ['#FF3D3D', '#00CC66', '#FFCC00'];

    const { positions, colorArray } = useMemo(() => {
        const pos = new Float32Array(particleCount * 3);
        const col = new Float32Array(particleCount * 3);
        const colorObj = new Color();

        for (let i = 0; i < particleCount; i++) {
            const r = 3 + Math.random() * 8;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * Math.PI;

            pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            pos[i * 3 + 2] = r * Math.cos(phi);

            colorObj.set(colors[Math.floor(Math.random() * colors.length)]);
            col[i * 3] = colorObj.r;
            col[i * 3 + 1] = colorObj.g;
            col[i * 3 + 2] = colorObj.b;
        }
        return { positions: pos, colorArray: col };
    }, []);

    // Create circular texture for cosmic dust
    const circleTexture = useMemo(() => {
        const canvas = document.createElement('canvas');
        canvas.width = 32;
        canvas.height = 32;
        const ctx = canvas.getContext('2d');
        ctx.beginPath();
        ctx.arc(16, 16, 16, 0, Math.PI * 2);
        ctx.fillStyle = '#FFF';
        ctx.fill();
        return new CanvasTexture(canvas);
    }, []);

    useFrame((state) => {
        if (particlesRef.current) {
            // Extremely slow rotation
            particlesRef.current.rotation.y = state.clock.elapsedTime * 0.005;
            particlesRef.current.rotation.x = state.clock.elapsedTime * 0.002;
        }
    });

    return (
        <points ref={particlesRef}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" count={particleCount} array={positions} itemSize={3} />
                <bufferAttribute attach="attributes-color" count={particleCount} array={colorArray} itemSize={3} />
            </bufferGeometry>
            <pointsMaterial
                vertexColors
                size={0.015}
                transparent
                opacity={0.12}
                alphaMap={circleTexture}
                alphaTest={0.01}
                depthWrite={false}
                blending={AdditiveBlending}
            />
        </points>
    );
}
