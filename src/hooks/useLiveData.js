import { useState, useEffect } from 'react';

export function usePraanData() {
    const [donorCount, setDonorCount] = useState(2841);
    const [activeRequests, setActiveRequests] = useState(12);
    const [feedItems, setFeedItems] = useState([
        { id: '1', type: 'BLOOD', group: 'O-', location: 'AIIMS TRAUMA' },
        { id: '2', type: 'ORGAN', group: 'HEART', location: 'FORTIS ESCORTS' },
    ]);
    const [timeRemaining, setTimeRemaining] = useState(3 * 3600 + 47 * 60 + 22); // 03:47:22

    useEffect(() => {
        // Donor count cycles 2841-2856 every 8s
        const donorInt = setInterval(() => {
            setDonorCount(prev => prev >= 2856 ? 2841 : prev + 1);
        }, 8000 / 15);

        // Active requests random 12-18, new one added every 30s
        const reqInt = setInterval(() => {
            setActiveRequests(Math.floor(Math.random() * 7) + 12);
        }, 30000);

        // Feed items new request every 45s
        const feedInt = setInterval(() => {
            setFeedItems(prev => {
                const types = ['BLOOD', 'ORGAN'];
                const groups = ['A+', 'B+', 'O-', 'AB+', 'KIDNEY', 'LIVER'];
                const locs = ['MAX SAKET', 'APOLLO', 'AIIMS', 'SAFARDAJUNG', 'MEDANTA'];
                const nType = types[Math.floor(Math.random() * types.length)];
                let nGroup = groups[Math.floor(Math.random() * 4)];
                if (nType === 'ORGAN') nGroup = groups[4 + Math.floor(Math.random() * 2)];
                const nLoc = locs[Math.floor(Math.random() * locs.length)];

                const newItems = [{ id: Date.now().toString(), type: nType, group: nGroup, location: nLoc }, ...prev];
                return newItems.slice(0, 5); // Keep last 5
            });
        }, 45000);

        // Timer counts down in real time
        const timeInt = setInterval(() => {
            setTimeRemaining(prev => prev > 0 ? prev - 1 : 0);
        }, 1000);

        return () => {
            clearInterval(donorInt);
            clearInterval(reqInt);
            clearInterval(feedInt);
            clearInterval(timeInt);
        };
    }, []);

    const formatTime = (secs) => {
        const h = Math.floor(secs / 3600).toString().padStart(2, '0');
        const m = Math.floor((secs % 3600) / 60).toString().padStart(2, '0');
        const s = (secs % 60).toString().padStart(2, '0');
        return `${h}:${m}:${s}`;
    };

    return { donorCount, activeRequests, feedItems, formattedTime: formatTime(timeRemaining) };
}

export function useKisanData() {
    const [moisture, setMoisture] = useState(63);
    const [price, setPrice] = useState(2450);
    const diseaseProb = 91; // critical static
    const [temp, setTemp] = useState(32);

    useEffect(() => {
        // Soil moisture oscillates 58-68 over 20s
        let req;
        const animate = () => {
            const time = Date.now();
            setMoisture(63 + Math.sin(time / (20000 / (Math.PI * 2))) * 5);
            req = requestAnimationFrame(animate);
        };
        req = requestAnimationFrame(animate);

        // Mandi price new sliding price every 60s
        const priceInt = setInterval(() => {
            setPrice(2400 + Math.floor(Math.random() * 150));
        }, 60000);

        // Temp varies 31-33 slowly
        const tempInt = setInterval(() => {
            setTemp(31 + Math.random() * 2);
        }, 5000);

        return () => {
            cancelAnimationFrame(req);
            clearInterval(priceInt);
            clearInterval(tempInt);
        };
    }, []);

    return { moisture: moisture.toFixed(1), price, diseaseProb, temp: temp.toFixed(1) };
}
