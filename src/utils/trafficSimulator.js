// FILE: DELHI/src/utils/trafficSimulator.js

// This mimics the Python logic for immediate frontend rendering
export const generateTrafficData = () => {
    const locations = [
        { name: 'ITO Junction', base: 1.2 },
        { name: 'Anand Vihar', base: 1.5 },
        { name: 'Dhaula Kuan', base: 1.0 },
        { name: 'Cyber Hub', base: 1.1 }
    ];

    const hour = new Date().getHours();
    // Simple rush hour logic: 8-11am & 5-8pm are peak
    const isRushHour = (hour >= 8 && hour <= 11) || (hour >= 17 && hour <= 20);
    const multiplier = isRushHour ? 1.0 : 0.6;

    return locations.map(loc => {
        const noise = 0.9 + Math.random() * 0.2; // +/- 10% variance
        const load = loc.base * multiplier * noise;

        return {
            location: loc.name,
            traffic_index: Math.round(load * 100),
            vehicle_count: Math.round(1500 * load),
            pm25_contribution: Math.round(load * 85), // approx g/hr
            status: load > 1.2 ? 'Critical' : (load > 0.8 ? 'Heavy' : 'Normal')
        };
    });
};