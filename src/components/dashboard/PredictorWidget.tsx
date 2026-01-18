'use client';

import React from 'react';
import { Button } from '../ui/Button';

const PredictorWidget: React.FC = () => {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="text-center md:text-left">
                    <h3 className="text-lg font-black text-[#020617] mb-1">Smart Predictor</h3>
                    <p className="text-[10px] text-gray-500 font-medium">
                        Predict chances based on 5-year trend analysis.
                    </p>
                </div>

                <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-xl border border-gray-100 w-full md:w-auto">
                    <div className="relative flex-grow md:flex-grow-0">
                        <span className="absolute -top-2 left-2 bg-[#3b82f6] text-white text-[7px] font-black px-1 py-0.5 rounded uppercase tracking-wider">
                            Percentile
                        </span>
                        <input
                            type="text"
                            defaultValue="99.2"
                            className="w-full md:w-24 h-10 rounded-lg border-gray-200 text-center font-black text-lg text-[#020617] focus:ring-0 focus:border-blue-500"
                        />
                    </div>
                    <Button variant="primary" size="sm" className="whitespace-nowrap">
                        Find Colleges
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default PredictorWidget;
