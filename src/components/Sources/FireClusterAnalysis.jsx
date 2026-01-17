// FILE: DELHI/src/components/Sources/FireClusterAnalysis.jsx
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Target, Zap, Activity, Shield, MapPin, ChevronRight } from 'lucide-react';

const ClusterCard = ({ cluster = {}, index, onZoom }) => {
    const { center = [0, 0], fires = [], totalFRP = 0, avgConfidence = 0, id } = cluster;

    // Severity logic
    const safeFires = Array.isArray(fires) ? fires : [];
    const isHighSeverity = totalFRP > 500 || safeFires.length > 10;
    const severityColor = isHighSeverity ? 'text-red-400' : (totalFRP > 200 ? 'text-orange-400' : 'text-yellow-400');
    const severityBg = isHighSeverity ? 'bg-red-500/10' : (totalFRP > 200 ? 'bg-orange-500/10' : 'bg-yellow-500/10');
    const severityBorder = isHighSeverity ? 'border-red-500/20' : (totalFRP > 200 ? 'border-orange-500/20' : 'border-yellow-500/20');

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => onZoom && onZoom(center)}
            className={`cursor-pointer group relative p-4 rounded-xl border ${severityBorder} ${severityBg} hover:bg-white/5 transition-all mb-3 overflow-hidden`}
        >
            <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-lg ${severityBg}`}>
                        <Target className={`w-4 h-4 ${severityColor}`} />
                    </div>
                    <div>
                        <h4 className="text-[11px] font-black text-white uppercase tracking-tighter">Cluster {id || `#${index + 1}`}</h4>
                        <div className="flex items-center gap-1 text-[9px] text-gray-500 font-bold">
                            <MapPin className="w-2.5 h-2.5" />
                            {center[0].toFixed(2)}, {center[1].toFixed(2)}
                        </div>
                    </div>
                </div>
                <div className={`px-2 py-0.5 rounded text-[9px] font-black border ${severityBorder} ${severityColor} uppercase tracking-widest`}>
                    {isHighSeverity ? 'Critical' : 'Active'}
                </div>
            </div>

            <div className="grid grid-cols-3 gap-2 border-t border-white/5 pt-3">
                <div className="space-y-0.5">
                    <p className="text-[8px] font-bold text-gray-500 uppercase">Fires</p>
                    <div className="flex items-center gap-1">
                        <Activity className="w-3 h-3 text-white/40" />
                        <span className="text-sm font-black text-white">{safeFires.length}</span>
                    </div>
                </div>
                <div className="space-y-0.5">
                    <p className="text-[8px] font-bold text-gray-500 uppercase">Total FRP</p>
                    <div className="flex items-center gap-1">
                        <Zap className="w-3 h-3 text-orange-400/60" />
                        <span className="text-sm font-black text-white">{Math.round(totalFRP)}MW</span>
                    </div>
                </div>
                <div className="space-y-0.5">
                    <p className="text-[8px] font-bold text-gray-500 uppercase">Confidence</p>
                    <div className="flex items-center gap-1">
                        <Shield className="w-3 h-3 text-blue-400/60" />
                        <span className="text-sm font-black text-white">{Math.round(avgConfidence || 85)}%</span>
                    </div>
                </div>
            </div>

            <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                <ChevronRight className="w-4 h-4 text-white/20" />
            </div>
        </motion.div>
    );
};

const FireClusterAnalysis = ({ clusters = [], onZoom }) => {
    const sortedClusters = useMemo(() => {
        return [...clusters].sort((a, b) => (b.totalFRP || 0) - (a.totalFRP || 0));
    }, [clusters]);

    return (
        <div className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
                    <Target className="w-4 h-4 text-primary" />
                    Heat Concentration Analysis
                </h3>
                <span className="text-[10px] font-bold text-gray-500">{clusters.length} Active Zones</span>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                {sortedClusters.length > 0 ? (
                    sortedClusters.map((cluster, i) => (
                        <ClusterCard
                            key={cluster.id || i}
                            cluster={cluster}
                            index={i}
                            onZoom={onZoom}
                        />
                    ))
                ) : (
                    <div className="h-full flex flex-col items-center justify-center opacity-20 text-center p-8">
                        <Activity className="w-12 h-12 mb-4" />
                        <p className="text-xs font-bold uppercase tracking-widest">No intensity clusters detected for selected window</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FireClusterAnalysis;
