import React, { useState, useMemo, useRef, useEffect, Suspense } from 'react';
import { useTheme } from 'next-themes';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import { OrbitControls, MapControls, Stars, Html, PerspectiveCamera } from '@react-three/drei';
import { MapContainer, TileLayer, Marker, Popup, Polyline, ZoomControl, useMap, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import * as THREE from 'three';
import { fetchFireDataFeed } from '../../utils/satelliteData';
import { generateDenseNetwork, getAllAreasData, getCurrentAQI, getAirQualityLevel, calculatePollutants } from '../../utils/dataGenerator';
import { Flame, Truck, Wind, Layers, Map as MapIcon, Radar, AlertTriangle, TrendingUp, Loader2, WifiOff, RefreshCcw, SidebarClose, Globe, RotateCcw, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { EffectComposer, Bloom, Noise, Vignette, ChromaticAberration } from '@react-three/postprocessing';

// --- Lazy Load ---
const FireIntelligenceCenter = React.lazy(() => import('../Sources/FireIntelligenceCenter'));

// --- Assets for 2D Map ---
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// ==========================================
// 3D CONSTANTS & HELPERS (V3.0)
// ==========================================

const BOUNDS = {
    north: 28.89638585547569,
    south: 28.331581995788987,
    east: 77.56072998046876,
    west: 76.85760498046876
};
const PLANE_SIZE = 1400;

const latLngToVector3 = (lat, lng) => {
    const x = ((lng - BOUNDS.west) / (BOUNDS.east - BOUNDS.west) - 0.5) * PLANE_SIZE;
    const z = -((lat - BOUNDS.south) / (BOUNDS.north - BOUNDS.south) - 0.5) * PLANE_SIZE;
    return [x, 0, z];
};

const AREA_COORDS = {
    'anand-vihar': [28.6469, 77.3160],
    'cp': [28.6304, 77.2177],
    'dwarka': [28.5843, 77.0463],
    'rohini': [28.7162, 77.1170],
    'noida': [28.5355, 77.3910],
    'gurgaon': [28.4595, 77.0266],
    'faridabad': [28.4089, 77.3178],
    'ghaziabad': [28.6692, 77.4538],
    'rk-puram': [28.5660, 77.1767],
    'punjabi-bagh': [28.6667, 77.1333],
    'okhla': [28.5410, 77.2730],
    'najafgarh': [28.6120, 76.9820],
    'shadipur': [28.6517, 77.1567],
    'karol-bagh': [28.6620, 77.1940],
    'lodhi-road': [28.5910, 77.2270],
    'igi': [28.5550, 77.0850],
    'bawana': [28.8120, 77.0600],
    'mundka': [28.6750, 77.0400],
    'alipur': [28.8200, 77.1550],
    'nehru-nagar': [28.5700, 77.2550],
    'jahangirpuri': [28.7350, 77.1680],
    'wazirpur': [28.6990, 77.1650],
    'aurobindo': [28.5480, 77.2090],
    'patparganj': [28.6250, 77.3050],
    'sonia-vihar': [28.7150, 77.2520]
};

const ROAD_3D_DATA = [
    { name: 'RING ROAD', coords: [28.569, 77.220], rotation: -0.8 },
    { name: 'NH 44 (GT ROAD)', coords: [28.700, 77.150], rotation: 1.2 },
    { name: 'NOIDA EXPRESSWAY', coords: [28.520, 77.350], rotation: 2.1 },
    { name: 'AUROBINDO MARG', coords: [28.530, 77.200], rotation: 0 },
];

// ==========================================
// 3D COMPONENTS (V3.0)
// ==========================================

const PollutionInstances = ({ data, activeArea, setActiveArea, hoveredArea, setHoveredArea }) => {
    const meshRef = useRef();
    const glowMeshRef = useRef();
    const { camera } = useThree();
    const dummy = useMemo(() => new THREE.Object3D(), []);

    useEffect(() => {
        if (!meshRef.current || !glowMeshRef.current || !data.length) return;
        data.forEach((area, i) => {
            const [x, y, z] = area.position;
            const h = Math.max(2, area.aqi / 8) * (area.isSynthetic ? 0.4 : 1);
            const w = area.isSynthetic ? 0.5 : 1.2;
            dummy.position.set(x, h / 2, z);
            dummy.scale.set(w, h, w);
            dummy.updateMatrix();
            meshRef.current.setMatrixAt(i, dummy.matrix);
            glowMeshRef.current.setMatrixAt(i, dummy.matrix);
            const color = new THREE.Color(area.color);
            meshRef.current.setColorAt(i, color);
            glowMeshRef.current.setColorAt(i, color);
        });
        meshRef.current.instanceMatrix.needsUpdate = true;
        meshRef.current.instanceColor.needsUpdate = true;
        glowMeshRef.current.instanceMatrix.needsUpdate = true;
        glowMeshRef.current.instanceColor.needsUpdate = true;
    }, [data, dummy]);

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        data.forEach((area, i) => {
            if (activeArea?.id === area.id || hoveredArea?.id === area.id) {
                const [x, y, z] = area.position;
                const h = (Math.max(2, area.aqi / 8) * (area.isSynthetic ? 0.4 : 1)) * (1 + Math.sin(time * 5) * 0.05);
                const w = (area.isSynthetic ? 0.5 : 1.2) * 1.1;
                dummy.position.set(x, h / 2, z);
                dummy.rotation.y = time;
                dummy.scale.set(w, h, w);
                dummy.updateMatrix();
                meshRef.current.setMatrixAt(i, dummy.matrix);
                glowMeshRef.current.setMatrixAt(i, dummy.matrix);
            }
        });
        meshRef.current.instanceMatrix.needsUpdate = true;
        glowMeshRef.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <group>
            <instancedMesh ref={meshRef} args={[null, null, data.length]} onPointerOver={(e) => { e.stopPropagation(); setHoveredArea(data[e.instanceId]); document.body.style.cursor = 'pointer'; }} onPointerOut={() => { setHoveredArea(null); document.body.style.cursor = 'auto'; }} onClick={(e) => { e.stopPropagation(); setActiveArea(data[e.instanceId]); }}>
                <cylinderGeometry args={[1, 1, 1, 6]} />
                <meshStandardMaterial roughness={0.1} metalness={0.8} transparent opacity={0.9} />
            </instancedMesh>
            <instancedMesh ref={glowMeshRef} args={[null, null, data.length]} pointerEvents="none">
                <cylinderGeometry args={[1.1, 1.1, 1.05, 6]} />
                <meshBasicMaterial transparent opacity={0.3} toneMapped={false} />
            </instancedMesh>
        </group>
    );
};

const AtmosphericParticles = ({ count = 2000 }) => {
    const pointsRef = useRef();
    const particles = useMemo(() => {
        const p = new Float32Array(count * 3);
        const s = new Float32Array(count);
        for (let i = 0; i < count; i++) {
            p[i * 3] = (Math.random() - 0.5) * 1600;
            p[i * 3 + 1] = Math.random() * 200;
            p[i * 3 + 2] = (Math.random() - 0.5) * 1600;
            s[i] = Math.random();
        }
        return { p, s };
    }, [count]);
    useFrame((state) => {
        for (let i = 0; i < count; i++) {
            pointsRef.current.geometry.attributes.position.array[i * 3 + 1] -= 0.1 * particles.s[i];
            if (pointsRef.current.geometry.attributes.position.array[i * 3 + 1] < 0) pointsRef.current.geometry.attributes.position.array[i * 3 + 1] = 200;
        }
        pointsRef.current.geometry.attributes.position.needsUpdate = true;
    });
    return <points ref={pointsRef}><bufferGeometry><bufferAttribute attach="attributes-position" count={particles.p.length / 3} array={particles.p} itemSize={3} /></bufferGeometry><pointsMaterial size={0.8} color="#ffffff" transparent opacity={0.2} blending={THREE.AdditiveBlending} sizeAttenuation /></points>;
};

const MapGrid = ({ theme, onMapClick }) => {
    const texture = useLoader(THREE.TextureLoader, '/delhi_map_schematic.png');
    return (
        <group>
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} frustumCulled={false}>
                <planeGeometry args={[1400, 1400]} />
                <meshBasicMaterial map={texture} color={theme === 'dark' ? "#666666" : "#ffffff"} transparent opacity={theme === 'dark' ? 1 : 0.6} side={THREE.DoubleSide} />
            </mesh>
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.4, 0]} visible={true} onClick={(e) => { e.stopPropagation(); onMapClick && onMapClick(e.point); }}>
                <planeGeometry args={[1400, 1400]} />
                <meshBasicMaterial transparent opacity={0} />
            </mesh>
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.6, 0]} frustumCulled={false}>
                <planeGeometry args={[3000, 3000]} />
                <meshBasicMaterial color={theme === 'dark' ? "#020202" : "#f1f5f9"} />
            </mesh>
        </group>
    );
};

const Scene = ({ data, activeArea, setActiveArea, theme }) => {
    const [hoveredArea, setHoveredArea] = useState(null);
    const displayedArea = hoveredArea || activeArea;
    const labels = useMemo(() => data.filter(a => !a.isSynthetic), [data]);

    return (
        <>
            <PerspectiveCamera makeDefault position={[0, 80, 120]} fov={45} near={1} far={5000} />
            <MapControls makeDefault enableDamping dampingFactor={0.05} maxPolarAngle={Math.PI / 2.5} minDistance={20} maxDistance={1200} />
            <ambientLight intensity={theme === 'dark' ? 0.3 : 0.6} />
            <pointLight position={[100, 300, 100]} intensity={2} color="#ffffff" />
            <directionalLight position={[-100, 200, -100]} intensity={1} color="#4f46e5" />
            {theme === 'dark' && (<><Stars radius={1000} depth={50} count={20000} factor={4} saturation={0} fade speed={1} /><AtmosphericParticles /></>)}
            <Suspense fallback={null}>
                <MapGrid theme={theme} onMapClick={(point) => { if (activeArea) setActiveArea(null); }} />
            </Suspense>
            <PollutionInstances data={data} activeArea={activeArea} setActiveArea={setActiveArea} hoveredArea={hoveredArea} setHoveredArea={setHoveredArea} />
            {labels.map(area => (
                <Html key={`label-${area.id}`} position={[area.position[0], Math.max(2, area.aqi / 8) + 2, area.position[2]]} center distanceFactor={15}>
                    <div className={`pointer-events-none transition-all duration-300 ${activeArea?.id === area.id || hoveredArea?.id === area.id ? 'opacity-100 z-50' : 'opacity-80'}`}>
                        <div className="flex flex-col items-center">
                            <span className={`text-[10px] font-black uppercase tracking-widest whitespace-nowrap drop-shadow-md ${activeArea?.id === area.id || hoveredArea?.id === area.id ? 'text-white scale-110' : 'text-gray-400'}`} style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>{area.name}</span>
                        </div>
                    </div>
                </Html>
            ))}
            {displayedArea && (
                <Html position={[displayedArea.position[0], Math.max(2, displayedArea.aqi / 8) * (displayedArea.isSynthetic ? 0.4 : 1) + 8, displayedArea.position[2]]} center distanceFactor={12} zIndexRange={[100, 0]}>
                    <div className="pointer-events-none whitespace-nowrap animate-in fade-in zoom-in duration-300">
                        <div className="bg-black/90 backdrop-blur-2xl border border-white/20 rounded-xl p-4 shadow-2xl flex flex-col items-center gap-1 min-w-[140px] border-b-4" style={{ borderBottomColor: displayedArea.color }}>
                            <span className="text-[10px] text-gray-500 uppercase font-black tracking-[0.2em]">{displayedArea.isSynthetic ? 'SENSOR NODE' : 'TACTICAL SECTOR'}</span>
                            <span className="font-bold text-white uppercase text-base tracking-tight">{displayedArea.name}</span>
                            <div className="h-px w-full bg-white/10 my-2"></div>
                            <div className="flex items-baseline gap-2">
                                <span className="font-mono font-black text-3xl" style={{ color: displayedArea.color }}>{displayedArea.aqi}</span>
                                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">AQI</span>
                            </div>
                        </div>
                        <div className="w-px h-12 bg-gradient-to-t from-transparent via-white/50 to-transparent mx-auto"></div>
                    </div>
                </Html>
            )}
            <EffectComposer disableNormalPass>
                <Bloom luminanceThreshold={0.5} luminanceSmoothing={0.9} height={300} intensity={1.5} />
                <Noise opacity={0.03} />
                <Vignette eskil={false} offset={0.1} darkness={1.1} />
                <ChromaticAberration offset={[0.0005, 0.0005]} />
            </EffectComposer>
        </>
    );
};

// ==========================================
// 2D HELPERS (V5.0)
// ==========================================

const MapResizer = () => {
    const map = useMap();
    useEffect(() => { setTimeout(() => { map.invalidateSize(); }, 500); }, [map]);
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

const MapController = ({ center, zoom }) => {
    const map = useMap();
    useEffect(() => { if (center) map.flyTo(center, zoom, { duration: 1.5 }); }, [center, zoom, map]);
    return null;
};

// ==========================================
// MAIN MAP3D COMPONENT (MERGED V5.0 + V3.0)
// ==========================================

const Map3D = ({ setActiveTab }) => {
    // --- State: View Mode ---
    const [viewMode, setViewMode] = useState('2D'); // Default to 2D for feature richness
    const { theme, resolvedTheme } = useTheme();
    const currentTheme = resolvedTheme || theme;

    // --- State: V5.0 Data ---
    const [fireFeed, setFireFeed] = useState({ allFires: [], clusters: [], attribution: {}, metadata: { status: 'Initializing' } });
    const [stations, setStations] = useState([]); // 2D Stations
    const [trafficCongestion, setTrafficCongestion] = useState([]);
    const [activeLayer, setActiveLayer] = useState('stations');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // --- State: V3.0 Data ---
    const [sceneData, setSceneData] = useState([]); // 3D Data
    const [activeArea, setActiveArea] = useState(null);
    const [mapCenter, setMapCenter] = useState([28.6139, 77.2090]);
    const [mapZoom, setMapZoom] = useState(11);

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
        setTrafficCongestion([
            { id: 1, path: [[28.62, 77.24], [28.64, 77.31]], intensity: 'critical' },
            { id: 2, path: [[28.59, 77.16], [28.54, 77.27]], intensity: 'heavy' },
            { id: 3, path: [[28.71, 77.11], [28.81, 77.06]], intensity: 'moderate' }
        ]);

        // Prepare 3D Data
        const main = getAllAreasData().map(item => {
            const latLong = AREA_COORDS[item.id];
            return {
                ...item,
                coords: latLong,
                position: latLong ? latLngToVector3(latLong[0], latLong[1]) : [0, 0, 0],
                isSynthetic: false
            };
        });
        const dense = denseStations.map(item => ({
            ...item,
            position: latLngToVector3(item.coords[0], item.coords[1]),
            isSynthetic: true
        }));
        setSceneData([...main, ...dense]);

        const interval = setInterval(() => {
            loadSatelliteData();
            // Optional: Update stations if they change dynamic
        }, 300000);

        return () => clearInterval(interval);

    }, [denseStations]);

    // Live 3D Animation Loop
    useEffect(() => {
        if (viewMode !== '3D') return;
        const interval = setInterval(() => {
            setSceneData(prev => prev.map(item => {
                if (item.isSynthetic) {
                    const flux = (Math.random() - 0.5) * 15;
                    const newAQI = Math.max(50, Math.min(500, Math.round(item.aqi + flux)));
                    const level = getAirQualityLevel(newAQI);
                    return { ...item, aqi: newAQI, ...level, pollutants: calculatePollutants(newAQI) };
                }
                return { ...item, aqi: getCurrentAQI(item.id, new Date()) };
            }));
        }, 5000);
        return () => clearInterval(interval);
    }, [viewMode]);

    return (
        <div className="relative w-full min-h-[calc(100vh-80px)] overflow-hidden bg-[#09090b] flex flex-col">

            {/* --- HEADER CONTROLS (Common) --- */}
            <div className="absolute top-0 left-0 right-0 z-[1100] p-4 md:p-6 pointer-events-none">
                <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 pointer-events-auto">
                    {/* Title */}
                    <div className="flex items-center gap-4 glass p-3 rounded-2xl border border-white/5 bg-black/50 backdrop-blur-md">
                        <div className="bg-primary/20 p-2 rounded-lg">
                            <MapIcon className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <h3 className="font-bold text-white text-sm md:text-base flex items-center gap-2">
                                Spatial Intelligence
                                <span className={`text-[10px] px-2 py-0.5 rounded border ${viewMode === '3D' ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30' : 'bg-primary/20 text-primary border-primary/30'}`}>
                                    {viewMode === '3D' ? 'IMMERSIVE V3.0' : 'TACTICAL V5.0'}
                                </span>
                            </h3>
                            <p className="text-[9px] md:text-[10px] text-gray-400 uppercase tracking-widest font-black">
                                {viewMode === '3D' ? 'Live Geospatial Mesh' : 'Proximity Clustering & Zones'}
                            </p>
                        </div>
                    </div>

                    {/* Mode Switcher & Layers */}
                    <div className="flex items-center gap-3">
                        {viewMode === '2D' && (
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
                        )}

                        <button
                            onClick={() => setViewMode(prev => prev === '3D' ? '2D' : '3D')}
                            className="glass px-5 py-4 rounded-2xl flex items-center gap-2 text-xs font-bold border border-white/10 text-white hover:bg-white/10 transition-all uppercase tracking-widest shadow-xl bg-primary/10"
                        >
                            {viewMode === '3D' ? <MapIcon className="w-4 h-4" /> : <Globe className="w-4 h-4" />}
                            <span>{viewMode === '3D' ? '2D Map' : '3D View'}</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* --- COMPONENT BODY --- */}

            {/* Satellite Loader (Common) */}
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

            {/* Main Content Area */}
            <div className="relative w-full h-[85vh]">

                {viewMode === '2D' ? (
                    // --- 2D VIEW (V5.0 Logic) ---
                    <div className="h-full w-full relative">
                        <div className="absolute top-24 right-0 z-[900] w-full md:w-auto px-4 md:px-0 pointer-events-none">
                            <div className="pointer-events-auto">
                                <Suspense fallback={null}>
                                    <FireIntelligenceCenter fireFeed={fireFeed} onNavigate={setActiveTab} />
                                </Suspense>
                            </div>
                        </div>

                        <MapContainer center={[29.2, 76.5]} zoom={8} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }} zoomControl={false}>
                            <MapResizer />
                            <ZoomControl position="bottomright" />
                            <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" attribution='&copy; CARTO' />

                            {activeLayer === 'stations' && stations.map(s => (
                                <Marker key={s.id} position={s.coords} icon={createAQIIcon(s.aqi, s.color)} />
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
                                <Polyline key={l.id} positions={l.path} pathOptions={{ color: l.intensity === 'critical' ? '#ef4444' : '#3b82f6', weight: 8, opacity: 0.9 }} />
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
                ) : (
                    // --- 3D VIEW (V3.0 Logic) ---
                    <div className="h-full w-full relative">
                        <Canvas shadows dpr={[1, 2]} gl={{ antialias: true, alpha: true }}>
                            <Scene data={sceneData} activeArea={activeArea} setActiveArea={setActiveArea} theme={currentTheme} />
                        </Canvas>

                        {/* 3D Overlays */}
                        <div className="absolute bottom-6 right-6 z-[900] pointer-events-none">
                            <div className="bg-black/80 backdrop-blur-md p-4 rounded-2xl border border-white/10 max-w-xs pointer-events-auto">
                                <h4 className="text-[10px] font-bold text-white mb-2 flex items-center gap-2"><Activity className="w-3 h-3 text-primary" /> 3D Telemetry</h4>
                                <div className="text-2xl font-black text-white font-mono">{activeArea ? activeArea.aqi : Math.round(sceneData.reduce((a, b) => a + b.aqi, 0) / (sceneData.length || 1))} <span className="text-[10px] text-gray-500">AVG AQI</span></div>
                                <div className="text-[9px] text-gray-400 mt-1 uppercase tracking-wider">
                                    {activeArea ? activeArea.name : 'Global Sector Scan'}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default Map3D;