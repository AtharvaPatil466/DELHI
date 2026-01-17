import React, { useState } from 'react';
import {
    ShieldAlert, Bell, Settings, Lock, Eye,
    RefreshCcw, Download, Terminal, Database,
    Activity, Users, Send, AlertTriangle
} from 'lucide-react';

const AdminPanel = () => {
    const [activeAlerts] = useState([
        { id: 1, type: 'Health Alert', area: 'NCR-Wide', level: 'Severe', dispatched: '12:40 PM', reach: '4.2M Users' },
        { id: 2, type: 'Closure Notice', area: 'Anand Vihar', level: 'Critical', dispatched: '11:15 AM', reach: '180K Users' },
    ]);

    const systemHealth = [
        { label: 'Sensor Network', status: 'Online', uptime: '99.9%', color: 'text-success' },
        { label: 'ML Analytics', status: 'Online', uptime: '98.5%', color: 'text-success' },
        { label: 'API Gateway', status: 'Optimal', uptime: '100%', color: 'text-success' },
        { label: 'Auth Service', status: 'Lagging', uptime: '94.2%', color: 'text-warning' },
    ];

    return (
        <div className="p-8 bg-background min-h-[calc(100vh-80px)]">
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h2 className="text-2xl font-bold flex items-center gap-3 text-white">
                        <Lock className="text-primary w-7 h-7" />
                        Authority Control Center
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">Global administrative override and system health monitoring</p>
                </div>

                <div className="flex gap-4">
                    <button className="flex items-center gap-2 px-4 py-2 bg-danger/10 text-danger border border-danger/20 rounded-xl font-bold text-xs hover:bg-danger/20 transition-all shadow-lg shadow-danger/5">
                        <AlertTriangle className="w-4 h-4" />
                        Emergency Broadcast
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-surface border border-white/5 rounded-xl font-bold text-xs hover:bg-white/5 transition-all">
                        <RefreshCcw className="w-4 h-4" />
                        Re-sync Sensors
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
                {/* System Health */}
                <div className="xl:col-span-1 space-y-6">
                    <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest px-2">Core Services</h3>
                    {systemHealth.map((s, i) => (
                        <div key={i} className="glass p-4 rounded-2xl border-white/5 flex flex-col gap-3">
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-bold text-gray-300">{s.label}</span>
                                <div className={`w-2 h-2 rounded-full ${s.color === 'text-success' ? 'bg-success' : 'bg-warning'} shadow-[0_0_8px_currentColor]`}></div>
                            </div>
                            <div className="flex justify-between items-end">
                                <span className={`text-lg font-black ${s.color} font-mono`}>{s.status}</span>
                                <span className="text-[10px] text-gray-600 font-bold">{s.uptime}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Global Alerts & Broadcast History */}
                <div className="xl:col-span-3 space-y-8">
                    <div className="glass p-8 rounded-3xl border-white/5">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="font-bold text-lg flex items-center gap-3">
                                <Bell className="w-5 h-5 text-primary" />
                                Active Emergency Alerts
                            </h3>
                            <span className="text-[10px] font-bold text-gray-500 uppercase bg-surface px-3 py-1 rounded-full border border-white/5">Auto-Refreshes in 12s</span>
                        </div>

                        <div className="space-y-4">
                            {activeAlerts.map(alert => (
                                <div key={alert.id} className="flex items-center justify-between p-5 bg-surface/50 border border-white/5 rounded-2xl hover:border-white/20 transition-all group">
                                    <div className="flex items-center gap-6">
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${alert.level === 'Severe' ? 'bg-danger/10' : 'bg-danger/20'} border border-danger/10`}>
                                            <ShieldAlert className="w-6 h-6 text-danger" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-sm text-white">{alert.type} - {alert.area}</h4>
                                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Dispatched at {alert.dispatched} • Impact: {alert.reach}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <button className="p-2.5 rounded-xl bg-surface border border-white/5 text-gray-500 hover:text-white transition-colors">
                                            <Eye className="w-4 h-4" />
                                        </button>
                                        <button className="p-2.5 rounded-xl bg-surface border border-white/5 text-gray-500 hover:text-danger transition-colors">
                                            <Activity className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="glass p-8 rounded-3xl border-white/5 min-h-[300px] flex flex-col">
                            <h4 className="font-bold mb-6 flex items-center gap-2">
                                <Terminal className="w-5 h-5 text-gray-400" />
                                Security Logs
                            </h4>
                            <div className="flex-1 bg-black/40 rounded-2xl p-4 font-mono text-[10px] text-success/70 leading-relaxed overflow-y-auto max-h-[200px] custom-scrollbar">
                                <p className="mb-1"><span className="text-gray-600">[12:45:01]</span> Admin session initialized from 192.168.1.1</p>
                                <p className="mb-1"><span className="text-gray-600">[12:48:22]</span> Sensor 'AV-34' recalibrated (+2.4% sensitivity)</p>
                                <p className="mb-1"><span className="text-gray-600">[12:50:45]</span> Alert dispatched to Noida Cluster 4</p>
                                <p className="mb-1"><span className="text-gray-600">[12:52:10]</span> Database backup successful (S3-Buckets-A)</p>
                                <p className="mb-1 animate-pulse"><span className="text-gray-600">[12:54:33]</span> Fetching live satellite telemetry...</p>
                            </div>
                        </div>

                        <div className="glass p-8 rounded-3xl border-white/5 bg-gradient-to-br from-primary/5 to-transparent">
                            <h4 className="font-bold mb-4 flex items-center gap-2">
                                <Database className="w-5 h-5 text-primary" />
                                Consolidated Reports
                            </h4>
                            <p className="text-xs text-gray-500 mb-8 leading-relaxed">
                                Generate automated weekly compliance reports for the Central Pollution Control Board (CPCB).
                            </p>
                            <div className="space-y-3">
                                <button className="w-full flex items-center justify-between p-4 bg-surface border border-white/5 rounded-2xl text-xs font-bold hover:bg-white/5 transition-all group">
                                    <span className="text-gray-400 group-hover:text-white">Scientific Summary (PDF)</span>
                                    <Download className="w-4 h-4 text-gray-600 group-hover:text-primary" />
                                </button>
                                <button className="w-full flex items-center justify-between p-4 bg-surface border border-white/5 rounded-2xl text-xs font-bold hover:bg-white/5 transition-all group">
                                    <span className="text-gray-400 group-hover:text-white">Sensor Calibration Log (CSV)</span>
                                    <Download className="w-4 h-4 text-gray-600 group-hover:text-primary" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminPanel;
