import React from 'react';
import PropTypes from 'prop-types';
import { X, ArrowRight, ArrowUpRight, TrendingUp, AlertCircle, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const RevisionTimeline = ({ show, onClose, data }) => {
    if (!show || !data) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    onClick={onClose}
                />
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="relative bg-gray-900 border border-white/10 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden"
                >
                    {/* Header */}
                    <div className="p-6 border-b border-white/5 flex justify-between items-start bg-gradient-to-r from-indigo-900/30 to-purple-900/30">
                        <div>
                            <div className="flex items-center gap-2 mb-1 text-indigo-400">
                                <Clock size={16} />
                                <span className="text-xs font-bold uppercase tracking-widest">Forecast Revision History</span>
                            </div>
                            <h2 className="text-2xl font-bold text-white">Target: {data.targetTime}</h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <div className="p-6">
                        {/* Net Change Summary */}
                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl mb-8 border border-white/5">
                            <div className="flex items-center gap-4">
                                <div className="text-center">
                                    <div className="text-xs text-gray-500 uppercase font-bold mb-1">Previous</div>
                                    <div className="text-2xl font-bold text-gray-400">372</div>
                                </div>
                                <ArrowRight className="text-gray-600" />
                                <div className="text-center">
                                    <div className="text-xs text-gray-500 uppercase font-bold mb-1">Current</div>
                                    <div className="text-4xl font-black text-white">404</div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="inline-flex items-center gap-1 text-red-400 bg-red-500/10 px-3 py-1 rounded-full text-sm font-bold border border-red-500/20">
                                    <TrendingUp size={16} />
                                    <span>+32 Adjust</span>
                                </div>
                            </div>
                        </div>

                        {/* Timeline Events */}
                        <div className="space-y-6 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-800">
                            {data.changes.map((change, i) => (
                                <div key={i} className="relative pl-12">
                                    <div className={`absolute left-2.5 top-1.5 w-3 h-3 rounded-full border-2 border-gray-900 ${change.impact > 0 ? 'bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]' : 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]'
                                        } -translate-x-1/2 z-10`}></div>

                                    <div className="bg-gray-800/50 rounded-xl p-4 border border-white/5 hover:border-white/10 transition-colors">
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="font-bold text-gray-200">{change.factor}</h4>
                                            <span className={`text-sm font-bold ${change.impact > 0 ? 'text-orange-400' : 'text-green-400'}`}>
                                                {change.impact > 0 ? '+' : ''}{change.impact}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-3 text-sm text-gray-400 mb-2 font-mono bg-black/20 p-2 rounded-lg inline-block">
                                            <span>{change.oldValue}</span>
                                            <ArrowRight size={12} />
                                            <span className="text-white font-bold">{change.newValue}</span>
                                        </div>

                                        <p className="text-sm text-gray-400 leading-relaxed">
                                            {change.explanation}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 flex items-start gap-3 p-4 bg-blue-500/10 rounded-xl border border-blue-500/20">
                            <AlertCircle className="text-blue-400 flex-shrink-0 mt-0.5" size={18} />
                            <p className="text-xs text-blue-200 leading-relaxed">
                                <strong>Note:</strong> Forecast refinement is normal as prediction time approaches. Newer satellite data and real-time sensor readings replace statistical averages.
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

RevisionTimeline.propTypes = {
    show: PropTypes.bool,
    onClose: PropTypes.func,
    data: PropTypes.object
};

export default RevisionTimeline;
