'use client';

import React, { useState } from 'react';

const AdminDashboard = ({ user }) => {
    // This state is just for the UI switcher visualization from the screenshot
    const [activeUi, setActiveUi] = useState('Landing UI');

    return (
        <div className="bg-white min-h-screen font-sans selection:bg-blue-100 selection:text-blue-900">
            {/* Navbar (Sticky) */}
            <nav className="w-full bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100 transition-all">
                <div className="max-w-7xl mx-auto px-6 md:px-12 py-4 flex items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#3b82f6] rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-200/50">
                            D
                        </div>
                        <span className="text-xl font-bold tracking-tight text-[#0f172a]">
                            Dada<span className="text-[#3b82f6]">CET</span>Wala
                        </span>
                    </div>

                    {/* Nav Links */}
                    <div className="hidden md:flex items-center gap-10">
                        <a href="#" className="text-xs font-bold text-gray-400 hover:text-gray-900 uppercase tracking-widest transition-colors">Predictor</a>
                        <a href="#" className="text-xs font-bold text-gray-400 hover:text-gray-900 uppercase tracking-widest transition-colors">Colleges</a>
                        <a href="#" className="text-xs font-bold text-gray-400 hover:text-gray-900 uppercase tracking-widest transition-colors">Support</a>
                        <div className="w-px h-6 bg-gray-200 mx-2"></div>
                        <button className="bg-[#3b82f6] hover:bg-blue-600 text-white px-8 py-3 rounded-2xl text-sm font-bold shadow-xl shadow-blue-200 transition-all transform hover:-translate-y-0.5">
                            Login
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="max-w-7xl mx-auto px-6 md:px-12 pt-16 pb-32 relative">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    {/* Left Content */}
                    <div className="space-y-8 z-10">
                        <h1 className="text-5xl md:text-7xl font-extrabold text-[#0f172a] tracking-tight leading-[1.1]">
                            Unlock Your <br />
                            <span className="text-[#3b82f6]">Dream Campus</span>
                        </h1>

                        <p className="text-gray-400 text-lg md:text-xl max-w-lg leading-relaxed font-medium">
                            MHTCET counseling is complex. Our AI predictors and expert mentors simplify the process, ensuring you never miss the right college for your rank.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-5 pt-4">
                            <button className="bg-[#3b82f6] hover:bg-blue-600 text-white px-10 py-5 rounded-2xl text-base font-bold shadow-2xl shadow-blue-200 transition-all transform hover:-translate-y-1">
                                Enroll for Counseling
                            </button>
                            <button className="bg-white border text-[#0f172a] border-gray-100 hover:border-gray-200 px-10 py-5 rounded-2xl text-base font-bold transition-all hover:bg-gray-50">
                                Explore Predictor
                            </button>
                        </div>

                        {/* Social Proof */}
                        <div className="flex items-center gap-4 pt-4">
                            <div className="flex -space-x-4">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 overflow-hidden">
                                        <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="Student" className="w-full h-full object-cover" />
                                    </div>
                                ))}
                            </div>
                            <p className="text-xs font-bold text-gray-400">
                                Join <span className="text-[#0f172a] font-black">12k+</span> Successful Students
                            </p>
                        </div>
                    </div>

                    {/* Right Content - Visual Element */}
                    <div className="relative hidden lg:block">
                        {/* Abstract Blue Glow */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl -z-10"></div>

                        {/* Search Bar Mockup */}
                        <div className="bg-white p-2 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-50 max-w-md mx-auto transform rotate-[-2deg] hover:rotate-0 transition-all duration-500 cursor-default">
                            <div className="flex items-center gap-4 px-6 py-4">
                                <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-500">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                                </div>
                                <span className="text-gray-400 font-medium text-lg">University</span>
                                <div className="ml-auto w-24 h-4 bg-gray-50 rounded-full"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* UI Switcher (Bottom Left) */}
                <div className="fixed bottom-8 left-8 z-50">
                    <div className="bg-white p-1.5 rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 flex gap-1">
                        {['Landing UI', 'Student UI', 'Admin UI'].map((ui) => (
                            <button
                                key={ui}
                                onClick={() => setActiveUi(ui)}
                                className={`px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all ${activeUi === ui
                                        ? 'bg-[#3b82f6] text-white shadow-lg shadow-blue-200'
                                        : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                {ui}
                            </button>
                        ))}
                    </div>
                </div>
            </main>

            {/* Premier Institutions Section */}
            <section className="py-20 border-t border-gray-50 overflow-hidden relative">
                <div className="text-center mb-16">
                    <h3 className="text-[10px] font-black text-gray-200 uppercase tracking-[0.3em]">Premier Institutions Covered</h3>
                </div>

                {/* Marquee Container */}
                <div className="relative w-full">
                    {/* Gradient Masks */}
                    <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent z-10"></div>
                    <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent z-10"></div>

                    {/* Animated Track */}
                    <div className="flex gap-16 w-max animate-scroll" style={{
                        animation: 'scroll 40s linear infinite'
                    }}>
                        {/* Duplicate the list to create seamless loop */}
                        {[...Array(2)].map((_, listIndex) => (
                            <div key={listIndex} className="flex gap-16">
                                {['COEP', 'VJTI', 'SPIT', 'PICT', 'VIT', 'WALCHAND', 'D.J. SANGHVI', 'PCCOE'].map((college, i) => (
                                    <div key={i} className="flex flex-col items-center gap-4 group cursor-pointer opacity-30 hover:opacity-100 transition-opacity duration-300">
                                        <div className="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100 group-hover:bg-white group-hover:shadow-xl group-hover:shadow-gray-100 transition-all">
                                            {/* Placeholder Logo Icon */}
                                            <svg className="w-8 h-8 text-gray-300 group-hover:text-[#3b82f6] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                                            </svg>
                                        </div>
                                        <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest group-hover:text-[#3b82f6] transition-colors">{college}</span>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why Choose Us Section */}
            <section className="py-24 bg-white relative">
                <div className="max-w-7xl mx-auto px-6 md:px-12">
                    {/* Header */}
                    <div className="text-center mb-20">
                        <h2 className="text-4xl font-extrabold text-[#02042b] tracking-tight mb-4">Why Choose Us?</h2>
                        <div className="w-24 h-1.5 bg-[#3b82f6] rounded-full mx-auto"></div>
                    </div>

                    {/* Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {/* Card 1 */}
                        <div className="p-10 rounded-[2.5rem] border border-gray-100 bg-white hover:shadow-2xl hover:shadow-blue-50 transition-all duration-300 group text-center cursor-default">
                            <div className="w-20 h-20 mx-auto mb-8 bg-blue-50/50 rounded-3xl flex items-center justify-center text-4xl group-hover:scale-110 transition-transform duration-300 shadow-sm border border-blue-50">
                                📊
                            </div>
                            <h3 className="text-xl font-bold text-[#02042b] mb-4">AI Cutoff Analysis</h3>
                            <p className="text-gray-400 text-sm leading-relaxed font-medium">
                                Our ML model analyzes 5 years of CAP round data to give you high-accuracy predictions.
                            </p>
                        </div>

                        {/* Card 2 */}
                        <div className="p-10 rounded-[2.5rem] border border-gray-100 bg-white hover:shadow-2xl hover:shadow-blue-50 transition-all duration-300 group text-center cursor-default">
                            <div className="w-20 h-20 mx-auto mb-8 bg-orange-50/50 rounded-3xl flex items-center justify-center text-4xl group-hover:scale-110 transition-transform duration-300 shadow-sm border border-orange-50">
                                👨‍🏫
                            </div>
                            <h3 className="text-xl font-bold text-[#02042b] mb-4">Personal Mentors</h3>
                            <p className="text-gray-400 text-sm leading-relaxed font-medium">
                                Direct access to counselors who have guided thousands of students to top colleges.
                            </p>
                        </div>

                        {/* Card 3 */}
                        <div className="p-10 rounded-[2.5rem] border border-gray-100 bg-white hover:shadow-2xl hover:shadow-blue-50 transition-all duration-300 group text-center cursor-default">
                            <div className="w-20 h-20 mx-auto mb-8 bg-green-50/50 rounded-3xl flex items-center justify-center text-4xl group-hover:scale-110 transition-transform duration-300 shadow-sm border border-green-50">
                                📜
                            </div>
                            <h3 className="text-xl font-bold text-[#02042b] mb-4">Smart Preferences</h3>
                            <p className="text-gray-400 text-sm leading-relaxed font-medium">
                                We design your preference list manually based on your branch interests and location.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Smart Predictor Section */}
            <section className="py-24 bg-gray-50/50 relative">
                <div className="max-w-5xl mx-auto px-6 md:px-12">
                    <div className="bg-white rounded-[3rem] p-12 shadow-xl shadow-gray-200/50 border border-gray-100">
                        {/* Predictor Header */}
                        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-16">
                            <div>
                                <h2 className="text-3xl font-black text-[#02042b] mb-2">Smart Predictor</h2>
                                <p className="text-gray-400 font-medium">Predict your college chances based on 5-year trend analysis.</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <span className="absolute -top-3 left-4 bg-blue-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Percentile</span>
                                    <input type="text" defaultValue="98.5" className="w-32 h-14 border-2 border-gray-100 rounded-2xl text-center text-2xl font-black text-[#02042b] focus:border-[#3b82f6] focus:outline-none transition-colors" />
                                </div>
                                <button className="h-14 bg-[#3b82f6] hover:bg-blue-600 text-white px-8 rounded-2xl font-bold shadow-lg shadow-blue-200 transition-all transform hover:-translate-y-1">
                                    Find Colleges
                                </button>
                            </div>
                        </div>

                        {/* Discovery Mode Placeholder */}
                        <div className="border-2 border-dashed border-gray-200 rounded-[2.5rem] p-16 bg-gray-50/30 flex flex-col items-center justify-center text-center">
                            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center text-orange-500 mb-6 animate-pulse">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            </div>
                            <h3 className="text-lg font-black text-[#02042b] mb-2">Discovery Mode</h3>
                            <p className="text-gray-400 max-w-sm mx-auto font-medium">
                                Input your CET percentile above to see which colleges you can unlock for 2024 admissions.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-100 pt-20 pb-10">
                <div className="max-w-7xl mx-auto px-6 md:px-12">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
                        {/* Brand Column */}
                        <div className="md:col-span-2 space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-[#3b82f6] rounded-lg flex items-center justify-center text-white font-bold text-lg">D</div>
                                <span className="text-xl font-bold tracking-tight text-[#0f172a]">Dada<span className="text-[#3b82f6]">CET</span>Wala</span>
                            </div>
                            <p className="text-gray-400 text-sm leading-relaxed max-w-xs font-medium">
                                Pioneering MHTCET engineering & medical counseling in Maharashtra. Empowering students with data-driven admissions since 2018.
                            </p>
                            <div className="flex gap-4">
                                {/* Social placeholders */}
                                <div className="w-10 h-10 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors cursor-pointer flex items-center justify-center text-gray-400 hover:text-blue-500">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" /></svg>
                                </div>
                                <div className="w-10 h-10 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors cursor-pointer flex items-center justify-center text-gray-400 hover:text-blue-500">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.072 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.069-4.85.069-3.204 0-3.584-.012-4.849-.069-3.229-.148-4.771-1.664-4.919-4.919-.059-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
                                </div>
                                <div className="w-10 h-10 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors cursor-pointer flex items-center justify-center text-gray-400 hover:text-blue-500">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                                </div>
                            </div>
                        </div>

                        {/* Links Column 1 */}
                        <div>
                            <h4 className="text-[#02042b] font-black uppercase tracking-widest text-xs mb-8">Resources</h4>
                            <ul className="space-y-4">
                                <li><a href="#" className="text-gray-400 hover:text-[#3b82f6] text-sm font-bold transition-colors">Predictor Tool</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-[#3b82f6] text-sm font-bold transition-colors">Cutoff Archive</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-[#3b82f6] text-sm font-bold transition-colors">Counseling Records</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-[#3b82f6] text-sm font-bold transition-colors">Filing Guide</a></li>
                            </ul>
                        </div>

                        {/* Links Column 2 */}
                        <div>
                            <h4 className="text-[#02042b] font-black uppercase tracking-widest text-xs mb-8">Support</h4>
                            <ul className="space-y-4">
                                <li><a href="#" className="text-gray-400 hover:text-[#3b82f6] text-sm font-bold transition-colors">help@dadacetwala.com</a></li>
                                <li className="text-gray-300 text-xs font-bold pt-4">OFFICE HOURS <br /><span className="text-gray-400">Mon - Sat: 10AM - 7PM</span></li>
                            </ul>
                        </div>
                    </div>

                    {/* Bottom Bar */}
                    <div className="border-t border-gray-50 pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
                        <p className="text-gray-300 text-[10px] font-bold uppercase tracking-wider">© 2024 DadaCETWala Admissions. Licensed Professional Counselor.</p>
                        <div className="flex gap-8">
                            <a href="#" className="text-gray-300 hover:text-gray-500 text-[10px] font-bold uppercase tracking-wider transition-colors">Privacy</a>
                            <a href="#" className="text-gray-300 hover:text-gray-500 text-[10px] font-bold uppercase tracking-wider transition-colors">Terms</a>
                            <a href="#" className="text-gray-300 hover:text-gray-500 text-[10px] font-bold uppercase tracking-wider transition-colors">Contact</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default AdminDashboard;
