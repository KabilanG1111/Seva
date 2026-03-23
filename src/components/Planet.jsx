import React, { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { CanvasTexture, Color, AdditiveBlending, BackSide, DoubleSide } from 'three';
import gsap from 'gsap';
import { useAudio } from '../hooks/useAudioEngine';

function createPraanTexture() {
    const size = 512;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#8B2500';
    ctx.fillRect(0, 0, size, size);

    for (let i = 0; i < 18; i++) {
        const x = Math.random() * size;
        const y = Math.random() * size;
        const r = 30 + Math.random() * 90;
        const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
        grad.addColorStop(0, 'rgba(60,10,0,0.7)');
        grad.addColorStop(0.5, 'rgba(80,20,5,0.4)');
        grad.addColorStop(1, 'rgba(80,20,5,0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
    }

    for (let i = 0; i < 12; i++) {
        const x = Math.random() * size;
        const y = Math.random() * size;
        const r = 20 + Math.random() * 60;
        const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
        grad.addColorStop(0, 'rgba(180,80,30,0.5)');
        grad.addColorStop(1, 'rgba(180,80,30,0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
    }

    for (let i = 0; i < 25; i++) {
        const x = Math.random() * size;
        const y = Math.random() * size;
        const r = 3 + Math.random() * 18;
        const g1 = ctx.createRadialGradient(x, y, r * 0.3, x, y, r);
        g1.addColorStop(0, 'rgba(0,0,0,0)');
        g1.addColorStop(0.7, 'rgba(40,5,0,0.5)');
        g1.addColorStop(1, 'rgba(60,10,0,0.7)');
        ctx.fillStyle = g1;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = 'rgba(200,100,50,0.3)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.stroke();
    }

    ctx.strokeStyle = 'rgba(40,5,0,0.4)';
    ctx.lineWidth = 1.5;
    for (let i = 0; i < 8; i++) {
        ctx.beginPath();
        let px = Math.random() * size;
        let py = Math.random() * size;
        ctx.moveTo(px, py);
        for (let j = 0; j < 6; j++) {
            px += (Math.random() - 0.5) * 60;
            py += (Math.random() - 0.5) * 40;
            ctx.lineTo(px, py);
        }
        ctx.stroke();
    }

    const iceGrad = ctx.createRadialGradient(size / 2, 0, 0, size / 2, 0, size * 0.25);
    iceGrad.addColorStop(0, 'rgba(230,220,210,0.8)');
    iceGrad.addColorStop(0.6, 'rgba(200,180,170,0.3)');
    iceGrad.addColorStop(1, 'rgba(200,180,170,0)');
    ctx.fillStyle = iceGrad;
    ctx.fillRect(0, 0, size, size * 0.2);

    for (let i = 0; i < 5; i++) {
        const x = Math.random() * size;
        const y = size * 0.3 + Math.random() * size * 0.4;
        const r = 40 + Math.random() * 80;
        const g = ctx.createRadialGradient(x, y, 0, x, y, r);
        g.addColorStop(0, 'rgba(180,100,40,0.25)');
        g.addColorStop(1, 'rgba(180,100,40,0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
    }

    return new CanvasTexture(canvas);
}

function createKisanTexture() {
    const size = 512;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#0A1A3A';
    ctx.fillRect(0, 0, size, size);

    for (let i = 0; i < 15; i++) {
        const x = Math.random() * size;
        const y = Math.random() * size;
        const r = 40 + Math.random() * 100;
        const g = ctx.createRadialGradient(x, y, 0, x, y, r);
        g.addColorStop(0, 'rgba(10,40,100,0.5)');
        g.addColorStop(1, 'rgba(10,40,100,0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
    }

    const continents = [
        { x: 120, y: 180, rx: 90, ry: 70 },
        { x: 310, y: 150, rx: 70, ry: 85 },
        { x: 200, y: 320, rx: 110, ry: 60 },
        { x: 390, y: 300, rx: 65, ry: 75 },
        { x: 80, y: 380, rx: 55, ry: 45 },
        { x: 450, y: 180, rx: 45, ry: 55 },
    ];

    continents.forEach(c => {
        ctx.save();
        ctx.translate(c.x, c.y);
        ctx.scale(c.rx / 50, c.ry / 50);

        const cg = ctx.createRadialGradient(0, 0, 0, 0, 0, 50);
        cg.addColorStop(0, 'rgba(60,90,30,0.95)');
        cg.addColorStop(0.5, 'rgba(45,75,20,0.9)');
        cg.addColorStop(0.8, 'rgba(80,60,20,0.7)');
        cg.addColorStop(1, 'rgba(80,60,20,0)');
        ctx.fillStyle = cg;
        ctx.beginPath();
        ctx.arc(0, 0, 50, 0, Math.PI * 2);
        ctx.fill();

        for (let m = 0; m < 6; m++) {
            const mx = (Math.random() - 0.5) * 60;
            const my = (Math.random() - 0.5) * 60;
            const mr = 8 + Math.random() * 20;
            const mg = ctx.createRadialGradient(mx, my, 0, mx, my, mr);
            mg.addColorStop(0, 'rgba(100,90,50,0.7)');
            mg.addColorStop(1, 'rgba(100,90,50,0)');
            ctx.fillStyle = mg;
            ctx.beginPath();
            ctx.arc(mx, my, mr, 0, Math.PI * 2);
            ctx.fill();
        }

        for (let d = 0; d < 4; d++) {
            const dx = (Math.random() - 0.5) * 70;
            const dy = (Math.random() - 0.5) * 70;
            const dr = 5 + Math.random() * 15;
            ctx.fillStyle = `rgba(150,130,60,0.4)`;
            ctx.beginPath();
            ctx.arc(dx, dy, dr, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();
    });

    const topIce = ctx.createRadialGradient(size / 2, 0, 0, size / 2, 0, size * 0.18);
    topIce.addColorStop(0, 'rgba(240,248,255,0.95)');
    topIce.addColorStop(0.7, 'rgba(220,235,255,0.5)');
    topIce.addColorStop(1, 'rgba(220,235,255,0)');
    ctx.fillStyle = topIce;
    ctx.fillRect(0, 0, size, size * 0.15);

    const botIce = ctx.createRadialGradient(size / 2, size, 0, size / 2, size, size * 0.15);
    botIce.addColorStop(0, 'rgba(240,248,255,0.9)');
    botIce.addColorStop(1, 'rgba(240,248,255,0)');
    ctx.fillStyle = botIce;
    ctx.fillRect(0, size * 0.88, size, size * 0.12);

    for (let i = 0; i < 20; i++) {
        const cx = Math.random() * size;
        const cy = Math.random() * size;
        const cr = 20 + Math.random() * 70;
        const cg = ctx.createRadialGradient(cx, cy, 0, cx, cy, cr);
        cg.addColorStop(0, 'rgba(255,255,255,0.55)');
        cg.addColorStop(0.4, 'rgba(255,255,255,0.25)');
        cg.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = cg;
        ctx.save();
        ctx.translate(cx, cy);
        ctx.scale(2.5, 1);
        ctx.beginPath();
        ctx.arc(0, 0, cr / 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    return new CanvasTexture(canvas);
}

function createNyayTexture() {
    const size = 512;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#C8882A';
    ctx.fillRect(0, 0, size, size);

    const bands = [
        { y: 0, h: 35, color: 'rgba(180,120,40,0.9)' },
        { y: 35, h: 25, color: 'rgba(220,190,130,0.8)' },
        { y: 60, h: 40, color: 'rgba(140,80,20,0.85)' },
        { y: 100, h: 30, color: 'rgba(240,210,150,0.75)' },
        { y: 130, h: 50, color: 'rgba(160,90,25,0.9)' },
        { y: 180, h: 35, color: 'rgba(220,180,100,0.7)' },
        { y: 215, h: 45, color: 'rgba(130,70,15,0.85)' },
        { y: 260, h: 30, color: 'rgba(245,215,155,0.75)' },
        { y: 290, h: 55, color: 'rgba(170,100,30,0.9)' },
        { y: 345, h: 35, color: 'rgba(200,160,80,0.7)' },
        { y: 380, h: 40, color: 'rgba(140,75,20,0.85)' },
        { y: 420, h: 45, color: 'rgba(220,185,110,0.75)' },
        { y: 465, h: 47, color: 'rgba(160,95,25,0.9)' },
    ];

    bands.forEach(b => {
        ctx.fillStyle = b.color;
        ctx.fillRect(0, b.y, size, b.h);
    });

    for (let b = 0; b < 12; b++) {
        const baseY = b * (size / 12);
        ctx.beginPath();
        ctx.moveTo(0, baseY);
        for (let x = 0; x <= size; x += 8) {
            const wave = Math.sin(x * 0.03 + b) * 6 + Math.sin(x * 0.08 + b * 2) * 3;
            ctx.lineTo(x, baseY + wave);
        }
        ctx.strokeStyle = `rgba(100,50,10,0.2)`;
        ctx.lineWidth = 3;
        ctx.stroke();
    }

    const storms = [
        { x: 180, y: 230, rx: 45, ry: 28, color: 'rgba(180,80,20,0.7)' },
        { x: 380, y: 150, rx: 20, ry: 13, color: 'rgba(200,100,30,0.6)' },
        { x: 80, y: 350, rx: 15, ry: 10, color: 'rgba(160,70,15,0.5)' },
    ];

    storms.forEach(s => {
        ctx.save();
        ctx.translate(s.x, s.y);
        ctx.scale(s.rx, s.ry);
        const sg = ctx.createRadialGradient(0, 0, 0.3, 0, 0, 1);
        sg.addColorStop(0, 'rgba(240,180,80,0.9)');
        sg.addColorStop(0.4, s.color);
        sg.addColorStop(0.8, 'rgba(120,50,10,0.5)');
        sg.addColorStop(1, 'rgba(120,50,10,0)');
        ctx.fillStyle = sg;
        ctx.beginPath();
        ctx.arc(0, 0, 1, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        ctx.save();
        ctx.translate(s.x, s.y);
        for (let a = 0; a < Math.PI * 2; a += 0.4) {
            const r1 = s.rx * 0.3;
            const r2 = s.rx * 0.9;
            ctx.beginPath();
            ctx.moveTo(Math.cos(a) * r1, Math.sin(a) * r1 * (s.ry / s.rx));
            ctx.quadraticCurveTo(
                Math.cos(a + 0.5) * r1 * 1.5, Math.sin(a + 0.5) * r1 * 1.5 * (s.ry / s.rx),
                Math.cos(a + 0.8) * r2, Math.sin(a + 0.8) * r2 * (s.ry / s.rx)
            );
            ctx.strokeStyle = 'rgba(255,200,100,0.15)';
            ctx.lineWidth = 1;
            ctx.stroke();
        }
        ctx.restore();
    });

    for (let i = 0; i < 8; i++) {
        const sx = Math.random() * size;
        const sy = Math.random() * size;
        const sr = 30 + Math.random() * 60;
        const sg = ctx.createRadialGradient(sx, sy, 0, sx, sy, sr);
        sg.addColorStop(0, 'rgba(255,230,150,0.12)');
        sg.addColorStop(1, 'rgba(255,230,150,0)');
        ctx.fillStyle = sg;
        ctx.beginPath();
        ctx.arc(sx, sy, sr, 0, Math.PI * 2);
        ctx.fill();
    }

    return new CanvasTexture(canvas);
}


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
    const audio = useAudio();
    const angleRef = useRef(initialAngle);

    const styling = useMemo(() => {
        if (id === 'praan') return {
            map: createPraanTexture(),
            color: 0xFFFFFF, emissive: 0x220500, emissiveIntensity: 0.15, shininess: 8, specular: 0x331100,
            glowColor: '#FF3D3D', glowScale: 0.5, glowOpacity: 0.20
        };
        if (id === 'kisan') return {
            map: createKisanTexture(),
            color: 0xFFFFFF, emissive: 0x001A08, emissiveIntensity: 0.12, shininess: 35, specular: 0x1144AA,
            glowColor: '#00CC66', glowScale: 0.45, glowOpacity: 0.18
        };
        // nyay
        return {
            map: createNyayTexture(),
            color: 0xFFFFFF, emissive: 0x1A0E00, emissiveIntensity: 0.15, shininess: 20, specular: 0x443300,
            glowColor: '#FFCC00', glowScale: 0.40, glowOpacity: 0.18
        };
    }, [id, radius]);

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
        return new CanvasTexture(canvas);
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
                emissiveIntensity: isClicked ? styling.emissiveIntensity * 3 : (hovered ? styling.emissiveIntensity * 2 : styling.emissiveIntensity),
                opacity: baseOpacity,
                transparent: isDimmed,
                duration: 0.3
            });

            if (spriteRef.current) gsap.to(spriteRef.current.material, { opacity: hovered ? styling.glowOpacity * 2 : (isDimmed ? 0.05 : styling.glowOpacity), duration: 0.3 });
            if (trailRef.current) gsap.to(trailRef.current.material.uniforms.uBaseOpacity, { value: baseOpacity, duration: 0.3 });
        }
    }, [hovered, isDimmed, isClicked, styling.emissiveIntensity, styling.glowOpacity]);

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
                onClick={(e) => { e.stopPropagation(); audio.playClick(); onPlanetClick(id, meshGroupRef.current.position); }}
            >
                <mesh ref={planetRef} frustumCulled={false}>
                    <sphereGeometry args={[radius, 64, 64]} />
                    <meshPhongMaterial
                        map={styling.map}
                        color={new Color(styling.color)}
                        emissive={new Color(styling.emissive)}
                        emissiveIntensity={styling.emissiveIntensity}
                        shininess={styling.shininess}
                        specular={new Color(styling.specular)}
                    />

                    <sprite ref={spriteRef} scale={[styling.glowScale, styling.glowScale, 1]}>
                        <spriteMaterial map={glowTexture} transparent blending={AdditiveBlending} depthWrite={false} opacity={styling.glowOpacity} />
                    </sprite>

                    {id === 'kisan' && (
                        <mesh>
                            <sphereGeometry args={[0.175, 64, 64]} />
                            <meshPhongMaterial color={0x4488FF} transparent opacity={0.08} side={BackSide} />
                        </mesh>
                    )}

                    {id === 'nyay' && (
                        <mesh rotation-x={Math.PI * 0.38}>
                            <ringGeometry args={[0.20, 0.36, 128]} />
                            <meshBasicMaterial color={0xD4A44C} side={DoubleSide} transparent opacity={0.35} />
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
