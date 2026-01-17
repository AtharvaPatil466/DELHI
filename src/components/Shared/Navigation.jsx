import React from 'react';
import {
    LayoutDashboard,
    Map as MapIcon,
    Wind,
    TrendingUp,
    ShieldAlert,
    HeartPulse,
    Settings,
    Activity,
    MessageSquare,
    Users
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
    return twMerge(clsx(inputs));
}

const NavItem = ({ icon: Icon, label, active, onClick }) => (
    <button
        onClick={onClick}
        title={label}
        className={cn(
            "p-3 rounded-2xl transition-all duration-300 group relative flex items-center justify-center",
            active
                ? "bg-white/10 text-white shadow-[0_0_20px_rgba(255,255,255,0.1)] scale-110"
                : "text-gray-500 hover:text-white hover:bg-white/5 hover:scale-105"
        )}
    >
        {active && (
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
        )}

        <Icon
            strokeWidth={2}
            className={cn(
                "w-6 h-6 transition-all",
                active ? "text-white" : "group-hover:text-white"
            )}
        />

        {/* Tooltip */}
        <span className="absolute left-14 bg-surface border border-white/10 px-2 py-1 rounded-lg text-[10px] font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
            {label}
        </span>
    </button>
);

const Sidebar = ({ activeTab, setActiveTab }) => {
    const menuItems = [
        { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { id: 'forecast', icon: TrendingUp, label: 'AQI Forecast' },
        { id: 'sources', icon: Wind, label: 'Source Analysis' },
        { id: 'heatmap', icon: MapIcon, label: 'Pollution Map' },
        { id: 'policy', icon: ShieldAlert, label: 'Policy Sim' },
        { id: 'health', icon: HeartPulse, label: 'Health Advisory' },
        { id: 'community', icon: Users, label: 'Community' },
        { id: 'chat', icon: MessageSquare, label: 'System Logs' },
    ];

    return (
        <aside className="fixed bottom-0 left-0 w-full h-20 md:h-screen md:w-20 z-50 flex flex-row md:flex-col items-center py-0 md:py-6 bg-[#18181b] border-t md:border-t-0 md:border-r border-white/5 shadow-2xl px-4 md:px-0">
            {/* Brand Icon - Hidden on mobile */}
            <div className="hidden md:flex w-10 h-10 bg-gradient-to-br from-primary to-indigo-600 rounded-xl items-center justify-center shadow-lg shadow-primary/20 mb-8">
                <Activity className="text-white w-5 h-5" />
            </div>

            {/* Navigation Items */}
            <nav className="flex flex-row md:flex-col gap-1 md:gap-3 w-full justify-around md:justify-start">
                {menuItems.map((item) => (
                    <NavItem
                        key={item.id}
                        {...item}
                        active={activeTab === item.id}
                        onClick={() => setActiveTab(item.id)}
                    />
                ))}
            </nav>

            <div className="hidden md:block flex-1"></div>

            <div className="hidden md:block h-px w-8 bg-white/10 mx-auto my-4"></div>

            {/* Settings & Profile - Adjusted for mobile */}
            <div className="hidden md:flex flex-col gap-4 items-center mb-4 w-full px-3">
                <NavItem
                    icon={Settings}
                    label="Settings"
                    active={activeTab === 'settings'}
                    onClick={() => setActiveTab('settings')}
                />
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white shadow-lg cursor-pointer hover:scale-105 transition-transform">
                    JD
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
