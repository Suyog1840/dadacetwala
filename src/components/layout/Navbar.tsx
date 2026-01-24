'use client';

import React, { useState, useEffect } from "react";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User } from "@/types";
import { supabase } from "@/lib/supabaseClient";

interface NavbarProps {
    user: User | null;
    onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user: initialUser, onLogout }) => {
    const router = useRouter();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [user, setUser] = useState<User | null>(initialUser);

    useEffect(() => {
        // If initialUser is provided, use it. Otherwise fetch.
        if (initialUser) {
            setUser(initialUser);
            return;
        }

        const getUser = async () => {
            try {
                // Dynamically import the server action to avoid build issues in some setups, or just import at top if 'use client' allows 
                // (Next.js allows importing Server Actions in Client Components)
                const { getCurrentUser } = await import('@/actions/user');
                const userData = await getCurrentUser();
                if (userData) {
                    setUser({
                        name: userData.userName || userData.email?.split('@')[0] || 'User',
                        email: userData.email || '',
                        role: (userData.role as any) || 'unenrolled'
                    });
                }
            } catch (error) {
                console.error("Failed to fetch user:", error);
            }
        };
        getUser();
    }, [initialUser]);

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            setUser(null);
            if (onLogout) onLogout();
            router.push('/');
            router.refresh();
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
                        <div className="w-8 h-8 bg-[#1e40af] rounded-lg flex items-center justify-center font-black text-white shadow-md shadow-blue-100 text-base">
                            D
                        </div>
                        <span className="text-lg font-extrabold tracking-tight text-[#02042b]">
                            Dada<span className="text-[#1e40af]">CET</span>Wala
                        </span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-6 lg:gap-8">
                        <a href="#" className="text-gray-500 hover:text-[#1e40af] transition-colors text-[10px] font-black uppercase tracking-widest">Predictor</a>
                        <Link href="/student/colleges" className="text-gray-500 hover:text-[#1e40af] transition-colors text-[10px] font-black uppercase tracking-widest">Colleges</Link>
                        <Link href="/student/fees" className="text-gray-500 hover:text-[#1e40af] transition-colors text-[10px] font-black uppercase tracking-widest">Fees</Link>
                        <Link href="/student/documents" className="text-gray-500 hover:text-[#1e40af] transition-colors text-[10px] font-black uppercase tracking-widest">Docs</Link>

                        <div className="h-4 w-[1px] bg-gray-100 mx-1"></div>

                        <div className="flex items-center gap-3">
                            <a href="tel:+910000000000" className="flex items-center gap-2 text-gray-500 hover:text-[#02042b] transition-colors">
                                <div className="w-7 h-7 bg-gray-50 rounded-lg flex items-center justify-center">
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                                </div>
                            </a>
                            <a href="https://wa.me/910000000000" className="flex items-center gap-2 text-gray-500 hover:text-[#25d366] transition-colors">
                                <div className="w-7 h-7 bg-green-50 rounded-lg flex items-center justify-center text-[#25d366]">
                                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                                </div>
                            </a>
                        </div>

                        <div className="h-4 w-[1px] bg-gray-100 mx-1"></div>

                        {user ? (
                            <div className="flex items-center gap-5">
                                <Link
                                    href={user.role === 'admin' || user.role === 'super_admin' ? '/admin' : user.role === 'mentor' ? '/mentor' : '/student/dashboard'}
                                    className="flex flex-col items-end hover:opacity-80 transition-opacity cursor-pointer"
                                >
                                    <span className="text-xs font-bold text-[#02042b]">{user.name}</span>
                                    {user.role === 'unenrolled' && (
                                        <span className="text-[8px] font-black text-blue-500 uppercase tracking-widest border border-blue-100 bg-blue-50 px-1.5 py-0.5 rounded">Unenrolled</span>
                                    )}
                                </Link>
                                <button onClick={handleLogout} className="bg-gray-50 hover:bg-gray-100 text-gray-500 px-4 py-2 rounded-lg text-[10px] font-bold transition-all border border-gray-100">Logout</button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                {/* Login Button */}
                                <Link href="/login" className="bg-[#1e40af] px-6 py-2 rounded-lg text-[10px] font-bold text-white hover:bg-blue-800 transition-all uppercase tracking-widest shadow-lg shadow-blue-50">
                                    Login
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu & Actions */}
                    <div className="flex md:hidden items-center gap-3">
                        {/* Call */}
                        <a href="tel:+910000000000" className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center text-gray-600 border border-gray-100">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                        </a>
                        {/* WhatsApp */}
                        <a href="https://wa.me/910000000000" className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center text-[#25d366] border border-green-100">
                            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                        </a>

                        {/* Login Button (Icon on mobile) */}
                        {user ? (
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-[#1e40af] text-xs font-bold ring-2 ring-white">
                                {(user.name || 'U')[0]}
                            </div>
                        ) : (
                            <Link href="/login" className="bg-[#1e40af] text-white px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider shadow-sm">
                                Login
                            </Link>
                        )}

                        {/* Hamburger Menu */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="ml-1 w-8 h-8 flex items-center justify-center text-gray-700"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {isMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {isMenuOpen && (
                <div className="md:hidden border-t border-gray-100 bg-white absolute top-16 left-0 right-0 shadow-lg py-4 px-6 flex flex-col gap-4 animate-fade-in-down z-40">
                    <a href="#" className="flex items-center gap-3 py-2 text-sm font-bold text-gray-600 hover:text-[#1e40af] transition-colors">
                        <span>📊</span> Predictor
                    </a>
                    <Link href="/student/colleges" className="flex items-center gap-3 py-2 text-sm font-bold text-gray-600 hover:text-[#1e40af] transition-colors">
                        <span>🏛️</span> Colleges
                    </Link>
                    <Link href="/student/fees" className="flex items-center gap-3 py-2 text-sm font-bold text-gray-600 hover:text-[#1e40af] transition-colors">
                        <span>💰</span> Fees
                    </Link>
                    <Link href="/student/documents" className="flex items-center gap-3 py-2 text-sm font-bold text-gray-600 hover:text-[#1e40af] transition-colors">
                        <span>📄</span> Documents
                    </Link>

                    {user && (
                        <button onClick={handleLogout} className="mt-2 w-full text-center bg-gray-50 text-gray-600 py-2 rounded-lg text-xs font-bold border border-gray-100">
                            Logout
                        </button>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
