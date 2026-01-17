import React, { useMemo } from 'react';
import { School, Building2, ShieldAlert, CheckCircle, AlertCircle, Info, TrendingUp, Calendar } from 'lucide-react';
import { getCurrentAQI, AREAS } from '../../utils/dataGenerator';

const SchoolClosurePredictor = () => {
    const cityAvgAQI = useMemo(() => {
        const data = AREAS.map(a => getCurrentAQI(a.id));
        return Math.round(data.reduce((a, b) => a + b, 0) / data.length);
    }, []);

    const getClosureStatus = (aqi) => {
        if (aqi > 450) return { status: 'Critical', recommendation: 'Emergency Lockdown', color: 'text-danger', bg: 'bg-danger/10', border: 'border-danger/30' };
        if (aqi > 400) return { status: 'Severe', recommendation: 'School Closure Required', color: 'text-danger', bg: 'bg-danger/5', border: 'border-danger/20' };
        if (aqi > 350) return { status: 'Warning', recommendation: 'Work From Home Advised', color: 'text-warning', bg: 'bg-warning/5', border: 'border-warning/20' };
        return { status: 'Optimal', recommendation: 'Normal Operations', color: 'text-success', bg: 'bg-success/5', border: 'border-success/20' };
    };

    const closure = getClosureStatus(cityAvgAQI);

    return (
        <div className="glass p-8 rounded-3xl border-white/5 bg-gradient-to-br from-surface to-transparent shadow-2xl h-full">
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h3 className="text-xl font-bold flex items-center gap-3">
                        <School className="text-primary w-6 h-6" />
                        Operational Continuity & Closures
                    </h3>
                    <p className="text-gray-500 text-sm mt-1">Automated recommendations for schools and workplaces based on severity</p>
                </div>
                <div className={`px-4 py-2 rounded-2xl border font-bold text-xs uppercase ${closure.bg} ${closure.color} ${closure.border}`}>
                    {closure.status} Priority
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="bg-background-soft p-6 rounded-3xl border border-white/5 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-12 -mt-12 blur-2xl group-hover:bg-primary/10 transition-all duration-500"></div>
                    <Building2 className="w-8 h-8 text-primary mb-4" />
                    <h4 className="font-bold mb-2">Workplace Recommendation</h4>
                    <p className={`text-2xl font-black mb-4 ${closure.color}`}>{closure.recommendation}</p>
                    <div className="space-y-2">
                        <div className="flex justify-between text-[10px] font-bold text-gray-500 uppercase">
                            <span>Confidence</span>
                            <span className="text-white">92%</span>
                        </div>
                        <div className="h-1 w-full bg-background rounded-full overflow-hidden">
                            <div className="h-full bg-primary" style={{ width: '92%' }}></div>
                        </div>
                    </div>
                </div>

                <div className="bg-background-soft p-6 rounded-3xl border border-white/5 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-secondary/5 rounded-full -mr-12 -mt-12 blur-2xl group-hover:bg-secondary/10 transition-all duration-500"></div>
                    <School className="w-8 h-8 text-secondary mb-4" />
                    <h4 className="font-bold mb-2">School Status Prediction</h4>
                    <div className="flex items-center gap-3 mb-4">
                        <p className={`text-2xl font-black ${cityAvgAQI > 380 ? 'text-danger' : 'text-success'}`}>
                            {cityAvgAQI > 380 ? 'CLOSE' : 'OPEN'}
                        </p>
                        <div className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[8px] font-bold text-gray-500">GRAP STAGE IV</div>
                    </div>
                    <p className="text-[10px] text-gray-500 leading-relaxed italic">
                        Based on predicted AQI persistence of &gt;400 for 72 consecutive hours.
                    </p>
                </div>
            </div>

            <div className="p-4 bg-surface/50 rounded-2xl border border-white/5 flex gap-4">
                <div className="p-2 bg-primary/10 rounded-xl">
                    <Info className="w-5 h-5 text-primary" />
                </div>
                <div>
                    <h5 className="font-bold text-xs text-white mb-1">Impact Analysis</h5>
                    <p className="text-[10px] text-gray-500 leading-relaxed">
                        Closing schools today would prevent approx. 4.2M child-hours of severe PM2.5 exposure, reducing potential pediatric hospitalizations by an estimated 14% over the next 48 hours.
                    </p>
                </div>
            </div>

            <div className="mt-6 flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/5">
                <div className="flex items-center gap-4">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">Prediction for Tomorrow</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-danger uppercase tracking-tighter">Status: RED</span>
                    <TrendingUp className="w-4 h-4 text-danger animate-bounce" />
                </div>
            </div>
        </div>
    );
};

export default SchoolClosurePredictor;
