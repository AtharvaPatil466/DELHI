import React, { useState, useMemo } from 'react';
import { MapPin, Navigation, Clock, ShieldCheck, AlertTriangle, ChevronRight, Activity } from 'lucide-react';
import { getAlternativeRoutes, getRouteInsight } from '../../utils/routeOptimizer';

const SafeRoutes = () => {
    const [start, setStart] = useState('Connaught Place');
    const [end, setEnd] = useState('Noida Sector 62');

    const routes = useMemo(() => getAlternativeRoutes(start, end), [start, end]);
    const insight = getRouteInsight(routes);

    return (
        <div className="glass p-6 rounded-3xl border-white/5 h-full">
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-lg flex items-center gap-2">
                    <Navigation className="w-5 h-5 text-primary" />
                    Safe Route Planner
                </h3>
                <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full border border-primary/20">
                    <ShieldCheck className="w-3 h-3 text-primary" />
                    <span className="text-[10px] font-bold text-primary uppercase text-nowrap">Exposure Minimized</span>
                </div>
            </div>

            <div className="space-y-4 mb-6">
                <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                    <input
                        value={start}
                        onChange={(e) => setStart(e.target.value)}
                        className="w-full bg-surface border border-white/5 rounded-2xl pl-10 pr-4 py-3 text-sm font-medium outline-none focus:border-primary/50 transition-all"
                        placeholder="Starting Point"
                    />
                </div>
                <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-danger shadow-[0_0_10px_rgba(239,68,68,0.5)]"></div>
                    <input
                        value={end}
                        onChange={(e) => setEnd(e.target.value)}
                        className="w-full bg-surface border border-white/5 rounded-2xl pl-10 pr-4 py-3 text-sm font-medium outline-none focus:border-primary/50 transition-all"
                        placeholder="Destination"
                    />
                </div>
            </div>

            <div className="space-y-4">
                {routes.map((route, i) => (
                    <div key={route.id} className={`p-4 rounded-2xl border transition-all ${i === 0 ? 'bg-primary/5 border-primary shadow-lg shadow-primary/5' : 'bg-surface/50 border-white/5 hover:border-white/10'
                        }`}>
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <h4 className="font-bold text-sm flex items-center gap-2">
                                    {route.name}
                                    {i === 0 && <span className="bg-primary text-[8px] px-1.5 py-0.5 rounded-md uppercase font-black">Best</span>}
                                </h4>
                                <p className="text-[10px] text-gray-500 mt-1">{route.note}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs font-black text-gray-300">{route.distance} km</p>
                                <p className="text-[10px] text-gray-500">{route.duration} mins</p>
                            </div>
                        </div>

                        <div className="flex items-center justify-between mt-4 border-t border-white/5 pt-4">
                            <div className="flex items-center gap-4">
                                <div>
                                    <p className="text-[8px] text-gray-500 uppercase font-black">Avg AQI</p>
                                    <p className={`text-xs font-black ${route.avgAQI > 300 ? 'text-danger' : 'text-success'}`}>{route.avgAQI}</p>
                                </div>
                                <div>
                                    <p className="text-[8px] text-gray-500 uppercase font-black">Exposure</p>
                                    <p className="text-xs font-black text-white">{route.exposureScore}</p>
                                </div>
                            </div>
                            <div className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase ${route.rating === 'Safe' ? 'bg-success/20 text-success' : 'bg-warning/20 text-warning'
                                }`}>
                                {route.rating}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-6 p-4 bg-white/5 rounded-2xl border border-white/5">
                <p className="text-xs text-primary font-medium leading-relaxed italic">
                    {insight}
                </p>
            </div>
        </div>
    );
};

export default SafeRoutes;
