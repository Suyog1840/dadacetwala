'use client';
import React from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import Link from 'next/link';

export default function PricingPage() {

    // Check mark icon SVG
    const CheckIcon = () => (
        <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
        </svg>
    );

    return (
        <div className="bg-white min-h-screen font-sans">
            {/* Since we are inside (public), layout might already provide Navbar/Footer, 
                but user requested standalone specific UI in previous prompts so ensuring it's comprehensive.
                Wait, if I put this in (public), the root layout should handle it? 
                Actually, the user's project structure seems to have Navbar inside page.tsx in LandingPage.
                I will follow the LandingPage pattern for safety to ensure Navbar exists.
            */}
            <Navbar user={null} onLogout={() => { }} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4">
                <Link href="/" className="inline-flex items-center text-[10px] font-bold text-gray-400 hover:text-blue-600 transition-colors uppercase tracking-widest">
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                    Back to Home
                </Link>
            </div>

            <main className="max-w-5xl mx-auto px-4 sm:px-6 pb-8">

                {/* Header */}
                <div className="text-center max-w-2xl mx-auto mb-4 mt-0">
                    <h1 className="text-xl md:text-2xl font-black text-[#020617] tracking-tight mb-2">
                        Select Your Counseling Plan
                    </h1>
                    <p className="text-gray-500 font-medium text-[10px] md:text-xs leading-relaxed max-w-lg mx-auto">
                        Invest in your future with Maharashtra’s most trusted counseling team.
                        Every plan is designed to maximize your admission chances.
                    </p>
                    <div className="w-8 h-1 bg-[#1e40af] rounded-full mx-auto mt-3"></div>
                </div>

                {/* Pricing Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">

                    {/* Basic Plan */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-lg relative group h-full flex flex-col">
                        <div className="mb-3">
                            <h3 className="text-base font-black text-[#020617] mb-1">Basic</h3>
                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">For Self-Driven Aspirants</p>
                        </div>
                        <div className="mb-4">
                            <span className="text-2xl md:text-3xl font-black text-[#020617]">₹999</span>
                            <span className="text-[9px] font-bold text-gray-400 uppercase ml-1">/ One-time</span>
                        </div>
                        <div className="space-y-2 mb-4 flex-grow">
                            <div className="flex items-center text-[10px] md:text-[11px] font-medium text-gray-600"><CheckIcon /> Customized Preference List</div>
                            <div className="flex items-center text-[11px] md:text-xs font-medium text-gray-600"><CheckIcon /> Registration, Document and CAP rounds Guidance </div>
                            <div className="flex items-center text-[11px] md:text-xs font-medium text-gray-600"><CheckIcon /> College/Branch Selection Guidance</div>
                            <div className="flex items-center text-[11px] md:text-xs font-medium text-gray-600"><CheckIcon /> Whatsapp , Call Supoort</div>
                            <div className="flex items-center text-[10px] md:text-[11px] font-medium text-gray-600"><CheckIcon /> Spot round , Institutional round Guidance</div>
                        </div>
                        <Link href="/enrollment?plan=basic&price=999" className="block text-center w-full py-2.5 rounded-lg border border-gray-100 bg-gray-50 text-[#020617] text-[10px] md:text-xs font-black uppercase tracking-wider hover:bg-gray-100 transition-colors">
                            Start Basic
                        </Link>
                    </div>

                    {/* Expert Plan (Recommended) */}
                    <div className="bg-white rounded-2xl border-2 border-[#1e40af] p-5 shadow-2xl shadow-blue-900/10 relative transform md:-translate-y-2 z-10 h-full flex flex-col">
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-[#1e40af] text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg whitespace-nowrap">
                            Most Recommended
                        </div>
                        <div className="mb-3 pt-1">
                            <h3 className="text-base md:text-lg font-black text-[#020617] mb-1">Pro</h3>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Our Most Popular Choice</p>
                        </div>
                        <div className="mb-4">
                            <span className="text-3xl md:text-4xl font-black text-[#020617]">₹2,999</span>
                            <span className="text-[10px] font-bold text-gray-400 uppercase ml-1">/ One-time</span>
                        </div>
                        <div className="space-y-2 mb-5 flex-grow">

                            <div className="flex items-center text-[10px] md:text-[11px] font-bold text-[#020617]"><CheckIcon /> All Basic Plan Features</div>
                            <div className="flex items-center text-[10px] md:text-[11px] font-bold text-[#020617]"><CheckIcon /> Personal Dedicated Mentor</div>
                            <div className="flex items-center text-[10px] md:text-[11px] font-bold text-[#020617]"><CheckIcon /> Custom Preference List Design</div>
                            <div className="flex items-center text-[10px] md:text-[11px] font-bold text-[#020617]"><CheckIcon /> Option Form Filling by experts</div>
                            <div className="flex items-center text-[10px] md:text-[11px] font-bold text-[#020617]"><CheckIcon /> Unlimited Queries</div>
                        </div>
                        <Link href="/enrollment?plan=expert&price=4999" className="block text-center w-full py-2.5 rounded-lg bg-[#1e40af] text-white text-[10px] md:text-xs font-black uppercase tracking-wider hover:bg-[#1e3a8a] shadow-lg shadow-blue-900/20 transition-all transform hover:-translate-y-1">
                            Get Premium Guidance
                        </Link>
                    </div>

                    {/* VIP Plan */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-lg relative group h-full flex flex-col">
                        <div className="mb-3">
                            <h3 className="text-base font-black text-[#020617] mb-1">Premium</h3>
                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Total Peace of Mind</p>
                        </div>
                        <div className="mb-4">
                            <span className="text-2xl md:text-3xl font-black text-[#020617]">₹3,999</span>
                            <span className="text-[9px] font-bold text-gray-400 uppercase ml-1">/ One-time</span>
                        </div>
                        <div className="space-y-2 mb-4 flex-grow">
                            <div className="flex items-center text-[10px] md:text-[11px] font-medium text-gray-600"><CheckIcon /> All Basic + Pro Plan Features</div>
                            <div className="flex items-center text-[11px] md:text-xs font-medium text-gray-600"><CheckIcon /> All Rounds + Registration by Experts</div>
                            <div className="flex items-center text-[11px] md:text-xs font-medium text-gray-600"><CheckIcon />Management Quota Guidance</div>
                            <div className="flex items-center text-[11px] md:text-xs font-medium text-gray-600"><CheckIcon /> 24/7 Priority Hotline</div>
                            <div className="flex items-center text-[11px] md:text-xs font-medium text-gray-600"><CheckIcon /> Personal Offline Counselling</div>
                        </div>
                        <Link href="/enrollment?plan=vip&price=14999" className="block text-center w-full py-2.5 rounded-lg border border-gray-100 bg-gray-50 text-[#020617] text-[10px] md:text-xs font-black uppercase tracking-wider hover:bg-gray-100 transition-colors">
                            Go VIP
                        </Link>
                    </div>

                </div>
            </main>

            <Footer />
        </div>
    );
}
