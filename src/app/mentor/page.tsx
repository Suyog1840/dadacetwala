'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import { Heading } from '@/components/ui/Heading';
import { Subheading } from '@/components/ui/Subheading';
import { getCurrentUser } from '@/actions/user';
import { getAssignedStudents } from '@/actions/mentor';
import { PreferenceUpload } from '@/components/mentor/PreferenceUpload';
import { useRouter } from 'next/navigation';

import { SearchInput } from '@/components/ui/SearchInput';
import { FilterSelect } from '@/components/ui/FilterSelect';
import { ExportButton } from '@/components/ui/ExportButton';

import { Button } from '@/components/ui/Button';

export default function MentorPage() {
    const [user, setUser] = useState<any>(null);
    const [students, setStudents] = useState<any[]>([]); // Raw data
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    // Filters
    const [searchQuery, setSearchQuery] = useState('');
    const [filterPlan, setFilterPlan] = useState('All');
    const [filterPref, setFilterPref] = useState('All');

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
            router.push('/');
            return;
        }

        setUser(currentUser);

        const assignedStudents = await getAssignedStudents(currentUser.id);
        setStudents(assignedStudents || []);

        setIsLoading(false);
    };

    // Filter Logic
    const filteredStudents = students.filter(student => {
        // 1. Search
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            const name = (student.name || student.user?.userName || '').toLowerCase();
            const appId = (student.user?.userName || '').toLowerCase(); // appId is userName
            const email = (student.user?.email || '').toLowerCase();
            const mobile = (student.user?.contact || student.mobile || '').toLowerCase();

            const matches = name.includes(q) || appId.includes(q) || email.includes(q) || mobile.includes(q);
            if (!matches) return false;
        }

        // 2. Plan
        if (filterPlan !== 'All') {
            if (filterPlan === 'No Plan') {
                if (student.plan && student.plan !== 'N/A' && student.plan !== 'No Plan') return false;
            } else {
                if (student.plan !== filterPlan) return false;
            }
        }

        // 3. Pref List
        if (filterPref === 'Uploaded' && !student.preferenceListUrl) return false;
        if (filterPref === 'Missing' && student.preferenceListUrl) return false;

        return true;
    });

    // Options for Dropdowns
    const uniquePlans = Array.from(new Set(students.map(s => s.plan || 'No Plan'))).filter(p => p !== 'N/A' && p !== 'No Plan');
    const planOptions = [
        ...uniquePlans.map(p => ({ label: p, value: p })),
        { label: 'No Plan', value: 'No Plan' }
    ];

    const prefOptions = [
        { label: 'Uploaded', value: 'Uploaded' },
        { label: 'Missing', value: 'Missing' }
    ];

    // Export Logic
    const handleExport = () => {
        const headers = [
            'Student Name', 'App ID', 'Email', 'Mobile',
            'Plan', 'Enrolled At', 'Payment Status',
            'Preference List', 'Family Income', 'Category',
            'Domicile', 'Rank', 'Exam Type', 'CET %', 'JEE %', 'PCB %', 'Diploma %'
        ];

        const rows = filteredStudents.map(s => [
            `"${s.name || s.user?.userName || 'Unknown'}"`,
            `"${s.user?.userName || 'N/A'}"`,
            `"${s.user?.email || 'N/A'}"`,
            `"${s.user?.contact || s.mobile || 'N/A'}"`,
            `"${s.plan || 'No Plan'}"`,
            `"${s.user?.enrolledAt ? new Date(s.user.enrolledAt).toLocaleDateString() : 'N/A'}"`,
            `"${s.user?.status === 'active' ? 'Complete' : 'Not Complete'}"`,
            `"${s.preferenceListUrl ? 'Uploaded' : 'Missing'}"`,
            `"${s.familyIncome || 'N/A'}"`,
            `"${s.category || 'N/A'}"`,
            `"${s.domicileState || 'N/A'}"`,
            `"${s.rank || 'N/A'}"`,
            `"${s.examType || 'N/A'}"`,
            `"${s.cetPercentile || 'N/A'}"`,
            `"${s.jeePercentile || 'N/A'}"`,
            `"${s.pcbPercentile || 'N/A'}"`,
            `"${s.diplomaPercentage || 'N/A'}"`
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `my_students_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
    };

    return (
        <div className="min-h-screen bg-white">
            <Navbar
                user={user}
                onLogout={async () => {
                    router.push('/login');
                }}
            />

            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <Heading as="h1">Mentor Dashboard</Heading>
                        <Subheading>Manage your assigned students and their preferences.</Subheading>
                    </div>
                    <Button
                        onClick={init}
                        disabled={isLoading}
                        className="bg-[#1e40af] hover:bg-[#1e3a8a] text-white text-[10px] font-black uppercase tracking-widest px-6 py-2.5 rounded-xl shadow-lg shadow-blue-900/20 active:scale-95 transition-all"
                    >
                        {isLoading ? 'Syncing...' : 'Global Sync'}
                    </Button>
                </div>

                <div className="bg-white rounded-[1.5rem] p-6 shadow-xl border border-gray-100 overflow-hidden">
                    {/* Header & Controls */}
                    <div className="flex flex-col gap-4 mb-6">
                        <div className="flex items-center justify-between">
                            <Heading as="h3" className="mb-0.5">Assigned Students</Heading>
                            <span className="text-xs text-gray-400 font-medium">
                                Showing {filteredStudents.length} of {students.length} students
                            </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 p-2 bg-gray-50 rounded-xl border border-gray-100">
                            <SearchInput
                                onSearch={setSearchQuery}
                                placeholder="Search Name, App ID..."
                                className="w-56"
                            />
                            <div className="w-[1px] h-6 bg-gray-200 mx-1"></div>

                            <FilterSelect
                                value={filterPlan}
                                onChange={setFilterPlan}
                                options={planOptions}
                                defaultLabel="All Plans"
                            />

                            <FilterSelect
                                value={filterPref}
                                onChange={setFilterPref}
                                options={prefOptions}
                                defaultLabel="Pref List: All"
                            />

                            <div className="flex-1"></div>

                            <ExportButton onExport={handleExport} />
                        </div>
                    </div>


                    <div className="overflow-x-auto h-[600px] overflow-y-auto">
                        <table className="w-full">
                            <thead className="sticky top-0 bg-white z-10">
                                <tr className="border-b border-gray-100">
                                    <th className="text-left pb-3 pl-4 text-[8px] font-black text-gray-400 uppercase tracking-widest w-[40px]">Sr.N.</th>
                                    <th className="text-left pb-3 pl-2 text-[8px] font-black text-gray-400 uppercase tracking-widest min-w-[120px]">Student Profile</th>
                                    <th className="text-left pb-3 text-[8px] font-black text-gray-400 uppercase tracking-widest min-w-[110px]">Contact</th>
                                    <th className="text-left pb-3 text-[8px] font-black text-gray-400 uppercase tracking-widest w-[90px]">Income</th>
                                    <th className="text-left pb-3 text-[8px] font-black text-gray-400 uppercase tracking-widest w-[140px]">Category / Dom</th>
                                    <th className="text-left pb-3 text-[8px] font-black text-gray-400 uppercase tracking-widest w-[110px]">Rank</th>
                                    <th className="text-left pb-3 text-[8px] font-black text-gray-400 uppercase tracking-widest w-[170px]">Scores</th>
                                    <th className="text-left pb-3 text-[8px] font-black text-gray-400 uppercase tracking-widest w-[80px]">Plan</th>
                                    <th className="text-center pb-3 text-[8px] font-black text-gray-400 uppercase tracking-widest w-[180px]">Preference List</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {isLoading ? (
                                    <tr><td colSpan={9} className="text-center py-4 text-xs text-gray-500">Loading...</td></tr>
                                ) : filteredStudents.length === 0 ? (
                                    <tr><td colSpan={9} className="text-center py-4 text-xs text-gray-500">No students found matching filters.</td></tr>
                                ) : (
                                    filteredStudents.map((student, index) => (
                                        <tr key={student.id} className="group hover:bg-gray-50 transition-colors">
                                            <td className="py-3 pl-4 text-[9px] font-bold text-gray-400">
                                                {index + 1}
                                            </td>
                                            <td className="py-3 pl-2">
                                                <div className="flex flex-col gap-1">
                                                    <div className="font-bold text-xs text-[#020617]">{student.name || student.user?.userName || 'Unknown'}</div>
                                                    <span className="bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded text-[8px] font-bold tracking-wider w-fit">
                                                        {student.user?.userName || 'N/A'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="py-2.5">
                                                <div className="text-[10px] font-medium text-gray-600">{student.user?.contact || student.mobile || 'N/A'}</div>
                                                <div className="text-[9px] text-gray-400">{student.user?.email}</div>
                                            </td>
                                            <td className="py-2.5">
                                                <div className="text-[10px] font-medium text-gray-600">{student.familyIncome || 'N/A'}</div>
                                            </td>
                                            <td className="py-2.5">
                                                <div className="text-[10px] font-bold text-gray-700">{student.category || '-'}</div>
                                                <div className="text-[9px] text-gray-400">{student.domicileState || '-'}</div>
                                            </td>
                                            <td className="py-2.5">
                                                <div className="font-black text-xs text-[#1e40af]">#{student.rank || 'N/A'}</div>
                                                <div className="text-[8px] uppercase tracking-wider text-gray-400">{student.examType || '-'}</div>
                                            </td>
                                            <td className="py-2.5">
                                                <div className="space-y-1">
                                                    {(student.cetPercentile && student.cetPercentile > 0) ? (
                                                        <div className="text-[9px] flex items-center justify-between gap-2 w-24">
                                                            <span className="text-gray-400">MHTCET</span>
                                                            <span className="font-bold text-gray-700">{student.cetPercentile}%</span>
                                                        </div>
                                                    ) : null}
                                                    {(student.jeePercentile && student.jeePercentile > 0) ? (
                                                        <div className="text-[9px] flex items-center justify-between gap-2 w-24">
                                                            <span className="text-gray-400">JEE</span>
                                                            <span className="font-bold text-gray-700">{student.jeePercentile}%</span>
                                                        </div>
                                                    ) : null}
                                                    {(student.pcbPercentile && student.pcbPercentile > 0) ? (
                                                        <div className="text-[9px] flex items-center justify-between gap-2 w-24">
                                                            <span className="text-gray-400">NEET</span>
                                                            <span className="font-bold text-gray-700">{student.pcbPercentile}%</span>
                                                        </div>
                                                    ) : null}
                                                    {(student.diplomaPercentage && student.diplomaPercentage > 0) ? (
                                                        <div className="text-[9px] flex items-center justify-between gap-2 w-24">
                                                            <span className="text-gray-400">Diploma</span>
                                                            <span className="font-bold text-gray-700">{student.diplomaPercentage}%</span>
                                                        </div>
                                                    ) : null}
                                                    {!student.cetPercentile && !student.jeePercentile && !student.pcbPercentile && !student.diplomaPercentage && (
                                                        <span className="text-[9px] text-gray-300 italic">No scores</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="py-2.5">
                                                <span className={`inline-block px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${(!student.plan || student.plan === 'N/A' || student.plan === 'No Plan')
                                                    ? 'bg-gray-100 text-gray-500'
                                                    : 'bg-yellow-50 text-yellow-700'
                                                    }`}>
                                                    {student.plan && student.plan !== 'N/A' ? student.plan : 'No Plan'}
                                                </span>
                                            </td>
                                            <td className="py-2.5 pr-2">
                                                <div className="flex items-center justify-center gap-2">
                                                    <PreferenceUpload
                                                        studentId={student.id}
                                                        studentUserName={student.user?.userName}
                                                        currentUrl={student.preferenceListUrl}
                                                    />
                                                </div>
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
