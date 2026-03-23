import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group, SphereGeometry, MeshPhongMaterial, Mesh, MeshBasicMaterial, IcosahedronGeometry, PointLight, PlaneGeometry, RingGeometry, DoubleSide, Color } from 'three';

// --- RANDOM FOREGROUND/BACKGROUND EVENTS ---
function spawnMeteor() {
    const group = new Group()
    const geo = new SphereGeometry(0.04 + Math.random() * 0.04, 8, 8)
    const mat = new MeshPhongMaterial({
        color: 0x664422, emissive: 0xFF6600, emissiveIntensity: 0.4, shininess: 5,
    })
    const rock = new Mesh(geo, mat)
    group.add(rock)

    for (let i = 1; i <= 8; i++) {
        const tGeo = new SphereGeometry(0.025 * (1 - i / 10), 6, 6)
        const tMat = new MeshBasicMaterial({
            color: i < 4 ? 0xFF6600 : 0xFF3300, transparent: true, opacity: (1 - i / 10) * 0.7,
        })
        const tail = new Mesh(tGeo, tMat)
        tail.position.x = i * 0.08
        group.add(tail)
    }
    return group
}

function spawnAsteroid() {
    const geo = new IcosahedronGeometry(0.08 + Math.random() * 0.08, 1)
    const pos = geo.attributes.position
    for (let i = 0; i < pos.count; i++) {
        pos.setXYZ(i, pos.getX(i) * (0.7 + Math.random() * 0.6), pos.getY(i) * (0.7 + Math.random() * 0.6), pos.getZ(i) * (0.7 + Math.random() * 0.6))
    }
    geo.computeVertexNormals()

    const mat = new MeshPhongMaterial({
        color: 0x554433, emissive: 0x221100, emissiveIntensity: 0.1, shininess: 3, flatShading: true,
    })
    const mesh = new Mesh(geo, mat)
    mesh.userData = { rotX: (Math.random() - 0.5) * 0.04, rotY: (Math.random() - 0.5) * 0.03, rotZ: (Math.random() - 0.5) * 0.02 }

    return mesh
}

function spawnComet() {
    const group = new Group()
    const coreGeo = new SphereGeometry(0.05, 16, 16)
    const coreMat = new MeshPhongMaterial({
        color: 0xCCEEFF, emissive: 0x88CCFF, emissiveIntensity: 1.2, shininess: 100, specular: new Color(0xFFFFFF),
    })
    const core = new Mesh(coreGeo, coreMat)
    group.add(core)

    const coreLight = new PointLight(0x88CCFF, 1.5, 2.0)
    group.add(coreLight)

    for (let i = 0; i < 60; i++) {
        const tGeo = new SphereGeometry(0.008, 4, 4)
        const tMat = new MeshBasicMaterial({
            color: i % 3 === 0 ? 0xAADDFF : 0xCCEEFF, transparent: true, opacity: Math.random() * 0.5 + 0.1,
        })
        const t = new Mesh(tGeo, tMat)
        const dist = 0.1 + Math.random() * 1.2
        const spread = (dist / 1.2) * 0.4
        t.position.set(dist, (Math.random() - 0.5) * spread, (Math.random() - 0.5) * spread * 0.3)
        group.add(t)
    }
    return group
}

function spawnAsteroidCluster() {
    const group = new Group()
    const count = 6 + Math.floor(Math.random() * 7)

    for (let i = 0; i < count; i++) {
        const size = 0.03 + Math.random() * 0.07
        const geo = new IcosahedronGeometry(size, 1)
        const pos = geo.attributes.position
        for (let v = 0; v < pos.count; v++) {
            pos.setXYZ(v, pos.getX(v) * (0.7 + Math.random() * 0.6), pos.getY(v) * (0.7 + Math.random() * 0.6), pos.getZ(v) * (0.7 + Math.random() * 0.6))
        }
        geo.computeVertexNormals()
        const mat = new MeshPhongMaterial({ color: 0x554433, emissive: 0x110800, shininess: 2, flatShading: true })
        const rock = new Mesh(geo, mat)
        rock.position.set((Math.random() - 0.5) * 1.5, (Math.random() - 0.5) * 0.8, (Math.random() - 0.5) * 0.5)
        rock.userData = { rotX: (Math.random() - 0.5) * 0.05, rotY: (Math.random() - 0.5) * 0.04 }
        group.add(rock)
    }
    return group
}

function spawnShootingStar() {
    const geo = new PlaneGeometry(0.8 + Math.random() * 0.8, 0.008)
    const mat = new MeshBasicMaterial({ color: 0xFFFFFF, transparent: true, opacity: 0.85 })
    const streak = new Mesh(geo, mat)
    streak.userData.isShootingStar = true
    return streak
}

function spawnBlackHole() {
    const group = new Group()

    const geo = new SphereGeometry(0.18, 32, 32)
    const mat = new MeshBasicMaterial({ color: 0x000000 })
    const hole = new Mesh(geo, mat)
    group.add(hole)

    const diskGeo = new RingGeometry(0.22, 0.55, 128)
    const diskMat = new MeshBasicMaterial({ color: 0xFF6600, side: DoubleSide, transparent: true, opacity: 0.85 })
    const disk = new Mesh(diskGeo, diskMat)
    disk.rotation.x = Math.PI * 0.15
    group.add(disk)

    const innerGeo = new RingGeometry(0.21, 0.32, 128)
    const innerMat = new MeshBasicMaterial({ color: 0xFFDD88, side: DoubleSide, transparent: true, opacity: 0.95 })
    const inner = new Mesh(innerGeo, innerMat)
    inner.rotation.x = Math.PI * 0.15
    group.add(inner)

    const diskLight = new PointLight(0xFF6600, 2.0, 5.0)
    group.add(diskLight)

    group.userData = { isBlackHole: true, diskRef: disk, innerRef: inner }
    return group
}

// --- EXACT TIMED EVENTS ---

function spawnTimedAsteroid() {
    const fromLeft = Math.random() > 0.5;
    const dir = fromLeft ? 1 : -1;
    const geo = new IcosahedronGeometry(0.06 + Math.random() * 0.06, 1);
    const pos = geo.attributes.position;

    for (let i = 0; i < pos.count; i++) {
        pos.setXYZ(i, pos.getX(i) * (0.65 + Math.random() * 0.7), pos.getY(i) * (0.65 + Math.random() * 0.7), pos.getZ(i) * (0.65 + Math.random() * 0.7));
    }
    geo.computeVertexNormals();

    const mat = new MeshPhongMaterial({
        color: 0x6B5544, emissive: 0x110800, emissiveIntensity: 0.08, shininess: 4, flatShading: true,
    });

    const mesh = new Mesh(geo, mat);
    mesh.position.set(fromLeft ? -9 : 9, (Math.random() - 0.5) * 3, -3.5 - Math.random() * 2);

    mesh.userData = {
        isTimed: true,
        direction: dir,
        speed: 0.012 + Math.random() * 0.008,
        rotX: (Math.random() - 0.5) * 0.04,
        rotY: (Math.random() - 0.5) * 0.035,
        rotZ: (Math.random() - 0.5) * 0.025,
        startTime: Date.now(),
        duration: 15000,
        type: 'timedAsteroid'
    };
    return mesh;
}

function spawnTimedMeteoroid() {
    const fromLeft = Math.random() > 0.5;
    const dir = fromLeft ? 1 : -1;
    const group = new Group();

    const coreGeo = new SphereGeometry(0.025 + Math.random() * 0.02, 8, 8);
    const coreMat = new MeshPhongMaterial({
        color: 0x884422, emissive: 0xFF4400, emissiveIntensity: 0.9, shininess: 10,
    });
    const core = new Mesh(coreGeo, coreMat);
    group.add(core);

    for (let i = 1; i <= 10; i++) {
        const tSize = 0.018 * (1 - i * 0.08);
        const tGeo = new SphereGeometry(Math.max(tSize, 0.004), 5, 5);
        const tColor = i < 4 ? 0xFF5500 : i < 7 ? 0xFF2200 : 0xAA1100;
        const tMat = new MeshBasicMaterial({
            color: tColor, transparent: true, opacity: Math.max(0.05, (1 - i / 12) * 0.8),
        });
        const tail = new Mesh(tGeo, tMat);
        tail.position.x = i * 0.07 * (fromLeft ? 1 : -1);
        tail.position.y = (Math.random() - 0.5) * 0.02;
        group.add(tail);
    }

    for (let s = 0; s < 6; s++) {
        const sGeo = new SphereGeometry(0.005, 4, 4);
        const sMat = new MeshBasicMaterial({ color: 0xFFAA00, transparent: true, opacity: 0.6 });
        const spark = new Mesh(sGeo, sMat);
        spark.position.set((Math.random() - 0.5) * 0.06, (Math.random() - 0.5) * 0.06, (Math.random() - 0.5) * 0.04);
        group.add(spark);
    }

    group.position.set(fromLeft ? -9 : 9, (Math.random() - 0.5) * 2.5, -2.5 - Math.random() * 2);
    group.rotation.z = fromLeft ? -(0.1 + Math.random() * 0.3) : (0.1 + Math.random() * 0.3);

    group.userData = {
        isTimed: true,
        direction: dir,
        speed: 0.07 + Math.random() * 0.04,
        startTime: Date.now(),
        duration: 2500,
        type: 'timedMeteoroid'
    };
    return group;
}

function spawnTimedComet() {
    const fromLeft = Math.random() > 0.5;
    const dir = fromLeft ? 1 : -1;
    const group = new Group();

    const nucGeo = new SphereGeometry(0.07, 20, 20);
    const nucMat = new MeshPhongMaterial({
        color: 0xDDEEFF, emissive: 0x99CCFF, emissiveIntensity: 1.0, shininess: 120, specular: new Color(0xFFFFFF),
    });
    const nucleus = new Mesh(nucGeo, nucMat);
    group.add(nucleus);

    const comaCanvas = document.createElement('canvas');
    comaCanvas.width = 64; comaCanvas.height = 64;
    const comaCtx = comaCanvas.getContext('2d');
    const comaGrad = comaCtx.createRadialGradient(32, 32, 0, 32, 32, 32);
    comaGrad.addColorStop(0, 'rgba(180,220,255,0.8)');
    comaGrad.addColorStop(0.3, 'rgba(140,200,255,0.3)');
    comaGrad.addColorStop(1, 'rgba(100,180,255,0)');
    comaCtx.fillStyle = comaGrad;
    comaCtx.fillRect(0, 0, 64, 64);
    const comaSprite = new Sprite(new SpriteMaterial({
        map: new CanvasTexture(comaCanvas), transparent: true, blending: AdditiveBlending, depthWrite: false, opacity: 0.7,
    }));
    comaSprite.scale.set(0.5, 0.5, 1);
    group.add(comaSprite);

    for (let i = 0; i < 80; i++) {
        const dist = 0.1 + Math.random() * 2.0;
        const spread = (dist / 2.0) * 0.35;
        const tGeo = new SphereGeometry(0.006 + Math.random() * 0.006, 4, 4);
        const tMat = new MeshBasicMaterial({
            color: Math.random() > 0.5 ? 0xAADDFF : 0xCCEEFF, transparent: true, opacity: Math.random() * 0.55 + 0.1, blending: AdditiveBlending, depthWrite: false,
        });
        const t = new Mesh(tGeo, tMat);
        t.position.set(dist * (fromLeft ? 1 : -1), (Math.random() - 0.5) * spread, (Math.random() - 0.5) * spread * 0.4);
        group.add(t);
    }

    for (let i = 0; i < 50; i++) {
        const dist = 0.15 + Math.random() * 1.4;
        const spread = (dist / 1.4) * 0.5;
        const curve = dist * 0.12;
        const tGeo = new SphereGeometry(0.007 + Math.random() * 0.007, 4, 4);
        const tMat = new MeshBasicMaterial({
            color: 0xDDCC88, transparent: true, opacity: Math.random() * 0.3 + 0.05, blending: AdditiveBlending, depthWrite: false,
        });
        const t = new Mesh(tGeo, tMat);
        t.position.set(dist * (fromLeft ? 1 : -1), (Math.random() - 0.5) * spread + curve, (Math.random() - 0.5) * spread * 0.3);
        group.add(t);
    }

    const nucLight = new PointLight(0x88BBFF, 0.8, 1.5);
    group.add(nucLight);

    group.position.set(fromLeft ? -10 : 10, (Math.random() - 0.5) * 2.5, -3 - Math.random() * 2.5);

    group.userData = {
        isTimed: true, direction: dir, speed: 0.028 + Math.random() * 0.015,
        startTime: Date.now(), duration: 9000, type: 'timedComet', nucleusRef: nucleus,
    };
    return group;
}

export default function SpaceEvents() {
    const groupRef = useRef();
    const spawnedEventsRef = useRef([]);

    const stateRef = useRef({
        lastEventType: -1,
        nextEventTime: 8000 + Math.random() * 4000,
        lastSpawnTime: Date.now()
    });

    const timedSchedule = useRef({
        asteroid: { interval: 30000, lastFired: 0 },
        meteoroid: { interval: 20000, lastFired: Date.now() - 15000 },
        comet: { interval: 40000, lastFired: 0 },
    });

    const getRandomEventType = () => {
        let type;
        do {
            const rand = Math.random();
            if (rand < 0.28) type = 0;
            else if (rand < 0.50) type = 1;
            else if (rand < 0.68) type = 2;
            else if (rand < 0.82) type = 3;
            else if (rand < 0.94) type = 4;
            else type = 5;
        } while (type === stateRef.current.lastEventType);
        stateRef.current.lastEventType = type;
        return type;
    };

    const spawnRandomEvent = () => {
        const type = getRandomEventType();
        const fromLeft = Math.random() > 0.5;
        const startX = fromLeft ? -8 : 8;
        const endX = fromLeft ? 8 : -8;
        const startY = (Math.random() - 0.5) * 3;
        const startZ = -3 - Math.random() * 2.5;

        let eventObj, speed, duration;

        switch (type) {
            case 0:
                eventObj = spawnMeteor(); speed = 0.06 + Math.random() * 0.04; duration = 3000; eventObj.rotation.z = fromLeft ? 0.3 : -0.3; break;
            case 1:
                eventObj = spawnAsteroid(); speed = 0.015 + Math.random() * 0.01; duration = 12000; break;
            case 2:
                eventObj = spawnComet(); speed = 0.035 + Math.random() * 0.02; duration = 6000; eventObj.rotation.z = fromLeft ? 0.1 : -0.1; break;
            case 3:
                eventObj = spawnAsteroidCluster(); speed = 0.012 + Math.random() * 0.008; duration = 14000; break;
            case 4:
                eventObj = spawnShootingStar(); speed = 0.15; duration = 1500; break;
            case 5:
                eventObj = spawnBlackHole(); speed = 0.008; duration = 20000; break;
        }

        eventObj.position.set(startX, startY, startZ);
        Object.assign(eventObj.userData, {
            speed, endX, fromLeft, type, startTime: Date.now(), duration, isRandom: true
        });

        if (groupRef.current) {
            groupRef.current.add(eventObj);
            spawnedEventsRef.current.push(eventObj);
        }
    };

    useFrame(() => {
        const now = Date.now();
        const st = stateRef.current;
        const ts = timedSchedule.current;

        // --- RANDOM EVENTS LOOP ---
        if (now - st.lastSpawnTime > st.nextEventTime) {
            spawnRandomEvent();
            st.lastSpawnTime = now;
            st.nextEventTime = 8000 + Math.random() * 4000;
        }

        // --- TIMED EVENTS LOOP ---
        if (now - ts.asteroid.lastFired >= ts.asteroid.interval) {
            ts.asteroid.lastFired = now;
            const ev = spawnTimedAsteroid();
            groupRef.current.add(ev);
            spawnedEventsRef.current.push(ev);
        }
        if (now - ts.meteoroid.lastFired >= ts.meteoroid.interval) {
            ts.meteoroid.lastFired = now;
            const ev = spawnTimedMeteoroid();
            groupRef.current.add(ev);
            spawnedEventsRef.current.push(ev);
        }
        if (now - ts.comet.lastFired >= ts.comet.interval) {
            ts.comet.lastFired = now;
            const ev = spawnTimedComet();
            groupRef.current.add(ev);
            spawnedEventsRef.current.push(ev);
        }

        // --- UPDATE ACTIVE EVENTS ---
        const events = spawnedEventsRef.current;
        for (let i = events.length - 1; i >= 0; i--) {
            const ev = events[i];
            const elapsed = now - ev.userData.startTime;

            // Type-specific update logic
            if (ev.userData.isRandom) {
                const dir = ev.userData.fromLeft ? 1 : -1;
                ev.position.x += ev.userData.speed * dir;

                if (ev.userData.type === 1) { // Asteroid tumble
                    ev.rotation.x += ev.userData.rotX || 0.02; ev.rotation.y += ev.userData.rotY || 0.015; ev.rotation.z += ev.userData.rotZ || 0.01;
                } else if (ev.userData.type === 3) { // Cluster
                    ev.children.forEach(child => { child.rotation.x += child.userData.rotX || 0.02; child.rotation.y += child.userData.rotY || 0.015; });
                } else if (ev.userData.type === 5 && ev.userData.isBlackHole) {
                    if (ev.userData.diskRef) ev.userData.diskRef.rotation.z += 0.02;
                    if (ev.userData.innerRef) ev.userData.innerRef.rotation.z -= 0.03;
                } else if (ev.userData.type === 4) { // Shooting star
                    if (ev.material) ev.material.opacity = (1 - (elapsed / ev.userData.duration)) * 0.85;
                }
            } else if (ev.userData.isTimed) {
                ev.position.x += ev.userData.speed * ev.userData.direction;

                if (ev.userData.type === 'timedMeteoroid') {
                    // linear motion only
                } else if (ev.userData.type === 'timedAsteroid') {
                    ev.rotation.x += ev.userData.rotX; ev.rotation.y += ev.userData.rotY; ev.rotation.z += ev.userData.rotZ;
                } else if (ev.userData.type === 'timedComet') {
                    if (ev.userData.nucleusRef) ev.userData.nucleusRef.rotation.y += 0.015;
                }
            }

            // FADE OUT at end (last 15% of duration)
            const fadeOutStart = ev.userData.duration * 0.85;
            if (elapsed > fadeOutStart && ev.userData.type !== 4) {
                const fadeOut = 1 - (elapsed - fadeOutStart) / (ev.userData.duration * 0.15);
                ev.traverse(child => {
                    if (child.material && child.material.transparent) {
                        child.material.opacity *= Math.max(0, fadeOut);
                    }
                });
            }

            // Remove when crossed screen or expired
            if (Math.abs(ev.position.x) > 12 || elapsed > ev.userData.duration) {
                if (groupRef.current) groupRef.current.remove(ev);
                ev.traverse(child => {
                    if (child.geometry) child.geometry.dispose();
                    if (child.material) child.material.dispose();
                });
                events.splice(i, 1);
            }
        }
    });

    return <group ref={groupRef} />;
}
