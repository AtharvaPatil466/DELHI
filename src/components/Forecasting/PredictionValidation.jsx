import React from 'react';
import PropTypes from 'prop-types';
import { CheckCircle, AlertTriangle, XCircle, TrendingUp, Target, BarChart2 } from 'lucide-react';

const PredictionValidation = ({
    history = [],
    metrics = { mae: 0, within15: 0, within25: 0, directionalAccuracy: 0 }
}) => {
    const [isExpanded, setIsExpanded] = React.useState(false);
    const displayHistory = isExpanded ? history : history.slice(0, 7);

    return (
        <div className="space-y-6">
            {/* Metrics Header */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <MetricCard
                    label="Mean Abs. Error"
                    value={`±${metrics.mae}`}
                    unit="AQI"
                    icon={<Target className="text-primary w-4 h-4" />}
                    color="blue"
                />
                <MetricCard
                    label="Accuracy (±15)"
                    value={`${metrics.within15}%`}
                    unit="of samples"
                    icon={<CheckCircle className="text-success w-4 h-4" />}
                    color="green"
                />
                <MetricCard
                    label="Accuracy (±25)"
                    value={`${metrics.within25}%`}
                    unit="of samples"
                    icon={<CheckCircle className="text-success w-4 h-4" />}
                    color="green"
                />
                <MetricCard
                    label="Directional Accuracy"
                    value={`${metrics.directionalAccuracy}%`}
                    unit="trend correct"
                    icon={<TrendingUp className="text-warning w-4 h-4" />}
                    color="orange"
                />
            </div>

            {/* Validation Table */}
            <div className="bg-gray-900/50 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
                <div className="p-6 border-b border-white/5 flex justify-between items-center">
                    <h3 className="font-bold flex items-center gap-2 text-white">
                        <BarChart2 className="text-primary" size={20} />
                        {isExpanded ? '30-Day Model Audit Log' : '7-Day Validation History'}
                    </h3>
                    <span className="text-xs font-mono text-gray-500 bg-white/5 px-2 py-1 rounded">
                        Last updated: Today 09:00
                    </span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-white/5 text-gray-400 uppercase text-xs font-bold tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4 text-center">Predicted</th>
                                <th className="px-6 py-4 text-center">Actual</th>
                                <th className="px-6 py-4 text-center">Error</th>
                                <th className="px-6 py-4 text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {displayHistory.map((row, i) => (
                                <tr key={i} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4 font-mono text-gray-300">
                                        <div className="font-bold text-white">{row.date}</div>
                                        <div className="text-xs text-gray-500">{row.time}</div>
                                    </td>
                                    <td className="px-6 py-4 text-center font-mono text-blue-400 font-bold">
                                        {row.predicted}
                                    </td>
                                    <td className="px-6 py-4 text-center font-mono text-white font-bold">
                                        {row.actual}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${Math.abs(row.error) <= 15 ? 'bg-green-500/10 text-green-400' :
                                            Math.abs(row.error) <= 25 ? 'bg-yellow-500/10 text-yellow-400' : 'bg-red-500/10 text-red-400'
                                            }`}>
                                            {row.error > 0 ? '+' : ''}{row.error} ({row.errorPercent}%)
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {row.status === 'good' && <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />}
                                        {row.status === 'acceptable' && <AlertTriangle className="w-5 h-5 text-yellow-500 mx-auto" />}
                                        {row.status === 'poor' && <XCircle className="w-5 h-5 text-red-500 mx-auto" />}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="p-4 bg-white/5 border-t border-white/5 text-center">
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="text-xs font-bold text-primary hover:text-white transition-colors uppercase tracking-widest"
                    >
                        {isExpanded ? 'Show 7-Day Summary' : 'View Full 30-Day Audit Log'}
                    </button>
                </div>
            </div>
        </div>
    );
};

const MetricCard = ({ label, value, unit, icon, color }) => {
    const colors = {
        blue: 'border-blue-500/20 bg-blue-500/5',
        green: 'border-green-500/20 bg-green-500/5',
        orange: 'border-orange-500/20 bg-orange-500/5',
    };

    return (
        <div className={`p-5 rounded-2xl border ${colors[color]} flex flex-col justify-between h-full`}>
            <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">{label}</span>
                {icon}
            </div>
            <div>
                <div className="text-2xl font-black text-white">{value}</div>
                <div className="text-[10px] text-gray-500 font-medium">{unit}</div>
            </div>
        </div>
    );
};

PredictionValidation.propTypes = {
    history: PropTypes.array,
    metrics: PropTypes.shape({
        mae: PropTypes.number,
        within15: PropTypes.number,
        within25: PropTypes.number,
        directionalAccuracy: PropTypes.number
    })
};

export default PredictionValidation;
