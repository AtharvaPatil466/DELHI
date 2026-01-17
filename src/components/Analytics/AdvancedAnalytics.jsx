import React, { useState } from 'react';
import {
    ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, Cell, LineChart, Line, AreaChart, Area, ComposedChart
} from 'recharts';
import {
    Activity, BarChart2, TrendingUp, AlertCircle,
    Wind, Thermometer, Car, Zap, MousePointer2
} from 'lucide-react';

const AdvancedAnalytics = () => {
    // Mock data for Correlation Analysis (Traffic vs AQI)
    const correlationData = [
        { traffic: 20, aqi: 150, z: 10 }, { traffic: 40, aqi: 220, z: 15 },
        { traffic: 60, aqi: 310, z: 25 }, { traffic: 80, aqi: 420, z: 40 },
        { traffic: 30, aqi: 180, z: 12 }, { traffic: 50, aqi: 250, z: 18 },
        { traffic: 70, aqi: 360, z: 30 }, { traffic: 90, aqi: 480, z: 50 },
        { traffic: 55, aqi: 280, z: 20 }, { traffic: 45, aqi: 210, z: 14 },
        { traffic: 85, aqi: 440, z: 45 }, { traffic: 25, aqi: 160, z: 11 },
    ];

    // Mock data for Anomaly Detection (Statistical Outliers)
    const anomalyData = [
        { day: 'Mon', normal: 280, actual: 285 }, { day: 'Tue', normal: 290, actual: 292 },
        { day: 'Wed', normal: 310, actual: 450, anomaly: true }, // Outlier
        { day: 'Thu', normal: 300, actual: 305 }, { day: 'Fri', normal: 320, actual: 325 },
        { day: 'Sat', normal: 260, actual: 262 }, { day: 'Sun', normal: 240, actual: 238 },
    ];

    const metrics = [
        { label: 'AQI-Traffic Correlation', value: '0.92', status: 'High', color: 'text-primary' },
        { label: 'Industrial Significance', value: '0.68', status: 'Medium', color: 'text-secondary' },
        { label: 'Wind Dispersion Prob', value: '0.24', status: 'Low', color: 'text-danger' },
        { label: 'Model Confidence (p-val)', value: '<0.001', status: 'Significant', color: 'text-success' },
    ];

    return (
        <div className="p-8 bg-background min-h-[calc(100vh-80px)]">
            <div className="mb-8">
                <h2 className="text-2xl font-bold flex items-center gap-3">
                    <Activity className="text-primary w-7 h-7" />
                    Advanced Scientific Analytics
                </h2>
                <p className="text-gray-500 text-sm mt-1">Deep-dive statistical correlation and anomaly detection models</p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
                {/* Correlation Matrix / Scatter */}
                <div className="glass p-6 rounded-3xl min-h-[400px]">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-lg flex items-center gap-2">
                            <Car className="w-5 h-5 text-primary" />
                            Traffic vs. AQI Regression
                        </h3>
                        <div className="flex items-center gap-2 px-3 py-1 bg-surface rounded-full border border-white/5">
                            <span className="text-[10px] font-bold text-primary">R² = 0.854</span>
                        </div>
                    </div>

                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                                <XAxis type="number" dataKey="traffic" name="Traffic Density" unit="%" stroke="#666" fontSize={10} axisLine={false} tickLine={false} />
                                <YAxis type="number" dataKey="aqi" name="AQI" stroke="#666" fontSize={10} axisLine={false} tickLine={false} />
                                <ZAxis type="number" dataKey="z" range={[60, 400]} />
                                <Tooltip
                                    cursor={{ strokeDasharray: '3 3' }}
                                    contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '12px' }}
                                />
                                <Scatter name="Points" data={correlationData} fill="#3B82F6" fillOpacity={0.6}>
                                    {correlationData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.aqi > 350 ? '#EF4444' : '#3B82F6'} />
                                    ))}
                                </Scatter>
                            </ScatterChart>
                        </ResponsiveContainer>
                    </div>
                    <p className="text-[10px] text-gray-500 mt-4 leading-relaxed italic">
                        Pearson correlation coefficient indicates an extremely strong linear relationship between rush hour traffic volume and localized PM2.5 spikes.
                    </p>
                </div>

                {/* Anomaly Detection */}
                <div className="glass p-6 rounded-3xl min-h-[400px]">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-lg flex items-center gap-2">
                            <Zap className="w-5 h-5 text-warning" />
                            Anomaly Detection (z-score)
                        </h3>
                        <div className="px-3 py-1 bg-warning/10 rounded-full border border-warning/20">
                            <span className="text-[10px] font-bold text-warning">1 Critical Alert</span>
                        </div>
                    </div>

                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={anomalyData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                                <XAxis dataKey="day" stroke="#666" fontSize={10} axisLine={false} tickLine={false} />
                                <YAxis stroke="#666" fontSize={10} axisLine={false} tickLine={false} />
                                <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '12px' }} />
                                <Area type="monotone" dataKey="normal" fill="#3B82F6" fillOpacity={0.1} stroke="#3B82F6" strokeDasharray="5 5" />
                                <Line type="monotone" dataKey="actual" stroke="#white" strokeWidth={2} dot={(props) => {
                                    const { cx, cy, payload } = props;
                                    if (payload.anomaly) {
                                        return <circle cx={cx} cy={cy} r={6} fill="#EF4444" stroke="none" className="animate-pulse" />;
                                    }
                                    return <circle cx={cx} cy={cy} r={3} fill="#white" stroke="none" />;
                                }} />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-4 p-4 bg-danger/5 border border-danger/10 rounded-2xl flex items-center gap-4">
                        <AlertCircle className="w-5 h-5 text-danger" />
                        <p className="text-xs text-danger/80">
                            <span className="font-bold">Protocol Anomaly:</span> Wednesday AQI was 45% higher than predicted. Statistical significance (p=0.002) suggests unrecorded industrial emission event.
                        </p>
                    </div>
                </div>
            </div>

            {/* Metrics Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {metrics.map((m, i) => (
                    <div key={i} className="glass p-6 rounded-3xl border-white/5">
                        <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-2">{m.label}</p>
                        <div className="flex items-baseline gap-3">
                            <span className="text-3xl font-black">{m.value}</span>
                            <span className={`text-[10px] font-bold ${m.color}`}>{m.status}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Weather Interaction Matrix (Small Widgets) */}
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="glass p-8 rounded-3xl bg-gradient-to-br from-primary/5 to-transparent border-white/5 lg:col-span-2">
                    <h4 className="font-bold mb-4 flex items-center gap-2">
                        <Wind className="w-5 h-5 text-gray-400" />
                        Multivariate Interaction Summary
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-[10px] font-bold uppercase mb-2">
                                    <span className="text-gray-500">Temp Inversion Probability</span>
                                    <span className="text-white">82%</span>
                                </div>
                                <div className="h-1.5 w-full bg-background rounded-full overflow-hidden">
                                    <div className="h-full bg-primary" style={{ width: '82%' }}></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-[10px] font-bold uppercase mb-2">
                                    <span className="text-gray-500">Stagnation Frequency</span>
                                    <span className="text-white">64%</span>
                                </div>
                                <div className="h-1.5 w-full bg-background rounded-full overflow-hidden">
                                    <div className="h-full bg-secondary" style={{ width: '64%' }}></div>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col justify-center">
                            <p className="text-xs text-gray-400 leading-relaxed italic">
                                "Composite modeling shows that at temperatures below 12°C and wind speeds under 3 km/h, pollutants remain trapped within the first 500m of the planetary boundary layer, exponentially increasing local PM2.5 concentrations."
                            </p>
                        </div>
                    </div>
                </div>

                <div className="glass p-8 rounded-3xl flex flex-col items-center justify-center text-center border-white/5">
                    <MousePointer2 className="w-10 h-10 text-gray-500 mb-4 opacity-50" />
                    <h4 className="font-black text-gray-300 text-sm uppercase tracking-widest mb-2">Raw Data Export</h4>
                    <p className="text-xs text-gray-500 mb-6">Download consolidated daily analytics (Parquet/JSON)</p>
                    <button className="w-full py-3 bg-surface border border-white/10 rounded-2xl font-bold text-xs hover:bg-white/5 transition-all">
                        Initiate Secure Download
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdvancedAnalytics;
