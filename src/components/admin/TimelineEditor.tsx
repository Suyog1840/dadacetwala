import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Heading } from '../ui/Heading';
import { Subheading } from '../ui/Subheading';

interface TimelineStep {
    id: number;
    name: string;
    status: 'completed' | 'current' | 'upcoming';
    date: string;
}

export const TimelineEditor = () => {
    const [steps, setSteps] = useState<TimelineStep[]>([
        { id: 1, name: 'Registration', status: 'completed', date: 'Aug 10' },
        { id: 2, name: 'Doc Verification', status: 'current', date: 'Aug 14' },
        { id: 3, name: 'Merit List', status: 'upcoming', date: 'Aug 22' },
        { id: 4, name: 'Option Entry', status: 'upcoming', date: 'Aug 25' },
        { id: 5, name: 'Seat Allotment', status: 'upcoming', date: 'Sept 01' },
    ]);

    const handleStatusChange = (id: number, newStatus: TimelineStep['status']) => {
        setSteps(steps.map(step =>
            step.id === id ? { ...step, status: newStatus } : step
        ));
    };

    return (
        <div className="bg-white rounded-[1.5rem] p-8 shadow-xl border border-gray-100 w-fit max-w-[95vw] mx-auto overflow-hidden">
            {/* Header */}
            <div className="mb-6">
                <Heading as="h3" className="mb-1">Admission Journey Control</Heading>
                <Subheading>
                    Update live tracking status.
                </Subheading>
            </div>

            {/* Steps List */}
            <div className="space-y-2 overflow-x-auto pb-4 md:pb-0">
                {steps.map((step, index) => (
                    <div key={step.id} className="flex items-center gap-3 bg-white border border-gray-100 p-2.5 rounded-xl shadow-sm hover:shadow-md transition-all w-fit min-w-max">

                        {/* Step Number */}
                        <div className="w-8 flex justify-center">
                            <span className="text-[10px] font-black text-gray-300">
                                {String(index + 1).padStart(2, '0')}
                            </span>
                        </div>

                        {/* Step Name */}
                        <div className="w-40">
                            <label className="block text-[7px] font-black text-gray-400 uppercase tracking-widest mb-0.5 opacity-70">
                                Step Name
                            </label>
                            <Input
                                value={step.name}
                                readOnly
                                className="bg-gray-50 text-[#020617] font-bold border-gray-100 h-7 text-[10px] rounded-lg shadow-sm focus:bg-white transition-colors"
                            />
                        </div>

                        {/* Live Status */}
                        <div className="w-28">
                            <label className="block text-[7px] font-black text-gray-400 uppercase tracking-widest mb-0.5 opacity-70">
                                Live Status
                            </label>
                            <div className="relative">
                                <select
                                    value={step.status}
                                    onChange={(e) => handleStatusChange(step.id, e.target.value as TimelineStep['status'])}
                                    className="w-full h-7 bg-gray-50 text-[#020617] border border-gray-100 font-bold text-[9px] uppercase tracking-widest rounded-lg px-2 appearance-none focus:outline-none focus:bg-white cursor-pointer shadow-sm transition-colors"
                                >
                                    <option value="completed">Completed</option>
                                    <option value="current">Current</option>
                                    <option value="upcoming">Upcoming</option>
                                </select>
                                <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                                    <svg className="w-2 h-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                </div>
                            </div>
                        </div>

                        {/* Scheduled Date */}
                        <div className="w-20">
                            <label className="block text-[7px] font-black text-gray-400 uppercase tracking-widest mb-0.5 opacity-70">
                                Date
                            </label>
                            <Input
                                value={step.date}
                                readOnly
                                className="bg-gray-50 text-[#020617] font-bold border-gray-100 h-7 text-[10px] rounded-lg shadow-sm focus:bg-white transition-colors text-center"
                            />
                        </div>

                        {/* Status Indicator */}
                        <div className="flex items-center justify-center pl-2">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-black shadow-sm transition-all ${step.status === 'completed' ? 'bg-[#22c55e] text-white shadow-[#22c55e]/30' :
                                step.status === 'current' ? 'bg-[#1e40af] text-white shadow-blue-900/30' : 'bg-gray-100 text-gray-300'
                                }`}>
                                {step.status === 'completed' && (
                                    <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                                )}
                                {step.status !== 'completed' && (
                                    <div className={`w-2 h-2 rounded-full ${step.status === 'current' ? 'bg-white animate-pulse' : 'bg-gray-300'}`}></div>
                                )}
                            </div>
                        </div>

                    </div>
                ))}
            </div>

            {/* Footer Actions */}
            <div className="mt-6 flex justify-between items-center gap-4">
                <Button variant="outline" className="h-8 px-5 border border-dashed border-gray-300 text-gray-400 hover:border-[#1e40af] hover:text-[#1e40af] uppercase tracking-widest text-[9px] font-black rounded-lg">
                    + Add Step
                </Button>
                <Button className="h-8 px-5 bg-[#1e40af] hover:bg-[#1e3a8a] text-white uppercase tracking-widest text-[9px] font-black shadow-lg shadow-blue-900/20 rounded-lg">
                    Publish Journey
                </Button>
            </div>
        </div>
    );
};
