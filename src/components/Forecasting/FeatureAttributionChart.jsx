import React from 'react';
import PropTypes from 'prop-types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, LabelList, Cell } from 'recharts';
import { BarChart3, HelpCircle } from 'lucide-react';

const FeatureAttributionChart = ({
    data = [],
    netChange = 35
}) => {
    // Sort data by magnitude of contribution
    const sortedData = [...data].sort((a, b) => Math.abs(b.contribution) - Math.abs(a.contribution));

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-gray-800 p-4 rounded-xl border border-gray-700 shadow-xl max-w-xs z-50">
                    <p className="font-bold text-white mb-1">{data.title}</p>
                    <div className="flex items-center gap-2 mb-2">
                        <span className={`text-lg font-black ${data.contribution > 0 ? 'text-orange-400' : 'text-green-400'}`}>
                            {data.contribution > 0 ? '+' : ''}{data.contribution} pts
                        </span>
                        <span className="text-xs text-gray-500">({data.percentage}%)</span>
                    </div>
                    <p className="text-xs text-gray-300 leading-relaxed">{data.explanation}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="bg-gray-900/50 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-2xl h-full">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold flex items-center gap-2 text-white">
                    <BarChart3 className="text-primary" size={24} />
                    Prediction Drivers
                </h3>
                <button className="text-gray-400 hover:text-white transition-colors">
                    <HelpCircle size={20} />
                </button>
            </div>

            <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        layout="vertical"
                        data={sortedData}
                        margin={{ top: 5, right: 50, left: 40, bottom: 5 }}
                        barSize={20}
                    >
                        <XAxis type="number" hide />
                        <YAxis
                            type="category"
                            dataKey="title"
                            stroke="#9CA3AF"
                            width={140}
                            tick={{ fontSize: 11, fontWeight: 600, fill: '#D1D5DB' }}
                            tickLine={false}
                            axisLine={false}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                        <ReferenceLine x={0} stroke="#4B5563" />
                        <Bar dataKey="contribution" radius={[4, 4, 4, 4]}>
                            {sortedData.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={entry.contribution > 0 ? '#FB923C' : '#34D399'}
                                    fillOpacity={0.8}
                                />
                            ))}
                            <LabelList
                                dataKey="contribution"
                                position="right" // This might overlay for negative values, handled via custom renderer if needed
                                content={(props) => {
                                    const { x, y, width, height, value } = props;
                                    const offset = value > 0 ? 5 : -35;
                                    const displayValue = value > 0 ? `+${value}` : value;
                                    return (
                                        <text
                                            x={value > 0 ? x + width + 5 : x - 5}
                                            y={y + height / 1.5}
                                            fill={value > 0 ? '#FB923C' : '#34D399'}
                                            textAnchor={value > 0 ? 'start' : 'end'}
                                            fontSize={11}
                                            fontWeight={700}
                                        >{displayValue}</text>
                                    );
                                }}
                            />
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className="mt-4 flex justify-between items-center px-4 py-3 bg-white/5 rounded-xl border border-white/5">
                <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Net Calculation</span>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-400">Total Adjusted Impact:</span>
                    <span className="text-lg font-black text-white">+{netChange}</span>
                </div>
            </div>
        </div>
    );
};

FeatureAttributionChart.propTypes = {
    data: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number.isRequired,
        title: PropTypes.string.isRequired,
        contribution: PropTypes.number.isRequired,
        percentage: PropTypes.number.isRequired,
        explanation: PropTypes.string.isRequired
    })),
    netChange: PropTypes.number
};

export default FeatureAttributionChart;
