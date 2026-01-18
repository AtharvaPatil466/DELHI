import React, { useState } from 'react';
import {
    Camera, MapPin, ShieldCheck, ThumbsUp,
    MessageCircle, Trophy, Coins, Zap,
    AlertCircle, Clock, Flame, Truck, Hammer
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CitizenScience = () => {
    const [reports, setReports] = useState([
        { id: 1, type: 'Industrial Smoke', area: 'Okhla Phase III', severity: 'High', status: 'Verified', time: '10m ago', votes: 24, description: 'Dense yellow smoke observed from chemical unit near metro station.', author: 'Rahul S.' },
        { id: 2, type: 'Construction Dust', area: 'Noida Sec 62', severity: 'Medium', status: 'Pending', time: '25m ago', votes: 8, description: 'Construction site operating without water sprinkling or dust covers.', author: 'Amit K.' },
        { id: 3, type: 'Open Burning', area: 'Rohini Sec 8', severity: 'High', status: 'Action Taken', time: '1h ago', votes: 42, description: 'Garbage burning in local park. Fire department notified.', author: 'Priya M.' },
    ]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalData, setModalData] = useState({ type: '', description: '', area: '', image: null });
    const [imagePreview, setImagePreview] = useState(null);

    const handleQuickAction = (type) => {
        setModalData({ ...modalData, type: type, description: '', area: 'Current Location (GPS)', image: null });
        setImagePreview(null);
        setIsModalOpen(true);
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setModalData({ ...modalData, image: file });
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const submitReport = () => {
        const newReport = {
            id: Date.now(),
            type: modalData.type,
            area: modalData.area || 'Current Location (GPS)',
            severity: 'High',
            status: 'Pending',
            time: 'Just Now',
            votes: 0,
            description: modalData.description || `New ${modalData.type} reported.`,
            author: 'You',
            image: imagePreview
        };
        setReports([newReport, ...reports]);
        setIsModalOpen(false);
    };

    return (
        <div className="p-8 bg-background min-h-[calc(100vh-80px)] space-y-8 text-white">

            {/* REPORT MODAL */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative w-full max-w-lg bg-[#18181b] border border-white/10 rounded-[32px] overflow-hidden shadow-2xl"
                        >
                            <div className="p-8 space-y-6">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-xl font-bold flex items-center gap-2">
                                        <Camera className="w-6 h-6 text-primary" />
                                        Submit Report: <span className="text-primary">{modalData.type}</span>
                                    </h3>
                                    <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-white transition-colors">
                                        <Zap className="w-5 h-5 rotate-45" />
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Description</label>
                                        <textarea
                                            value={modalData.description}
                                            onChange={(e) => setModalData({ ...modalData, description: e.target.value })}
                                            placeholder="Describe the violation (e.g. dense black smoke, site name)..."
                                            className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all min-h-[100px]"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Location</label>
                                        <div className="relative">
                                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                                            <input
                                                type="text"
                                                value={modalData.area}
                                                onChange={(e) => setModalData({ ...modalData, area: e.target.value })}
                                                className="w-full bg-white/5 border border-white/5 rounded-2xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Evidence Photo</label>
                                        <div className="flex items-center gap-4">
                                            <label className="flex-1 flex flex-col items-center justify-center gap-2 h-32 border-2 border-dashed border-white/10 rounded-2xl hover:bg-white/5 transition-all cursor-pointer overflow-hidden group">
                                                {imagePreview ? (
                                                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                                ) : (
                                                    <>
                                                        <Camera className="w-8 h-8 text-gray-600 group-hover:text-primary transition-colors" />
                                                        <span className="text-[10px] text-gray-500 font-bold uppercase">Click to upload photo</span>
                                                    </>
                                                )}
                                                <input type="file" onChange={handleImageUpload} className="hidden" accept="image/*" />
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={submitReport}
                                    className="w-full py-4 bg-primary text-white text-xs font-black uppercase tracking-[0.2em] rounded-2xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                                >
                                    SUBMIT TO GREEN ARMY
                                </button>
                                <p className="text-[9px] text-center text-gray-500 italic">
                                    By submitting, you earn +50 Green Credits. False reporting will result in credit deduction.
                                </p>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* 1. HERO BRANDING SECTION */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-green-900/40 to-emerald-900/40 border border-green-500/20 p-10 text-center">
                <div className="relative z-10">
                    <h2 className="text-4xl font-black mb-2 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-300 tracking-tight">
                        DELHI GREEN ARMY
                    </h2>
                    <p className="text-gray-400 max-w-xl mx-auto text-sm">
                        Join 12,000+ citizens. Report pollution, earn <span className="text-yellow-400 font-bold">Green Credits</span>, and redeem for Metro rewards.
                    </p>

                    {/* Live Counters */}
                    <div className="flex justify-center gap-12 mt-8">
                        <div className="text-center">
                            <p className="text-3xl font-black text-white">12,450</p>
                            <p className="text-[10px] text-green-400 uppercase font-bold tracking-widest">Active Guardians</p>
                        </div>
                        <div className="text-center">
                            <p className="text-3xl font-black text-white">892</p>
                            <p className="text-[10px] text-green-400 uppercase font-bold tracking-widest">Violations Stopped</p>
                        </div>
                    </div>
                </div>
                {/* Background Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-500/10 rounded-full blur-[100px]"></div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">

                {/* LEFT COLUMN: Reporting & Feed */}
                <div className="xl:col-span-8 space-y-8">

                    {/* Quick Report Actions */}
                    <div className="bg-white/5 border border-white/10 p-6 rounded-3xl">
                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                            <Camera className="w-5 h-5 text-blue-400" />
                            Quick Report
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <button onClick={() => handleQuickAction('Waste Burning')} className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 transition-all flex flex-col items-center gap-2 group">
                                <Flame className="w-6 h-6 text-red-500 group-hover:scale-110 transition-transform" />
                                <span className="text-xs font-bold text-red-300">Burning</span>
                            </button>
                            <button onClick={() => handleQuickAction('Construction Dust')} className="p-4 rounded-2xl bg-orange-500/10 border border-orange-500/20 hover:bg-orange-500/20 transition-all flex flex-col items-center gap-2 group">
                                <Hammer className="w-6 h-6 text-orange-500 group-hover:scale-110 transition-transform" />
                                <span className="text-xs font-bold text-orange-300">Dust</span>
                            </button>
                            <button onClick={() => handleQuickAction('Industrial Smoke')} className="p-4 rounded-2xl bg-gray-500/10 border border-gray-500/20 hover:bg-gray-500/20 transition-all flex flex-col items-center gap-2 group">
                                <Zap className="w-6 h-6 text-gray-400 group-hover:scale-110 transition-transform" />
                                <span className="text-xs font-bold text-gray-300">Industry</span>
                            </button>
                            <button onClick={() => handleQuickAction('Vehicle Emission')} className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/20 transition-all flex flex-col items-center gap-2 group">
                                <Truck className="w-6 h-6 text-blue-400 group-hover:scale-110 transition-transform" />
                                <span className="text-xs font-bold text-blue-300">Vehicle</span>
                            </button>
                        </div>
                    </div>

                    {/* Live Feed */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between px-2">
                            <h3 className="font-bold text-lg">Community Watch Feed</h3>
                            <div className="flex items-center gap-2">
                                <span className="animate-pulse w-2 h-2 rounded-full bg-green-500"></span>
                                <span className="text-xs font-bold text-green-500">LIVE</span>
                            </div>
                        </div>

                        <AnimatePresence>
                            {reports.map((report) => (
                                <motion.div
                                    key={report.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="glass p-6 rounded-3xl border-white/5 hover:bg-white/5 transition-all"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex gap-4">
                                            <div className="w-12 h-12 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-center">
                                                <AlertCircle className={`w-6 h-6 ${report.severity === 'High' ? 'text-red-500' : 'text-orange-500'}`} />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-200">{report.type}</h4>
                                                <p className="text-xs text-gray-500 flex items-center gap-2 mt-1">
                                                    <MapPin className="w-3 h-3 text-blue-400" />
                                                    {report.area} • {report.time}
                                                </p>
                                            </div>
                                        </div>
                                        <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${report.status === 'Verified' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                                            report.status === 'Action Taken' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                                                'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                                            }`}>
                                            {report.status}
                                        </div>
                                    </div>

                                    <div className="pl-16 space-y-4">
                                        <p className="text-sm text-gray-400 leading-relaxed">
                                            <span className="text-white font-bold">{report.author}:</span> {report.description}
                                        </p>

                                        {report.image && (
                                            <div className="relative w-full h-48 md:h-64 rounded-2xl overflow-hidden border border-white/10 shadow-2xl group">
                                                <img src={report.image} alt="Report evidence" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                                                <div className="absolute bottom-4 left-4 flex items-center gap-2">
                                                    <div className="px-2 py-1 bg-primary/20 backdrop-blur-md rounded text-[8px] font-black text-white uppercase tracking-tighter">
                                                        Evidence ID: {report.id.toString().slice(-6)}
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex items-center justify-between border-t border-white/5 pt-4">
                                            <div className="flex items-center gap-6">
                                                <button className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-green-400 group transition-colors">
                                                    <ThumbsUp className="w-4 h-4" />
                                                    Verify ({report.votes})
                                                </button>
                                                <button className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-white group transition-colors">
                                                    <MessageCircle className="w-4 h-4" />
                                                    Discuss
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>

                {/* RIGHT COLUMN: Gamification Sidebar */}
                <div className="xl:col-span-4 space-y-8">
                    {/* Credits Card */}
                    <div className="glass p-8 rounded-3xl bg-gradient-to-br from-yellow-900/10 to-transparent border-yellow-500/20 flex flex-col items-center text-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                        <div className="p-4 bg-yellow-500/20 rounded-full mb-4 text-yellow-400">
                            <Coins className="w-8 h-8" />
                        </div>
                        <p className="text-xs font-bold text-yellow-500 uppercase tracking-widest mb-2">My Green Credits</p>
                        <div className="text-5xl font-black mb-2 font-mono text-white">4,850</div>
                        <p className="text-[10px] text-gray-400 max-w-[180px]">Redeem for Metro passes or donate to tree planting.</p>

                        <div className="w-full h-1.5 bg-gray-800 rounded-full mt-6 overflow-hidden">
                            <div className="h-full bg-yellow-500" style={{ width: '65%' }}></div>
                        </div>
                        <p className="text-[10px] text-gray-500 mt-2 font-bold uppercase">Rank: <span className="text-white">Guardian Lvl 4</span></p>
                    </div>

                    {/* Leaderboard */}
                    <div className="glass p-6 rounded-3xl border-white/5">
                        <h4 className="font-bold text-sm uppercase tracking-widest text-gray-500 mb-6 flex items-center gap-2">
                            <Trophy className="w-4 h-4 text-yellow-400" />
                            Top Guardians
                        </h4>
                        <div className="space-y-4">
                            {[
                                { name: 'Aditya S.', credits: 12450, rank: 1, pfp: 'AS' },
                                { name: 'Priya M.', credits: 10200, rank: 2, pfp: 'PM' },
                                { name: 'Sahil T.', credits: 8900, rank: 3, pfp: 'ST' },
                            ].map((user) => (
                                <div key={user.rank} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer">
                                    <div className="flex items-center gap-3">
                                        <span className={`text-xs font-black w-5 h-5 flex items-center justify-center rounded-full ${user.rank === 1 ? 'bg-yellow-400 text-black' : 'text-gray-500 bg-gray-800'}`}>
                                            {user.rank}
                                        </span>
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-[10px] font-bold text-white">
                                            {user.pfp}
                                        </div>
                                        <span className="text-xs font-bold text-gray-200">{user.name}</span>
                                    </div>
                                    <span className="text-xs font-black text-green-400 font-mono">{user.credits.toLocaleString()}</span>
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