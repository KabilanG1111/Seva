import React, { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { CanvasTexture, Color, AdditiveBlending, BackSide, DoubleSide, TextureLoader, Vector3, RingGeometry, NormalBlending } from 'three';
import gsap from 'gsap';
import { useAudio } from '../hooks/useAudioEngine';

const loader = new TextureLoader();
const marsTex = loader.load('/textures/2k_mars.jpg');
const earthMap = loader.load('/textures/2k_earth_daymap.jpg');
const earthSpec = loader.load('/textures/2k_earth_daymap.jpg');
const earthClouds = loader.load('/textures/2k_earth_clouds.jpg');
const saturnTex = loader.load('/textures/2k_saturn.jpg');
const saturnRingAlpha = loader.load('/textures/2k_saturn_ring_alpha.png');

const saturnRingGeo = new RingGeometry(0.32, 0.65, 128);
const saturnPos = saturnRingGeo.attributes.position;
const saturnUV = saturnRingGeo.attributes.uv;
const vec = new Vector3();
for (let i = 0; i < saturnPos.count; i++) {
    vec.fromBufferAttribute(saturnPos, i);
    saturnUV.setXY(i, (vec.length() - 0.32) / (0.65 - 0.32), 0);
}

export default function Planet({
    id, radius, orbitRadius, orbitSpeed, initialAngle,
    labelTitle, labelData, labelData2, onPlanetClick, isDimmed, isClicked
}) {
    const meshRef = useRef();
    const groupRef = useRef();
    const trailRef = useRef();
    const labelRef = useRef();
    const cloudRef = useRef();
    const moonRef = useRef();
    const markerRef = useRef();

    const [hovered, setHovered] = useState(false);
    const audio = useAudio();

    const styling = useMemo(() => {
        if (id === 'praan') return {
            map: marsTex, bumpMap: marsTex, bumpScale: 0.012,
            color: 'white', emissive: '#110500', emissiveIntensity: 0.20, shininess: 12, specular: '#663300',
            glowColor: '#FF1A1A', glowSizes: [0.55, 0.90, 1.60], glowOpacities: [0.70, 0.30, 0.10],
            rimColor: '#FF5522', radius: 0.28
        };
        if (id === 'kisan') return {
            map: earthMap, specularMap: earthSpec, cloudsMap: earthClouds,
            color: 'white', emissive: '#001A0A', emissiveIntensity: 0.18, shininess: 40, specular: '#1133AA',
            glowColor: '#00FF66', glowSizes: [0.48, 0.80, 1.45], glowOpacities: [0.65, 0.28, 0.09],
            rimColor: '#4488FF', radius: 0.24
        };
        return {
            map: saturnTex, ringAlpha: saturnRingAlpha,
            color: 'white', emissive: '#1A0D00', emissiveIntensity: 0.20, shininess: 22, specular: '#AA7733',
            glowColor: '#FFD700', glowSizes: [0.42, 0.72, 1.30], glowOpacities: [0.60, 0.25, 0.08],
            rimColor: '#FFCC55', radius: 0.20
        };
    }, [id]);

    const glowStackTextures = useMemo(() => {
        const texs = [];
        for (let i = 0; i < 3; i++) {
            const canvas = document.createElement('canvas');
            canvas.width = 128; canvas.height = 128;
            const ctx = canvas.getContext('2d');
            const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
            const color = styling.glowColor;

            if (i === 0) {
                grad.addColorStop(0.0, color + 'FF');
                grad.addColorStop(0.3, color + '88');
                grad.addColorStop(0.6, color + '33');
                grad.addColorStop(1.0, color + '00');
            } else if (i === 1) {
                grad.addColorStop(0.0, color + '44');
                grad.addColorStop(0.4, color + '22');
                grad.addColorStop(1.0, color + '00');
            } else {
                grad.addColorStop(0.0, color + '18');
                grad.addColorStop(0.5, color + '08');
                grad.addColorStop(1.0, color + '00');
            }

            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, 128, 128);
            texs.push(new CanvasTexture(canvas));
        }
        return texs;
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

        if (groupRef.current && meshRef.current) {
            gsap.to(groupRef.current.scale, {
                x: isClicked ? 1.3 : (hovered ? 1.15 : 1),
                y: isClicked ? 1.3 : (hovered ? 1.15 : 1),
                z: isClicked ? 1.3 : (hovered ? 1.15 : 1),
                duration: isClicked ? 0.2 : 0.3,
                ease: "power2.out"
            });

            const material = meshRef.current.material;
            gsap.to(material, {
                emissiveIntensity: isClicked ? styling.emissiveIntensity * 3 : (hovered ? styling.emissiveIntensity * 2 : styling.emissiveIntensity),
                opacity: baseOpacity,
                transparent: isDimmed,
                duration: 0.3
            });
            if (trailRef.current) gsap.to(trailRef.current.material.uniforms.uBaseOpacity, { value: baseOpacity, duration: 0.3 });
        }
    }, [hovered, isDimmed, isClicked, styling.emissiveIntensity, styling.glowOpacity]);

    useFrame(({ clock }) => {
        const t = clock.getElapsedTime()
        const angle = t * orbitSpeed + initialAngle

        if (groupRef.current) {
            groupRef.current.position.x = Math.cos(angle) * orbitRadius
            groupRef.current.position.z = Math.sin(angle) * orbitRadius
            groupRef.current.position.y = Math.sin(angle * 0.3) * 0.2

            if (markerRef.current) markerRef.current.position.set(groupRef.current.position.x, 0, groupRef.current.position.z);
            if (labelRef.current) labelRef.current.style.opacity = isDimmed ? 0 : (groupRef.current.position.z < 0 ? 0.1 : 1.0);
        }

        if (meshRef.current) {
            meshRef.current.rotation.y += 0.004
        }

        if (cloudRef.current) {
            cloudRef.current.rotation.y += 0.0006
        }

        if (trailRef.current && groupRef.current) {
            for (let i = 0; i < trailLength - 1; i++) {
                trailPositions[i * 3] = trailPositions[(i + 1) * 3];
                trailPositions[i * 3 + 1] = trailPositions[(i + 1) * 3 + 1];
                trailPositions[i * 3 + 2] = trailPositions[(i + 1) * 3 + 2];
            }
            trailPositions[(trailLength - 1) * 3] = groupRef.current.position.x;
            trailPositions[(trailLength - 1) * 3 + 1] = groupRef.current.position.y;
            trailPositions[(trailLength - 1) * 3 + 2] = groupRef.current.position.z;
            trailRef.current.geometry.attributes.position.needsUpdate = true;
        }
    });

    return (
        <group>
            <group
                ref={groupRef}
                onPointerOver={(e) => {
                    e.stopPropagation();
                    if (!hovered) {
                        setHovered(true);
                        audio.playHoverSound();
                    }
                }}
                onPointerOut={(e) => { setHovered(false); }}
                onClick={(e) => { e.stopPropagation(); audio.playClick(); onPlanetClick(id, groupRef.current.position); }}
            >
                <mesh ref={meshRef} frustumCulled={false}>
                    <sphereGeometry args={[styling.radius, 64, 64]} />
                    <meshPhongMaterial
                        map={styling.map}
                        bumpMap={styling.bumpMap}
                        bumpScale={styling.bumpScale}
                        specularMap={styling.specularMap}
                        color={styling.color}
                        emissive={styling.emissive}
                        emissiveIntensity={styling.emissiveIntensity}
                        shininess={styling.shininess}
                        specular={styling.specular}
                        transparent={false}
                        opacity={1.0}
                        depthWrite={true}
                    />

                    {/* NASA Cloud Layer for Earth */}
                    {id === 'kisan' && (
                        <mesh ref={cloudRef}>
                            <sphereGeometry args={[styling.radius + 0.012, 64, 64]} />
                            <meshPhongMaterial map={styling.cloudsMap} transparent opacity={0.30} depthWrite={false} />
                        </mesh>
                    )}

                    {/* Target Rim Light Glow Layers */}
                    <mesh>
                        <sphereGeometry args={[styling.radius * 1.07, 64, 64]} />
                        <meshBasicMaterial color={new Color(styling.rimColor)} transparent opacity={0.55} side={BackSide} depthWrite={false} blending={AdditiveBlending} />
                    </mesh>
                    <mesh>
                        <sphereGeometry args={[styling.radius * 1.18, 64, 64]} />
                        <meshBasicMaterial color={new Color(styling.rimColor)} transparent opacity={0.28} side={BackSide} depthWrite={false} blending={AdditiveBlending} />
                    </mesh>

                    {/* General Base Glow */}
                    {glowStackTextures.map((tex, i) => (
                        <sprite key={`glow-${i}`} scale={[styling.glowSizes[i], styling.glowSizes[i], 1]}>
                            <spriteMaterial map={tex} transparent blending={AdditiveBlending} depthWrite={false} opacity={hovered ? styling.glowOpacities[i] * 1.5 : (isDimmed ? 0.02 : styling.glowOpacities[i])} />
                        </sprite>
                    ))}

                    {/* NASA Saturn Ring */}
                    {id === 'nyay' && (
                        <mesh geometry={saturnRingGeo} rotation={[Math.PI * 0.40, 0, 0]}>
                            <meshBasicMaterial map={styling.ringAlpha} color={new Color(0xFFDDAA)} side={DoubleSide} transparent opacity={0.88} depthWrite={false} blending={NormalBlending} />
                        </mesh>
                    )}
                </mesh>

                {/* Optional moon for Praan */}
                {id === 'praan' && (
                    <mesh ref={moonRef}>
                        <sphereGeometry args={[0.04, 32, 32]} />
                        <meshPhongMaterial color={new Color(0x888888)} emissive={new Color(0xFF3D3D)} emissiveIntensity={0.1} shininess={5} specular={new Color(0xFF4444)} />
                    </mesh>
                )}

                {/* Label Overlay */}
                <Html center className="pointer-events-none transition-all duration-300 z-40">
                    <div ref={labelRef} className="planet-label" style={{ opacity: isDimmed ? 0 : 1 }}>
                        {labelTitle}
                    </div>
                </Html>

                {/* Data Panel Overlays mapped inherently to 2D screen-space */}
                <Html className="pointer-events-none z-50">
                    <div
                        className={`data-panel ${hovered && !isDimmed && !isClicked ? 'visible' : ''}`}
                        id={`panel-${id}`}
                        style={{
                            left: '80px',
                            top: '-40px'
                        }}
                    >
                        {id === 'praan' && (
                            <>
                                <div className="dp-header"><span className="dp-dot red"></span>PRAAN — CRITICAL</div>
                                <div className="dp-row"><span>DONORS ACTIVE</span><span className="dp-val red">2,847</span></div>
                                <div className="dp-row"><span>REQUESTS LIVE</span><span className="dp-val red">14</span></div>
                                <div className="dp-row"><span>NEAREST NEED</span><span className="dp-val red">0.8KM</span></div>
                                <div className="dp-bar"><div className="dp-fill red" style={{ width: '78%' }}></div></div>
                                <div className="dp-footer">NETWORK: LIVE ● 5G</div>
                            </>
                        )}
                        {id === 'kisan' && (
                            <>
                                <div className="dp-header"><span className="dp-dot green"></span>KISAN NADI — SCANNING</div>
                                <div className="dp-row"><span>FIELD HEALTH</span><span className="dp-val green">62%</span></div>
                                <div className="dp-row"><span>DISEASE RISK</span><span className="dp-val yellow">HIGH</span></div>
                                <div className="dp-row"><span>MANDI PRICE</span><span className="dp-val green">↑₹2,340</span></div>
                                <div className="dp-bar"><div className="dp-fill green" style={{ width: '62%' }}></div></div>
                                <div className="dp-footer">DRONE: ACTIVE ● 5G</div>
                            </>
                        )}
                        {id === 'nyay' && (
                            <>
                                <div className="dp-header"><span className="dp-dot gold"></span>NYAYPATRA — ALERT</div>
                                <div className="dp-row"><span>DOCS SCANNED</span><span className="dp-val gold">1</span></div>
                                <div className="dp-row"><span>DANGER CLAUSES</span><span className="dp-val red">3</span></div>
                                <div className="dp-row"><span>CASES ACTIVE</span><span className="dp-val gold">1</span></div>
                                <div className="dp-bar"><div className="dp-fill gold" style={{ width: '45%' }}></div></div>
                                <div className="dp-footer">AI: READING ● 5G</div>
                            </>
                        )}
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
                    uniforms={{ uColor: { value: new Color(styling.glowColor) }, uBaseOpacity: { value: 1.0 } }}
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
