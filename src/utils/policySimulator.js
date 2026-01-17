/**
 * Comprehensive Policy Simulation Engine
 * Predicts the impact of various air pollution control measures.
 */

export const POLICIES = [
    {
        id: 'odd-even',
        name: 'Odd-Even Vehicle Scheme',
        description: 'Restrict private vehicle usage based on license plate numbers.',
        reduction: 75, // AQI points
        annualCost: 50, // Crore INR
        livesSaved: 400,
        economicBenefit: 400, // Crore INR
        publicTransportLoad: 35, // % increase
        sourceImpact: 'Vehicular Emissions',
    },
    {
        id: 'cracker-ban',
        name: 'Complete Firecracker Ban',
        description: 'Total ban on firecracker manufacturing, sale, and use.',
        reduction: 60,
        annualCost: 10,
        livesSaved: 48,
        economicBenefit: -100, // Industry loss
        publicTransportLoad: 0,
        sourceImpact: 'Others',
    },
    {
        id: 'construction-ban',
        name: 'Construction Activity Halt',
        description: 'Suspension of all major construction projects during peak pollution.',
        reduction: 50,
        annualCost: 0,
        livesSaved: 300,
        economicBenefit: -200, // Industry loss
        publicTransportLoad: 0,
        sourceImpact: 'Construction Dust',
    },
    {
        id: 'industrial-scrubbing',
        name: 'Advanced Industrial Scrubbing',
        description: 'Mandatory installation of high-efficiency particulate scrubbers.',
        reduction: 40,
        annualCost: 500,
        livesSaved: 450,
        economicBenefit: 800,
        publicTransportLoad: 0,
        sourceImpact: 'Industrial Emissions',
    },
    {
        id: 'public-transport',
        name: 'Mass Transit Expansion',
        description: '50% increase in electric bus frequency and metro lines.',
        reduction: 45,
        annualCost: 300,
        livesSaved: 280,
        economicBenefit: 600,
        publicTransportLoad: -20, // Reduction in congestion
        sourceImpact: 'Vehicular Emissions',
    }
];

export const simulatePolicy = (activePolicyIds, currentAQI) => {
    let totalReduction = 0;
    let totalCost = 0;
    let totalLivesSaved = 0;
    let totalEconomicBenefit = 0;

    activePolicyIds.forEach(id => {
        const policy = POLICIES.find(p => p.id === id);
        if (policy) {
            // Synergistic effects: first policy is 100% effective, others 70%, 50%...
            const multiplier = Math.pow(0.8, totalReduction / 50);
            totalReduction += policy.reduction * multiplier;
            totalCost += policy.annualCost;
            totalLivesSaved += policy.livesSaved * multiplier;
            totalEconomicBenefit += policy.economicBenefit;
        }
    });

    const finalAQI = Math.max(25, currentAQI - totalReduction);
    const roi = totalCost > 0 ? ((totalEconomicBenefit - totalCost) / totalCost) * 100 : 0;

    return {
        initialAQI: currentAQI,
        finalAQI: Math.round(finalAQI),
        reduction: Math.round(currentAQI - finalAQI),
        totalCost,
        totalLivesSaved: Math.round(totalLivesSaved),
        totalEconomicBenefit,
        roi: roi.toFixed(1),
        recommendationScore: Math.min(100, Math.round((totalLivesSaved / 10) + (roi / 5))),
    };
};

export const calculateLivesSaved = (aqiReduction) => {
    // Standard epidemiological metric: ~0.8 lives per AQI point reduction per million population
    return Math.round(aqiReduction * 0.8 * 2); // For Delhi's population density factors
};
