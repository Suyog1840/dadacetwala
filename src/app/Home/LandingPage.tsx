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
import HeroSlider from '../../components/home/HeroSlider';

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
            <HeroSlider user={user} />

            {/* Premier Institutions Slider */}
            <div className="w-full max-w-7xl mx-auto px-6 py-10">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-6 text-center">Premier Institutions Covered</p>

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
                                        <div className="w-14 h-14 md:w-16 md:h-16 bg-white rounded-xl flex items-center justify-center border border-gray-100 group-hover:shadow-md group-hover:shadow-blue-100 transition-all p-2 grayscale group-hover:grayscale-0">
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
