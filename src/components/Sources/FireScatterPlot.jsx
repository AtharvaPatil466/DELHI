// FILE: DELHI/src/components/Sources/FireScatterPlot.jsx
import React, { useMemo } from 'react';
import { MapContainer, TileLayer, CircleMarker, Marker, Popup, Rectangle, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Star, ShieldAlert, Crosshair, Map as MapIcon } from 'lucide-react';

const MapController = ({ center, zoom }) => {
    const map = useMap();
    React.useEffect(() => {
        map.setView(center, zoom);
    }, [center, zoom, map]);
    return null;
};

const FireScatterPlot = ({ fires = [], center = [31.0, 75.5], zoom = 7 }) => {
    // Delhi: 28.6139, 77.2090
    const DELHI_COORDS = [28.61, 77.23];

    // Punjab/Haryana Bounding Box (Approx)
    const BURNING_BELT_BOUNDS = [
        [29.5, 74.0], // Southwest
        [32.5, 77.0]  // Northeast
    ];

    const getConfidenceColor = (confidence, frp) => {
        if (frp > 150 || confidence === 'high' || confidence === 'High' || confidence === 'Critical') return '#ef4444'; // Red
        if (frp > 50 || confidence === 'nominal' || confidence === 'Nominal') return '#f97316'; // Orange
        return '#facc15'; // Yellow
    };

    const delhiIcon = L.divIcon({
        className: 'delhi-star-marker',
        html: `
            <div style="color: #22c55e; filter: drop-shadow(0 0 8px #22c55e); transform: scale(1.5);">
                <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="currentColor" stroke-linecap="round" stroke-linejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
            </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
    });

    return (
        <div className="relative w-full h-full rounded-2xl overflow-hidden border border-white/5 bg-[#0a0a0a] group">
            <MapContainer
                center={center}
                zoom={zoom}
                scrollWheelZoom={true}
                className="w-full h-full"
                zoomControl={true}
                dragging={true}
                attributionControl={false}
            >
                <MapController center={center} zoom={zoom} />
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png"
                />

                {/* 1. Punjab/Haryana Bounding Box */}
                <Rectangle
                    bounds={BURNING_BELT_BOUNDS}
                    pathOptions={{
                        color: '#ffffff',
                        weight: 1,
                        dashArray: '5, 10',
                        fillColor: '#ffffff',
                        fillOpacity: 0.03
                    }}
                />

                {/* 2. Fire Points (Scatter) */}
                {fires.map((fire, i) => (
                    <CircleMarker
                        key={`scatter-${i}`}
                        center={fire.position}
                        radius={Math.max(3, (fire.impactScore || fire.frp / 10 || 5) * 0.8)}
                        pathOptions={{
                            fillColor: getConfidenceColor(fire.confidence, fire.frp),
                            fillOpacity: 0.7,
                            color: '#ffffff',
                            weight: 0.5
                        }}
                    >
                        <Popup className="custom-popup">
                            <div className="p-2 bg-slate-900 text-white rounded-lg border border-white/10 min-w-[140px]">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-[10px] font-black text-gray-500 uppercase">Hotspot #{i + 1}</span>
                                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${fire.frp > 100 ? 'bg-red-500/20 text-red-400' : 'bg-orange-500/20 text-orange-400'}`}>
                                        {fire.confidence}
                                    </span>
                                </div>
                                <div className="space-y-1">
                                    <div className="flex justify-between text-xs">
                                        <span className="text-gray-400">FRP:</span>
                                        <span className="font-mono font-bold">{fire.frp} MW</span>
                                    </div>
                                    <div className="flex justify-between text-xs">
                                        <span className="text-gray-400">Impact:</span>
                                        <span className="text-primary font-bold">{fire.impactScore || 'N/A'}</span>
                                    </div>
                                    <div className="text-[9px] text-gray-500 mt-2 border-t border-white/5 pt-1">
                                        LAT: {fire.position[0].toFixed(3)} | LON: {fire.position[1].toFixed(3)}
                                    </div>
                                </div>
                            </div>
                        </Popup>
                    </CircleMarker>
                ))}

                {/* 3. Delhi Marker (Green Star) */}
                <Marker position={DELHI_COORDS} icon={delhiIcon}>
                    <Popup>
                        <div className="p-1 font-bold text-success">NCR Receptor Point</div>
                    </Popup>
                </Marker>

            </MapContainer>

            {/* Overlays */}
            <div className="absolute top-4 left-4 z-[1000] space-y-2 pointer-events-none">
                <div className="bg-black/80 backdrop-blur-md p-3 rounded-xl border border-white/10 shadow-xl">
                    <div className="flex items-center gap-2 mb-2">
                        <Crosshair className="w-3.5 h-3.5 text-primary" />
                        <h4 className="text-[10px] font-bold text-white uppercase tracking-widest">Spatial Scatter v2.1</h4>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_#ef4444]"></div>
                            <span className="text-[9px] font-bold text-gray-400 uppercase">Critical</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                            <span className="text-[9px] font-bold text-gray-400 uppercase">High</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                            <span className="text-[9px] font-bold text-gray-400 uppercase">Nominal</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="absolute border border-dashed border-white/20 top-[42%] left-[30%] w-32 h-32 rounded-full pointer-events-none opacity-20 bg-white/5 animate-pulse"></div>
        </div>
    );
};

export default FireScatterPlot;
