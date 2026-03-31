import React, { useMemo } from 'react';

export default function StarField() {
    const bgPos = useMemo(() => {
        const arr = new Float32Array(4000 * 3);
        for (let i = 0; i < 4000; i++) {
            arr[i * 3] = (Math.random() - 0.5) * 300;
            arr[i * 3 + 1] = (Math.random() - 0.5) * 300;
            arr[i * 3 + 2] = (Math.random() - 0.5) * 150 - 20;
        }
        return arr;
    }, []);

    const midPos = useMemo(() => {
        const arr = new Float32Array(800 * 3);
        for (let i = 0; i < 800; i++) {
            arr[i * 3] = (Math.random() - 0.5) * 200;
            arr[i * 3 + 1] = (Math.random() - 0.5) * 200;
            arr[i * 3 + 2] = (Math.random() - 0.5) * 100 - 10;
        }
        return arr;
    }, []);

    const fgPos = useMemo(() => {
        const arr = new Float32Array(80 * 3);
        for (let i = 0; i < 80; i++) {
            arr[i * 3] = (Math.random() - 0.5) * 100;
            arr[i * 3 + 1] = (Math.random() - 0.5) * 100;
            arr[i * 3 + 2] = (Math.random() - 0.5) * 50 - 5;
        }
        return arr;
    }, []);

    return (
        <group>
            <points>
                <bufferGeometry>
                    <bufferAttribute attach="attributes-position" count={4000} array={bgPos} itemSize={3} />
                </bufferGeometry>
                <pointsMaterial color={0xBBCCDD} size={0.020} transparent opacity={0.55} sizeAttenuation={true} />
            </points>

            <points>
                <bufferGeometry>
                    <bufferAttribute attach="attributes-position" count={800} array={midPos} itemSize={3} />
                </bufferGeometry>
                <pointsMaterial color={0xCCDDEE} size={0.045} transparent opacity={0.80} sizeAttenuation={true} />
            </points>

            <points>
                <bufferGeometry>
                    <bufferAttribute attach="attributes-position" count={80} array={fgPos} itemSize={3} />
                </bufferGeometry>
                <pointsMaterial color={0xFFFFFF} size={0.09} transparent opacity={0.95} sizeAttenuation={true} />
            </points>
        </group>
    );
}
