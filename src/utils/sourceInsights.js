import { SEASONAL_FACTORS } from './dataGenerator';

// Rich metadata about each area to power the AI insights
const AREA_METADATA = {
    'anand-vihar': {
        type: 'Industrial Hub',
        landmarks: ['ISBT Bus Terminal', 'Kaushambi Industrial Area', 'NH-24 Highway'],
        description: 'Major transport hub with heavy diesel bus traffic and proximity to industrial zones.',
        dominantFactors: { industrial: 0.45, vehicular: 0.35, dust: 0.1, stubble: 0.05, other: 0.05 },
        windSensitivity: 'High (East-West corridor)',
        constructionSites: 12
    },
    'cp': {
        type: 'Commercial Center',
        landmarks: ['Outer Circle Traffic', 'Metro Interchange', 'Commercial Complexes'],
        description: 'High vehicular density from commercial activity, moderate restaurant emissions.',
        dominantFactors: { industrial: 0.15, vehicular: 0.60, dust: 0.1, stubble: 0.05, other: 0.1 },
        windSensitivity: 'Moderate',
        constructionSites: 4
    },
    'dwarka': {
        type: 'Residential Zone',
        landmarks: ['IGI Airport Path', 'Metro Line', 'Residential Societies'],
        description: 'Residential area with intermittent construction activity and flight path emissions.',
        dominantFactors: { industrial: 0.1, vehicular: 0.35, dust: 0.40, stubble: 0.1, other: 0.05 },
        windSensitivity: 'Low',
        constructionSites: 18
    },
    'rohini': {
        type: 'Residential/Mixed',
        landmarks: ['Outer Ring Road', 'Waste Management Plants', 'Residential Blocks'],
        description: 'Mixed use area with significant inputs from waste management and local traffic.',
        dominantFactors: { industrial: 0.25, vehicular: 0.35, dust: 0.2, stubble: 0.1, other: 0.1 },
        windSensitivity: 'Moderate',
        constructionSites: 9
    },
    'noida': {
        type: 'Tech/Industrial',
        landmarks: ['Expressway', 'SEZ Zones', 'Construction Projects'],
        description: 'Rapidly developing zone with localized construction dust and highway traffic.',
        dominantFactors: { industrial: 0.3, vehicular: 0.3, dust: 0.3, stubble: 0.05, other: 0.05 },
        windSensitivity: 'High (Open plains)',
        constructionSites: 22
    },
    'gurgaon': {
        type: 'Corporate Hub',
        landmarks: ['Cyber Hub', 'NH-8', 'Diesel Generators'],
        description: 'High reliance on diesel generators during power cuts and heavy highway traffic.',
        dominantFactors: { industrial: 0.2, vehicular: 0.4, dust: 0.25, stubble: 0.05, other: 0.1 },
        windSensitivity: 'Moderate',
        constructionSites: 15
    },
    'faridabad': {
        type: 'Heavy Industrial',
        landmarks: ['Industrial Sectors', 'Brick Kilns', 'Thermal Power Plant'],
        description: 'Heavy industrial zone with clusters of manufacturing units and brick kilns.',
        dominantFactors: { industrial: 0.6, vehicular: 0.2, dust: 0.1, stubble: 0.05, other: 0.05 },
        windSensitivity: 'High',
        constructionSites: 8
    },
    'ghaziabad': {
        type: 'Industrial/Transit',
        landmarks: ['GT Road', 'Industrial Area', 'Rail Yards'],
        description: 'Dense industrial activity combined with heavy freight transport links.',
        dominantFactors: { industrial: 0.5, vehicular: 0.3, dust: 0.1, stubble: 0.05, other: 0.05 },
        windSensitivity: 'High',
        constructionSites: 14
    },
    'rk-puram': {
        type: 'Government Residential',
        landmarks: ['Ring Road', 'Embassies', 'Green Cover'],
        description: 'Protected green zone, primarily affected by surrounding traffic corridors.',
        dominantFactors: { industrial: 0.1, vehicular: 0.5, dust: 0.2, stubble: 0.1, other: 0.1 },
        windSensitivity: 'Low',
        constructionSites: 3
    },
    'punjabi-bagh': {
        type: 'West Delhi Transport',
        landmarks: ['Rohtak Road', 'Ring Road Junction', 'Commercial Markets'],
        description: 'Key junction point for heavy goods vehicles entering the city.',
        dominantFactors: { industrial: 0.2, vehicular: 0.5, dust: 0.15, stubble: 0.1, other: 0.05 },
        windSensitivity: 'Moderate',
        constructionSites: 6
    }
};

/**
 * Generates dynamic AI explanation text based on area, sources, weather, and time.
 */
export const generateSourceExplanation = (areaId, sources, weather, hour) => {
    const meta = AREA_METADATA[areaId] || AREA_METADATA['anand-vihar'];
    const dominantSource = getDominantSource(sources);

    let explanation = {
        primary: {},
        secondary: {},
        tertiary: []
    };

    // Primary Source Logic
    if (dominantSource.name === 'Industrial') {
        explanation.primary = {
            title: `Industrial Emissions (${dominantSource.value}%)`,
            factors: [
                `Proximity to ${meta.landmarks[1]} active zone`,
                `${meta.windSensitivity.split(' ')[0]} wind sensitivity carrying pollutants`,
                'Peak manufacturing shift activity correlates with elevated readings'
            ]
        };
    } else if (dominantSource.name === 'Vehicular') {
        explanation.primary = {
            title: `Vehicular Emissions (${dominantSource.value}%)`,
            factors: [
                `Heavy congestion on ${meta.landmarks[0]}`,
                `Evening rush hour (17:00-21:00) peak intensity`,
                'Diesel transport vehicle movement restrictions not yet active'
            ]
        };
    } else {
        explanation.primary = {
            title: `${dominantSource.name} (${dominantSource.value}%)`,
            factors: [
                `Localized activity in ${meta.type}`,
                'Meteorological conditions trapping pollutants',
                'Activity exceeds seasonal baseline by 15%'
            ]
        };
    }

    // Secondary Source Logic (Generic for now, can be specific)
    const secondarySource = sources.filter(s => s.name !== dominantSource.name).sort((a, b) => b.value - a.value)[0];
    explanation.secondary = {
        title: `${secondarySource.name} (${secondarySource.value}%)`,
        factors: getSecondaryFactors(secondarySource.name, meta, hour)
    };

    // Tertiary
    explanation.tertiary = sources
        .filter(s => s.name !== dominantSource.name && s.name !== secondarySource.name)
        .sort((a, b) => b.value - a.value)
        .map(s => ({ name: s.name, value: s.value, desc: getBriefDesc(s.name) }));

    return explanation;
};

const getDominantSource = (sources) => {
    return sources.reduce((prev, current) => (prev.value > current.value) ? prev : current);
};

const getSecondaryFactors = (sourceName, meta, hour) => {
    switch (sourceName) {
        case 'Vehicular': return [`Spillover traffic from ${meta.landmarks[0]}`, hour > 17 ? 'Evening commute contributions' : 'Mid-day commercial transport'];
        case 'Industrial': return [`Background emissions from ${meta.landmarks[1]}`, 'Wind transport from neighboring industrial sectors'];
        case 'Construction': return [`${meta.constructionSites} active sites reported in 5km radius`, 'Dust control compliance audit pending'];
        case 'Stubble': return ['Seasonal crop residue burning drift', 'Inversion layer trapping smoke at lower altitudes'];
        default: return ['Local waste burning events', 'Residential heating and cooking emissions'];
    }
};

const getBriefDesc = (sourceName) => {
    switch (sourceName) {
        case 'Vehicular': return 'Local traffic & transport';
        case 'Industrial': return 'Factory output';
        case 'Construction': return 'Dust & demolition';
        case 'Stubble': return 'Farm fire smoke';
        case 'Other': return 'Waste burning/Residential';
        default: return 'Minor sources';
    }
};

/**
 * Generates actionable recommendations based on the dominant pollution source.
 */
export const generateRecommendations = (sources, areaId, aqi) => {
    const dominant = getDominantSource(sources);
    const meta = AREA_METADATA[areaId];

    const recommendations = {
        authorities: [],
        citizens: [],
        impact: `-${Math.round(aqi * 0.25)} to -${Math.round(aqi * 0.35)} AQI points`
    };

    if (dominant.name === 'Industrial') {
        recommendations.authorities = [
            'Deploy mobile monitoring units near industrial clusters',
            'Enforce emission caps on top 5 polluting units',
            'Conduct surprise audits on filtration systems'
        ];
        recommendations.citizens = [
            'Report visible dark smoke to PCBC helpline',
            'Avoid outdoor exertion near industrial zones',
            'Use air purifiers indoors (HEPA H13/H14)'
        ];
    } else if (dominant.name === 'Vehicular') {
        recommendations.authorities = [
            `Increase traffic management on ${meta.landmarks[0]}`,
            'Restrict heavy diesel vehicles during peak hours',
            'Increase frequency of public transport (Metro/Bus)'
        ];
        recommendations.citizens = [
            'Carpool or use Metro for commute',
            `Avoid ${meta.landmarks[0]} during evening rush (18:00-21:00)`,
            'Turn off engines at red lights (Red Light On, Gaadi Off)'
        ];
    } else if (dominant.name === 'Construction') {
        recommendations.authorities = [
            `Inspect ${meta.constructionSites} active sites for dust control`,
            'Mandate extensive water sprinkling',
            'Halt non-essential demolition activities'
        ];
        recommendations.citizens = [
            'Report uncovered construction material',
            'Wet sweep areas around homes to reduce dust',
            'Wear N95 masks to filter particulate matter'
        ];
    } else {
        recommendations.authorities = [
            'Monitor satellite feeds for farm fires',
            'Enforce ban on waste burning'
        ];
        recommendations.citizens = [
            'Do not burn dry leaves or waste',
            'Wear masks outdoors',
            'Keep windows closed to prevent smoke entry'
        ];
    }

    return recommendations;
}

export const getAreaMetadata = (areaId) => AREA_METADATA[areaId]; // Export helper
