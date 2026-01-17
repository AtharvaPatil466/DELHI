// FILE: DELHI/src/components/Sources/FireIntelligenceCenter.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Flame, Wind, Activity, Layers, Clock, ShieldCheck, WifiOff, RefreshCcw, Database } from 'lucide-react';

const StatCard = ({ label, value, icon: Icon, color, subtext, pulse }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 min-w-[200px] glass p-4 rounded-2xl border border-white/5 flex flex-col justify-between group hover:border-white/10 transition-all"
        >
            <div className="flex justify-between items-start mb-2">
                <div className={`p-2 rounded-lg bg-${color}/20`}>
                    <Icon className={`w-4 h-4 text-${color}`} />
                </div>
                {pulse && (
                    <div className="flex items-center gap-1.5">
                        <span className="relative flex h-2 w-2">
                            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-${color} opacity-75`}></span>
                            <span className={`relative inline-flex rounded-full h-2 w-2 bg-${color}`}></span>
                        </span>
                        <span className="text-[8px] font-black text-white/40 uppercase tracking-tighter">Live</span>
                    </div>
                )}
            </div>

            <div>
                <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">{label}</h4>
                <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-white tracking-tight">{value}</span>
                    {subtext && <span className="text-[10px] font-medium text-gray-500">{subtext}</span>}
                </div>
            </div>

            <div className={`mt-3 h-1 w-full bg-white/5 rounded-full overflow-hidden`}>
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className={`h-full bg-${color}`}
                />
            </div>
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
        <div className="w-full space-y-4">
            <div className="flex flex-wrap gap-4">
                {metrics.map((m, i) => (
                    <StatCard key={i} {...m} />
                ))}
            </div>

            <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-3">
                    {onNavigate && (
                        <button
                            onClick={() => onNavigate('sources')}
                            className="flex items-center gap-2 group mr-2"
                        >
                            <div className="p-1 px-3 bg-primary/10 border border-primary/20 rounded-full group-hover:bg-primary/20 transition-all">
                                <span className="text-[10px] font-black text-primary uppercase tracking-widest">View Detailed Analysis →</span>
                            </div>
                        </button>
                    )}

                    {/* Status Badge */}
                    <div className={`flex items-center gap-2 px-2.5 py-1 rounded-full border ${metadata.isLive ? 'bg-success/10 border-success/20 text-success' :
                            metadata.isCached ? 'bg-orange-500/10 border-orange-500/20 text-orange-500' :
                                'bg-zinc-500/10 border-zinc-500/20 text-zinc-500'
                        }`}>
                        {metadata.isLive ? <ShieldCheck className="w-3 h-3" /> :
                            metadata.isCached ? <Database className="w-3 h-3" /> :
                                <WifiOff className="w-3 h-3" />}
                        <span className="text-[9px] font-black uppercase tracking-widest">
                            NASA LINK: {metadata.status || 'Checking...'}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-2 ml-auto">
                    <Clock className="w-3 h-3 text-gray-600" />
                    <span className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">
                        Last Intelligence Sync: {lastUpdate}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default FireIntelligenceCenter;
