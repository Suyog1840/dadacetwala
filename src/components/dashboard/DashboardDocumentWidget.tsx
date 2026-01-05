'use client';

import React, { useState, useEffect } from 'react';

// Simplified Document List for the Widget
const WIDGET_DOCUMENTS = [
    { id: 'ssc', label: 'SSC Marksheet' },
    { id: 'hsc', label: 'HSC Marksheet' },
    { id: 'cet', label: 'MHT-CET Scorecard' },
    { id: 'domicile', label: 'Domicile Certificate' },
    { id: 'nationality', label: 'Nationality Cert.' },
];

const DashboardDocumentWidget: React.FC = () => {
    // Mock state - in real app would sync with backend
    const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({
        'ssc': true,
        'hsc': true
    });
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const total = WIDGET_DOCUMENTS.length;
        const checkedCount = Object.values(checkedItems).filter(Boolean).length;
        const percentage = Math.round((checkedCount / total) * 100);
        setProgress(percentage);
    }, [checkedItems]);

    const handleToggle = (id: string) => {
        setCheckedItems(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    return (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 font-sans">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-[10px] font-black text-gray-300 uppercase tracking-widest">
                    My Documents
                </h3>
                <span className="text-[10px] font-black text-[#1e40af] bg-blue-50 px-2 py-1 rounded-lg">
                    {progress}%
                </span>
            </div>

            {/* Progress Bar */}
            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden mb-6">
                <div
                    className="h-full bg-[#1e40af] rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                ></div>
            </div>

            {/* Compact List */}
            <div className="space-y-3">
                {WIDGET_DOCUMENTS.map((doc) => (
                    <div
                        key={doc.id}
                        onClick={() => handleToggle(doc.id)}
                        className="flex items-center cursor-pointer group"
                    >
                        <div className={`
                            w-5 h-5 rounded flex items-center justify-center border mr-3 transition-all flex-shrink-0
                            ${checkedItems[doc.id]
                                ? 'bg-[#1e40af] border-[#1e40af] text-white'
                                : 'bg-white border-gray-200 group-hover:border-blue-300'}
                        `}>
                            {checkedItems[doc.id] && (
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                            )}
                        </div>
                        <span className={`
                            text-[11px] font-bold transition-colors
                            ${checkedItems[doc.id] ? 'text-gray-400 line-through' : 'text-[#020617]'}
                        `}>
                            {doc.label}
                        </span>
                    </div>
                ))}
            </div>

            {/* Footer Action */}
            <div className="mt-6 pt-4 border-t border-gray-50 text-center">
                <button className="text-[9px] font-black text-[#1e40af] uppercase tracking-widest hover:text-blue-700 transition-colors">
                    View Full Checklist →
                </button>
            </div>
        </div>
    );
};

export default DashboardDocumentWidget;
