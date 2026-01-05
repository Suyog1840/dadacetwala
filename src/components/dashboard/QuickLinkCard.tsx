import React from 'react';

interface QuickLinkCardProps {
    icon: string;
    title: string;
    subtitle: string;
}

const QuickLinkCard: React.FC<QuickLinkCardProps> = ({ icon, title, subtitle }) => {
    return (
        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-5 flex flex-col items-center text-center h-full transition-all duration-300 hover:shadow-lg group cursor-pointer relative overflow-hidden">

            {/* Soft Icon Background */}
            <div className="w-20 h-20 bg-gray-50 rounded-[1.5rem] flex items-center justify-center text-3xl mb-4 group-hover:scale-105 transition-transform duration-300">
                <span className="grayscale group-hover:grayscale-0 transition-all duration-300 transform scale-100">
                    {icon}
                </span>
            </div>

            {/* Content */}
            <h4 className="text-lg font-black text-[#020617] mb-2 leading-tight tracking-tight">
                {title}
            </h4>

            <p className="text-xs font-medium text-gray-400 leading-relaxed mb-6 max-w-[90%] mx-auto">
                {subtitle}
            </p>

            {/* Footer / CTA - Pushed to bottom */}
            <div className="mt-auto flex items-center justify-center text-[9px] font-black text-[#1e40af] uppercase tracking-widest group-hover:gap-2 transition-all duration-300">
                Explore More
                <span className="ml-1.5 transition-transform duration-300 group-hover:translate-x-1">→</span>
            </div>
        </div>
    );
};

export default QuickLinkCard;
