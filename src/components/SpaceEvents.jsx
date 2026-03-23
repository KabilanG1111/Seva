import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function spawnMeteor() {
    const group = new THREE.Group()
    const geo = new THREE.SphereGeometry(0.04 + Math.random() * 0.04, 8, 8)
    const mat = new THREE.MeshPhongMaterial({
        color: 0x664422,
        emissive: 0xFF6600,
        emissiveIntensity: 0.4,
        shininess: 5,
    })
    const rock = new THREE.Mesh(geo, mat)
    group.add(rock)

    for (let i = 1; i <= 8; i++) {
        const tGeo = new THREE.SphereGeometry(0.025 * (1 - i / 10), 6, 6)
        const tMat = new THREE.MeshBasicMaterial({
            color: i < 4 ? 0xFF6600 : 0xFF3300,
            transparent: true,
            opacity: (1 - i / 10) * 0.7,
        })
        const tail = new THREE.Mesh(tGeo, tMat)
        tail.position.x = i * 0.08  // trail behind
        group.add(tail)
    }
    return group
}

function spawnAsteroid() {
    const geo = new THREE.IcosahedronGeometry(0.08 + Math.random() * 0.08, 1)
    const positions = geo.attributes.position
    for (let i = 0; i < positions.count; i++) {
        positions.setXYZ(i,
            positions.getX(i) * (0.7 + Math.random() * 0.6),
            positions.getY(i) * (0.7 + Math.random() * 0.6),
            positions.getZ(i) * (0.7 + Math.random() * 0.6)
        )
    }
    geo.computeVertexNormals()

    const mat = new THREE.MeshPhongMaterial({
        color: 0x554433,
        emissive: 0x221100,
        emissiveIntensity: 0.1,
        shininess: 3,
        flatShading: true,
    })

    const mesh = new THREE.Mesh(geo, mat)
    mesh.userData.rotX = (Math.random() - 0.5) * 0.04
    mesh.userData.rotY = (Math.random() - 0.5) * 0.03
    mesh.userData.rotZ = (Math.random() - 0.5) * 0.02

    return mesh
}

function spawnComet() {
    const group = new THREE.Group()
    const coreGeo = new THREE.SphereGeometry(0.05, 16, 16)
    const coreMat = new THREE.MeshPhongMaterial({
        color: 0xCCEEFF,
        emissive: 0x88CCFF,
        emissiveIntensity: 1.2,
        shininess: 100,
        specular: new THREE.Color(0xFFFFFF),
    })
    const core = new THREE.Mesh(coreGeo, coreMat)
    group.add(core)

    const coreLight = new THREE.PointLight(0x88CCFF, 1.5, 2.0)
    group.add(coreLight)

    for (let i = 0; i < 60; i++) {
        const tGeo = new THREE.SphereGeometry(0.008, 4, 4)
        const tMat = new THREE.MeshBasicMaterial({
            color: i % 3 === 0 ? 0xAADDFF : 0xCCEEFF,
            transparent: true,
            opacity: Math.random() * 0.5 + 0.1,
        })
        const t = new THREE.Mesh(tGeo, tMat)
        const dist = 0.1 + Math.random() * 1.2
        const spread = (dist / 1.2) * 0.4
        t.position.set(dist, (Math.random() - 0.5) * spread, (Math.random() - 0.5) * spread * 0.3)
        group.add(t)
    }
    return group
}

function spawnAsteroidCluster() {
    const group = new THREE.Group()
    const count = 6 + Math.floor(Math.random() * 7)

    for (let i = 0; i < count; i++) {
        const size = 0.03 + Math.random() * 0.07
        const geo = new THREE.IcosahedronGeometry(size, 1)
        const positions = geo.attributes.position
        for (let v = 0; v < positions.count; v++) {
            positions.setXYZ(v,
                positions.getX(v) * (0.7 + Math.random() * 0.6),
                positions.getY(v) * (0.7 + Math.random() * 0.6),
                positions.getZ(v) * (0.7 + Math.random() * 0.6))
        }
        geo.computeVertexNormals()
        const mat = new THREE.MeshPhongMaterial({
            color: 0x554433,
            emissive: 0x110800,
            shininess: 2,
            flatShading: true,
        })
        const rock = new THREE.Mesh(geo, mat)
        rock.position.set((Math.random() - 0.5) * 1.5, (Math.random() - 0.5) * 0.8, (Math.random() - 0.5) * 0.5)
        rock.userData.rotX = (Math.random() - 0.5) * 0.05
        rock.userData.rotY = (Math.random() - 0.5) * 0.04
        group.add(rock)
    }
    return group
}

function spawnShootingStar() {
    const geo = new THREE.PlaneGeometry(0.8 + Math.random() * 0.8, 0.008)
    const mat = new THREE.MeshBasicMaterial({
        color: 0xFFFFFF,
        transparent: true,
        opacity: 0.85,
    })
    const streak = new THREE.Mesh(geo, mat)
    streak.userData.isShootingStar = true
    return streak
}

function spawnBlackHole() {
    const group = new THREE.Group()

    const geo = new THREE.SphereGeometry(0.18, 32, 32)
    const mat = new THREE.MeshBasicMaterial({ color: 0x000000 })
    const hole = new THREE.Mesh(geo, mat)
    group.add(hole)

    const diskGeo = new THREE.RingGeometry(0.22, 0.55, 128)
    const diskMat = new THREE.MeshBasicMaterial({
        color: 0xFF6600,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.85,
    })
    const disk = new THREE.Mesh(diskGeo, diskMat)
    disk.rotation.x = Math.PI * 0.15
    group.add(disk)

    const innerGeo = new THREE.RingGeometry(0.21, 0.32, 128)
    const innerMat = new THREE.MeshBasicMaterial({
        color: 0xFFDD88,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.95,
    })
    const inner = new THREE.Mesh(innerGeo, innerMat)
    inner.rotation.x = Math.PI * 0.15
    group.add(inner)

    const diskLight = new THREE.PointLight(0xFF6600, 2.0, 5.0)
    group.add(diskLight)

    group.userData.isBlackHole = true
    group.userData.diskRef = disk
    group.userData.innerRef = inner
    return group
}

export default function SpaceEvents() {
    const groupRef = useRef();
    const spawnedEventsRef = useRef([]);
    const stateRef = useRef({
        lastEventType: -1,
        nextEventTime: 8000 + Math.random() * 4000,
        lastSpawnTime: Date.now()
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

    const spawnSpaceEvent = () => {
        const type = getRandomEventType();
        const fromLeft = Math.random() > 0.5;
        const startX = fromLeft ? -8 : 8;
        const endX = fromLeft ? 8 : -8;

        // Position constraint from prompt: Z = -3 to -5
        const startY = (Math.random() - 0.5) * 3;
        const startZ = -3 - Math.random() * 2.5;

        let eventObj, speed, duration;

        switch (type) {
            case 0: // Meteor
                eventObj = spawnMeteor();
                speed = 0.06 + Math.random() * 0.04;
                duration = 3000;
                eventObj.rotation.z = fromLeft ? 0.3 : -0.3;
                break;
            case 1: // Asteroid
                eventObj = spawnAsteroid();
                speed = 0.015 + Math.random() * 0.01;
                duration = 12000;
                break;
            case 2: // Comet
                eventObj = spawnComet();
                speed = 0.035 + Math.random() * 0.02;
                duration = 6000;
                eventObj.rotation.z = fromLeft ? 0.1 : -0.1;
                break;
            case 3: // Cluster
                eventObj = spawnAsteroidCluster();
                speed = 0.012 + Math.random() * 0.008;
                duration = 14000;
                break;
            case 4: // Shooting star
                eventObj = spawnShootingStar();
                speed = 0.15;
                duration = 1500;
                break;
            case 5: // Black hole
                eventObj = spawnBlackHole();
                speed = 0.008;
                duration = 20000;
                break;
        }

        eventObj.position.set(startX, startY, startZ);
        eventObj.userData.speed = speed;
        eventObj.userData.endX = endX;
        eventObj.userData.fromLeft = fromLeft;
        eventObj.userData.type = type;
        eventObj.userData.startTime = Date.now();
        eventObj.userData.duration = duration;

        if (groupRef.current) {
            groupRef.current.add(eventObj);
            spawnedEventsRef.current.push(eventObj);
        }
    };

    useFrame(() => {
        const now = Date.now();
        const st = stateRef.current;

        if (now - st.lastSpawnTime > st.nextEventTime) {
            spawnSpaceEvent();
            st.lastSpawnTime = now;
            st.nextEventTime = 8000 + Math.random() * 4000;
        }

        const events = spawnedEventsRef.current;
        for (let i = events.length - 1; i >= 0; i--) {
            const ev = events[i];
            const dir = ev.userData.fromLeft ? 1 : -1;
            const elapsed = now - ev.userData.startTime;

            // Move across screen
            ev.position.x += ev.userData.speed * dir;

            if (ev.userData.type === 1) { // Asteroid
                ev.rotation.x += ev.userData.rotX || 0.02;
                ev.rotation.y += ev.userData.rotY || 0.015;
                ev.rotation.z += ev.userData.rotZ || 0.01;
            }
            if (ev.userData.type === 3) { // Cluster
                ev.children.forEach(child => {
                    child.rotation.x += child.userData.rotX || 0.02;
                    child.rotation.y += child.userData.rotY || 0.015;
                });
            }
            if (ev.userData.isBlackHole) {
                if (ev.userData.diskRef) ev.userData.diskRef.rotation.z += 0.02;
                if (ev.userData.innerRef) ev.userData.innerRef.rotation.z -= 0.03;
            }
            if (ev.userData.type === 4) { // Shooting star
                const progress = elapsed / ev.userData.duration;
                if (ev.material) ev.material.opacity = (1 - progress) * 0.85;
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
            if (Math.abs(ev.position.x) > 9 || elapsed > ev.userData.duration) {
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
