import React from 'react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { Info, ArrowUpRight } from 'lucide-react';

const Sparkline = ({ data, color, height = 40 }) => (
    <div style={{ height: height, width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
                <defs>
                    <linearGradient id={`gradient-${color}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={color} stopOpacity={0} />
                    </linearGradient>
                </defs>
                <Area
                    type="monotone"
                    dataKey="value"
                    stroke={color}
                    strokeWidth={2}
                    fillOpacity={1}
                    fill={`url(#gradient-${color})`}
                />
            </AreaChart>
        </ResponsiveContainer>
    </div>
);

const AQICard = ({ area, aqi, pollutants, onClick }) => {
    // Dynamic Color Logic
    let color = '#10b981'; // Emerald (< 100)
    if (aqi > 200) color = '#ef4444'; // Red
    else if (aqi > 100) color = '#f59e0b'; // Amber

    const level = aqi > 200 ? 'Severe' : aqi > 100 ? 'Poor' : 'Good';

    // Mock trend data
    const trendData = Array.from({ length: 12 }, (_, i) => ({
        value: aqi + Math.random() * 40 - 20
    }));

    return (
        <div
            onClick={onClick}
            className="group relative bg-[#18181b] rounded-[32px] p-8 hover:bg-[#202025] transition-all duration-300 cursor-pointer shadow-xl hover:shadow-2xl overflow-hidden flex flex-col justify-between h-full min-h-[280px]"
        >
            {/* Top Row */}
            <div className="flex justify-between items-start z-10">
                <div>
                    <h3 className="font-bold text-xl text-white group-hover:text-primary transition-colors tracking-tight">{area}</h3>
                    <div className="flex items-center gap-2 mt-2">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest bg-white/5 border border-white/5 ${level === 'Severe' ? 'text-red-400' : 'text-emerald-400'}`}>
                            {level}
                        </span>
                    </div>
                </div>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onClick();
                    }}
                    className="p-2 bg-white/5 rounded-full text-gray-400 group-hover:bg-white group-hover:text-black transition-all transform group-hover:rotate-45"
                >
                    <ArrowUpRight className="w-4 h-4" />
                </button>
            </div>

            {/* Middle Row: AQI Big Number */}
            <div className="mt-6 mb-4 z-10">
                <div className="flex items-baseline gap-3">
                    <span className="text-6xl font-mono font-light tracking-tighter text-white">
                        {aqi}
                    </span>
                    <span className="text-xs font-bold text-gray-500 uppercase">AQI</span>
                </div>
            </div>

            {/* Bottom Row: Sparkline & Stats */}
            <div className="flex items-end justify-between gap-4 z-10">
                <div className="flex-1">
                    <Sparkline data={trendData} color={color} height={50} />
                </div>
                <div className="flex gap-4">
                    <div>
                        <p className="text-[10px] font-bold text-gray-600 uppercase mb-0.5">PM2.5</p>
                        <p className="text-sm font-mono font-bold text-gray-300">{pollutants.pm25}</p>
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-gray-600 uppercase mb-0.5">PM10</p>
                        <p className="text-sm font-mono font-bold text-gray-300">{pollutants.pm10}</p>
                    </div>
                </div>
            </div>

            {/* Subtle glow on hover */}
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-gradient-to-br from-white/5 to-transparent rounded-full -mr-20 -mt-20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
        </div>
    );
};

export default AQICard;
