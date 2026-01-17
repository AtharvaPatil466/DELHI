// FILE: DELHI/src/components/Visualization/Map3D.jsx
import React, { useEffect, useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { fetchFireDataFeed } from '../../utils/satelliteData';
import { generateDenseNetwork } from '../../utils/dataGenerator';
import { Flame, Truck, Wind, Layers, Map as MapIcon, Radar, AlertTriangle, TrendingUp, Loader2, WifiOff, RefreshCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
const FireIntelligenceCenter = React.lazy(() => import('../Sources/FireIntelligenceCenter'));
import { Suspense } from 'react';

// Helper component to fix Leaflet size issues
const MapResizer = () => {
    const map = useMap();
    useEffect(() => {
        setTimeout(() => {
            map.invalidateSize();
        }, 500);
    }, [map]);
    return null;
};

const createAQIIcon = (aqi, color) => {
    return L.divIcon({
        className: 'custom-aqi-icon',
        html: `
            <div style="
                background-color: ${color};
                width: 28px;
                height: 28px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-weight: 800;
                font-size: 10px;
                font-family: 'JetBrains Mono', monospace;
                box-shadow: 0 0 10px ${color}66;
                border: 2px solid rgba(255,255,255,0.2);
            ">
                ${aqi}
            </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14]
    });
};

const Map3D = ({ setActiveTab }) => {
    const [fireFeed, setFireFeed] = useState({ allFires: [], clusters: [], attribution: {}, metadata: { status: 'Initializing' } });
    const [stations, setStations] = useState([]);
    const [trafficCongestion, setTrafficCongestion] = useState([]);
    const [activeLayer, setActiveLayer] = useState('stations');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Optimized Dense Network (Memoized)
    const denseStations = useMemo(() => generateDenseNetwork(), []);

    const loadSatelliteData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const feed = await fetchFireDataFeed();
            setFireFeed(feed);
        } catch (err) {
            setError("Satellite Connectivity Issue");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        // Initial Load
        loadSatelliteData();
        setStations(denseStations);

        setTrafficCongestion([
            { id: 1, path: [[28.62, 77.24], [28.64, 77.31]], intensity: 'critical' },
            { id: 2, path: [[28.59, 77.16], [28.54, 77.27]], intensity: 'heavy' },
            { id: 3, path: [[28.71, 77.11], [28.81, 77.06]], intensity: 'moderate' }
        ]);

        const interval = setInterval(() => {
            loadSatelliteData();
            setStations(denseStations);
        }, 300000); // 5 minutes (Matches Satellite Cache TTL)

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="p-4 md:p-8 bg-background min-h-[calc(100vh-80px)] flex flex-col space-y-4 md:space-y-6 overflow-hidden">

            {/* Control Bar */}
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 xl:gap-6 glass p-4 rounded-2xl border border-white/5">
                <div className="flex items-center gap-4">
                    <div className="bg-primary/20 p-2 rounded-lg">
                        <MapIcon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <h3 className="font-bold text-white text-sm md:text-base">Spatial Intelligence v5.0</h3>
                        <p className="text-[9px] md:text-[10px] text-gray-500 uppercase tracking-widest font-black">Proximity Clustering & Severe Zone Detection</p>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2 w-full xl:w-auto">
                    {[
                        { id: 'stations', label: 'AQI Grid', icon: Radar, color: 'bg-indigo-600', shadow: 'shadow-indigo-600/20' },
                        { id: 'fires', label: 'Hotspots', icon: Flame, color: 'bg-orange-600', shadow: 'shadow-orange-600/20' },
                        { id: 'zones', label: 'Severity Zones', icon: AlertTriangle, color: 'bg-red-600', shadow: 'shadow-red-600/20' },
                        { id: 'traffic', label: 'Traffic', icon: Truck, color: 'bg-blue-600', shadow: 'shadow-blue-600/20' }
                    ].map(layer => (
                        <button
                            key={layer.id}
                            onClick={() => setActiveLayer(layer.id)}
                            className={`flex-1 xl:flex-none px-3 md:px-4 py-2 rounded-xl text-[9px] md:text-[11px] font-black tracking-widest uppercase transition-all flex items-center justify-center gap-2 ${activeLayer === layer.id
                                ? `${layer.color} text-white shadow-lg ${layer.shadow}`
                                : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                                }`}
                        >
                            <layer.icon className="w-3 h-3 md:w-4 md:h-4" />
                            <span className="hidden sm:inline">{layer.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Satellite Status Overlays (NEW) */}
            <div className="z-[2000] pointer-events-none">
                <AnimatePresence mode="wait">
                    {isLoading && (
                        <motion.div
                            key="loading"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="bg-primary/10 border border-primary/20 backdrop-blur-md p-3 rounded-xl flex items-center gap-3 w-fit"
                        >
                            <Loader2 className="w-4 h-4 text-primary animate-spin" />
                            <span className="text-[10px] font-black text-primary uppercase tracking-widest">Connecting to NASA Satellites...</span>
                        </motion.div>
                    )}
                    {error && !isLoading && (
                        <motion.div
                            key="error"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="bg-red-500/10 border border-red-500/20 backdrop-blur-md p-3 rounded-xl flex items-center justify-between gap-4 w-fit pointer-events-auto"
                        >
                            <div className="flex items-center gap-3">
                                <WifiOff className="w-4 h-4 text-red-500" />
                                <span className="text-[10px] font-black text-red-400 uppercase tracking-widest">{error}</span>
                            </div>
                            <button
                                onClick={loadSatelliteData}
                                className="flex items-center gap-1.5 px-3 py-1 bg-red-500/10 hover:bg-red-500/20 rounded-full transition-all group"
                            >
                                <RefreshCcw className="w-3 h-3 text-red-500 group-hover:rotate-180 transition-transform duration-500" />
                                <span className="text-[9px] font-black text-red-500 uppercase tracking-tighter">Retry Connection</span>
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Fire Intelligence Hub (Lazy) */}
            <Suspense fallback={null}>
                <FireIntelligenceCenter fireFeed={fireFeed} onNavigate={setActiveTab} />
            </Suspense>

            <div className="flex-1 rounded-3xl overflow-hidden border border-white/10 relative shadow-2xl h-[600px] bg-[#09090b]">
                <MapContainer
                    center={[29.2, 76.5]}
                    zoom={8}
                    scrollWheelZoom={true}
                    style={{ height: '600px', width: '100%' }}
                >
                    <MapResizer />
                    <TileLayer
                        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                        attribution='&copy; CARTO'
                    />

                    {/* 1. AQI GRID */}
                    {(activeLayer === 'stations') && stations.map((station) => (
                        <Marker key={station.id} position={station.coords} icon={createAQIIcon(station.aqi, station.color)} />
                    ))}

                    {/* 2. FIRE HOTSPOTS */}
                    {(activeLayer === 'fires' || activeLayer === 'zones') && fireFeed.allFires.map((fire) => (
                        <Circle
                            key={`fire-${fire.id}`}
                            center={fire.position}
                            radius={2000}
                            pathOptions={{ color: '#ef4444', fillColor: '#ef4444', fillOpacity: 0.8, weight: 1 }}
                        />
                    ))}

                    {/* 3. SEVERITY ZONES (CLUSTERS) */}
                    {(activeLayer === 'zones') && fireFeed.clusters.map((cluster) => (
                        <React.Fragment key={cluster.id}>
                            <Circle
                                center={cluster.center}
                                radius={cluster.radiusKm * 1000}
                                pathOptions={{
                                    color: cluster.color,
                                    fillColor: cluster.color,
                                    fillOpacity: 0.1,
                                    weight: 2,
                                    dashArray: '10, 10'
                                }}
                            />
                            <Marker
                                position={cluster.center}
                                icon={L.divIcon({
                                    className: 'cluster-label',
                                    html: `<div style="background: ${cluster.color}dd; color: white; padding: 4px 8px; border-radius: 4px; font-size: 10px; font-weight: 800; white-space: nowrap; border: 1px solid white;">${cluster.severity} ZONE</div>`,
                                    iconSize: [80, 20]
                                })}
                            />
                        </React.Fragment>
                    ))}

                    {/* 4. TRAFFIC */}
                    {(activeLayer === 'traffic') && trafficCongestion.map((line) => (
                        <Polyline key={line.id} positions={line.path} pathOptions={{ color: line.intensity === 'critical' ? '#ef4444' : '#3b82f6', weight: 8, opacity: 0.9 }} />
                    ))}

                </MapContainer>

                {/* Severity Leaderboard Overlay */}
                <AnimatePresence>
                    {activeLayer === 'zones' && (
                        <motion.div
                            initial={{ x: 300, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: 300, opacity: 0 }}
                            className="absolute top-6 right-6 z-[1000] w-64 glass p-6 rounded-2xl border border-white/10"
                        >
                            <div className="flex items-center gap-2 mb-4">
                                <TrendingUp className="w-4 h-4 text-primary" />
                                <h4 className="text-xs font-bold text-white uppercase tracking-widest">Zone Severity Rank</h4>
                            </div>
                            <div className="space-y-4">
                                {fireFeed.clusters.map((cluster, i) => (
                                    <div key={cluster.id} className="group cursor-pointer">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-[10px] font-black text-gray-500">#{i + 1} ZONE</span>
                                            <span className="text-[10px] font-bold px-2 py-0.5 rounded" style={{ backgroundColor: `${cluster.color}33`, color: cluster.color }}>
                                                {cluster.severity}
                                            </span>
                                        </div>
                                        <div className="bg-white/5 rounded-lg p-2 border border-transparent group-hover:border-white/10 transition-all">
                                            <div className="flex justify-between text-xs mb-1">
                                                <span className="text-white font-bold">{cluster.fireCount} Active Fires</span>
                                                <span className="text-primary font-mono">{cluster.totalFrp} MW</span>
                                            </div>
                                            <p className="text-[9px] text-gray-500 font-mono">LAT: {cluster.center[0].toFixed(2)} | LON: {cluster.center[1].toFixed(2)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Intelligence Legend */}
                <div className="absolute bottom-6 left-6 z-[1000] bg-black/80 backdrop-blur-md p-6 rounded-2xl border border-white/10 max-w-[240px]">
                    <h4 className="text-[10px] font-bold text-white mb-4 flex items-center gap-2">
                        <Layers className="w-3.5 h-3.5 text-primary" /> Intelligence Legend
                    </h4>
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <div className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse"></div>
                            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Active Hotspot</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-5 h-2.5 rounded-full border border-dashed border-red-500 bg-red-500/10"></div>
                            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Influence Zone (20km)</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Wind className="w-4 h-4 text-gray-600" />
                            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">NW Smoke Drift Path</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Map3D;