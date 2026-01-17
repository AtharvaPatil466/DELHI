import React from 'react';
import { X, MapPin, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const DrillDownModal = ({ isOpen, onClose, sourceType, areaName, color }) => {
    if (!isOpen) return null;

    // Mock data for the mini temporal chart
    const temporalData = [
        { time: '00:00', value: 30 }, { time: '04:00', value: 20 },
        { time: '08:00', value: 45 }, { time: '12:00', value: 60 },
        { time: '16:00', value: 55 }, { time: '20:00', value: 80 },
        { time: '23:00', value: 40 },
    ];

    const getDetails = (type) => {
        switch (type) {
            case 'Industrial':
                return {
                    title: 'Industrial Emissions Breakdown',
                    subtitle: 'Major factories and power plants in 10km radius',
                    items: [
                        { name: 'Okhla Waste-to-Energy', dist: '5.2 km', contrib: '8%', status: 'Operating', icon: <AlertTriangle className="w-4 h-4 text-warning" /> },
                        { name: 'Badarpur Thermal (Closed)', dist: '7.8 km', contrib: '1%', status: 'Minimal', icon: <CheckCircle className="w-4 h-4 text-success" /> },
                        { name: 'Patparganj Industrial Area', dist: '3.1 km', contrib: '12%', status: 'Peak Load', icon: <Clock className="w-4 h-4 text-danger" /> },
                    ]
                };
            case 'Vehicular':
                return {
                    title: 'Vehicular Traffic Analysis',
                    subtitle: 'Key congestion points and transport corridors',
                    items: [
                        { name: 'NH-24 Highway', dist: '1.2 km', contrib: '15%', status: 'Severe Jam', icon: <AlertTriangle className="w-4 h-4 text-danger" /> },
                        { name: 'ISBT Anand Vihar', dist: '0.8 km', contrib: '12%', status: 'High Volume', icon: <Clock className="w-4 h-4 text-warning" /> },
                        { name: 'Local Road Network', dist: '< 1 km', contrib: '8%', status: 'Moderate', icon: <CheckCircle className="w-4 h-4 text-success" /> },
                    ]
                };
            case 'Construction':
                return {
                    title: 'Active Construction Sites',
                    subtitle: 'Reported sites with dust potential',
                    items: [
                        { name: 'RRTS Corridor Project', dist: '0.5 km', contrib: '6%', status: 'Active', icon: <AlertTriangle className="w-4 h-4 text-warning" /> },
                        { name: 'Metro Expansion Ph-4', dist: '2.1 km', contrib: '4%', status: 'Mitigated', icon: <CheckCircle className="w-4 h-4 text-success" /> },
                    ]
                };
            default:
                return {
                    title: `${type} Source Details`,
                    subtitle: 'General contribution analysis',
                    items: [
                        { name: 'Local Sources', dist: '-', contrib: 'Varies', status: 'Unknown', icon: <AlertTriangle className="w-4 h-4 text-gray-500" /> },
                    ]
                };
        }
    };

    const details = getDetails(sourceType);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-[#0f172a] border border-white/10 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden relative" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="p-6 border-b border-white/10 bg-gradient-to-r from-white/5 to-transparent flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h2 className="text-xl font-bold text-white tracking-tight">{details.title}</h2>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest bg-white/10 text-white/70">
                                {areaName}
                            </span>
                        </div>
                        <p className="text-sm text-gray-400">{details.subtitle}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <X className="w-5 h-5 text-gray-400" />
                    </button>
                </div>

                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* List Section */}
                    <div className="space-y-4">
                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Top Contributors</h4>
                        {details.items.map((item, idx) => (
                            <div key={idx} className="p-3 rounded-lg bg-white/5 border border-white/5 flex items-center justify-between group hover:border-white/20 transition-all cursor-pointer">
                                <div>
                                    <h5 className="text-sm font-semibold text-gray-200 group-hover:text-primary transition-colors">{item.name}</h5>
                                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {item.dist}</span>
                                        <span>•</span>
                                        <span className={item.status === 'Operating' || item.status === 'Severe Jam' ? 'text-red-400' : 'text-gray-400'}>{item.status}</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-lg font-bold text-white">{item.contrib}</div>
                                    <div className="flex justify-end">{item.icon}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Chart Section */}
                    <div>
                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">24-Hour Intensity Profile</h4>
                        <div className="h-48 bg-white/5 rounded-lg border border-white/5 p-2">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={temporalData}>
                                    <XAxis dataKey="time" hide />
                                    <YAxis hide domain={[0, 100]} />
                                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }} itemStyle={{ color: '#fff' }} />
                                    <Line type="basis" dataKey="value" stroke={color || "#6366f1"} strokeWidth={3} dot={false} activeDot={{ r: 4 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                            <p className="text-xs text-blue-200 leading-relaxed">
                                <span className="font-bold">Insight:</span> Source intensity peaks during evening hours (18:00-22:00) coinciding with regional activity patterns.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer Action */}
                <div className="p-4 border-t border-white/10 bg-black/20 text-center">
                    <button className="text-xs font-bold text-primary hover:text-white transition-colors uppercase tracking-widest">
                        View Full Facility Report →
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DrillDownModal;
