// FILE: DELHI/src/utils/fireClusters.js

/**
 * Haversine Distance Helper (KM)
 */
const getDistance = (coord1, coord2) => {
    const [lat1, lon1] = coord1;
    const [lat2, lon2] = coord2;
    const R = 6371; // km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

/**
 * Clustering Algorithm (Proximity-based)
 */
export const identifyFireClusters = (fires, radiusKm = 20) => {
    if (!fires || fires.length === 0) return [];

    const visited = new Set();
    const clusters = [];

    fires.forEach((fire, i) => {
        if (visited.has(i)) return;

        const cluster = [];
        const queue = [i];
        visited.add(i);

        while (queue.length > 0) {
            const currentIdx = queue.shift();
            const currentFire = fires[currentIdx];
            cluster.push(currentFire);

            fires.forEach((otherFire, j) => {
                if (!visited.has(j)) {
                    const dist = getDistance(currentFire.position, otherFire.position);
                    if (dist <= radiusKm) {
                        visited.add(j);
                        queue.push(j);
                    }
                }
            });
        }
        clusters.push(cluster);
    });

    // Transform clusters into zone metrics
    const clusterMetrics = clusters.map((cluster, idx) => {
        const totalFrp = cluster.reduce((sum, f) => sum + (f.frp || 20), 0);
        const avgConfidence = cluster.reduce((sum, f) => sum + (f.confidence === 'High' ? 90 : 70), 0) / cluster.length;

        // Center calculation
        const avgLat = cluster.reduce((sum, f) => sum + f.position[0], 0) / cluster.length;
        const avgLon = cluster.reduce((sum, f) => sum + f.position[1], 0) / cluster.length;

        let severity = 'Low';
        let color = '#10b981'; // Success Green

        if (totalFrp > 1000) { severity = 'Critical'; color = '#991b1b'; }
        else if (totalFrp > 400) { severity = 'High'; color = '#ef4444'; }
        else if (totalFrp > 100) { severity = 'Moderate'; color = '#f97316'; }

        return {
            id: `zone-${idx}`,
            center: [avgLat, avgLon],
            fireCount: cluster.length,
            totalFrp: Math.round(totalFrp),
            avgConfidence: Math.round(avgConfidence),
            severity,
            color,
            radiusKm
        };
    });

    // Sort by Total FRP and return top 5
    return clusterMetrics.sort((a, b) => b.totalFrp - a.totalFrp).slice(0, 5);
};
