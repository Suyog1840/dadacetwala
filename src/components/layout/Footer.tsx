import React from 'react';
import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-6 md:px-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-[#1e40af] rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-md shadow-blue-200/50">
                                D
                            </div>
                            <span className="text-xl font-bold tracking-tight text-[#020617]">Dada<span className="text-[#1d4ed8]">CET</span>Wala</span>
                        </div>
                        <p className="text-gray-400 text-xs leading-relaxed font-medium">
                            Your trusted companion for MHTCET counseling. We make admission processes simple, transparent, and data-driven.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-bold text-[#020617] mb-6 text-sm">Quick Links</h4>
                        <ul className="space-y-3">
                            <li><Link href="#" className="text-gray-400 hover:text-[#1d4ed8] text-xs font-medium transition-colors">College Predictor</Link></li>
                            <li><Link href="#" className="text-gray-400 hover:text-[#1d4ed8] text-xs font-medium transition-colors">Cutoff Lists</Link></li>
                            <li><Link href="#" className="text-gray-400 hover:text-[#1d4ed8] text-xs font-medium transition-colors">Fee Structures</Link></li>
                            <li><Link href="#" className="text-gray-400 hover:text-[#1d4ed8] text-xs font-medium transition-colors">Admission Docs</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-[#020617] mb-6 text-sm">Legal & Help</h4>
                        <ul className="space-y-3">
                            <li><Link href="#" className="text-gray-400 hover:text-[#1d4ed8] text-xs font-medium transition-colors">Privacy Policy</Link></li>
                            <li><Link href="#" className="text-gray-400 hover:text-[#1d4ed8] text-xs font-medium transition-colors">Terms of Service</Link></li>
                            <li><Link href="#" className="text-gray-400 hover:text-[#1d4ed8] text-xs font-medium transition-colors">Support Center</Link></li>
                            <li><Link href="#" className="text-gray-400 hover:text-[#1d4ed8] text-xs font-medium transition-colors">Contact Us</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-[#020617] mb-6 text-sm">Stay Updated</h4>
                        <div className="flex gap-4">
                            {[1, 2, 3].map((i) => (
                                <a key={i} href="#" className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-[#1e40af] hover:text-white transition-all">
                                    <div className="w-4 h-4 bg-current rounded-sm opacity-50"></div>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-gray-300 text-[10px] font-bold uppercase tracking-widest">
                        © 2024 DadaCETWala. All rights reserved.
                    </p>
                    <p className="text-gray-300 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                        Made with <span className="text-red-400">❤</span> for Students
                    </p>
                </div>
            </div>
        </footer>
    );
}
