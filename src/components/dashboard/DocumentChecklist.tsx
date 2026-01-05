'use client';

import React, { useState, useEffect } from 'react';

// Default Document List
const DEFAULT_DOCUMENTS = [
    { id: 'ssc', label: 'SSC (10th) Marksheet', required: true },
    { id: 'hsc', label: 'HSC (12th) Marksheet', required: true },
    { id: 'cet', label: 'MHT-CET Scorecard', required: true },
    { id: 'domicile', label: 'Domicile Certificate', required: true },
    { id: 'nationality', label: 'Nationality Certificate', required: true },
    { id: 'aadhar', label: 'Aadhar Card', required: true },
    { id: 'lc', label: 'Leaving Certificate (LC)', required: true },
    { id: 'caste', label: 'Caste Certificate', required: false },
    { id: 'validity', label: 'Caste Validity Certificate', required: false },
    { id: 'ncl', label: 'Non-Creamy Layer Certificate', required: false },
    { id: 'income', label: 'Income Certificate', required: false },
    { id: 'gap', label: 'Gap Certificate (if applicable)', required: false },
];

const DocumentChecklist: React.FC = () => {
    // Load checking state from local storage or default to empty
    const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
    const [progress, setProgress] = useState(0);

    // Calculate progress whenever checkedItems changes
    useEffect(() => {
        const total = DEFAULT_DOCUMENTS.length;
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
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 max-w-3xl mx-auto">
            <div className="text-center mb-8">
                <div className="inline-block w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-2xl mb-4 shadow-sm">
                    📁
                </div>
                <h1 className="text-xl md:text-2xl font-black text-[#020617] mb-2">Document Checker</h1>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">
                    Manage your admission documents
                </p>
            </div>

            {/* Progress Section */}
            <div className="mb-8 bg-gray-50 p-6 rounded-2xl border border-gray-100">
                <div className="flex justify-between items-end mb-3">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Completion Status</span>
                    <span className="text-2xl font-black text-[#1e40af]">{progress}%</span>
                </div>
                <div className="h-3 w-full bg-white rounded-full overflow-hidden border border-gray-200">
                    <div
                        className="h-full bg-[#1e40af] rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
            </div>

            {/* Checklist */}
            <div className="space-y-3">
                {DEFAULT_DOCUMENTS.map((doc) => (
                    <div
                        key={doc.id}
                        onClick={() => handleToggle(doc.id)}
                        className={`
                            flex items-center p-4 rounded-xl border cursor-pointer transition-all duration-200 group
                            ${checkedItems[doc.id]
                                ? 'bg-blue-50 border-blue-200 shadow-sm'
                                : 'bg-white border-gray-100 hover:border-blue-300 hover:shadow-sm'}
                        `}
                    >
                        <div className={`
                            w-6 h-6 rounded flex items-center justify-center border-2 mr-4 transition-colors
                            ${checkedItems[doc.id]
                                ? 'bg-[#1e40af] border-[#1e40af] text-white'
                                : 'bg-white border-gray-200 group-hover:border-blue-300'}
                        `}>
                            {checkedItems[doc.id] && (
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                            )}
                        </div>

                        <div className="flex-grow">
                            <p className={`
                                text-sm font-bold transition-colors
                                ${checkedItems[doc.id] ? 'text-[#1e40af]' : 'text-gray-700'}
                            `}>
                                {doc.label}
                            </p>
                            {!doc.required && (
                                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Optional</span>
                            )}
                        </div>

                        {checkedItems[doc.id] && (
                            <span className="text-[9px] font-black text-[#1e40af] uppercase tracking-widest">
                                COMPLETED
                            </span>
                        )}
                    </div>
                ))}
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                <p className="text-[10px] text-gray-400 font-medium">
                    * The actual required documents may vary based on your allocated college and category.
                </p>
            </div>
        </div>
    );
};

export default DocumentChecklist;
