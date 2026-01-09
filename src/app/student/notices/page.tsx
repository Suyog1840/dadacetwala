'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function NoticesPage() {
    return (
        <div className="space-y-6">
            <div className="mb-4">
                <Link href="/student/dashboard">
                    <button className="flex items-center text-[10px] font-bold text-gray-400 hover:text-[#1e40af] uppercase tracking-widest transition-colors">
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                        Back to Dashboard
                    </button>
                </Link>
            </div>

            <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8 text-center">
                <h2 className="text-xl font-black text-[#020617] mb-4">Official Notices</h2>
                <p className="text-sm text-gray-500">No new notices at this time.</p>
            </div>
        </div>
    );
}
