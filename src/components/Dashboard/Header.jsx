import React from 'react';
import { Search, Calendar, CloudRain, Wind, Thermometer } from 'lucide-react';

const Header = ({ title }) => {
    const currentStatus = "Poor"; // Dynamic
    const statusColor = "bg-danger"; // Dynamic

    return (
        <header className="sticky top-0 md:top-6 z-40 mx-0 md:mx-6 mb-4 md:mb-6 rounded-none md:rounded-[32px] px-4 md:px-6 h-16 md:h-20 bg-[#18181b]/90 backdrop-blur-md border-b md:border border-white/5 shadow-2xl flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-white/5 border border-white/5 rounded-xl md:rounded-2xl">
                    <span className="hidden sm:inline text-xs md:text-sm font-medium text-zinc-400">Monitor</span>
                    <span className="hidden sm:inline text-zinc-600">/</span>
                    <span className="text-xs md:text-sm font-semibold text-white truncate max-w-[120px] sm:max-w-none">{title}</span>
                </div>
            </div>

            <div className="flex items-center gap-6">
                {/* Weather Quick View (Compact) */}
                <div className="hidden lg:flex items-center gap-6 bg-white/5 px-6 py-2 rounded-2xl border border-white/5">
                    <div className="flex items-center gap-2 text-zinc-400">
                        <Thermometer className="w-4 h-4" />
                        <span className="text-xs font-mono">14°C</span>
                    </div>
                    <div className="flex items-center gap-2 text-zinc-400">
                        <Wind className="w-4 h-4" />
                        <span className="text-xs font-mono">8.4 km/h</span>
                    </div>
                    <div className="flex items-center gap-2 text-zinc-400">
                        <CloudRain className="w-4 h-4" />
                        <span className="text-xs font-mono">12%</span>
                    </div>
                </div>

                <div className="flex items-center gap-2 md:gap-3">

                    <div className="hidden lg:flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-colors cursor-pointer group">
                        <Calendar className="w-4 h-4 text-zinc-400 group-hover:text-white transition-colors" />
                        <span className="text-xs font-mono text-zinc-400 group-hover:text-white transition-colors">{new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
