import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function StarField() {
    const createGroup = (count, size, colorHex) => {
        const pos = new Float32Array(count * 3);
        const col = new Float32Array(count * 3);
        const c = new THREE.Color(colorHex);
        for (let i = 0; i < count; i++) {
            pos[i * 3] = (Math.random() - 0.5) * 120;
            pos[i * 3 + 1] = (Math.random() - 0.5) * 120;
            pos[i * 3 + 2] = -5 - Math.random() * 60;
            col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;
        }
        return { positions: pos, colors: col };
    };

    const tinyStars = useMemo(() => createGroup(1500, 0.02, '#FFFFFF'), []);
    const medStars = useMemo(() => createGroup(300, 0.05, '#FFFFFF'), []);

    const { largePos, largePhases } = useMemo(() => {
        const count = 40;
        const pos = new Float32Array(count * 3);
        const phases = new Float32Array(count);
        for (let i = 0; i < count; i++) {
            pos[i * 3] = (Math.random() - 0.5) * 80;
            pos[i * 3 + 1] = (Math.random() - 0.5) * 80;
            pos[i * 3 + 2] = -5 - Math.random() * 40;
            phases[i] = Math.random() * Math.PI * 2;
        }
        return { largePos: pos, largePhases: phases };
    }, []);

    const { nebPos, nebCol } = useMemo(() => {
        const count = 80;
        const pos = new Float32Array(count * 3);
        const col = new Float32Array(count * 3);
        const colors = ['#FF3D3D', '#00CC66', '#FFCC00', '#4444FF', '#AA44FF'];
        const cObj = new THREE.Color();
        for (let i = 0; i < count; i++) {
            const bandOffset = (Math.random() - 0.5) * 20;
            const x = (Math.random() - 0.5) * 80;
            const y = x * 0.5 + bandOffset;
            pos[i * 3] = x;
            pos[i * 3 + 1] = y;
            pos[i * 3 + 2] = -15 - Math.random() * 30;

            cObj.set(colors[Math.floor(Math.random() * colors.length)]);
            col[i * 3] = cObj.r; col[i * 3 + 1] = cObj.g; col[i * 3 + 2] = cObj.b;
        }
        return { nebPos: pos, nebCol: col };
    }, []);

    const largeMatUniforms = useMemo(() => ({ uTime: { value: 0 } }), []);

    useFrame((state) => {
        largeMatUniforms.uTime.value = state.clock.elapsedTime;
    });

    return (
        <group>
            {/* Group 1: Tiny */}
            <points>
                <bufferGeometry>
                    <bufferAttribute attach="attributes-position" count={1500} array={tinyStars.positions} itemSize={3} />
                </bufferGeometry>
                <pointsMaterial color="#FFFFFF" size={0.02} transparent opacity={0.5} />
            </points>

            {/* Group 2: Medium */}
            <points>
                <bufferGeometry>
                    <bufferAttribute attach="attributes-position" count={300} array={medStars.positions} itemSize={3} />
                </bufferGeometry>
                <pointsMaterial color="#FFFFFF" size={0.05} transparent opacity={0.8} />
            </points>

            {/* Group 3: Large Twinkling */}
            <points>
                <bufferGeometry>
                    <bufferAttribute attach="attributes-position" count={40} array={largePos} itemSize={3} />
                    <bufferAttribute attach="attributes-phase" count={40} array={largePhases} itemSize={1} />
                </bufferGeometry>
                <shaderMaterial
                    transparent
                    depthWrite={false}
                    uniforms={largeMatUniforms}
                    vertexShader={`
            attribute float phase;
            varying float vPhase;
            void main() {
              vPhase = phase;
              vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
              gl_PointSize = 10.0 * (5.0 / -mvPosition.z);
              gl_Position = projectionMatrix * mvPosition;
            }
          `}
                    fragmentShader={`
            uniform float uTime;
            varying float vPhase;
            void main() {
              float dist = distance(gl_PointCoord, vec2(0.5));
              if(dist > 0.5) discard;
              float op = 0.7 + 0.3 * sin(uTime * 2.0 + vPhase);
              gl_FragColor = vec4(1.0, 1.0, 1.0, op);
            }
          `}
                />
            </points>

            {/* Group 4: Nebulas */}
            <points>
                <bufferGeometry>
                    <bufferAttribute attach="attributes-position" count={80} array={nebPos} itemSize={3} />
                    <bufferAttribute attach="attributes-color" count={80} array={nebCol} itemSize={3} />
                </bufferGeometry>
                <pointsMaterial vertexColors size={0.08} transparent opacity={0.06} blending={THREE.AdditiveBlending} depthWrite={false} />
            </points>
        </group>
    );
}
