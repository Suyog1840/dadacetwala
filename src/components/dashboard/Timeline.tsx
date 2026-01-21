import React from 'react';

interface TimelineStep {
    id: number;
    label: string;
    date: string;
    status: 'completed' | 'current' | 'upcoming';
}

interface TimelineProps {
    steps: TimelineStep[];
}

const Timeline: React.FC<TimelineProps> = ({ steps }) => {
    return (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5 md:p-8 relative overflow-hidden">
            <div className="flex justify-between items-center mb-6 md:mb-10">
                <h3 className="text-[11px] font-black text-[#020617] uppercase tracking-widest">
                    Process Timeline
                </h3>
                <span className="text-[10px] font-bold text-[#1e40af] italic bg-blue-50 px-3 py-1 rounded-full">
                    Live Tracking
                </span>
            </div>

            <div className="relative px-1 md:px-2">
                {/* Horizontal Line - Hidden on small mobile to avoid line mess, or adjusted */}
                <div className="absolute top-5 left-0 w-full h-0.5 bg-gray-100 -z-0 hidden md:block"></div>

                {/* Mobile: Horizontal scroll container, Desktop: Flex row centered */}
                <div className="flex md:flex-row justify-start md:justify-between items-start md:items-start gap-4 md:gap-0 relative z-10 w-full overflow-x-auto pb-4 md:pb-0 hide-scrollbar scroll-smooth snap-x snap-mandatory">
                    {steps.map((step) => (
                        <div key={step.id} className="flex flex-col items-center gap-2 md:gap-3 min-w-[100px] md:min-w-0 md:w-auto relative snap-center shrink-0">
                            {/* Circle Indicator */}
                            <div className={`
                                w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-bold text-xs md:text-sm shadow-sm transition-all z-10 shrink-0
                                ${step.status === 'completed' ? 'bg-[#1e40af] text-white ring-2 md:ring-4 ring-blue-50' : ''}
                                ${step.status === 'current' ? 'bg-white border-2 border-[#1e40af] text-[#1e40af] ring-2 md:ring-4 ring-blue-50' : ''}
                                ${step.status === 'upcoming' ? 'bg-white border-2 border-gray-100 text-gray-300' : ''}
                            `}>
                                {step.status === 'completed' ? (
                                    <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                                ) : (
                                    <span className={step.status === 'upcoming' ? 'opacity-50' : ''}>{step.id}</span>
                                )}
                            </div>

                            {/* Labels */}
                            <div className="text-center mt-1 md:mt-2">
                                <p className={`
                                    text-[9px] md:text-[10px] font-black uppercase tracking-widest mb-0.5 md:mb-1 leading-tight whitespace-normal md:whitespace-nowrap max-w-[120px]
                                    ${step.status === 'upcoming' ? 'text-gray-300' : 'text-[#020617]'}
                                `}>
                                    {step.label}
                                </p>
                                <p className="text-[8px] md:text-[9px] font-bold text-gray-400">
                                    {step.date}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Timeline;
