import React, { useState, useMemo } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
    PieChart, Pie
} from 'recharts';
import { POLICIES, simulatePolicy } from '../../utils/policySimulator';
import { getCurrentAQI, AREAS } from '../../utils/dataGenerator';
import { ShieldCheck, TrendingDown, Users, DollarSign, PlusCircle, CheckCircle2, ChevronRight, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SchoolClosurePredictor from './SchoolClosurePredictor';

const PolicySimulator = () => {
    const [activePolicyIds, setActivePolicyIds] = useState([]);
    const [selectedAreaId, setSelectedAreaId] = useState(AREAS[0].id);

    const currentAQI = useMemo(() => getCurrentAQI(selectedAreaId), [selectedAreaId]);
    const simulation = useMemo(() => simulatePolicy(activePolicyIds, currentAQI), [activePolicyIds, currentAQI]);

    const togglePolicy = (id) => {
        setActivePolicyIds(prev =>
            prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
        );
    };

    const beforeAfterData = [
        { name: 'Current', aqi: currentAQI, fill: '#EF4444' },
        { name: 'Simulated', aqi: simulation.finalAQI, fill: '#10B981' }
    ];

    return (
        <div className="p-8 bg-background min-h-[calc(100vh-80px)]">
            {/* Header */}
            <div className="mb-8">
                <h2 className="text-2xl font-bold flex items-center gap-3">
                    <ShieldCheck className="text-primary w-7 h-7" />
                    Strategic Policy Simulator
                </h2>
                <p className="text-gray-500 text-sm mt-1">Multi-scenario impact analysis for air quality management</p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                {/* Policy Selection Column */}
                <div className="xl:col-span-4 space-y-4">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-gray-400 uppercase text-xs tracking-widest">Available Policies</h3>
                        <span className="text-[10px] font-bold text-primary">{activePolicyIds.length} Active</span>
                    </div>

                    {POLICIES.map((policy) => {
                        const isActive = activePolicyIds.includes(policy.id);
                        return (
                            <div
                                key={policy.id}
                                onClick={() => togglePolicy(policy.id)}
                                className={`p-4 rounded-2xl border transition-all cursor-pointer group ${isActive
                                    ? 'bg-primary/10 border-primary shadow-lg shadow-primary/5'
                                    : 'bg-surface border-white/5 hover:border-white/20'
                                    }`}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className={`font-bold text-sm ${isActive ? 'text-primary' : 'text-white'}`}>
                                        {policy.name}
                                    </h4>
                                    {isActive ? (
                                        <CheckCircle2 className="w-4 h-4 text-primary" />
                                    ) : (
                                        <PlusCircle className="w-4 h-4 text-gray-600 group-hover:text-gray-400" />
                                    )}
                                </div>
                                <p className="text-[11px] text-gray-500 line-clamp-2 leading-relaxed mb-3">
                                    {policy.description}
                                </p>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-1.5">
                                        <TrendingDown className="w-3 h-3 text-success" />
                                        <span className="text-[10px] font-bold text-success">-{policy.reduction} AQI</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <DollarSign className="w-3 h-3 text-warning" />
                                        <span className="text-[10px] font-bold text-warning">₹{policy.annualCost} Cr</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Impact Analysis Center */}
                <div className="xl:col-span-8 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* AQI Impact Chart */}
                        <div className="glass p-6 rounded-3xl min-h-[350px]">
                            <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                                <TrendingDown className="w-5 h-5 text-success" />
                                AQI Reduction Impact
                            </h3>
                            <div className="h-[250px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={beforeAfterData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                                        <XAxis dataKey="name" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                                        <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '12px' }}
                                            cursor={{ fill: 'transparent' }}
                                        />
                                        <Bar dataKey="aqi" radius={[8, 8, 0, 0]} barSize={60}>
                                            {beforeAfterData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.fill} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="mt-4 flex justify-between items-center px-4">
                                <div className="text-center">
                                    <p className="text-[10px] text-gray-500 uppercase font-bold">Initial</p>
                                    <p className="text-2xl font-black text-danger font-mono">{simulation.initialAQI}</p>
                                </div>
                                <ChevronRight className="w-6 h-6 text-gray-700" />
                                <div className="text-center">
                                    <p className="text-[10px] text-gray-500 uppercase font-bold">Simulated</p>
                                    <p className="text-2xl font-black text-success font-mono">{simulation.finalAQI}</p>
                                </div>
                                <div className="bg-success/10 px-4 py-2 rounded-xl border border-success/20 text-center">
                                    <p className="text-[10px] text-success uppercase font-black">Reduction</p>
                                    <p className="text-xl font-black text-success font-mono">-{simulation.reduction}</p>
                                </div>
                            </div>
                        </div>

                        {/* Lives Saved Counter */}
                        <div className="flex flex-col gap-8">
                            <div className="glass p-8 rounded-3xl bg-gradient-to-br from-primary/10 to-transparent border-primary/10 flex flex-col items-center justify-center text-center relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                                <Users className="w-12 h-12 text-primary mb-4" />
                                <p className="text-sm font-bold text-primary uppercase tracking-widest mb-2">Estimated Lives Saved</p>
                                <div className="text-6xl font-black text-white mb-2 leading-none">
                                    {simulation.totalLivesSaved}
                                </div>
                                <p className="text-xs text-gray-400">Annually through particulate reduction</p>
                            </div>

                            <div className="glass p-6 rounded-3xl flex flex-col justify-between">
                                <div>
                                    <h3 className="font-bold text-gray-400 uppercase text-[10px] tracking-widest mb-4">Economic Efficiency (ROI)</h3>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-4xl font-black text-warning font-mono">{simulation.roi}%</span>
                                        <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Return on Investment</span>
                                    </div>
                                </div>
                                <div className="mt-6 flex gap-4">
                                    <div className="flex-1 bg-surface p-3 rounded-2xl border border-white/5">
                                        <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Total Cost</p>
                                        <p className="text-lg font-bold font-mono">₹{simulation.totalCost} Cr</p>
                                    </div>
                                    <div className="flex-1 bg-surface p-3 rounded-2xl border border-white/5">
                                        <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Benefits</p>
                                        <p className="text-lg font-bold text-success font-mono">₹{simulation.totalEconomicBenefit} Cr</p>
                                    </div>
                                </div>
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
