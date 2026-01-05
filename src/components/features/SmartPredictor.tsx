import React from 'react';
import Link from 'next/link';

export const SmartPredictor: React.FC = () => {
    return (
        <section className="py-10 bg-gray-50/50 relative overflow-hidden">
            <div className="max-w-4xl mx-auto px-6 relative z-10">
                {/* Section Header */}
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-black text-[#020617] tracking-tight mb-4">Smart Predictor</h2>
                    <div className="w-16 h-1.5 bg-[#1e40af] rounded-full mx-auto"></div>
                </div>

                <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-xl shadow-gray-200/40 border border-white text-center max-w-3xl mx-auto">

                    {/* Card Heading */}
                    <div className="mb-8">
                        <h3 className="text-xl font-black text-[#020617] mb-2">Enter your MHTCET Percentile</h3>
                        <p className="text-gray-400 text-xs font-medium">Get instant college predictions based on 5-year trends.</p>
                    </div>

                    {/* Input Area */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-10">
                        <div className="bg-white border border-gray-200 rounded-xl px-4 py-2 shadow-sm focus-within:ring-2 focus-within:ring-blue-100 transition-all w-full sm:w-auto">
                            <input
                                type="text"
                                placeholder="e.g. 98.5"
                                className="w-32 h-10 bg-transparent text-center text-xl font-bold text-[#020617] focus:outline-none placeholder-gray-300"
                            />
                        </div>
                        <Link href="/register" className="w-full sm:w-auto">
                            <button className="h-14 bg-[#020617] hover:bg-[#1e40af] text-white px-8 rounded-xl text-xs font-bold shadow-lg shadow-blue-900/10 transition-all transform hover:-translate-y-0.5 uppercase tracking-wider flex items-center justify-center gap-2 w-full">
                                Find Colleges
                            </button>
                        </Link>
                    </div>

                    {/* Discovery Mode */}
                    <div className="border border-dashed border-gray-200 rounded-2xl p-6 flex flex-col items-center justify-center bg-gray-50/30 text-center">
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm mb-3 text-lg border border-gray-50">
                            🧭
                        </div>
                        <h3 className="text-sm font-bold text-[#020617] mb-1">Discovery Mode</h3>
                        <p className="text-gray-400 text-[10px] font-medium max-w-xs mx-auto leading-relaxed">
                            Don't know your percentile? Explore colleges by region or branch directly.
                        </p>
                    </div>
                </div>
            </div>

            {/* Background Decorations */}
            <div className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 bg-blue-100/30 rounded-full blur-3xl -z-10"></div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-purple-100/30 rounded-full blur-3xl -z-10"></div>
        </section>
    );
};
