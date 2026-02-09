'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import heroImage from '../../assets/hero.png';
import { User } from '../../types';

const SLIDE_DURATION = 12000;

interface HeroSliderProps {
    user?: User | null;
}

export default function HeroSlider({ user }: HeroSliderProps) {
    const [currentSlide, setCurrentSlide] = useState(0);

    const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
    const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

    // Slides Data
    const slides = [
        {
            id: 1,
            type: 'person',
            title: (
                <>
                    Smart Counselling for <br />
                    <span className="text-[#1e40af]">Smart Percentiles</span>
                </>
            ),
            subtext: "Turn Your Percentile into the Best Possible College per previous years' cutoffs & live trends.",
            cta: "Enroll Now",
            ctaLink: "/pricing",
            visual: "hero",
            badges: [
                { text: "100% Allotment Rate", icon: "✅" },
                { text: "5+ Years Cutoff Analysis", icon: "📊" },
                { text: "Trusted by 1000+ Students", icon: "🎓" }
            ]
        },
        {
            id: 2,
            type: 'tech',
            title: (
                <>
                    Not Guesswork. <br />
                    <span className="text-[#1e40af]">Pure Cutoff Science.</span>
                </>
            ),
            subtext: "We analyze branch-wise, category-wise & round-wise cutoffs to generate the best option form sequence.",
            cta: "Enroll Now",
            ctaLink: "/pricing",
            visual: "dashboard",
            badges: []
        },
        {
            id: 3,
            type: 'person',
            title: (
                <>
                    You’re Not Alone <br />
                    <span className="text-[#1e40af]">in Counselling.</span>
                </>
            ),
            subtext: "Personal 1-on-1 guidance from MHT-CET counselling experts till final admission confirmation.",
            cta: "Enroll Now",
            ctaLink: "/pricing",
            visual: "hero_alt",
            badges: [
                { text: "Dedicated Mentor", icon: "👨‍🏫" },
                { text: "Doubt Solving", icon: "💬" },
                { text: "Real Advice", icon: "💡" }
            ]
        },
        {
            id: 4,
            type: 'comparison',
            title: (
                <>
                    One Wrong Preference <br />
                    <span className="text-slate-800">Can Cost You a Year.</span>
                </>
            ),
            subtext: "We design your option form to maximize college + branch outcome, not just fill random preferences.",
            cta: "Enroll Now",
            ctaLink: "/pricing",
            visual: "comparison",
            badges: []
        },
        {
            id: 5,
            type: 'proof',
            title: (
                <>
                    They Trusted Us. <br />
                    <span className="text-[#1e40af]">They Got In.</span>
                </>
            ),
            subtext: "Students from different percentiles secured the best possible colleges.",
            cta: "Enroll Now",
            ctaLink: "/pricing",
            visual: "stories",
            badges: []
        },
        {
            id: 6,
            type: 'steps',
            title: (
                <>
                    From Percentile <br />
                    <span className="text-[#1e40af]">to College Gate.</span>
                </>
            ),
            subtext: "Complete admission support: Analysis → Prediction → Option Form → CAP Strategy.",
            cta: "Enroll Now",
            ctaLink: "/pricing",
            visual: "timeline",
            badges: []
        }
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, SLIDE_DURATION);
        return () => clearInterval(timer);
    }, [slides.length]);

    return (
        <div className="relative w-full bg-slate-50 overflow-hidden min-h-[calc(100vh-64px)] md:min-h-[600px] flex items-center border-b border-slate-200 group">
            {/* Background Decor - Razorpay Style Angled Shapes */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Right Blue Shape */}
                <div className="absolute -top-[20%] -right-[10%] w-[70vw] h-[120%] bg-[#f0f4ff] skew-x-12 rounded-bl-[100px] z-0" />
                {/* Left Accent Shape */}
                <div className="absolute top-[20%] -left-[10%] w-[400px] h-[400px] bg-blue-100/50 rounded-full blur-3xl z-0" />
            </div>

            {/* Navigation Arrows (Razorpay Style) - Left */}
            <button
                onClick={prevSlide}
                className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white rounded-full shadow-lg shadow-blue-900/10 flex items-center justify-center text-blue-600 hover:bg-blue-50 hover:scale-110 transition-all border border-blue-50 opacity-0 group-hover:opacity-100 md:opacity-100"
                aria-label="Previous Slide"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
            </button>

            {/* Navigation Arrows (Razorpay Style) - Right */}
            <button
                onClick={nextSlide}
                className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white rounded-full shadow-lg shadow-blue-900/10 flex items-center justify-center text-blue-600 hover:bg-blue-50 hover:scale-110 transition-all border border-blue-50 opacity-0 group-hover:opacity-100 md:opacity-100"
                aria-label="Next Slide"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
            </button>


            <div className="max-w-7xl mx-auto px-6 sm:px-8 w-full relative z-10 py-6 md:py-12">
                <div className="flex flex-col md:flex-row items-center gap-6 lg:gap-20 h-full justify-center">

                    {/* Text Content */}
                    <div className="w-full md:w-1/2 text-left space-y-6 animate-fade-in order-1 pl-4 md:pl-8">
                        {/* Slide Indicators */}
                        <div className="flex space-x-2 mb-4">
                            {slides.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setCurrentSlide(idx)}
                                    className={`h-1.5 rounded-full transition-all duration-300 ${currentSlide === idx ? 'w-8 bg-[#1e40af]' : 'w-2 bg-slate-300 hover:bg-slate-400'
                                        }`}
                                    aria-label={`Go to slide ${idx + 1}`}
                                />
                            ))}
                        </div>

                        <h1 className="text-3xl md:text-6xl font-black text-slate-900 leading-[1.1] tracking-tight">
                            {slides[currentSlide].title}
                        </h1>

                        <p className="text-lg text-slate-600 max-w-lg leading-relaxed font-medium">
                            {slides[currentSlide].subtext}
                        </p>

                        {/* Badges for specific slides */}
                        {slides[currentSlide].badges.length > 0 && (
                            <div className="flex flex-wrap gap-3 pt-2">
                                {slides[currentSlide].badges.map((badge, i) => (
                                    <div key={i} className="flex items-center gap-2 bg-white border border-slate-200 shadow-sm px-3 py-1.5 rounded-lg">
                                        <span>{badge.icon}</span>
                                        <span className="text-xs font-bold text-slate-700">{badge.text}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="pt-4">
                            <Link href={slides[currentSlide].ctaLink}>
                                <button className="bg-[#1e40af] hover:bg-[#1e3a8a] text-white px-8 py-4 rounded-xl text-sm font-black shadow-xl shadow-blue-900/10 transition-all transform hover:-translate-y-1 flex items-center gap-2 uppercase tracking-wide">
                                    {slides[currentSlide].cta}
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </button>
                            </Link>
                        </div>
                    </div>

                    {/* Visual Content */}
                    {/* Visual Content */}
                    <div className="w-full md:w-1/2 flex justify-center items-center relative min-h-[250px] md:min-h-[400px] order-2 mt-2 md:mt-0">

                        {/* Slide 1 & 3: Person (Hero Image) */}
                        {(slides[currentSlide].visual === 'hero' || slides[currentSlide].visual === 'hero_alt') && (
                            <div className="relative w-[220px] h-[280px] md:w-[420px] md:h-[500px] transition-all duration-500 hover:scale-105">
                                {/* Geometric Backdrops */}
                                <div className="absolute top-12 right-6 w-[85%] h-[85%] bg-blue-100/80 rounded-[2rem] rotate-6 z-0"></div>
                                <div className="absolute top-12 right-6 w-[85%] h-[85%] bg-indigo-100/50 rounded-[2rem] -rotate-3 z-0"></div>

                                {/* Image Container - Adjusted Position */}
                                <div className="absolute inset-0 z-10 overflow-hidden rounded-b-[2rem]">
                                    <Image
                                        src={heroImage}
                                        alt="Expert Counsellor"
                                        className="object-contain object-bottom drop-shadow-2xl translate-y-14 scale-110 origin-bottom"
                                        fill
                                        priority
                                    />
                                </div>
                            </div>
                        )}

                        {/* Slide 2: Tech Dashboard (Results Mockup) */}
                        {slides[currentSlide].visual === 'dashboard' && (
                            <div className="relative w-full max-w-sm mx-auto bg-white rounded-2xl md:rounded-[2rem] shadow-2xl shadow-blue-900/10 p-4 md:p-6 border border-white transform transition-all duration-500 md:hover:scale-105">
                                {/* Mock Header */}
                                <div className="flex justify-between items-center mb-4 border-b border-slate-50 pb-3">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-[10px] font-bold text-blue-700">99</div>
                                        <div className="text-xs font-bold text-slate-700">Percentile Analysis</div>
                                    </div>
                                    <div className="px-2 py-0.5 bg-green-50 text-green-700 text-[9px] font-bold rounded-full border border-green-100 uppercase tracking-wide">
                                        High Probability
                                    </div>
                                </div>

                                {/* College List */}
                                <div className="space-y-2.5">
                                    {[
                                        { code: 'COEP', name: 'Pune', chance: '98%', color: 'bg-[#1e40af]' },
                                        { code: 'VJTI', name: 'Mumbai', chance: '95%', color: 'bg-slate-600' },
                                        { code: 'SPIT', name: 'Andheri', chance: '92%', color: 'bg-slate-400' }
                                    ].map((college, i) => (
                                        <div key={i} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100 hover:border-blue-100 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-white text-[10px] font-bold shadow-sm ${college.color}`}>
                                                    {college.code}
                                                </div>
                                                <div>
                                                    <div className="text-[10px] font-bold text-slate-800 leading-tight">{college.code}</div>
                                                    <div className="text-[9px] font-semibold text-slate-400">{college.name}</div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-xs font-black text-slate-700">{college.chance}</div>
                                                <div className="text-[8px] font-bold text-slate-400">CHANCE</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Trend Line Decor */}
                                <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between">
                                    <div className="text-[9px] font-semibold text-slate-400">5-Year Trend</div>
                                    <div className="flex gap-0.5 items-end h-4">
                                        {[40, 60, 45, 70, 50, 80, 65, 90].map((h, i) => (
                                            <div key={i} className="w-1 bg-blue-100 rounded-t-sm" style={{ height: `${h}%` }}></div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Slide 4: Comparison (Less Red) */}
                        {slides[currentSlide].visual === 'comparison' && (
                            <div className="flex items-center gap-4">
                                {/* Random/Manual Way - Greyed out instead of Aggressive Red */}
                                <div className="w-48 bg-slate-50 rounded-2xl p-5 border border-slate-200 shadow-sm transform -rotate-3 scale-95 opacity-60 grayscale blur-[0.5px]">
                                    <div className="text-center mb-4">
                                        <div className="inline-flex p-2.5 rounded-full bg-slate-200 text-slate-500 mb-2">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
                                        </div>
                                        <div className="text-xs font-black text-slate-500 uppercase tracking-widest">Random</div>
                                    </div>
                                    <div className="space-y-3 opacity-40">
                                        <div className="h-2 bg-slate-300 rounded w-full"></div>
                                        <div className="h-2 bg-slate-300 rounded w-3/4 mx-auto"></div>
                                        <div className="h-2 bg-slate-300 rounded w-full"></div>
                                    </div>
                                </div>

                                {/* Optimized Way */}
                                <div className="w-56 bg-white rounded-2xl p-6 border border-blue-100 shadow-2xl shadow-blue-900/10 transform rotate-3 z-10 scale-110">
                                    <div className="text-center mb-4">
                                        <div className="inline-flex p-2.5 rounded-full bg-blue-50 text-[#1e40af] mb-2 ring-4 ring-blue-50/50">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                                        </div>
                                        <div className="text-xs font-black text-slate-800 uppercase tracking-widest">Optimized</div>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3 p-2 bg-blue-50/50 rounded-lg">
                                            <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0"></div>
                                            <div className="h-2 bg-blue-200 rounded w-full"></div>
                                        </div>
                                        <div className="flex items-center gap-3 p-2 bg-blue-50/50 rounded-lg">
                                            <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0"></div>
                                            <div className="h-2 bg-blue-200 rounded w-full"></div>
                                        </div>
                                        <div className="flex items-center gap-3 p-2 bg-blue-50/50 rounded-lg">
                                            <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0"></div>
                                            <div className="h-2 bg-blue-200 rounded w-2/3"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Slide 5: Success Stories (Light Mode) */}
                        {slides[currentSlide].visual === 'stories' && (
                            <div className="grid grid-cols-2 gap-5 w-full max-w-md">
                                <div className="bg-white p-5 rounded-2xl shadow-xl shadow-slate-200/50 transform translate-y-6 border border-slate-50">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-black text-sm">AS</div>
                                        <div>
                                            <div className="text-sm font-bold text-slate-800">A. Sharma</div>
                                            <div className="text-[10px] font-semibold text-slate-400">92.3%ile</div>
                                        </div>
                                    </div>
                                    <div className="text-xs font-bold text-purple-700 bg-purple-50 py-2 px-3 rounded-lg text-center">
                                        SPIT IT Confirmed
                                    </div>
                                </div>

                                <div className="bg-white p-5 rounded-2xl shadow-xl shadow-slate-200/50 transform -translate-y-6 border border-slate-50 z-10">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center font-black text-sm">RJ</div>
                                        <div>
                                            <div className="text-sm font-bold text-slate-800">R. Joshi</div>
                                            <div className="text-[10px] font-semibold text-slate-400">88%ile</div>
                                        </div>
                                    </div>
                                    <div className="text-xs font-bold text-orange-700 bg-orange-50 py-2 px-3 rounded-lg text-center">
                                        PICT ENTC Allotted
                                    </div>
                                </div>

                                <div className="col-span-2 bg-[#1e40af] p-5 rounded-2xl shadow-lg shadow-blue-900/20 mx-6 text-white flex justify-between items-center transform -translate-y-2">
                                    <div>
                                        <div className="text-2xl font-black">1000+</div>
                                        <div className="text-[10px] font-bold opacity-80 uppercase tracking-wider">Students Placed</div>
                                    </div>
                                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Slide 6: Timeline (More Informative) */}
                        {slides[currentSlide].visual === 'timeline' && (
                            <div className="relative w-full max-w-sm pl-8">
                                <div className="space-y-4">
                                    <div className="bg-white p-4 rounded-xl shadow-md border border-slate-100 flex gap-4 items-start transform hover:scale-105 transition-transform duration-300">
                                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm shrink-0">1</div>
                                        <div>
                                            <h4 className="font-bold text-slate-800 text-sm">Percentile Analysis</h4>
                                            <p className="text-xs text-slate-500 mt-1">We analyze your rank vs previous year cutoffs.</p>
                                        </div>
                                    </div>
                                    <div className="bg-white p-4 rounded-xl shadow-lg border border-blue-100 flex gap-4 items-start transform scale-105 transition-transform duration-300 relative z-10">
                                        <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-1 h-12 bg-blue-600 rounded-full"></div>
                                        <div className="w-8 h-8 rounded-full bg-[#1e40af] text-white flex items-center justify-center font-bold text-sm shrink-0">2</div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 text-sm">College Prediction</h4>
                                            <p className="text-xs text-slate-600 mt-1">Get precise college list based on your category.</p>
                                        </div>
                                    </div>
                                    <div className="bg-white p-4 rounded-xl shadow-md border border-slate-100 flex gap-4 items-start transform hover:scale-105 transition-transform duration-300">
                                        <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold text-sm shrink-0">3</div>
                                        <div>
                                            <h4 className="font-bold text-slate-800 text-sm">Admission Secured</h4>
                                            <p className="text-xs text-slate-500 mt-1">Final allotment & document verification support.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
}
