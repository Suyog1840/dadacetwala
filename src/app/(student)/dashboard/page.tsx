import React from 'react';
import ProfileHeader from '../../../components/dashboard/ProfileHeader';
import Timeline from '../../../components/dashboard/Timeline';
import MentorCard from '../../../components/dashboard/MentorCard';
import PredictorWidget from '../../../components/dashboard/PredictorWidget';
import UpdateCard from '../../../components/dashboard/UpdateCard';
import DashboardDocumentWidget from '../../../components/dashboard/DashboardDocumentWidget';
import QuickLinkCard from '../../../components/dashboard/QuickLinkCard';
import { Button } from '../../../components/ui/Button';
import Link from 'next/link';

// Mock Data
const STUDENT_DATA = {
    name: 'Siddharth Malhotra',
    appId: '#CET2024-1',
    isEnrolled: true
};

const TIMELINE_STEPS = [
    { id: 1, label: 'Registration', date: 'Aug 10', status: 'completed' as const },
    { id: 2, label: 'Doc Verification', date: 'Aug 14', status: 'completed' as const },
    { id: 3, label: 'Merit List', date: 'Aug 22', status: 'current' as const },
    { id: 4, label: 'Option Entry', date: 'Aug 25', status: 'upcoming' as const },
    { id: 5, label: 'Seat Allotment', date: 'Sept 01', status: 'upcoming' as const },
];

const UPDATES = [
    {
        id: 1,
        date: '2024-08-20',
        title: 'Option Form Filling Started',
        description: 'The option form filling for CAP Round 1 is now live. Please submit.',
        type: 'alert' as const
    },
    {
        id: 2,
        date: '2024-08-18',
        title: 'Revised Document Verification Dates',
        description: 'SC centers have extended verification till 5 PM tomorrow.',
        type: 'alert' as const
    },
    {
        id: 3,
        date: '2024-08-15',
        title: 'Provisional Merit List Declared',
        description: 'Check your rank and report grievances if any before 5 PM.',
        type: 'info' as const
    },
    {
        id: 4,
        date: '2024-08-12',
        title: 'New College Added to Matrix',
        description: 'COEP Tech University has added 60 seats in CS branch.',
        type: 'info' as const
    },
    {
        id: 5,
        date: '2024-08-10',
        title: 'ARC Center List Updated',
        description: 'New ARC centers have been added for Pune region.',
        type: 'info' as const
    }
];

export default function DashboardPage() {
    return (
        <div className="space-y-6">
            {/* Top Section: Profile */}
            <ProfileHeader
                name={STUDENT_DATA.name}
                appId={STUDENT_DATA.appId}
                isEnrolled={STUDENT_DATA.isEnrolled}
            />

            {/* Mobile-Only Timeline (Visible only on small screens) */}
            <div className="lg:hidden mb-6">
                <Timeline steps={TIMELINE_STEPS} />
            </div>

            {/* Main Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Column (2 cols wide) - Order 3 on Mobile, Order 1 on Desktop */}
                <div className="lg:col-span-2 space-y-6 order-3 lg:order-1">
                    {/* Desktop-Only Timeline (Visible only on large screens) */}
                    <div className="hidden lg:block">
                        <Timeline steps={TIMELINE_STEPS} />
                    </div>

                    {/* Smart Predictor */}
                    <PredictorWidget />

                    {/* Discovery Mode */}
                    <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8 text-center animate-fade-in border-dashed">
                        <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                            🧭
                        </div>
                        <h3 className="text-lg font-black text-[#020617] mb-2">Discovery Mode</h3>
                        <p className="text-xs font-medium text-gray-400 max-w-sm mx-auto">
                            Input your CET percentile above to explore colleges for 2024 admissions.
                        </p>
                    </div>

                    {/* Quick Access Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <QuickLinkCard
                            icon="🏛️"
                            title="College Lists"
                            subtitle="Access government & private college lists."
                        />
                        <QuickLinkCard
                            icon="💰"
                            title="Fees Structure"
                            subtitle="Detailed tuition & fees breakdown."
                        />
                        <Link href="/documents" className="block h-full">
                            <QuickLinkCard
                                icon="📁"
                                title="Documents"
                                subtitle="Lists tailored to your category."
                            />
                        </Link>
                    </div>
                </div>

                {/* Right Column (Sidebar - 1 col wide) - Order 2 on Mobile, Order 2 on Desktop */}
                <div className="lg:col-span-1 space-y-4 order-2 lg:order-2">
                    {/* Institutional Updates */}
                    <UpdateCard updates={UPDATES} />

                    {/* Mentor Card */}
                    <MentorCard
                        name="Dr. Vinay Deshmukh"
                        role="Academic Strategist"
                    />

                    {/* Personalized Document Checklist Widget */}
                    <DashboardDocumentWidget />
                </div>
            </div>
        </div>
    );
}
