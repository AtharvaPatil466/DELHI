import React from 'react';
import PropTypes from 'prop-types';
import { ArrowRight, TrendingDown, TrendingUp, Info, BarChart } from 'lucide-react';

const ScenarioComparison = ({ data }) => {
    if (!data) return null;

    return (
        <div className="space-y-6">
            {/* Base Forecast Card */}
            <div className="glass p-6 rounded-3xl border-white/10 bg-gradient-to-r from-blue-900/20 to-purple-900/20">
                <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">Base Forecast Baseline</h3>
                <div className="flex items-end gap-4">
                    <span className="text-5xl font-black text-white">{data.baseForecast.aqi}</span>
                    <span className="text-lg font-bold text-gray-400 mb-2">AQI</span>
                    <span className="text-sm text-gray-500 mb-2 ml-auto font-mono">
                        {data.baseForecast.time} • {data.baseForecast.description}
                    </span>
                </div>
            </div>

            {/* Scenarios Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.scenarios.map((scenario) => (
                    <div
                        key={scenario.id}
                        className="group relative bg-gray-900/40 border border-white/5 rounded-2xl p-6 hover:bg-white/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-white/10"
                    >
                        {/* Probability Badge */}
                        {scenario.probability && (
                            <div className="absolute top-4 right-4 text-[10px] font-bold px-2 py-1 rounded-full bg-white/5 text-gray-400 border border-white/5">
                                {scenario.probability}% Prob.
                            </div>
                        )}

                        <div className="mb-4">
                            <div className="text-3xl mb-3">{scenario.icon}</div>
                            <h4 className="font-bold text-white text-lg">{scenario.name}</h4>
                            <div className="text-xs text-gray-500 font-bold uppercase tracking-wider">{scenario.likelihood} Likelihood</div>
                        </div>

                        <div className="flex items-center gap-3 mb-4 p-3 bg-black/20 rounded-xl border border-white/5">
                            <div className="text-2xl font-black text-white">{scenario.adjustedAQI}</div>
                            <ArrowRight className="text-gray-600 w-4 h-4" />
                            <div className={`flex items-center gap-1 text-sm font-bold ${scenario.impact > 0 ? 'text-red-400' : 'text-green-400'}`}>
                                {scenario.impact > 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                                <span>{scenario.impact > 0 ? '+' : ''}{scenario.impact} ({scenario.impactPercent}%)</span>
                            </div>
                        </div>

                        <p className="text-xs text-gray-400 leading-relaxed border-t border-white/5 pt-4">
                            {scenario.explanation}
                        </p>

                        {/* Condition Tag */}
                        <div className="mt-3 flex gap-2">
                            {Object.entries(scenario.conditions).map(([key, val]) => (
                                <span key={key} className="text-[10px] font-mono bg-white/5 px-2 py-1 rounded text-gray-500">
                                    {key}: {val}
                                </span>
                            ))}
                        </div>
                    </div>
                ))}

                {/* Custom Scenario Placeholder */}
                <div className="border border-dashed border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center text-center gap-4 hover:bg-white/5 transition-colors cursor-pointer group">
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <BarChart className="text-gray-500 group-hover:text-primary w-6 h-6" />
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-300">Run Custom Simulation</h4>
                        <p className="text-xs text-gray-500 mt-1">Adjust parameters manually</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

ScenarioComparison.propTypes = {
    data: PropTypes.object
};

export default ScenarioComparison;
