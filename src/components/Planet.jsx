import React, { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';

export default function Planet({
    id, radius, orbitRadius, orbitSpeed, initialAngle,
    labelTitle, labelData, labelData2, onPlanetClick, isDimmed, isClicked
}) {
    const planetRef = useRef();
    const meshGroupRef = useRef();
    const trailRef = useRef();
    const labelRef = useRef();
    const moonRef = useRef();
    const spriteRef = useRef();
    const markerRef = useRef();

    const [hovered, setHovered] = useState(false);
    const angleRef = useRef(initialAngle);

    // Exact planet styling and precise Sphere/Phong properties from Prompt
    const styling = useMemo(() => {
        if (id === 'praan') return {
            color: 0x8B0000, emissive: 0xFF2200, shininess: 30, specular: 0xFF4444,
            glowColor: '#FF3D3D', glowScale: 0.8,
        };
        if (id === 'kisan') return {
            color: 0x003B00, emissive: 0x00CC44, shininess: 25, specular: 0x44FF88,
            glowColor: '#00CC66', glowScale: 0.7,
        };
        // nyay
        return {
            color: 0x3D2B00, emissive: 0xFFAA00, shininess: 50, specular: 0xFFDD44,
            glowColor: '#FFCC00', glowScale: 0.6,
        };
    }, [id, radius]);

    // Create sprite texture accurately (no squares allowed)
    const glowTexture = useMemo(() => {
        const canvas = document.createElement('canvas');
        canvas.width = 128; canvas.height = 128;
        const ctx = canvas.getContext('2d');
        const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
        grad.addColorStop(0.0, styling.glowColor + 'AA');
        grad.addColorStop(0.4, styling.glowColor + '44');
        grad.addColorStop(1.0, styling.glowColor + '00');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 128, 128);
        return new THREE.CanvasTexture(canvas);
    }, [styling.glowColor]);

    const trailLength = 60;
    const trailPositions = useMemo(() => new Float32Array(trailLength * 3), []);
    const trailOpacities = useMemo(() => {
        const opacities = new Float32Array(trailLength);
        for (let i = 0; i < trailLength; i++) opacities[i] = i / trailLength;
        return opacities;
    }, []);

    useEffect(() => {
        document.body.style.cursor = hovered ? 'pointer' : 'auto';
        const baseOpacity = isDimmed ? 0.2 : 1.0;

        if (meshGroupRef.current && planetRef.current) {
            gsap.to(meshGroupRef.current.scale, {
                x: isClicked ? 1.3 : (hovered ? 1.15 : 1),
                y: isClicked ? 1.3 : (hovered ? 1.15 : 1),
                z: isClicked ? 1.3 : (hovered ? 1.15 : 1),
                duration: isClicked ? 0.2 : 0.3,
                ease: "power2.out"
            });

            const material = planetRef.current.material;
            gsap.to(material, {
                emissiveIntensity: isClicked ? 2.0 : (hovered ? 1.2 : 0.7),
                opacity: baseOpacity,
                transparent: isDimmed,
                duration: 0.3
            });

            if (spriteRef.current) gsap.to(spriteRef.current.material, { opacity: hovered ? 2.0 : baseOpacity, duration: 0.3 });
            if (trailRef.current) gsap.to(trailRef.current.material.uniforms.uBaseOpacity, { value: baseOpacity, duration: 0.3 });
        }
    }, [hovered, isDimmed, isClicked]);

    useFrame((state) => {
        angleRef.current -= orbitSpeed;
        const angle = angleRef.current;
        const x = Math.cos(angle) * orbitRadius;
        const z = Math.sin(angle) * orbitRadius;
        const y = Math.sin(angle * 0.3) * 0.1;

        if (meshGroupRef.current) {
            meshGroupRef.current.position.set(x, y, z);

            if (planetRef.current) {
                planetRef.current.rotation.y += (id === 'praan') ? 0.008 : 0.01;
                if (id === 'praan') planetRef.current.rotation.x += 0.002;
            }

            if (moonRef.current) {
                const moonAngle = state.clock.elapsedTime * 0.04;
                moonRef.current.position.set(Math.cos(moonAngle) * 0.32, 0, Math.sin(moonAngle) * 0.32);
            }
            if (markerRef.current) markerRef.current.position.set(x, 0, z);
            if (labelRef.current) labelRef.current.style.opacity = isDimmed ? 0 : (z < 0 ? 0.1 : 1.0);
        }

        if (trailRef.current) {
            for (let i = 0; i < trailLength - 1; i++) {
                trailPositions[i * 3] = trailPositions[(i + 1) * 3];
                trailPositions[i * 3 + 1] = trailPositions[(i + 1) * 3 + 1];
                trailPositions[i * 3 + 2] = trailPositions[(i + 1) * 3 + 2];
            }
            trailPositions[(trailLength - 1) * 3] = x;
            trailPositions[(trailLength - 1) * 3 + 1] = y;
            trailPositions[(trailLength - 1) * 3 + 2] = z;
            trailRef.current.geometry.attributes.position.needsUpdate = true;
        }
    });

    return (
        <group>
            <group
                ref={meshGroupRef}
                onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
                onPointerOut={(e) => { setHovered(false); }}
                onClick={(e) => { e.stopPropagation(); onPlanetClick(id, meshGroupRef.current.position); }}
            >
                <mesh ref={planetRef} frustumCulled={false}>
                    {/* EXACTLY SphereGeometry with 64x64 minimum segments */}
                    <sphereGeometry args={[radius, 64, 64]} />
                    {/* EXACTLY MeshPhongMaterial with parameters */}
                    <meshPhongMaterial
                        color={new THREE.Color(styling.color)}
                        emissive={new THREE.Color(styling.emissive)}
                        emissiveIntensity={0.7}
                        shininess={styling.shininess}
                        specular={new THREE.Color(styling.specular)}
                    />

                    {/* Sprite Atmosphere Glow - MUST be a child of this mesh directly so it follows seamlessly */}
                    <sprite ref={spriteRef} scale={[styling.glowScale, styling.glowScale, 1]}>
                        <spriteMaterial map={glowTexture} transparent blending={THREE.AdditiveBlending} depthWrite={false} opacity={1.0} />
                    </sprite>
                </mesh>

                {/* Optional moon for Praan */}
                {id === 'praan' && (
                    <mesh ref={moonRef}>
                        <sphereGeometry args={[0.04, 32, 32]} />
                        <meshPhongMaterial color={new THREE.Color(0x888888)} emissive={new THREE.Color(0xFF3D3D)} emissiveIntensity={0.1} shininess={5} specular={new THREE.Color(0xFF4444)} />
                    </mesh>
                )}

                {/* Label Overlay */}
                <Html center className="pointer-events-none transition-all duration-300 z-40">
                    <div ref={labelRef} className="flex flex-col items-center group-hover:scale-105 transition-all duration-300" style={{ filter: hovered ? `drop-shadow(0 0 8px ${styling.glowColor})` : 'none', marginTop: '80px' }}>
                        <div className="w-[1px] h-10 mb-2" style={{ background: `linear-gradient(to bottom, transparent, ${styling.glowColor})` }} />
                        <div className="flex flex-col items-center px-4 py-2 rounded-md transition-all duration-300" style={{
                            background: 'rgba(5,7,15,0.75)', backdropFilter: 'blur(8px)', border: `0.5px solid ${styling.glowColor}${hovered ? 'FF' : '4D'}`,
                        }}>
                            <div className="text-sm font-bold tracking-wider mb-2" style={{ color: styling.glowColor, textShadow: `0 0 10px ${styling.glowColor}` }}>{labelTitle}</div>
                            <div className="text-[0.6rem] font-sans font-medium text-white/90 whitespace-nowrap mb-1">{labelData}</div>
                            <div className="text-[0.6rem] font-sans font-medium text-white/90 whitespace-nowrap">{labelData2}</div>
                        </div>
                    </div>
                </Html>
            </group>

            <mesh ref={markerRef}>
                <sphereGeometry args={[0.025, 16, 16]} />
                <meshBasicMaterial color={styling.glowColor} transparent opacity={isDimmed ? 0 : 0.4} />
            </mesh>

            <points ref={trailRef}>
                <bufferGeometry>
                    <bufferAttribute attach="attributes-position" count={trailLength} array={trailPositions} itemSize={3} />
                    <bufferAttribute attach="attributes-alpha" count={trailLength} array={trailOpacities} itemSize={1} />
                </bufferGeometry>
                <shaderMaterial
                    transparent
                    depthWrite={false}
                    uniforms={{ uColor: { value: new THREE.Color(styling.glowColor) }, uBaseOpacity: { value: 1.0 } }}
                    vertexShader={`
            attribute float alpha; varying float vAlpha;
            void main() { vAlpha = alpha; vec4 mvPosition = modelViewMatrix * vec4(position, 1.0); gl_PointSize = 4.0 * (10.0 / -mvPosition.z); gl_Position = projectionMatrix * mvPosition; }
          `}
                    fragmentShader={`
            uniform vec3 uColor; uniform float uBaseOpacity; varying float vAlpha;
            void main() { float dist = distance(gl_PointCoord, vec2(0.5)); if(dist > 0.5) discard; gl_FragColor = vec4(uColor, vAlpha * 0.2 * uBaseOpacity);  }
          `}
                />
            </points>
        </group>
    );
}
