// FILE: DELHI/src/components/Sources/FireIntelligenceCenter.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Flame, Wind, Activity, Layers, Clock, ShieldCheck, WifiOff, RefreshCcw, Database, TrendingUp } from 'lucide-react';

const StatCard = ({ label, value, icon: Icon, color, subtext, pulse }) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full glass p-3 rounded-2xl border border-white/5 flex items-center justify-between group hover:border-white/10 transition-all mb-2"
        >
            <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-${color}/10 border border-${color}/20`}>
                    <Icon className={`w-4 h-4 text-${color}`} />
                </div>
                <div>
                    <h4 className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-0.5">{label}</h4>
                    <div className="flex items-baseline gap-1.5">
                        <span className="text-xl font-black text-white tracking-tight">{value}</span>
                        {subtext && <span className="text-[8px] font-bold text-gray-600 uppercase tracking-tighter">{subtext}</span>}
                    </div>
                </div>
            </div>

            {pulse && (
                <div className="flex items-center gap-2">
                    <span className="relative flex h-1.5 w-1.5">
                        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-${color} opacity-75`}></span>
                        <span className={`relative inline-flex rounded-full h-1.5 w-1.5 bg-${color}`}></span>
                    </span>
                </div>
            )}
        </motion.div>
    );
};

const FireIntelligenceCenter = ({
    fireFeed = { allFires: [], impactfulFires: [], clusters: [], attribution: {}, metadata: {} },
    onNavigate
}) => {
    const { allFires = [], impactfulFires = [], clusters = [], attribution = {}, metadata = {} } = fireFeed;

    const metrics = [
        {
            label: "Total Hotspots",
            value: allFires.length,
            icon: Flame,
            color: "orange-500",
            subtext: "24H ACTIVE",
            pulse: true
        },
        {
            label: "Upwind Risk",
            value: impactfulFires.length,
            icon: Wind,
            color: "red-500",
            subtext: "DELHI SECTOR",
            pulse: true
        },
        {
            label: "Stubble Impact",
            value: `${attribution.stubblePercentage || 0}%`,
            icon: Activity,
            color: "rose-500",
            subtext: "MODEL EST.",
            pulse: false
        },
        {
            label: "Active Clusters",
            value: clusters.length,
            icon: Layers,
            color: "indigo-500",
            subtext: "HIGH SEVERITY",
            pulse: false
        }
    ];

    const lastUpdate = metadata.timestamp ? new Date(metadata.timestamp).toLocaleTimeString() : "N/A";

    return (
        <div className="w-full flex flex-col gap-2">
            {/* Command Header */}
            <div className="flex items-center justify-between px-2 mb-1">
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
                    <span className="text-[9px] font-black text-white uppercase tracking-[0.2em]">Intel Command</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <Clock className="w-2.5 h-2.5 text-gray-600" />
                    <span className="text-[8px] font-bold text-gray-600 uppercase">{lastUpdate}</span>
                </div>
            </div>

            {/* Metrics Stack */}
            <div className="flex flex-col gap-1">
                {metrics.map((m, i) => (
                    <StatCard key={i} {...m} />
                ))}
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-col gap-2 mt-2">
                {onNavigate && (
                    <button
                        onClick={() => onNavigate('sources')}
                        className="w-full py-2.5 bg-primary/10 border border-primary/20 rounded-xl hover:bg-primary/20 transition-all group"
                    >
                        <span className="text-[9px] font-black text-primary uppercase tracking-widest flex items-center justify-center gap-2">
                            Full Source Intel <TrendingUp className="w-3 h-3" />
                        </span>
                    </button>
                )}

                <div className={`flex items-center justify-between px-3 py-2 rounded-xl border bg-black/40 backdrop-blur-sm ${metadata.isLive ? 'border-success/20' : 'border-orange-500/20'}`}>
                    <div className="flex items-center gap-2">
                        {metadata.isLive ? <ShieldCheck className="w-3 h-3 text-success" /> : <Database className="w-3 h-3 text-orange-500" />}
                        <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest leading-none">
                            NASA: {metadata.status || 'Active'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FireIntelligenceCenter;
