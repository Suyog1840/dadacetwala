'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';

interface FeeStructure {
    id: string;
    collegeCode: string;
    collegeName: string;
    pdfUrl: string;
}

interface FeeCardProps {
    fee: FeeStructure;
}

export default function FeeCard({ fee }: FeeCardProps) {
    const handleDownload = () => {
        if (!fee.pdfUrl || fee.pdfUrl === '#') {
            alert('Fee structure PDF not available for this college.');
            return;
        }
        window.open(fee.pdfUrl, '_blank');
    };

    return (
        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group relative overflow-hidden">

            {/* Top Decoration */}
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-400 to-[#1e40af] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            {/* Icon/Code Area */}
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-[#1e40af] font-black text-xl mb-4 shadow-inner group-hover:bg-[#1e40af] group-hover:text-white transition-colors duration-300">
                {fee.collegeCode.substring(0, 2)}
            </div>

            {/* Content */}
            <div className="mb-6 flex-grow flex flex-col items-center">
                <span className="bg-gray-100 text-gray-500 text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider mb-2">
                    Code: {fee.collegeCode}
                </span>

                <h3 className="font-bold text-[#020617] text-sm md:text-base leading-tight mb-2 line-clamp-2 min-h-[2.5rem]">
                    {fee.collegeName}
                </h3>
            </div>

            {/* Footer / CTA */}
            <Button
                variant="primary"
                size="sm"
                onClick={handleDownload}
                className="w-full shadow-blue-100/50"
            >
                <span className="mr-2">⬇️</span> Download PDF
            </Button>
        </div>
    );
}
