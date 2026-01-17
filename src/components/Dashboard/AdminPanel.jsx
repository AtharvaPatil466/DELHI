import React, { useState, useEffect } from 'react';
import {
    Shield, Activity, Settings, Zap,
    Lock, RefreshCcw, Bell, Database,
    Cpu, HardDrive, Cpu as Memory, Globe
} from 'lucide-react';
import { motion } from 'framer-motion';

const AdminPanel = () => {
    const [metrics, setMetrics] = useState({
        cpu: 45,
        memory: 62,
        latency: 12,
        requests: 2450
    });

    // Simulated Live Metrics Updates
    useEffect(() => {
        const interval = setInterval(() => {
            setMetrics(prev => ({
                cpu: Math.min(100, Math.max(0, prev.cpu + (Math.random() - 0.5) * 5)),
                memory: Math.min(100, Math.max(0, prev.memory + (Math.random() - 0.5) * 2)),
                latency: Math.min(200, Math.max(5, prev.latency + (Math.random() - 0.5) * 3)),
                requests: prev.requests + Math.floor(Math.random() * 10)
            }));
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="p-8 bg-background min-h-[calc(100vh-80px)] text-white space-y-8">

            {/* 1. SYSTEM METRICS HEADER */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: 'Neural Engine CPU', value: Math.round(metrics.cpu), unit: '%', icon: Cpu, color: 'text-blue-400' },
                    { label: 'Context Memory', value: Math.round(metrics.memory), unit: '%', icon: Memory, color: 'text-purple-400' },
                    { label: 'API Latency', value: Math.round(metrics.latency), unit: 'ms', icon: Activity, color: 'text-green-400' },
                    { label: 'Total Ingestions', value: metrics.requests.toLocaleString(), unit: '', icon: Database, color: 'text-yellow-400' }
                ].map((m, i) => (
                    <div key={i} className="bg-white/5 border border-white/10 p-5 rounded-2xl flex items-center justify-between group hover:bg-white/10 transition-all">
                        <div>
                            <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">{m.label}</p>
                            <div className="flex items-baseline gap-1">
                                <span className="text-2xl font-black font-mono">{m.value}</span>
                                <span className="text-xs text-gray-500 font-bold">{m.unit}</span>
                            </div>
                        </div>
                        <div className={`p-3 rounded-xl bg-white/5 ${m.color}`}>
                            <m.icon className="w-5 h-5" />
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">

                {/* LEFT COLUMN: SYSTEM CONTROLS */}
                <div className="xl:col-span-8 space-y-6">

                    {/* Feature Toggles */}
                    <div className="bg-black/20 border border-white/10 rounded-3xl p-8">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-bold flex items-center gap-3">
                                <Settings className="w-5 h-5 text-blue-500" />
                                Platform Control Center
                            </h3>
                            <div className="flex gap-2">
                                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 rounded-lg text-xs font-bold hover:bg-blue-500 mb-0">
                                    <RefreshCcw className="w-4 h-4" /> REBOOT NODES
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[
                                { title: 'NASA Satellite Feed', desc: 'Real-time thermal anomaly detection', active: true },
                                { title: 'Vision AI (Traffic)', desc: 'Vehicular emission estimation engine', active: true },
                                { title: 'Global Public Chat', desc: 'Allow citizen science interaction', active: true },
                                { title: 'Prediction Layer V4', desc: 'XGBoost multi-variable forecasting', active: false },
                            ].map((feature, i) => (
                                <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-white/20 transition-all">
                                    <div>
                                        <h4 className="font-bold text-sm text-gray-200">{feature.title}</h4>
                                        <p className="text-[10px] text-gray-500">{feature.desc}</p>
                                    </div>
                                    <div className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${feature.active ? 'bg-blue-500' : 'bg-gray-700'}`}>
                                        <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${feature.active ? 'left-6' : 'left-1'}`}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Simulated System Logs */}
                    <div className="bg-black/40 border border-white/10 rounded-3xl p-8 h-[300px] flex flex-col">
                        <div className="flex items-center gap-3 mb-4">
                            <Activity className="w-4 h-4 text-green-500" />
                            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Global Event Stream</h4>
                        </div>
                        <div className="flex-1 overflow-y-auto font-mono text-[10px] space-y-2 pr-4 custom-scrollbar">
                            <p className="text-gray-500"><span className="text-blue-500">[14:02:45]</span> NASA-VIIRS fire data ingested successfully. 42 hotspots identified.</p>
                            <p className="text-gray-500"><span className="text-blue-500">[14:02:40]</span> Vision AI calibrated Traffic Index for ITO Junction: 1.12 load.</p>
                            <p className="text-yellow-500"><span className="text-blue-500">[14:01:21]</span> Auth Service: Slow response from North Delhi sensor node.</p>
                            <p className="text-gray-500"><span className="text-blue-500">[14:00:15]</span> Scheduled task: policy_impact_sync complete.</p>
                            <p className="text-green-500"><span className="text-blue-500">[13:58:02]</span> New Citizen Report: Construction Dust violation @ Noida Sec 62.</p>
                            <p className="text-gray-500"><span className="text-blue-500">[13:55:45]</span> Neural Engine v4.2 optimization routine start.</p>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: SECURITY & ALERTS */}
                <div className="xl:col-span-4 space-y-6">
                    <div className="bg-red-900/10 border border-red-500/20 p-8 rounded-3xl">
                        <h4 className="text-red-400 font-bold flex items-center gap-2 mb-6">
                            <Bell className="w-4 h-4" />
                            Emergency Broadcast
                        </h4>
                        <p className="text-xs text-gray-400 mb-6">Authorize emergency notification push to 2.4M registered mobile devices in Delhi NCR.</p>
                        <div className="space-y-4">
                            <button className="w-full py-4 bg-red-600/20 border border-red-500/40 text-red-500 font-bold rounded-2xl hover:bg-red-600/30 transition-all text-xs">
                                SEND GRAP-4 ALERT
                            </button>
                            <button className="w-full py-4 bg-white/5 border border-white/10 text-gray-400 font-bold rounded-2xl hover:bg-white/10 transition-all text-xs">
                                MANAGE TEMPLATES
                            </button>
                        </div>
                    </div>

                    <div className="bg-white/5 border border-white/10 p-8 rounded-3xl">
                        <h4 className="text-gray-200 font-bold mb-6">Security Context</h4>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-green-500/10 rounded-lg"><Lock className="w-4 h-4 text-green-500" /></div>
                                <div>
                                    <p className="text-xs font-bold text-white">Encrypted Sensor Tunnel</p>
                                    <p className="text-[10px] text-gray-500">AES-256 Active</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-blue-500/10 rounded-lg"><Globe className="w-4 h-4 text-blue-500" /></div>
                                <div>
                                    <p className="text-xs font-bold text-white">Geo-Redundancy</p>
                                    <p className="text-[10px] text-gray-500">2 Nodes Active (NCR-1, NCR-2)</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AdminPanel;