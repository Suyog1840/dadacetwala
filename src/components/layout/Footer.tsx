import React from 'react';
import Link from 'next/link';
//This is the footer
//This is new change
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
                            {/* Instagram */}
                            <a href="https://www.instagram.com/dadacetwala/" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg flex items-center justify-center text-white bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 shadow-md shadow-purple-200 hover:scale-105 transition-all">
                                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                </svg>
                            </a>

                            {/* YouTube */}
                            <a href="https://www.youtube.com/@dadacetwala" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg flex items-center justify-center text-white bg-[#FF0000] shadow-md shadow-red-200 hover:scale-105 transition-all">
                                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                    <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                                </svg>
                            </a>

                            {/* X (Twitter) */}
                            <a href="https://x.com/dadacetwala" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg flex items-center justify-center text-white bg-black shadow-md shadow-gray-200 hover:scale-105 transition-all">
                                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                </svg>
                            </a>
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
