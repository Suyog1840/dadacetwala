import React from 'react';

interface ServiceCardProps {
    title: string;
    description: string;
    icon: React.ReactNode;
    onClick?: () => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ title, description, icon, onClick }) => {
    return (
        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 hover:shadow-xl hover:shadow-blue-50 transition-all duration-300 group cursor-pointer flex flex-col items-center text-center h-full">
            <div className="w-16 h-16 mb-6 rounded-2xl bg-gray-50 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300">
                {icon}
            </div>
            <h3 className="text-xl font-bold text-[#020617] mb-3">{title}</h3>
            <p className="text-gray-400 text-sm leading-relaxed font-medium mb-8 flex-grow">
                {description}
            </p>
            <button className="text-[10px] font-black text-[#1e40af] uppercase tracking-widest hover:tracking-[0.2em] transition-all flex items-center gap-1">
                Explore More <span>→</span>
            </button>
        </div>
    );
};
