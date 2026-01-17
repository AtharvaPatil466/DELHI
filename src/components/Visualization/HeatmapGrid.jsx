import React, { useState } from 'react';
import { getAllAreasData } from '../../utils/dataGenerator';
import { Info, Map as MapIcon, Zap, Activity } from 'lucide-react';

const HeatmapGrid = () => {
    const [data] = useState(getAllAreasData());
    const [view, setView] = useState('aqi'); // aqi, pm25, no2

    return (
        <div className="p-8 ml-64 bg-background min-h-[calc(100vh-80px)]">
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h2 className="text-2xl font-bold flex items-center gap-3">
                        <Layers className="text-primary w-7 h-7" />
                        Spatial Density Heatmap
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">2D grid visualization of pollution interpolation across NCR zones</p>
                </div>

                <div className="flex bg-surface p-1 rounded-xl border border-white/5">
                    {['aqi', 'pm25', 'no2'].map(type => (
                        <button
                            key={type}
                            onClick={() => setView(type)}
                            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all uppercase tracking-widest ${view === type ? 'bg-primary text-white' : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            {type === 'aqi' ? 'Overall AQI' : type.toUpperCase()}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 lg:gap-8 min-h-[500px]">
                {data.map((area) => {
                    const value = view === 'aqi' ? area.aqi : area.pollutants[view];
                    return (
                        <div
                            key={area.id}
                            className="glass p-2 rounded-3xl overflow-hidden group relative flex flex-col items-center justify-center border-white/5 hover:border-white/20 transition-all duration-500"
                        >
                            {/* Heat Background */}
                            <div
                                className="absolute inset-0 opacity-20 blur-2xl group-hover:opacity-40 transition-opacity duration-1000"
                                style={{ backgroundColor: area.color }}
                            ></div>

                            <div className="relative z-10 text-center">
                                <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center border-4 border-white/5 shadow-2xl transition-transform duration-500 group-hover:scale-110"
                                    style={{ backgroundColor: `${area.color}20`, borderColor: `${area.color}40` }}>
                                    <span className="text-2xl font-black" style={{ color: area.color }}>
                                        {Math.round(value)}
                                    </span>
                                </div>
                                <h3 className="font-bold text-sm text-white mb-1">{area.name}</h3>
                                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{area.level}</p>
                            </div>

                            {/* Pulsing indicator if hazardous */}
                            {area.aqi > 300 && (
                                <div className="absolute top-4 right-4 flex items-center gap-1">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-danger opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-danger"></span>
                                    </span>
                                    <span className="text-[8px] font-black text-danger uppercase tracking-tighter">Hotspot</span>
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>

            <div className="mt-8 glass p-6 rounded-3xl flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex gap-4 items-center">
                    <div className="p-3 bg-surface rounded-2xl border border-white/5">
                        <Info className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <h4 className="font-bold text-white text-sm">Spatial Interpolation Accuracy</h4>
                        <p className="text-[11px] text-gray-500 leading-tight max-w-md italic">
                            Gradient intensities are computed using Inverse Distance Weighting (IDW) between the 10 reference stations shown above.
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-6 py-3 bg-surface border border-white/5 rounded-2xl font-bold text-xs hover:bg-surface/80 transition-all">
                        <Filter className="w-4 h-4" />
                        Advanced Layers
                    </button>
                    <button className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-bold text-xs hover:bg-primary/90 transition-all shadow-xl shadow-primary/20">
                        <Maximize2 className="w-4 h-4" />
                        Interactive Map Mode
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HeatmapGrid;
