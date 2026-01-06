'use client';

import React, { useState } from 'react';
import Navbar from '../../components/layout/Navbar';
import { Button } from '../../components/ui/Button';
import { Heading } from '../../components/ui/Heading';
import { Subheading } from '../../components/ui/Subheading';

import { TimelineEditor } from '../../components/admin/TimelineEditor';
import { BroadcastsTab } from '../../components/admin/BroadcastsTab';
import { EnrollmentsTab } from '../../components/admin/EnrollmentsTab';
import { DocVaultTab } from '../../components/admin/DocVaultTab';

export default function AdminPage() {
    const [activeTab, setActiveTab] = useState<'broadcasts' | 'enrollments' | 'docs' | 'timeline'>('timeline');

    return (
        <div className="min-h-screen bg-white">
            {/* Top Navigation Bar */}
            <Navbar
                user={{ name: 'System Admin', role: 'admin' } as any}
                onLogout={() => console.log('Logout')}
            />

            {/* Admin Header & Tabs */}
            <div className="bg-white border-b border-gray-100 sticky top-16 z-30">
                <div className="max-w-7xl mx-auto px-6 pt-6 pb-0">

                    {/* Admin Profile & Actions */}
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-[#020617] rounded-2xl flex items-center justify-center text-white font-black text-lg shadow-lg shadow-gray-200">
                                A
                            </div>
                            <div>
                                <Heading as="h1" className="text-lg leading-tight">System Admin</Heading>
                                <Subheading>Control Terminal</Subheading>
                            </div>
                        </div>
                        <Button className="bg-[#1e40af] hover:bg-[#1e3a8a] text-white text-[10px] font-black uppercase tracking-widest px-6 py-2.5 rounded-xl shadow-lg shadow-blue-900/20">
                            Global Sync
                        </Button>
                    </div>

                    {/* Tags Navigation */}
                    <div className="flex items-center gap-8 mt-6 overflow-x-auto no-scrollbar">
                        <button
                            onClick={() => setActiveTab('broadcasts')}
                            className={`pb-4 text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'broadcasts'
                                ? 'text-[#1e40af] border-b-2 border-[#1e40af]'
                                : 'text-gray-300 hover:text-gray-500'
                                }`}
                        >
                            Broadcasts
                        </button>
                        <button
                            onClick={() => setActiveTab('enrollments')}
                            className={`pb-4 text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'enrollments'
                                ? 'text-[#1e40af] border-b-2 border-[#1e40af]'
                                : 'text-gray-300 hover:text-gray-500'
                                }`}
                        >
                            Enrollments
                        </button>
                        <button
                            onClick={() => setActiveTab('docs')}
                            className={`pb-4 text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'docs'
                                ? 'text-[#1e40af] border-b-2 border-[#1e40af]'
                                : 'text-gray-300 hover:text-gray-500'
                                }`}
                        >
                            Document Vault
                        </button>
                        <button
                            onClick={() => setActiveTab('timeline')}
                            className={`pb-4 text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'timeline'
                                ? 'text-[#1e40af] border-b-2 border-[#1e40af]'
                                : 'text-gray-300 hover:text-gray-500'
                                }`}
                        >
                            Timeline Editor
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <main className="max-w-7xl mx-auto px-6 py-8">
                {activeTab === 'broadcasts' && <BroadcastsTab />}
                {activeTab === 'enrollments' && <EnrollmentsTab />}
                {activeTab === 'docs' && <DocVaultTab />}
                {activeTab === 'timeline' && <TimelineEditor />}
            </main>
        </div>
    );
}
