'use client';

import React, { useState, useEffect, useMemo } from 'react';

// ─── Types ───────────────────────────────────────────────────────────────────
type Category = 'OPEN' | 'OBC_SBC' | 'SC_ST' | 'NT_VJDT' | 'EWS';

interface DocumentDef {
    id: string;
    label: string;
    note?: string;
    // Which categories require this doc (true = required, false = not required)
    categories: Record<Category, boolean>;
    // Extra conditions (overrides category rule when condition is false)
    requiresIncomeBelowLimit?: boolean; // shown only if income < 8L selected
    requiresGap?: boolean;              // shown only if gap applicable
}

// ─── Master Document Matrix (from DadaCETwala chart) ─────────────────────────
const ALL_DOCUMENTS: DocumentDef[] = [
    {
        id: 'caste_cert',
        label: 'Caste Certificate',
        categories: { OPEN: false, OBC_SBC: true, SC_ST: true, NT_VJDT: true, EWS: false },
    },
    {
        id: 'caste_validity',
        label: 'Caste Validity Certificate',
        categories: { OPEN: false, OBC_SBC: true, SC_ST: true, NT_VJDT: true, EWS: false },
    },
    {
        id: 'nationality',
        label: 'Nationality / Passport / Leaving Certificate',
        categories: { OPEN: true, OBC_SBC: true, SC_ST: true, NT_VJDT: true, EWS: true },
    },
    {
        id: 'domicile',
        label: 'Domicile / Birth Certificate / Leaving Certificate',
        categories: { OPEN: true, OBC_SBC: true, SC_ST: true, NT_VJDT: true, EWS: true },
    },
    {
        id: 'income',
        label: 'Income Certificate',
        categories: { OPEN: false, OBC_SBC: true, SC_ST: true, NT_VJDT: true, EWS: true },
        requiresIncomeBelowLimit: true,
    },
    {
        id: 'ncl',
        label: 'Non-Creamy Layer (NCL) Certificate',
        categories: { OPEN: false, OBC_SBC: true, SC_ST: false, NT_VJDT: true, EWS: false },
        requiresIncomeBelowLimit: true,
    },
    {
        id: 'ews',
        label: 'EWS Certificate',
        categories: { OPEN: false, OBC_SBC: false, SC_ST: false, NT_VJDT: false, EWS: true },
        requiresIncomeBelowLimit: true,
    },
    {
        id: 'ssc',
        label: '10th Mark Sheet & Certificate',
        categories: { OPEN: true, OBC_SBC: true, SC_ST: true, NT_VJDT: true, EWS: true },
    },
    {
        id: 'hsc_marks',
        label: '12th Mark Sheet & Certificate',
        categories: { OPEN: true, OBC_SBC: true, SC_ST: true, NT_VJDT: true, EWS: true },
    },
    {
        id: 'hsc_lc',
        label: '12th Leaving Certificate',
        categories: { OPEN: true, OBC_SBC: true, SC_ST: true, NT_VJDT: true, EWS: true },
    },
    {
        id: 'receipt_ack',
        label: 'Receipt cum Acknowledgement',
        note: 'Obtained from CET CELL',
        categories: { OPEN: true, OBC_SBC: true, SC_ST: true, NT_VJDT: true, EWS: true },
    },
    {
        id: 'allotment',
        label: 'College Allotment Letter',
        note: 'Obtained from CET CELL',
        categories: { OPEN: true, OBC_SBC: true, SC_ST: true, NT_VJDT: true, EWS: true },
    },
    {
        id: 'entrance',
        label: 'Entrance Exam Marksheet (CET / JEE / NEET / NATA)',
        categories: { OPEN: true, OBC_SBC: true, SC_ST: true, NT_VJDT: true, EWS: true },
    },
    {
        id: 'bank',
        label: 'Aadhar-linked Nationalized Bank Account Passbook',
        categories: { OPEN: true, OBC_SBC: true, SC_ST: true, NT_VJDT: true, EWS: true },
    },
    {
        id: 'gap',
        label: 'Migration / Gap Certificate',
        categories: { OPEN: true, OBC_SBC: true, SC_ST: true, NT_VJDT: true, EWS: true },
        requiresGap: true,
    },
    {
        id: 'aadhar',
        label: 'Aadhar Card',
        categories: { OPEN: true, OBC_SBC: true, SC_ST: true, NT_VJDT: true, EWS: true },
    },
    {
        id: 'photo',
        label: 'Passport Size Photo',
        categories: { OPEN: true, OBC_SBC: true, SC_ST: true, NT_VJDT: true, EWS: true },
    },
];

// ─── Category Config ──────────────────────────────────────────────────────────
const CATEGORIES: { value: Category; label: string; color: string; bg: string; border: string }[] = [
    { value: 'OPEN',    label: 'Open',     color: 'text-slate-700',  bg: 'bg-slate-50',   border: 'border-slate-200' },
    { value: 'OBC_SBC', label: 'OBC/SBC',  color: 'text-amber-700',  bg: 'bg-amber-50',   border: 'border-amber-200' },
    { value: 'SC_ST',   label: 'SC/ST',    color: 'text-purple-700', bg: 'bg-purple-50',  border: 'border-purple-200' },
    { value: 'NT_VJDT', label: 'NT/VJDT',  color: 'text-rose-700',   bg: 'bg-rose-50',    border: 'border-rose-200' },
    { value: 'EWS',     label: 'EWS',      color: 'text-emerald-700',bg: 'bg-emerald-50', border: 'border-emerald-200' },
];

// ─── Main Component ───────────────────────────────────────────────────────────
const DocumentChecklist: React.FC = () => {
    const [category, setCategory]           = useState<Category | null>(null);
    const [gapApplicable, setGapApplicable] = useState<boolean | null>(null);
    const [incomeBelow8L, setIncomeBelow8L] = useState<boolean | null>(null);
    const [checkedItems, setCheckedItems]   = useState<Record<string, boolean>>({});
    const [configured, setConfigured]       = useState(false);

    // Derive filtered list based on selections
    const filteredDocs = useMemo(() => {
        if (!category) return [];
        return ALL_DOCUMENTS.filter(doc => {
            // Category must require it
            if (!doc.categories[category]) return false;
            // Income-dependent docs: only show if income below 8L
            if (doc.requiresIncomeBelowLimit && incomeBelow8L === false) return false;
            // Gap docs: only show if gap applicable
            if (doc.requiresGap && gapApplicable === false) return false;
            return true;
        });
    }, [category, gapApplicable, incomeBelow8L]);

    // Reset checked items when filtered list changes
    useEffect(() => {
        setCheckedItems({});
    }, [filteredDocs]);

    const checkedCount = Object.values(checkedItems).filter(Boolean).length;
    const progress = filteredDocs.length > 0
        ? Math.round((checkedCount / filteredDocs.length) * 100)
        : 0;

    const handleToggle = (id: string) => {
        setCheckedItems(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const canGenerate = category !== null && gapApplicable !== null && incomeBelow8L !== null;

    const activeCat = CATEGORIES.find(c => c.value === category);

    // ── STEP 1: Configuration Panel ──
    if (!configured) {
        return (
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl shadow-lg shadow-blue-200 mb-4">
                        <span className="text-3xl">📋</span>
                    </div>
                    <h1 className="text-2xl font-black text-[#020617] mb-1">Document Checker</h1>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">
                        Engineering & Pharmacy Admission · Maharashtra
                    </p>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-8">

                    {/* Step 1: Category */}
                    <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">
                            Step 1 — Select Your Category
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {CATEGORIES.map(cat => (
                                <button
                                    key={cat.value}
                                    onClick={() => setCategory(cat.value)}
                                    className={`py-3 px-4 rounded-xl border-2 font-black text-sm transition-all duration-200
                                        ${category === cat.value
                                            ? `${cat.bg} ${cat.border} ${cat.color} shadow-md scale-[1.02]`
                                            : 'bg-white border-gray-100 text-gray-500 hover:border-gray-200 hover:bg-gray-50'
                                        }`}
                                >
                                    {cat.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Step 2: Gap Year */}
                    <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">
                            Step 2 — Is Gap Year Applicable?
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            {[
                                { val: true,  label: '✅  Yes, Gap Applicable' },
                                { val: false, label: '❌  No Gap' },
                            ].map(opt => (
                                <button
                                    key={String(opt.val)}
                                    onClick={() => setGapApplicable(opt.val)}
                                    className={`py-3 px-4 rounded-xl border-2 font-bold text-sm transition-all duration-200
                                        ${gapApplicable === opt.val
                                            ? 'bg-blue-50 border-blue-300 text-blue-700 shadow-md scale-[1.02]'
                                            : 'bg-white border-gray-100 text-gray-500 hover:border-gray-200 hover:bg-gray-50'
                                        }`}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Step 3: Income */}
                    <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                            Step 3 — Is Family Income Below ₹8 Lakh / Year?
                        </label>
                        <p className="text-[10px] text-gray-400 mb-3">
                            (Required for NCL / Income / EWS / Scholarship documents)
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                            {[
                                { val: true,  label: '✅  Yes, Below ₹8L' },
                                { val: false, label: '❌  No, Above ₹8L' },
                            ].map(opt => (
                                <button
                                    key={String(opt.val)}
                                    onClick={() => setIncomeBelow8L(opt.val)}
                                    className={`py-3 px-4 rounded-xl border-2 font-bold text-sm transition-all duration-200
                                        ${incomeBelow8L === opt.val
                                            ? 'bg-blue-50 border-blue-300 text-blue-700 shadow-md scale-[1.02]'
                                            : 'bg-white border-gray-100 text-gray-500 hover:border-gray-200 hover:bg-gray-50'
                                        }`}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Generate Button */}
                    <button
                        disabled={!canGenerate}
                        onClick={() => setConfigured(true)}
                        className={`w-full py-3.5 rounded-xl font-black text-sm uppercase tracking-widest transition-all duration-300
                            ${canGenerate
                                ? 'bg-[#1e40af] text-white shadow-lg shadow-blue-200 hover:bg-[#1e3a8a] hover:-translate-y-0.5'
                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            }`}
                    >
                        {canGenerate ? '📄 Generate My Document List →' : 'Complete all 3 steps above'}
                    </button>
                </div>
            </div>
        );
    }

    // ── STEP 2: Checklist View ──
    return (
        <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-xl font-black text-[#020617]">Document Checklist</h1>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">
                        Engineering & Pharmacy · Maharashtra
                    </p>
                </div>
                <button
                    onClick={() => { setConfigured(false); setCheckedItems({}); }}
                    className="text-[10px] font-black text-[#1e40af] uppercase tracking-widest hover:underline"
                >
                    ← Change Filters
                </button>
            </div>

            {/* Active Filters */}
            <div className="flex flex-wrap gap-2 mb-5">
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${activeCat?.bg} ${activeCat?.border} ${activeCat?.color}`}>
                    {activeCat?.label}
                </span>
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border
                    ${gapApplicable ? 'bg-amber-50 border-amber-200 text-amber-700' : 'bg-gray-50 border-gray-200 text-gray-500'}`}>
                    {gapApplicable ? 'Gap Applicable' : 'No Gap'}
                </span>
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border
                    ${incomeBelow8L ? 'bg-green-50 border-green-200 text-green-700' : 'bg-gray-50 border-gray-200 text-gray-500'}`}>
                    {incomeBelow8L ? 'Income < ₹8L' : 'Income ≥ ₹8L'}
                </span>
            </div>

            {/* Progress Card */}
            <div className="bg-gradient-to-r from-[#1e40af] to-[#1d4ed8] rounded-2xl p-5 mb-6 text-white shadow-lg shadow-blue-200">
                <div className="flex justify-between items-center mb-3">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-70">Documents Ready</p>
                        <p className="text-3xl font-black">{checkedCount} <span className="text-lg opacity-60">/ {filteredDocs.length}</span></p>
                    </div>
                    <div className="text-right">
                        <p className="text-4xl font-black">{progress}%</p>
                        <p className="text-[10px] opacity-60 font-bold uppercase tracking-widest">Complete</p>
                    </div>
                </div>
                <div className="h-2.5 w-full bg-white/20 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-white rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${progress}%` }}
                    />
                </div>
                {progress === 100 && (
                    <p className="text-center text-[10px] font-black uppercase tracking-widest mt-3 animate-pulse">
                        🎉 All Documents Ready!
                    </p>
                )}
            </div>

            {/* Checklist */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {filteredDocs.map((doc, idx) => (
                    <div
                        key={doc.id}
                        onClick={() => handleToggle(doc.id)}
                        className={`flex items-center px-5 py-4 cursor-pointer transition-all duration-200 group
                            ${idx !== 0 ? 'border-t border-gray-50' : ''}
                            ${checkedItems[doc.id]
                                ? 'bg-blue-50'
                                : 'bg-white hover:bg-gray-50'
                            }`}
                    >
                        {/* Number */}
                        <span className={`text-[10px] font-black w-5 mr-3 shrink-0 ${checkedItems[doc.id] ? 'text-blue-400' : 'text-gray-300'}`}>
                            {String(idx + 1).padStart(2, '0')}
                        </span>

                        {/* Checkbox */}
                        <div className={`w-5 h-5 rounded-md flex items-center justify-center border-2 mr-4 shrink-0 transition-all duration-200
                            ${checkedItems[doc.id]
                                ? 'bg-[#1e40af] border-[#1e40af]'
                                : 'bg-white border-gray-200 group-hover:border-blue-300'
                            }`}>
                            {checkedItems[doc.id] && (
                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                </svg>
                            )}
                        </div>

                        {/* Label */}
                        <div className="flex-grow min-w-0">
                            <p className={`text-sm font-bold leading-snug transition-colors
                                ${checkedItems[doc.id] ? 'text-[#1e40af] line-through opacity-60' : 'text-gray-700'}`}>
                                {doc.label}
                            </p>
                            {doc.note && (
                                <p className="text-[9px] text-gray-400 font-medium mt-0.5">{doc.note}</p>
                            )}
                        </div>

                        {/* Status badge */}
                        <span className={`ml-3 shrink-0 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full
                            ${checkedItems[doc.id]
                                ? 'bg-blue-100 text-[#1e40af]'
                                : 'bg-gray-100 text-gray-400'
                            }`}>
                            {checkedItems[doc.id] ? '✓ Done' : 'Pending'}
                        </span>
                    </div>
                ))}
            </div>

            {/* Footer note */}
            <p className="text-[9px] text-gray-400 font-medium text-center mt-5">
                * Document requirements may vary slightly by college. Always verify with your allocated institution.
            </p>
        </div>
    );
};

export default DocumentChecklist;
