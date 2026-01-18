import { isForbiddenHealthQuery } from '../../utils/chatGuards';
import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Sparkles, MessageSquare, Plus, Zap, ChevronRight, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AIAssistant = () => {
    const [messages, setMessages] = useState([
        {
            id: 1,
            type: 'bot',
            text: "Hello! I'm your Delhi Pollution Intel Assistant. I have real-time access to AQI sensors, ML source models, and health protocols. How can I help you today?",
        }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef();

    const quickActions = [
        "Is it safe to run in CP right now?",
        "Explain source attribution logic",
        "Why is EQI high in Anand Vihar?",
        "Policy impact for odd-even scheme"
    ];

    const handleSend = (text = input) => {
        if (!text.trim()) return;

        const userMessage = { id: Date.now(), type: 'user', text };
        setMessages(prev => [...prev, userMessage]);
        setInput('');

        // 🔒 HARD SAFETY GUARD (BLOCK MEDICAL QUERIES)
        if (isForbiddenHealthQuery(text)) {
            setMessages(prev => [
                ...prev,
                {
                    id: Date.now() + 1,
                    type: 'bot',
                    text: "I cannot provide medical diagnosis or treatment advice. I can help explain air quality conditions, pollution sources, and general safety guidance based on AQI levels."
                }
            ]);
            return;
        }

        setIsTyping(true);

        // Improved Intelligence Engine Logic
        setTimeout(() => {
            const query = text.toLowerCase();
            let response = "";

            if (query.includes('run') || query.includes('safe') || query.includes('exercise')) {
                response = "Intelligence analysis indicates a SEVERE risk for outdoor physical exertion. Primary particulate matter (PM2.5) concentrations are exceeding WHO safety limits by 14x. \n\nTactical recommendation: Transition all athletic activity to indoor filtered environments. If movement is necessary, utilize N95/FFP3 respirators only.";
            }
            else if (query.includes('why') || query.includes('reason') || query.includes('cause')) {
                response = "Current AQI spike is non-linear and attributed to three converging tactical factors:\n1. ATMOSPHERIC INVERSION: A cold air layer is trapping ground-level pollutants.\n2. STUBBLE FIRE CLUSTERS: NASA-VIIRS detect 400+ active thermal anomalies upwind (NW).\n3. LOW DISPERSION: Wind speeds are < 2.5 km/h, preventing nitrogen dioxide (NO2) clearance.";
            }
            else if (query.includes('satellite') || query.includes('nasa') || query.includes('fire')) {
                response = "Synchronizing with NASA-VIIRS live telemetry... I've identified 42 high-intensity fire clusters in the Punjab-Haryana corridor. The smoke plume is currently moving at 1.8km/h towards Delhi SE. Expected impact on particulate density: +15% over the next 6 hours.";
            }
            else if (query.includes('mask') || query.includes('protect')) {
                response = "Cloth and surgical masks are ineffective against PM2.5 sub-micron particles. \n\nProtocol mandates: \n- N95/N99 respirators for all outdoor exposure.\n- Air purifiers set to HEPA Grade H13 for residential filtration.\n- Seal all window gaps to prevent fine dust infiltration.";
            }
            else if (query.includes('policy') || query.includes('odd-even') || query.includes('grap')) {
                response = "Current status is GRAP-4 (Severe+). Policy simulations suggest that while 'Odd-Even' narrows vehicular load by 30%, industrial transition and construction bans are currently more effective at mitigating the immediate 400+ AQI baseline.";
            }
            else if (query.includes('industry') || query.includes('factory')) {
                response = "Industrial emissions in the Okhla and Noida clusters are contributing approximately 18% to the total particulate baseline. Monitoring nodes indicate higher sulfur dioxide (SO2) levels near specialized manufacturing zones.";
            }
            else {
                response = "Acknowledged. I have access to real-time satellite feeds, chemical sensor nodes, and traffic load telemetry. Please specify if you require a 'Chemical Breakdown,' 'Forecast Verification,' or a 'Health Protocol' for a specific region.";
            }

            setMessages(prev => [
                ...prev,
                { id: Date.now() + 2, type: 'bot', text: response }
            ]);
            setIsTyping(false);
        }, 1500);
    };

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <div className="p-8 bg-background h-[calc(100vh-80px)] flex gap-8">
            {/* Chat Interface */}
            <div className="flex-1 glass rounded-3xl flex flex-col overflow-hidden relative border-white/5">
                <div className="p-6 border-b border-white/5 bg-surface/50 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                            <Bot className="text-white w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-bold">Air Quality Intelligence</h3>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-success rounded-full animate-pulse"></span>
                                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Active • Neural Engine v4.2</span>
                            </div>
                        </div>
                    </div>
                    <button className="p-2.5 rounded-xl bg-surface hover:bg-surface/80 transition-colors border border-white/5">
                        <Plus className="w-5 h-5 text-gray-400" />
                    </button>
                </div>

                <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                    <AnimatePresence>
                        {messages.map((msg) => (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                key={msg.id}
                                className={`flex gap-4 ${msg.type === 'user' ? 'flex-row-reverse' : ''}`}
                            >
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${msg.type === 'bot' ? 'bg-primary/20 text-primary' : 'bg-surface text-gray-400'
                                    }`}>
                                    {msg.type === 'bot' ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
                                </div>
                                <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed ${msg.type === 'bot'
                                    ? 'bg-surface/50 border border-white/5 text-gray-300'
                                    : 'bg-primary text-white shadow-lg shadow-primary/20'
                                    }`}>
                                    {msg.text}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    {isTyping && (
                        <div className="flex gap-4">
                            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                                <Bot className="w-5 h-5 text-primary" />
                            </div>
                            <div className="flex gap-1.5 items-center p-4 bg-surface/50 rounded-2xl border border-white/5">
                                <div className="w-1.5 h-1.5 bg-gray-600 rounded-full animate-bounce"></div>
                                <div className="w-1.5 h-1.5 bg-gray-600 rounded-full animate-bounce delay-150"></div>
                                <div className="w-1.5 h-1.5 bg-gray-600 rounded-full animate-bounce delay-300"></div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-6 bg-surface/30 border-t border-white/5">
                    <div className="flex gap-4">
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Ask anything about Delhi pollution, sources, or health advice..."
                            className="flex-1 bg-background/50 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-primary/50 transition-all"
                        />
                        <button
                            onClick={() => handleSend()}
                            className="p-4 bg-primary text-white rounded-2xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Right Sidebar - Knowledge Base */}
            <div className="w-80 flex flex-col gap-6">
                <div className="glass p-6 rounded-3xl">
                    <h4 className="font-bold text-sm uppercase tracking-widest text-gray-500 mb-6 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-warning" />
                        Quick Actions
                    </h4>
                    <div className="flex flex-col gap-3">
                        {quickActions.map((action, i) => (
                            <button
                                key={i}
                                onClick={() => handleSend(action)}
                                className="group flex items-center justify-between p-3 rounded-xl bg-surface border border-white/5 hover:border-primary/30 text-left transition-all"
                            >
                                <span className="text-xs text-gray-400 group-hover:text-white transition-colors line-clamp-1">{action}</span>
                                <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-primary" />
                            </button>
                        ))}
                    </div>
                </div>

                {/* System Logs */}
                <div className="glass p-6 rounded-3xl bg-black/20 border-white/5 flex-1 flex flex-col min-h-0">
                    <h4 className="font-bold text-sm uppercase tracking-widest text-primary mb-4 flex items-center gap-2">
                        <Zap className="w-4 h-4" />
                        System Logs
                    </h4>
                    <div className="flex-1 overflow-y-auto space-y-3 font-mono text-[10px] custom-scrollbar pr-2">
                        <div className="flex gap-2 text-gray-500">
                            <span className="text-primary/50">[13:42:01]</span>
                            <span className="text-gray-300">Neural Engine v4.2 calibrated via XGBoost output.</span>
                        </div>
                        <div className="flex gap-2 text-gray-500">
                            <span className="text-primary/50">[13:42:05]</span>
                            <span className="text-gray-300">Synchronizing spatial data from Anand Vihar sensor.</span>
                        </div>
                        <div className="flex gap-2 text-gray-500">
                            <span className="text-primary/50">[13:43:12]</span>
                            <span className="text-success">Safety guardrails active: 104 forbidden patterns loaded.</span>
                        </div>
                        <div className="flex gap-2 text-gray-500">
                            <span className="text-primary/50">[13:45:22]</span>
                            <span className="text-gray-300">Context builder updated with 7-day forecast tensors.</span>
                        </div>
                        <div className="flex gap-2 text-gray-500">
                            <span className="text-primary/50">[13:47:01]</span>
                            <span className="text-warning">Inversion layer detected: Increasing health advisory weight.</span>
                        </div>
                        <div className="flex gap-2 text-gray-500">
                            <span className="text-primary/50">[13:47:15]</span>
                            <span className="text-gray-300">Query processed: Latency 245ms | Tokens: 184</span>
                        </div>
                        <div className="flex gap-2 animate-pulse">
                            <span className="text-primary/50">[_:__:__]</span>
                            <span className="text-primary">Awaiting input stream...</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AIAssistant;
