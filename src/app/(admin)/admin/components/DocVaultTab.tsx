import React from 'react';
import { Button } from '../../../../components/ui/Button';

export const DocVaultTab = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Preference List Dispatch */}
            <div className="bg-white rounded-[1.5rem] p-8 shadow-xl border border-gray-100 text-center flex flex-col items-center justify-center min-h-[250px]">
                <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-4 text-2xl shadow-sm filter drop-shadow-sm">
                    📂
                </div>
                <h2 className="text-lg font-black text-[#020617] mb-2">Preference List Dispatch</h2>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest max-w-xs mx-auto leading-relaxed mb-6">
                    Instantly push custom preference lists.
                </p>
                <Button className="w-full max-w-xs bg-[#1e40af] hover:bg-[#1e3a8a] py-3 rounded-xl text-[10px] font-black shadow-lg shadow-blue-900/20 uppercase tracking-widest">
                    Select PDF Document
                </Button>
            </div>

            {/* Bulk Mentor Allocation */}
            <div className="bg-white rounded-[1.5rem] p-8 shadow-xl border border-gray-100 min-h-[250px] flex flex-col justify-center">
                <h2 className="text-lg font-black text-[#020617] mb-6">Bulk Mentor Allocation</h2>

                <div className="space-y-4">
                    <div className="relative">
                        <select className="w-full h-12 bg-gray-50 border border-gray-100 rounded-xl px-5 text-xs font-black text-[#020617] appearance-none focus:outline-none focus:bg-white transition-all cursor-pointer shadow-sm">
                            <option>Batch 2024 - Round 1</option>
                            <option>Batch 2024 - Round 2</option>
                            <option>Direct Second Year</option>
                        </select>
                        <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none">
                            <svg className="w-4 h-4 text-[#020617]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                    </div>

                    <Button className="w-full bg-[#1e40af] hover:bg-[#1e3a8a] py-3 rounded-xl text-[10px] font-black shadow-lg shadow-blue-900/20 uppercase tracking-widest">
                        Run Allocation Logic
                    </Button>
                </div>
            </div>

        </div>
    );
};
