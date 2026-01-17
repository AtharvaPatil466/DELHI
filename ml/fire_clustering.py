# FILE: DELHI/ml/fire_clustering.py
import json
import math
import os

def haversine(coord1, coord2):
    """
    Calculate the great circle distance between two points 
    on the earth (specified in decimal degrees)
    """
    lat1, lon1 = coord1
    lat2, lon2 = coord2
    
    # Convert decimal degrees to radians 
    lat1, lon1, lat2, lon2 = map(math.radians, [lat1, lon1, lat2, lon2])

    # Haversine formula 
    dlat = lat2 - lat1 
    dlon = lon2 - lon1 
    a = math.sin(dlat/2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon/2)**2
    c = 2 * math.asin(math.sqrt(a)) 
    r = 6371 # Radius of earth in kilometers
    return c * r

def cluster_fires(fires, radius_km=20):
    """
    Groups fires within radius_km into clusters.
    Manual implementation of proximity clustering.
    """
    if not fires:
        return []

    visited = [False] * len(fires)
    clusters = []

    for i in range(len(fires)):
        if visited[i]:
            continue
        
        # Start a new cluster
        current_cluster = [fires[i]]
        visited[i] = True
        
        # Find all reachable points for this cluster
        j = 0
        while j < len(current_cluster):
            point_a = current_cluster[j]
            for k in range(len(fires)):
                if not visited[k]:
                    point_b = fires[k]
                    # Check distance from the latest point added to cluster
                    dist = haversine(point_a['position'], point_b['position'])
                    if dist <= radius_km:
                        current_cluster.append(point_b)
                        visited[k] = True
            j += 1
        clusters.append(current_cluster)

    # Process clusters into metrics
    processed_clusters = []
    for idx, cluster in enumerate(clusters):
        total_frp = sum(f.get('frp', 10) for f in cluster)
        avg_conf = sum(f.get('confidence', 50) for f in cluster) / len(cluster)
        
        # Calculate centroid
        avg_lat = sum(f['position'][0] for f in cluster) / len(cluster)
        avg_lon = sum(f['position'][1] for f in cluster) / len(cluster)
        
        # Assign severity
        severity = "Low"
        if total_frp > 500: severity = "Critical"
        elif total_frp > 200: severity = "High"
        elif total_frp > 50: severity = "Moderate"

        processed_clusters.append({
            "id": idx,
            "center": [round(avg_lat, 4), round(avg_lon, 4)],
            "fire_count": len(cluster),
            "total_frp": round(total_frp, 1),
            "avg_confidence": round(avg_conf, 1),
            "severity": severity,
            "radius_km": radius_km
        })

    # Sort by severity (total FRP) and take top 5
    processed_clusters.sort(key=lambda x: x['total_frp'], reverse=True)
    return processed_clusters[:5]

def run_clustering(fires=None):
    script_dir = os.path.dirname(os.path.abspath(__file__))
    input_path = os.path.join(script_dir, '../src/data/live_fires.json')
    
    if fires is None:
        if not os.path.exists(input_path):
            print(f"Error: {input_path} not found.")
            return []
        with open(input_path, 'r') as f:
            fires = json.load(f)

    print(f"🔄 Grouping {len(fires)} hotspots into severity zones...")
    clusters = cluster_fires(fires)
    return clusters

if __name__ == "__main__":
    clusters = run_clustering()
    print(f"✅ Success: Generated {len(clusters)} high-intensity clusters.")
    for c in clusters:
        print(f"📍 Cluster {c['id']}: {c['severity']} Zone | FRP: {c['total_frp']} MW | Count: {c['fire_count']}")

if __name__ == "__main__":
    run_clustering()
