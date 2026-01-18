import React from 'react';
import PropTypes from 'prop-types';
import { Target, Activity, Cpu, Database, BarChart2, Layers } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';

const ModelPerformanceDashboard = ({ data }) => {
    if (!data) return null;

    return (
        <div className="space-y-8">
            {/* Header Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <TechnicalCard icon={<Cpu />} label="Algorithm" value="XGBoost Regressor" sub="Gradient Boosted Trees" color="blue" />
                <TechnicalCard icon={<Database />} label="Training Set" value="8,760 hrs" sub="3 Years (2019-2024)" color="purple" />
                <TechnicalCard icon={<Activity />} label="Validation" value="5-Fold CV" sub="Robust Cross-Val" color="green" />
                <TechnicalCard icon={<Target />} label="R² Score" value="0.87" sub="High Accuracy" color="orange" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Feature Importance */}
                <div className="glass p-6 rounded-3xl border-white/5 bg-gray-900/40">
                    <h3 className="font-bold flex items-center gap-2 mb-6 text-white">
                        <Layers className="text-primary w-5 h-5" />
                        Feature Importance Ranking
                    </h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart layout="vertical" data={data.featureImportance} margin={{ left: 40 }}>
                                <XAxis type="number" hide />
                                <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 10, fill: '#9CA3AF' }} />
                                <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '12px' }} />
                                <Bar dataKey="importance" fill="#818CF8" radius={[0, 4, 4, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Training Convergence */}
                <div className="glass p-6 rounded-3xl border-white/5 bg-gray-900/40">
                    <h3 className="font-bold flex items-center gap-2 mb-6 text-white">
                        <Activity className="text-green-400 w-5 h-5" />
                        Training Convergence
                    </h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data.trainingCurves.epochs.map((e, i) => ({
                                epoch: e,
                                train: data.trainingCurves.trainLoss[i],
                                val: data.trainingCurves.valLoss[i]
                            }))}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                                <XAxis dataKey="epoch" stroke="#6B7280" tick={{ fontSize: 10 }} />
                                <YAxis stroke="#6B7280" tick={{ fontSize: 10 }} domain={['dataMin - 5', 'dataMax + 5']} />
                                <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '12px' }} />
                                <Line type="monotone" dataKey="train" stroke="#3B82F6" strokeWidth={2} dot={false} name="Train Loss" />
                                <Line type="monotone" dataKey="val" stroke="#10B981" strokeWidth={2} dot={false} name="Val Loss" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Error Distribution */}
            <div className="glass p-6 rounded-3xl border-white/5 bg-gray-900/40">
                <h3 className="font-bold flex items-center gap-2 mb-6 text-white">
                    <BarChart2 className="text-orange-400 w-5 h-5" />
                    Prediction Error Distribution (Residuals)
                </h3>
                <div className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data.errorDistribution.bins.map((b, i) => ({ bin: b, count: data.errorDistribution.counts[i] }))}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff10" />
                            <XAxis dataKey="bin" stroke="#6B7280" tick={{ fontSize: 10 }} label={{ value: 'Error (AQI Points)', position: 'insideBottom', offset: -5, fill: '#6B7280', fontSize: 10 }} />
                            <YAxis stroke="#6B7280" tick={{ fontSize: 10 }} />
                            <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '12px' }} />
                            <Bar dataKey="count" fill="#F59E0B" radius={[4, 4, 0, 0]} opacity={0.8} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

const TechnicalCard = ({ icon, label, value, sub, color }) => {
    const colors = {
        blue: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
        purple: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400',
        green: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
        orange: 'bg-orange-500/10 border-orange-500/20 text-orange-400',
    };

    return (
        <div className={`p-5 rounded-2xl border ${colors[color].split(' ')[1]} ${colors[color].split(' ')[0]} flex items-start gap-4`}>
            <div className={`mt-1 bg-black/20 p-2 rounded-lg ${colors[color].split(' ')[2]}`}>
                {icon}
            </div>
            <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">{label}</div>
                <div className="text-xl font-black text-white">{value}</div>
                <div className="text-xs font-medium text-gray-500">{sub}</div>
            </div>
        </div>
    );
};

ModelPerformanceDashboard.propTypes = {
    data: PropTypes.object
};

export default ModelPerformanceDashboard;
