import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, ReferenceLine } from 'recharts';
import { BarChart2, Activity, Shield, Brain, Microscope, TrendingUp, Target, Home, TrendingDown, CheckCircle as CheckCircleIcon, Radar, HelpCircle, Flame, Loader2 } from 'lucide-react';
import { calculateSources, getCurrentAQI, AREAS } from '../../utils/dataGenerator';
import { generateSourceExplanation, generateRecommendations, getAreaMetadata } from '../../utils/sourceInsights';
import { fetchFireDataFeed } from '../../utils/satelliteData';
const FireScatterPlot = React.lazy(() => import('./FireScatterPlot'));
const FireClusterAnalysis = React.lazy(() => import('./FireClusterAnalysis'));
import FireIntelligenceCenter from './FireIntelligenceCenter';
import DrillDownModal from './DrillDownModal';
import { Suspense } from 'react';

const SourceAnalysis = () => {
    const [selectedArea, setSelectedArea] = useState('anand-vihar');
    const [currentHour, setCurrentHour] = useState(new Date().getHours());
    const [modalData, setModalData] = useState({ isOpen: false, type: null, color: null });
    const [activeSource, setActiveSource] = useState(null); // For legend filtering
    const [actionView, setActionView] = useState('authorities'); // 'authorities' or 'citizens'
    const [fireFeed, setFireFeed] = useState({ allFires: [], impactfulFires: [], clusters: [], attribution: {}, metadata: {} });
    const [mapView, setMapView] = useState({ center: [31.0, 75.5], zoom: 7 });

    const handleClusterZoom = (coords) => {
        setMapView({ center: coords, zoom: 10 });
    };

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadSatelliteData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const feed = await fetchFireDataFeed();
            setFireFeed(feed);
        } catch (err) {
            setError("Satellite data inaccessible");
        } finally {
            setIsLoading(false);
        }
    };

    // Load specialized feed
    React.useEffect(() => {
        loadSatelliteData();
    }, []);

    // Generate 24h Data
    const generateHourlyData = () => {
        const data = [];
        for (let i = 6; i <= 23; i += 3) { // 3-hour intervals
            const sources = calculateSources(selectedArea, i, new Date().getMonth());
            data.push({
                time: `${i.toString().padStart(2, '0')}:00`,
                hour: i,
                ...sources.reduce((acc, curr) => ({ ...acc, [curr.name]: curr.value }), {})
            });
        }
        return data;
    };

    const hourlyData = useMemo(() => generateHourlyData(), [selectedArea]);
    const currentSources = useMemo(() => calculateSources(selectedArea, currentHour, new Date().getMonth()), [selectedArea, currentHour]);

    // AI & Meta Data
    const areaMeta = getAreaMetadata(selectedArea);
    const explanation = useMemo(() => generateSourceExplanation(selectedArea, currentSources, {}, currentHour), [selectedArea, currentSources, currentHour]);
    const recommendations = useMemo(() => generateRecommendations(currentSources, selectedArea, getCurrentAQI(selectedArea)), [currentSources, selectedArea]);

    // New Muted/Scientific Palette
    const COLORS = {
        'Vehicular': '#3b82f6',   // Blue-500
        'Industrial': '#64748b',  // Slate-500
        'Construction': '#f59e0b', // Amber-500
        'Stubble': '#d97706',     // Amber-600
        'Other': '#10b981'        // Emerald-500
    };

    const handlePieClick = (data) => {
        setModalData({
            isOpen: true,
            type: data.name,
            color: COLORS[data.name]
        });
    };

    return (
        <div className="p-4 md:p-8 min-h-screen text-text pb-24 md:pb-20 fade-in space-y-6 md:space-y-8">
            {/* Header Section */}
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
                <div>
                    <h2 className="text-lg md:text-xl font-bold flex items-center gap-2 md:gap-3">
                        <Brain className="w-4.5 h-4.5 md:w-5 md:h-5 text-primary" />
                        POLLUTION SOURCE INTELLIGENCE
                    </h2>
                    <p className="text-muted text-xs md:text-sm mt-1">Real-time attribution modeling & AI-driven mitigation strategies</p>
                </div>

                {/* Area Selector Tabs (Segmented Control) */}
                <div className="flex bg-surface p-1 rounded-lg border border-border overflow-x-auto w-full xl:w-auto no-scrollbar">
                    {AREAS.slice(0, 5).map(area => (
                        <button
                            key={area.id}
                            onClick={() => setSelectedArea(area.id)}
                            className={`px-3 py-1.5 rounded-md text-[10px] md:text-xs font-medium transition-all whitespace-nowrap ${selectedArea === area.id
                                ? 'bg-background text-white shadow-sm border border-border'
                                : 'text-muted hover:text-white hover:bg-white/5'
                                }`}
                        >
                            {area.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* BENTO GRID LAYOUT */}
            <div className="grid grid-cols-12 gap-6">

                {/* 1. Real-time Attribution (Donut) - Col Span 4 */}
                <div className="col-span-12 lg:col-span-4 bg-surface/40 border border-border rounded-xl p-4 md:p-6 backdrop-blur-sm relative group hover:border-border/80 transition-colors">
                    <div className="flex justify-between items-center mb-4 md:mb-6">
                        <h3 className="text-[10px] md:text-xs font-bold text-muted uppercase tracking-wider flex items-center gap-2">
                            <Activity className="w-3 md:w-3.5 h-3 md:h-3.5 text-primary" />
                            Real-time Attribution
                        </h3>
                        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-success/10 border border-success/20 rounded text-[9px] md:text-[10px] font-mono text-success">
                            93% CONF
                        </div>
                    </div>

                    {/* AI Insight Box (Requested Feature) */}
                    <div className="mb-4 p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-lg flex items-start gap-2.5 md:gap-3">
                        <div className="p-1.5 bg-indigo-500/20 rounded-md shrink-0">
                            {isLoading ? (
                                <Loader2 className="w-3 md:w-3.5 h-3 md:h-3.5 text-indigo-400 animate-spin" />
                            ) : (
                                <Brain className="w-3 md:w-3.5 h-3 md:h-3.5 text-indigo-400" />
                            )}
                        </div>
                        <div>
                            {isLoading ? (
                                <div className="space-y-2">
                                    <div className="h-2 w-24 bg-indigo-500/20 rounded animate-pulse"></div>
                                    <div className="h-3 w-48 bg-indigo-500/10 rounded animate-pulse"></div>
                                </div>
                            ) : error ? (
                                <p className="text-[10px] md:text-[11px] text-red-400 leading-relaxed font-medium">
                                    NASA satellite connection lost. Viewing historical source models.
                                </p>
                            ) : (
                                <p className="text-[10px] md:text-[11px] text-indigo-200 leading-relaxed font-medium">
                                    <span className="text-indigo-400 font-bold uppercase text-[9px] md:text-[10px] tracking-wider block mb-0.5 text-glow-indigo">
                                        AI Insight {currentSources.find(s => s.name === 'Stubble')?.isSatelliteVerified && '• SATELLITE VERIFIED'}
                                    </span>
                                    {currentSources.find(s => s.name === 'Stubble')?.value > 20
                                        ? "Stubble burning detected in Punjab/Haryana. High impact score on local PM2.5."
                                        : "Atmospheric stagnation and local emission accumulation are the primary drivers."}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center justify-center h-56 md:h-64 relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={currentSources}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70} // Thinner stroke
                                    outerRadius={85}
                                    paddingAngle={2}
                                    dataKey="value"
                                    onClick={handlePieClick}
                                    cursor="pointer"
                                    stroke="none"
                                >
                                    {currentSources.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={COLORS[entry.name]}
                                            opacity={0.9}
                                            className={entry.name === 'Stubble' && entry.isSatelliteVerified ? 'animate-pulse' : ''}
                                            stroke={entry.name === 'Stubble' && entry.isSatelliteVerified ? '#ef4444' : 'none'}
                                            strokeWidth={entry.name === 'Stubble' && entry.isSatelliteVerified ? 2 : 0}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '6px', fontSize: '12px' }} />
                            </PieChart>
                        </ResponsiveContainer>

                        {/* Satellite-Verified Overlay Badge (NEW) */}
                        {currentSources.find(s => s.name === 'Stubble')?.isSatelliteVerified && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="absolute top-[15%] right-[15%] px-2 py-1 bg-red-500/20 border border-red-500/40 rounded-full flex items-center gap-1.5 backdrop-blur-md z-10 shadow-[0_0_15px_rgba(239,68,68,0.3)]"
                            >
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                                </span>
                                <span className="text-[8px] font-black text-white uppercase tracking-tighter">Satellite Verified</span>
                            </motion.div>
                        )}

                        {/* Center Label (Scientific Look) */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-2xl md:text-4xl font-mono font-bold text-white tracking-tighter">{getCurrentAQI(selectedArea)}</span>
                            <span className="text-[8px] md:text-[10px] text-muted uppercase tracking-widest mt-1">Live AQI</span>
                        </div>
                    </div>

                    {/* Source Legend with Fire Metrics (NEW) */}
                    <div className="mt-6 grid grid-cols-2 gap-3 border-t border-white/5 pt-4">
                        {currentSources.map((s, i) => (
                            <div key={i} className={`p-2 rounded-lg bg-white/5 border border-transparent ${s.name === 'Stubble' && s.isSatelliteVerified ? 'border-red-500/20 bg-red-500/5' : ''}`}>
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-[9px] font-bold text-gray-500 uppercase">{s.name}</span>
                                    <span className="text-xs font-black text-white">{s.value}%</span>
                                </div>
                                {s.name === 'Stubble' && s.isSatelliteVerified && (
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-1">
                                            <Flame className="w-2.5 h-2.5 text-red-400" />
                                            <span className="text-[8px] font-bold text-red-200 uppercase">{fireFeed.allFires.length} Fires</span>
                                        </div>
                                        <div className="group relative">
                                            <HelpCircle className="w-2.5 h-2.5 text-gray-600 cursor-help" />
                                            <div className="absolute bottom-full right-0 mb-2 w-48 p-2 bg-black border border-white/10 rounded-lg text-[8px] leading-tight text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none shadow-2xl">
                                                Determined by live NASA MODIS/VIIRS thermal anomalies. Impact calculated via distance-decay and upwind sector analysis.
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* 2. Daily Source Variation (Bar) - Col Span 8 */}
                <div className="col-span-12 lg:col-span-8 bg-surface/40 border border-border rounded-xl p-4 md:p-6 backdrop-blur-sm hover:border-border/80 transition-colors">
                    <div className="flex justify-between items-center mb-4 md:mb-6">
                        <h3 className="text-[10px] md:text-xs font-bold text-muted uppercase tracking-wider flex items-center gap-2">
                            <BarChart2 className="w-3 md:w-3.5 h-3 md:h-3.5 text-primary" />
                            Source Variation (24h)
                        </h3>
                        <span className="text-[8px] md:text-[10px] font-mono text-muted uppercase">Updates hourly</span>
                    </div>
                    <div className="h-56 md:h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={hourlyData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                                <XAxis
                                    dataKey="time"
                                    stroke="#52525b"
                                    fontSize={9}
                                    tickLine={false}
                                    axisLine={false}
                                    tick={{ fontFamily: 'JetBrains Mono' }}
                                />
                                <YAxis
                                    stroke="#52525b"
                                    fontSize={9}
                                    tickLine={false}
                                    axisLine={false}
                                    tick={{ fontFamily: 'JetBrains Mono' }}
                                />
                                <Tooltip
                                    cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                                    contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '6px' }}
                                    itemStyle={{ fontSize: '11px', fontFamily: 'JetBrains Mono' }}
                                />
                                <Legend
                                    iconType="circle"
                                    iconSize={5}
                                    wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }}
                                    onClick={(e) => setActiveSource(activeSource === e.dataKey ? null : e.dataKey)}
                                />
                                {Object.keys(COLORS).map((key) => (
                                    <Bar
                                        key={key}
                                        dataKey={key}
                                        stackId="a"
                                        fill={COLORS[key]}
                                        opacity={activeSource && activeSource !== key ? 0.2 : 1}
                                        barSize={24}
                                    />
                                ))}
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Fire Intelligence Hub (NEW) */}
                <div className="col-span-12">
                    <FireIntelligenceCenter fireFeed={fireFeed} />
                </div>

                {/* 5. Regional Satellite Intelligence (NEW) - Col Span 12 */}
                <div className="col-span-12 bg-surface/40 border border-border rounded-xl p-4 md:p-6 backdrop-blur-sm relative overflow-hidden min-h-[550px]">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-3">
                            <div className="bg-primary/20 p-2 rounded-lg">
                                <Radar className="w-4 h-4 text-primary" />
                            </div>
                            <div>
                                <h3 className="text-xs md:text-sm font-bold text-white uppercase tracking-wider">Regional Satellite Intelligence</h3>
                                <p className="text-[10px] text-muted font-mono uppercase">NASA MODIS Active Fire Detection • 20km Influencer Mesh</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setMapView({ center: [31.0, 75.5], zoom: 7 })}
                                className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-[10px] font-bold text-gray-400 hover:text-white transition-colors uppercase tracking-widest"
                            >
                                Reset View
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-12 gap-6 h-[400px]">
                        {/* Cluster Analysis Sidebar */}
                        <div className="col-span-12 lg:col-span-4 h-full overflow-hidden flex flex-col">
                            <Suspense fallback={<div className="h-full flex items-center justify-center bg-zinc-900/50 rounded-xl border border-white/5"><Loader2 className="w-5 h-5 text-zinc-700 animate-spin" /></div>}>
                                <FireClusterAnalysis
                                    clusters={fireFeed.clusters || []}
                                    onZoom={handleClusterZoom}
                                />
                            </Suspense>
                        </div>

                        {/* Spatial Scatter Map */}
                        <div className="col-span-12 lg:col-span-8 h-full rounded-xl overflow-hidden border border-white/5 shadow-inner">
                            <Suspense fallback={<div className="h-full flex items-center justify-center bg-zinc-900/50 rounded-xl border border-white/5"><div className="flex flex-col items-center gap-2"><Loader2 className="w-6 h-6 text-primary animate-spin" /><p className="text-[8px] font-black text-primary uppercase tracking-[0.2em]">Initializing Spatial View</p></div></div>}>
                                <FireScatterPlot
                                    fires={fireFeed.allFires || []}
                                    center={mapView.center}
                                    zoom={mapView.zoom}
                                />
                            </Suspense>
                        </div>
                    </div>

                    {/* Plot Footer */}
                    <div className="mt-4 flex flex-wrap gap-6 items-center border-t border-white/5 pt-4">
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                            <span className="text-[10px] text-zinc-400 uppercase font-bold tracking-widest">Punjab/Haryana Belt</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-success shadow-[0_0_8px_#22c55e]"></div>
                            <span className="text-[10px] text-zinc-400 uppercase font-bold tracking-widest">NCR Receptor (Delhi)</span>
                        </div>
                        <div className="ml-auto text-[9px] text-zinc-600 font-mono italic">
                            LAST UPDATED: {fireFeed.metadata?.timestamp ? new Date(fireFeed.metadata.timestamp).toLocaleTimeString() : 'N/A'}
                        </div>
                    </div>
                </div>

                {/* 3. AI Insights (The Logic) - Col Span 8 */}
                <div className="col-span-12 lg:col-span-8 bg-surface/40 border border-border rounded-xl p-4 md:p-6 hover:border-border/80 transition-colors relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-6 opacity-[0.02] pointer-events-none">
                        <Brain className="w-48 h-48" />
                    </div>

                    <div className="flex items-center gap-2 mb-4 md:mb-6">
                        <div className="w-1 md:w-1.5 h-1 md:h-1.5 bg-primary rounded-full"></div>
                        <h3 className="text-[10px] md:text-xs font-bold text-muted uppercase tracking-wider">Analysis Engine Output</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                        <div>
                            <div className="text-[10px] md:text-sm text-muted mb-1.5 md:mb-2 text-zinc-500 uppercase font-bold tracking-widest">Primary Driver</div>
                            <div className="text-lg md:text-xl font-bold text-white mb-3 md:mb-4 border-l-2 border-primary pl-4">
                                {explanation.primary.title}
                            </div>
                            <ul className="space-y-1.5 md:space-y-2">
                                {explanation.primary.factors.map((factor, i) => (
                                    <li key={i} className="flex items-start gap-2.5 text-xs md:text-sm text-zinc-400">
                                        <div className="w-1 h-1 bg-primary rounded-full mt-1.5 md:mt-2 shrink-0"></div>
                                        {factor}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <div className="text-[10px] md:text-sm text-muted mb-1.5 md:mb-2 text-zinc-500 uppercase font-bold tracking-widest">Secondary Factors</div>
                            <div className="text-base md:text-lg font-medium text-zinc-300 mb-3 md:mb-4 border-l-2 border-secondary pl-4">
                                {explanation.secondary.title}
                            </div>
                            <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t border-border">
                                <div className="flex flex-wrap gap-2">
                                    {explanation.tertiary.map((item, i) => (
                                        <div key={i} className="px-2 py-1 bg-white/5 border border-border rounded text-[9px] md:text-[10px] font-mono text-zinc-500">
                                            {item.name}: <span className="text-zinc-300">{item.value}%</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 4. Actionable Intelligence - Col Span 4 */}
                <div className="col-span-12 lg:col-span-4 bg-surface/40 border border-border rounded-xl p-4 md:p-6 hover:border-border/80 transition-colors flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-[10px] md:text-xs font-bold text-muted uppercase tracking-wider flex items-center gap-2">
                            <Target className="w-3 md:w-3.5 h-3 md:h-3.5 text-primary" />
                            Response Protocol
                        </h3>
                        <div className="flex bg-background p-0.5 rounded-lg border border-border">
                            <button
                                onClick={() => setActionView('authorities')}
                                className={`px-2 py-1 rounded-md text-[9px] md:text-[10px] font-bold transition-all ${actionView === 'authorities'
                                    ? 'bg-surface text-white border border-border shadow-sm'
                                    : 'text-muted hover:text-gray-300'
                                    }`}
                            >
                                Admin
                            </button>
                            <button
                                onClick={() => setActionView('citizens')}
                                className={`px-2 py-1 rounded-md text-[9px] md:text-[10px] font-bold transition-all ${actionView === 'citizens'
                                    ? 'bg-surface text-white border border-border shadow-sm'
                                    : 'text-muted hover:text-gray-300'
                                    }`}
                            >
                                Public
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 space-y-3 md:space-y-4">
                        {actionView === 'authorities' ? (
                            <div className="space-y-2 md:space-y-3 animate-in fade-in duration-300">
                                {recommendations.authorities.map((rec, i) => (
                                    <div key={i} className="flex gap-3 items-start p-3 bg-white/5 rounded-lg border border-transparent hover:border-border transition-colors">
                                        <span className="font-mono text-[10px] md:text-xs text-muted mt-0.5">0{i + 1}</span>
                                        <p className="text-xs md:text-sm text-zinc-300 leading-snug">{rec}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-2 md:space-y-3 animate-in fade-in duration-300">
                                {recommendations.citizens.map((rec, i) => (
                                    <div key={i} className="flex gap-3 items-center p-3 bg-white/5 rounded-lg border border-transparent hover:border-border transition-colors">
                                        <CheckCircleIcon className="w-3.5 h-3.5 md:w-4 md:h-4 text-success/70" />
                                        <p className="text-xs md:text-sm text-zinc-300 leading-snug">{rec}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>



                {/* Drill Down Modal */}
                <DrillDownModal
                    isOpen={modalData.isOpen}
                    onClose={() => setModalData({ ...modalData, isOpen: false })}
                    sourceType={modalData.type}
                    areaName={AREAS.find(a => a.id === selectedArea)?.name}
                    color={modalData.color}
                />
            </div>
        </div>
    );
};

export default SourceAnalysis;
