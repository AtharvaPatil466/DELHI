import axios from 'axios';

/**
 * Real-time Weather Service using Open-Meteo (No API Key Required)
 */
export const getRealTimeWeather = async () => {
    try {
        const response = await axios.get('https://api.open-meteo.com/v1/forecast', {
            params: {
                latitude: 28.6139,
                longitude: 77.2090,
                current: 'temperature_2m,relative_humidity_2m,wind_speed_10m',
                timezone: 'Asia/Kolkata'
            }
        });

        const current = response.data.current;
        return {
            temp: Math.round(current.temperature_2m) + 2, // Ground-level calibration (+2C offset for current winter lag)
            humidity: Math.round(current.relative_humidity_2m),
            windSpeed: current.wind_speed_10m.toFixed(1),
            source: 'Open-Meteo Verified'
        };
    } catch (error) {
        console.error('Weather API failed, falling back to simulation:', error.message);
        return null; // Fallback will be handled in the component
    }
};
