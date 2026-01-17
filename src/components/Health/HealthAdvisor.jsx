import React, { useState, useMemo } from 'react';
import {
    HeartPulse, User, Baby, Smartphone, Wind, ShieldAlert,
    MapPin, Activity, CheckCircle, AlertCircle, Info, Clock
} from 'lucide-react';
import { getHealthAdvisory, getPersonalizedTips, recommendMaskType, predictHealthRisk } from '../../utils/healthCalculator';
import { AREAS, getCurrentAQI } from '../../utils/dataGenerator';
import SafeRoutes from './SafeRoutes';

const HealthAdvisor = () => {
    const [selectedAreaId, setSelectedAreaId] = useState(AREAS[0].id);
    const [selectedGroup, setSelectedGroup] = useState('general');
    const [exposureHours, setExposureHours] = useState(2);

    const currentAQI = useMemo(() => getCurrentAQI(selectedAreaId), [selectedAreaId]);
    const advisory = useMemo(() => getHealthAdvisory(currentAQI), [currentAQI]);
    const personalizedTip = useMemo(() => getPersonalizedTips(currentAQI, selectedGroup), [currentAQI, selectedGroup]);
    const maskTip = useMemo(() => recommendMaskType(currentAQI), [currentAQI]);
    const riskScore = useMemo(() => predictHealthRisk(currentAQI, exposureHours), [currentAQI, exposureHours]);

    const groups = [
        { id: 'general', label: 'General', icon: User },
        { id: 'children', label: 'Children', icon: Baby },
        { id: 'elderly', label: 'Elderly', icon: Smartphone },
        { id: 'respiratory', label: 'Asthma/COPD', icon: Activity },
        { id: 'pregnant', label: 'Pregnant', icon: HeartPulse },
    ];

    return (
        <div className="p-8 bg-background min-h-[calc(100vh-80px)]">
            <div className="mb-8">
                <h2 className="text-2xl font-bold flex items-center gap-3">
                    <HeartPulse className="text-primary w-7 h-7" />
                    Health & Safety Advisory
                </h2>
                <p className="text-gray-500 text-sm mt-1">AI-driven personalized health recommendations based on exposure risk</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Profile & Setting Column */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="glass p-6 rounded-3xl">
                        <h3 className="font-bold text-sm uppercase tracking-widest text-gray-500 mb-6">Personalize Your Advice</h3>

                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] font-bold text-gray-400 uppercase block mb-3">Vulnerability Group</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {groups.map((group) => {
                                        const Icon = group.icon;
                                        return (
                                            <button
                                                key={group.id}
                                                onClick={() => setSelectedGroup(group.id)}
                                                className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${selectedGroup === group.id
                                                    ? 'bg-primary/10 border-primary text-primary'
                                                    : 'bg-surface border-white/5 text-gray-400 hover:border-white/10'
                                                    }`}
                                            >
                                                <Icon className="w-4 h-4" />
                                                <span className="text-xs font-bold">{group.label}</span>
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>

                            <div>
                                <label className="text-[10px] font-bold text-gray-400 uppercase block mb-3">Planned Outdoor Exposure</label>
                                <div className="flex items-center gap-4 bg-surface p-3 rounded-xl border border-white/5">
                                    <Clock className="w-4 h-4 text-gray-500" />
                                    <input
                                        type="range"
                                        min="1" max="12"
                                        value={exposureHours}
                                        onChange={(e) => setExposureHours(parseInt(e.target.value))}
                                        className="flex-1 h-1.5 bg-background rounded-lg appearance-none cursor-pointer accent-primary"
                                    />
                                    <span className="text-xs font-bold text-white min-w-[3rem] text-right">{exposureHours} Hours</span>
                                </div>
                            </div>

                            <div>
                                <label className="text-[10px] font-bold text-gray-400 uppercase block mb-3">Location Context</label>
                                <select
                                    value={selectedAreaId}
                                    onChange={(e) => setSelectedAreaId(e.target.value)}
                                    className="w-full bg-surface border border-white/5 rounded-xl px-4 py-3 text-xs font-bold text-gray-300 outline-none"
                                >
                                    {AREAS.map(area => <option key={area.id} value={area.id}>{area.name}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Mask Recommendation Card */}
                    <div className="glass p-6 rounded-3xl bg-gradient-to-br from-secondary/10 to-transparent border-secondary/20">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-secondary rounded-xl">
                                <ShieldAlert className="w-5 h-5 text-white" />
                            </div>
                            <h4 className="font-bold font-sm">Mask Recommendation</h4>
                        </div>
                        <p className="text-xs text-gray-300 leading-relaxed mb-4">
                            {maskTip}
                        </p>
                        <div className="flex items-center gap-2 py-2 px-3 bg-white/5 rounded-xl border border-white/5">
                            <CheckCircle className="w-4 h-4 text-secondary" />
                            <span className="text-[10px] font-medium text-gray-400">Verified by Public Health Protocols</span>
                        </div>
                    </div>
                </div>

                {/* Advisory Display Center */}
                <div className="lg:col-span-8 space-y-8">
                    {/* Main Status Header */}
                    <div className="glass p-8 rounded-3xl relative overflow-hidden">
                        <div
                            className="absolute top-0 right-0 w-64 h-64 opacity-10 rounded-full -mr-20 -mt-20 blur-3xl transition-colors duration-1000"
                            style={{ backgroundColor: advisory.color }}
                        ></div>

                        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: advisory.color }}></div>
                                    <span className="text-xs font-black uppercase tracking-widest" style={{ color: advisory.color }}>
                                        {advisory.label} Impact
                                    </span>
                                </div>
                                <h3 className="text-4xl font-black mb-4">Current AQI: <span style={{ color: advisory.color }} className="font-mono">{currentAQI}</span></h3>
                                <p className="text-gray-400 text-lg max-w-2xl leading-relaxed italic">
                                    "{personalizedTip}"
                                </p>
                            </div>

                            <div className="bg-surface p-6 rounded-full border-8 border-white/5 ring-4 ring-white/5">
                                <div className="text-center">
                                    <div className="text-4xl font-black text-white font-mono">{riskScore}%</div>
                                    <div className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">Health Risk</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Safe Routes Integration */}
                        <SafeRoutes />

                        {/* Impact Analysis */}
                        <div className="glass p-6 rounded-3xl flex flex-col justify-between">
                            <div>
                                <h4 className="font-bold text-lg mb-6 flex items-center gap-2">
                                    <ShieldAlert className="w-5 h-5 text-warning" />
                                    Exposure Analysis
                                </h4>
                                <div className="space-y-6">
                                    <div>
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-xs text-gray-400 font-bold uppercase">Respiratory Load</span>
                                            <span className="text-xs font-black text-white font-mono">{Math.min(100, Math.round(riskScore * 1.2))}%</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-background rounded-full overflow-hidden">
                                            <div className="h-full bg-primary transition-all duration-1000" style={{ width: `${Math.min(100, riskScore * 1.2)}%` }}></div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-xs text-gray-400 font-bold uppercase">Cardiovascular Strain</span>
                                            <span className="text-xs font-black text-white font-mono">{Math.min(100, Math.round(riskScore * 0.8))}%</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-background rounded-full overflow-hidden">
                                            <div className="h-full bg-secondary transition-all duration-1000" style={{ width: `${Math.min(100, riskScore * 0.8)}%` }}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 p-4 bg-surface rounded-2xl border border-white/5 flex gap-4">
                                <div className="p-2 bg-warning/10 rounded-xl">
                                    <Info className="w-4 h-4 text-warning" />
                                </div>
                                <p className="text-[10px] text-gray-400 leading-relaxed italic">
                                    AI recommendation based on cumulative exposure. For children, even 1 hour of exposure at current levels (AQI {currentAQI}) is equivalent to smoking 2 cigarettes.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HealthAdvisor;
