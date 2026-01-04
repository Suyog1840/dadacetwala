'use client';

import Link from 'next/link';
import Navbar from '../../../components/layout/Navbar';
import Footer from '../../../components/layout/Footer';
import { User } from '../../../types';
import { WhyChooseUs } from '../../../components/features/WhyChooseUs';
import { SmartPredictor } from '../../../components/features/SmartPredictor';
import { ServiceCard } from '../../../components/features/ServiceCard';
import { Achievements } from '../../../components/features/Achievements';
import { FAQ } from '../../../components/features/FAQ';
import { PremiereResources } from '../../../components/features/PremiereResources';

interface LandingPageProps {
    user?: User | null;
}

const LandingPage: React.FC<LandingPageProps> = ({ user }) => {
    const handleLogout = () => {
        console.log("Logout clicked");
    };

    return (
        <div className="bg-white min-h-screen font-sans selection:bg-blue-100 selection:text-blue-900">
            <Navbar user={user || null} onLogout={handleLogout} />

            {/* Hero Section */}
            <main className="max-w-5xl mx-auto px-6 sm:px-8 pt-12 md:pt-16 pb-6 md:pb-10 relative min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center text-center">

                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 mb-6 animate-fade-in-up">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    <span className="text-[10px] font-bold text-blue-700 uppercase tracking-widest">2024 Slots Open</span>
                </div>

                {/* Main Heading */}
                <h1 className="text-4xl md:text-6xl font-black text-[#020617] tracking-tight leading-[1.1] mb-5">
                    Unlock Your <br />
                    <span className="text-[#1e40af]">Dream Campus</span>
                </h1>

                {/* Subtitle */}
                <p className="text-gray-500 text-sm md:text-base max-w-xl leading-relaxed font-medium mb-8">
                    MHTCET counseling simplified. Our AI predictors and expert mentors ensure you secure the best college for your rank.
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center gap-3 mb-10 w-auto">
                    <Link href="/pricing" className="w-auto min-w-[180px]">
                        <button className="w-full bg-[#1e40af] hover:bg-[#1e3a8a] text-white px-8 py-3.5 rounded-xl text-xs font-black shadow-lg shadow-blue-900/20 transition-all transform hover:-translate-y-1 uppercase tracking-wider">
                            Enroll Now
                        </button>
                    </Link>
                    <button className="w-auto bg-white border text-[#020617] border-gray-200 hover:border-gray-300 px-8 py-3.5 rounded-xl text-xs font-bold transition-all hover:bg-gray-50 min-w-[180px]">
                        Explore Predictor
                    </button>
                </div>

                {/* Social Proof */}
                <div className="flex items-center justify-center gap-4 mb-8">
                    <div className="flex -space-x-3">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 overflow-hidden shadow-sm">
                                <img src={`https://i.pravatar.cc/100?img=${i + 15}`} alt="Student" className="w-full h-full object-cover" />
                            </div>
                        ))}
                    </div>
                    <div className="flex flex-col items-start">
                        <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((s) => (
                                <svg key={s} className="w-3 h-3 text-yellow-500 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                            ))}
                        </div>
                        <p className="text-[10px] font-bold text-gray-500">
                            Join <span className="text-[#020617] font-black">12k+</span> Students
                        </p>
                    </div>
                </div>

                {/* Premier Institutions Slider */}
                <div className="w-full max-w-4xl mx-auto">
                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em] mb-4">Premier Institutions Covered</p>

                    <div className="relative w-full overflow-hidden mask-gradient">
                        {/* Gradient Masks */}
                        <div className="absolute left-0 top-0 bottom-0 w-12 md:w-24 bg-gradient-to-r from-white to-transparent z-10"></div>
                        <div className="absolute right-0 top-0 bottom-0 w-12 md:w-24 bg-gradient-to-l from-white to-transparent z-10"></div>

                        {/* Slider Track */}
                        <div className="flex gap-12 w-max animate-scroll" style={{ animation: 'scroll 30s linear infinite' }}>
                            {[...Array(2)].map((_, listIndex) => (
                                <div key={listIndex} className="flex gap-12 items-center">
                                    {['COEP', 'VJTI', 'SPIT', 'PICT', 'VIT', 'WALCHAND', 'D.J. SANGHVI', 'PCCOE'].map((college, i) => (
                                        <div key={i} className="flex flex-col items-center gap-2 group cursor-pointer opacity-40 hover:opacity-100 transition-all duration-300 grayscale hover:grayscale-0">
                                            <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-100 group-hover:bg-white group-hover:shadow-md group-hover:shadow-blue-100 transition-all">
                                                <svg className="w-5 h-5 text-gray-400 group-hover:text-[#1e40af] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                                                </svg>
                                            </div>
                                            <span className="hidden md:block text-[8px] font-black text-gray-300 uppercase tracking-widest group-hover:text-[#1e40af] transition-colors">{college}</span>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>

            {/* Why Choose Us */}
            <WhyChooseUs />

            {/* Smart Predictor */}
            <SmartPredictor />

            {/* Premiere Resources */}
            <PremiereResources />

            {/* Achievements */}
            <Achievements />

            {/* FAQ */}
            <FAQ />

            <Footer />
        </div>
    );
};

export default LandingPage;
