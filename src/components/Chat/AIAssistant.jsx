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
        setIsTyping(true);

        // Mock AI logic based on prompt examples
        setTimeout(() => {
            let response = "I'm analyzing the current spatial data across 10 NCR stations. ";

            if (text.toLowerCase().includes('run') || text.toLowerCase().includes('safe')) {
                response = "Based on current AQI of 285 in Connaught Place, outdoor running is not recommended. For your health profile (assuming age 32, no conditions), safe AQI for running is below 150. Consider waiting until 8 PM when AQI is projected to drop to ~240.";
            } else if (text.toLowerCase().includes('source') || text.toLowerCase().includes('why')) {
                response = "Current levels are high due to 3 factors: 1) Low wind speeds (2.1 km/h) preventing dispersion, 2) Evening rush hour traffic contributing 62% of PM2.5, and 3) Seasonal winter inversion trapping ground-level emissions.";
            } else if (text.toLowerCase().includes('policy') || text.toLowerCase().includes('odd-even')) {
                response = "Implementing the Odd-Even scheme currently would reduce vehicular emissions by ~40%, resulting in a total AQI drop of 60-80 points. This could prevent approx 400 premature deaths annually if sustained during the winter months.";
            } else {
                response = "I've processed your query using the Delhi NCR Pollution platform's ML datasets. The current city-wide average is 298 (Unhealthy). Dwarka remains the cleanest sector today at AQI 245. Would you like to see the 72-hour forecast or safe route recommendations?";
            }

            setMessages(prev => [...prev, { id: Date.now() + 1, type: 'bot', text: response }]);
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
                            <h3 className="font-bold">Claude Intelligence</h3>
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

                <div className="glass p-6 rounded-3xl bg-gradient-to-br from-indigo-500/5 to-transparent border-indigo-500/10">
                    <h4 className="font-bold text-sm uppercase tracking-widest text-indigo-400 mb-4 flex items-center gap-2">
                        <Info className="w-4 h-4" />
                        System Context
                    </h4>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center text-xs">
                            <span className="text-gray-500 font-medium">Model Access</span>
                            <span className="text-white font-bold">L-87 Alpha</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                            <span className="text-gray-500 font-medium">Data Refresh</span>
                            <span className="text-white font-bold">Real-time</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                            <span className="text-gray-500 font-medium">Memory Mode</span>
                            <span className="text-white font-bold">Session Only</span>
                        </div>
                    </div>
                    <div className="mt-6 p-4 bg-white/5 rounded-2xl border border-white/5">
                        <div className="flex items-center gap-2 mb-2">
                            <Zap className="w-3.5 h-3.5 text-warning" />
                            <span className="text-[10px] font-black text-warning uppercase">Optimization</span>
                        </div>
                        <p className="text-[10px] text-gray-500 leading-relaxed italic">
                            Assistant is currently favoring preventive health advice as AQI in 4 districts is above the 300 alert threshold.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AIAssistant;
