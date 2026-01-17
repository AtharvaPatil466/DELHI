/**
 * AI-Powered Pollution Source Attribution Model (Mock)
 * Simulates a Random Forest Classifier output for source identification.
 */

export const calculateSourceAttribution = (area, time = new Date()) => {
    const hour = time.getHours();
    const month = time.getMonth();
    const isWeekend = time.getDay() === 0 || time.getDay() === 6;

    let vehicular = 40;
    let industrial = 25;
    let construction = 15;
    let stubble = 5;
    let others = 15;

    // Seasonal Stubble Burning (Oct-Nov)
    if (month === 9 || month === 10) {
        stubble = 35 + (Math.random() * 10);
        vehicular -= 10;
        industrial -= 10;
        construction -= 5;
        others -= 5;
    }

    // Rush Hour Vehicular Spike
    if ((hour >= 8 && hour <= 10) || (hour >= 17 && hour <= 21)) {
        const spike = isWeekend ? 10 : 25;
        vehicular += spike;
        industrial -= spike / 3;
        construction -= spike / 4;
        others -= spike / 4;
    }

    // Industrial Bias by Area
    if (['faridabad', 'ghaziabad', 'anand-vihar'].includes(area.id)) {
        industrial += 15;
        vehicular -= 5;
        construction -= 5;
        others -= 5;
    }

    // Normalize to 100%
    const total = vehicular + industrial + construction + stubble + others;
    const scale = 100 / total;

    return [
        { source: 'Vehicular Emissions', percentage: Math.round(vehicular * scale), color: '#3B82F6' },
        { source: 'Industrial Emissions', percentage: Math.round(industrial * scale), color: '#8B5CF6' },
        { source: 'Stubble Burning', percentage: Math.round(stubble * scale), color: '#EF4444' },
        { source: 'Construction Dust', percentage: Math.round(construction * scale), color: '#F59E0B' },
        { source: 'Others', percentage: Math.round(others * scale), color: '#6B7280' },
    ].sort((a, b) => b.percentage - a.percentage);
};

export const getConfidenceScore = () => {
    return 75 + Math.round(Math.random() * 20); // 75-95%
};

export const generateSourceExplanation = (attribution, areaName) => {
    const top = attribution[0];
    const second = attribution[1];

    let explanation = `${top.source} dominate (${top.percentage}%) in ${areaName}. `;

    if (top.source === 'Vehicular Emissions') {
        explanation += `High traffic density and low wind speeds (avg 2.1 km/h) are causing localized accumulation of PM2.5. `;
    } else if (top.source === 'Stubble Burning') {
        explanation += `Regional crop residue burning detected across Punjab/Haryana, contributing significantly to the current spike. `;
    } else if (top.source === 'Industrial Emissions') {
        explanation += `Proximity to heavy industrial clusters and stagnant air conditions are primary drivers of pollution levels. `;
    }

    explanation += `Secondary contribution from ${second.source} (${second.percentage}%) observed.`;
    return explanation;
};
