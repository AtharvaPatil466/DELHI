import { getFireAttribution } from './satelliteData';

/**
 * Realistic AQI Data Generator for Delhi NCR
 * Includes seasonal, time-of-day, and area-specific variations.
 */

export const AREAS = [
    { id: 'anand-vihar', name: 'Anand Vihar', baseAQI: 460, type: 'Industrial', coords: [28.6476, 77.3158] },
    { id: 'cp', name: 'Connaught Place', baseAQI: 320, type: 'Commercial', coords: [28.6315, 77.2167] },
    { id: 'dwarka', name: 'Dwarka Sector 8', baseAQI: 360, type: 'Residential', coords: [28.5644, 77.0688] },
    { id: 'rohini', name: 'Rohini', baseAQI: 410, type: 'Residential', coords: [28.7303, 77.1084] },
    { id: 'noida', name: 'Noida Sector 62', baseAQI: 380, type: 'Mixed', coords: [28.6255, 77.3688] },
    { id: 'gurgaon', name: 'Gurgaon Cyber City', baseAQI: 340, type: 'Commercial', coords: [28.4952, 77.0891] },
    { id: 'faridabad', name: 'Faridabad', baseAQI: 390, type: 'Industrial', coords: [28.4089, 77.3178] },
    { id: 'ghaziabad', name: 'Ghaziabad', baseAQI: 430, type: 'Industrial', coords: [28.6692, 77.4538] },
    { id: 'rk-puram', name: 'RK Puram', baseAQI: 300, type: 'Residential', coords: [28.5660, 77.1767] },
    { id: 'punjabi-bagh', name: 'Punjabi Bagh', baseAQI: 370, type: 'Residential', coords: [28.6690, 77.1244] },
    { id: 'okhla', name: 'Okhla Phase 2', baseAQI: 420, type: 'Industrial', coords: [28.5372, 77.2730] },
    { id: 'najafgarh', name: 'Najafgarh', baseAQI: 310, type: 'Mixed', coords: [28.6090, 76.9850] },
    { id: 'shadipur', name: 'Shadipur', baseAQI: 440, type: 'Industrial', coords: [28.6517, 77.1581] },
    { id: 'karol-bagh', name: 'Karol Bagh', baseAQI: 350, type: 'Commercial', coords: [28.6513, 77.1907] },
    { id: 'lodhi-road', name: 'Lodhi Road', baseAQI: 280, type: 'Residential', coords: [28.5910, 77.2280] },
    { id: 'igi', name: 'IGI Airport (T3)', baseAQI: 330, type: 'Transport', coords: [28.5562, 77.0810] },
    { id: 'bawana', name: 'Bawana', baseAQI: 470, type: 'Industrial', coords: [28.7972, 77.0420] },
    { id: 'mundka', name: 'Mundka', baseAQI: 480, type: 'Industrial', coords: [28.6836, 77.0326] },
    { id: 'alipur', name: 'Alipur', baseAQI: 320, type: 'Mixed', coords: [28.8031, 77.1325] },
    { id: 'nehru-nagar', name: 'Nehru Nagar', baseAQI: 380, type: 'Residential', coords: [28.5678, 77.2450] },
    { id: 'jahangirpuri', name: 'Jahangirpuri', baseAQI: 465, type: 'Industrial', coords: [28.7350, 77.1780] },
    { id: 'wazirpur', name: 'Wazirpur', baseAQI: 475, type: 'Industrial', coords: [28.6990, 77.1650] },
    { id: 'aurobindo', name: 'Sri Aurobindo Marg', baseAQI: 290, type: 'Mixed', coords: [28.5410, 77.2020] },
    { id: 'patparganj', name: 'Patparganj', baseAQI: 410, type: 'Industrial', coords: [28.6230, 77.2990] },
    { id: 'sonia-vihar', name: 'Sonia Vihar', baseAQI: 390, type: 'Residential', coords: [28.7100, 77.2550] }
];

export const SEASONAL_FACTORS = {
    0: 2.2, // Jan (SEVERE CRISIS - Hackathon Mode)
    1: 1.8, // Feb
    2: 1.1, // Mar
    3: 0.9, // Apr
    4: 1.2, // May (Dust)
    5: 0.8, // Jun
    6: 0.5, // Jul (Monsoon)
    7: 0.6, // Aug
    8: 0.8, // Sep
    9: 1.8, // Oct (Stubble)
    10: 2.5, // Nov (Extreme Peak)
    11: 2.0, // Dec
};

export const getAirQualityLevel = (aqi) => {
    if (aqi <= 50) return { label: 'Good', color: '#10B981', textColor: 'text-success', description: 'Satisfactory.' };
    if (aqi <= 100) return { label: 'Satisfactory', color: '#84CC16', textColor: 'text-success', description: 'Minor breathing discomfort.' };
    if (aqi <= 200) return { label: 'Moderate', color: '#EAB308', textColor: 'text-warning', description: 'Breathing discomfort to sensitive people.' };
    if (aqi <= 300) return { label: 'Poor', color: '#F97316', textColor: 'text-warning', description: 'Immediate health impacts for sensitive groups.' };
    if (aqi <= 400) return { label: 'Very Poor', color: '#EF4444', textColor: 'text-danger', description: 'Significant respiratory risk to all citizens.' };
    return { label: 'Severe / Hazardous', color: '#7E22CE', textColor: 'text-purple-900', description: 'CRITICAL: Severe health hazard. Emergency measures required.' }; // Purple for Hazardous
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

    // CRITICAL: Force synchronization to Severe levels for hackathon impact
    if (area.id === 'anand-vihar') return Math.max(485, Math.min(500, finalAQI));
    if (area.type === 'Industrial') return Math.max(420, finalAQI);

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

/**
 * Calculates total smoke impact from fires based on NW wind drift
 */
const calculateFireImpact = (fires) => {
    const DELHI_COORDS = [28.6139, 77.2090];
    let totalImpact = 0;

    fires.forEach(fire => {
        const [fLat, fLon] = fire.position;
        // Check if fire is North-West of Delhi (Stubble burning zone)
        if (fLat > DELHI_COORDS[0] && fLon < DELHI_COORDS[1]) {
            const distance = Math.sqrt(
                Math.pow(fLat - DELHI_COORDS[0], 2) +
                Math.pow(fLon - DELHI_COORDS[1], 2)
            );
            // Impact decreases with distance, increases with intensity
            const impact = (fire.intensity || 0.5) / (distance + 0.1);
            totalImpact += impact;
        }
    });

    return totalImpact * 5; // Scaling factor
};

// NEW: Missing function for Source Attribution
export const calculateSources = (areaId, hour, month) => {
    const area = AREAS.find(a => a.id === areaId) || AREAS[0];
    const attribution = getFireAttribution();

    // Base Distribution based on Area Type
    let base = { Vehicular: 30, Industrial: 20, Construction: 15, Stubble: 5, Other: 30 };

    if (area.type === 'Industrial') base = { Vehicular: 25, Industrial: 45, Construction: 10, Stubble: 5, Other: 15 };
    else if (area.type === 'Commercial') base = { Vehicular: 50, Industrial: 10, Construction: 15, Stubble: 5, Other: 20 };
    else if (area.type === 'Residential') base = { Vehicular: 25, Industrial: 10, Construction: 20, Stubble: 5, Other: 40 };

    // Dynamic Stubble Calculation from Satellite Feed
    const dynamicStubble = attribution.stubblePercentage;
    const isSatelliteVerified = attribution.totalFireCount > 0;

    base.Stubble = dynamicStubble;

    // Time of Day Adjustments
    if (hour >= 8 && hour <= 11) base.Vehicular += 15; // Morning Rush
    if (hour >= 17 && hour <= 21) base.Vehicular += 20; // Evening Rush
    if (hour >= 10 && hour <= 16) base.Industrial += 10; // Peak Factory Hours

    // Normalize to 100%
    const sourcesToNormalize = { ...base };
    const total = Object.values(sourcesToNormalize).reduce((a, b) => a + b, 0);

    return Object.keys(sourcesToNormalize).map(name => ({
        name,
        value: Math.round((sourcesToNormalize[name] / total) * 100),
        isSatelliteVerified: name === 'Stubble' ? isSatelliteVerified : false
    })).sort((a, b) => b.value - a.value);
};

// NEW: Procedural generation for high-density map
export const generateDenseNetwork = () => {
    const mainAreas = getAllAreasData(); // Real areas
    const syntheticPoints = [];

    // Delhi NCR Bounding Box
    const bounds = { n: 28.85, s: 28.35, e: 77.45, w: 76.90 };
    const count = 300; // Increased density

    for (let i = 0; i < count; i++) {
        const lat = bounds.s + Math.random() * (bounds.n - bounds.s);
        const lng = bounds.w + Math.random() * (bounds.e - bounds.w);

        // Randomize AQI mostly in poor/severe range for Delhi
        const baseAQI = 150 + Math.random() * 350;
        const aqi = Math.round(baseAQI);
        const level = getAirQualityLevel(aqi);

        syntheticPoints.push({
            id: `sensor-${i}`,
            name: `Sensor node ${1000 + i}`,
            coords: [lat, lng],
            aqi,
            ...level,
            pollutants: calculatePollutants(aqi),
            isSynthetic: true
        });
    }

    return [...mainAreas, ...syntheticPoints];
};

/**
 * Provides realistic environmental metrics for Delhi based on current time.
 */
export const getEnvironmentalData = (date = new Date()) => {
    const hour = date.getHours();
    const month = date.getMonth(); // 0 = Jan

    // Temperature base values by month (calibrated for current Jan conditions)
    const monthBaseTemp = {
        0: 12, 1: 15, 2: 20, 3: 28, 4: 34, 5: 36,
        6: 31, 7: 30, 8: 28, 9: 24, 10: 18, 11: 13
    };

    const baseTemp = monthBaseTemp[month] || 25;

    // Diurnal variation (Coolest at 5AM, Warmest at 3PM)
    const timeFactor = Math.cos(((hour - 15) * Math.PI) / 12); // Peaks at 15h
    const temperature = baseTemp + (timeFactor * 5); // +/- 5 degrees variation

    // Humidity (Higher in morning, lower in afternoon)
    const humidity = Math.round(60 - (timeFactor * 25) + (month === 6 || month === 7 ? 20 : 0));

    // Wind Speed (km/h) - Generally lower at night
    const windSpeed = (6 + Math.random() * 4) * (hour > 8 && hour < 20 ? 1.5 : 1);

    return {
        temp: Math.round(temperature),
        humidity: Math.min(100, Math.max(10, humidity)),
        windSpeed: windSpeed.toFixed(1)
    };
};
