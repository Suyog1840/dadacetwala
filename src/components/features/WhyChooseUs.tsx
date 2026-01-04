import React from 'react';

export const WhyChooseUs: React.FC = () => {
    return (
        <section className="py-6 md:py-10 bg-white">
            <div className="max-w-7xl mx-auto px-6 sm:px-8">
                {/* Header */}
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-black text-[#020617] tracking-tight mb-4">Why Choose Us?</h2>
                    <div className="w-16 h-1.5 bg-[#1e40af] rounded-full mx-auto"></div>
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                    {/* Card 1 */}
                    <div className="p-5 md:p-6 rounded-[2rem] border border-gray-100 bg-white hover:shadow-xl hover:shadow-blue-50 transition-all duration-300 group text-center cursor-default">
                        <div className="w-10 h-10 mx-auto mb-3 md:mb-4 bg-blue-50/50 rounded-2xl flex items-center justify-center text-lg md:text-2xl group-hover:scale-110 transition-transform duration-300">
                            📊
                        </div>
                        <h3 className="text-sm font-bold text-[#020617] mb-1 md:mb-2">AI Analysis</h3>
                        <p className="text-gray-400 text-[10px] leading-relaxed font-medium">
                            5-year CAP data analysis for accurate predictions.
                        </p>
                    </div>

                    {/* Card 2 */}
                    <div className="p-5 md:p-6 rounded-[2rem] border border-gray-100 bg-white hover:shadow-xl hover:shadow-orange-50 transition-all duration-300 group text-center cursor-default">
                        <div className="w-10 h-10 mx-auto mb-3 md:mb-4 bg-orange-50/50 rounded-2xl flex items-center justify-center text-lg md:text-2xl group-hover:scale-110 transition-transform duration-300">
                            👨‍🏫
                        </div>
                        <h3 className="text-sm font-bold text-[#020617] mb-1 md:mb-2">Expert Mentors</h3>
                        <p className="text-gray-400 text-[10px] leading-relaxed font-medium">
                            Guidance from top counselors.
                        </p>
                    </div>

                    {/* Card 3 */}
                    <div className="p-5 md:p-6 rounded-[2rem] border border-gray-100 bg-white hover:shadow-xl hover:shadow-green-50 transition-all duration-300 group text-center cursor-default">
                        <div className="w-10 h-10 mx-auto mb-3 md:mb-4 bg-green-50/50 rounded-2xl flex items-center justify-center text-lg md:text-2xl group-hover:scale-110 transition-transform duration-300">
                            📜
                        </div>
                        <h3 className="text-sm font-bold text-[#020617] mb-1 md:mb-2">Preferences</h3>
                        <p className="text-gray-400 text-[10px] leading-relaxed font-medium">
                            Smart customized lists.
                        </p>
                    </div>

                    {/* Card 4 */}
                    <div className="p-5 md:p-6 rounded-[2rem] border border-gray-100 bg-white hover:shadow-xl hover:shadow-purple-50 transition-all duration-300 group text-center cursor-default">
                        <div className="w-10 h-10 mx-auto mb-3 md:mb-4 bg-purple-50/50 rounded-2xl flex items-center justify-center text-lg md:text-2xl group-hover:scale-110 transition-transform duration-300">
                            🤝
                        </div>
                        <h3 className="text-sm font-bold text-[#020617] mb-1 md:mb-2">Full Support</h3>
                        <p className="text-gray-400 text-[10px] leading-relaxed font-medium">
                            Assistance until final admission.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};
