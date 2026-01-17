import React, { useState, useEffect } from 'react';
import {
    Heart, Wind, Activity, Shield, Navigation,
    AlertTriangle, Baby, User, Stethoscope, Map, ArrowRight,
    Brain, Flame
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const HealthAdvisor = () => {
    const [activePersona, setActivePersona] = useState('general'); // general, child, elderly, athlete
    const [selectedRoute, setSelectedRoute] = useState(2); // Default to Safe route

    // 1. Mock Data for "Safe Route" Feature (Embedded Logic)
    const routes = [
        {
            id: 1,
            type: 'Fastest Route',
            via: 'Ring Road',
            time: '24 min',
            aqi: 380,
            exposure: 'High Risk',
            color: 'text-red-400',
            bg: 'bg-red-500/10',
            border: 'border-red-500/30'
        },
        {
            id: 2,
            type: 'Green Corridor',
            via: 'Lodhi Road Park',
            time: '32 min',
            aqi: 210,
            exposure: 'Moderate Risk',
            color: 'text-green-400',
            bg: 'bg-green-500/10',
            border: 'border-green-500/30'
        }
    ];

    // 2. Persona-Based Logic Dictionary
    const advisories = {
        general: {
            risk: 'Severe',
            aqi: 342,
            mask: 'N95 Mandatory',
            purifier: 'Max Speed',
            activity: 'Avoid Outdoors',
            color: 'from-red-600/20 to-orange-600/20',
            textColor: 'text-red-500',
            symptoms: ['Eye Irritation', 'Coughing', 'Headache']
        },
        child: {
            risk: 'Critical',
            aqi: 342, // Children are more sensitive at same AQI
            mask: 'N95 (Kids Size)',
            purifier: 'Max + Humidifier',
            activity: 'No Outdoor Play',
            color: 'from-purple-600/20 to-pink-600/20',
            textColor: 'text-purple-400',
            symptoms: ['Wheezing', 'Reduced Lung Function', 'Fatigue']
        },
        elderly: {
            risk: 'Life Threatening',
            aqi: 342,
            mask: 'Stay Indoors',
            purifier: 'Max Speed',
            activity: 'Complete Rest',
            color: 'from-orange-600/20 to-yellow-600/20',
            textColor: 'text-orange-400',
            symptoms: ['BP Spike', 'Breathlessness', 'Chest Pain']
        },
        athlete: {
            risk: 'High',
            aqi: 342,
            mask: 'No Training',
            purifier: 'Max Speed',
            activity: 'Indoor Gym Only',
            color: 'from-blue-600/20 to-cyan-600/20',
            textColor: 'text-blue-400',
            symptoms: ['Performance Drop', 'Rapid Heartbeat', 'Dizziness']
        }
    };

    const current = advisories[activePersona];

    return (
        <div className="p-8 bg-background min-h-[calc(100vh-80px)] text-white space-y-8">

            {/* HEADER & CONTROLS */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h2 className="text-2xl font-bold flex items-center gap-3">
                        <Heart className="text-red-500 w-7 h-7" />
                        Health & Safety Command
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">AI-Personalized risk assessment and exposure management</p>
                </div>

                {/* PERSONA TOGGLES */}
                <div className="bg-white/5 p-1.5 rounded-xl flex gap-1 border border-white/10 overflow-x-auto max-w-full">
                    {[
                        { id: 'general', icon: User, label: 'General' },
                        { id: 'child', icon: Baby, label: 'Child' },
                        { id: 'elderly', icon: Stethoscope, label: 'Elderly' },
                        { id: 'athlete', icon: Activity, label: 'Athlete' }
                    ].map((type) => (
                        <button
                            key={type.id}
                            onClick={() => setActivePersona(type.id)}
                            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 whitespace-nowrap ${activePersona === type.id
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <type.icon className="w-3 h-3" />
                            {type.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* LEFT COLUMN: RISK & SYMPTOMS */}
                <div className="lg:col-span-7 space-y-6">

                    {/* MAIN STATUS CARD (Animated) */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activePersona}
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            transition={{ duration: 0.3 }}
                            className={`bg-gradient-to-br ${current.color} border border-white/10 p-8 rounded-3xl relative overflow-hidden`}
                        >
                            {/* Background Pulse Animation */}
                            <div className={`absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-[80px] -mr-16 -mt-16 animate-pulse`}></div>

                            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <AlertTriangle className={`w-4 h-4 ${current.textColor}`} />
                                        <p className={`${current.textColor} font-bold uppercase tracking-widest text-xs`}>Current Risk Level</p>
                                    </div>
                                    <h3 className="text-5xl font-black text-white mb-2">{current.risk}</h3>
                                    <p className="text-sm text-gray-300 mb-4">Based on AQI {current.aqi} & Sensitivity</p>

                                    <div className="flex flex-wrap gap-2">
                                        {current.symptoms.map(sym => (
                                            <span key={sym} className={`px-3 py-1 bg-black/20 border border-white/10 rounded-full text-[10px] ${current.textColor} font-bold uppercase`}>
                                                {sym}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="bg-black/30 p-4 rounded-xl border border-white/5 flex items-center gap-4 backdrop-blur-sm">
                                        <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                                            <Shield className="w-5 h-5 text-blue-400" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-gray-400 uppercase font-bold">Protocol</p>
                                            <p className="text-base font-bold text-white">{current.mask}</p>
                                        </div>
                                    </div>
                                    <div className="bg-black/30 p-4 rounded-xl border border-white/5 flex items-center gap-4 backdrop-blur-sm">
                                        <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                                            <Wind className="w-5 h-5 text-green-400" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-gray-400 uppercase font-bold">Purification</p>
                                            <p className="text-base font-bold text-white">{current.purifier}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    {/* ORGAN IMPACT MAP */}
                    <div className="bg-white/5 border border-white/10 p-6 rounded-3xl">
                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                            <Activity className="w-5 h-5 text-pink-400" />
                            Physiological Impact Map
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="p-4 bg-white/5 rounded-2xl text-center hover:bg-white/10 transition-all border border-transparent hover:border-pink-500/30">
                                <div className="w-12 h-12 mx-auto bg-pink-500/10 rounded-full flex items-center justify-center mb-3">
                                    <Wind className="w-6 h-6 text-pink-400" />
                                </div>
                                <p className="font-bold text-sm text-pink-200">Respiratory</p>
                                <p className="text-[10px] text-gray-400 mt-1">PM2.5 Deep Penetration</p>
                            </div>
                            <div className="p-4 bg-white/5 rounded-2xl text-center hover:bg-white/10 transition-all border border-transparent hover:border-red-500/30">
                                <div className="w-12 h-12 mx-auto bg-red-500/10 rounded-full flex items-center justify-center mb-3">
                                    <Heart className="w-6 h-6 text-red-400" />
                                </div>
                                <p className="font-bold text-sm text-red-200">Cardiovascular</p>
                                <p className="text-[10px] text-gray-400 mt-1">Arterial Inflammation</p>
                            </div>
                            <div className="p-4 bg-white/5 rounded-2xl text-center hover:bg-white/10 transition-all border border-transparent hover:border-blue-500/30">
                                <div className="w-12 h-12 mx-auto bg-blue-500/10 rounded-full flex items-center justify-center mb-3">
                                    <Brain className="w-6 h-6 text-blue-400" />
                                </div>
                                <p className="font-bold text-sm text-blue-200">Cognitive</p>
                                <p className="text-[10px] text-gray-400 mt-1">Neuro-Inflammation</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: SAFE ROUTE FINDER */}
                <div className="lg:col-span-5 space-y-6">
                    <div className="bg-white/5 border border-white/10 p-6 rounded-3xl h-full flex flex-col">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-bold text-lg flex items-center gap-2">
                                <Navigation className="w-5 h-5 text-blue-400" />
                                Safe Route Finder
                            </h3>
                            <span className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-1 rounded border border-blue-500/30 animate-pulse">
                                AI OPTIMIZED
                            </span>
                        </div>

                        {/* Input Simulation */}
                        <div className="space-y-3 mb-6 relative">
                            <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-gradient-to-b from-blue-500 to-red-500 opacity-30"></div>
                            <div className="flex items-center gap-3 p-3 bg-black/40 rounded-xl border border-white/5 relative z-10">
                                <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                                <span className="text-sm text-gray-300 font-mono">Greater Kailash</span>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-black/40 rounded-xl border border-white/5 relative z-10">
                                <div className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]"></div>
                                <span className="text-sm text-gray-300 font-mono">Cyber Hub, Gurgaon</span>
                            </div>
                        </div>

                        {/* Route Cards */}
                        <div className="space-y-4 mb-6">
                            {routes.map((route) => (
                                <div
                                    key={route.id}
                                    onClick={() => setSelectedRoute(route.id)}
                                    className={`p-4 rounded-2xl border cursor-pointer transition-all relative overflow-hidden group ${selectedRoute === route.id ? `${route.bg} ${route.border}` : 'bg-white/5 border-white/5 hover:border-white/20'
                                        }`}
                                >
                                    <div className="flex justify-between items-start mb-2 relative z-10">
                                        <div>
                                            <span className={`text-[10px] font-black uppercase tracking-widest ${route.color}`}>
                                                {route.type}
                                            </span>
                                            <div className="flex items-baseline gap-2 mt-1">
                                                <h4 className="text-2xl font-black text-white font-mono">{route.time}</h4>
                                                <span className="text-xs text-gray-400">via {route.via}</span>
                                            </div>
                                        </div>
                                        <div className={`p-2 rounded-full ${route.id === 2 ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                                            {route.id === 2 ? <Shield className={`w-4 h-4 ${route.color}`} /> : <Flame className={`w-4 h-4 ${route.color}`} />}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 text-xs text-gray-400 relative z-10 mt-2 bg-black/20 p-2 rounded-lg inline-flex">
                                        <span className={route.color}>Avg AQI: <b>{route.aqi}</b></span>
                                        <span className="w-1 h-1 rounded-full bg-gray-600"></span>
                                        <span>{route.exposure}</span>
                                    </div>

                                    {selectedRoute === route.id && (
                                        <div className="absolute top-0 right-0 p-2">
                                            <div className={`w-2 h-2 rounded-full ${route.id === 2 ? 'bg-green-500' : 'bg-red-500'} animate-ping`}></div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Simulated Map Preview */}
                        <div className="mt-auto h-40 rounded-2xl bg-[#111] border border-white/10 relative overflow-hidden flex flex-col items-center justify-center group">
                            {/* Simulated Map Lines */}
                            <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 100 100" preserveAspectRatio="none">
                                <path d="M10,90 Q40,60 90,10" stroke="#ef4444" strokeWidth="2" fill="none" strokeDasharray="4 4" />
                                <path d="M10,90 Q30,80 50,50 T90,10" stroke="#22c55e" strokeWidth="2" fill="none" />
                            </svg>

                            <div className="z-10 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 flex items-center gap-2">
                                <Map className="w-4 h-4 text-blue-400" />
                                <span className="text-xs text-gray-300">Live Traffic Integration Active</span>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
};

export default HealthAdvisor;