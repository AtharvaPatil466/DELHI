export const SAMPLE_FORECAST_REASONING = {
    targetTime: "Tomorrow 9:00 AM",
    currentAQI: 352,
    predictedAQI: 387,
    change: 35,
    factors: [
        {
            id: 1,
            type: "positive",
            icon: "📈",
            title: "Historical Pattern",
            contribution: 40,
            percentage: 35,
            explanation: "Friday 9 AM typically shows 11% increase vs current levels. Based on analysis of 12 similar historical days.",
            confidence: 85
        },
        {
            id: 2,
            type: "positive",
            icon: "🌡️",
            title: "Thermal Inversion",
            contribution: 25,
            percentage: 22,
            explanation: "Planetary Boundary Layer (PBL) height forecast dropping from 450m to 180m. This traps pollutants near ground level.",
            confidence: 78
        },
        {
            id: 3,
            type: "positive",
            icon: "🚗",
            title: "Rush Hour Traffic",
            contribution: 22,
            percentage: 19,
            explanation: "Traffic density expected at 2.1x normal levels. Vehicular contribution will jump from 45% to 65% of total pollution.",
            confidence: 88
        },
        {
            id: 4,
            type: "positive",
            icon: "💨",
            title: "Low Wind Speed",
            contribution: 18,
            percentage: 16,
            explanation: "Wind speed forecast: 1.8 km/h (currently 8.4 km/h). Severely reduced pollutant dispersion expected.",
            confidence: 82
        },
        {
            id: 5,
            type: "negative",
            icon: "☀️",
            title: "Solar Radiation",
            contribution: -15,
            percentage: -13,
            explanation: "Midday solar heating will lift Planetary Boundary Layer and improve vertical mixing of pollutants.",
            confidence: 70
        }
    ],
    confidence: {
        overall: 84,
        weather: 92,
        traffic: 88,
        historical: 73
    }
};

export const VALIDATION_HISTORY = {
    history: [
        { date: "2026-01-15", time: "09:00", predicted: 345, actual: 352, error: -7, errorPercent: -2.0, status: "good" },
        { date: "2026-01-14", time: "09:00", predicted: 389, actual: 378, error: 11, errorPercent: 2.9, status: "good" },
        { date: "2026-01-13", time: "09:00", predicted: 312, actual: 298, error: 14, errorPercent: 4.7, status: "good" },
        { date: "2026-01-12", time: "09:00", predicted: 298, actual: 315, error: -17, errorPercent: -5.4, status: "acceptable" },
        { date: "2026-01-11", time: "09:00", predicted: 367, actual: 371, error: -4, errorPercent: -1.1, status: "good" },
        { date: "2026-01-10", time: "09:00", predicted: 401, actual: 395, error: 6, errorPercent: 1.5, status: "good" },
        { date: "2026-01-09", time: "09:00", predicted: 355, actual: 348, error: 7, errorPercent: 2.0, status: "good" },
        { date: "2026-01-08", time: "09:00", predicted: 330, actual: 345, error: -15, errorPercent: -4.3, status: "good" },
        { date: "2026-01-07", time: "09:00", predicted: 310, actual: 295, error: 15, errorPercent: 5.1, status: "good" },
        { date: "2026-01-06", time: "09:00", predicted: 280, actual: 305, error: -25, errorPercent: -8.2, status: "acceptable" },
        { date: "2026-01-05", time: "09:00", predicted: 265, actual: 272, error: -7, errorPercent: -2.6, status: "good" },
        { date: "2026-01-04", time: "09:00", predicted: 290, actual: 285, error: 5, errorPercent: 1.8, status: "good" },
        { date: "2026-01-03", time: "09:00", predicted: 320, actual: 342, error: -22, errorPercent: -6.4, status: "acceptable" },
        { date: "2026-01-02", time: "09:00", predicted: 350, actual: 348, error: 2, errorPercent: 0.6, status: "good" },
        { date: "2026-01-01", time: "09:00", predicted: 380, actual: 395, error: -15, errorPercent: -3.8, status: "good" },
        { date: "2025-12-31", time: "09:00", predicted: 410, actual: 405, error: 5, errorPercent: 1.2, status: "good" },
        { date: "2025-12-30", time: "09:00", predicted: 430, actual: 455, error: -25, errorPercent: -5.5, status: "acceptable" },
        { date: "2025-12-29", time: "09:00", predicted: 415, actual: 420, error: -5, errorPercent: -1.2, status: "good" },
        { date: "2025-12-28", time: "09:00", predicted: 390, actual: 375, error: 15, errorPercent: 4.0, status: "good" },
        { date: "2025-12-27", time: "09:00", predicted: 360, actual: 382, error: -22, errorPercent: -5.8, status: "acceptable" },
        { date: "2025-12-26", time: "09:00", predicted: 340, actual: 335, error: 5, errorPercent: 1.5, status: "good" },
        { date: "2025-12-25", time: "09:00", predicted: 320, actual: 312, error: 8, errorPercent: 2.6, status: "good" },
        { date: "2025-12-24", time: "09:00", predicted: 310, actual: 325, error: -15, errorPercent: -4.6, status: "good" },
        { date: "2025-12-23", time: "09:00", predicted: 330, actual: 318, error: 12, errorPercent: 3.8, status: "good" },
        { date: "2025-12-22", time: "09:00", predicted: 350, actual: 368, error: -18, errorPercent: -4.9, status: "acceptable" },
        { date: "2025-12-21", time: "09:00", predicted: 370, actual: 362, error: 8, errorPercent: 2.2, status: "good" },
        { date: "2025-12-20", time: "09:00", predicted: 390, actual: 408, error: -18, errorPercent: -4.4, status: "acceptable" },
        { date: "2025-12-19", time: "09:00", predicted: 400, actual: 392, error: 8, errorPercent: 2.0, status: "good" },
        { date: "2025-12-18", time: "09:00", predicted: 380, actual: 395, error: -15, errorPercent: -3.8, status: "good" },
        { date: "2025-12-17", time: "09:00", predicted: 360, actual: 352, error: 8, errorPercent: 2.3, status: "good" }
    ],
    metrics: {
        mae: 9.4,
        within15: 86,
        within25: 100,
        directionalAccuracy: 91,
        totalSamples: 7,
        rmse: 11.2,
        r2: 0.87
    }
};

export const REVISION_HISTORY = {
    targetTime: "2026-01-18 18:00",
    revisions: [
        {
            timestamp: "2026-01-17 08:00",
            prediction: 372,
            confidence: 78
        },
        {
            timestamp: "2026-01-17 14:00",
            prediction: 398,
            confidence: 84
        }
    ],
    changes: [
        {
            factor: "Wind Speed Forecast",
            oldValue: "6.2 km/h",
            newValue: "2.1 km/h",
            impact: 18,
            explanation: "Updated weather model shows lower wind speeds. Reduced dispersion expected."
        },
        {
            factor: "Stubble Burning Detection",
            oldValue: "12 fires",
            newValue: "55 fires",
            impact: 12,
            explanation: "Satellite imagery detected 43 new fire points in Punjab/Haryana region."
        },
        {
            factor: "Traffic Pattern",
            oldValue: "Normal Friday",
            newValue: "Heavy Friday",
            impact: 8,
            explanation: "Historical adjustment for heavier end-of-week traffic."
        },
        {
            factor: "Temperature Forecast",
            oldValue: "28°C",
            newValue: "26°C",
            impact: -6,
            explanation: "Slightly cooler temperatures reduce thermal effects."
        }
    ],
    netChange: 32,
    adjustedChange: 26,
    explanation: "This is normal refinement as we approach the forecast time and more real-time data becomes available."
};

export const SCENARIO_DATA = {
    baseForecast: {
        time: "Tomorrow 9 AM",
        aqi: 387,
        description: "Current prediction without any scenario changes"
    },
    scenarios: [
        {
            id: "rain",
            name: "If It Rains",
            icon: "🌧️",
            probability: 30,
            adjustedAQI: 298,
            impact: -89,
            impactPercent: -23,
            explanation: "Rainfall washout effect removes 60% of suspended PM. Historical data shows 85% reduction typical for >5mm rainfall.",
            conditions: { rainfall: ">5mm" },
            likelihood: "Low"
        },
        {
            id: "wind",
            name: "If Wind Picks Up",
            icon: "💨",
            probability: 20,
            adjustedAQI: 342,
            impact: -45,
            impactPercent: -12,
            explanation: "Wind speed >10 km/h improves dispersion by 40%. Pollutant mixing increases significantly.",
            conditions: { windSpeed: ">10 km/h" },
            likelihood: "Low-Mod"
        },
        {
            id: "stubble",
            name: "If More Stubble Fires",
            icon: "🔥",
            probability: 40,
            adjustedAQI: 428,
            impact: 41,
            impactPercent: 11,
            explanation: "Additional smoke from Punjab. Wind direction favorable for transport to Delhi.",
            conditions: { stubbleFires: "+50 fires" },
            likelihood: "Mod-High"
        },
        {
            id: "oddeven",
            name: "If Odd-Even Implemented",
            icon: "🚧",
            probability: null,
            adjustedAQI: 348,
            impact: -39,
            impactPercent: -10,
            explanation: "Vehicular reduction by 40%. Traffic contribution drops from 65% to 39% of total pollution.",
            conditions: { policy: "odd-even" },
            likelihood: "Policy"
        },
        {
            id: "construction_ban",
            name: "If Construction Halted",
            icon: "🏗️",
            probability: null,
            adjustedAQI: 372,
            impact: -15,
            impactPercent: -4,
            explanation: "Construction dust eliminated. Minor but measurable improvement.",
            conditions: { policy: "construction-ban" },
            likelihood: "Policy"
        }
    ]
};

export const MODEL_PERFORMANCE_DATA = {
    model: {
        name: "Weighted Time-Series Ensemble",
        algorithm: "Multi-feature regression with temporal encoding",
        version: "2.1.0",
        lastTrained: "2026-01-10"
    },
    training: {
        samples: 8760,
        period: "2019-2024 (3 years)",
        validationMethod: "5-fold cross-validation",
        testSetSize: "20%",
        features: 12
    },
    accuracy: {
        r2: 0.87,
        mae: 15.2,
        rmse: 21.8,
        mape: 8.3,
        within15: 86,
        within25: 100
    },
    featureImportance: [
        { name: "Recent AQI (1h)", importance: 40, description: "Most recent air quality measurement" },
        { name: "Yesterday (24h lag)", importance: 25, description: "24-hour lag feature captures daily patterns" },
        { name: "24h Average", importance: 15, description: "Rolling mean smooths short-term noise" },
        { name: "Trend Delta", importance: 8, description: "Rate of change indicates momentum" },
        { name: "Rush Hour", importance: 5, description: "Traffic pattern encoding" },
        { name: "Weekend", importance: 3, description: "Day-of-week influence" },
        { name: "Seasonal", importance: 4, description: "Monthly cyclical encoding" }
    ],
    trainingCurves: {
        epochs: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        trainLoss: [45.2, 32.1, 28.5, 25.3, 23.1, 21.9, 21.2, 20.8, 20.5, 20.3],
        valLoss: [46.8, 33.5, 29.8, 26.2, 24.1, 22.8, 22.3, 22.1, 21.9, 21.8]
    },
    errorDistribution: {
        bins: [-30, -25, -20, -15, -10, -5, 0, 5, 10, 15, 20, 25, 30],
        counts: [2, 5, 12, 28, 45, 78, 85, 80, 52, 35, 18, 8, 2]
    }
};
