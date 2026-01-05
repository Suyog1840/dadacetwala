import React from 'react';
import DocumentChecklist from '../../../components/dashboard/DocumentChecklist';
import { Button } from '../../../components/ui/Button';
import Link from 'next/link';

export default function DocumentsPage() {
    return (
        <div className="space-y-6">
            <div className="mb-4">
                <Link href="/dashboard">
                    <button className="flex items-center text-[10px] font-bold text-gray-400 hover:text-[#1e40af] uppercase tracking-widest transition-colors">
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                        Back to Dashboard
                    </button>
                </Link>
            </div>

            <DocumentChecklist />
        </div>
    );
}
