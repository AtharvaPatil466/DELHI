// FILE: DELHI/src/components/Sources/TrafficDashboard.jsx
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { generateTrafficData } from '../../utils/trafficSimulator';

const TrafficDashboard = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    // Auto-refresh data every 5 seconds to show "Live" movement
    useEffect(() => {
        const fetchData = () => {
            const liveData = generateTrafficData();
            setData(liveData);
            setLoading(false);
        };

        fetchData(); // Initial load
        const interval = setInterval(fetchData, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="p-6 bg-black/40 backdrop-blur-md rounded-xl border border-white/10 text-white">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                        Real-Time Traffic Emissions
                    </h2>
                    <p className="text-sm text-gray-400">Vision AI Analysis • Live Camera Feeds</p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="animate-pulse h-2 w-2 rounded-full bg-green-500"></span>
                    <span className="text-xs font-mono text-green-400">LIVE UPDATES</span>
                </div>
            </div>

            {/* Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Left: Interactive Chart */}
                <div className="h-64 bg-black/20 rounded-lg p-4 border border-white/5">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} layout="vertical">
                            <XAxis type="number" hide />
                            <YAxis
                                dataKey="location"
                                type="category"
                                tick={{ fill: '#9ca3af', fontSize: 12 }}
                                width={100}
                            />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#18181b', borderColor: '#333' }}
                                itemStyle={{ color: '#fff' }}
                            />
                            <Bar dataKey="pm25_contribution" name="PM2.5 Emission (g/hr)" radius={[0, 4, 4, 0]}>
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.status === 'Heavy' || entry.status === 'Critical' ? '#ef4444' : '#3b82f6'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Right: Live Statistics Cards */}
                <div className="grid grid-cols-2 gap-4">
                    {data.slice(0, 4).map((loc, idx) => (
                        <div key={idx} className="p-3 rounded-lg bg-white/5 border border-white/5 hover:border-blue-500/50 transition-colors">
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-xs text-gray-400">{loc.location}</span>
                                <span className={`text-[10px] px-1.5 py-0.5 rounded ${loc.status === 'Critical' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'
                                    }`}>
                                    {loc.status}
                                </span>
                            </div>
                            <div className="text-2xl font-mono font-semibold">
                                {loc.vehicle_count}
                            </div>
                            <div className="text-[10px] text-gray-500 mt-1">Vehicles / Hour</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TrafficDashboard;