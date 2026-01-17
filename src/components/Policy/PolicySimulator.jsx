import React, { useState, useMemo, useEffect } from 'react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine
} from 'recharts';
import { POLICIES, simulatePolicy } from '../../utils/policySimulator';
import { getCurrentAQI, AREAS } from '../../utils/dataGenerator';
import { ShieldCheck, TrendingDown, Users, DollarSign, PlusCircle, CheckCircle2, ChevronRight, Zap } from 'lucide-react';
import SchoolClosurePredictor from './SchoolClosurePredictor'; // Keeping your existing component

const PolicySimulator = () => {
    const [activePolicyIds, setActivePolicyIds] = useState([]);
    const [selectedAreaId, setSelectedAreaId] = useState(AREAS[0].id);
    const [compliance, setCompliance] = useState(85); // Default Compliance: 85%
    const [projectionData, setProjectionData] = useState([]);

    // 1. Get Live Data
    const currentAQI = useMemo(() => getCurrentAQI(selectedAreaId), [selectedAreaId]);

    // 2. Run Simulation (re-runs when policies or compliance change)
    const simulation = useMemo(() =>
        simulatePolicy(activePolicyIds, currentAQI, compliance),
        [activePolicyIds, currentAQI, compliance]);

    // 3. Generate 24-Hour Forecast Curve
    useEffect(() => {
        const data = [];
        const baseAQI = currentAQI;
        const hourNow = new Date().getHours();

        for (let i = 0; i < 24; i++) {
            const time = (hourNow + i) % 24;
            // Create a realistic daily curve (Peak at 9AM and 8PM)
            const diurnalFactor = Math.sin((time - 6) / 3) * 50;

            let baseline = baseAQI + diurnalFactor;

            // Apply the calculated reduction from the simulation engine
            let simulated = baseline - (simulation.reduction * (compliance / 100));

            // Ensure we don't go below realistic minimums
            if (simulated < 50) simulated = 50;

            data.push({
                time: `${time}:00`,
                BusinessAsUsual: Math.round(baseline),
                WithPolicy: Math.round(simulated),
                SafeLimit: 100
            });
        }
        setProjectionData(data);
    }, [simulation, currentAQI, compliance]);

    const togglePolicy = (id) => {
        setActivePolicyIds(prev =>
            prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
        );
    };

    return (
        <div className="p-8 bg-[#09090b] min-h-[calc(100vh-80px)] text-white">
            {/* Header Area */}
            <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h2 className="text-2xl font-bold flex items-center gap-3">
                        <ShieldCheck className="text-blue-500 w-7 h-7" />
                        Strategic Policy Simulator
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">Multi-scenario impact analysis engine with predictive modeling</p>
                </div>

                {/* Compliance Slider */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 w-full md:w-72">
                    <div className="flex justify-between text-xs font-bold uppercase tracking-wider mb-2 text-gray-400">
                        <span>Enforcement Level</span>
                        <span className="text-blue-400">{compliance}%</span>
                    </div>
                    <input
                        type="range" min="0" max="100"
                        value={compliance}
                        onChange={(e) => setCompliance(parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                    <div className="flex justify-between text-[10px] text-gray-500 mt-1">
                        <span>Lax</span>
                        <span>Strict</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                {/* Left Column: Policy Selection */}
                <div className="xl:col-span-4 space-y-4">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-gray-400 uppercase text-xs tracking-widest">Active Interventions</h3>
                        <span className="text-[10px] font-bold text-blue-400 bg-blue-400/10 px-2 py-1 rounded">
                            {activePolicyIds.length} ACTIVE
                        </span>
                    </div>

                    <div className="space-y-3 h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                        {POLICIES.map((policy) => {
                            const isActive = activePolicyIds.includes(policy.id);
                            return (
                                <div
                                    key={policy.id}
                                    onClick={() => togglePolicy(policy.id)}
                                    className={`p-4 rounded-xl border transition-all cursor-pointer group relative overflow-hidden ${isActive
                                        ? 'bg-blue-600/10 border-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,0.15)]'
                                        : 'bg-white/5 border-white/5 hover:border-white/20'
                                        }`}
                                >
                                    {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"></div>}

                                    <div className="flex justify-between items-start mb-2 pl-2">
                                        <h4 className={`font-bold text-sm ${isActive ? 'text-blue-400' : 'text-gray-200'}`}>
                                            {policy.name}
                                        </h4>
                                        {isActive ? (
                                            <CheckCircle2 className="w-4 h-4 text-blue-500" />
                                        ) : (
                                            <PlusCircle className="w-4 h-4 text-gray-600 group-hover:text-gray-400" />
                                        )}
                                    </div>

                                    <p className="text-[11px] text-gray-500 pl-2 mb-3 leading-relaxed">
                                        {policy.description}
                                    </p>

                                    <div className="flex items-center gap-4 pl-2">
                                        <div className="flex items-center gap-1.5 bg-green-500/10 px-2 py-1 rounded border border-green-500/20">
                                            <TrendingDown className="w-3 h-3 text-green-400" />
                                            <span className="text-[10px] font-bold text-green-400">-{policy.reduction} AQI</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <DollarSign className="w-3 h-3 text-orange-400" />
                                            <span className="text-[10px] font-bold text-orange-400">₹{policy.annualCost} Cr</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Right Column: Visualization & Stats */}
                <div className="xl:col-span-8 space-y-6">

                    {/* CHART SECTION */}
                    <div className="bg-black/20 backdrop-blur-md p-6 rounded-3xl border border-white/10 h-[400px] relative">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-lg flex items-center gap-2">
                                <TrendingDown className="w-5 h-5 text-blue-500" />
                                24-Hour Impact Projection
                            </h3>
                            <div className="flex gap-4 text-xs">
                                <div className="flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full bg-red-500/50"></span>
                                    <span className="text-gray-400">Business As Usual</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                                    <span className="text-blue-400 font-bold">With Policy</span>
                                </div>
                            </div>
                        </div>

                        <ResponsiveContainer width="100%" height="85%">
                            <AreaChart data={projectionData}>
                                <defs>
                                    <linearGradient id="colorBase" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorPolicy" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                                <XAxis dataKey="time" stroke="#666" fontSize={12} tickMargin={10} axisLine={false} tickLine={false} />
                                <YAxis stroke="#666" fontSize={12} axisLine={false} tickLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#09090b', borderColor: '#333', borderRadius: '12px' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <ReferenceLine y={100} label="Safe Limit" stroke="#10b981" strokeDasharray="3 3" />

                                <Area
                                    type="monotone"
                                    dataKey="BusinessAsUsual"
                                    stroke="#ef4444"
                                    strokeWidth={2}
                                    fill="url(#colorBase)"
                                />
                                <Area
                                    type="monotone"
                                    dataKey="WithPolicy"
                                    stroke="#3b82f6"
                                    strokeWidth={3}
                                    fill="url(#colorPolicy)"
                                    animationDuration={1500}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    {/* STATS GRID */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Net Reduction */}
                        <div className="bg-white/5 p-6 rounded-2xl border border-white/5 flex flex-col justify-between group hover:border-blue-500/30 transition-all">
                            <div className="flex justify-between items-start">
                                <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Net Reduction</p>
                                <Zap className="w-5 h-5 text-yellow-400" />
                            </div>
                            <div>
                                <p className="text-4xl font-black text-white font-mono mt-2">
                                    {Math.round(simulation.reduction * (compliance / 100))}
                                </p>
                                <p className="text-xs text-green-400 mt-1 font-bold">AQI Points</p>
                            </div>
                        </div>

                        {/* Lives Saved (Highlighted) */}
                        <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 p-6 rounded-2xl border border-blue-500/20 flex flex-col justify-between relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full -mr-10 -mt-10 blur-xl"></div>
                            <div className="flex justify-between items-start z-10">
                                <p className="text-[10px] text-blue-300 uppercase font-bold tracking-widest">Lives Saved / Yr</p>
                                <Users className="w-5 h-5 text-blue-400" />
                            </div>
                            <div className="z-10">
                                <p className="text-4xl font-black text-white font-mono mt-2">
                                    {Math.round(simulation.totalLivesSaved * (compliance / 100))}
                                </p>
                                <p className="text-xs text-blue-300 mt-1">Based on mortality models</p>
                            </div>
                        </div>

                        {/* ROI */}
                        <div className="bg-white/5 p-6 rounded-2xl border border-white/5 flex flex-col justify-between">
                            <div className="flex justify-between items-start">
                                <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Economic ROI</p>
                                <DollarSign className="w-5 h-5 text-green-400" />
                            </div>
                            <div>
                                <p className={`text-4xl font-black font-mono mt-2 ${simulation.roi >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                    {simulation.roi}%
                                </p>
                                <p className="text-xs text-gray-500 mt-1">Health savings vs Cost</p>
                            </div>
                        </div>
                    </div>

                    <SchoolClosurePredictor />
                </div>
            </div>
        </div>
    );
};

export default PolicySimulator;