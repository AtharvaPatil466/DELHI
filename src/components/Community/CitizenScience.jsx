import React, { useState } from 'react';
import {
    Camera, MapPin, Send, ShieldCheck, ThumbsUp,
    MessageCircle, Filter, Trophy, Coins, Zap,
    Trash2, AlertCircle, CheckCircle, Clock
} from 'lucide-react';

const CitizenScience = () => {
    const [reports, setReports] = useState([
        { id: 1, type: 'Industrial Smoke', area: 'Okhla Phase III', severity: 'High', status: 'Verified', time: '2h ago', votes: 24, description: 'Dense yellow smoke observed from chemical unit near metro station.' },
        { id: 2, type: 'Construction Dust', area: 'Noida Sec 62', severity: 'Medium', status: 'Pending', time: '4h ago', votes: 8, description: 'Construction site operating without water sprinkling or dust covers.' },
        { id: 3, type: 'Open Burning', area: 'Rohini Sec 8', severity: 'High', status: 'Action Taken', time: '6h ago', votes: 42, description: 'Garbage burning in local park. Fire department notified.' },
    ]);

    const stats = [
        { label: 'Total Reports', value: '1,247', icon: MessageCircle, color: 'text-primary' },
        { label: 'Verified Cases', value: '856', icon: ShieldCheck, color: 'text-success' },
        { label: 'Action Taken', value: '432', icon: Zap, color: 'text-warning' },
        { label: 'Community Credits', value: '12K+', icon: Coins, color: 'text-secondary' },
    ];

    return (
        <div className="p-8 bg-background min-h-[calc(100vh-64px)] space-y-8 fade-in">
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h2 className="text-2xl font-bold flex items-center gap-3">
                        <Trophy className="text-primary w-7 h-7" />
                        Citizen Engagement Hub
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">Report violations, verify incidents and earn Air Credits</p>
                </div>

                <button className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-2xl font-bold text-sm lg:text-base hover:bg-primary/90 transition-all shadow-xl shadow-primary/20">
                    <Camera className="w-5 h-5" />
                    Report Incident
                </button>
            </div>

            {/* Stats Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                {stats.map((s, i) => (
                    <div key={i} className="glass p-6 rounded-3xl border-white/5 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-12 -mt-12 blur-2xl group-hover:bg-primary/10 transition-all duration-700"></div>
                        <div className="flex items-center gap-4 relative z-10">
                            <div className={`p-3 bg-surface rounded-2xl ${s.color}`}>
                                <s.icon className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">{s.label}</p>
                                <p className="text-xl font-black font-mono">{s.value}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                {/* Community Feed */}
                <div className="xl:col-span-8 space-y-6">
                    <div className="flex items-center justify-between px-2">
                        <h3 className="font-bold text-lg">Active Reports Feed</h3>
                        <button className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-white transition-colors">
                            <Filter className="w-4 h-4" />
                            Recent First
                        </button>
                    </div>

                    <div className="space-y-4">
                        {reports.map((report) => (
                            <div key={report.id} className="glass p-6 rounded-3xl border-white/5 hover:bg-surface/50 transition-all">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex gap-4">
                                        <div className="w-12 h-12 bg-surface rounded-2xl border border-white/5 flex items-center justify-center">
                                            <AlertCircle className={`w-6 h-6 ${report.severity === 'High' ? 'text-danger' : 'text-warning'}`} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-200">{report.type}</h4>
                                            <p className="text-xs text-gray-500 flex items-center gap-2 mt-1">
                                                <MapPin className="w-3 h-3 text-primary" />
                                                {report.area} • {report.time}
                                            </p>
                                        </div>
                                    </div>
                                    <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${report.status === 'Verified' ? 'bg-success/10 text-success border border-success/20' :
                                        report.status === 'Action Taken' ? 'bg-primary/10 text-primary border border-primary/20' :
                                            'bg-warning/10 text-warning border border-warning/20'
                                        }`}>
                                        {report.status}
                                    </div>
                                </div>

                                <p className="text-sm text-gray-400 mb-6 leading-relaxed">
                                    {report.description}
                                </p>

                                <div className="flex items-center justify-between border-t border-white/5 pt-4">
                                    <div className="flex items-center gap-6">
                                        <button className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-white group">
                                            <ThumbsUp className="w-4 h-4 group-hover:text-primary transition-colors" />
                                            Verify ({report.votes})
                                        </button>
                                        <button className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-white group">
                                            <MessageCircle className="w-4 h-4 group-hover:text-primary transition-colors" />
                                            Comments
                                        </button>
                                    </div>
                                    <div className="flex items-center gap-2 text-[10px] text-gray-600 font-bold uppercase tracking-widest">
                                        <Clock className="w-3 h-3" />
                                        Last Updated {report.time}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Gamification Sidebar */}
                <div className="xl:col-span-4 space-y-8">
                    {/* Air Credits Balance */}
                    <div className="glass p-8 rounded-3xl bg-gradient-to-br from-secondary/10 to-transparent border-secondary/20 flex flex-col items-center text-center">
                        <div className="p-4 bg-secondary/20 rounded-full mb-4">
                            <Coins className="w-8 h-8 text-secondary" />
                        </div>
                        <p className="text-xs font-bold text-secondary uppercase tracking-widest mb-2">Your Air Credits</p>
                        <div className="text-5xl font-black mb-2 font-mono">4,850</div>
                        <p className="text-[10px] text-gray-500 max-w-[180px]">Great work! You've offset 24kg of CO2 this month.</p>

                        <div className="w-full h-1.5 bg-background rounded-full mt-6 overflow-hidden">
                            <div className="h-full bg-secondary" style={{ width: '65%' }}></div>
                        </div>
                        <p className="text-[10px] text-gray-600 mt-2 font-bold uppercase">150 credits to next level</p>
                    </div>

                    {/* Activity Leaderboard */}
                    <div className="glass p-6 rounded-3xl border-white/5">
                        <h4 className="font-bold text-sm uppercase tracking-widest text-gray-500 mb-6 flex items-center gap-2">
                            <Trophy className="w-4 h-4 text-warning" />
                            Impact Leaderboard
                        </h4>
                        <div className="space-y-6">
                            {[
                                { name: 'Aditya S.', credits: 12450, rank: 1, pfp: 'AS' },
                                { name: 'Priya M.', credits: 10200, rank: 2, pfp: 'PM' },
                                { name: 'Rohan K.', credits: 8900, rank: 3, pfp: 'RK' },
                                { name: 'Sameer V.', credits: 7600, rank: 4, pfp: 'SV' },
                            ].map((user) => (
                                <div key={user.rank} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className={`text-xs font-black w-4 ${user.rank === 1 ? 'text-warning' : 'text-gray-600'}`}>#{user.rank}</span>
                                        <div className="w-8 h-8 rounded-full bg-surface border border-white/5 flex items-center justify-center text-[10px] font-bold text-gray-300">
                                            {user.pfp}
                                        </div>
                                        <span className="text-xs font-bold">{user.name}</span>
                                    </div>
                                    <span className="text-xs font-black text-white font-mono">{user.credits.toLocaleString()} pts</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CitizenScience;
