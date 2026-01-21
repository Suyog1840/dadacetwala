import React from 'react';
import { redirect } from 'next/navigation';
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
import { getCurrentUser } from '@/actions/user';
import { getNotices } from '@/actions/notice';


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

export default async function StudentDashboardPage() {
    // Server-side data fetching
    const userPromise = getCurrentUser();
    const noticesPromise = getNotices(10); // Fetch top 10

    const [user, notices] = await Promise.all([userPromise, noticesPromise]);

    // Map notices to UpdateItems
    const mappedUpdates = notices.map((n: any) => ({
        id: n.id,
        date: n.date, // or use createdAt formatted
        title: n.title,
        description: n.description,
        type: (n.priority === 'Urgent' || n.priority === 'Important') ? 'alert' : 'info',
        attachmentUrl: n.attachmentUrl
    }));

    // Prepare display data
    const displayName = user?.userName || user?.email?.split('@')[0] || STUDENT_DATA.name;
    const displayAppId = STUDENT_DATA.appId; // Fallback or real ID if available in DB later
    const isEnrolled = user?.isEnrolled ?? STUDENT_DATA.isEnrolled;

    return (
        <div className="space-y-6">
            <ProfileHeader
                name={displayName}
                appId={displayAppId}
                isEnrolled={isEnrolled}
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
                    {/* Pass real mapped updates casted to any to bypass strict type check if ids mismatch (string vs number) */}
                    <UpdateCard updates={mappedUpdates as any} />
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
