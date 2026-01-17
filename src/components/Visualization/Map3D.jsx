import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { getAllAreasData, generateDenseNetwork } from '../../utils/dataGenerator';
import { Wind, Maximize2, RotateCcw, Activity, Map as MapIcon, Info, Layers } from 'lucide-react';

// Fix for default Leaflet marker icon not working in React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Real Coordinates for Delhi Areas
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

// Component to handle map view reset
const MapController = ({ center, zoom }) => {
    const map = useMap();
    useEffect(() => {
        map.flyTo(center, zoom, { duration: 1.5 });
    }, [center, zoom, map]);
    return null;
};

const Map3D = () => {
    // Merge main stations with dense network
    const [data] = useState(() => {
        const main = getAllAreasData();
        const dense = generateDenseNetwork();
        return [...main, ...dense];
    });
    const [activeArea, setActiveArea] = useState(null);
    const [mapCenter, setMapCenter] = useState([28.6139, 77.2090]); // Delhi Center
    const [mapZoom, setMapZoom] = useState(11);

    // Custom Marker Generator (Adjusted for density)
    const createCustomIcon = (aqi, color, isSynthetic) => {
        // Hex to RGB for css variable
        const hexToRgb = (hex) => {
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '255, 255, 255';
        };

        const size = isSynthetic ? 24 : 32; // Larger bubbles for text
        const fontSize = isSynthetic ? '9px' : '11px';

        return L.divIcon({
            className: 'custom-marker',
            html: `<div class="marker-pin ${!isSynthetic ? 'animate' : ''}" style="width: ${size}px; height: ${size}px; background-color: ${color}; --marker-color: ${hexToRgb(color)}">
                <span style="font-size: ${fontSize}; pointer-events: none;">${aqi}</span>
            </div>`,
            iconSize: [size, size],
            iconAnchor: [size / 2, size / 2],
            popupAnchor: [0, -10]
        });
    };

    const handleReset = () => {
        setMapCenter([28.6139, 77.2090]);
        setMapZoom(11);
        setActiveArea(null);
    };

    return (
        <div className="p-8 bg-background min-h-[calc(100vh-80px)] flex flex-col font-sans">
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
                <div className="relative">
                    <div className="absolute -left-4 top-0 w-1 h-full bg-primary rounded-full"></div>
                    <h2 className="text-3xl font-black flex items-center gap-4 text-white tracking-tighter">
                        SPATIAL INTELLIGENCE
                        <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded border border-primary/30">LIVE V3.0</span>
                    </h2>
                    <p className="text-gray-500 text-xs mt-1 uppercase tracking-[0.3em] font-bold opacity-60">
                        Geospatial Pollution Grid • Delhi NCR Sector
                    </p>
                </div>

                <div className="flex gap-4">
                    <div className="glass px-5 py-2.5 rounded-lg flex items-center gap-4 text-[10px] font-black border-white/5 text-gray-400 uppercase tracking-widest">
                        <Wind className="w-4 h-4 text-primary animate-pulse" />
                        <span>Live Vector Data</span>
                    </div>
                    <button
                        onClick={handleReset}
                        className="p-3 bg-white/5 hover:bg-white/10 rounded-lg border border-white/5 text-gray-500 hover:text-white transition-all"
                    >
                        <RotateCcw className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Map Container */}
            <div className="flex-1 rounded-3xl overflow-hidden relative border border-white/10 shadow-2xl bg-[#09090b] min-h-[500px]">
                <MapContainer
                    center={[28.6139, 77.2090]}
                    zoom={11}
                    style={{ height: '100%', width: '100%', background: '#09090b', position: 'absolute', top: 0, left: 0 }}
                    zoomControl={false}
                    attributionControl={false}
                >
                    {/* Dark Matter Tiles */}
                    <TileLayer
                        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    />

                    <ZoomControl position="bottomright" />
                    <MapController center={mapCenter} zoom={mapZoom} />

                    {/* Render Markers */}
                    {data.map((area) => {
                        const coords = area.coords || AREA_COORDS[area.id];
                        if (!coords) return null;

                        return (
                            <Marker
                                key={area.id}
                                position={coords}
                                icon={createCustomIcon(area.aqi, area.color, area.isSynthetic)}
                                eventHandlers={{
                                    click: () => {
                                        setActiveArea(area);
                                        setMapCenter(coords);
                                        setMapZoom(13);
                                    },
                                }}
                            >
                                <Popup closeButton={false} offset={[0, -10]}>
                                    <div className="w-[280px] bg-white/5 backdrop-blur-md p-0">
                                        <div className="relative h-24 bg-gradient-to-r from-indigo-500 to-purple-600 p-4">
                                            <div className="absolute inset-0 bg-black/20"></div>
                                            <h3 className="relative text-lg font-bold text-white z-10">{area.name}</h3>
                                            <p className="relative text-[10px] text-white/80 uppercase tracking-widest z-10 font-bold mt-1">
                                                Sector ID: {area.id.toUpperCase().slice(0, 3)}-{Math.floor(Math.random() * 999)}
                                            </p>
                                        </div>
                                        <div className="p-5">
                                            <div className="flex justify-between items-end mb-4">
                                                <div>
                                                    <p className="text-[10px] text-gray-400 uppercase font-bold mb-1">Current AQI</p>
                                                    <p className="text-4xl font-black font-mono text-white" style={{ color: area.color }}>
                                                        {area.aqi}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <div className={`text-[10px] font-bold px-2 py-1 rounded border border-current opacity-80`} style={{ color: area.color, borderColor: area.color }}>
                                                        SEVERE
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-3 mb-4">
                                                <div className="bg-white/5 p-2 rounded">
                                                    <p className="text-[9px] text-gray-500 font-bold uppercase">PM 2.5</p>
                                                    <p className="text-sm font-mono text-white">{area.pollutants.pm25}</p>
                                                </div>
                                                <div className="bg-white/5 p-2 rounded">
                                                    <p className="text-[9px] text-gray-500 font-bold uppercase">PM 10</p>
                                                    <p className="text-sm font-mono text-white">{area.pollutants.pm10}</p>
                                                </div>
                                            </div>

                                            <button className="w-full py-2 bg-white/10 hover:bg-white/20 rounded text-xs font-bold text-white transition-colors">
                                                View Sector Analytics
                                            </button>
                                        </div>
                                    </div>
                                </Popup>
                            </Marker>
                        );
                    })}
                </MapContainer>

                {/* Overlay UI Elements Over Map */}
                <div className="absolute top-6 left-6 z-[1000] pointer-events-none">
                    <div className="bg-black/80 backdrop-blur-md border border-white/10 px-4 py-2 rounded-lg flex items-center gap-3">
                        <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                        <span className="text-[10px] uppercase font-bold text-white tracking-widest">Satellite Link: STABLE</span>
                    </div>
                </div>

                {/* HUD: Telemetry Panel (Restored for Persistent AQI) */}
                <div className="absolute top-24 left-6 z-[1000] pointer-events-none max-w-sm hidden md:block">
                    <div className="bg-black/90 backdrop-blur-xl p-6 border-l-4 border-primary shadow-2xl skew-x-[-2deg] animate-in slide-in-from-left duration-500">
                        <div className="flex items-center gap-3 mb-4 opacity-50">
                            <Activity className="w-4 h-4 text-primary" />
                            <h4 className="font-black text-[9px] uppercase tracking-[0.4em] text-white">
                                {activeArea ? 'Tactical Telemetry' : 'Global Sector Audit'}
                            </h4>
                        </div>

                        <h3 className="text-2xl font-black text-white mb-2 italic tracking-tighter uppercase">
                            {activeArea ? activeArea.name : 'DELHI NCR SECTOR'}
                        </h3>

                        <div className="text-6xl font-black mb-4 flex items-baseline gap-3 skew-x-[2deg] font-mono"
                            style={{ color: activeArea ? activeArea.color : '#6366f1' }}>
                            {activeArea ? activeArea.aqi : '342'}
                            <span className="text-xs font-bold text-gray-600 uppercase tracking-widest italic">
                                {activeArea ? 'INDEX' : 'AVG NAQI'}
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 opacity-90">
                            <div className="border-t border-white/10 pt-3">
                                <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest mb-1">Particulate 2.5</p>
                                <p className="text-lg font-black text-white font-mono">
                                    {activeArea ? activeArea.pollutants.pm25 : '210'} <span className="text-[10px] text-gray-600">μg</span>
                                </p>
                            </div>
                            <div className="border-t border-white/10 pt-3">
                                <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest mb-1">Particulate 10</p>
                                <p className="text-lg font-black text-white font-mono">
                                    {activeArea ? activeArea.pollutants.pm10 : '294'} <span className="text-[10px] text-gray-600">μg</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* HUD: System Status (Restored) */}
                <div className="absolute top-6 right-6 z-[1000] pointer-events-none text-right hidden lg:block">
                    <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-1">System Status</p>
                    <div className="text-xs font-bold text-success flex items-center justify-end gap-2">
                        <div className="w-1.5 h-1.5 bg-success rounded-full animate-ping"></div>
                        NOMINAL REDACTED
                    </div>
                </div>

                <div className="absolute bottom-8 left-8 z-[1000] pointer-events-none max-w-xs">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                        <Layers className="w-4 h-4 text-primary" />
                        Map Layers
                    </h4>
                    <div className="flex gap-2">
                        <div className="px-3 py-1.5 bg-primary text-white text-[10px] font-bold rounded border border-primary shadow-lg shadow-primary/20">
                            POLLUTION
                        </div>
                        <div className="px-3 py-1.5 bg-black/60 text-gray-400 text-[10px] font-bold rounded border border-white/10">
                            TRAFFIC
                        </div>
                        <div className="px-3 py-1.5 bg-black/60 text-gray-400 text-[10px] font-bold rounded border border-white/10">
                            SENSORS
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Map3D;
