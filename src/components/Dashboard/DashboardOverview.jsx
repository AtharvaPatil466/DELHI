import React, { useState, useEffect } from 'react';
import { getAllAreasData } from '../../utils/dataGenerator';
import AQICard from './AQICard';
import { AlertCircle, RefreshCw, Filter, Download, TrendingUp, Shield, Activity } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const DashboardOverview = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [lastRefresh, setLastRefresh] = useState(new Date());

    const fetchData = () => {
        setLoading(true);
        setTimeout(() => {
            setData(getAllAreasData());
            setLastRefresh(new Date());
            setLoading(false);
        }, 800);
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 30000);
        return () => clearInterval(interval);
    }, []);

    // Mock Data for Hero Chart (Regional Trend)
    const trendData = [
        { time: '06:00', value: 240 }, { time: '09:00', value: 280 },
        { time: '12:00', value: 342 }, { time: '15:00', value: 320 },
        { time: '18:00', value: 360 }, { time: '21:00', value: 310 },
        { time: '00:00', value: 290 },
    ];

    // Real-time Jitter Effect
    const [liveAQI, setLiveAQI] = useState(312);
    useEffect(() => {
        const interval = setInterval(() => {
            // Jitter between 310 and 315
            setLiveAQI(prev => 310 + Math.floor(Math.random() * 6));
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    // Cigarettes Calculation (Roughly AQI / 22)
    const cigarettes = Math.round(liveAQI / 22);

    return (
        <div className="p-4 md:p-8 min-h-screen space-y-6 md:space-y-8 fade-in max-w-[1600px] mx-auto">
            {/* Header & Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                <div>
                    <h1 className="text-2xl md:text-4xl font-light text-white mb-1 md:mb-2 tracking-tight">Regional Overview</h1>
                    <p className="text-xs md:text-sm text-gray-500">Real-time environmental monitoring dashboard</p>
                </div>
                <div className="flex items-center gap-2 md:gap-3 w-full sm:w-auto">
                    <button onClick={fetchData} className="flex-1 sm:flex-none p-2.5 md:p-3 rounded-xl md:rounded-2xl bg-[#18181b] hover:bg-white/10 text-gray-400 hover:text-white transition-all flex justify-center items-center">
                        <RefreshCw className={`w-4 h-4 md:w-5 md:h-5 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                    <button className="flex-[3] sm:flex-none flex items-center justify-center gap-2 px-4 md:px-5 py-2.5 md:py-3 rounded-xl md:rounded-2xl bg-[#18181b] hover:bg-white/10 text-white text-xs md:text-sm font-medium transition-all">
                        <Download className="w-3.5 h-3.5 md:w-4 md:h-4" />
                        Export Report
                    </button>
                </div>
            </div>

            {/* Top Section: Hero Chart + Side Widget */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Hero Chart (Income Tracker Style) */}
                <div className="lg:col-span-3 bg-[#18181b] rounded-2xl md:rounded-[32px] p-4 md:p-8 shadow-2xl relative overflow-hidden group">
                    <div className="flex flex-col sm:flex-row justify-between items-start mb-6 md:mb-8 gap-4">
                        <div>
                            <div className="flex items-center gap-2 md:gap-3 mb-1 md:mb-2">
                                <div className="p-1.5 md:p-2 bg-primary/10 rounded-lg md:xl">
                                    <TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                                </div>
                                <span className="text-[10px] md:text-sm font-bold text-gray-500 uppercase tracking-widest">Average AQI Trend</span>
                                <span className="flex h-1.5 w-1.5 md:h-2 md:w-2 relative">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 md:h-2 md:w-2 bg-emerald-500"></span>
                                </span>
                            </div>
                            <div className="flex items-baseline gap-3 md:gap-4">
                                <h2 className="text-3xl md:text-5xl font-light text-white">{liveAQI}</h2>
                                <span className="px-2 py-0.5 md:px-3 md:py-1 rounded-full bg-danger/10 text-danger text-[10px] md:text-xs font-bold border border-danger/20">
                                    +12% vs Yesterday
                                </span>
                            </div>
                            {/* Health Impact Ticker */}
                            <div className="mt-3 md:mt-4 flex items-center gap-2 px-2 md:px-3 py-1 md:py-1.5 bg-white/5 rounded-lg border border-white/5 w-fit">
                                <Activity className="w-3 h-3 md:w-3.5 md:h-3.5 text-orange-400" />
                                <span className="text-[10px] md:text-xs text-gray-400 font-medium">Health Impact: <span className="text-white font-bold">Equivalent to smoking {cigarettes} cigarettes/day</span></span>
                            </div>
                        </div>
                        <div className="flex gap-1.5 md:gap-2 w-full sm:w-auto overflow-x-auto no-scrollbar pb-2 sm:pb-0">
                            {['1H', '24H', '7D'].map(range => (
                                <button key={range} className={`px-3 md:px-4 py-1.5 md:py-2 rounded-lg md:rounded-xl text-[10px] md:text-xs font-bold transition-all whitespace-nowrap ${range === '24H' ? 'bg-white text-black' : 'bg-white/5 text-gray-400 hover:text-white'}`}>
                                    {range}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="h-[240px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={trendData}>
                                <defs>
                                    <linearGradient id="colorAqi" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff08" />
                                <XAxis dataKey="time" axisLine={false} tickLine={false} stroke="#52525b" fontSize={12} tickMargin={10} />
                                <YAxis axisLine={false} tickLine={false} stroke="#52525b" fontSize={12} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#09090b', borderRadius: '16px', border: '1px solid #27272a', padding: '12px' }}
                                    itemStyle={{ color: '#fff' }}
                                    cursor={{ stroke: '#ef4444', strokeWidth: 2, strokeDasharray: '4 4' }}
                                />
                                <Area type="monotone" dataKey="value" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorAqi)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Vertical Side Widget (Protocol Progress) */}
                <div className="lg:col-span-1 bg-[#18181b] rounded-2xl md:rounded-[32px] p-6 md:p-8 shadow-2xl flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

                    <div>
                        <div className="flex items-center gap-3 mb-4 md:mb-6">
                            <div className="p-1.5 md:p-2 bg-indigo-500/10 rounded-lg md:xl">
                                <Shield className="w-4 h-4 md:w-5 md:h-5 text-indigo-400" />
                            </div>
                            <span className="text-xs md:text-sm font-bold text-gray-500 uppercase tracking-widest">Protocol Status</span>
                        </div>
                        <h3 className="text-xl md:text-2xl font-light text-white mb-2">GRAP Stage IV</h3>
                        <p className="text-xs md:text-sm text-gray-400 leading-relaxed mb-4 md:mb-6">
                            Severe restrictions active. Construction halted. Diesel vehicles banned.
                        </p>
                    </div>

                    <div className="space-y-4 md:space-y-6">
                        <div>
                            <div className="flex justify-between text-[10px] md:text-xs font-bold text-gray-500 uppercase mb-2">
                                <span>Enforcement</span>
                                <span className="text-white">84%</span>
                            </div>
                            <div className="h-1.5 md:h-2 w-full bg-black/40 rounded-full overflow-hidden">
                                <div className="h-full bg-indigo-500 w-[84%] rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>
                            </div>
                        </div>

                        <div className="p-3 md:p-4 bg-white/5 rounded-xl md:rounded-2xl border border-white/5">
                            <div className="flex items-start gap-2 md:gap-3">
                                <Activity className="w-3.5 h-3.5 md:w-4 md:h-4 text-emerald-400 mt-0.5 md:mt-1" />
                                <div>
                                    <p className="text-[10px] md:text-xs font-bold text-white mb-0.5 md:mb-1">Impact Projection</p>
                                    <p className="text-[9px] md:text-[10px] text-gray-400 leading-relaxed">
                                        Expected drop of 45 AQI points by 08:00 AM tomorrow.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Masonry Grid Labels */}
            <div className="flex items-center gap-4 pt-2 md:pt-4">
                <h3 className="text-lg md:text-xl font-light text-white">Monitoring Stations</h3>
                <div className="h-px bg-white/10 flex-1"></div>
            </div>

            {/* Location Grid */}
            {loading && data.length === 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="bg-[#18181b] rounded-2xl md:rounded-[32px] h-[240px] md:h-[280px] animate-pulse"></div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    {[...data].sort((a, b) => b.aqi - a.aqi).map((areaData) => (
                        <AQICard
                            key={areaData.id}
                            area={areaData.name}
                            {...areaData}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default DashboardOverview;
