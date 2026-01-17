
/**
 * Realistic AQI Data Generator for Delhi NCR
 * Includes seasonal, time-of-day, and area-specific variations.
 */

export const AREAS = [
    { id: 'anand-vihar', name: 'Anand Vihar', baseAQI: 240, type: 'Industrial' },
    { id: 'cp', name: 'Connaught Place', baseAQI: 180, type: 'Commercial' },
    { id: 'dwarka', name: 'Dwarka Sector 8', baseAQI: 160, type: 'Residential' },
    { id: 'rohini', name: 'Rohini', baseAQI: 210, type: 'Residential' },
    { id: 'noida', name: 'Noida Sector 62', baseAQI: 175, type: 'Mixed' },
    { id: 'gurgaon', name: 'Gurgaon Cyber City', baseAQI: 165, type: 'Commercial' },
    { id: 'faridabad', name: 'Faridabad', baseAQI: 195, type: 'Industrial' },
    { id: 'ghaziabad', name: 'Ghaziabad', baseAQI: 230, type: 'Industrial' },
    { id: 'rk-puram', name: 'RK Puram', baseAQI: 155, type: 'Residential' },
    { id: 'punjabi-bagh', name: 'Punjabi Bagh', baseAQI: 170, type: 'Residential' },
    { id: 'okhla', name: 'Okhla Phase 2', baseAQI: 225, type: 'Industrial' },
    { id: 'najafgarh', name: 'Najafgarh', baseAQI: 150, type: 'Mixed' },
    { id: 'shadipur', name: 'Shadipur', baseAQI: 250, type: 'Industrial' },
    { id: 'karol-bagh', name: 'Karol Bagh', baseAQI: 190, type: 'Commercial' },
    { id: 'lodhi-road', name: 'Lodhi Road', baseAQI: 130, type: 'Residential' },
    { id: 'igi', name: 'IGI Airport (T3)', baseAQI: 160, type: 'Transport' },
    { id: 'bawana', name: 'Bawana', baseAQI: 260, type: 'Industrial' },
    { id: 'mundka', name: 'Mundka', baseAQI: 270, type: 'Industrial' },
    { id: 'alipur', name: 'Alipur', baseAQI: 165, type: 'Mixed' },
    { id: 'nehru-nagar', name: 'Nehru Nagar', baseAQI: 185, type: 'Residential' },
    { id: 'jahangirpuri', name: 'Jahangirpuri', baseAQI: 255, type: 'Industrial' },
    { id: 'wazirpur', name: 'Wazirpur', baseAQI: 265, type: 'Industrial' },
    { id: 'aurobindo', name: 'Sri Aurobindo Marg', baseAQI: 145, type: 'Mixed' },
    { id: 'patparganj', name: 'Patparganj', baseAQI: 180, type: 'Industrial' },
    { id: 'sonia-vihar', name: 'Sonia Vihar', baseAQI: 175, type: 'Residential' }
];

export const SEASONAL_FACTORS = {
    0: 1.5, // Jan (Peak)
    1: 1.3, // Feb
    2: 1.1, // Mar
    3: 0.9, // Apr
    4: 1.2, // May (Dust)
    5: 0.8, // Jun
    6: 0.5, // Jul (Monsoon)
    7: 0.6, // Aug
    8: 0.8, // Sep
    9: 1.8, // Oct (Stubble)
    10: 2.2, // Nov (Peak)
    11: 1.7, // Dec
};

export const getAirQualityLevel = (aqi) => {
    if (aqi <= 50) return { label: 'Good', color: '#10B981', textColor: 'text-success', description: 'Air quality is satisfactory.' };
    if (aqi <= 100) return { label: 'Satisfactory', color: '#84CC16', textColor: 'text-success', description: 'Minor breathing discomfort to sensitive people.' };
    if (aqi <= 200) return { label: 'Moderate', color: '#EAB308', textColor: 'text-warning', description: 'Breathing discomfort to people with lungs/asthma/heart diseases.' };
    if (aqi <= 300) return { label: 'Poor', color: '#F97316', textColor: 'text-warning', description: 'Breathing discomfort to most people on prolonged exposure.' };
    if (aqi <= 400) return { label: 'Very Poor', color: '#EF4444', textColor: 'text-danger', description: 'Respiratory illness on prolonged exposure.' };
    return { label: 'Severe', color: '#7C3AED', textColor: 'text-purple-500', description: 'Affects healthy people and seriously impacts those with existing diseases.' };
};

export const calculatePollutants = (aqi) => ({
    pm25: Math.round(aqi * 0.65), // Matched to screenshot ratio (273/418)
    pm10: Math.round(aqi * 0.92), // Matched to screenshot ratio (387/418)
    no2: Math.round(aqi * 0.09),  // Matched to screenshot ratio (38/418)
    so2: Math.round(aqi * 0.007), // Matched to screenshot ratio (3/418)
    co: Math.round(aqi * 2.4),    // ppb scale from screenshot
});

export const getCurrentAQI = (areaId, date = new Date()) => {
    const area = AREAS.find(a => a.id === areaId) || AREAS[0];
    const hour = date.getHours();
    const month = date.getMonth();
    const day = date.getDay();

    let multiplier = 1.0;

    // Time-of-day multipliers
    if (hour >= 8 && hour <= 10) multiplier *= 1.25; // Morning rush
    else if (hour >= 18 && hour <= 21) multiplier *= 1.35; // Evening rush
    else if (hour >= 23 || hour <= 4) multiplier *= 0.75; // Night dip

    // Weekend effect
    if (day === 0 || day === 6) multiplier *= 0.9;

    // Seasonal effect
    multiplier *= SEASONAL_FACTORS[month];

    // Random variance
    const noise = (Math.random() * 0.2) + 0.9; // 0.9 to 1.1

    let finalAQI = Math.round(area.baseAQI * multiplier * noise);

    // Cap at a realistic peak for historical accuracy in Delhi
    return Math.min(650, finalAQI);
};

export const getAllAreasData = () => {
    return AREAS.map(area => {
        const aqi = getCurrentAQI(area.id);
        const level = getAirQualityLevel(aqi);
        return {
            ...area,
            aqi,
            ...level,
            pollutants: calculatePollutants(aqi)
        };
    });
};

export const getHistoricalMonthlyData = (areaId) => {
    const area = AREAS.find(a => a.id === areaId) || AREAS[0];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    return months.map((name, index) => ({
        name,
        aqi: Math.round(area.baseAQI * SEASONAL_FACTORS[index] * (0.9 + Math.random() * 0.2))
    }));
};

// NEW: Missing function for Source Attribution
export const calculateSources = (areaId, hour, month) => {
    const area = AREAS.find(a => a.id === areaId) || AREAS[0];

    // Base Distribution based on Area Type
    let base = { Vehicular: 30, Industrial: 20, Construction: 15, Stubble: 5, Other: 30 };

    if (area.type === 'Industrial') base = { Vehicular: 25, Industrial: 45, Construction: 10, Stubble: 5, Other: 15 };
    else if (area.type === 'Commercial') base = { Vehicular: 50, Industrial: 10, Construction: 15, Stubble: 5, Other: 20 };
    else if (area.type === 'Residential') base = { Vehicular: 25, Industrial: 10, Construction: 20, Stubble: 5, Other: 40 };

    // Time of Day Adjustments
    if (hour >= 8 && hour <= 11) base.Vehicular += 15; // Morning Rush
    if (hour >= 17 && hour <= 21) base.Vehicular += 20; // Evening Rush
    if (hour >= 10 && hour <= 16) base.Industrial += 10; // Peak Factory Hours

    // Seasonal Adjustments (Stubble Burning in Oct/Nov)
    if (month === 9 || month === 10) base.Stubble += 25;

    // Normalize to 100%
    const total = Object.values(base).reduce((a, b) => a + b, 0);
    return Object.keys(base).map(name => ({
        name,
        value: Math.round((base[name] / total) * 100)
    })).sort((a, b) => b.value - a.value);
};

// NEW: Procedural generation for high-density map
export const generateDenseNetwork = () => {
    const mainAreas = getAllAreasData(); // Real areas
    const syntheticPoints = [];

    // Delhi NCR Bounding Box
    const bounds = { n: 28.85, s: 28.35, e: 77.45, w: 76.90 };
    const count = 150; // High density

    for (let i = 0; i < count; i++) {
        const lat = bounds.s + Math.random() * (bounds.n - bounds.s);
        const lng = bounds.w + Math.random() * (bounds.e - bounds.w);

        // Randomize AQI mostly in poor/severe range for Delhi
        const baseAQI = 180 + Math.random() * 250;
        const aqi = Math.round(baseAQI);
        const level = getAirQualityLevel(aqi);

        syntheticPoints.push({
            id: `sensor-${i}`,
            name: `Sensor node ${1000 + i}`,
            coords: [lat, lng], // Direct coords for map
            aqi,
            ...level,
            pollutants: calculatePollutants(aqi),
            isSynthetic: true
        });
    }

    // Merge: For mainAreas, we need to add 'coords' property if missing, 
    // but Map3D handles that via AREA_COORDS lookups. 
    // To unify, let's just return the list. Map3D will handle the merge logic.
    return syntheticPoints;
};
