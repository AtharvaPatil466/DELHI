/**
 * Advanced AQI Forecasting Engine (Mock)
 * Simulates Gradient Boosting model for time-series forecasting.
 */

import { getCurrentAQI } from './dataGenerator';
import mlForecastData from '../../ml/output/aqi_forecast.json';

export const getMLForecast = () => {
    return mlForecastData.aqi_forecast.map(item => ({
        time: new Date(item.date).toLocaleDateString([], { month: 'short', day: 'numeric' }),
        timestamp: new Date(item.date).toISOString(),
        aqi: item.aqi,
        confidenceLow: Math.round(item.aqi * 0.9),
        confidenceHigh: Math.round(item.aqi * 1.1),
        isML: true
    }));
};

export const predictAQI = (areaId, hours = 24) => {
    // If requesting longer than 72h, use the ML model output (7 days)
    if (hours > 72) {
        return getMLForecast();
    }

    const predictions = [];
    const now = new Date();
    const currentAQI = getCurrentAQI(areaId, now);

    for (let i = 1; i <= hours; i++) {
        const futureDate = new Date(now.getTime() + i * 60 * 60 * 1000);
        let predictedAQI = getCurrentAQI(areaId, futureDate);

        // Add trend component
        const trend = i * (Math.random() * 2 - 0.8); // Slight upward trend simulation
        predictedAQI += trend;

        // Confidence intervals
        const variance = i * 1.5; // Uncertainty grows with time

        predictions.push({
            time: futureDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            timestamp: futureDate.toISOString(),
            aqi: Math.round(predictedAQI),
            confidenceLow: Math.round(predictedAQI - variance),
            confidenceHigh: Math.round(predictedAQI + variance),
        });
    }

    return predictions;
};

export const generateForecastInsights = (predictions) => {
    const current = predictions[0].aqi;
    const last = predictions[predictions.length - 1].aqi;
    const diff = ((last - current) / current) * 100;

    const insights = [];

    if (diff > 10) {
        insights.push({
            type: 'warning',
            trend: 'Upward',
            severity: 'High',
            text: `AQI expected to rise by ${Math.abs(Math.round(diff))}% in next 24-72 hours due to predicted low wind speeds.`,
        });
    } else if (diff < -10) {
        insights.push({
            type: 'success',
            trend: 'Downward',
            severity: 'Low',
            text: `AQI projected to improve by ${Math.abs(Math.round(diff))}% over the next 48 hours due to expected rainfall.`,
        });
    } else {
        insights.push({
            type: 'success',
            trend: 'Stable',
            severity: 'Medium',
            text: `Air Quality is expected to remain stable with minor fluctuations during rush hours.`,
        });
    }

    // Add a general atmospheric insight
    insights.push({
        type: 'info',
        text: 'Thermal inversion layers are currently hindering vertical dispersion in the morning hours.'
    });

    return insights;
};

export const getAccuracyMetrics = () => {
    return [
        { label: 'Mean Abs Error', value: '14.2', unit: 'AQI' },
        { label: 'Root Mean Sq Error', value: '18.5', unit: 'AQI' },
        { label: 'R-Squared', value: '0.89', unit: 'coeff' },
        { label: 'Model Confidence', value: '87.5', unit: '%' },
    ];
};
