// All score computation functions
export function computeCropHealthScore(solarRadiation, precipitation7d, avgHumidity, avgTemperature) {
    const solarGain = (solarRadiation / 25) * 30;
    const precipGain = precipitation7d > 5 ? 25 : 10;
    const humidityGain = avgHumidity < 75 ? 25 : 15;
    const tempGain = avgTemperature < 35 ? 20 : 10;
    return Math.round(solarGain + precipGain + humidityGain + tempGain);
}

export function computeNdviEstimate(cropHealthScore) {
    return parseFloat((0.3 + (cropHealthScore / 100) * 0.65).toFixed(2));
}

export function computeSoilMoisture(precipitation7d, avgHumidity) {
    return Math.min(95, Math.round(precipitation7d * 3 + avgHumidity * 0.3));
}

export function computeDiseaseProbability(humidity, temperature) {
    // Only compute if conditions are favorable for disease
    if (humidity > 60 && temperature > 24) {
        return Math.min(95, Math.round((humidity - 60) * 1.2 + (temperature - 25) * 0.8 + Math.random() * 5));
    }
    return Math.max(0, Math.round((humidity - 50) * 0.5 + (temperature - 20) * 0.3));
}

export function getDiseaseThreatLevel(probability) {
    if (probability < 20) return 'LOW';
    if (probability < 50) return 'MODERATE';
    return 'HIGH';
}

export function getMandiRecommendation(weeklyChange) {
    if (weeklyChange > 3) return 'HOLD FOR 12 DAYS';
    if (weeklyChange < -2) return 'SELL NOW';
    return 'SELL FOR PROFIT';
}

export function getMandiRecommendationReason(weeklyChange) {
    if (weeklyChange > 3) {
        return `Prices trending up ${weeklyChange}% this week. Projected peak ₹4,800 in 12 days.`;
    }
    if (weeklyChange < -2) {
        return `Prices declining ${weeklyChange}% this week. Market may stabilize tomorrow.`;
    }
    return `Prices stable this week. Moderate profit margin available now.`;
}

export function getMoistureTrend(currentMoisture, previousMoisture = null) {
    if (!previousMoisture || previousMoisture === null) return '+0';
    const diff = currentMoisture - previousMoisture;
    return diff >= 0 ? `+${diff}` : `${diff}`;
}

export function getMoistureStatus(moisture) {
    if (moisture < 30) return 'LOW - NEEDS IRRIGATION';
    if (moisture < 60) return 'OPTIMAL';
    if (moisture < 80) return 'ADEQUATE';
    return 'HIGH - DRAINAGE ADVISED';
}

export function getTemperatureStatus(temp) {
    if (temp < 15) return 'COLD - GROWTH SLOWED';
    if (temp < 25) return 'COOL - ACCEPTABLE';
    if (temp < 35) return 'NORMAL';
    if (temp < 40) return 'WARM - STRESS RISK';
    return 'HOT - CRITICAL';
}

export function formatDate(isoString) {
    if (!isoString) return new Date().toISOString();
    return new Date(isoString).toISOString();
}

export function getDateRange() {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const formatDate = (date) => date.toISOString().split('T')[0].replace(/-/g, '');
    
    return {
        start: formatDate(sevenDaysAgo),
        end: formatDate(yesterday)
    };
}
