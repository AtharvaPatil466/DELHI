import React, { useState, useMemo, useRef, useEffect, Suspense } from 'react';
import { useTheme } from 'next-themes';
import { MapContainer, TileLayer, Marker, Popup, Polyline, ZoomControl, useMap, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { fetchFireDataFeed } from '../../utils/satelliteData';
import { generateDenseNetwork } from '../../utils/dataGenerator';
import { Flame, Truck, Radar, AlertTriangle, Map as MapIcon, Loader2, WifiOff, RefreshCcw, Layers, Activity, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Lazy Load ---
const FireIntelligenceCenter = React.lazy(() => import('../Sources/FireIntelligenceCenter'));

// --- Fix for Leaflet Default Icons ---
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// ==========================================
// 2D HELPERS (V5.0)
// ==========================================

const MapResizer = () => {
    const map = useMap();
    useEffect(() => {
        // Aggressive resynchronization sequence
        const resync = () => { map.invalidateSize(); };

        // Immediate sync
        resync();

        // Sequence sync as elements settle (Extended to 5s)
        const timers = [100, 300, 500, 1000, 2000, 3000, 5000].map(ms => setTimeout(resync, ms));

        // Window resize listener
        window.addEventListener('resize', resync);

        return () => {
            timers.forEach(clearTimeout);
            window.removeEventListener('resize', resync);
        };
    }, [map]);
    return null;
};

const createAQIIcon = (aqi, color) => {
    return L.divIcon({
        className: 'custom-aqi-icon',
        html: `<div style="background-color: ${color}; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: 800; font-size: 10px; font-family: 'JetBrains Mono', monospace; box-shadow: 0 0 10px ${color}66; border: 2px solid rgba(255,255,255,0.2);">${aqi}</div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 14]
    });
};

// ==========================================
// MAIN MAP COMPONENT (REFINED V5.0 TACTICAL)
// ==========================================

const Map3D = ({ setActiveTab }) => {
    const { theme, resolvedTheme } = useTheme();
    const currentTheme = resolvedTheme || theme;

    // --- State: V5.0 Data ---
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

    // --- Effects ---
    useEffect(() => {
        // Initial Load
        loadSatelliteData();
        setStations(denseStations);
        // Tactical Traffic Corridors (Correlated to Pollution Hotspots)
        setTrafficCongestion([
            { id: 'ring-road', name: 'OUTER RING ROAD', path: [[28.70, 77.10], [28.65, 77.12], [28.60, 77.15], [28.55, 77.20], [28.53, 77.25]], intensity: 'heavy', emissions: 142 },
            { id: 'nh44', name: 'NH-44 (GT ROAD)', path: [[28.85, 77.12], [28.80, 77.13], [28.75, 77.15], [28.70, 77.18]], intensity: 'critical', emissions: 210 },
            { id: 'dnd', name: 'DND FLYWAY', path: [[28.58, 77.26], [28.57, 77.29], [28.56, 77.32]], intensity: 'critical', emissions: 185 },
            { id: 'vikas-marg', name: 'VIKAS MARG', path: [[28.63, 77.24], [28.64, 77.27], [28.65, 77.31]], intensity: 'critical', emissions: 195 },
            { id: 'mg-road', name: 'MG ROAD (GURGAON)', path: [[28.50, 77.10], [28.48, 77.08], [28.46, 77.06]], intensity: 'heavy', emissions: 125 },
            { id: 'rohtak-rd', name: 'ROHTAK ROAD', path: [[28.67, 77.15], [28.68, 77.10], [28.69, 77.05]], intensity: 'heavy', emissions: 110 },
            { id: 'yamuna-exp', name: 'YAMUNA EXPRESSWAY', path: [[28.52, 77.35], [28.45, 77.40], [28.35, 77.45]], intensity: 'moderate', emissions: 45 },
            { id: 'noida-exp', name: 'NOIDA EXPRESSWAY', path: [[28.54, 77.33], [28.50, 77.36], [28.45, 77.40]], intensity: 'heavy', emissions: 130 }
        ]);

        const interval = setInterval(() => {
            loadSatelliteData();
        }, 300000);

        return () => clearInterval(interval);
    }, [denseStations]);

    return (
        <div className="relative w-full h-[calc(100vh-80.5px)] overflow-hidden bg-[#09090b] flex flex-col">

            {/* --- HEADER CONTROLS --- */}
            <div className="absolute top-0 left-0 right-0 z-[1100] p-4 md:p-6 pointer-events-none">
                <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 pointer-events-auto">
                    {/* Empty placeholder to keep the flex layout for Layers Switcher */}
                    <div></div>

                    {/* Layers Switcher */}
                    <div className="flex items-center gap-3">
                        <div className="flex flex-wrap gap-2 glass p-2 rounded-2xl border border-white/5 bg-black/50 backdrop-blur-md">
                            {[
                                { id: 'stations', label: 'Grid', icon: Radar, color: 'bg-indigo-600', shadow: 'shadow-indigo-600/20' },
                                { id: 'fires', label: 'Hotspots', icon: Flame, color: 'bg-orange-600', shadow: 'shadow-orange-600/20' },
                                { id: 'zones', label: 'Zones', icon: AlertTriangle, color: 'bg-red-600', shadow: 'shadow-red-600/20' },
                                { id: 'traffic', label: 'Traffic', icon: Truck, color: 'bg-blue-600', shadow: 'shadow-blue-600/20' }
                            ].map(layer => (
                                <button
                                    key={layer.id}
                                    onClick={() => setActiveLayer(layer.id)}
                                    className={`px-3 py-2 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all flex items-center gap-2 ${activeLayer === layer.id ? `${layer.color} text-white shadow-lg ${layer.shadow}` : 'bg-white/5 text-gray-400 hover:text-white'}`}
                                >
                                    <layer.icon className="w-3 h-3" />
                                    <span className="hidden sm:inline">{layer.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Satellite Loader */}
            <div className="absolute top-24 left-6 z-[1000] pointer-events-none">
                <AnimatePresence>
                    {(isLoading || error) && (
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="pointer-events-auto">
                            {isLoading && <div className="bg-black/60 backdrop-blur border border-primary/20 p-2 rounded-lg flex items-center gap-2 text-[10px] text-primary font-bold uppercase tracking-widest"><Loader2 className="w-3 h-3 animate-spin" /> NASA Link Initializing...</div>}
                            {error && <div className="bg-red-900/60 backdrop-blur border border-red-500/20 p-2 rounded-lg flex items-center gap-2 text-[10px] text-red-400 font-bold uppercase tracking-widest mt-2"><WifiOff className="w-3 h-3" /> {error} <button onClick={loadSatelliteData}><RefreshCcw className="w-3 h-3 ml-2 hover:text-white" /></button></div>}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Main Content Area - Total Viewport Saturation */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute top-28 right-6 z-[900] w-80 pointer-events-none">
                        <div className="pointer-events-auto">
                            <Suspense fallback={<div className="p-8 glass rounded-2xl animate-pulse text-gray-500 text-[10px] font-black uppercase">Decoding Satellite Intel...</div>}>
                                <FireIntelligenceCenter fireFeed={fireFeed} onNavigate={setActiveTab} />
                            </Suspense>
                        </div>
                    </div>

                    <MapContainer
                        center={[28.95, 77.10]} // Centered north to capture the fire belt better
                        zoom={10}
                        minZoom={8}
                        maxBounds={[[27.0, 75.0], [31.0, 79.0]]} // Drastic expansion of bounds
                        scrollWheelZoom={true}
                        style={{ height: '100%', width: '100%' }}
                        zoomControl={false}
                    >
                        <MapResizer />
                        <ZoomControl position="bottomright" />
                        <TileLayer
                            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                            attribution='&copy; CARTO'
                        />

                        {activeLayer === 'stations' && stations.map(s => (
                            <Marker key={s.id} position={s.coords} icon={createAQIIcon(s.aqi, s.color)}>
                                <Popup className="glass-popup">
                                    <div className="min-w-[180px] p-1 font-sans text-zinc-800">
                                        <div className="flex justify-between items-start mb-2 border-b border-gray-200/50 pb-2">
                                            <div>
                                                <h3 className="font-bold text-xs uppercase tracking-tight text-zinc-900 line-clamp-1">{s.name}</h3>
                                                <span className="text-[9px] bg-zinc-100 text-zinc-500 px-1.5 py-0.5 rounded uppercase tracking-widest font-bold">Sensor Node</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex flex-col">
                                                <span className="text-[9px] text-zinc-400 uppercase font-bold tracking-wider">Current AQI</span>
                                                <span className="text-3xl font-black leading-none" style={{ color: s.color }}>{s.aqi}</span>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: s.color }}>{s.level || 'Poor'}</div>
                                                <div className="text-[9px] text-zinc-400">Primary Pollutant: PM2.5</div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2 mb-3">
                                            <div className="bg-zinc-50 p-2 rounded border border-zinc-100">
                                                <div className="text-[8px] text-zinc-400 uppercase font-bold mb-0.5">PM2.5</div>
                                                <div className="text-xs font-mono font-bold text-zinc-700">{s.pollutants?.pm25} µg/m³</div>
                                            </div>
                                            <div className="bg-zinc-50 p-2 rounded border border-zinc-100">
                                                <div className="text-[8px] text-zinc-400 uppercase font-bold mb-0.5">PM10</div>
                                                <div className="text-xs font-mono font-bold text-zinc-700">{s.pollutants?.pm10} µg/m³</div>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => setActiveTab('sources')}
                                            className="w-full py-2 bg-zinc-900 text-white text-[10px] font-bold uppercase rounded hover:bg-zinc-800 transition-colors flex items-center justify-center gap-1.5"
                                        >
                                            <span>View Analysis</span>
                                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                        </button>
                                    </div>
                                </Popup>
                            </Marker>
                        ))}

                        {(activeLayer === 'fires' || activeLayer === 'zones') && fireFeed.allFires.map(f => (
                            <Circle key={`fire-${f.id}`} center={f.position} radius={2000} pathOptions={{ color: '#ef4444', fillColor: '#ef4444', fillOpacity: 0.8, weight: 1 }} />
                        ))}

                        {activeLayer === 'zones' && fireFeed.clusters.map(c => (
                            <React.Fragment key={c.id}>
                                <Circle center={c.center} radius={c.radiusKm * 1000} pathOptions={{ color: c.color, fillColor: c.color, fillOpacity: 0.1, weight: 2, dashArray: '10, 10' }} />
                                <Marker position={c.center} icon={L.divIcon({ className: 'cluster-label', html: `<div style="background: ${c.color}dd; color: white; padding: 4px 8px; border-radius: 4px; font-size: 10px; font-weight: 800; white-space: nowrap; border: 1px solid white;">${c.severity} ZONE</div>`, iconSize: [80, 20] })} />
                            </React.Fragment>
                        ))}

                        {activeLayer === 'traffic' && trafficCongestion.map(l => (
                            <Polyline
                                key={l.id}
                                positions={l.path}
                                pathOptions={{
                                    color: l.intensity === 'critical' ? '#ef4444' : l.intensity === 'heavy' ? '#f59e0b' : '#3b82f6',
                                    weight: l.intensity === 'critical' ? 10 : 6,
                                    opacity: 0.8,
                                    lineCap: 'round'
                                }}
                            >
                                <Popup>
                                    <div className="p-2 min-w-[150px]">
                                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Arterial Corridor</div>
                                        <div className="text-xs font-bold text-zinc-900 mb-2">{l.name}</div>
                                        <div className="flex flex-col gap-1">
                                            <div className="flex justify-between items-center">
                                                <span className="text-[10px] text-gray-500">Status:</span>
                                                <span className={`text-[10px] font-bold uppercase ${l.intensity === 'critical' ? 'text-red-500' : 'text-orange-500'}`}>{l.intensity}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-[10px] text-gray-500">Emissions:</span>
                                                <span className="text-[10px] font-mono font-bold text-zinc-700">{l.emissions} g/km PM2.5</span>
                                            </div>
                                        </div>
                                    </div>
                                </Popup>
                            </Polyline>
                        ))}

                    </MapContainer>

                    {/* 2D V5.0 Overlays */}
                    <div className="absolute bottom-6 left-6 z-[900] bg-black/80 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                        <h4 className="text-[10px] font-bold text-white mb-2 flex items-center gap-2"><Layers className="w-3 h-3 text-primary" /> Intelligence Legend</h4>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></div><span className="text-[9px] font-bold text-gray-400 uppercase">Active Hotspot</span></div>
                            <div className="flex items-center gap-2"><div className="w-4 h-2 rounded-full border border-dashed border-red-500 bg-red-500/10"></div><span className="text-[9px] font-bold text-gray-400 uppercase">Influence Zone (20km)</span></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Map3D;