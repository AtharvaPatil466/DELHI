/**
 * Safe Route Recommendation Engine
 * Minimizes pollution exposure between two points.
 */

import { AREAS, getCurrentAQI } from './dataGenerator';

export const getAlternativeRoutes = (start, end) => {
    const routes = [
        {
            id: 1,
            name: 'Via Ring Road',
            distance: 22.4,
            duration: 35,
            avgAQI: 280,
            note: 'Stands as the longest but avoids high-density industrial clusters.',
            areas: ['RK Puram', 'CP', 'Dwarka']
        },
        {
            id: 2,
            name: 'Via Mathura Road',
            distance: 18.2,
            duration: 28,
            avgAQI: 340,
            note: 'Fastest route but passes through Anand Vihar (Severe Zone).',
            areas: ['Anand Vihar', 'Noida', 'Ghaziabad']
        },
        {
            id: 3,
            name: 'Via DND Flyway',
            distance: 20.1,
            duration: 25,
            avgAQI: 295,
            note: 'Best overall balance of air quality and travel time.',
            areas: ['Noida', 'CP', 'South Delhi']
        }
    ];

    return routes.map(route => {
        // Total exposure = AQI * Time
        const exposureScore = Math.round((route.avgAQI * route.duration) / 10);
        return {
            ...route,
            exposureScore,
            rating: exposureScore < 600 ? 'Safe' : exposureScore < 900 ? 'Moderate' : 'High Risk'
        };
    }).sort((a, b) => a.exposureScore - b.exposureScore);
};

export const getRouteInsight = (routes) => {
    const recommended = routes[0];
    return `⭐ Recommended: ${recommended.name} offers a ${Math.round(((routes[1].exposureScore - recommended.exposureScore) / routes[1].exposureScore) * 100)}% lower pollution exposure than the fastest alternative.`;
};
