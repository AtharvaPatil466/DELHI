import React, { useState, useMemo } from 'react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    LineChart, Line, Legend
} from 'recharts';
import { getCurrentAQI, AREAS, getHistoricalMonthlyData } from '../../utils/dataGenerator';
import { predictAQI, generateForecastInsights, getAccuracyMetrics } from '../../utils/forecastModel';
import {
    Calendar, Clock, Info, TrendingUp, TrendingDown,
    MapPin, CheckCircle, BarChart3, History
} from 'lucide-react';
import ForecastReasoningPanel from '../Forecasting/ForecastReasoningPanel';
import FeatureAttributionChart from '../Forecasting/FeatureAttributionChart';
import PredictionValidation from '../Forecasting/PredictionValidation';
import RevisionTimeline from '../Forecasting/RevisionTimeline';
import ScenarioComparison from '../Forecasting/ScenarioComparison';
import ModelPerformanceDashboard from '../Forecasting/ModelPerformanceDashboard';
import { SAMPLE_FORECAST_REASONING, VALIDATION_HISTORY, REVISION_HISTORY, SCENARIO_DATA, MODEL_PERFORMANCE_DATA } from '../../data/forecastExplanations';

const AQIForecast = () => {
    const [selectedAreaId, setSelectedAreaId] = useState(AREAS[0].id);
    const [forecastDays, setForecastDays] = useState(24); // 24h or 72h
    const [viewMode, setViewMode] = useState('forecast'); // forecast, historical, validation
    const [showTimeline, setShowTimeline] = useState(false);

    const forecastData = useMemo(() => predictAQI(selectedAreaId, forecastDays), [selectedAreaId, forecastDays]);
    const historicalData = useMemo(() => getHistoricalMonthlyData(selectedAreaId), [selectedAreaId]);
    const insights = useMemo(() => generateForecastInsights(forecastData), [forecastData]);
    const metrics = getAccuracyMetrics();
    const selectedArea = AREAS.find(a => a.id === selectedAreaId);

    return (
        <div className="p-4 md:p-8 bg-background min-h-[calc(100vh-80px)]">
            <RevisionTimeline
                show={showTimeline}
                onClose={() => setShowTimeline(false)}
                data={REVISION_HISTORY}
            />
            {/* Header controls usage same as before */}
            {/* Header controls */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
                <div>
                    <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2 md:gap-3">
                        <BarChart3 className="text-primary w-6 h-6 md:w-7 md:h-7" />
                        AQI Forecasting Engine
                    </h2>
                    <p className="text-gray-500 text-xs md:text-sm mt-1">Multi-temporal predictive modeling for {selectedArea.name}</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                    <div className="flex bg-surface p-1 rounded-xl border border-white/5 overflow-x-auto no-scrollbar">
                        <button
                            onClick={() => setViewMode('forecast')}
                            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${viewMode === 'forecast' ? 'bg-primary text-white shadow-lg' : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            <Clock className="w-3.5 h-3.5" />
                            Short-term Forecast
                        </button>
                        <button
                            onClick={() => setViewMode('historical')}
                            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${viewMode === 'historical' ? 'bg-primary text-white shadow-lg' : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            <History className="w-3.5 h-3.5" />
                            12-Month Trends
                        </button>
                        <button
                            onClick={() => setViewMode('validation')}
                            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${viewMode === 'validation' ? 'bg-primary text-white shadow-lg' : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            <CheckCircle className="w-3.5 h-3.5" />
                            Model Reliability
                        </button>
                        <button
                            onClick={() => setViewMode('scenarios')}
                            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${viewMode === 'scenarios' ? 'bg-primary text-white shadow-lg' : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            <TrendingUp className="w-3.5 h-3.5" />
                            Scenario Planner
                        </button>
                        <button
                            onClick={() => setViewMode('performance')}
                            className={`px-3 md:px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${viewMode === 'performance' ? 'bg-primary text-white shadow-lg' : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            <BarChart3 className="w-3.5 h-3.5" />
                            Model Dashboard
                        </button>
                    </div>

                    <select
                        value={selectedAreaId}
                        onChange={(e) => setSelectedAreaId(e.target.value)}
                        className="bg-surface border border-white/5 rounded-xl px-4 py-2.5 md:py-2 text-xs font-bold text-gray-300 outline-none w-full sm:w-auto"
                    >
                        {AREAS.map(area => <option key={area.id} value={area.id}>{area.name}</option>)}
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                {/* Main Chart Column */}
                <div className="xl:col-span-8 flex flex-col gap-8">
                    {viewMode === 'performance' ? (
                        <div className="min-h-[600px]">
                            <ModelPerformanceDashboard data={MODEL_PERFORMANCE_DATA} />
                        </div>
                    ) : viewMode === 'scenarios' ? (
                        <div className="min-h-[600px]">
                            <ScenarioComparison data={SCENARIO_DATA} />
                        </div>
                    ) : viewMode === 'validation' ? (
                        <div className="min-h-[600px]">
                            <PredictionValidation
                                history={VALIDATION_HISTORY.history}
                                metrics={VALIDATION_HISTORY.metrics}
                            />
                        </div>
                    ) : (
                        <>
                            <div className="glass p-4 md:p-8 rounded-2xl md:rounded-[32px] min-h-[400px] md:min-h-[450px]">
                                <div className="flex justify-between items-center mb-6 md:mb-8">
                                    <h3 className="font-bold text-base md:text-lg flex items-center gap-2">
                                        {viewMode === 'forecast' ? <Calendar className="w-4 h-4 md:w-5 md:h-5 text-primary" /> : <History className="w-4 h-4 md:w-5 md:h-5 text-primary" />}
                                        {viewMode === 'forecast'
                                            ? `AQI Prediction (${forecastDays > 72 ? '7-Day' : forecastDays + 'h'} Window)`
                                            : 'Annual Pollution Cycle'}
                                    </h3>
                                    {viewMode === 'forecast' && (
                                        <div className="flex bg-background rounded-lg p-1 border border-white/5">
                                            <button onClick={() => setForecastDays(24)} className={`px-2 md:px-3 py-1 text-[10px] font-bold rounded-md transition-all ${forecastDays === 24 ? 'bg-surface text-white' : 'text-gray-500'}`}>24H</button>
                                            <button onClick={() => setForecastDays(72)} className={`px-2 md:px-3 py-1 text-[10px] font-bold rounded-md transition-all ${forecastDays === 72 ? 'bg-surface text-white' : 'text-gray-500'}`}>72H</button>
                                            <button onClick={() => setForecastDays(168)} className={`px-2 md:px-3 py-1 text-[10px] font-bold rounded-md transition-all ${forecastDays === 168 ? 'bg-surface text-white' : 'text-gray-500'}`}>7D (ML)</button>
                                        </div>
                                    )}
                                </div>

                                <div className="h-[280px] md:h-[320px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        {viewMode === 'forecast' ? (
                                            <AreaChart
                                                data={forecastData}
                                                onClick={() => setShowTimeline(true)}
                                                className="cursor-pointer"
                                            >
                                                <defs>
                                                    <linearGradient id="colorAqi" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                                                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff03" vertical={false} />
                                                <XAxis dataKey="time" stroke="#666" fontSize={10} tickLine={false} axisLine={false} />
                                                <YAxis stroke="#666" fontSize={10} tickLine={false} axisLine={false} domain={[0, 'dataMax + 50']} />
                                                <Tooltip
                                                    contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '12px', fontSize: '12px' }}
                                                    itemStyle={{ color: '#white' }}
                                                />
                                                <Area
                                                    type="monotone"
                                                    dataKey="aqi"
                                                    stroke="#3B82F6"
                                                    strokeWidth={3}
                                                    fillOpacity={1}
                                                    fill="url(#colorAqi)"
                                                />
                                                <Area
                                                    type="monotone"
                                                    dataKey="upper"
                                                    stroke="transparent"
                                                    fill="#3B82F6"
                                                    fillOpacity={0.05}
                                                />
                                                <Area
                                                    type="monotone"
                                                    dataKey="lower"
                                                    stroke="transparent"
                                                    fill="#3B82F6"
                                                    fillOpacity={0.05}
                                                />
                                            </AreaChart>
                                        ) : (
                                            <LineChart data={historicalData}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff03" vertical={false} />
                                                <XAxis dataKey="name" stroke="#666" fontSize={10} tickLine={false} axisLine={false} />
                                                <YAxis stroke="#666" fontSize={10} tickLine={false} axisLine={false} />
                                                <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '12px' }} />
                                                <Line type="monotone" dataKey="aqi" stroke="#3B82F6" strokeWidth={3} dot={{ fill: '#3B82F6', r: 4 }} activeDot={{ r: 6 }} />
                                            </LineChart>
                                        )}
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Model Metrics */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                                {metrics.map((m, i) => (
                                    <div key={i} className="glass p-4 md:p-5 rounded-2xl md:rounded-3xl border-white/5">
                                        <p className="text-[8px] md:text-[10px] text-zinc-500 font-bold uppercase mb-1">{m.label}</p>
                                        <div className="flex items-baseline gap-1 md:gap-2">
                                            <span className="text-lg md:text-xl font-black text-white font-mono">{m.value}</span>
                                            <span className="text-[8px] md:text-[9px] text-primary font-bold">{m.unit}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}


                    {/* Feature Attribution Chart */}
                    <div className="glass p-4 md:p-8 rounded-2xl md:rounded-[32px] min-h-[400px] md:min-h-[500px] border-white/5 bg-gradient-to-b from-transparent to-black/30">
                        <FeatureAttributionChart
                            data={SAMPLE_FORECAST_REASONING.factors}
                            netChange={SAMPLE_FORECAST_REASONING.change}
                        />
                    </div>
                </div>

                {/* Sidebar Insights - REPLACED WITH EXPLAINABLE AI PANEL */}
                <div className="xl:col-span-4 flex flex-col gap-8">
                    <ForecastReasoningPanel
                        targetTime="Tomorrow 9:00 AM"
                        currentAQI={forecastData[0]?.aqi || 0}
                        predictedAQI={forecastData[24]?.aqi || forecastData[forecastData.length - 1]?.aqi || 0}
                        factors={SAMPLE_FORECAST_REASONING.factors}
                        confidence={SAMPLE_FORECAST_REASONING.confidence}
                    />
                </div>
            </div>
        </div >
    );
};

export default AQIForecast;
