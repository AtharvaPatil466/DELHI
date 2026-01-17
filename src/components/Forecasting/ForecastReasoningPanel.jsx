import React from 'react';
import PropTypes from 'prop-types';
import { TrendingUp, TrendingDown, Info, HelpCircle } from 'lucide-react';

const ForecastReasoningPanel = ({
    targetTime = "Tomorrow 9:00 AM",
    currentAQI = 352,
    predictedAQI = 387,
    factors = [],
    confidence = { overall: 84, weather: 92, traffic: 88, historical: 73 }
}) => {
    const change = predictedAQI - currentAQI;
    const positiveFactors = factors.filter(f => f.contribution > 0);
    const negativeFactors = factors.filter(f => f.contribution < 0);
    const totalRaw = factors.reduce((sum, f) => sum + f.contribution, 0);

    return (
        <div className="forecast-reasoning bg-gray-900/50 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold flex items-center gap-2 text-white">
                    <Info className="text-primary" size={24} />
                    Forecast Reasoning
                </h3>
                <button className="text-gray-400 hover:text-white transition-colors">
                    <HelpCircle size={20} />
                </button>
            </div>

            {/* Prediction Summary */}
            <div className="prediction-summary mb-6 p-5 bg-gradient-to-r from-indigo-900/50 to-purple-900/50 rounded-2xl border border-indigo-500/30">
                <div className="text-xs font-bold text-indigo-300 uppercase tracking-widest mb-2">Prediction for {targetTime}</div>
                <div className="flex items-end justify-between mb-3">
                    <div className="text-6xl font-black text-white">{predictedAQI}</div>
                    <div className="text-xl font-bold text-gray-400 mb-2">AQI</div>
                </div>
                <div className="flex items-center gap-2 text-lg">
                    {change > 0 ? (
                        <>
                            <TrendingUp className="text-red-400 w-6 h-6" />
                            <span className="text-red-400 font-bold">+{change} points from current</span>
                        </>
                    ) : change < 0 ? (
                        <>
                            <TrendingDown className="text-green-400 w-6 h-6" />
                            <span className="text-green-400 font-bold">{change} points from current</span>
                        </>
                    ) : (
                        <span className="text-gray-400 font-bold">No change expected</span>
                    )}
                </div>
                <div className="text-xs text-gray-400 mt-2 font-mono">Current AQI: {currentAQI}</div>
            </div>

            {/* Primary Drivers */}
            {positiveFactors.length > 0 && (
                <div className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="h-1 w-8 bg-orange-500 rounded"></div>
                        <h4 className="font-bold text-orange-400 uppercase text-xs tracking-widest">
                            Primary Drivers
                        </h4>
                    </div>
                    <div className="space-y-3">
                        {positiveFactors.map(factor => (
                            <FactorCard key={factor.id} factor={factor} type="positive" />
                        ))}
                    </div>
                </div>
            )}

            {/* Offsetting Factors */}
            {negativeFactors.length > 0 && (
                <div className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="h-1 w-8 bg-green-500 rounded"></div>
                        <h4 className="font-bold text-green-400 uppercase text-xs tracking-widest">
                            Offsetting Factors
                        </h4>
                    </div>
                    <div className="space-y-3">
                        {negativeFactors.map(factor => (
                            <FactorCard key={factor.id} factor={factor} type="negative" />
                        ))}
                    </div>
                </div>
            )}

            {/* Net Calculation */}
            <div className="net-calc p-4 bg-black/40 rounded-xl mb-6 border border-white/5">
                <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Mathematical Breakdown</div>
                <div className="font-mono text-base mb-1 flex flex-wrap items-center gap-1">
                    {factors.map((f, i) => (
                        <React.Fragment key={f.id}>
                            {i > 0 && (
                                <span className="text-gray-500">
                                    {f.contribution > 0 ? ' + ' : ' '}
                                </span>
                            )}
                            <span className={f.contribution > 0 ? 'text-orange-400' : f.contribution < 0 ? 'text-green-400' : 'text-gray-400'}>
                                {f.contribution}
                            </span>
                        </React.Fragment>
                    ))}
                    <span className="text-gray-500 mx-1">=</span>
                    <span className="font-bold text-primary">{totalRaw}</span>
                </div>
                <div className="text-[10px] text-gray-500">
                    Raw total: {totalRaw} → Adjusted: {change} (confidence weighting & normalization applied)
                </div>
            </div>

            {/* Confidence Breakdown */}
            <div className="space-y-4 pt-4 border-t border-white/10">
                <h4 className="font-bold text-gray-400 uppercase text-xs tracking-widest mb-4">Confidence Breakdown</h4>
                <ConfidenceBar
                    label="Weather Forecast Reliability"
                    value={confidence.weather}
                    color="blue"
                />
                <ConfidenceBar
                    label="Traffic Pattern Certainty"
                    value={confidence.traffic}
                    color="purple"
                />
                <ConfidenceBar
                    label="Historical Match Quality"
                    value={confidence.historical}
                    color="indigo"
                />
            </div>
        </div>
    );
};

const FactorCard = ({ factor, type }) => {
    const bgColor = type === 'positive'
        ? 'bg-orange-900/10 border-orange-500/20 hover:bg-orange-900/20'
        : 'bg-green-900/10 border-green-500/20 hover:bg-green-900/20';
    const textColor = type === 'positive' ? 'text-orange-400' : 'text-green-400';

    return (
        <div className={`p-4 rounded-xl border transition-all duration-300 ${bgColor}`}>
            <div className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">{factor.icon}</span>
                <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1 gap-2">
                        <span className="font-bold text-white text-sm">{factor.title}</span>
                        <div className="flex flex-col items-end flex-shrink-0">
                            <span className={`text-lg font-black ${textColor}`}>
                                {factor.contribution > 0 ? '+' : ''}{factor.contribution}
                            </span>
                        </div>
                    </div>
                    <p className="text-xs text-gray-400 leading-relaxed mb-2 font-medium">
                        {factor.explanation}
                    </p>
                    <div className="flex items-center justify-between text-[10px] uppercase font-bold tracking-wider">
                        <span className="text-gray-600">
                            Impact: {Math.abs(factor.percentage)}%
                        </span>
                        {factor.confidence && (
                            <span className="text-gray-600">
                                Confidence: {factor.confidence}%
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const ConfidenceBar = ({ label, value, color = 'blue' }) => {
    const colorClasses = {
        blue: 'bg-blue-500',
        purple: 'bg-purple-500',
        indigo: 'bg-indigo-500'
    };

    return (
        <div>
            <div className="flex justify-between text-xs font-bold mb-1.5">
                <span className="text-gray-400 uppercase tracking-wider">{label}</span>
                <span className="text-white">{value}%</span>
            </div>
            <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                <div
                    className={`h-full ${colorClasses[color]} transition-all duration-500 ease-out rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]`}
                    style={{ width: `${value}%` }}
                />
            </div>
        </div>
    );
};

ForecastReasoningPanel.propTypes = {
    targetTime: PropTypes.string,
    currentAQI: PropTypes.number,
    predictedAQI: PropTypes.number,
    factors: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number.isRequired,
        type: PropTypes.oneOf(['positive', 'negative']).isRequired,
        icon: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        contribution: PropTypes.number.isRequired,
        percentage: PropTypes.number.isRequired,
        explanation: PropTypes.string.isRequired,
        confidence: PropTypes.number
    })),
    confidence: PropTypes.shape({
        overall: PropTypes.number.isRequired,
        weather: PropTypes.number.isRequired,
        traffic: PropTypes.number.isRequired,
        historical: PropTypes.number.isRequired
    })
};

export default ForecastReasoningPanel;
