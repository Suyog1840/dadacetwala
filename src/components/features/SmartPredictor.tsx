'use client';

import React, { useState, useTransition } from 'react';
import { getPredictions, PredictorInput, PredictionResult } from '../../app/actions/predictor';
const optionsData = {
    "categories": [
        "OPEN", "OBC", "SC", "ST", "SEBC", "NT2", "VJ", "NT1", "NT3"
    ],
    "districts": [
        "Pune", "Mumbai", "Nagpur", "Kolhapur", "Nashik", "Amravati", "Solapur", "Sangli", "Jalgaon", "Thane", "Ahilyanagar", "Nanded", "Satara", "Buldhana", "Raigad", "Yavatmal", "Dhule", "Chandrapur", "Palghar", "Ratnagiri", "Sindhudurg", "Dharashiv", "Beed", "Akola", "Andheri", "Wardha", "Latur", "Bhandara", "Jalna", "Washim", "Nandurbar", "Parbhani", "Chhatrapati Sambhajinagar"
    ],
    "homeUniversities": [
        "Autonomous Institute", "Savitribai Phule Pune University", "Mumbai University", "Sant Gadge Baba Amravati University", "Shivaji University", "Rashtrasant Tukadoji Maharaj Nagpur University", "Dr. Babasaheb Ambedkar Marathwada University", "Punyashlok Ahilyadevi Holkar Solapur University", "Kavayitri Bahinabai Chaudhari North Maharashtra University, Jalgaon", "Swami Ramanand Teerth Marathwada University, Nanded", "Gondwana University", "Dr. Babasaheb Ambedkar Technological University,Lonere"
    ],
    "branches": [
        "Computer Engineering", "Electronics and Telecommunication Engg", "Mechanical Engineering", "Civil Engineering", "Information Technology", "Computer Science and Engineering", "Electrical Engineering", "Artificial Intelligence and Data Science", "Computer Science and Engineering(Artificial Intelligence and Machine Learning)", "Artificial Intelligence (AI) and Data Science", "Chemical Engineering", "Computer Science and Engineering(Data Science)", "Electronics and Computer Engineering", "Artificial Intelligence and Machine Learning", "Automation and Robotics", "Electronics and Computer Science", "Electronics Engineering", "Mechatronics Engineering", "Instrumentation Engineering", "Computer Science and Engineering (Internet of Things and Cyber Security Including Block Chain", "Computer Science and Design", "Instrumentation and Control Engineering", "Robotics and Automation", "Computer Science and Engineering (Artificial Intelligence)", "Bio Technology", "Electrical Engg[Electronics and Power]", "Electronics and Communication Engineering", "Computer Science and Business Systems", "Food Technology", "Aeronautical Engineering", "Textile Technology", "Electronics Engineering ( VLSI Design and Technology)", "Artificial Intelligence", "Computer Science", "Bio Medical Engineering", "Computer Technology", "Computer Science and Engineering (Cyber Security)", "Computer Science and Engineering(Cyber Security)", "Computer Engineering (Software Engineering)", "Computer Science and Engineering (IoT)", "Automobile Engineering", "Computer Science and Information Technology", "Electronics and Communication(Advanced Communication Technology)", "Metallurgy and Material Technology", "Production Engineering", "Manufacturing Science and Engineering", "Data Science", "Industrial IoT", "Civil and Environmental Engineering", "Production Engineering[Sandwich]", "Structural Engineering", "Robotics and Artificial Intelligence", "Mechanical & Automation Engineering", "Textile Chemistry", "Mining Engineering", "Agricultural Engineering", "Surface Coating Technology", "Mechanical and Mechatronics Engineering (Additive Manufacturing)", "Electrical and Electronics Engineering", "Fibres and Textile Processing Technology", "Computer Science and Technology", "Cyber Security", "Petro Chemical Engineering", "Plastic and Polymer Engineering", "Dyestuff Technology", "Fashion Technology", "Man Made Textile Technology", "Pharmaceuticals Chemistry and Technology", "Food Engineering and Technology", "Electrical and Computer Engineering", "Polymer Engineering and Technology", "Paper and Pulp Technology", "Civil and infrastructure Engineering", "Electronics and Communication (Advanced Communication Technology)", "Oil,Oleochemicals and Surfactants Technology", "Electronics and\nTelecommunication Engg", "Internet of Things (IoT)", "Electrical and Computer", "Technical Textiles", "Mechanical Engineering[Sandwich]", "Computer Science and Engineering (Artificial Intelligence and Data Science)", "Food Technology And Management", "5G", "Computer Science and\nEngineering", "Oil Technology", "Paints Technology", "Pharmaceutical and Fine Chemical Technology", "Plastic Technology", "Petro Chemical Technology", "Oil Fats and Waxes Technology", "Textile Engineering / Technology", "VLSI", "Electrical Engg [Electrical and Power]", "Mechanical Engineering Automobile", "Data Engineering", "Oil and Paints Technology", "Plastic and Polymer Technology", "Textile Plant Engineering", "Printing Technology", "Mechanical and Automation Engineering", "Civil Engineering and Planning", "Electronics and Biomedical Engineering", "Printing and Packing Technology", "Instrumentation and\nControl Engineering", "Electrical, Electronics and Power", "Civil Engineering with Computer Application", "Artificial Intelligence and\nMachine Learning", "Food Engineering", "Electronics & Telecommunication Engineering", "MECHANICAL AND RAIL ENGINEERING", "Electronics and Computer\nEngineering", "Computer Science and\nEngineering (Artificial", "Safety and Fire Engineering", "Computer Science and\nEngineering(Artificial"
    ]
};

// Ensure TFWS is included in categories
const CATEGORIES = optionsData.categories.includes("TFWS")
    ? optionsData.categories
    : [...optionsData.categories, "TFWS"];

const GENDERS = ["Male", "Female", "Other"];
const UNIVERSITIES = optionsData.homeUniversities || [];
const BRANCHES = optionsData.branches || [];
const DISTRICTS = optionsData.districts || [];

export const SmartPredictor: React.FC = () => {
    const [isPending, startTransition] = useTransition();
    const [step, setStep] = useState<'form' | 'results'>('form');
    const [error, setError] = useState<string | null>(null);
    const [results, setResults] = useState<PredictionResult[]>([]);

    // Form State
    const [mhtcet, setMhtcet] = useState('');
    const [jee, setJee] = useState('');
    const [category, setCategory] = useState(CATEGORIES[0]);
    const [gender, setGender] = useState(GENDERS[0]);
    const [homeUniversity, setHomeUniversity] = useState(UNIVERSITIES[0] || '');
    const [branchPreference, setBranchPreference] = useState<string[]>([]);
    const [districtPreference, setDistrictPreference] = useState<string[]>([]);

    const handleSelectMulti = (
        e: React.ChangeEvent<HTMLSelectElement>,
        setter: React.Dispatch<React.SetStateAction<string[]>>
    ) => {
        const values = Array.from(e.target.selectedOptions, option => option.value);
        setter(values);
    };

    const handlePredict = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        const mhtcetNum = parseFloat(mhtcet);
        const jeeNum = parseFloat(jee);

        if (isNaN(mhtcetNum) && isNaN(jeeNum)) {
            setError("Please enter at least one score (MHTCET or JEE).");
            return;
        }

        const data: PredictorInput = {
            scores: {},
            category,
            gender,
            homeUniversity,
            branchPreference,
            districtPreference
        };

        if (!isNaN(mhtcetNum)) data.scores.MHTCET = mhtcetNum;
        if (!isNaN(jeeNum)) data.scores.JEE = jeeNum;

        startTransition(async () => {
            const res = await getPredictions(data);
            if (res.success && res.results) {
                setResults(res.results);
                setStep('results');
            } else {
                setError(res.error || "Failed to fetch predictions. Please try again.");
            }
        });
    };

    const renderForm = () => (
        <form onSubmit={handlePredict} className="bg-white/80 backdrop-blur-md rounded-[2rem] p-8 md:p-10 shadow-xl shadow-[#1e40af]/5 border border-white relative z-10 w-full text-left">
            <h3 className="text-2xl font-black text-[#020617] mb-2 text-center">Find Your Best Matches</h3>
            <p className="text-gray-400 text-sm font-medium text-center mb-8">Enter your details to generate personalized AI predictions.</p>

            {error && (
                <div className="mb-6 p-4 bg-red-50/50 border border-red-100 rounded-xl text-red-600 text-sm font-medium text-center">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Scores */}
                <div className="space-y-4 col-span-1 md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="flex flex-col">
                        <label className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">MHTCET Percentile</label>
                        <input
                            type="number"
                            step="0.01"
                            placeholder="e.g. 98.50"
                            value={mhtcet}
                            onChange={(e) => setMhtcet(e.target.value)}
                            className="h-12 bg-gray-50/50 border border-gray-200 rounded-xl px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-medium text-gray-900 placeholder-gray-400"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">JEE Percentile (Optional)</label>
                        <input
                            type="number"
                            step="0.01"
                            placeholder="e.g. 85.00"
                            value={jee}
                            onChange={(e) => setJee(e.target.value)}
                            className="h-12 bg-gray-50/50 border border-gray-200 rounded-xl px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-medium text-gray-900 placeholder-gray-400"
                        />
                    </div>
                </div>

                {/* Dropdowns */}
                <div className="flex flex-col">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Category</label>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="h-12 bg-gray-50/50 border border-gray-200 rounded-xl px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-medium text-gray-900"
                    >
                        {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                </div>

                <div className="flex flex-col">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Gender</label>
                    <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        className="h-12 bg-gray-50/50 border border-gray-200 rounded-xl px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-medium text-gray-900"
                    >
                        {GENDERS.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                </div>

                <div className="flex flex-col md:col-span-2">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Home University</label>
                    <select
                        value={homeUniversity}
                        onChange={(e) => setHomeUniversity(e.target.value)}
                        className="h-12 bg-gray-50/50 border border-gray-200 rounded-xl px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-medium text-gray-900"
                    >
                        {UNIVERSITIES.map((u: string) => <option key={u} value={u}>{u}</option>)}
                    </select>
                </div>

                {/* Multi-selects (Checkboxes) */}
                <div className="flex flex-col">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2 flex justify-between">
                        <span>Branches (Optional)</span>
                    </label>
                    <div className="h-40 bg-gray-50/50 border border-gray-200 rounded-xl p-3 overflow-y-auto custom-scrollbar flex flex-col gap-2">
                        {BRANCHES.map((b: string) => (
                            <label key={b} className="flex items-start gap-2 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    value={b}
                                    checked={branchPreference.includes(b)}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setBranchPreference(prev => [...prev, b]);
                                        } else {
                                            setBranchPreference(prev => prev.filter(item => item !== b));
                                        }
                                    }}
                                    className="mt-1 w-4 h-4 text-[#1e40af] bg-white border-gray-300 rounded focus:ring-[#1e40af] focus:ring-2 transition-all cursor-pointer"
                                />
                                <span className="text-sm font-medium text-gray-700 group-hover:text-[#1e40af] transition-colors leading-tight">
                                    {b}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2 flex justify-between">
                        <span>Districts (Optional)</span>
                    </label>
                    <div className="h-40 bg-gray-50/50 border border-gray-200 rounded-xl p-3 overflow-y-auto custom-scrollbar flex flex-col gap-2">
                        {DISTRICTS.map((d: string) => (
                            <label key={d} className="flex items-start gap-2 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    value={d}
                                    checked={districtPreference.includes(d)}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setDistrictPreference(prev => [...prev, d]);
                                        } else {
                                            setDistrictPreference(prev => prev.filter(item => item !== d));
                                        }
                                    }}
                                    className="mt-1 w-4 h-4 text-[#1e40af] bg-white border-gray-300 rounded focus:ring-[#1e40af] focus:ring-2 transition-all cursor-pointer"
                                />
                                <span className="text-sm font-medium text-gray-700 group-hover:text-[#1e40af] transition-colors leading-tight">
                                    {d}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>
            </div>

            <button
                type="submit"
                disabled={isPending}
                className="w-full h-14 bg-gradient-to-r from-[#020617] to-[#1e40af] hover:from-[#1e40af] hover:to-[#020617] text-white rounded-xl text-sm font-black shadow-xl shadow-blue-900/20 transition-all transform hover:-translate-y-1 uppercase tracking-widest flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
            >
                {isPending ? (
                    <span className="flex items-center gap-2">
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Analyzing Trends...
                    </span>
                ) : (
                    <>
                        Predict Colleges
                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    </>
                )}
            </button>
        </form>
    );

    const renderResults = () => (
        <div className="bg-white/80 backdrop-blur-md rounded-[2rem] p-6 md:p-10 shadow-xl shadow-[#1e40af]/5 border border-white relative z-10 w-full text-left">
            <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
                <div>
                    <h3 className="text-2xl font-black text-[#020617]">Your Top Matches</h3>
                    <p className="text-gray-400 text-sm font-medium">Based on your {mhtcet && `MHTCET (${mhtcet})`} {jee && `and JEE (${jee})`} scores.</p>
                </div>
                <button
                    onClick={() => setStep('form')}
                    className="h-10 px-6 bg-gray-100 hover:bg-gray-200 text-[#020617] rounded-xl text-xs font-bold transition-all flex items-center gap-2 uppercase tracking-wide"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    Edit Details
                </button>
            </div>

            {results.length === 0 ? (
                <div className="text-center py-12 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                    <div className="text-4xl mb-4">🔍</div>
                    <h4 className="text-lg font-bold text-gray-900 mb-2">No Matching Colleges Found</h4>
                    <p className="text-sm text-gray-500 max-w-sm mx-auto">Try adjusting your preferences (Branch, District) or changing your scores to see more options.</p>
                </div>
            ) : (
                <div className="space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar pr-2">
                    {results.map((res, i) => (
                        <div key={i} className="group bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-lg hover:shadow-blue-500/10 transition-all hover:border-blue-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="px-3 py-1 bg-blue-50 text-blue-700 text-[10px] font-black uppercase tracking-widest rounded-full">
                                        {res.examType} Match
                                    </span>
                                    {res.probability > 85 && (
                                        <span className="px-3 py-1 bg-green-50 text-green-700 text-[10px] font-black uppercase tracking-widest rounded-full flex items-center gap-1">
                                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                                            Safe Choice
                                        </span>
                                    )}
                                </div>
                                <h4 className="text-lg font-black text-gray-900 group-hover:text-blue-600 transition-colors leading-tight mb-1">
                                    {res.collegeName}
                                </h4>
                                <div className="text-sm font-medium text-gray-500 mb-2 flex items-center gap-2 flex-wrap">
                                    <span className="flex items-center gap-1"><svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg> {res.branchName}</span>
                                    <span className="text-gray-300">•</span>
                                    <span className="flex items-center gap-1"><svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg> {res.district}</span>
                                </div>
                            </div>

                            <div className="flex items-end justify-between md:flex-col md:items-end md:justify-center gap-2 min-w-[120px] bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                                <div className="text-left md:text-right">
                                    <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Probability</span>
                                    <span className={`text-2xl font-black ${res.probability > 80 ? 'text-green-600' : res.probability > 50 ? 'text-yellow-600' : 'text-orange-500'}`}>
                                        {res.probability}%
                                    </span>
                                </div>
                                <div className="text-left md:text-right">
                                    <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">Cutoff</span>
                                    <span className="text-sm font-bold text-gray-700">{res.standard_cutoff.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

    return (
        <section id="smart-predictor" className="py-20 bg-gray-50/30 relative overflow-hidden">
            <div className="max-w-5xl mx-auto px-6 relative z-10 flex flex-col items-center">

                {/* Section Header */}
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-black text-[#020617] tracking-tight mb-4 leading-tight">
                        Predict Your Future <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1e40af] to-purple-600">Instantly</span>
                    </h2>
                    <p className="text-sm md:text-base text-gray-500 font-medium max-w-2xl mx-auto">
                        State-of-the-art college admission algorithm powered by 5-year cut-off trends, seating patterns, and AI analysis.
                    </p>
                </div>

                <div className="w-full max-w-4xl relative">
                    {/* Background glows */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-50/50 rounded-full blur-[100px] -z-10 pointer-events-none"></div>
                    <div className="absolute -top-10 -right-10 w-64 h-64 bg-purple-100/40 rounded-full blur-3xl -z-10 pointer-events-none"></div>
                    <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-blue-100/40 rounded-full blur-3xl -z-10 pointer-events-none"></div>

                    {step === 'form' ? renderForm() : renderResults()}
                </div>
            </div>
        </section>
    );
};
