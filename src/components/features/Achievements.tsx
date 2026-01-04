import React from 'react';

const stats = [
    { value: '8,400+', label: 'Engineering Admissions', icon: '🎓' },
    { value: '3,150+', label: 'Medical Seats Secured', icon: '🩺' },
    { value: '12,000+', label: 'Happy Students', icon: '😊' },
    { value: '94.8%', label: 'Prediction Accuracy', icon: '🎯' },
];

export const Achievements: React.FC = () => {
    return (
        <section className="py-12 bg-gray-50/50">
            <div className="max-w-7xl mx-auto px-6 sm:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-black text-[#020617] tracking-tight mb-3">Our Achievements</h2>
                    <p className="text-gray-500 font-medium text-sm">A sneak peek of our success story</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                    {stats.map((stat, index) => (
                        <div key={index} className="bg-white p-6 rounded-[2rem] border border-gray-100 hover:shadow-xl hover:shadow-blue-50/50 transition-all duration-300 group text-center flex flex-col items-center justify-center h-full">
                            <div className="mb-4 text-4xl transform group-hover:scale-110 transition-transform duration-300 filter drop-shadow-sm">
                                {stat.icon}
                            </div>
                            <h3 className="text-2xl md:text-3xl font-black text-[#020617] mb-2 tracking-tight">
                                {stat.value}
                            </h3>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-relaxed">
                                {stat.label}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
