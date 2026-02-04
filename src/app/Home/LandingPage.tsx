'use client';

import Link from 'next/link';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { User } from '../../types';
import { WhyChooseUs } from '../../components/features/WhyChooseUs';
import { SmartPredictor } from '../../components/features/SmartPredictor';
import { ServiceCard } from '../../components/features/ServiceCard';
import { Achievements } from '../../components/features/Achievements';
import { FAQ } from '../../components/features/FAQ';
import { PremiereResources } from '../../components/features/PremiereResources';

// Import Local Logos
import djLogo from '../../assets/dj.png';
import pccoeLogo from '../../assets/pccoe.png';
import pictLogo from '../../assets/pict.png';
import spitLogo from '../../assets/spit.png';
import vitLogo from '../../assets/vit.png';
import vjtiLogo from '../../assets/vjti.png';
import walchandLogo from '../../assets/walchand.png';
import coepLogo from '../../assets/coep.png';

interface LandingPageProps {
    user?: User | null;
}

const COLLEGES = [
    { name: 'COEP', logo: coepLogo.src },
    { name: 'VJTI', logo: vjtiLogo.src },
    { name: 'SPIT', logo: spitLogo.src },
    { name: 'PICT', logo: pictLogo.src },
    { name: 'VIT PUNE', logo: vitLogo.src },
    { name: 'WALCHAND', logo: walchandLogo.src },
    { name: 'D.J. SANGHVI', logo: djLogo.src },
    { name: 'PCCOE', logo: pccoeLogo.src }
];

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
                                    {COLLEGES.map((college, i) => (
                                        <div key={i} className="flex flex-col items-center gap-2 group cursor-pointer transition-all duration-300">
                                            <div className="w-10 h-10 md:w-16 md:h-16 bg-white rounded-xl flex items-center justify-center border border-gray-100 group-hover:shadow-md group-hover:shadow-blue-100 transition-all p-2">
                                                <img
                                                    src={college.logo}
                                                    alt={`${college.name} Logo`}
                                                    className="w-full h-full object-contain"
                                                />
                                            </div>
                                            <span className="hidden md:block text-[8px] font-black text-gray-300 uppercase tracking-widest group-hover:text-[#1e40af] transition-colors">{college.name}</span>
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
            <PremiereResources user={user} />

            {/* Achievements */}
            <Achievements />

            {/* FAQ */}
            <FAQ />

            <Footer />
        </div>
    );
};

export default LandingPage;
