/**
 * Health Advisory & Recommendation System
 * Provides personalized health tips based on AQI levels and demographics.
 */

export const HEALTH_CATEGORIES = {
    GOOD: { min: 0, max: 50, label: 'Safe', advice: 'Safe for all outdoor activities.' },
    MODERATE: { min: 51, max: 100, label: 'Moderate', advice: 'Unusually sensitive people should limit prolonged exertion.' },
    SENSITIVE: { min: 101, max: 200, label: 'Unhealthy for Sensitive Groups', advice: 'Children and elderly should reduce outdoor activities.' },
    UNHEALTHY: { min: 201, max: 300, label: 'Unhealthy', advice: 'Everyone should avoid prolonged exertion. Use N95 masks.' },
    VERY_UNHEALTHY: { min: 301, max: 400, label: 'Very Unhealthy', advice: 'Avoid all outdoor activities. Use air purifiers indoors.' },
    HAZARDOUS: { min: 401, max: 5000, label: 'Hazardous', advice: 'Health emergency. Stay indoors. Close all windows.' },
};

export const ADVISORIES_BY_GROUP = {
    children: {
        low: "Safe to play outside.",
        medium: "Take frequent breaks during outdoor play.",
        high: "Limit outdoor play. Consider indoor activities.",
        critical: "Keep children indoors. Schools may implement emergency closures."
    },
    elderly: {
        low: "Safe for morning walks.",
        medium: "Limit prolonged outdoor exertion.",
        high: "Stay indoors. Monitor respiratory symptoms closely.",
        critical: "High risk. Avoid all outdoor exposure. Keep medical help on standby."
    },
    respiratory: {
        low: "Maintain regular medication schedule.",
        medium: "Keep inhaler handy during outdoor movement.",
        high: "Avoid outdoors. Use air purifier in the bedroom.",
        critical: "Medical emergency risk. Seek care if symptoms worsen even slightly."
    },
    pregnant: {
        low: "Normal activities are safe.",
        medium: "Avoid high-traffic areas during peak hours.",
        high: "Stay indoors in filtered air. Avoid outdoor exercise.",
        critical: "Strict indoor protocol recommended to protect fetal development."
    }
};

export const getHealthAdvisory = (aqi) => {
    if (aqi <= 50) return HEALTH_CATEGORIES.GOOD;
    if (aqi <= 100) return HEALTH_CATEGORIES.MODERATE;
    if (aqi <= 200) return HEALTH_CATEGORIES.SENSITIVE;
    if (aqi <= 300) return HEALTH_CATEGORIES.UNHEALTHY;
    if (aqi <= 400) return HEALTH_CATEGORIES.VERY_UNHEALTHY;
    return HEALTH_CATEGORIES.HAZARDOUS;
};

export const getPersonalizedTips = (aqi, group) => {
    const level = aqi <= 100 ? 'low' : aqi <= 250 ? 'medium' : aqi <= 400 ? 'high' : 'critical';
    return ADVISORIES_BY_GROUP[group]?.[level] || HEALTH_CATEGORIES.UNHEALTHY.advice;
};

export const recommendMaskType = (aqi) => {
    if (aqi < 100) return 'No mask required for general population.';
    if (aqi < 200) return 'Cloth mask or surgical mask recommended in crowded areas.';
    if (aqi < 350) return 'N95 Respirator strongly recommended for all outdoor activities.';
    return 'N99 or N100 Respirator mandatory. Ensure airtight seal.';
};

export const predictHealthRisk = (aqi, exposureHours, vulnerabilityScore = 1) => {
    // Simple risk index calculation
    const baseRisk = (aqi / 100) * exposureHours * vulnerabilityScore;
    return Math.min(100, Math.round(baseRisk));
};
