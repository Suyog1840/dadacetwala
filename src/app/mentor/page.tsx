'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import { Heading } from '@/components/ui/Heading';
import { Subheading } from '@/components/ui/Subheading';
import { getCurrentUser } from '@/actions/user';
import { getAssignedStudents } from '@/actions/mentor';
import { PreferenceUpload } from '@/components/mentor/PreferenceUpload';
import { useRouter } from 'next/navigation';

export default function MentorPage() {
    const [user, setUser] = useState<any>(null);
    const [students, setStudents] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        init();
    }, []);

    const init = async () => {
        setIsLoading(true);
        const currentUser = await getCurrentUser();

        if (!currentUser) {
            router.push('/login');
            return;
        }

        if (currentUser.role !== 'mentor') {
            router.push('/'); // Or unauthorized page
            return;
        }

        setUser(currentUser);

        const assignedStudents = await getAssignedStudents(currentUser.id);
        setStudents(assignedStudents || []);

        setIsLoading(false);
    };

    return (
        <div className="min-h-screen bg-white">
            <Navbar
                user={user}
                onLogout={async () => {
                    // Add logout logic/action here if needed, or rely on Navbar's default
                    router.push('/login');
                }}
            />

            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="mb-8">
                    <Heading as="h1">Mentor Dashboard</Heading>
                    <Subheading>Manage your assigned students and their preferences.</Subheading>
                </div>

                <div className="bg-white rounded-[1.5rem] p-6 shadow-xl border border-gray-100 overflow-hidden">
                    <Heading as="h3" className="mb-6">Assigned Students</Heading>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-100">
                                    <th className="text-left pb-3 pl-2 text-[8px] font-black text-gray-400 uppercase tracking-widest">Student Name</th>
                                    <th className="text-left pb-3 text-[8px] font-black text-gray-400 uppercase tracking-widest">Income</th>
                                    <th className="text-left pb-3 text-[8px] font-black text-gray-400 uppercase tracking-widest">Contact</th>
                                    <th className="text-left pb-3 text-[8px] font-black text-gray-400 uppercase tracking-widest">Category / Domicile</th>
                                    <th className="text-left pb-3 text-[8px] font-black text-gray-400 uppercase tracking-widest">Rank</th>
                                    <th className="text-left pb-3 text-[8px] font-black text-gray-400 uppercase tracking-widest">Scores</th>
                                    <th className="text-right pb-3 pr-2 text-[8px] font-black text-gray-400 uppercase tracking-widest">Preference List</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {isLoading ? (
                                    <tr><td colSpan={6} className="text-center py-4 text-xs text-gray-500">Loading...</td></tr>
                                ) : students.length === 0 ? (
                                    <tr><td colSpan={6} className="text-center py-4 text-xs text-gray-500">No students assigned yet.</td></tr>
                                ) : (
                                    students.map((student) => (
                                        <tr key={student.id} className="group hover:bg-gray-50 transition-colors">
                                            <td className="py-2.5 pl-2">
                                                <div className="font-bold text-xs text-[#020617]">{student.name || student.user?.userName || 'Unknown'}</div>
                                                <div className="text-[9px] text-gray-400">ID: {student.user?.userName}</div>
                                            </td>
                                            <td className="py-2.5">
                                                <div className="text-[10px] font-medium text-gray-600">{student.familyIncome || 'N/A'}</div>
                                            </td>
                                            <td className="py-2.5">
                                                <div className="text-[10px] font-medium text-gray-600">{student.user?.contact || student.mobile || 'N/A'}</div>
                                                <div className="text-[9px] text-gray-400">{student.user?.email}</div>
                                            </td>
                                            {/* Category Column */}
                                            <td className="py-2.5">
                                                <div className="text-[10px] font-bold text-gray-700">{student.category}</div>
                                                <div className="text-[9px] text-gray-400">{student.domicileState}</div>
                                            </td>
                                            {/* Rank Column */}
                                            <td className="py-2.5">
                                                <div className="font-black text-xs text-[#1e40af]">#{student.rank || 'N/A'}</div>
                                                <div className="text-[8px] uppercase tracking-wider text-gray-400">{student.examType}</div>
                                            </td>
                                            {/* Scores Column */}
                                            <td className="py-2.5">
                                                <div className="space-y-1">
                                                    {(student.cetPercentile && student.cetPercentile > 0) && (
                                                        <div className="text-[9px] flex items-center justify-between gap-2 w-24">
                                                            <span className="text-gray-400">MHTCET</span>
                                                            <span className="font-bold text-gray-700">{student.cetPercentile}%</span>
                                                        </div>
                                                    )}
                                                    {(student.jeePercentile && student.jeePercentile > 0) && (
                                                        <div className="text-[9px] flex items-center justify-between gap-2 w-24">
                                                            <span className="text-gray-400">JEE</span>
                                                            <span className="font-bold text-gray-700">{student.jeePercentile}%</span>
                                                        </div>
                                                    )}
                                                    {(student.pcbPercentile && student.pcbPercentile > 0) && (
                                                        <div className="text-[9px] flex items-center justify-between gap-2 w-24">
                                                            <span className="text-gray-400">NEET</span>
                                                            <span className="font-bold text-gray-700">{student.pcbPercentile}%</span>
                                                        </div>
                                                    )}
                                                    {(student.diplomaPercentage && student.diplomaPercentage > 0) && (
                                                        <div className="text-[9px] flex items-center justify-between gap-2 w-24">
                                                            <span className="text-gray-400">Diploma</span>
                                                            <span className="font-bold text-gray-700">{student.diplomaPercentage}%</span>
                                                        </div>
                                                    )}
                                                    {!student.cetPercentile && !student.jeePercentile && !student.pcbPercentile && !student.diplomaPercentage && (
                                                        <span className="text-[9px] text-gray-300 italic">No scores</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="py-2.5 pr-2 text-right">
                                                <PreferenceUpload
                                                    studentId={student.id}
                                                    studentUserName={student.user?.userName}
                                                    currentUrl={null} // We could fetch check if file exists if needed
                                                />
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div >
    );
}
