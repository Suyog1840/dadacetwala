'use client';


import React, { useEffect, useState } from 'react';
import ProfileHeader from '@/components/dashboard/ProfileHeader';
import Timeline from '@/components/dashboard/Timeline';
import MentorCard from '@/components/dashboard/MentorCard';
import PredictorWidget from '@/components/dashboard/PredictorWidget';
import UpdateCard from '@/components/dashboard/UpdateCard';
import DashboardDocumentWidget from '@/components/dashboard/DashboardDocumentWidget';
import QuickLinkCard from '@/components/dashboard/QuickLinkCard';
import { Button } from '@/components/ui/Button';
import { Heading } from '@/components/ui/Heading';
import Link from 'next/link';


// Mock Data (Hardcoded as requested)
const STUDENT_DATA = {
    name: 'Siddharth Malhotra',
    appId: '#CET2024-4N5RZX18W',
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

export default function StudentDashboardPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [studentData, setStudentData] = useState({
        name: STUDENT_DATA.name,
        appId: STUDENT_DATA.appId,
        isEnrolled: STUDENT_DATA.isEnrolled
    });

    useEffect(() => {
        console.log("Dashboard mounted");
        const fetchUserData = async () => {
            try {
                // Dynamically import to ensure server action usage consistency
                const { getCurrentUser } = await import('@/actions/user');
                const user = await getCurrentUser();

                if (!user) {
                    console.log("No user found, showing mock data");
                    setIsLoading(false);
                    return;
                }

                setStudentData(prev => ({
                    ...prev,
                    name: user.userName || user.email?.split('@')[0] || prev.name,
                    isEnrolled: user.isEnrolled ?? prev.isEnrolled
                }));

            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserData();
    }, []);

    if (isLoading) {
        return <div className="p-8 text-center font-bold">Loading Dashboard...</div>;
    }


    return (
        <div className="space-y-6">
            {/* DEBUG MARKER */}
            <div className="hidden">Dashboard Content Rendering</div>

            <ProfileHeader
                name={studentData.name}
                appId={studentData.appId}
                isEnrolled={studentData.isEnrolled}
            />

            <div className="lg:hidden mb-6">
                <Timeline steps={TIMELINE_STEPS} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6 order-3 lg:order-1">
                    <div className="hidden lg:block">
                        <Timeline steps={TIMELINE_STEPS} />
                    </div>

                    <PredictorWidget />

                    <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8 text-center animate-fade-in border-dashed">
                        <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                            🧭
                        </div>
                        <Heading as="h3" className="mb-2">Discovery Mode</Heading>
                        <p className="text-xs font-medium text-gray-400 max-w-sm mx-auto">
                            Input your CET percentile above to explore colleges for 2024 admissions.
                        </p>
                    </div>

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
                        <Link href="/student/documents" className="block h-full">
                            <QuickLinkCard
                                icon="📁"
                                title="Documents"
                                subtitle="Lists tailored to your category."
                            />
                        </Link>
                    </div>
                </div>

                <div className="lg:col-span-1 space-y-4 order-2 lg:order-2">
                    <UpdateCard updates={UPDATES} />
                    <MentorCard
                        name="Dada Counselor Team"
                        role="Academic Strategist"
                    />
                    <DashboardDocumentWidget />
                </div>
            </div>
        </div>
    );
}
